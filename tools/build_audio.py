"""Build neural-TTS audio for the generated TOEIC tests.

Reads content/test-N/p1..p4.json, synthesises per-question / per-group MP3s and
writes a manifest mapping question id -> audio url.

Voices: the whole US/UK/AU/CA pool, randomly interleaved per question/group with
a seed derived from the audio file name, so every rebuild sounds identical.
The narrator and male speakers use a male voice; answer options and female
speakers use a female voice from the same test group.
"""
import asyncio
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile

from edge_tts import Communicate
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

MALE_VOICES = [
    "en-US-AndrewNeural",
    "en-US-ChristopherNeural",
    "en-US-GuyNeural",
    "en-GB-RyanNeural",
    "en-AU-WilliamMultilingualNeural",
    "en-CA-LiamNeural",
]
FEMALE_VOICES = [
    "en-US-AriaNeural",
    "en-US-JennyNeural",
    "en-US-EmmaNeural",
    "en-GB-SoniaNeural",
    "en-AU-NatashaNeural",
    "en-CA-ClaraNeural",
]
NARRATOR_VOICE = "en-US-ChristopherNeural"
NARRATOR_RATE = "-8%"
NARRATOR_PITCH = "-3Hz"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "assets", "audio", "tests")


def pick_voices(seed):
    rng = random.Random(seed)
    male = rng.choice(MALE_VOICES)
    female = rng.choice(FEMALE_VOICES)
    male2 = rng.choice([v for v in MALE_VOICES if v != male])
    female2 = rng.choice([v for v in FEMALE_VOICES if v != female])
    talk_first = rng.random() < 0.5
    return {
        "narrator": NARRATOR_VOICE,
        "man": male,
        "man2": male2,
        "woman": female,
        "woman2": female2,
        "talk_a": female if talk_first else male,
        "talk_b": male if talk_first else female,
    }


def clean_text(text):
    text = re.sub(r"<[^>]+>", " ", str(text or ""))
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def q_number_range(title):
    return re.sub(r"Questions?\s+(\d+)\s*[-–]\s*(\d+)", r"Questions \1 through \2", title or "")


def parse_dialogue(script):
    lines = []
    for raw in str(script or "").splitlines():
        line = raw.strip()
        if not line:
            continue
        m = re.match(r"^(Man 2|Woman 2|Man|Woman|Narrator|Speaker)\s*:\s*(.+)$", line, re.I)
        if m:
            lines.append((m.group(1).lower().replace(" ", ""), m.group(2).strip()))
        elif lines:
            lines[-1] = (lines[-1][0], lines[-1][1] + " " + line)
    return lines


def option_segments(q):
    return [("woman", clean_text(opt.get("text", ""))) for opt in q.get("options", [])]


def segments_for_part1(q):
    segs = [
        ("narrator", f"Number {q['id']}."),
        ("narrator", f"Look at the picture marked number {q['id']} in your test book."),
    ]
    for opt in q.get("options", []):
        key = str(opt.get("key") or "").strip().upper()
        txt = clean_text(re.sub(r"^\s*(?:\([A-D]\)|[A-D][.)])\s*", "", str(opt.get("text") or "")))
        if key:
            segs.append(("narrator", f"{key}."))
        segs.append(("woman", txt))
    return segs


def segments_for_part2(q):
    script = str(q.get("audioScript") or "")
    first = script.split("\n")[0]
    question = clean_text(re.sub(r"^Question\s*:\s*", "", first, flags=re.I))
    return [("narrator", f"Question {q['id']}."), ("man", question)] + option_segments(q)


def group_intro_segments(q, group_questions, talk_voice):
    segs = [("narrator", q_number_range(q.get("passageTitle", "")))]
    segs.append((talk_voice, clean_text(q.get("audioScript"))))
    for gq in group_questions:
        segs.append(("narrator", f"Question {gq['id']}. {clean_text(gq.get('questionText'))}"))
    return segs


async def synth(text, voice, out_path, rate="+0%", pitch="+0Hz"):
    await Communicate(clean_text(text), voice, rate=rate, pitch=pitch).save(out_path)


