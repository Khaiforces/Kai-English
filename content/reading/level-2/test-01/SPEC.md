# SPEC — Nội dung "Luyện đọc Level 2 (400–550) – Test 01"

Mục tiêu: 100 câu Reading (Part 5: 30, Part 6: 16, Part 7: 54) đánh số **101–200**, mức **A2–B1 / TOEIC 400–550**.
Mỗi người soạn ghi **1 file JSON** đúng schema dưới đây, không sửa file khác.

## Mức độ (quan trọng)

- **Level 2 (đề này):** câu ngắn–vừa, ngữ pháp cơ bản vững, từ vựng công sở quen thuộc hằng ngày.
- **Dễ hơn Level 5/6, khó hơn Level 1:** câu Part 5 dài **12–22 từ**; mỗi câu chỉ kiểm tra **một** điểm ngữ pháp/từ vựng; không đảo ngữ, không giả định cách, không câu điều kiện loại 3, không mệnh đề quan hệ có giới từ.
- Soạn mới hoàn toàn: **không** chép lại câu/đoạn của Level 1, 5, 6 trong repo và không chép đề ETS.

## Quy tắc chung

- Đề bằng **tiếng Anh**; `translation` + `explanation` bằng **tiếng Việt**.
- Mỗi câu có đúng 4 phương án, 1 đáp án đúng, 3 nhiễu **hợp lý** (sai thì, sai dạng từ, sai giới từ, lệch nghĩa nhẹ). Không có phương án vô lý quá dễ loại.
- `vocab`: **3 mục**, mỗi mục `["word", "pos", "meaning"]` — từ/cụm thực sự xuất hiện trong câu hoặc đoạn, `pos` viết ngắn (`n`, `v`, `adj`, `adv`, `prep`).
- Chủ đề: văn phòng, tuyển dụng, đặt hàng, giao hàng, lịch họp, hoá đơn, khách hàng, du lịch công tác, đào tạo, nhà kho. Không chủ đề nhạy cảm.
- `translation` = dịch nghĩa câu/đoạn liên quan; `explanation` = 1–3 câu tiếng Việt, nêu rõ căn cứ ngữ pháp hoặc dẫn chứng trong bài (trích cụm tiếng Anh).
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

## Schema JSON

### Part 5 — `part5.json` (30 câu, n = 101…130)

Mảng đúng 30 object:

```json
{
  "n": 101,
  "q": "Ms. Chen _______ the monthly report before every team meeting.",
  "options": ["review", "reviews", "reviewed", "reviewing"],
  "answer": "B",
  "translation": "Cô Chen xem lại báo cáo tháng trước mỗi cuộc họp nhóm.",
  "explanation": "Chủ ngữ số ít 'Ms. Chen' + 'before every team meeting' (thói quen) nên dùng hiện tại đơn 'reviews'.",
  "vocab": [
    ["review", "v", "xem lại, kiểm tra"],
    ["monthly", "adj", "hàng tháng"],
    ["report", "n", "báo cáo"]
  ]
}
```

**Trải đều các điểm ngữ pháp sau** (mỗi điểm ít nhất 1 câu): hiện tại đơn (chia -s/es), hiện tại tiếp diễn, quá khứ đơn, hiện tại hoàn thành (`for/since/just/already/yet`), tương lai `will` / `be going to`, bị động cơ bản (`is/are/was/were + V3`), động từ khuyết thiếu (`can, must, should, have to, may`), so sánh hơn/nhất, đại từ quan hệ cơ bản (`who, which, that`), liên từ (`and, but, because, so, although, while`), giới từ chỉ thời gian/nơi chốn (`in, on, at, by, until, during, between`), danh từ đếm được/không đếm được (`much, many, a few, a little`), mạo từ `a/an/the`, danh động từ vs động từ nguyên mẫu (`enjoy/like + V-ing`, `want/need/plan + to V`), dạng từ cơ bản (danh từ ↔ tính từ ↔ trạng từ), đại từ/từ hạn định, sự hoà hợp chủ–vị.

### Part 6 — `part6.json` (16 câu, n = 131…146; 4 đoạn, mỗi đoạn 4 câu)

Mảng đúng 4 object:

