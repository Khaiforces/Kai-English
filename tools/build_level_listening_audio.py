"""Build all 178 neural-TTS MP3 files for a leveled Listening test (listening/level-{level}/test-{NN}.js).

Reads the compiled exercises directly from listening/level-{level}/test-{NN}.js so that
shuffled option order (A/B/C/D) matches the audio 100%, and generates:
  - 6 Part 1 full-question MP3s (p1-q001..006.mp3) + 24 option MP3s (p1-q001-a..d.mp3)
  - 25 Part 2 full-question MP3s (p2-q007..031.mp3) + 100 stem/option MP3s (p2-q007-q/a/b/c.mp3)
  - 13 Part 3 conversation group MP3s (p3-g01..13.mp3)
  - 10 Part 4 talk group MP3s (p4-g01..10.mp3)

Usage:
  python tools/build_level_listening_audio.py 6 1
"""
import asyncio
import json
import os
import re
import shutil
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_audio import (  # noqa: E402
    NARRATOR_PITCH,
    NARRATOR_RATE,
    ROOT,
    clean_text,
    concat,
    make_silence,
    parse_dialogue,
    pick_voices,
    q_number_range,
    synth,
)

CONCURRENCY = 8
FALLBACK_VOICES = ("en-US-GuyNeural", "en-GB-RyanNeural", "en-US-AriaNeural")


def load_exercises(level, test_no):
    js_path = os.path.join(ROOT, "listening", f"level-{level}", f"test-{test_no:02d}.js")
    if not os.path.exists(js_path):
        raise FileNotFoundError(f"Missing {js_path}; run `node tools/build_listening_test.js {level} {test_no}` first.")
    raw = open(js_path, encoding="utf-8").read()
    m = re.search(r"D\.listeningExercises\.push\(\.\.\.(\[.*\])\);", raw, re.S)
    if not m:
        raise ValueError(f"Cannot parse exercises array from {js_path}")
    return json.loads(m.group(1))


async def synth_with_retry(sem, text, voice, out_path, rate="+0%", pitch="+0Hz"):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return True
    tmp_path = out_path + ".tmp.mp3"
    async with sem:
        for attempt in range(4):
            try:
                await synth(text, voice, tmp_path, rate=rate, pitch=pitch)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                    os.replace(tmp_path, out_path)
                    return True
            except Exception:
                await asyncio.sleep(1.5 + attempt * 1.5)
        for fb in FALLBACK_VOICES:
            try:
                await synth(text, fb, tmp_path, rate=rate, pitch=pitch)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                    os.replace(tmp_path, out_path)
                    return True
            except Exception:
                await asyncio.sleep(1.5)
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
    return False


async def build_group_clip(sem, tmpdir, silences, out_path, seed_key, segs):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return "skipped"
    voices = pick_voices(seed_key)
    clip_paths = []
    for idx, seg in enumerate(segs):
        if len(seg) == 3:
            v_key, text, pause = seg
        else:
            v_key, text = seg
            pause = 0.45
        t = clean_text(text)
        if not t:
            continue
        clip = os.path.join(tmpdir, f"{os.path.basename(out_path)}-{idx}.mp3")
        rate = NARRATOR_RATE if v_key == "narrator" else "+0%"
        pitch = NARRATOR_PITCH if v_key == "narrator" else "+0Hz"
        ok = await synth_with_retry(sem, t, voices.get(v_key, voices["man"]), clip, rate=rate, pitch=pitch)
        if ok and os.path.exists(clip):
            clip_paths.append(clip)
            if pause > 0:
                clip_paths.append(silences[pause])
    if not clip_paths:
        return "failed"
    try:
        concat(clip_paths, out_path)
        return "generated"
    except Exception as exc:
        print("concat failed:", out_path, exc, flush=True)
        return "failed"


