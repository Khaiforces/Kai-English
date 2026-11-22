# SPEC — Nội dung "Luyện đọc Level 5 (800–900) – Test 01"

Mục tiêu: 100 câu Reading (Part 5: 30, Part 6: 16, Part 7: 54) đánh số **101–200**, mức **B2–C1 / TOEIC 800–900**.
Người soạn: 4 subagent, mỗi người ghi **1 file JSON** đúng schema dưới đây. Không sửa file khác.

## Phân biệt mức độ (quan trọng)

- **Level 5 (đề này):** ngữ pháp B2–C1 vững chắc, từ vựng business trung–cao. Câu dài nhưng mạch lạc, không cần đảo ngữ hiếm hay giả định cách C2.
- **Không** dùng lại câu/đoạn của Level 1 (`tools/build_reading_lv1_test1.js`) hay Level 6 (`tools/lv6-content/*`). Không sao chép, không paraphrase chép lại — phải soạn mới hoàn toàn.
- Tránh: đảo ngữ `Rarely/Nor/Not until/So…that`, đảo ngữ điều kiện loại 3 `Had S + V3`, giả định cách `require that… be`, `Notwithstanding` — đây là chất Level 6. Nếu dùng thì tối đa 1–2 câu và phải ở dạng quen thuộc.

## Quy tắc chung

- Ngôn ngữ: đề bằng **tiếng Anh**, `translation` + `explanation` bằng **tiếng Việt**.
- Mỗi câu có đúng 4 phương án (A–D), 1 đáp án đúng, 3 phương án nhiễu **hợp lý** (cùng họ từ, gần nghĩa, sai thì, sai giới từ, lệch nghĩa nhẹ). Không có phương án "quá dễ loại".
- `vocab`: đúng **3 mục**, mỗi mục `["word", "pos", "meaning"]` — từ/cụm từ khó thực sự xuất hiện trong câu hoặc đoạn.
- Chủ đề business/academic: M&A, compliance, logistics, HR, finance, procurement, R&D, consulting, legal, sustainability reporting. Không chủ đề nhạy cảm.
- Câu Part 5 dài **18–32 từ**, văn phong trang trọng.
- `passageHtml`: **một** thẻ bọc ngoài duy nhất, đúng khuôn:

```html
<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
  <p class="font-bold text-center text-base">TIÊU ĐỀ TÀI LIỆU</p>
  <hr class="my-2 border-neutral-300">
  <p class="mt-2">Đoạn 1…</p>
  <p class="mt-2">Đoạn 2…</p>
</div>
```

  Dùng `<p class="mt-2">`, `<br>`, `<strong>`, `<table>` nếu cần. Ký tự `&` phải viết `&amp;`.
- Số câu `n` phải **đúng dải** được giao, không trùng, không thiếu.
- `translation` = dịch nghĩa câu/đoạn liên quan; `explanation` = 1–3 câu tiếng Việt chỉ rõ căn cứ ngữ pháp hoặc dẫn chứng trong bài (trích cụm từ tiếng Anh).

## Schema JSON

### Part 5 — `part5.json` (30 câu, n = 101…130)

Mảng đúng 30 object:

```json
{
  "n": 101,
  "q": "Because the supplier _______ the revised terms, the purchasing team began looking for alternatives.",
  "options": ["has rejected", "rejected", "had rejected", "would reject"],
  "answer": "C",
  "translation": "Vì nhà cung cấp đã bác bỏ các điều khoản sửa đổi nên nhóm thu mua bắt đầu tìm phương án thay thế.",
  "explanation": "Hành động 'rejected' xảy ra trước 'began looking' trong quá khứ nên dùng quá khứ hoàn thành 'had rejected'.",
  "vocab": [
    ["supplier", "n.", "nhà cung cấp"],
    ["terms", "n.", "điều khoản"],
    ["alternative", "n.", "phương án thay thế"]
  ]
}
```

**Bắt buộc trải đều các điểm ngữ pháp sau** (mỗi điểm ít nhất 1 câu): mệnh đề quan hệ (xác định/không xác định, có giới từ), câu điều kiện loại 2 & 3, thì hoàn thành (present/past/future perfect) & hoàn thành tiếp diễn, bị động, động từ khuyết thiếu + phỏng đoán (must/may/might/should have + V3), liên từ tương phản–nguyên nhân–hệ quả (however, nevertheless, despite / in spite of, although, whereas, so that, such … that), phrasal verbs business (carry out, phase out, roll out, look into, draw up, follow up on), collocation (reach an agreement, meet a deadline, take effect, be eligible for, be subject to, in accordance with), gerund vs infinitive (avoid/consider/suggest + V-ing; afford/decide/expect + to V), song song cấu trúc, word form khó (dạng từ dễ nhầm: economical/economic, confident/confidential, considerable/considerate), giới từ + cụm danh từ (on behalf of, in response to, with regard to, in light of).

### Part 6 — `part6.json` (16 câu, n = 131…146; 4 đoạn, mỗi đoạn 4 câu)

Mảng đúng 4 object:

```json
{
  "passageTitle": "Questions 131-134 refer to the following memorandum:",
  "passageHtml": "<div class=\"…\">… <strong>[131]</strong> …</div>",
  "questions": [ { "n": 131, "q": "Select the best answer to complete blank [131].", "options": ["…","…","…","…"], "answer": "C", "translation": "…", "explanation": "…", "vocab": [["…","…","…"]] } ]
}
```

- Dải số: đoạn 1 = 131–134, đoạn 2 = 135–138, đoạn 3 = 139–142, đoạn 4 = 143–146.
- Mỗi đoạn **120–180 từ**, văn bản business trang trọng (memo nội bộ, chính sách, trích báo cáo thường niên, thư khách hàng, cập nhật dự án).
- Mỗi đoạn: 3 câu ngữ pháp/từ vựng + **1 câu chèn câu** (câu đúng phải khớp mạch văn với câu trước/sau; 3 nhiễu lạc chủ đề hoặc sai liên kết).
- Trong `passageHtml` phải có đúng các mốc `<strong>[131]</strong>` … `<strong>[134]</strong>` (tương tự cho các đoạn sau).

### Part 7 — `part7a.json` (29 câu, n = 147…175)

10 bộ tài liệu **đơn** (hoặc 1 tài liệu + 1 bảng), số câu mỗi bộ:

| Bộ | Câu | Số câu |
|---|---|---|
| 1 | 147–148 | 2 |
| 2 | 149–151 | 3 |
| 3 | 152–154 | 3 |
| 4 | 155–157 | 3 |
| 5 | 158–160 | 3 |
| 6 | 161–163 | 3 |
| 7 | 164–166 | 3 |
| 8 | 167–169 | 3 |
| 9 | 170–172 | 3 |
| 10 | 173–175 | 3 |

Tổng 29 câu. Mỗi tài liệu **90–180 từ**. Dạng tài liệu: email nội bộ, thông báo chính sách, hợp đồng ngắn, báo cáo tài chính, bài báo thương mại, quảng cáo B2B, biên bản họp, bảng giá, lịch trình, khảo sát khách hàng.

**Loại câu hỏi bắt buộc** (trộn lẫn, không chỉ hỏi chi tiết): suy luận (inferred), mục đích (purpose), giọng điệu/thái độ (tone), hàm ý của tác giả, từ vựng trong ngữ cảnh ("The word X in paragraph 2 is closest in meaning to"), NOT/EXCEPT, paraphrase (đáp án diễn đạt lại chứ không lặp nguyên văn). Được phép có vài câu chi tiết (detail) nhưng đáp án phải paraphrase, không chép nguyên văn.

### Part 7 — `part7b.json` (25 câu, n = 176…200)

5 bộ **đa tài liệu** (2–3 documents), mỗi bộ đúng 5 câu:

| Bộ | Câu | Dạng |
|---|---|---|
| 1 | 176–180 | double (email + hoá đơn/đơn hàng) |
| 2 | 181–185 | double (quảng cáo + tin nhắn) |
| 3 | 186–190 | double hoặc triple (lịch + email + phản hồi) |
| 4 | 191–195 | triple (bảng giá + phiếu đăng ký + email) |
| 5 | 196–200 | triple (thông báo + danh sách + email) |

- Mỗi bộ phải có ≥1 câu **phải đối chiếu 2 tài liệu** mới trả lời được (cross-document), ≥1 câu suy luận.
- `passageHtml` gộp tất cả tài liệu vào **một** thẻ bọc ngoài, mỗi tài liệu là một khối `<p>` có tiêu đề `Document 1: …` / `Document 2: …`, ngăn bằng `<hr class="my-2 border-neutral-300">`.

## Ví dụ object bộ tài liệu (Part 7)

```json
{
  "passageTitle": "Questions 147-148 refer to the following e-mail:",
  "passageHtml": "<div class=\"border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3\"><p class=\"font-bold text-center text-base\">MEMORANDUM</p><hr class=\"my-2 border-neutral-300\"><p class=\"mt-2\">To: All department heads<br>From: Office of the CFO<br>Re: Q3 capital expenditure</p><p class=\"mt-2\">…</p></div>",
  "questions": [
    { "n": 147, "q": "What is the primary purpose of the memorandum?", "options": ["…","…","…","…"], "answer": "B", "translation": "…", "explanation": "…", "vocab": [["…","…","…"]] }
  ]
}
```

## Tự kiểm tra trước khi kết thúc

Chạy (thay tên file của mình):

```powershell
node -e "const d=require('./tools/lv5-content/part5.json');const n=d.map(x=>x.n);console.log('count',d.length,'range',Math.min(...n),Math.max(...n),'dups',n.length-new Set(n).size);d.forEach(x=>{if(!/^[ABCD]$/.test(x.answer))throw new Error('bad answer '+x.n);if(x.options.length!==4)throw new Error('bad options '+x.n);if(!x.translation||!x.explanation)throw new Error('missing text '+x.n);if(x.vocab.length<3)throw new Error('bad vocab '+x.n)})"
```

Phải in ra `count 30 range 101 130 dups 0` (Part 6: 16 câu, 131–146; Part 7a: 29 câu, 147–175; Part 7b: 25 câu, 176–200 — với Part 6/7 kiểm tra thêm `questions` bên trong từng bộ).
