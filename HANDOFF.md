# Bộ 3 đề TOEIC tự soạn (600 câu) + audio neural TTS + ảnh Part 1

Cập nhật: 10/11/2026

## Thành phẩm

| Đề | Câu | Listening có audio | Reading | Ghi chú |
|---|---|---|---|---|
| `ets-orig-test-1` | 200 | 100/100 | 100 | 6 ảnh Part 1; 2 đoạn Part 3 có 3 người nói |
| `ets-orig-test-2` | 200 | 100/100 | 100 | 6 ảnh Part 1; 2 đoạn Part 3 có 3 người nói |
| `ets-orig-test-3` | 200 | 100/100 | 100 | 6 ảnh Part 1; 2 đoạn Part 3 có 3 người nói |

- Cấu trúc: Part 1 (6) · Part 2 (25) · Part 3 (39) · Part 4 (30) · Part 5 (30) · Part 6 (16) · Part 7 (54).
- Mỗi câu có đáp án, bản dịch tiếng Việt, giải thích tiếng Việt và 3–5 từ vựng.
- Nội dung **nguyên bản**, không sao chép đề ETS/Barrons.

## Audio

- 162 file MP3, 33,6 MB, trong `assets/audio/tests/test-01..03/` (54 file/đề).
- 100/100 câu Listening mỗi đề có `audioUrl`; Part 3/4 dùng chung file theo nhóm.
- 12 giọng neural US/UK/AU/CA xoay ngẫu nhiên: nam đọc lời dẫn + nhân vật nam, nữ đọc phương án A–D + nhân vật nữ; Part 4 xen kẽ nam/nữ.
- Đoạn hội thoại 3 người dùng thêm `Man 2` / `Woman 2` với giọng khác.
- Seed theo tên file → chạy lại cho ra đúng giọng cũ.

## Ảnh Part 1

- 18 ảnh (6 ảnh × 3 đề) tại `assets/images/test-0{1,2,3}/part1/q{1..6}.jpg` — grayscale, 4:3, 960×720, tổng 2,4 MB.
- Nguồn Wikimedia Commons (CC BY 2.0 / CC BY 4.0 / CC0 / Public domain); credit lưu ở `assets/images/test-01/part1/credits.json` và hiển thị dưới ảnh trong phòng thi.
- Phương án + giải thích 6 câu/đề đã viết lại cho khớp ảnh; audio Part 1 đã tạo lại.

## Cách dùng

Mở `index.html` → mục **Thi thử** → chọn 1 trong 3 đề. Audio phát bằng thẻ `<audio>` (file MP3), không phụ thuộc giọng trình duyệt.

## Cấu trúc file

- `content/test-N/p1..p7b.json` — nội dung đề (nguồn).
- `content/test-N/audio-manifest.json` — map `questionId → audioUrl` (100 mục/đề).
- `assets/audio/tests/test-0N/*.mp3` — audio.
- `assets/images/test-0N/part1/*.jpg` — ảnh Part 1.
- `mock_tests_data.js` — dữ liệu app đọc (`window.DAU_DATA.mockTests`), sinh bởi `tools/build_tests.js`.
- `tools/build_audio.py` — sinh audio (edge-tts + ffmpeg tĩnh), có retry, fallback giọng và resume.
- `tools/build_tests.js` — ghép nội dung + manifest → `mock_tests_data.js`.
- `tools/add_third_speaker.js` — thêm nhân vật thứ ba vào các đoạn Part 3 được chọn.
- `tools/add_part1_photos.js` — gắn ảnh + viết lại phương án Part 1.
- `AGENTS.md` — quy tắc làm việc & bản đồ dự án (nguồn quy tắc duy nhất).
- `voice-samples.html`, `part1-photos.html` — trang xem nhanh.

## Lệnh thường dùng

```powershell
python tools\build_audio.py 1 2 3   # tạo/tiếp tục audio (bỏ qua file đã có)
node tools\build_tests.js 1 2 3     # build lại mock_tests_data.js
node --check app.js
```

## Lưu ý

- Bản backup gốc trước khi xoá: `H:\Workspace\dauenglish-20261108T190212Z-1-001.zip`.
- `app.js` phát `<audio>` khi câu hỏi có `audioUrl`; nếu thiếu file thì fallback TTS trình duyệt.
- Sửa `options`/`audioScript` của Part 1–4 thì phải xoá MP3 cũ và chạy lại `build_audio.py`, nếu không audio sẽ lệch đề.

## Luyện nghe — màn chọn chức năng / Test / Part (11/11/2026)

- Một màn duy nhất (`renderListeningSelection`): 2 nút chức năng cạnh nhau (`Nghe chép` mặc định, `Chọn ABCD`) → bên dưới là 10 khối Test, mỗi khối là hàng 4 ô Part 1–4 lớn; bấm 1 ô Part để vào bài luyện.
- Hàm mới trong `app.js`: `renderListeningSelection`, `getListeningTestRows`, `countListeningDone`, `getListeningModeMeta`, `selectListeningMode`, `selectListeningTestPart`, `backToListeningTests`; state mới `listeningMode` (mặc định `"dictation"`), `listeningTestId`.
- Màn luyện tập là **chế độ làm bài toàn màn hình** (xem mục dưới).
- `getFilteredListeningExercises()` lọc thêm theo `etsTestId` → mọi thao tác trong bài (dictation, ABCD, câu trước/sau, chip Part) chỉ còn phạm vi Test + Part đang chọn.
- Test 1–3 có dữ liệu (100 câu/Test, Part 1: 6 · Part 2: 25 · Part 3: 39 · Part 4: 30); Test 4–10 hiển thị ô Part khoá "Chưa có dữ liệu".

### Chế độ làm bài toàn màn hình (12/11/2026)
- Bấm một ô Part → `renderListeningPractice` gọi `setListeningImmersive(true)` → thêm `body.listening-immersive`.
- CSS trong `index.html` ẩn `#top-promo-bar`, `header`, `footer`, `#left-sidebar`, `#mobile-menu`, `#focus-mode-toggle`; `#app-main` rộng 100%.
- Thanh trên cùng của bài (sticky) chỉ còn: nút **Thoát**, tên `chức năng • Test • Part`, 4 chip `P1–P4` (đổi Part, dùng `replace` history) và bộ đếm `Câu x/y`.
- Đã bỏ `renderListeningFilterBar`, `applyListeningFilters`, `setListeningPartFilter` (không còn dùng) và phần hero/breadcrumb cũ.
- Về màn chọn hoặc chuyển view khác → `setListeningImmersive(false)` (gọi trong `navigate()` và nhánh render màn chọn) → header/menu/footer hiện lại.

