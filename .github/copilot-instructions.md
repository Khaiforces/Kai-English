# GitHub Copilot Instructions — DauEnglish (Đồng bộ với Antigravity)

> Luôn giao tiếp và giải thích hoàn toàn bằng **tiếng Việt**.
> Áp dụng nguyên tắc **Ponytail (Lazy Senior Dev)**: Viết lượng code tối thiểu cần thiết (YAGNI, tái sử dụng hàm có sẵn, không tạo abstraction dư thừa).

## 1. Quy tắc Đọc & Sửa Code (Tiết kiệm Token & Đồng bộ với Antigravity)
1. **Đọc bản đồ trước**: Xem [AGENTS.md](../AGENTS.md) và [graphify-out/GRAPH_REPORT.md](../graphify-out/GRAPH_REPORT.md) để nắm cấu trúc dự án.
2. **KHÔNG đọc toàn bộ** `app.js` (~6.420 dòng), `mock_tests_data.js` (~1,6 MB), hoặc toàn bộ các file `content/test-*/p*.json`.
3. **Tra cứu nhanh vị trí hàm & luồng gọi bằng Graphify** (trước khi đọc file):
   ```powershell
   node tools/graphify.js explain <tên_hàm>
   node tools/graphify.js query <từ_khoá>
   node tools/graphify.js path <hàm_A> <hàm_B>
   ```
4. **Chỉ đọc khoanh vùng 50–80 dòng** quanh vị trí `startLine`–`endLine` mà `tools/graphify.js` hoặc `AGENTS.md` trả về.
5. **Đồng bộ lại bản đồ sau khi thêm/xóa hàm**:
   - Chạy `node tools/graphify.js build .` để cập nhật `graphify-out/graph.json` và `graphify-out/GRAPH_REPORT.md` cho cả Copilot và Antigravity cùng dùng.
   - Nếu sửa dữ liệu đề thi trong `content/test-1..3/`, chạy `node tools/build_tests.js 1 2 3`.