```json
{
  "passageTitle": "Questions 131-134 refer to the following e-mail:",
  "passageHtml": "<div class=\"…\">… <strong>[131]</strong> …</div>",
  "questions": [ { "n": 131, "q": "Select the best answer to complete blank [131].", "options": ["…","…","…","…"], "answer": "C", "translation": "…", "explanation": "…", "vocab": [["word","pos","meaning"]] } ]
}
```

- Dải số: đoạn 1 = 131–134, đoạn 2 = 135–138, đoạn 3 = 139–142, đoạn 4 = 143–146.
- Mỗi đoạn **90–130 từ**, văn bản công sở đơn giản: email nội bộ, thông báo, ghi chú cuộc họp, thư mời, cập nhật lịch làm việc.
- Mỗi đoạn: 3 câu ngữ pháp/từ vựng + **1 câu chèn câu** (câu đúng khớp mạch văn trước/sau; 3 nhiễu lạc chủ đề hoặc sai liên kết).
- `passageHtml` phải có đúng các mốc `<strong>[131]</strong>` … `<strong>[134]</strong>` (tương tự các đoạn sau).

### Part 7 — `part7a.json` (29 câu, n = 147…175)

10 bộ tài liệu **đơn**, số câu mỗi bộ:

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

Tổng 29 câu. Mỗi tài liệu **60–120 từ**. Dạng: email, thông báo, hoá đơn ngắn, bảng giá, lịch trình, quảng cáo nhỏ, biên bản họp ngắn, khảo sát khách hàng.

**Loại câu hỏi:** chủ yếu là chi tiết (đáp án **paraphrase**, không chép nguyên văn), xen kẽ mục đích, ý chính, NOT/EXCEPT, từ vựng trong ngữ cảnh ("The word X in paragraph 1 is closest in meaning to"), suy luận đơn giản.

### Part 7 — `part7b.json` (25 câu, n = 176…200)

5 bộ **đa tài liệu** (2–3 tài liệu), mỗi bộ đúng 5 câu:

| Bộ | Câu | Dạng |
|---|---|---|
| 1 | 176–180 | double (email + hoá đơn/đơn hàng) |
| 2 | 181–185 | double (quảng cáo + tin nhắn) |
| 3 | 186–190 | double hoặc triple (lịch + email + phản hồi) |
| 4 | 191–195 | triple (bảng giá + phiếu đăng ký + email) |
| 5 | 196–200 | triple (thông báo + danh sách + email) |

- Mỗi bộ có ≥1 câu **phải đối chiếu 2 tài liệu** mới trả lời được, ≥1 câu suy luận.
- `passageHtml` gộp tất cả tài liệu vào **một** thẻ bọc ngoài, mỗi tài liệu là một khối `<p>` có tiêu đề `Document 1: …` / `Document 2: …`, ngăn bằng `<hr class="my-2 border-neutral-300">`.

## Ví dụ object bộ tài liệu (Part 7)

```json
{
  "passageTitle": "Questions 147-148 refer to the following e-mail:",
  "passageHtml": "<div class=\"border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3\"><p class=\"font-bold text-center text-base\">E-MAIL</p><hr class=\"my-2 border-neutral-300\"><p class=\"mt-2\">To: All staff<br>From: Human Resources<br>Re: Summer schedule</p><p class=\"mt-2\">…</p></div>",
  "questions": [
    { "n": 147, "q": "What is the purpose of the e-mail?", "options": ["…","…","…","…"], "answer": "B", "translation": "…", "explanation": "…", "vocab": [["word","pos","meaning"]] }
  ]
}
```

## Tự kiểm tra trước khi kết thúc

Chạy (thay tên file của mình):

```powershell
node -e "const d=require('./tools/lv2-content/part5.json');const n=d.map(x=>x.n);console.log('count',d.length,'range',Math.min(...n),Math.max(...n),'dups',n.length-new Set(n).size);d.forEach(x=>{if(!/^[ABCD]$/.test(x.answer))throw new Error('bad answer '+x.n);if(x.options.length!==4)throw new Error('bad options '+x.n);if(!x.translation||!x.explanation)throw new Error('missing text '+x.n);if(x.vocab.length<2)throw new Error('bad vocab '+x.n)})"
```

Phải in ra `count 30 range 101 130 dups 0` (Part 6: 16 câu, 131–146; Part 7a: 29 câu, 147–175; Part 7b: 25 câu, 176–200 — với Part 6/7 kiểm tra thêm `questions` bên trong từng bộ).