### Nút Trở về / Back của trình duyệt
- Mở một Part → `saveListeningHistoryState(true)` ghi `history.state.dauenglishListening = { mode, testId, part }` (cùng URL `#listening`). Nhờ vậy **Back của trình duyệt quay về trang trước đó** (màn chọn Test/Part), không nhảy ra Trang chủ.
- `handleHistoryChange` / `handleLocationChange` / `init` đọc lại state này qua `restoreListeningHistoryState(saved)` → khôi phục đúng chức năng, Test, Part (kể cả khi F5).
- Nút "Thoát" trong bài gọi `history.back()` khi entry hiện tại là bài luyện; nếu không thì về màn chọn trực tiếp.

### Âm thanh luyện nghe dùng MP3 neural (13/11/2026)
- Trước đây luyện nghe đọc bằng Web Speech (giọng trình duyệt); nay phát file MP3 trong `assets/audio/tests/...` qua `playListeningMp3()` với **một thẻ `Audio` tái sử dụng** (`app.listeningAudioEl`).
- Áp dụng cho: player Nghe chép (phát/tạm dừng, tốc độ 0.75x, "Tự lặp") và nút "Nghe audio câu hỏi" của Chọn ABCD.
- `stopSpeech()` giờ dừng cả MP3 (pause + currentTime 0) và `speakText()` tạm dừng MP3 để không chồng tiếng.
- Câu không có `audioUrl` → tự fallback Web Speech như cũ.
- **Part 1:** mỗi câu chỉ có 1 file MP3 gồm narrator + 4 phương án A–D (không có file riêng từng phương án), nên khi luyện điền từ theo từng phương án thì audio phát toàn bộ câu hỏi.
- Nút loa cạnh từng phương án trong Chọn ABCD vẫn dùng Web Speech vì không có file riêng.
- Đã tách `highlightNav(view)` khỏi `navigate()` để khi back về bài luyện, thanh điều hướng vẫn highlight đúng mục.

## Tách riêng mục Luyện nghe & thêm Test 04 (14/11/2026)
- Tạo mới **Test 04** phần Nghe gồm **100 câu** nguyên bản (Part 1: 6 · Part 2: 25 · Part 3: 39 · Part 4: 30) tại `content/test-4/p1..p4.json`, gồm 2 đoạn Part 3 có 3 người nói (`t4-p3-g2`, `t4-p3-g8`) và bảng biểu cho 4 nhóm cuối Part 3/4.
- Sinh **54 file audio MP3** neural TTS cho Test 04 tại `listening/audio/test-04/` và `content/test-4/audio-manifest.json`.
- Tách toàn bộ dữ liệu mục **Luyện nghe** khỏi `mock_tests_data.js` sang thư mục `listening/`:
  - `listening/test-01.js` .. `listening/test-04.js` (mỗi đề 1 file riêng, 100 câu/file, nạp qua `<script>` trong `index.html`).
  - `listening/audio/test-01..04/*.mp3` (audio riêng cho mục Luyện nghe) và `listening/images/test-01..04/part1/q1..6.jpg`.
  - `mock_tests_data.js` chỉ còn chứa `window.DAU_DATA.mockTests` (3 đề full 200 câu cho mục Thi thử).
- `tools/build_tests.js` tự động xuất đồng thời `mock_tests_data.js` (đủ 8 file `p1..p7b`) và `listening/test-0N.js` (đủ 4 file `p1..p4`).
- `tools/build_audio.py` hỗ trợ cờ `--listening` (hoặc tự nhận diện đề chưa có `p5.json`) để ghi MP3 vào `listening/audio/test-0N/`.

## Tách audio từng câu cho Part 1 & Part 2 Nghe chép (14/11/2026)
- Tạo mới `tools/build_option_audio.py` sinh **496 file MP3 đơn câu** tại `listening/audio/test-01..04/` (124 file/đề: 24 phương án A–D Part 1 + 25 câu hỏi `q` & 75 đáp án A–C Part 2), loại bỏ tiền tố `A.`, `B.`, `C.`, `D.` và `Question:`, giữ đồng bộ giọng theo seed `pick_voices`.
- Cập nhật `tools/build_tests.js` gắn `audioUrl` cho từng item trong `practiceOptions` (Part 1 & 2) cùng `questionAudioUrl`, `questionScript`, `questionVi` (Part 2) và rebuild `listening/test-01..04.js`.
- Cập nhật `app.js` (`isSplitDictationPart`, `getListeningPart1OptionExercises`, `playListeningAudio`, `renderListeningPart1ClozeSet`, `getListeningTestRows`, `countListeningDone`, `stepListening`, `selectDictation`, `checkDictation`): chế độ Nghe chép tách Part 1 (24 câu/đề) và Part 2 (100 câu/đề); nút loa từng đáp án ở chế độ Chọn ABCD ưu tiên phát MP3 đơn câu via `playListeningMp3()`.

## Thêm đề Luyện nghe Level 5 – Test 01 (19/11/2026)
- Tạo mới `listening/lv5-test-01.js` (**100 câu**, 101 câu nghe: P1=6, P2=25, P3=39, P4=30), `etsTestId: listening-lv5-test-1`, meta `level: 5` → tự hiện ở tab **Level 5 (800–900)** dòng **Test 01**.
- Nội dung B2–C1: Part 1 không gắn ảnh (`imageUrl` = "", đúng quy định đề nghe mới); Part 2 câu hỏi phủ định/đuôi/gián tiếp; Part 3 13 hội thoại 2 người 101–119 từ; Part 4 10 bài nói 126–140 từ.
- Nguồn nội dung: `tools/listening-lv5-test1-content/p1..p4.json` → `node tools/build_listening_test.js 5 1` (tự xáo đáp án 2/2/1/1, 9/8/8, 10/10/10/9, 7/7/8/8).
- Audio: `python tools/build_level_listening_audio.py 5 1` sinh **178 MP3** (12,9 MB) tại `listening/audio/lv5-test-01/` (124 file câu/phương án + 54 file nhóm).
- `index.html`: thêm `<script src="listening/lv5-test-01.js?v=20261119">` sau `lv3-test-01.js`.
- Kiểm tra: `node --check` OK; 100 câu đúng id, 178/178 `audioUrl` tồn tại trên đĩa, không câu nào có `imageUrl`.

