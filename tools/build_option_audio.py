"""Generate single-sentence MP3 files for Part 1 (options A-D) and Part 2 (question + A-C)
without reading option letter prefixes (A, B, C, D) or 'Question:'.
"""

import asyncio
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_audio import ROOT, clean_text, pick_voices, synth  # noqa: E402

CONCURRENCY = 10
FALLBACK_VOICES = ("en-US-AriaNeural", "en-US-GuyNeural", "en-GB-SoniaNeural")


def strip_option_prefix(text):
    return clean_text(re.sub(r"^\s*(?:\([A-D]\)|[A-D][\.\)])\s*", "", str(text or ""), flags=re.I))


def strip_question_prefix(text):
    return clean_text(re.sub(r"^\s*Question\s*:\s*", "", str(text or ""), flags=re.I))


def collect_jobs(test_no):
    base = os.path.join(ROOT, "content", f"test-{test_no}")
    out_dir = os.path.join(ROOT, "listening", "audio", f"lv1-test-{test_no:02d}")
    os.makedirs(out_dir, exist_ok=True)
    jobs = []

    p1_path = os.path.join(base, "p1.json")
    if os.path.exists(p1_path):
        for q in json.load(open(p1_path, encoding="utf-8")):
            voices = pick_voices(f"{test_no}-p1-q{q['id']:03d}")
            for opt in q.get("options", []):
                key = str(opt.get("key", "")).strip().lower()
                text = strip_option_prefix(opt.get("text", ""))
                if key and text:
                    jobs.append((os.path.join(out_dir, f"p1-q{q['id']:03d}-{key}.mp3"), voices["woman"], text))

    p2_path = os.path.join(base, "p2.json")
    if os.path.exists(p2_path):
        for q in json.load(open(p2_path, encoding="utf-8")):
            voices = pick_voices(f"{test_no}-p2-q{q['id']:03d}")
            first_line = (str(q.get("audioScript") or "").splitlines() or [""])[0]
            q_text = strip_question_prefix(first_line)
            if q_text:
                jobs.append((os.path.join(out_dir, f"p2-q{q['id']:03d}-q.mp3"), voices["man"], q_text))
            for opt in q.get("options", []):
                key = str(opt.get("key", "")).strip().lower()
                text = strip_option_prefix(opt.get("text", ""))
                if key and text:
                    jobs.append((os.path.join(out_dir, f"p2-q{q['id']:03d}-{key}.mp3"), voices["woman"], text))

    return jobs


async def synth_one(sem, out_path, voice, text):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        return "skipped"
    tmp_path = out_path + ".tmp"
    async with sem:
        for attempt in range(4):
            try:
                await synth(text, voice, tmp_path)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                    os.replace(tmp_path, out_path)
                    return "generated"
            except Exception:  # noqa: BLE001
                await asyncio.sleep(1.5 + attempt * 2)
        for fb in FALLBACK_VOICES:
            try:
                await synth(text, fb, tmp_path)
                if os.path.exists(tmp_path) and os.path.getsize(tmp_path) > 0:
                    os.replace(tmp_path, out_path)
                    return "generated"
            except Exception:  # noqa: BLE001
                await asyncio.sleep(1.5)
    if os.path.exists(tmp_path):
        os.remove(tmp_path)
    print("FAILED:", out_path, repr(text[:60]), flush=True)
    return "failed"


async def main():
    tests = [int(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else [1, 2, 3, 4]
    sem = asyncio.Semaphore(CONCURRENCY)
    total_failed = 0
    for test_no in tests:
        jobs = collect_jobs(test_no)
        results = await asyncio.gather(*(synth_one(sem, p, v, t) for p, v, t in jobs))
        gen = results.count("generated")
        skip = results.count("skipped")
        fail = results.count("failed")
        total_failed += fail
        print(f"[test {test_no}] total={len(jobs)} generated={gen} skipped={skip} failed={fail}", flush=True)
    if total_failed:
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
