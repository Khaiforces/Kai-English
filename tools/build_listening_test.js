/**
 * Sinh đề Luyện nghe theo Level từ thư mục nội dung JSON (content/listening/level-{level}/test-{NN}/p1..p4.json).
 * Không dùng hình ảnh (imageUrl = ""), gắn đầy đủ đường dẫn audio MP3 tại listening/audio/lv{level}-test-{NN}/.
 * Chạy: node tools/build_listening_test.js <level> [test...]
 *   ví dụ: node tools/build_listening_test.js 6 1
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PART_NAMES = {
  1: 'Part 1: Mô tả hình ảnh (Photographs)',
  2: 'Part 2: Hỏi - Đáp (Question - Response)',
  3: 'Part 3: Đoạn hội thoại (Short Conversations)',
  4: 'Part 4: Bài nói ngắn (Short Talks)'
};

const LEVEL_RANGES = {
  1: '300–400',
  2: '400–550',
  3: '550–700',
  4: '700–800',
  5: '800–900',
  6: '900–990'
};

function fail(msg) {
  console.error('❌ ' + msg);
  process.exit(1);
}

const pad2 = n => String(n).padStart(2, '0');
const pad3 = n => String(n).padStart(3, '0');
const cleanOptText = txt => String(txt || '').replace(/^\s*(?:\([A-D]\)|[A-D][\.\)])\s*/i, '').trim();
const cleanQuestionVi = txt => String(txt || '').replace(/^\s*(?:Hỏi|Câu hỏi|Câu trần thuật|Phát biểu|Đề nghị|Question)\s*:\s*/i, '').trim();

function makeSchedule(seedInit, keys, counts) {
  let seed = seedInit >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const pool = [];
  keys.forEach((k, i) => { for (let c = 0; c < counts[i]; c++) pool.push(k); });
  for (let attempt = 0; attempt < 300; attempt++) {
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const has3Run = arr.some((k, i) => i >= 2 && arr[i - 1] === k && arr[i - 2] === k);
    if (!has3Run) return arr;
  }
  return pool;
}

function swapExplanationLetters(explanation, curChar, targetChar) {
  if (!explanation || curChar === targetChar) return explanation;
  const protectedBefore = /(?:to[àa]|Building|Appendix|Schedule|Clause|Track|Tier|Model|Group|Part|Section|Document|Breakout|Floor|Room|Gate|Platform)\s+$/i;
  return String(explanation).replace(
    /(^|[\s.,;:(\/])([ABCD])(?=$|[\s.,;:)\/])/g,
    (match, prefix, letter, offset, fullStr) => {
      if (letter !== curChar && letter !== targetChar) return match;
      const before = fullStr.slice(Math.max(0, offset - 20), offset + prefix.length);
      if (protectedBefore.test(before)) return match;
      return prefix + (letter === curChar ? targetChar : curChar);
    }
  );
}