## Thêm đề Luyện đọc Level 3 – Test 02 (20/11/2026)
- Tạo mới `reading/lv3-test-02.js` (**100 câu**, số câu **101–200**: Part 5 = 30, Part 6 = 16, Part 7 = 54), `etsTestId: reading-lv3-test-2`, meta `level: 3` → hiện ở tab **Level 3 (550–700)** dòng **Test 02** (dòng Test 01 của tab này vẫn là file legacy `reading/test-01.js`, meta `reading-test-1` không có `level` nên `(t.level || 3) === 3`).
- Thứ tự nạp trong `index.html`: đặt `lv3-test-02.js` **sau** `reading/test-01.js` vì `getReadingTestRows()` đánh số dòng theo thứ tự mảng `DAU_DATA.etsReadingTests` (không theo `meta.code`); nếu nạp trước, đề mới sẽ chiếm dòng "Test 01".
- Nội dung B1: Part 5 (thì, bị động, so sánh, giới từ, liên từ, đại từ quan hệ, hòa hợp chủ–vị, dạng từ); Part 6 = 4 đoạn × 4 câu, mỗi đoạn 3 câu điền từ + **1 câu chèn câu** (`Which of the following sentences best fits in blank [n]?`); Part 7 = 10 bộ đơn (29 câu) + 5 bộ đa tài liệu (25 câu: 2 bộ 2 tài liệu 176–185, 3 bộ 3 tài liệu 186–200) có câu đối chiếu chéo và tính toán ($2,409; $216; $45).
- Nguồn nội dung: `tools/lv3-test2-content/part5.json`, `part6.json`, `part7a.json`, `part7b.json` → `node tools/build_reading_test.js 3 2`. Đã thêm level 3 vào bảng `LEVELS` của builder (nhãn 550–700, minVocab 2, seed `300000 + n*7919`).
- Kiểm tra: `node --check` OK; audit script → 100 câu đủ 101–200, đáp án **25/25/25/25**, 0 câu hỏi trùng, 0 vocab không xuất hiện trong bài, 0 lỗi HTML/escape, Part 6 đúng 4 đoạn × 4 câu, Part 7 đúng 15 bộ (2,3,3,…,5).

## Thêm đề Luyện đọc Level 4 – Test 01 (19/11/2026)
- Tạo mới `reading/lv4-test-01.js` (**100 câu**, số câu **101–200**: Part 5 = 30, Part 6 = 16, Part 7 = 54), `etsTestId: reading-lv4-test-1`, meta `level: 4` → tự hiện ở tab **Level 4 (700–800)** dòng **Test 01** (9 dòng còn lại vẫn "Chưa có dữ liệu").
- Nội dung B1–B2: hòa hợp chủ–vị, bị động, điều kiện loại 1/2, gerund vs to-infinitive, mệnh đề quan hệ (`whose`, rút gọn phân từ), thì hoàn thành, so sánh, giới từ, liên từ, dạng từ; Part 7 gồm 10 bộ đơn + 5 bộ đa tài liệu (2–3 documents) có câu đối chiếu chéo và suy luận.
- Nguồn nội dung: `tools/lv4-content/part5.json`, `part6.json`, `part7a.json`, `part7b.json` → sinh bằng `node tools/build_reading_test.js 4 1`. Đã thêm level 4 vào bảng `LEVELS` của builder (nhãn 700–800, minVocab 3, seed riêng).
- Gắn `<script src="reading/lv4-test-01.js?v=20261119">` trong `index.html` (giữa `lv2` và `lv5`).
- Kiểm tra: `node --check` OK; nạp bằng `vm` → 100 câu, đủ 101–200, không trùng id, phân bố đáp án 25/25/25/25, mọi câu có `translation`/`explanation`/`vocab` 3 mục.
- **Rà soát ngữ nghĩa 19/11/2026** (sửa tại file nguồn rồi build lại, không sửa file build):
  - Part 5: 130 đổi nhiễu `does` → `were` (A cũng đúng), 108 `for approving` → nhiễu `to approve`, 111 `hire staff to` → `for the team`, 107 `worked for` → `at the Singapore office`, 114 nghĩa vocab `remain`.
  - Part 6: 139 (nặng) nhiễu `had increased` cũng đúng → `would increase`, đổi `spring` → `winter campaign`; 137 (vừa) logic ngược "bến 60 chỗ khuyến khích đến trước 8h" → `after 8:00 a.m.`; 133 "phát bản giấy tại cửa" → "A draft agenda is attached"; 141 bỏ "the new approach" không tiền ngữ; sửa giải thích 136/143/137, dịch 132, 145.
  - Part 7 đơn: 147–148 `March 12` (thứ Tư) → `March 11` (thứ Ba); thêm `Invoice date: March 3` cho hóa đơn 152–154 (vì có "within 30 days of the invoice date"); 164 nói rõ chỉ giờ ĐÓNG muộn hơn 2 tiếng; 149–151 thêm "separate water line" (nước ngắt toàn tòa mà nhà vệ sinh vẫn mở); 158–160 bỏ "coffee during the morning break" (lịch không có giờ nghỉ); 170–172 nhiễu "Visit the storage room" cũng đúng → "Return the eight boxes to the printer"; vocab 155 `hourly` → `reservation`.
  - Part 7 đa: 187 (nặng) hai đáp án cùng đúng → đáp án còn `The keynote address`; 177 đổi thành câu ghép email ($189) + hóa đơn (24 chiếc) = $4,536; 197 (bộ 3 tài liệu) đổi thành câu ghép quy tắc đóng gói + ngày khởi công từng suite (bảng thêm cột `Work begins`); 198 bỏ "on short notice"; 194 nói rõ tờ rơi sai giờ nào; bổ sung To/From/Date cho email; bỏ `<hr>` thừa dưới tiêu đề DOCUMENT 1; đổi tiêu đề 181/196/176/191 cho khỏi trùng mẫu 161/149/147; vocab trùng trong cùng bộ (181/182 `trial`, 182/184 `cover a shift`, 191/192 `surcharge`) → thay từ khác.
  - Kết quả: `node tools/build_reading_test.js 4 1` → 100 câu, 25/25/25/25; audit 0 lỗi cấu trúc, 0 câu hỏi trùng, 0 nghi lộ đáp án do độ dài.

