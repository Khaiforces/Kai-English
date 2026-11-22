# SPEC — Luyện nghe Level 5 (800–900) – Test 02

100 câu: **Part 1 = 6**, **Part 2 = 25**, **Part 3 = 39** (13 nhóm × 3), **Part 4 = 30** (10 bài × 3).
Mỗi người soạn ghi **1 file JSON** đúng schema dưới đây, **không sửa file nào khác**.

## Quy tắc chung (bắt buộc)

- **Không dùng hình ảnh**: mọi câu Part 1 có `"imageUrl": ""`, `"imageType": ""`, `"imageCaption": ""` (quy tắc 10 trong `AGENTS.md`).
- Đề bằng **tiếng Anh**; `translation` + `explanation` bằng **tiếng Việt** có dấu.
- `vocab`: **>= 2 mục** cho Part 1–2, **>= 3 mục** cho Part 3–4; mỗi mục `["word","pos","nghĩa tiếng Việt"]`.
- Trong `explanation` **không** viết "đáp án (A)/(B)/(C)/(D)" theo chữ cái (builder xáo lại vị trí đáp án). Gọi tên phương án bằng nội dung.
- Mức **800–900**: Part 2 dùng câu hỏi gián tiếp, câu hỏi đuôi, phủ định, bẫy lặp từ; Part 3–4 có suy luận, tính toán đơn giản, paraphrase xa.
- Không chép lại nội dung của `tools/listening-lv5-test1-content/`.

## Part 1 — `p1.json` (6 câu, id 1…6)

```json
{
  "id": 1,
  "part": 1,
  "imageType": "",
  "imageCaption": "",
  "imageUrl": "",
  "options": [
    "A man is sorting documents at a desk.",
    "The man is looking after the files for a colleague.",
    "A printer is being moved into the hallway.",
    "The documents have been placed on the floor."
  ],
  "correct": "A",
  "translation": "(A) Một người đàn ông đang sắp xếp giấy tờ tại bàn.\n(B) Người đàn ông đang trông nom hồ sơ cho đồng nghiệp.\n(C) Một chiếc máy in đang được chuyển ra hành lang.\n(D) Các tài liệu đã được đặt trên sàn.",
  "explanation": "Bối cảnh: người đàn ông ngồi tại bàn, tay sắp xếp giấy tờ; các phương án còn lại mô tả vật thể hoặc hành động không có trong tranh.",
  "vocab": [["sort", "v", "sắp xếp, phân loại"], ["document", "n", "tài liệu"], ["colleague", "n", "đồng nghiệp"]],
  "questionText": "Look at the picture and choose the statement that best describes it."
}
```

- 6 bối cảnh khác nhau: văn phòng giấy tờ, kho hàng, hội nghị/bảng biểu, lễ tân khách sạn, công trường, cửa hàng.
- Mỗi câu 4 phương án; 1 đúng, 3 nhiễu (sai vật thể, sai hành động, bẫy gần âm).
- `translation` phải có đúng 4 dòng `(A) …`, `(B) …`, `(C) …`, `(D) …` ngăn bằng `\n`.

## Part 2 — `p2.json` (25 câu, id 7…31)

```json
{
  "id": 7,
  "part": 2,
  "questionScript": "Wouldn't it be better to send the revised quote before the client calls again?",
  "questionVi": "Chẳng phải sẽ tốt hơn nếu gửi báo giá đã sửa trước khi khách hàng gọi lại sao?",
  "options": ["I already sent it this morning.", "The client is on the second floor.", "He quoted a very reasonable price."],
  "correct": "A",
  "translation": "Hỏi: Chẳng phải sẽ tốt hơn nếu gửi báo giá đã sửa trước khi khách hàng gọi lại sao?\n(A) Tôi đã gửi nó sáng nay rồi.\n(B) Khách hàng đang ở tầng hai.\n(C) Anh ấy đã báo một mức giá rất hợp lý.",
  "explanation": "Câu hỏi đề nghị ở dạng phủ định ('Wouldn't it be better…') cần phản hồi về việc đã thực hiện; 'I already sent it' trả lời đúng ý, hai phương án còn lại lặp từ nhưng lạc nội dung.",
  "vocab": [["quote", "n", "báo giá"], ["revised", "adj", "đã chỉnh sửa"], ["client", "n", "khách hàng"]]
}
```

