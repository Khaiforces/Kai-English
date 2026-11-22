# AGENTS.md — Quy tắc làm việc & bản đồ dự án DauEnglish

> **File quy tắc duy nhất có hiệu lực.** Bản `.agent/rules/codebase-map.md` chỉ là bản cũ, đã được thay bằng file này.
> Mục tiêu: làm việc đúng chỗ mà **không đọc toàn bộ mã nguồn** (tiết kiệm token).

---

## 1. Quy tắc đọc & sửa (bắt buộc)

1. **KHÔNG đọc trọn** `app.js` (~6.420 dòng), `mock_tests_data.js` (~1,6 MB), `data.js` (~1.100 dòng), hay nguyên file `p3.json` / `p4.json` / `p7a.json` / `p7b.json`.
2. Định vị trước bằng `grep` (hoặc bảng mục lục ở §4), rồi `read` **đúng dải 50–80 dòng** quanh chỗ cần sửa.
3. Sửa bằng `edit` (thay thế cục bộ), **không** `write` lại file lớn.
4. Dữ liệu hàng loạt (`content/**/*.json`): xử lý bằng script ngắn `node -e "..."` hoặc file trong `tools/`, không nạp cả file vào ngữ cảnh.
5. Việc nặng/kéo dài (soạn nội dung, tạo audio, chuyển ảnh) → giao subagent, chạy nền.
6. Sau khi sửa: `node --check <file>` + 1 smoke test ngắn. Không đọc lại toàn file để "xác nhận".
7. Kết thúc việc lớn: cập nhật `HANDOFF.md`.
8. **Nguyên tắc Ponytail (Lazy Senior Dev — Bắt buộc áp dụng tự động):**
   - Áp dụng **Thang 7 bước (7-Rung Ladder)** trước khi viết code: *(1) YAGNI: Không yêu cầu thì không viết → (2) Tái sử dụng hàm có sẵn trong dự án → (3) Dùng thư viện chuẩn JS → (4) Dùng tính năng gốc của trình duyệt → (5) Dùng package sẵn có → (6) Ưu tiên viết gọn 1 dòng → (7) Viết lượng code tối thiểu (Minimum Viable Code)*.
   - **Không bao giờ cắt giảm** bảo mật (XSS/Auth), toàn vẹn dữ liệu và khả năng truy cập (a11y). Cuối câu trả lời, ghi chú ngắn 1–2 dòng những phần phức tạp không cần thiết đã lược bỏ.
9. **Nguyên tắc Graphify (Query Graph First — Bắt buộc):**
   - Trước khi đọc file mã nguồn lớn (`>200` dòng như `app.js`, `data.js`, `server.js`) hoặc tìm kiếm rộng, chạy `node tools/graphify.js query "<từ_khoá>"` hoặc `node tools/graphify.js explain "<tên_hàm>"` (hoặc `path "<hàm_A>" "<hàm_B>"`) để lấy đúng dải `startLine–endLine` và quan hệ gọi hàm, sau đó chỉ đọc lát `50–80` dòng quanh vị trí đó (`tools/graphify.js` tự phát hiện thay đổi và cập nhật `graphify-out/`).
10. **Quy tắc tạo đề mới trong mục Luyện nghe (Bắt buộc):**
   - Tạo **6 ảnh minh hoạ Part 1** chuẩn `960×720` grayscale JPEG tại `listening/images/lv{level}-test-{NN}/part1/q1..6.jpg` và gắn `imageUrl`/`imageType`/`imageCaption` vào `p1.json` (Part 2–4 giữ rỗng `imageUrl: ""`, `imageType: ""`).
   - **Chỉ hiển thị file ảnh ở mục `Chọn ABCD`**; tuyệt đối **không hiển thị ảnh ở mục `Nghe chép`** (`dictation`).
   - Tạo câu hỏi và đầy đủ bộ **178 file audio MP3 neural TTS/đề** tại `listening/audio/lv{level}-test-{NN}/` (gồm 54 file trọn câu/nhóm + 124 file câu lẻ cho chế độ Nghe chép chính tả) bằng `node tools/build_listening_test.js <level> <test>` và `python tools/build_level_listening_audio.py <level> <test>`.
   - **Giọng Narrator & lời dẫn chuẩn ETS 2026 (cố định cho cả 4 Part):** Bắt buộc dùng duy nhất giọng `en-US-ChristopherNeural` (`rate="-8%"`, `pitch="-3Hz"`) cho mọi lời dẫn (`narrator`) và chữ cái đáp án:
     - **Part 1:** `"Number {qnum}."` (`0.5s`) → `"Look at the picture marked number {qnum} in your test book."` (`0.85s`) → `"A."`/`"B."`/`"C."`/`"D."` (`0.3s`), giọng nhân vật nữ đọc câu mô tả (`0.7s`).
     - **Part 2:** `"Number {qnum}."` (`0.5s`) → giọng nam đọc câu hỏi (`0.7s`) → `"A."`/`"B."`/`"C."` (`0.3s`), giọng nữ đọc phản hồi (`0.7s`).
     - **Part 3 & Part 4:** `"Questions ... refer to the following ..."` (`0.7s`) → nội dung hội thoại/bài nói → từng câu hỏi `"Number {qn}. <question>"` (`0.85s`).
     - *(Các file câu lẻ `p1-q*-a..d.mp3`, `p2-q*-q/a..c.mp3` cho chế độ Nghe chép chỉ đọc nội dung câu, giữ giọng nhân vật `man`/`woman`, không đọc chữ cái `A/B/C/D` hay `Number`.)*