## Thêm đề Luyện đọc Level 6 – Test 01 (16/11/2026)
- Tạo mới `reading/lv6-test-01.js` (**100 câu**, số câu **101–200**: Part 5 = 30, Part 6 = 16, Part 7 = 54), `etsTestId: reading-lv6-test-1`, meta `level: 6` → tự hiện ở tab **Level 6 (900–990)** dòng **Test 01** (9 dòng còn lại vẫn "Chưa có dữ liệu").
- Nội dung C1–C2: đảo ngữ điều kiện loại 3/hỗn hợp, `Not only… but also`, `Rarely/Nor` đảo ngữ, giả định cách (`require that… be approved`), `Only after… did`, `So committed was… that`, bị động hoàn thành, `Notwithstanding / provided that / contingent on`; Part 7 gồm 10 bộ đơn + 5 bộ đa tài liệu (2–3 documents), có câu suy luận/hàm ý/đối chiếu chéo.
- Nguồn nội dung: `tools/lv6-content/part5.json`, `part6.json`, `part7a.json`, `part7b.json` (+ `SPEC.md`) → sinh bằng `node tools/build_reading_lv6_test1.js` (validate 100 câu, dải 101–200, đủ 4 phương án, trộn đáp án A/B/C/D = 25/25/25/25). **Không sửa tay** file đã sinh.
- Gắn `<script src="reading/lv6-test-01.js">` trong `index.html` (ngay sau `reading/lv1-test-01.js`). Không đụng `app.js`/`data.js`/`reading/lv1-test-01.js`.
- Đã QA 100/100 câu: sửa 2 lỗi (101 thiếu chỗ trống, 146 có 2 đáp án cùng đúng); nâng độ khó 4 câu quá dễ (110, 119, 126, 127). Còn ~15 câu thiên B2 (chủ yếu câu hỏi mục đích Part 7 và vài câu word form Part 6) — chấp nhận được nhưng có thể nâng tiếp.
- Kiểm tra: `node --check reading/lv6-test-01.js`, nạp bằng `vm` cùng `lv1` → 200 exercise, không trùng id, không lộ đáp án trong câu hỏi Part 5/6.

## Thêm đề Luyện đọc Level 5 – Test 01 (16/11/2026)
- Tạo mới `reading/lv5-test-01.js` (**100 câu**, số câu **101–200**: Part 5 = 30, Part 6 = 16, Part 7 = 54), `etsTestId: reading-lv5-test-1`, meta `level: 5` → tự hiện ở tab **Level 5 (800–900)** dòng **Test 01** (9 dòng còn lại "Chưa có dữ liệu").
- Nội dung B2–C1 (thấp hơn Level 6, tránh đảo ngữ hiếm/giả định cách C2): mệnh đề quan hệ, điều kiện loại 2/3, thì hoàn thành, bị động + modal phỏng đoán, liên từ tương phản–nguyên nhân–hệ quả, phrasal verbs & collocation business, gerund vs infinitive, word form khó, `with a view to + V-ing`, `in the event that`; Part 7 gồm 10 bộ đơn + 5 bộ đa tài liệu (2–3 documents), trộn câu suy luận/mục đích/giọng điệu/từ vựng/NOT-EXCEPT/paraphrase.
- Nguồn nội dung: `tools/lv5-content/part5.json`, `part6.json`, `part7a.json`, `part7b.json` (+ `SPEC.md`) → sinh bằng `node tools/build_reading_lv5_test1.js` (validate 100 câu, dải 101–200, trộn đáp án 25/25/25/25). **Không sửa tay** file đã sinh.
- Gắn `<script src="reading/lv5-test-01.js">` trong `index.html` (giữa `lv1` và `lv6`). Không đụng `app.js`/`data.js`.
- Đã QA 100/100 câu: **0 lỗi cứng**; nâng độ khó 3 câu quá dễ (118 `avoid + V-ing` → `with a view to`, 119 `decide to` → `in the event that`, 170 câu tra vị trí → câu suy luận). Không có câu quá khó C2.
- Kiểm tra: `node --check reading/lv5-test-01.js`, nạp bằng `vm` cùng `lv1`+`lv6` → 300 exercise, không trùng id.

## Gộp builder luyện đọc thành 1 file (17/11/2026)
- Trước: `build_reading_lv5_test1.js` (232 dòng) + `build_reading_lv6_test1.js` (232 dòng) + `build_reading_lv1_from_content.js` (184 dòng) trùng logic ~90%.
- Nay: **một** builder duy nhất [tools/build_reading_test.js](tools/build_reading_test.js) (252 dòng): `node tools/build_reading_test.js <level> [test...]`
  - `node tools/build_reading_test.js 5` → `reading/lv5-test-01.js`
  - `node tools/build_reading_test.js 1 2 3` → `reading/lv1-test-02.js`, `lv1-test-03.js`
  - Nội dung: `tools/lv{N}-test{T}-content/` nếu có, ngược lại `tools/lv{N}-content/`; output `reading/lv{N}-test-{NN}.js`.
  - Khác biệt giữa level nằm trong bảng `LEVELS`: nhãn điểm (300–400 / 800–900 / 900–990), `minVocab`, `seed` lịch đáp án, danh sách từ khoá được bảo vệ khi đổi chữ cái A/B/C/D trong giải thích (`Part A`, `Room B`…).
- 3 file cũ thành **wrapper 5–12 dòng** gọi builder chung → lệnh cũ vẫn chạy y nguyên.
- Đối chứng: build lại 4 đề (`lv1-test-02/03`, `lv5/lv6-test-01`) — giống **100%** bản cũ, chỉ khác 1 dòng comment tên builder trong file sinh ra (đã so hash + so từng field JSON).
- Không dùng chung: `build_reading_lv1_test1.js` (977 dòng) và `build_reading_test1.js` (1007 dòng) vì nội dung hard-code trong file, không đọc từ JSON.

