/**
 * Ghép nội dung các đề (content/test-N/p*.json) + manifest audio thành:
 *   - data/mock_tests_data.js (các đề đủ 200 câu cho mục Thi thử)
 *   - listening/level-1/test-0N.js (file riêng từng đề 100 câu cho mục Luyện nghe Level 1)
 *
 * Dùng: node tools/build_tests.js [1 2 3 4]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const LISTENING_PARTS = ['p1', 'p2', 'p3', 'p4'];
const READING_PARTS = ['p5', 'p6', 'p7a', 'p7b'];
const ALL_PARTS = [...LISTENING_PARTS, ...READING_PARTS];
const requested = process.argv.slice(2).map(Number).filter(n => n >= 1);
const TESTS = requested.length ? requested : [1, 2, 3, 4];

const pad2 = n => String(n).padStart(2, '0');
const pad3 = n => String(n).padStart(3, '0');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const cleanOptText = txt => String(txt || '').replace(/^\s*(?:\([A-D]\)|[A-D][\.\)])\s*/i, '').trim();
const cleanQuestionVi = txt => String(txt || '').replace(/^\s*(?:Hỏi|Câu hỏi|Câu trần thuật|Phát biểu|Đề nghị|Question)\s*:\s*/i, '').trim();

const EXTRA_VOCAB = [
  ['ceiling', 'trần nhà'], ['light', 'đèn'], ['telephone', 'điện thoại'], ['chair', 'ghế'],
  ['empty', 'trống'], ['fax', 'bản fax, gửi fax'], ['page', 'trang'], ['forty', 'bốn mươi'],
  ['believe', 'tin rằng, cho rằng'], ['produce', 'sản xuất'], ['great', 'tuyệt vời'],
  ['cost', 'trị giá, chi phí'], ['March', 'tháng Ba'], ['chef', 'đầu bếp'],
  ['graduate', 'tốt nghiệp'], ['famous', 'nổi tiếng'], ['Monday', 'thứ Hai'],
  ['morning', 'buổi sáng'], ['idea', 'ý tưởng'], ['dollar', 'đô la'], ['help', 'giúp đỡ'],
  ['sure', 'chắc chắn'], ['call', 'cuộc gọi, gọi'], ['right after', 'ngay sau'],
  ['start', 'bắt đầu'], ['minute', 'phút'], ['travel', 'đi lại, du lịch'], ['month', 'tháng'],
  ['public holiday', 'ngày lễ'], ['twice', 'hai lần'], ['yesterday', 'hôm qua'],
  ['small', 'nhỏ'], ['twenty', 'hai mươi'], ['box', 'hộp, thùng'], ['October', 'tháng Mười'],
  ['walk', 'quãng đi bộ, đi bộ'], ['Tuesday', 'thứ Ba'], ['better', 'tốt hơn'],
  ['kitchen', 'nhà bếp'], ['Thursday', 'thứ Năm'], ['evening', 'buổi tối'],
  ['weather', 'thời tiết'], ['warm', 'ấm áp'], ['round-trip', 'khứ hồi'], ['ticket', 'vé'],
  ['lock', 'khóa'], ['back door', 'cửa sau'], ['coffee', 'cà phê'], ['fifteen', 'mười lăm'],
  ['person', 'người'], ['night', 'đêm'], ['met', 'đã gặp'], ['never', 'chưa từng, chưa bao giờ'],
  ['park', 'đỗ xe'], ['building', 'tòa nhà'], ['train', 'tàu hỏa'], ['taken over', 'tiếp quản'],
  ['comfortable', 'thoải mái'], ['basement', 'tầng hầm'], ['data center', 'trung tâm dữ liệu']
].map(([word, meaning]) => ({ word, meaning }));

