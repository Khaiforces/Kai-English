/**
 * Thêm một nhân vật thứ ba vào 2 đoạn hội thoại Part 3 của mỗi đề.
 * Chỉ nối thêm lời thoại ở cuối đoạn — không đổi 3 câu hỏi/đáp án đã soạn,
 * và chọn đoạn mà câu hỏi chỉ nhắc tới một giới tính để không gây nhập nhằng.
 *
 * Dùng: node tools/add_third_speaker.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const EDITS = [
  {
    test: 1, group: 't1-p3-g5',
    lines: [
      'Man 2: I can post a sign at Line 3 so the next shift knows not to run it.',
      'Woman: Please do, and add my extension in case anyone has questions.'
    ]
  },
  {
    test: 1, group: 't1-p3-g11',
    lines: [
      'Woman 2: Should I include the night shift supervisor in the calendar invitation?',
      'Man: Yes, and ask him to confirm how many people are coming.'
    ]
  },
  {
    test: 2, group: 't2-p3-g5',
    lines: [
      'Man 2: I will call the steel supplier this morning and confirm the revised delivery window.',
      'Woman: Thanks. Please copy me on the confirmation e-mail.'
    ]
  },
  {
    test: 2, group: 't2-p3-g8',
    lines: [
      'Woman 2: I have already printed the client agenda. Should I leave a copy at the front desk?',
      'Man: Yes, and put one in the meeting room as well.'
    ]
  },
  {
    test: 3, group: 't3-p3-g1',
    lines: [
      'Man 2: Do you want me to archive the old spreadsheets on the shared drive?',
      'Woman: Not yet. Keep them until the new system has been running for a month.'
    ]
  },
  {
    test: 3, group: 't3-p3-g8',
    lines: [
      'Woman 2: The gate agent just confirmed that boarding will start at six fifteen.',
      'Man: Good. Please update the display board as well.'
    ]
  }
];

const byTest = {};
for (const e of EDITS) (byTest[e.test] = byTest[e.test] || []).push(e);

function stripLabels(script) {
  return script
    .split('\n')
    .map(line => line.replace(/^(Man 2|Woman 2|Man|Woman|Speaker|Narrator)\s*:\s*/i, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const [test, edits] of Object.entries(byTest)) {
  const file = path.join(ROOT, 'content', `test-${test}`, 'p3.json');
  const questions = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const edit of edits) {
    const group = questions.filter(q => q.audioGroup === edit.group);
    if (!group.length) throw new Error(`missing group ${edit.group}`);
    const script = group[0].audioScript.replace(/\s+$/, '');
    if (/Man 2:|Woman 2:/i.test(script)) continue;
    const updated = script + '\n' + edit.lines.join('\n');
    for (const q of group) {
      q.audioScript = updated;
      q.audioVoiceText = stripLabels(updated);
    }
    console.log(`test ${test}: ${edit.group} -> 3 người nói`);
  }
  fs.writeFileSync(file, JSON.stringify(questions, null, 2), 'utf8');
}
console.log('done');