## Thêm đề Luyện nghe Level 3 - Test 01 (17/11/2026)
- Nội dung: [tools/listening-lv3-test1-content/](tools/listening-lv3-test1-content/) `p1..p4.json` (6 + 25 + 39 + 30 = 100 câu, độ khó 550–700).
- Đúng quy tắc mới: **không ảnh** (`imageUrl`/`imageType` rỗng trong file build), chỉ câu hỏi + audio neural TTS.
- Build: `node tools/build_listening_test.js 3 1` → `listening/lv3-test-01.js` (322 KB), `node --check` OK.
- Audio: `python tools/build_level_listening_audio.py 3 1` → `listening/audio/lv3-test-01/` **178 file MP3** (124 câu lẻ + 54 clip trọn câu/nhóm, 13,2 MB), 0 file lỗi.
- `index.html`: thêm `<script src="listening/lv3-test-01.js?v=20261117"></script>`.
- Kiểm tra: nạp file bằng `window` giả → đúng meta `{id: listening-lv3-test-1, level: 3}`, 100 exercise, mọi `audioUrl` (178) tồn tại, đáp án rải 28/27/27/18.
- `app.js` không phải sửa: `getListeningTestRows` tự lọc `etsListeningTests` theo `level`.

## Thêm đề Luyện đọc Level 2 - Test 01 (18/11/2026)
- Nội dung: [tools/lv2-content/](tools/lv2-content/) `SPEC.md` + `part5.json` (30), `part6.json` (4 đoạn × 4 = 16), `part7a.json` (10 bộ = 29), `part7b.json` (5 bộ × 5 = 25) — 100 câu 101–200, mức A2–B1 (400–550).
- `tools/build_reading_test.js`: thêm `LEVELS[2]` (label `400–550`, `minVocab: 2`, seed `200000 + num*7919`).
- Build: `node tools/build_reading_test.js 2` → `reading/lv2-test-01.js` (182 KB): Part 5/6/7 = 30/16/54, phân bố đáp án A/B/C/D = 25/25/25/25.
- `index.html`: thêm `<script src="reading/lv2-test-01.js"></script>` (sau `lv1-test-03.js`).
- `app.js` không phải sửa: UI đã có sẵn nút Level 2 (400–550), `getReadingTestRows` tự lọc `etsReadingTests` theo level → Test 02–10 hiện "Chưa có dữ liệu".
- Kiểm tra: `node --check reading/lv2-test-01.js` OK; nạp bằng `vm` cùng `lv1` → 200 exercise, `id` không trùng, 100 câu đủ 101–200, mọi câu có `translation`/`explanation`/`vocab` 3 mục, `passageHtml` 15 bộ Part 7 cân thẻ `div`, có mốc `[n]` Part 6.
- Lưu ý: 4 file nội dung do subagent soạn; 3 phiên báo lỗi "model tạm thời chưa khả dụng" sau khi đã ghi xong file — nội dung vẫn đủ, đã kiểm tra lại toàn bộ.
- Rà soát chất lượng (18/11/2026): đã đọc lại toàn bộ 100 câu (đề + 4 phương án + giải thích), sửa 5 điểm:
  - Part 5 #102: `this afternoon` → `right now` (bỏ khả năng chọn `attended` ở quá khứ).
  - Part 5 #124: thêm `Next month` (bỏ khả năng chọn `had to`).
  - Part 5 #125: đổi nhiễu `most simple` → `simply` (`most simple` cũng đúng ngữ pháp).
  - Part 6 #137: sửa lỗi chính tả "mắt nối" → "cầu nối".
  - Part 7b: thống nhất tiêu đề `Questions 176-180 …:` (gạch nối + dấu hai chấm), đổi stem #176 thành "Why did Ms. Park write to North Peak Furniture?" (trùng stem với #147), đổi nhãn trùng trong phiếu đặt phòng `Room: $160` → `Room rental: $160`.
- Đã build lại: `reading/lv2-test-01.js` (182,1 KB), `node --check` OK, 100 câu, đáp án 25/25/25/25.
- Đã đối chiếu chéo: mọi chữ cái A–D nhắc trong `explanation` khớp đáp án sau khi builder hoán vị; 100/100 câu đủ `translation`/`explanation`/`vocab`.

## Thêm đề Luyện nghe Level 2 - Test 01 (19/11/2026)
- Nội dung: [tools/listening-lv2-test1-content/](tools/listening-lv2-test1-content/) `p1..p4.json` (Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 đoạn × 3], Part 4 = 30 [10 bài × 3] — 100 câu mức A2–B1 / 400–550).
- Đúng quy tắc 10 trong `AGENTS.md`: **không tạo và không gắn ảnh** (`imageUrl: ""`, `imageType: ""`), chỉ tạo câu hỏi và audio neural TTS.
- Build: `node tools/build_listening_test.js 2 1` → `listening/lv2-test-01.js` (279,9 KB), `node --check` OK.
- Audio: `python tools/build_level_listening_audio.py 2 1` → `listening/audio/lv2-test-01/` **178 file MP3** (`single=124/124`, `multi=54/54`, tổng 11,38 MB).
- `index.html`: gắn `<script src="listening/lv2-test-01.js?v=20261121"></script>` ngay sau `listening/lv1-test-04.js`.
- Smoke test (`vm` nạp cùng toàn bộ 7 file `listening/*.js`): tổng 700 câu hợp lệ, không trùng `id`, `listening-lv2-test-1` có 100 câu đủ P1–P4 (6/25/39/30), đáp án rải 28/27/27/18, 178/178 file MP3 tồn tại (`> 0` bytes), dịch và giải thích khớp phương án sau hoán vị.
- Bổ sung 6 ảnh minh hoạ Part 1 (21/11/2026): tạo 6 ảnh người thật, chuẩn hoá 960×720 grayscale JPEG tại `listening/images/lv2-test-01/part1/q1..6.jpg`, gắn `imageUrl`/`imageType`/`imageCaption` vào `tools/listening-lv2-test1-content/p1.json`, cập nhật `tools/build_listening_test.js` giữ nguyên trường ảnh khi có trong JSON, rebuild `listening/lv2-test-01.js` (280,9 KB) giữ nguyên thứ tự đáp án khớp 178 file MP3.

