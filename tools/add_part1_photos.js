/**
 * Gắn ảnh chụp thật cho 6 câu Part 1 đề 1 và viết lại phương án cho khớp ảnh.
 * Chạy: node tools/add_part1_photos.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const file = path.join(ROOT, 'content', 'test-1', 'p1.json');
const questions = JSON.parse(fs.readFileSync(file, 'utf8'));
const credits = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/images/test-01/part1/credits.json'), 'utf8').replace(/^\\uFEFF/, ''));

const DATA = {
  1: {
    caption: 'Một người phụ nữ đang ngồi tại bàn làm việc, hai tay đặt trên bàn phím máy tính xách tay; trước mặt cô có một cuốn sổ đang mở.',
    correct: 'A',
    options: [
      ['A', 'A woman is working on a laptop at a desk.'],
      ['B', 'A man is placing a box on a shelf.'],
      ['C', 'The desk is completely empty.'],
      ['D', 'A woman is talking on a telephone.']
    ],
    translation: '(A) Một người phụ nữ đang làm việc trên máy tính xách tay tại bàn làm việc.\n(B) Một người đàn ông đang đặt một chiếc hộp lên kệ.\n(C) Chiếc bàn hoàn toàn trống.\n(D) Một người phụ nữ đang nói chuyện điện thoại.',
    explanation: 'Ảnh cho thấy người phụ nữ ngồi tại bàn, tay đặt trên bàn phím laptop, trước mặt là cuốn sổ mở. (A) mô tả đúng. (B) không có người đàn ông nào đang đặt hộp; (C) sai vì bàn có laptop, sổ và điện thoại; (D) không có ai đang nghe điện thoại.'
  },
  2: {
    caption: 'Nhiều người đàn ông mặc vest đang ngồi quanh một chiếc bàn họp dài; trên bàn có chai nước và ly.',
    correct: 'A',
    options: [
      ['A', 'A meeting is taking place around a long table.'],
      ['B', 'The chairs have been stacked against the wall.'],
      ['C', 'A waiter is pouring water into the glasses.'],
      ['D', 'The walls are being painted by workers.']
    ],
    translation: '(A) Một cuộc họp đang diễn ra quanh một chiếc bàn dài.\n(B) Những chiếc ghế đã được xếp chồng sát tường.\n(C) Một người phục vụ đang rót nước vào các ly.\n(D) Những bức tường đang được công nhân sơn.',
    explanation: 'Ảnh cho thấy một cuộc họp: nhiều người ngồi hai bên bàn dài, trên bàn có chai nước và ly. (A) đúng. (B) sai vì ghế vẫn đặt quanh bàn; (C) không có người phục vụ nào đang rót nước; (D) không có ai sơn tường.'
  },
  3: {
    caption: 'Một chiếc bút máy đặt trên xấp giấy tờ hợp đồng có tiêu đề CONTRACT.',
    correct: 'B',
    options: [
      ['A', 'A delivery truck is parked outside the warehouse.'],
      ['B', 'A pen is resting on top of a contract.'],
      ['C', 'A worker is sealing a box with tape.'],
      ['D', 'The documents have been placed inside a box.']
    ],
    translation: '(A) Một chiếc xe tải giao hàng đỗ bên ngoài nhà kho.\n(B) Một chiếc bút đang đặt trên một bản hợp đồng.\n(C) Một công nhân đang dán keo niêm phong thùng hàng.\n(D) Các giấy tờ đã được cho vào trong thùng.',
    explanation: 'Ảnh cận cảnh cho thấy chiếc bút máy nằm trên tờ hợp đồng có tiêu đề CONTRACT và các dòng điều khoản. (B) đúng. (A), (C), (D) mô tả vật thể hoặc hành động không xuất hiện trong ảnh.'
  },
  4: {
    caption: 'Một nhóm đông người đứng trước màn chiếu, mỗi người đeo một huy hiệu tên trên dây đeo cổ.',
    correct: 'C',
    options: [
      ['A', 'A speaker is giving a presentation on a stage.'],
      ['B', 'The badges are being printed in an office.'],
      ['C', 'Several people are wearing name badges on lanyards.'],
      ['D', 'A receptionist is handing a badge to a visitor.']
    ],
    translation: '(A) Một diễn giả đang thuyết trình trên sân khấu.\n(B) Những tấm huy hiệu đang được in trong văn phòng.\n(C) Nhiều người đang đeo huy hiệu tên trên dây đeo cổ.\n(D) Một nhân viên lễ tân đang trao huy hiệu cho khách.',
    explanation: 'Trong ảnh, cả nhóm người đều đeo dây đeo cổ có thẻ tên. (C) đúng. Không có diễn giả trên sân khấu (A), không có máy in huy hiệu (B), không có cảnh trao huy hiệu (D).'
  },
  5: {
    caption: 'Một người đàn ông mặc vest đứng cạnh bục phát biểu, phía sau là màn chiếu lớn đang trình bày slide.',
    correct: 'A',
    options: [
      ['A', 'A man is standing in front of a projected slide.'],
      ['B', 'Two employees are shaking hands.'],
      ['C', 'All the chairs in the room are empty.'],
      ['D', 'A woman is pointing at a chart on a screen.']
    ],
    translation: '(A) Một người đàn ông đang đứng trước một slide được chiếu lên màn hình.\n(B) Hai nhân viên đang bắt tay nhau.\n(C) Tất cả ghế trong phòng đều trống.\n(D) Một người phụ nữ đang chỉ vào biểu đồ trên màn hình.',
    explanation: 'Ảnh cho thấy người đàn ông đứng cạnh bục phát biểu, phía sau là màn chiếu lớn. (A) đúng. Không có ai bắt tay (B); không có người phụ nữ nào chỉ vào biểu đồ (D); (C) không được thể hiện trong ảnh.'
  },
  6: {
    caption: 'Nhiều bàn ghế ngoài trời được xếp dưới những chiếc ô lớn vào buổi tối; một vài người đang ngồi ở bàn.',
    correct: 'B',
    options: [
      ['A', 'A band is performing on a small stage.'],
      ['B', 'An outdoor table is set beneath a large umbrella.'],
      ['C', 'The tables have been folded and stored away.'],
      ['D', 'People are waiting in line outside the cafe.']
    ],
    translation: '(A) Một ban nhạc đang biểu diễn trên một sân khấu nhỏ.\n(B) Một chiếc bàn ngoài trời được đặt dưới một chiếc ô lớn.\n(C) Những chiếc bàn đã được gấp lại và cất đi.\n(D) Mọi người đang xếp hàng bên ngoài quán cà phê.',
    explanation: 'Ảnh chụp khu vực ngoài trời với các bàn ghế đặt dưới ô lớn. (B) đúng. Không có ban nhạc (A); bàn vẫn mở, không bị gấp cất (C); không có hàng người chờ (D).'
  }
};

for (const q of questions) {
  const d = DATA[q.id];
  if (!d) continue;
  q.imageUrl = `assets/images/test-01/part1/q${q.id}.jpg`;
  q.imageCaption = d.caption;
  const credit = credits[`q${q.id}`];
  q.imageCredit = credit ? credit.text : '';
  q.correct = d.correct;
  q.options = d.options.map(([key, text]) => ({ key, text: `(${key}) ${text}` }));
  q.translation = d.translation;
  q.explanation = d.explanation;
  q.audioScript = d.options.map(([key, text]) => `${key}. ${text}`).join('\n');
  q.audioVoiceText = d.options.map(([key, text]) => `${key}. ${text}`).join(' ');
}

fs.writeFileSync(file, JSON.stringify(questions, null, 2), 'utf8');
console.log('updated', questions.length, 'Part 1 items');