const PROJECT_VOCAB = (() => {
  const list = [];
  const seen = new Set();
  const add = (word, meaning) => {
    const k = String(word || '').toLowerCase().trim();
    if (!k || k.length < 3 || !meaning || seen.has(k)) return;
    seen.add(k);
    list.push({ word: String(word).trim(), meaning: String(meaning).trim() });
  };
  for (const t of [1, 2, 3, 4]) {
    const dir = path.join(ROOT, 'content', `test-${t}`);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => /^p\d.*\.json$/.test(x))) {
      for (const q of readJson(path.join(dir, f))) {
        for (const v of (q.vocab || [])) add(v.word, v.meaning);
      }
    }
  }
  for (const [file, varName] of [['data/vocab_data.js', 'BARRONS_600_TOPICS'], ['data/phrasal_verbs_data.js', 'PHRASAL_VERBS_300_TOPICS']]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync(p, 'utf8'), ctx);
    for (const topic of (ctx.window[varName] || [])) {
      for (const w of (topic.words || [])) add(w.word, w.meaning);
    }
  }
  for (const v of EXTRA_VOCAB) add(v.word, v.meaning);
  return list;
})();

function tokenVariants(wt) {
  const variants = new Set([wt, wt + 's', wt + 'es', wt + 'ed', wt + 'd', wt + 'ing', wt + 'er', wt + 'est', wt + 'ly']);
  if (wt.endsWith('e') && wt.length >= 4) {
    const base = wt.slice(0, -1);
    variants.add(base + 'ed');
    variants.add(base + 'ing');
    variants.add(base + 'es');
    variants.add(base + 'er');
  }
  if (wt.endsWith('y') && wt.length >= 4) {
    const base = wt.slice(0, -1);
    variants.add(base + 'ies');
    variants.add(base + 'ied');
    variants.add(base + 'ier');
  }
  if (wt.length >= 3) {
    const last = wt.slice(-1);
    variants.add(wt + last + 'ed');
    variants.add(wt + last + 'ing');
  }
  return variants;
}

function matchesSentence(vocabWord, sentence) {
  const sTokens = String(sentence || '').toLowerCase().match(/[a-z]+/g) || [];
  const wTokens = String(vocabWord || '').toLowerCase().match(/[a-z]+/g) || [];
  if (!wTokens.length) return false;
  return wTokens.every(wt => {
    const forms = tokenVariants(wt);
    return sTokens.some(st => forms.has(st));
  });
}

function pickSentenceVocab(sentence, parentVocab, limit = 4) {
  const picked = [];
  const seen = new Set();
  const tryAdd = v => {
    if (!v || !v.word || !v.meaning || picked.length >= limit) return;
    const k = String(v.word).toLowerCase().trim();
    if (seen.has(k) || !matchesSentence(v.word, sentence)) return;
    if (picked.some(x => x.word.toLowerCase().includes(k) || k.includes(x.word.toLowerCase()))) return;
    seen.add(k);
    picked.push({ word: v.word, meaning: v.meaning });
  };
  for (const v of (parentVocab || [])) tryAdd(v);
  for (const v of PROJECT_VOCAB) {
    if (picked.length >= limit) break;
    tryAdd(v);
  }
  return picked;
}

function validateAndAttachManifest(questions, t, expectedCount, manifest) {
  questions.sort((a, b) => a.id - b.id);
  const ids = questions.map(q => q.id);
  const expected = Array.from({ length: expectedCount }, (_, i) => i + 1);
  const missing = expected.filter(id => !ids.includes(id));
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (missing.length) throw new Error(`test ${t}: missing ids ${missing.slice(0, 10).join(',')}`);
  if (dupes.length) throw new Error(`test ${t}: duplicate ids ${dupes.slice(0, 10).join(',')}`);

  const problems = [];
  for (const q of questions) {
    if (!['A', 'B', 'C', 'D'].includes(q.correct)) problems.push(`${q.id}: bad correct ${q.correct}`);
    if (!Array.isArray(q.options) || q.options.length < 3) problems.push(`${q.id}: bad options`);
    if (q.type === 'listening' && !String(q.audioScript || '').trim()) problems.push(`${q.id}: no audioScript`);
    if (!String(q.explanation || '').trim()) problems.push(`${q.id}: no explanation`);
    if (!String(q.translation || '').trim()) problems.push(`${q.id}: no translation`);
    if (q.type === 'listening' && manifest[String(q.id)]) q.audioUrl = manifest[String(q.id)];
  }
  return problems;
}