## Thêm đề Luyện nghe Level 5 - Test 02 & Test 03 (21/11/2026)
- SPEC: `tools/listening-lv5-test2-content/SPEC.md` (đầy đủ) và `tools/listening-lv5-test3-content/SPEC.md` (kế thừa quy tắc Test 02, đổi chủ đề).
- Nội dung mỗi đề: `p1.json` (6 câu 1–6), `p2.json` (25 câu 7–31), `p3.json` (13 hội thoại × 3 = 39 câu 32–70), `p4.json` (10 bài × 3 = 30 câu 71–100). Mức 800–900.
- Đúng quy tắc 10: **không gắn ảnh** (`imageUrl/imageType/imageCaption` rỗng) → Part 1 dùng ảnh mặc định của app.
- Build: `node tools/build_listening_test.js 5 2 3` → `listening/lv5-test-02.js` (361,4 KB) và `listening/lv5-test-03.js` (352,9 KB), `node --check` OK.
- Audio: `python tools/build_level_listening_audio.py 5 2` và `... 5 3` → mỗi đề **178 file MP3** (124 single + 54 multi), tổng 27,4 MB, 0 file rỗng.
- `index.html`: thêm `<script src="listening/lv5-test-02.js?v=20261121">` và `lv5-test-03.js?v=20261121` ngay sau `lv5-test-01.js`.
- Kiểm tra trình duyệt: Level 5 hiện Test 01/02/03 (mỗi test 175 mục ở chế độ Nghe chép: 6 + 100 + 39 + 30); Part 1–4 mở được; bấm "Nghe audio" phát đúng file MP3; không lỗi console.
- Audit: id liên tục 1–100, P3 = 13 nhóm, P4 = 10 bài, không trùng phương án trong câu, 178/178 MP3 tồn tại và phục vụ HTTP 200, đáp án phân bố 28/27/27/18.
- Ghi chú: `audioVoiceText` viết số/ngày/giờ/tiền bằng chữ để TTS đọc đúng.

## Thêm đề Luyện đọc Level 2 - Test 02 (21/11/2026)
- SPEC: `tools/lv2-test2-content/SPEC.md` (mức A2–B1 / 400–550, đổi toàn bộ chủ đề so với Test 01).
- Nội dung: `part5.json` (30 câu 101–130), `part6.json` (4 đoạn × 4 câu 131–146), `part7a.json` (10 đoạn đơn, 29 câu 147–175), `part7b.json` (2 bộ kép + 3 bộ ba, 25 câu 176–200).
- Build: `node tools/build_reading_test.js 2 2` → `reading/lv2-test-02.js` (179,1 KB, id `reading-lv2-test-2`), `node --check` OK. Đáp án A/B/C/D = 25/25/25/25.
- `index.html`: thêm `<script src="reading/lv2-test-02.js?v=20261121"></script>` ngay sau `reading/lv2-test-01.js`.
- Audit: đủ 100 câu 101–200, 19 đoạn văn khác nhau, 71–184 từ, **0 câu / 0 đoạn trùng Test 01**, không lỗi cấu trúc.
- Kiểm tra trình duyệt (luồng click thật): Level 2 hiện Test 01 + Test 02 (30/16/54); Part 5 chọn đáp án → "Chính xác!" + dịch + giải thích + 3 từ vựng; Part 6 render đủ mốc `[131]`–`[146]`; Part 7 bộ đa tài liệu render `Document 1/2`, không lỗi console.

## Thêm đề Luyện đọc Level 4 - Test 02 (21/11/2026)
- Nội dung: `tools/lv4-test2-content/` — `part5.json` (30 câu 101–130), `part6.json` (4 đoạn × 4 câu 131–146), `part7a.json` (10 đoạn đơn, 29 câu 147–175), `part7b.json` (2 bộ kép + 3 bộ ba, 25 câu 176–200). Mức 700–800.
- Build: `node tools/build_reading_test.js 4 2` → `reading/lv4-test-02.js` (231,4 KB, id `reading-lv4-test-2`), `node --check` OK. Phân bố đáp án A/B/C/D = 25/25/25/25.
- `index.html`: thêm `<script src="reading/lv4-test-02.js?v=20261121"></script>` ngay sau `reading/lv4-test-01.js`.
- Kiểm tra trình duyệt: Level 4 hiện Test 01 và Test 02 (mỗi test 30/16/54); Part 5 hiện phản hồi đúng/sai + dịch + giải thích + từ vựng; Part 6/7 render đoạn văn, mốc `[n]`, `<hr>` tách văn bản và bảng `<table>` bình thường.
- Audit: đủ 100 câu liên tục 101–200, 19 đoạn văn khác nhau, độ dài 142–325 từ, không trùng đoạn, không lỗi cấu trúc.

## Dọn gọn Luyện nghe Level 1 (21/11/2026)
- Xoá 3 đề `listening/lv1-test-01..03.js` cùng thư mục `listening/audio/lv1-test-01..03/` và `listening/images/lv1-test-01..03/` (không ảnh hưởng `mock_tests_data.js` vì mục Thi thử dùng `assets/audio/tests/` và `assets/images/`).
- Đổi `lv1-test-04` thành **Test 01** của Level 1: `listening/lv1-test-01.js`, `listening/audio/lv1-test-01/`, `listening/images/lv1-test-01/`, cập nhật `code: "Test 01"` và tiêu đề câu hỏi; giữ chỉ `<script src="listening/lv1-test-01.js?v=20261121"></script>` trong `index.html`.

## Bổ sung 6 ảnh minh hoạ Part 1 cho Luyện nghe Level 5 - Test 01 (21/11/2026)
- Tạo 5 ảnh người thật (Q1–Q5 qua `image-generator`) và chọn 1 ảnh thật giấy phép mở `CC BY-SA 4.0` từ Wikimedia Commons (`File:Supermarket_worker.jpg`) cho Q6, chuẩn hoá toàn bộ sang `960×720` grayscale JPEG tại `listening/images/lv5-test-01/part1/q1..6.jpg`.
- Cập nhật [tools/listening-lv5-test1-content/p1.json](tools/listening-lv5-test1-content/p1.json): gắn `imageUrl`/`imageType`/`imageCaption`, đổi `questionText` sang mẫu có ảnh, chỉnh nhẹ giải thích Câu 6 khớp ảnh thật (giữ nguyên `options`, `correct`, `translation`, `vocab` để khớp 100% với 178 file MP3).
- Rebuild `listening/lv5-test-01.js` (390,8 KB, `node --check` OK), cập nhật `index.html` (`?v=20261121`) và smoke test bằng Node (`vm`): Q1–Q6 giữ đúng key `B/A/C/A/D/B`, Q7–Q100 trường ảnh rỗng, toàn bộ file ảnh và audio tồn tại (`> 0` bytes).