function buildTest(levelNum, testNum) {
  const lv = Number(levelNum);
  const num = Number(testNum);
  if (!LEVEL_RANGES[lv] || !Number.isInteger(num) || num < 1) {
    fail(`Tham số không hợp lệ: level=${levelNum}, test=${testNum}`);
  }
  const tPad2 = pad2(num);
  const contentDir = path.join(ROOT, 'content', 'listening', `level-${lv}`, `test-${tPad2}`);
  const testId = `listening-lv${lv}-test-${num}`;
  const testCode = `Test ${tPad2}`;
  const testTitle = `Đề Luyện nghe Level ${lv} (${LEVEL_RANGES[lv]}) - Test ${tPad2}`;
  const audioBase = `listening/audio/lv${lv}-test-${tPad2}`;

  const readJson = name => {
    const file = path.join(contentDir, name);
    if (!fs.existsSync(file)) fail(`Thiếu file: ${path.relative(ROOT, file)}`);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  };

  const p1 = readJson('p1.json');
  const p2 = readJson('p2.json');
  const p3 = readJson('p3.json');
  const p4 = readJson('p4.json');

  if (!Array.isArray(p1) || p1.length !== 6) fail(`p1.json phải có đúng 6 câu (đang có ${p1?.length})`);
  if (!Array.isArray(p2) || p2.length !== 25) fail(`p2.json phải có đúng 25 câu (đang có ${p2?.length})`);
  if (!Array.isArray(p3) || p3.length !== 39) fail(`p3.json phải có đúng 39 câu (đang có ${p3?.length})`);
  if (!Array.isArray(p4) || p4.length !== 30) fail(`p4.json phải có đúng 30 câu (đang có ${p4?.length})`);

  const schedP1 = makeSchedule(lv * 10000 + num * 101 + 1, ['A', 'B', 'C', 'D'], [2, 2, 1, 1]);
  const schedP2 = makeSchedule(lv * 10000 + num * 101 + 2, ['A', 'B', 'C'], [9, 8, 8]);
  const schedP3 = makeSchedule(lv * 10000 + num * 101 + 3, ['A', 'B', 'C', 'D'], [10, 10, 10, 9]);
  const schedP4 = makeSchedule(lv * 10000 + num * 101 + 4, ['A', 'B', 'C', 'D'], [7, 7, 8, 8]);

  const rawAll = [...p1, ...p2, ...p3, ...p4].sort((a, b) => Number(a.id) - Number(b.id));
  if (rawAll.length !== 100) fail(`Tổng số câu phải là 100 (đang có ${rawAll.length})`);
  for (let i = 0; i < 100; i++) {
    if (Number(rawAll[i].id) !== i + 1) fail(`Thiếu hoặc lệch câu số ${i + 1} (gặp id=${rawAll[i].id})`);
  }

  const exercises = rawAll.map(q => {
    const idNum = Number(q.id);
    const part = idNum <= 6 ? 1 : idNum <= 31 ? 2 : idNum <= 70 ? 3 : 4;
    const keys = part === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    if (!Array.isArray(q.options) || q.options.length !== keys.length) {
      fail(`Câu ${idNum} (Part ${part}): phải có đúng ${keys.length} options`);
    }
    const curKey = String(q.correct || q.answer || '').trim().toUpperCase();
    const curIdx = keys.indexOf(curKey);
    if (curIdx < 0) fail(`Câu ${idNum}: đáp án "${curKey}" không hợp lệ`);

    const targetKey = part === 1
      ? schedP1[idNum - 1]
      : part === 2
        ? schedP2[idNum - 7]
        : part === 3
          ? schedP3[idNum - 32]
          : schedP4[idNum - 71];
    const targetIdx = keys.indexOf(targetKey);

    const optObjs = q.options.map((o, idx) => {
      const text = typeof o === 'string' ? cleanOptText(o) : cleanOptText(o.text);
      return { key: keys[idx], text };
    });

    let explanation = String(q.explanation || '').trim();
    let translation = String(q.translation || '').trim();
    if (!explanation || !translation) fail(`Câu ${idNum}: thiếu translation hoặc explanation`);

    if (targetIdx !== curIdx) {
      const tmp = optObjs[curIdx].text;
      optObjs[curIdx].text = optObjs[targetIdx].text;
      optObjs[targetIdx].text = tmp;
      explanation = swapExplanationLetters(explanation, keys[curIdx], keys[targetIdx]);
      const lines = translation.split(/\r?\n/);
      const reCur = new RegExp(`^\\s*\\(${keys[curIdx]}\\)\\s*(.*)$`);
      const reTar = new RegExp(`^\\s*\\(${keys[targetIdx]}\\)\\s*(.*)$`);
      const iCur = lines.findIndex(l => reCur.test(l));
      const iTar = lines.findIndex(l => reTar.test(l));
      if (iCur >= 0 && iTar >= 0) {
        const bodyCur = lines[iCur].replace(reCur, '$1');
        const bodyTar = lines[iTar].replace(reTar, '$1');
        lines[iCur] = `(${keys[curIdx]}) ${bodyTar}`;
        lines[iTar] = `(${keys[targetIdx]}) ${bodyCur}`;
        translation = lines.join('\n');
      }
    }

    const parentVocab = (q.vocab || []).map(v => Array.isArray(v)
      ? { word: String(v[0]), meaning: String(v[2] || v[1]) }
      : { word: String(v.word), meaning: String(v.meaning) }
    );
    if (parentVocab.length < 2) fail(`Câu ${idNum}: cần ít nhất 2 mục vocab`);

    const p2QuestionScript = part === 2
      ? String(q.questionScript || String(q.audioScript || '').split(/\r?\n/)[0] || '').replace(/^\s*Question\s*:\s*/i, '').trim()
      : '';

    const fullTranscript = part === 1
      ? optObjs[targetIdx].text
      : part === 2
        ? `Question: ${p2QuestionScript} ${optObjs.map(o => `(${o.key}) ${o.text}`).join(' ')}`
        : String(q.audioScript || '').replace(/\r?\n+/g, ' ').trim();

    const audioText = part === 1
      ? optObjs.map(o => `${o.key}. ${o.text}`).join(' ')
      : part === 2
        ? `${p2QuestionScript} ${optObjs.map(o => `${o.key}. ${o.text}`).join(' ')}`
        : String(q.audioVoiceText || q.audioScript || '').replace(/\r?\n+/g, ' ').trim();

    const words = fullTranscript.match(/[A-Za-z]{4,}/g) || [];
    const hintWords = Array.from(new Set(words.map(w => w.toLowerCase()))).slice(0, 5);

    const groupIndex = part === 3
      ? Math.floor((idNum - 32) / 3) + 1
      : part === 4
        ? Math.floor((idNum - 71) / 3) + 1
        : 0;

    const mainAudioUrl = part === 1 || part === 2
      ? `${audioBase}/p${part}-q${pad3(idNum)}.mp3`
      : `${audioBase}/p${part}-g${pad2(groupIndex)}.mp3`;

    const p2Fields = part === 2 ? {
      questionAudioUrl: `${audioBase}/p2-q${pad3(idNum)}-q.mp3`,
      questionOnlyAudio: p2QuestionScript,
      questionScript: p2QuestionScript,
      questionVi: cleanQuestionVi(q.questionVi || translation.split(/\r?\n/)[0] || ''),
      questionVocab: parentVocab.slice(0, 3)
    } : {};

    return {
      id: `${testId}-q${idNum}`,
      questionNumber: idNum,
      etsYear: '2026',
      etsTestId: testId,
      part: `Part ${part}`,
      partNumber: part,
      passageTitle: q.passageTitle || '',
      level: `Level ${lv} (${LEVEL_RANGES[lv]})`,
      title: `${testCode} (Level ${lv}) • Câu ${idNum} (${PART_NAMES[part]})`,
      questionPrompt: q.questionText || (part === 1
        ? 'Nghe 4 câu mô tả A, B, C, D và chọn phương án đúng:'
        : part === 2
          ? 'Nghe một câu hỏi và 3 phương án trả lời, chọn câu phản hồi phù hợp nhất:'
          : ''),
      imageType: q.imageUrl ? (q.imageType || '') : '',
      imageCaption: q.imageUrl ? (q.imageCaption || '') : '',
      imageUrl: q.imageUrl || '',
      audioUrl: mainAudioUrl,
      ...p2Fields,
      rawAudioScript: String(q.audioScript || '').trim(),
      audioText,
      fullTranscript,
      vietnamese: translation,
      optionTranslations: translation,
      explanation,
      hintWords: hintWords.length ? hintWords : ['listening', 'toeic'],
      keyVocab: parentVocab,
      practiceOptions: optObjs.map(o => ({
        key: o.key,
        text: o.text,
        correct: o.key === targetKey,
        ...(part === 1 || part === 2 ? {
          audioUrl: `${audioBase}/p${part}-q${pad3(idNum)}-${o.key.toLowerCase()}.mp3`,
          keyVocab: parentVocab.slice(0, 3)
        } : {})
      }))
    };
  });

  const meta = {
    id: testId,
    level: lv,
    year: '2026',
    code: testCode,
    title: testTitle
  };

  const outPath = path.join(ROOT, 'listening', `level-${lv}`, `test-${tPad2}.js`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const script = `/**
 * ${testTitle} (100 câu Part 1–4) + audio neural TTS.
 * Sinh tự động bởi tools/build_listening_test.js — không sửa tay.
 */
(function () {
    const D = window.DAU_DATA = window.DAU_DATA || {};
    D.etsListeningYears = D.etsListeningYears || ["2026"];
    if (!D.etsListeningYears.includes("2026")) D.etsListeningYears.push("2026");
    D.etsListeningTests = D.etsListeningTests || [];
    D.listeningExercises = D.listeningExercises || [];
    const meta = ${JSON.stringify(meta)};
    if (!D.etsListeningTests.some(x => x.id === meta.id)) D.etsListeningTests.push(meta);
    D.listeningExercises.push(...${JSON.stringify(exercises)});
})();
`;
  fs.writeFileSync(outPath, script, 'utf8');
  console.log(`✅ Built ${path.relative(ROOT, outPath)}: total=${exercises.length} (P1=${p1.length}, P2=${p2.length}, P3=${p3.length}, P4=${p4.length}) | size=${(script.length / 1024).toFixed(1)} KB`);
}

const args = process.argv.slice(2);
if (args.length < 1) fail('Cách dùng: node tools/build_listening_test.js <level> [test...]');
const lvArg = Number(args[0]);
const testArgs = args.slice(1).length ? args.slice(1).map(Number) : [1];
testArgs.forEach(t => buildTest(lvArg, t));