function buildListeningExercise(q, testId, testNum, testCode) {
  const correctOpt = (q.options || []).find(o => o.key === q.correct);
  const fullTranscript = q.part === 1
    ? cleanOptText(correctOpt ? correctOpt.text : '')
    : String(q.audioScript || '').replace(/\n+/g, ' ').trim();
  const words = fullTranscript.match(/[A-Za-z]{4,}/g) || [];
  const hintWords = Array.from(new Set(words.map(w => w.toLowerCase()))).slice(0, 5);
  const audioFile = q.audioUrl ? path.posix.basename(String(q.audioUrl)) : '';
  const imgFile = q.imageUrl ? path.posix.basename(String(q.imageUrl)) : '';
  const audioBase = `listening/audio/lv1-test-${pad2(testNum)}`;
  const isSplitPart = q.part === 1 || q.part === 2;
  const parentVocab = (q.vocab || []).map(v => ({ word: v.word, meaning: v.meaning }));
  const p2QuestionScript = q.part === 2
    ? String(q.audioScript || '').split(/\r?\n/)[0].replace(/^\s*Question\s*:\s*/i, '').trim()
    : '';
  const p2Fields = q.part === 2 ? {
    questionAudioUrl: `${audioBase}/p2-q${pad3(q.id)}-q.mp3`,
    questionScript: p2QuestionScript,
    questionVi: cleanQuestionVi(String(q.translation || '').split(/\r?\n/)[0] || ''),
    questionVocab: pickSentenceVocab(p2QuestionScript, parentVocab)
  } : {};

  return {
    id: `${testId}-q${q.id}`,
    etsYear: '2026',
    etsTestId: testId,
    part: 'Part ' + q.part,
    partNumber: q.part,
    level: 'ETS Format',
    title: `${testCode} • Câu ${q.id} (${q.partName || ('Part ' + q.part)})`,
    questionPrompt: q.questionText,
    imageType: q.imageType || 'office_laptop',
    imageCaption: q.imageCaption || '',
    imageUrl: imgFile ? `listening/images/lv1-test-${pad2(testNum)}/part1/${imgFile}` : '',
    audioUrl: audioFile ? `${audioBase}/${audioFile}` : '',
    ...p2Fields,
    audioText: q.audioVoiceText || q.audioScript || '',
    fullTranscript,
    vietnamese: q.translation || '',
    optionTranslations: q.translation || '',
    explanation: q.explanation || '',
    hintWords: hintWords.length ? hintWords : ['listening', 'toeic'],
    keyVocab: parentVocab,
    practiceOptions: (q.options || []).map(o => {
      const optText = cleanOptText(o.text);
      return {
        key: o.key,
        text: optText,
        correct: o.key === q.correct,
        ...(isSplitPart ? {
          audioUrl: `${audioBase}/p${q.part}-q${pad3(q.id)}-${String(o.key || '').toLowerCase()}.mp3`,
          keyVocab: pickSentenceVocab(optText, parentVocab)
        } : {})
      };
    })
  };
}

const listeningDir = path.join(ROOT, 'listening', 'level-1');
fs.mkdirSync(listeningDir, { recursive: true });

const mockTests = [];
let builtListeningCount = 0;