## Thêm đề Luyện nghe Level 4 - Test 01 & Test 02 (21/11/2026)
- Nội dung nguồn mức B2–C1 (`700–800`):
  - Test 01: `tools/listening-lv4-test1-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3, có 3 đoạn 3 người], Part 4 = 30 [10 bài nói × 3]).
  - Test 02: `tools/listening-lv4-test2-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3, có 3 đoạn 3 người], Part 4 = 30 [10 bài nói × 3]).
- Cập nhật quy tắc 10 trong `AGENTS.md`: đề mới Luyện nghe **tạo 6 ảnh Part 1** (`960×720` grayscale JPEG) và **chỉ hiển thị ảnh ở mục `Chọn ABCD`**, tuyệt đối **không hiển thị ảnh ở mục `Nghe chép`**.
- Tạo và chuẩn hoá 12 ảnh Part 1 (`960×720` grayscale JPEG) tại `listening/images/lv4-test-01/part1/q1..6.jpg` và `listening/images/lv4-test-02/part1/q1..6.jpg` (11 ảnh qua `image-generator` + 1 ảnh CC0 từ Openverse/StockSnap cho Test 02 Q5), gắn vào `p1.json` (giữ nguyên `options`, `correct`, `translation`, `explanation`, `vocab` để khớp 100% với 356 MP3).
- Biên dịch: `node tools/build_listening_test.js 4 1 2` → `listening/lv4-test-01.js` (408,4 KB) và `listening/lv4-test-02.js` (455,2 KB); `node --check` đều OK.
- Audio neural TTS: `python tools/build_level_listening_audio.py 4 1` và `4 2` sinh đủ **178 MP3/đề** (`single=124/124`, `multi=54/54`) tại `listening/audio/lv4-test-01/` (15,19 MB) và `listening/audio/lv4-test-02/` (15,45 MB).
- `index.html`: gắn `<script src="listening/lv4-test-01.js?v=20261121">` và `<script src="listening/lv4-test-02.js?v=20261121">` sau `lv3-test-01.js`.
- Kiểm tra tổng hợp bằng Node `vm`: 7 đề / 700 câu hợp lệ; cả 2 đề Level 4 đủ `6/25/39/30`, Q1–Q6 có 12/12 ảnh tồn tại (>0 bytes), Q7–Q100 không có ảnh, `178/178` audio/đề tồn tại (`missingAudio: 0`); `app.js` render chế độ `dictation` không chứa `<img>` (`dictHasImg: false`) và chế độ `abcd` hiển thị đúng ảnh (`abcdHasImg: true`).

## Thêm đề Luyện nghe Level 6 - Test 02, Test 03 & Test 04 (21/11/2026)
- Nội dung nguồn mức C1–C2 (`900–990`):
  - Test 02: `tools/listening-lv6-test2-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3, có 3 đoạn 3 người], Part 4 = 30 [10 bài nói × 3]).
  - Test 03: `tools/listening-lv6-test3-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3, có 3 đoạn 3 người], Part 4 = 30 [10 bài nói × 3]).
  - Test 04: `tools/listening-lv6-test4-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3, có 3 đoạn 3 người], Part 4 = 30 [10 bài nói × 3]).
- Ảnh minh hoạ Part 1 (18 ảnh `960×720` grayscale JPEG, chỉ hiển thị ở mục `Chọn ABCD`):
  - `listening/images/lv6-test-02/part1/q1..6.jpg` (6 ảnh qua `image-generator`).
  - `listening/images/lv6-test-03/part1/q1..6.jpg` (6 ảnh qua `image-generator`).
  - `listening/images/lv6-test-04/part1/q1..6.jpg` (1 ảnh qua `image-generator` cho Q5 + 5 ảnh thật giấy phép mở Wikimedia Commons cho Q1–Q4, Q6).
- Biên dịch: `node tools/build_listening_test.js 6 2 3 4` → `listening/lv6-test-02.js` (497,2 KB), `listening/lv6-test-03.js` (511,0 KB), `listening/lv6-test-04.js` (493,2 KB); `node --check` đều OK.
- Audio neural TTS: `python tools/build_level_listening_audio.py 6 2`, `6 3`, `6 4` sinh đủ **178 MP3/đề** (tổng **534 MP3**, `single=124/124`, `multi=54/54`) tại `listening/audio/lv6-test-02/` (17,62 MB), `lv6-test-03/` (18,62 MB), `lv6-test-04/` (17,67 MB).
- `index.html`: sắp xếp thẻ `<script>` theo thứ tự Level 1–6 và gắn `lv6-test-02.js`, `lv6-test-03.js`, `lv6-test-04.js` sau `lv6-test-01.js`.
- Kiểm tra tổng hợp bằng Node `vm` nạp toàn bộ 10 đề Luyện nghe: `totalTests: 10`, `totalExercises: 1000`, `uniqueIds: 1000`; cả 3 đề Level 6 mới đều đạt `parts: 6/25/39/30`, `p1ImgsOk: true`, `restEmpty: true`, `missingAudio: 0`, `dictHasImg: false`, `abcdHasImg: true`.

## Bổ sung 6 ảnh minh hoạ Part 1 cho Luyện nghe Level 3 - Test 01 (22/11/2026)
- Tải 6 ảnh thật giấy phép mở (Wikimedia Commons: `CC0`, `CC BY 2.0`, `CC BY 4.0`, `CC BY-SA 3.0 igo`, `Public domain`) khớp 6 cảnh của `tools/listening-lv3-test1-content/p1.json`, chuẩn hoá sang `960×720` grayscale JPEG tại `listening/images/lv3-test-01/part1/q1..6.jpg`.
- Gắn `imageUrl` vào [tools/listening-lv3-test1-content/p1.json](tools/listening-lv3-test1-content/p1.json) (giữ nguyên toàn bộ `options`, `correct`, `translation`, `explanation`, `vocab` để khớp 100% với 178 file MP3 hiện có) và rebuild `listening/lv3-test-01.js` (346,5 KB, `node --check` OK).
- Smoke test Node `vm`: Q1–Q6 có 6/6 ảnh tồn tại (>0 bytes), Q7–Q100 không có ảnh, `178/178` audio tồn tại (`missingAudio: 0`), chế độ `dictation` ẩn ảnh (`dictHasImg: false`), chế độ `abcd` hiển thị đúng ảnh (`abcdHasImg: true`).

## Thêm đề Luyện nghe Level 1 - Test 02 & Test 03 (22/11/2026)
- Nội dung nguồn mức A1–A2 (`300–400`):
  - Test 02: `tools/listening-lv1-test2-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3], Part 4 = 30 [10 bài nói × 3]).
  - Test 03: `tools/listening-lv1-test3-content/p1..p4.json` (100 câu: Part 1 = 6, Part 2 = 25, Part 3 = 39 [13 hội thoại × 3], Part 4 = 30 [10 bài nói × 3]).