11. **Công cụ môi trường bắt buộc phải cài (Pipeline Ảnh & Audio):**
   - **Pillow (`PIL`):** Thư viện xử lý ảnh Python để crop, resize chuẩn `960×720` và chuyển grayscale JPEG cho ảnh Part 1 (`python -m pip install pillow`).
   - **FFmpeg:** Công cụ dòng lệnh xử lý/nối/chuẩn hóa âm thanh MP3 (`winget install --id Gyan.FFmpeg -e` trên Windows hoặc `apt install ffmpeg` trên Linux).

**Mẫu yêu cầu hiệu quả:** “Sửa `renderExamRoom` trong `app.js` (dòng 2072–2380): thêm nút tua 5 giây.”

---

## 2. Bản đồ file

| File | Quy mô | Vai trò |
|---|---|---|
| `index.html` | 632 dòng (590 có nội dung) | Khung SPA + thứ tự nạp script (quan trọng) + modal/CSS |
| `app.js` | **6.420 dòng** (5.906 dòng có nội dung, 515 dòng trống) | Toàn bộ logic SPA — object `app` (không phải ES module) |
| `data.js` | 1.106 dòng | `window.DAU_DATA` (đề, nghe, đọc, nói/viết, từ vựng, ngữ pháp) |
| `mock_tests_data.js` | 1.617 KB (~1,6 MB) | 3 đề tự soạn — **sinh tự động, không sửa tay** |
| `vocab_data.js` | 1.127 dòng | `window.BARRONS_600_TOPICS` — 50 chủ đề × 12 từ |
| `phrasal_verbs_data.js` | 567 dòng | `window.PHRASAL_VERBS_300_TOPICS` — 25 chủ đề |
| `grammar_lectures.js` | 1.470 dòng | `window.GRAMMAR_LECTURES` — 22 bài giảng |
| `server.js` | 527 dòng (477 có nội dung) | Express: OAuth demo, static, API |
| `HANDOFF.md` | — | Trạng thái bàn giao (không phải quy tắc) |

---

## 3. Kiến trúc dữ liệu 3 đề tự soạn

Nguồn: `content/test-1|2|3/` (mỗi đề 8 file, **không có** `meta.json`):

| File | Nội dung |
|---|---|
| `p1.json` | Part 1, Q1–Q6 — ảnh thật + 4 mô tả |
| `p2.json` | Part 2, Q7–Q31 — câu hỏi + 3 đáp án (A–C) |
| `p3.json` | Part 3, Q32–Q70 — 13 hội thoại × 3 câu; 2 nhóm cuối (g12, g13) có bảng biểu trong `passageHtml` |
| `p4.json` | Part 4, Q71–Q100 — 10 bài nói × 3 câu; 2 nhóm cuối (g9, g10) có bảng biểu |
| `p5.json` | Part 5, Q101–Q130 |
| `p6.json` | Part 6, Q131–Q146 — 4 đoạn × 4 câu, chỗ trống `<strong>[131]</strong>`..`<strong>[146]</strong>` (câu thứ 4 mỗi đoạn là Sentence Insertion) |
| `p7a.json` | Part 7 đơn, Q147–Q175 (khung viền chuẩn ETS) |
| `p7b.json` | Part 7 đa, Q176–Q200 (2 bộ Double Passages 176–185, 3 bộ Triple Passages 186–200) |
| `audio-manifest.json` | map `questionId → audioUrl` (100 mục/đề) |

**Ảnh Part 1:** `assets/images/test-0{1,2,3}/part1/q{1..6}.jpg` — ảnh xám (grayscale) 4:3, 960×720. Credit lưu ở `assets/images/test-01/part1/credits.json`.

