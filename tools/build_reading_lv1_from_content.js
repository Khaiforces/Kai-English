/**
 * Wrapper giữ lệnh cũ: sinh đề Level 1 Test 02, 03…
 *   node tools/build_reading_lv1_from_content.js 2 3
 * Logic thật nằm ở tools/build_reading_test.js (dùng chung mọi level).
 */
const { build } = require('./build_reading_test');
const tests = process.argv.slice(2);
if (!tests.length) {
  console.error('Vui lòng truyền số test, ví dụ: node tools/build_reading_lv1_from_content.js 2 3');
  process.exit(1);
}
tests.forEach(t => build(1, Number(t)));