- Ảnh minh hoạ Part 1 (12 ảnh `960×720` grayscale JPEG qua `image-generator`, chỉ hiển thị ở mục `Chọn ABCD`):
  - `listening/images/lv1-test-02/part1/q1..6.jpg`
  - `listening/images/lv1-test-03/part1/q1..6.jpg`
- Biên dịch: `node tools/build_listening_test.js 1 2 3` → `listening/lv1-test-02.js` (271,7 KB) và `listening/lv1-test-03.js` (276,4 KB); `node --check` đều OK.
- Audio neural TTS: `python tools/build_level_listening_audio.py 1 2` và `1 3` sinh đủ **178 MP3/đề** (tổng **356 MP3**, `single=124/124`, `multi=54/54`) tại `listening/audio/lv1-test-02/` (10,90 MB) và `listening/audio/lv1-test-03/` (10,95 MB).
- `index.html`: gắn `<script src="listening/lv1-test-02.js?v=20261122">` và `<script src="listening/lv1-test-03.js?v=20261122">` ngay sau `lv1-test-01.js`.
- Kiểm tra tổng hợp bằng Node `vm` nạp toàn bộ 14 đề Luyện nghe: `totalTests: 14`, `totalExercises: 1400`, `uniqueIds: 1400`; cả 2 đề Level 1 mới đều đạt `parts: 6/25/39/30`, `p1ImgsOk: true`, `restEmpty: true`, `missingAudio: 0`, phân bố đáp án `A: 28, B: 27, C: 27, D: 18`.

## Cập nhật lời dẫn & giọng Narrator chuẩn ETS 2026 cho cả 4 Part trên toàn bộ 14 đề Luyện nghe (22/11/2026)
- Cố định giọng Narrator `en-US-ChristopherNeural` (`rate="-8%"`, `pitch="-3Hz"`) trong `tools/build_audio.py` (`NARRATOR_VOICE` / `NARRATOR_RATE` / `NARRATOR_PITCH`) và `tools/build_level_listening_audio.py`.
- Chuẩn hoá nhịp ETS 2026 cho cả 4 Part:
  - Part 1: Narrator đọc `"Number {qnum}."` (`0.5s`) → `"Look at the picture marked number {qnum} in your test book."` (`0.85s`) → `"A."`/`"B."`/`"C."`/`"D."` (`0.3s`), giọng nhân vật nữ đọc câu mô tả (`0.7s`).
  - Part 2: Narrator đọc `"Number {qnum}."` (`0.5s`) → nhân vật đọc câu hỏi (`0.7s`) → Narrator đọc `"A."`/`"B."`/`"C."` (`0.3s`), nhân vật nữ đọc phản hồi (`0.7s`).
  - Part 3 & Part 4: Narrator đọc câu mở đầu `"Questions ... refer to the following ..."` (`0.7s`) → nội dung hội thoại/bài nói → Narrator đọc `"Number {qn}. <question>"` (`0.85s`).
- Xoá và sinh lại trọn bộ **756 file** full/group MP3 (`84` Part 1 + `350` Part 2 + `182` Part 3 + `140` Part 4) cho toàn bộ 14 đề Luyện nghe (`lv1-test-01..03`, `lv2-test-01`, `lv3-test-01`, `lv4-test-01..02`, `lv5-test-01..03`, `lv6-test-01..04`); giữ nguyên 124 file đơn câu/đề (`178` MP3/đề, tổng `2.492` MP3).
- Gỡ bỏ logic phát `directions/part1..4.mp3` trong `app.js` và xoá thư mục `listening/audio/directions/`. Thêm 4 mẫu nghe thử Narrator vào `voice-samples.html`.

## Sửa cấu trúc Part 3 & Part 4 ở Luyện nghe → Chọn ABCD (22/11/2026)
- `app.js`: thêm `getListeningPracticeGroups()` và `toggleListeningPracticeAudio()`; cập nhật `renderListeningPractice()`, `stepListening()`, `renderListeningPalette()`, `syncListeningAudioButton()` và `playListeningPracticeAudio()`:
  - Part 3 (13 nhóm) & Part 4 (10 nhóm) ở chế độ Chọn ABCD gom đúng **3 câu/đoạn** dùng chung 1 audio (có nút Phát/Tạm dừng + Nghe lại từ đầu, không bị ngắt audio khi chọn đáp án), hiển thị sẵn toàn bộ nội dung câu hỏi và 4 phương án A–D (bỏ nút loa thừa cạnh phương án), kèm bảng biểu `passageHtml` (nếu có) và hộp Transcript chung cho cả đoạn.
  - Part 1 & Part 2 giữ nguyên giao diện từng câu như cũ. Cache-buster `app.js?v=20261122c` trong `index.html`.
- Bổ sung thanh trình phát audio dạng khung tối + sóng âm cố định dưới đáy (đồng bộ với chế độ Nghe chép: đếm lượt nghe, phát/tạm dừng, chuyển bài, tốc độ 1x/0.75x, tự lặp) cho cả 4 Part ở chế độ Chọn ABCD.