- Đúng 3 phương án mỗi câu.
- `translation` phải có dòng `Hỏi: …` rồi 3 dòng `(A) …`, `(B) …`, `(C) …`.
- Trải đều dạng: câu hỏi đuôi, phủ định, WH-question gián tiếp, đề nghị/lựa chọn, câu trần thuật cần phản hồi.

## Part 3 — `p3.json` (39 câu, id 32…70; 13 nhóm × 3 câu)

- Nhóm 1 = id 32–34, nhóm 2 = 35–37, …, nhóm 13 = 68–70.
- 3 câu trong một nhóm **dùng chung** `audioGroup`, `audioScript`, `audioVoiceText`, `passageTitle`; mỗi câu có `questionText`/`options`/`correct`/`translation`/`explanation`/`vocab` riêng.
- `passageTitle`: `"Questions 32-34 refer to the following conversation:"`.
- `audioGroup`: `"lv5-t2-p3-g1"` … `"lv5-t2-p3-g13"`.
- `audioScript`: hội thoại **100–120 từ**, mỗi lượt nói bắt đầu bằng `Woman: ` hoặc `Man: ` (đúng 2 người nói, xen kẽ 4–6 lượt). `audioVoiceText` giống hệt `audioScript`.
- Trong `audioVoiceText`, viết **số/ngày/giờ/tiền bằng chữ** để TTS đọc đúng (vd "the twenty-eighth", "fifteen percent", "three thousand dollars"); `audioScript` có thể giữ chữ số.
- `options`: 4 phương án, có thể viết `(A) …` hoặc không — builder tự chuẩn hoá; `correct` là "A"/"B"/"C"/"D".
- `translation`: dòng `Câu hỏi: …` rồi 4 dòng `(A) …`.
- 13 chủ đề (theo thứ tự nhóm): khởi động dự án, sai sót bảng lương, đổi đặt phòng khách sạn, đàm phán giá nhà cung cấp, tập huấn an ninh CNTT, đặt tiệc sự kiện, giao hàng chậm, phản hồi phỏng vấn, phân tích marketing, gia hạn hợp đồng thuê văn phòng, hậu cần diễn giả hội nghị, leo thang khiếu nại khách hàng, điều phối thu hồi sản phẩm.

## Part 4 — `p4.json` (30 câu, id 71…100; 10 bài × 3 câu)

- Bài 1 = 71–73, …, bài 10 = 98–100.
- 3 câu trong bài **dùng chung** `passageTitle`, `audioScript`, `audioVoiceText`.
- `passageTitle`: `"Questions 71-73 refer to the following announcement:"`.
- `audioScript`: bài nói một người **120–140 từ** (không gắn `Woman:`/`Man:`), văn phong: thông báo sân bay, bản tin nội bộ, hướng dẫn an toàn, thuyết minh bảo tàng, thông báo nhân sự, họp công bố kết quả kinh doanh, tin thời tiết/hoãn chuyến, thông báo bảo trì tòa nhà, phát biểu định hướng, tin nhắn giao hàng tự động.
- `audioVoiceText` giống hệt `audioScript`, số/ngày/giờ/tiền viết bằng chữ.
- Mỗi bài 3 câu: mục đích/ý chính, chi tiết, suy luận hoặc hành động tiếp theo.
- `options` 4 phương án; `translation` dòng `Câu hỏi: …` + 4 dòng `(A) …`.

## Tự kiểm tra trước khi kết thúc

```powershell
node -e "const d=require('./tools/listening-lv5-test2-content/p2.json');const n=d.map(x=>x.n||x.id);console.log('count',d.length,'ids',n[0]+'-'+n[n.length-1],'dups',n.length-new Set(n).size);d.forEach(x=>{if(x.options.length!==3)throw new Error('bad options '+x.id);if(!/^[ABC]$/.test(x.correct))throw new Error('bad correct '+x.id);if(x.vocab.length<2)throw new Error('bad vocab '+x.id)})"
```

Phải in `count 25 ids 7-31 dups 0`. Với Part 3 kiểm tra `39` câu id 32–70 và 13 giá trị `audioGroup` khác nhau; Part 4 kiểm tra `30` câu id 71–100 và 10 `passageTitle` khác nhau.