def make_silence(path, seconds):
    subprocess.run(
        [FFMPEG, "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(seconds),
         "-c:a", "libmp3lame", "-q:a", "9", path],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def concat(clip_paths, out_path):
    listing = out_path + ".txt"
    with open(listing, "w", encoding="utf-8") as fh:
        for p in clip_paths:
            fh.write("file '%s'\n" % p.replace("'", "'\\''"))
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", out_path],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(listing)


async def build_test(test_no, listening_only=False):
    base = os.path.join(ROOT, "content", f"test-{test_no}")
    use_listening_dir = listening_only or not os.path.exists(os.path.join(base, "p5.json"))
    out_dir = (
        os.path.join(ROOT, "listening", "audio", f"lv1-test-{test_no:02d}")
        if use_listening_dir
        else os.path.join(AUDIO_DIR, f"test-{test_no:02d}")
    )
    url_prefix = (
        f"listening/audio/lv1-test-{test_no:02d}"
        if use_listening_dir
        else f"assets/audio/tests/test-{test_no:02d}"
    )
    os.makedirs(out_dir, exist_ok=True)
    manifest = {}
    tmpdir = tempfile.mkdtemp(prefix=f"tts{test_no}-")
    silence = os.path.join(tmpdir, "silence.mp3")
    make_silence(silence, 0.45)

    groups = {}
    for part in (3, 4):
        path = os.path.join(base, f"p{part}.json")
        if not os.path.exists(path):
            continue
        for q in json.load(open(path, encoding="utf-8")):
            groups.setdefault(q.get("audioGroup"), []).append(q)

    jobs = []
    for part in (1, 2):
        path = os.path.join(base, f"p{part}.json")
        if not os.path.exists(path):
            continue
        for q in json.load(open(path, encoding="utf-8")):
            segs = segments_for_part1(q) if part == 1 else segments_for_part2(q)
            jobs.append((f"p{part}-q{q['id']:03d}", [q["id"]], segs))

    for part in (3, 4):
        path = os.path.join(base, f"p{part}.json")
        if not os.path.exists(path):
            continue
        seen = []
        for q in json.load(open(path, encoding="utf-8")):
            g = q.get("audioGroup")
            if g in seen:
                continue
            seen.append(g)
            group_qs = groups.get(g, [q])
            if part == 3:
                segs = [("narrator", q_number_range(q.get("passageTitle", "")))]
                for speaker, text in parse_dialogue(q.get("audioScript")):
                    voice_key = speaker if speaker in ("man", "man2", "woman", "woman2") else "man"
                    segs.append((voice_key, clean_text(text)))
                for gq in group_qs:
                    segs.append(("narrator", f"Question {gq['id']}. {clean_text(gq.get('questionText'))}"))
            else:
                talk_key = "talk_a" if (len(seen) - 1) % 2 == 0 else "talk_b"
                segs = group_intro_segments(q, group_qs, talk_key)
            jobs.append((f"p{part}-g{len(seen):02d}", [x["id"] for x in group_qs], segs))

    print(f"[test {test_no}] {len(jobs)} audio files", flush=True)
    manifest_path = os.path.join(base, "audio-manifest.json")
    if os.path.exists(manifest_path):
        try:
            manifest = json.load(open(manifest_path, encoding="utf-8"))
        except Exception:  # noqa: BLE001
            manifest = {}

    for name, ids, segs in jobs:
        if not segs:
            continue
        out_path = os.path.join(out_dir, name + ".mp3")
        url = f"{url_prefix}/{name}.mp3"
        if os.path.exists(out_path) and all(str(qid) in manifest for qid in ids):
            continue
        voices = pick_voices(f"{test_no}-{name}")
        clip_paths = []
        for i, (voice_key, text) in enumerate(segs):
            if not text:
                continue
            clip = os.path.join(tmpdir, f"{name}-{i}.mp3")
            ok = False
            for attempt in range(4):
                try:
                    await synth(text, voices.get(voice_key, voices["man"]), clip)
                    ok = True
                    break
                except Exception as exc:  # noqa: BLE001
                    await asyncio.sleep(2 + attempt * 2)
                    if attempt == 3:
                        print("TTS fail", name, text[:50], exc, flush=True)
            if not ok:
                for fb in ("en-US-GuyNeural", "en-GB-RyanNeural", "en-US-AriaNeural"):
                    try:
                        await synth(text, fb, clip)
                        ok = True
                        print("TTS fallback", name, fb, flush=True)
                        break
                    except Exception:  # noqa: BLE001
                        await asyncio.sleep(1.5)
            if ok and os.path.exists(clip):
                clip_paths.append(clip)
                clip_paths.append(silence)
        if not clip_paths:
            continue
        try:
            concat(clip_paths, out_path)
        except subprocess.CalledProcessError as exc:
            print("concat fail", name, exc, flush=True)
            continue
        for qid in ids:
            manifest[str(qid)] = url
        with open(manifest_path, "w", encoding="utf-8") as fh:
            json.dump(manifest, fh, ensure_ascii=False, indent=2)
        print(f"  {name}.mp3 <- {len(clip_paths) // 2} clips ({voices['narrator']} / {voices['woman']})", flush=True)

    shutil.rmtree(tmpdir, ignore_errors=True)
    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
    print(f"[test {test_no}] manifest entries: {len(manifest)}", flush=True)
    return manifest


async def main():
    args = sys.argv[1:]
    listening_only = "--listening" in args
    tests = [int(x) for x in args if x.isdigit()] or [1, 2, 3]
    for t in tests:
        await build_test(t, listening_only=listening_only)


if __name__ == "__main__":
    asyncio.run(main())
