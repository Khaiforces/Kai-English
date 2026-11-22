/**
 * Sinh đề Luyện đọc (mọi level) từ thư mục nội dung JSON — builder DUY NHẤT.
 * Chạy: node tools/build_reading_test.js <level> [test...]
 *   ví dụ: node tools/build_reading_test.js 5        -> Level 5 Test 01
 *          node tools/build_reading_test.js 1 2 3    -> Level 1 Test 02, 03
 *
 * Nội dung: tools/lv{level}-test{test}-content/*.json nếu có, không thì tools/lv{level}-content/*.json
 * Output:   reading/lv{level}-test-{NN}.js  (sinh tự động, không sửa tay)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PART_NAMES = {
  5: 'Part 5: Hoàn thành câu (Incomplete Sentences)',
  6: 'Part 6: Hoàn thành đoạn văn (Text Completion)',
  7: 'Part 7: Đọc hiểu (Reading Comprehension)'
};
const PART_SHORT = { 5: 'Hoàn thành câu', 6: 'Hoàn thành đoạn văn', 7: 'Đọc hiểu' };

// Khác biệt giữa các level chỉ nằm ở bảng dữ liệu này (giữ nguyên để output không đổi).
const LEVELS = {
  1: {
    label: '300–400',
    minVocab: 2,
    seed: num => 100000 + num * 7919,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Tier|Model|Group|Part|Section|Document|Breakout|Floor|Room|Gate|Platform'
  },
  2: {
    label: '400–550',
    minVocab: 2,
    seed: num => 200000 + num * 7919,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Group|Part|Section|Document|Floor|Room'
  },
  3: {
    label: '550–700',
    minVocab: 2,
    seed: num => 300000 + num * 7919,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Group|Part|Section|Document|Floor|Room'
  },
  4: {
    label: '700–800',
    minVocab: 3,
    seed: num => 400000 + num * 7919,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Tier|Model|Group|Part|Section|Document|Breakout|Floor|Room'
  },
  5: {
    label: '800–900',
    minVocab: 3,
    seed: () => 918273645,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Tier|Model|Group|Part|Section|Document|Breakout|Floor|Room'
  },
  6: {
    label: '900–990',
    minVocab: 3,
    seed: () => 918273645,
    protect: 'to[àa]|Building|Appendix|Schedule|Clause|Track|Tier|Model|Group|Part|Section|Document'
  }
};

function fail(msg) {
  console.error('❌ ' + msg);
  process.exit(1);
}

// Lịch đáp án tất định: 25 A, 25 B, 25 C, 25 D; không lặp chu kỳ, tối đa 2 câu liên tiếp trùng đáp án.
function makeSchedule(seedInit) {
  const keys = ['A', 'B', 'C', 'D'];
  let seed = seedInit >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const shufflePart = counts => {
    const pool = [];
    keys.forEach((k, i) => { for (let c = 0; c < counts[i]; c++) pool.push(k); });
    for (let attempt = 0; attempt < 200; attempt++) {
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      const has3Run = arr.some((k, i) => i >= 2 && arr[i - 1] === k && arr[i - 2] === k);
      const has4Cycle = arr.length >= 8 && arr.every((k, i) => i < 4 || k === arr[i % 4]);
      if (!has3Run && !has4Cycle) return arr;
    }
    return pool;
  };
  // Part 5 (30): 8,8,7,7 | Part 6 (16): 4,4,4,4 | Part 7 (54): 13,13,14,14
  const s = [...shufflePart([8, 8, 7, 7]), ...shufflePart([4, 4, 4, 4]), ...shufflePart([13, 13, 14, 14])];
  for (let i = 2; i < s.length; i++) {
    if (s[i] === s[i - 1] && s[i] === s[i - 2]) {
      const partStart = i < 30 ? 0 : (i < 46 ? 30 : 46);
      const partEnd = i < 30 ? 30 : (i < 46 ? 46 : 100);
      for (let j = partStart; j < partEnd; j++) {
        if (s[j] !== s[i]) { [s[i], s[j]] = [s[j], s[i]]; break; }
      }
    }
  }
  return s;
}

// Đổi chữ cái A/B/C/D trong phần giải thích cho khớp vị trí đáp án mới (bỏ qua "Part A", "Room B"…).
function swapExplanationLetters(explanation, curChar, targetChar, protect) {
  if (!explanation || curChar === targetChar) return explanation;
  const protectedBefore = new RegExp(`(?:${protect})\\s+$`, 'i');
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

function build(level, testNum) {
  const cfg = LEVELS[level];
  if (!cfg) fail(`Level không hợp lệ: ${level} (hỗ trợ: ${Object.keys(LEVELS).join(', ')})`);
  const num = Number(testNum);
  if (!Number.isInteger(num) || num < 1) fail(`Số test không hợp lệ: ${testNum}`);
  const pad2 = String(num).padStart(2, '0');
  const tag = `Level ${level} Test ${pad2}`;

  const perTestDir = path.join(ROOT, 'tools', `lv${level}-test${num}-content`);
  const contentDir = fs.existsSync(perTestDir) ? perTestDir : path.join(ROOT, 'tools', `lv${level}-content`);
  const testId = `reading-lv${level}-test-${num}`;
  const schedule = makeSchedule(cfg.seed(num));

  const readJson = name => {
    const file = path.join(contentDir, name);
    if (!fs.existsSync(file)) fail(`${tag}: thiếu file nội dung ${path.relative(ROOT, file)}`);
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      fail(`${tag}: JSON lỗi trong ${name} — ${err.message}`);
    }
  };

  const normalizeVocab = (n, vocab) => {
    if (!Array.isArray(vocab) || vocab.length < cfg.minVocab) fail(`${tag} Câu ${n}: cần ít nhất ${cfg.minVocab} mục vocab`);
    return vocab.map((e, i) => {
      if (!Array.isArray(e) || e.length < 3) fail(`${tag} Câu ${n}: vocab[${i}] phải là ["word","pos","meaning"]`);
      return { word: String(e[0]), pos: String(e[1]), meaning: String(e[2]) };
    });
  };

  const buildQuestion = (raw, part, passageTitle, passageHtml) => {
    const n = Number(raw.n);
    const { q, options, answer, translation, explanation } = raw;
    if (!Number.isInteger(n)) fail(`${tag}: "n" không hợp lệ (${raw.n})`);
    if (typeof q !== 'string' || !q.trim()) fail(`${tag} Câu ${n}: thiếu "q"`);
    if (!Array.isArray(options) || options.length !== 4) fail(`${tag} Câu ${n}: phải có đúng 4 options`);
    if (!['A', 'B', 'C', 'D'].includes(answer)) fail(`${tag} Câu ${n}: answer phải là A/B/C/D`);
    if (!translation || !explanation) fail(`${tag} Câu ${n}: thiếu translation/explanation`);

    const keys = ['A', 'B', 'C', 'D'];
    const texts = options.map(t => String(t).replace(/^\([A-D]\)\s*/, ''));
    const curIdx = keys.indexOf(answer);
    const targetIdx = keys.indexOf(schedule[n - 101]);
    let updatedExp = explanation;
    if (targetIdx !== curIdx) {
      [texts[curIdx], texts[targetIdx]] = [texts[targetIdx], texts[curIdx]];
      updatedExp = swapExplanationLetters(explanation, keys[curIdx], keys[targetIdx], cfg.protect);
    }

    return {
      id: `${testId}-q${n}`,
      questionNumber: n,
      etsYear: '2026',
      etsTestId: testId,
      part: `Part ${part}`,
      partNumber: part,
      partName: PART_NAMES[part],
      title: `Test ${pad2} (Level ${level}) • Câu ${n} (Part ${part}: ${PART_SHORT[part]})`,
      passageTitle: passageTitle || '',
      passageHtml: passageHtml || '',
      questionText: q,
      options: keys.map((k, i) => ({ key: k, text: `(${k}) ${texts[i]}` })),
      correct: keys[targetIdx],
      translation,
      explanation: updatedExp,
      vocab: normalizeVocab(n, raw.vocab)
    };
  };

  const part5Raw = readJson('part5.json');
  if (!Array.isArray(part5Raw) || part5Raw.length !== 30) fail(`${tag}: part5.json phải có đúng 30 câu`);
  const part5 = part5Raw.map(r => buildQuestion(r, 5));

  const part6Groups = readJson('part6.json');
  if (!Array.isArray(part6Groups) || part6Groups.length !== 4) fail(`${tag}: part6.json phải có đúng 4 đoạn`);
  const part6 = [];
  part6Groups.forEach((grp, gi) => {
    if (!grp.passageHtml || !grp.passageTitle) fail(`${tag}: part6 đoạn ${gi + 1} thiếu tiêu đề/nội dung`);
    if (!Array.isArray(grp.questions) || grp.questions.length !== 4) fail(`${tag}: part6 đoạn ${gi + 1} phải có đúng 4 câu`);
    grp.questions.forEach(r => {
      if (!String(grp.passageHtml).includes(`[${r.n}]`)) fail(`${tag}: part6 đoạn ${gi + 1} thiếu mốc [${r.n}]`);
      part6.push(buildQuestion(r, 6, grp.passageTitle, grp.passageHtml));
    });
  });

  const part7Groups = [...readJson('part7a.json'), ...readJson('part7b.json')];
  if (part7Groups.length !== 15) fail(`${tag}: part7a+part7b phải có 15 bộ (đang có ${part7Groups.length})`);
  const part7 = [];
  part7Groups.forEach((grp, gi) => {
    if (!grp.passageHtml || !grp.passageTitle) fail(`${tag}: part7 bộ ${gi + 1} thiếu tiêu đề/nội dung`);
    if (!Array.isArray(grp.questions) || grp.questions.length < 2) fail(`${tag}: part7 bộ ${gi + 1} phải có ít nhất 2 câu`);
    grp.questions.forEach(r => part7.push(buildQuestion(r, 7, grp.passageTitle, grp.passageHtml)));
  });

  const all = [...part5, ...part6, ...part7];
  if (all.length !== 100) fail(`${tag}: tổng số câu phải là 100 (đang có ${all.length})`);

  const seenNums = new Set();
  const seenIds = new Set();
  all.forEach(item => {
    if (item.questionNumber < 101 || item.questionNumber > 200) fail(`${tag}: câu ${item.questionNumber} ngoài khoảng 101–200`);
    if (seenNums.has(item.questionNumber)) fail(`${tag}: trùng số câu ${item.questionNumber}`);
    if (seenIds.has(item.id)) fail(`${tag}: trùng id ${item.id}`);
    seenNums.add(item.questionNumber);
    seenIds.add(item.id);
  });
  for (let n = 101; n <= 200; n++) if (!seenNums.has(n)) fail(`${tag}: thiếu câu ${n}`);

  const counts = { A: 0, B: 0, C: 0, D: 0 };
  all.forEach(item => counts[item.correct]++);

  const meta = {
    id: testId,
    level,
    year: '2026',
    code: `Test ${pad2}`,
    title: `Đề Luyện đọc Level ${level} (${cfg.label}) - Test ${pad2}`
  };

  const output = `/**
 * Đề Luyện đọc Level ${level} (${cfg.label}) Test ${pad2} (100 câu Part 5–7).
 * Sinh tự động bởi tools/build_reading_test.js — không sửa tay.
 */
(function () {
    const D = window.DAU_DATA = window.DAU_DATA || {};
    D.etsReadingTests = D.etsReadingTests || [];
    D.readingExercises = D.readingExercises || [];
    const meta = ${JSON.stringify(meta)};
    if (!D.etsReadingTests.some(x => x.id === meta.id)) D.etsReadingTests.push(meta);
    D.readingExercises.push(...${JSON.stringify(all)});
})();
`;

  const outPath = path.join(ROOT, 'reading', `lv${level}-test-${pad2}.js`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, 'utf8');

  console.log(`✅ ${tag} → ${path.relative(ROOT, outPath)}`);
  console.log(`   Part 5: ${part5.length} | Part 6: ${part6.length} | Part 7: ${part7.length} | Tổng: ${all.length}`);
  console.log(`   Phân bố đáp án: A=${counts.A} B=${counts.B} C=${counts.C} D=${counts.D}`);
  console.log(`   Kích thước: ${(output.length / 1024).toFixed(1)} KB`);
  return { outPath, all, meta };
}

module.exports = { build };

if (require.main === module) {
  const [level, ...tests] = process.argv.slice(2);
  if (!level) fail('Cách dùng: node tools/build_reading_test.js <level> [test...]  (vd: 5 hoặc 1 2 3)');
  (tests.length ? tests : ['1']).forEach(t => build(Number(level), Number(t)));
}