for (const t of TESTS) {
  const dir = path.join(ROOT, 'content', `test-${t}`);
  const missingListening = LISTENING_PARTS.filter(p => !fs.existsSync(path.join(dir, p + '.json')));
  if (missingListening.length) {
    console.log(`test ${t}: SKIP - thiếu ${missingListening.join(', ')}`);
    continue;
  }

  const manifestFile = path.join(dir, 'audio-manifest.json');
  const manifest = fs.existsSync(manifestFile) ? readJson(manifestFile) : {};
  const hasFullReading = READING_PARTS.every(p => fs.existsSync(path.join(dir, p + '.json')));

  const listeningQuestions = LISTENING_PARTS.flatMap(p => readJson(path.join(dir, p + '.json')));
  const listenProblems = validateAndAttachManifest(listeningQuestions, t, 100, manifest);

  const testId = `ets-orig-test-${t}`;
  const testCode = `Test ${pad2(t)}`;
  const testTitle = hasFullReading
    ? `Đề tự soạn ${pad2(t)} - TOEIC Listening & Reading`
    : `Đề tự soạn ${pad2(t)} - TOEIC Listening`;
  const testMeta = { id: testId, level: 1, year: '2026', code: testCode, title: testTitle };
  const exercises = listeningQuestions.map(q => buildListeningExercise(q, testId, t, testCode));
  const listeningWithAudio = exercises.filter(q => q.audioUrl).length;

  const listenScript = `/**
 * Đề Luyện nghe ${testCode} (100 câu Part 1–4) + audio neural TTS.
 * Sinh tự động bởi tools/build_tests.js — không sửa tay.
 */
(function () {
    const D = window.DAU_DATA = window.DAU_DATA || {};
    D.etsListeningYears = D.etsListeningYears || ["2026"];
    if (!D.etsListeningYears.includes("2026")) D.etsListeningYears.push("2026");
    D.etsListeningTests = D.etsListeningTests || [];
    D.listeningExercises = D.listeningExercises || [];
    const meta = ${JSON.stringify(testMeta)};
    if (!D.etsListeningTests.some(x => x.id === meta.id)) D.etsListeningTests.push(meta);
    D.listeningExercises.push(...${JSON.stringify(exercises)});
})();
`;
  const listenOutPath = path.join(listeningDir, `test-${pad2(t)}.js`);
  fs.writeFileSync(listenOutPath, listenScript, 'utf8');
  builtListeningCount++;
  console.log(`listening/level-1/test-${pad2(t)}.js: ${exercises.length} câu | audio ${listeningWithAudio}/${exercises.length}` +
    (listenProblems.length ? ` | LỖI: ${listenProblems.slice(0, 8).join(' ; ')}` : ' | OK'));

  if (!hasFullReading) continue;

  const fullQuestions = ALL_PARTS.flatMap(p => readJson(path.join(dir, p + '.json')));
  const fullProblems = validateAndAttachManifest(fullQuestions, t, 200, manifest);
  mockTests.push({
    id: testId,
    title: testTitle,
    category: 'Đề tự soạn',
    duration: 120,
    totalQuestions: 200,
    AdaptiveQuestionsCount: 200,
    participants: 4200 + t * 380,
    difficulty: 'Trung bình - Khó',
    isFree: true,
    description: 'Đề nguyên bản soạn theo chuẩn format ETS TOEIC (7 Parts, 200 câu), có audio neural TTS đa giọng, giải thích song ngữ và từ vựng.',
    questions: fullQuestions
  });
  console.log(`mock test ${t}: ${fullQuestions.length} câu` +
    (fullProblems.length ? ` | LỖI: ${fullProblems.slice(0, 8).join(' ; ')}` : ' | OK'));
}

if (!builtListeningCount && !mockTests.length) {
  console.log('Không có đề nào đủ dữ liệu để build.');
  process.exit(1);
}

if (mockTests.length) {
  const body = `/**
 * Đề TOEIC nguyên bản (tự soạn theo format ETS) + audio neural TTS.
 * Sinh tự động bởi tools/build_tests.js — không sửa tay.
 * Số đề hiện có: ${mockTests.length}
 */
(function () {
    window.DAU_DATA.mockTests = ${JSON.stringify(mockTests)};
})();
`;
  fs.writeFileSync(path.join(ROOT, 'data', 'mock_tests_data.js'), body, 'utf8');
  console.log('wrote data/mock_tests_data.js', (body.length / 1024).toFixed(0) + ' KB', '| so de:', mockTests.length);
}