async def build_all(level, test_no):
    exercises = load_exercises(level, test_no)
    out_dir = os.path.join(ROOT, "listening", "audio", f"lv{level}-test-{test_no:02d}")
    os.makedirs(out_dir, exist_ok=True)
    tmpdir = tempfile.mkdtemp(prefix=f"lv{level}_t{test_no}_")
    silences = {}
    for sec in (0.3, 0.45, 0.5, 0.7, 0.85):
        sp = os.path.join(tmpdir, f"sil_{sec}.mp3")
        make_silence(sp, sec)
        silences[sec] = sp
    sem = asyncio.Semaphore(CONCURRENCY)

    single_jobs = []
    multi_jobs = []

    # Part 1 & Part 2
    for ex in exercises:
        p = ex["partNumber"]
        qnum = ex.get("questionNumber") or int(re.sub(r"\D+", "", ex["id"].split("-q")[-1]))
        seed_base = f"lv{level}-t{test_no}-p{p}-q{qnum:03d}"
        voices = pick_voices(seed_base)
        if p == 1:
            segs = [
                ("narrator", f"Number {qnum}.", 0.5),
                ("narrator", f"Look at the picture marked number {qnum} in your test book.", 0.85),
            ]
            for opt in ex["practiceOptions"]:
                k = opt["key"].lower()
                txt = clean_text(opt["text"])
                segs.append(("narrator", f"{opt['key']}.", 0.3))
                segs.append(("woman", txt, 0.7))
                single_jobs.append((os.path.join(out_dir, f"p1-q{qnum:03d}-{k}.mp3"), voices["woman"], txt))
            multi_jobs.append((os.path.join(out_dir, f"p1-q{qnum:03d}.mp3"), seed_base, segs))
        elif p == 2:
            q_txt = clean_text(ex.get("questionScript") or "")
            single_jobs.append((os.path.join(out_dir, f"p2-q{qnum:03d}-q.mp3"), voices["man"], q_txt))
            segs = [
                ("narrator", f"Number {qnum}.", 0.5),
                ("man", q_txt, 0.7),
            ]
            for opt in ex["practiceOptions"]:
                k = opt["key"].lower()
                txt = clean_text(opt["text"])
                segs.append(("narrator", f"{opt['key']}.", 0.3))
                segs.append(("woman", txt, 0.7))
                single_jobs.append((os.path.join(out_dir, f"p2-q{qnum:03d}-{k}.mp3"), voices["woman"], txt))
            multi_jobs.append((os.path.join(out_dir, f"p2-q{qnum:03d}.mp3"), seed_base, segs))

    # Part 3 & Part 4 groups (3 questions per group)
    get_qnum = lambda item: item.get("questionNumber") or int(re.sub(r"\D+", "", item["id"].split("-q")[-1]))
    for p in (3, 4):
        p_items = [x for x in exercises if x["partNumber"] == p]
        for gi in range(0, len(p_items), 3):
            grp = p_items[gi : gi + 3]
            if not grp:
                continue
            g_idx = (gi // 3) + 1
            first = grp[0]
            seed_base = f"lv{level}-t{test_no}-p{p}-g{g_idx:02d}"
            q_start = get_qnum(grp[0])
            q_end = get_qnum(grp[-1])
            intro = q_number_range(first.get("passageTitle") or f"Questions {q_start} through {q_end} refer to the following {'conversation' if p == 3 else 'talk'}:")
            segs = [("narrator", intro, 0.7)]
            if p == 3:
                parsed = parse_dialogue(first.get("rawAudioScript") or first.get("fullTranscript") or first.get("audioText"))
                if parsed:
                    for spk, line in parsed:
                        v_key = spk if spk in ("man", "man2", "woman", "woman2") else "man"
                        segs.append((v_key, clean_text(line)))
                else:
                    segs.append(("man", clean_text(first.get("fullTranscript") or first.get("audioText"))))
            else:
                talk_key = "talk_a" if (g_idx - 1) % 2 == 0 else "talk_b"
                segs.append((talk_key, clean_text(first.get("fullTranscript") or first.get("audioText"))))
            for gq in grp:
                qn = get_qnum(gq)
                segs.append(("narrator", f"Number {qn}. {clean_text(gq.get('questionPrompt'))}", 0.85))
            multi_jobs.append((os.path.join(out_dir, f"p{p}-g{g_idx:02d}.mp3"), seed_base, segs))

    print(f"[lv{level}-test-{test_no:02d}] Building {len(single_jobs)} single clips + {len(multi_jobs)} full clips...", flush=True)
    single_res = await asyncio.gather(*(synth_with_retry(sem, txt, v, path) for path, v, txt in single_jobs))
    multi_res = await asyncio.gather(*(build_group_clip(sem, tmpdir, silences, path, sk, sgs) for path, sk, sgs in multi_jobs))
    shutil.rmtree(tmpdir, ignore_errors=True)

    ok_single = sum(1 for r in single_res if r)
    ok_multi = sum(1 for r in multi_res if r in ("generated", "skipped"))
    print(f"[lv{level}-test-{test_no:02d}] Done: single={ok_single}/{len(single_jobs)}, multi={ok_multi}/{len(multi_jobs)}", flush=True)
    if ok_single != len(single_jobs) or ok_multi != len(multi_jobs):
        sys.exit(1)


if __name__ == "__main__":
    lv = int(sys.argv[1]) if len(sys.argv) > 1 else 6
    tn = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    asyncio.run(build_all(lv, tn))