**Audio:** 162 MP3 tại `assets/audio/tests/test-0{1,2,3}/` (Part 1–4; Part 3/4 dùng chung file theo nhóm).

> ⚠️ **Bảo toàn audio:** sửa `audioScript` / `audioVoiceText` / `options` của Part 1–4 = phải tạo lại MP3 tương ứng (`python tools/build_audio.py <test>` sau khi xoá file cũ), nếu không audio sẽ lệch với đề.

**Build & Graphify (Dùng chung cho Antigravity & GitHub Copilot):**
```powershell
node tools/build_tests.js 1 2 3          # content + manifest → mock_tests_data.js
node tools/graphify.js build .           # cập nhật bản đồ đồ thị tại graphify-out/
node tools/graphify.js explain <hàm>     # xem số dòng + hàm gọi đến/đi (tiết kiệm token)
node tools/graphify.js query <từ_khoá>   # tìm nhanh vị trí hàm/file
node --check app.js
```

---

## 4. Mục lục `app.js` (số dòng đã kiểm tra)

| Dòng | Khu vực | Hàm chính |
|---|---|---|
| 1–126 | Khởi tạo object `app`, state | `init`, `loadState`, `saveState` |
| 258 | OAuth 2.0 demo với `server.js` | — |
| 332 | Supabase Auth | `initSupabaseIfConfigured` |
| 466 | Firebase Auth + Firestore | `initFirebaseIfConfigured` |
| 708 | Điều hướng SPA | `navigate`, `handleHistoryChange` |
| 886 | Âm thanh (Web Speech) | `speakText`, `stopSpeech` |
| 908 | Trang chủ & đăng nhập | `renderHome`, `renderLoginPage` |
| **1928** | Danh sách đề thi | `renderMockTestsList`, `renderEmptyState` |
| **2012** | Phòng thi | `startExam`, `renderExamRoom` (2072), `selectExamOption` (2381), `toggleBlindListening` (2387), `submitExam` (2420) |
| 2484 | Kết quả thi | `renderExamResult` |
| 2615 | Luyện nghe | `renderListeningPractice` (2893), `renderListeningIllustration` (2616), `playListeningAudio` (2735) |
| 3326 | Luyện đọc | `renderReadingPractice` |
| 3490 | Speaking/Writing | `renderSpeakingWriting`, `getWritingTabHtml`, `getSpeakingTabHtml` |
| 3763 | Từ vựng 600 từ | `renderVocabulary`, `render600Words` (4095), `renderVocabQuiz` (3911) |
| 4442 | 300 phrasal verbs | `renderPhrasalVerbs` |
| 4780 | Danh sách ngữ pháp | `renderGrammar`, `getEnrichedGrammarTopics` |
| 5101 | Trang học ngữ pháp | `renderGrammarLessonPage` |
| 5832 | Dashboard | `renderDashboard` |
| 5977 | Sổ tay từ vựng / VIP / auth | — |
| 6257 | Sao lưu – khôi phục JSON | — |
| 6387 | Toast & helpers | `showToast`, `escapeHtml`, `escapeJsString` |

Số dòng lệch ±50 sau khi sửa — luôn `grep` lại tên hàm trước khi đọc.

---

## 5. Schema câu hỏi

```js
{
  id, part, partName, type: 'listening' | 'reading',
  imageType?, imageCaption?, imageUrl?, imageCredit?,      // Part 1
  passageTitle?, passageHtml?,                             // Part 3/4/6/7
  audioScript?, audioVoiceText?, audioUrl?, audioGroup?,   // Part 1–4
  questionText, options: [{ key, text }], correct,
  translation, explanation, vocab: [{ word, pos, meaning }]
}
```

- `vocabTopics[]  = { id, name, unit, words: [{ id, word, pos, phonetic, meaning, example, exampleVi }] }`
- `phrasalVerbTopics[] = { id, name, unit, words: [{ id, word, meaning, example }] }`
- `grammarTopics[] = { id, name, theory, questions[], practiceQuestionsByType? }`

---

## 6. Trạng thái hiện tại

- 3 đề tự soạn, mỗi đề **200 câu** (Listening 100 + Reading 100).
- **300/300** câu Listening có `audioUrl`; 162 file MP3 (33,6 MB, 54 file/đề).
- **18 ảnh** Part 1 (6 ảnh × 3 đề, 2,4 MB), grayscale 4:3 960×720, đã gắn `imageUrl` đầy đủ.
- Đáp án + dịch + giải thích tiếng Việt cho toàn bộ 600 câu.
- Chi tiết vận hành: `HANDOFF.md`.
