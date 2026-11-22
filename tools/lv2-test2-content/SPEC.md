# SPEC — Nội dung "Luyện đọc Level 2 (400–550) – Test 02"

Mục tiêu: 100 câu Reading (Part 5: 30, Part 6: 16, Part 7: 54) đánh số **101–200**, mức **A2–B1 / TOEIC 400–550**.
Mỗi người soạn ghi **1 file JSON** đúng schema dưới đây, **không sửa file nào khác**.

> Đây là **đề Test 02**, phải soạn mới hoàn toàn. Không chép câu/đoạn của `tools/lv2-content/` (Test 01), của Level 1/4/5/6, và không chép đề ETS.

## Mức độ (quan trọng)

- Câu ngắn–vừa, ngữ pháp cơ bản vững, từ vựng công sở quen thuộc hằng ngày.
- Câu Part 5 dài **12–22 từ**; mỗi câu chỉ kiểm tra **một** điểm ngữ pháp/từ vựng; **không** đảo ngữ, không giả định cách (subjunctive), không câu điều kiện loại 3, không mệnh đề quan hệ có giới từ.
- 3 phương án nhiễu phải **hợp lý** (sai thì, sai dạng từ, sai giới từ, lệch nghĩa nhẹ). Không có phương án vô lý quá dễ loại.

## Quy tắc chung

- Đề bằng **tiếng Anh**; `translation` + `explanation` bằng **tiếng Việt** có dấu đầy đủ.
- Mỗi câu đúng 4 phương án, 1 đáp án đúng.
- `vocab`: **3 mục**, mỗi mục `["word", "pos", "meaning"]` — từ/cụm thực sự xuất hiện trong câu hoặc đoạn, `pos` viết ngắn (`n`, `v`, `adj`, `adv`, `prep`).
- Trong `explanation` **không** viết "đáp án (A)/(B)/(C)/(D)" theo chữ cái (builder xáo lại vị trí đáp án); gọi tên phương án bằng nội dung.
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

```json
{
  "n": 101,
  "q": "Ms. Chen _______ the monthly report before every team meeting.",
  "options": ["review", "reviews", "reviewed", "reviewing"],
  "answer": "B",
  "translation": "Cô Chen xem lại báo cáo tháng trước mỗi cuộc họp nhóm.",
  "explanation": "Chủ ngữ số ít 'Ms. Chen' + 'before every team meeting' (thói quen) nên dùng hiện tại đơn 'reviews'.",
  "vocab": [["review","v","xem lại, kiểm tra"],["monthly","adj","hàng tháng"],["report","n","báo cáo"]]
}
```

**Trải đều các điểm ngữ pháp sau** (mỗi điểm ít nhất 1 câu): hiện tại đơn (chia -s/es), hiện tại tiếp diễn, quá khứ đơn, hiện tại hoàn thành (`for/since/just/already/yet`), tương lai `will` / `be going to`, bị động cơ bản (`is/are/was/were + V3`), động từ khuyết thiếu (`can, must, should, have to, may`), so sánh hơn/nhất, đại từ quan hệ cơ bản (`who, which, that`), liên từ (`and, but, because, so, although, while`), giới từ chỉ thời gian/nơi chốn (`in, on, at, by, until, during, between`), danh từ đếm được/không đếm được (`much, many, a few, a little`), mạo từ `a/an/the`, danh động từ vs động từ nguyên mẫu (`enjoy/like + V-ing`, `want/need/plan + to V`), dạng từ cơ bản (danh từ ↔ tính từ ↔ trạng từ), đại từ/từ hạn định, sự hoà hợp chủ–vị.

### Part 6 — `part6.json` (16 câu, n = 131…146; 4 đoạn, mỗi đoạn 4 câu)

- Dải số: đoạn 1 = 131–134, đoạn 2 = 135–138, đoạn 3 = 139–142, đoạn 4 = 143–146.
- Mỗi đoạn **90–130 từ**, mỗi đoạn 3 câu ngữ pháp/từ vựng + **1 câu chèn câu** (câu thứ 4) dạng `"Which of the following sentences best fits in blank [n]?"`.
- `passageHtml` phải có đúng các mốc `<strong>[131]</strong>` … `<strong>[146]</strong>` tương ứng.
- 4 loại văn bản: (1) email nội bộ về phòng nghỉ/tiện ích văn phòng, (2) thông báo đăng ký khóa đào tạo an toàn lao động, (3) biên bản họp nhóm dự án, (4) thư mời dự lễ khai trương chi nhánh.

### Part 7 — `part7a.json` (29 câu, n = 147…175)

10 bộ tài liệu **đơn**, số câu mỗi bộ: bộ 1 = 2 câu (147–148); bộ 2–10 = 3 câu (149–151, 152–154, 155–157, 158–160, 161–163, 164–166, 167–169, 170–172, 173–175).

Mỗi tài liệu **60–120 từ**. 10 dạng (không trùng Test 01), theo thứ tự:
1. email mời họp kèm chương trình họp
2. bảng giá dịch vụ vận chuyển
3. thông báo tuyển dụng tài xế giao hàng
4. lịch bảo trì thiết bị văn phòng
5. phiếu đăng ký khóa học ngắn hạn
6. thông báo chuyển địa điểm chi nhánh
7. báo giá sửa chữa thiết bị
8. quảng cáo dịch vụ photocopy/giặt khô
9. biên bản họp ban an toàn
10. chính sách hoàn tiền vé

**Loại câu hỏi:** chủ yếu chi tiết (đáp án **paraphrase**, không chép nguyên văn), xen kẽ mục đích, ý chính, NOT/EXCEPT, từ vựng trong ngữ cảnh, suy luận đơn giản.

### Part 7 — `part7b.json` (25 câu, n = 176…200)

5 bộ **đa tài liệu**, mỗi bộ đúng 5 câu:
1. 176–180 — double: đơn đặt hàng + email xác nhận giao hàng
2. 181–185 — double: quảng cáo khóa học + tin nhắn đăng ký
3. 186–190 — double: danh sách phòng + email đặt phòng + xác nhận (3 tài liệu)
4. 191–195 — triple: bảng giá + phiếu đăng ký + email
5. 196–200 — triple: thông báo + danh sách nhân viên + email

- Mỗi bộ có **≥1 câu phải đối chiếu 2 tài liệu** mới trả lời được, ≥1 câu suy luận, ≥1 câu NOT/EXCEPT hoặc từ vựng trong ngữ cảnh.
- `passageHtml` gộp tất cả tài liệu vào **một** thẻ bọc ngoài, mỗi tài liệu là một khối `<p>` có tiêu đề `Document 1: …` / `Document 2: …`, ngăn bằng `<hr class="my-2 border-neutral-300">`.

## Tự kiểm tra trước khi kết thúc

```powershell
node -e "const d=require('./tools/lv2-test2-content/part5.json');const n=d.map(x=>x.n);console.log('count',d.length,'range',Math.min(...n),Math.max(...n),'dups',n.length-new Set(n).size);d.forEach(x=>{if(!/^[ABCD]$/.test(x.answer))throw new Error('bad answer '+x.n);if(x.options.length!==4)throw new Error('bad options '+x.n);if(!x.translation||!x.explanation)throw new Error('missing text '+x.n);if(x.vocab.length<3)throw new Error('bad vocab '+x.n)})"
```

Phải in `count 30 range 101 130 dups 0`. Với Part 6/7 kiểm tra thêm `questions` bên trong từng bộ.