/**
 * Sinh đề Luyện đọc Level 1 (300–400) Test 01 (100 câu Part 5, 6, 7).
 * Chạy: node tools/build_reading_lv1_test1.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function mkOpts(a, b, c, d) {
  return [
    { key: 'A', text: `(A) ${a}` },
    { key: 'B', text: `(B) ${b}` },
    { key: 'C', text: `(C) ${c}` },
    { key: 'D', text: `(D) ${d}` }
  ];
}

function distributeCorrectOption(options, correctKey, qNum) {
  const keys = ['A', 'B', 'C', 'D'];
  const texts = options.map(o => o.text.replace(/^\([A-D]\)\s*/, ''));
  const curIdx = keys.indexOf(correctKey);
  const targetIdx = (qNum * 7 + 3) % 4;
  if (curIdx >= 0 && targetIdx !== curIdx) {
    [texts[curIdx], texts[targetIdx]] = [texts[targetIdx], texts[curIdx]];
  }
  return {
    options: keys.map((k, i) => ({ key: k, text: `(${k}) ${texts[i]}` })),
    correct: keys[targetIdx]
  };
}

function mkVocab(items) {
  return items.map(([word, pos, meaning]) => ({ word, pos, meaning }));
}

// ==================== PART 5 (Q101 - Q130, 30 câu Level 1) ====================
const part5Raw = [
  [101, "Mr. Kim _______ in his office at eight o'clock every morning.",
    mkOpts("arrives", "arrive", "arriving", "to arrive"), "A",
    "Ông Kim đến văn phòng vào lúc tám giờ mỗi sáng.",
    "Chủ ngữ 'Mr. Kim' là ngôi thứ ba số ít và có 'every morning' (thì hiện tại đơn) nên động từ thêm -s: 'arrives'.",
    [["arrive", "v.", "đến nơi"], ["office", "n.", "văn phòng"], ["morning", "n.", "buổi sáng"]]],
  [102, "Please give this folder to _______ before the lunch break.",
    mkOpts("her", "she", "hers", "herself"), "A",
    "Vui lòng đưa tập hồ sơ này cho cô ấy trước giờ nghỉ trưa.",
    "Sau giới từ 'to' cần đại từ tân ngữ 'her'.",
    [["folder", "n.", "tập hồ sơ"], ["lunch break", "n.", "giờ nghỉ trưa"], ["before", "prep.", "trước khi"]]],
  [103, "Our company will open a new bookstore _______ Oak Street next month.",
    mkOpts("on", "at", "to", "for"), "A",
    "Công ty chúng tôi sẽ mở một hiệu sách mới trên phố Oak vào tháng tới.",
    "Với tên đường phố (Oak Street) ta dùng giới từ 'on'.",
    [["bookstore", "n.", "hiệu sách"], ["street", "n.", "con phố"], ["open", "v.", "mở cửa"]]],
  [104, "The train to Busan leaves _______ 9:30 A.M. from Platform 2.",
    mkOpts("at", "on", "in", "by"), "A",
    "Chuyến tàu đi Busan khởi hành lúc 9:30 sáng từ sân ga số 2.",
    "Trước giờ giấc cụ thể (9:30 A.M.) luôn dùng giới từ 'at'.",
    [["train", "n.", "tàu hỏa"], ["leave", "v.", "rời đi, khởi hành"], ["platform", "n.", "sân ga"]]],
  [105, "All staff members should keep _______ desks clean and tidy.",
    mkOpts("their", "they", "them", "theirs"), "A",
    "Tất cả nhân viên nên giữ bàn làm việc của họ sạch sẽ và gọn gàng.",
    "Trước danh từ 'desks' cần tính từ sở hữu 'their' (của họ).",
    [["staff", "n.", "nhân viên"], ["desk", "n.", "bàn làm việc"], ["tidy", "adj.", "gọn gàng"]]],
  [106, "Ms. Parker _______ a taxi to the airport yesterday afternoon.",
    mkOpts("took", "takes", "will take", "taking"), "A",
    "Cô Parker đã đi taxi ra sân bay vào chiều hôm qua.",
    "Trạng từ 'yesterday afternoon' chỉ thời gian quá khứ nên dùng quá khứ đơn 'took'.",
    [["airport", "n.", "sân bay"], ["yesterday", "adv.", "hôm qua"], ["afternoon", "n.", "buổi chiều"]]],
  [107, "The coffee shop is very busy, _______ the service is still fast.",
    mkOpts("but", "because", "so", "or"), "A",
    "Quán cà phê rất đông khách, nhưng phục vụ vẫn rất nhanh.",
    "Hai vế có nghĩa tương phản (rất đông >< vẫn nhanh) nên nối bằng liên từ 'but'.",
    [["busy", "adj.", "đông đúc, bận rộn"], ["service", "n.", "dịch vụ"], ["fast", "adj.", "nhanh chóng"]]],
  [108, "We need to buy _______ printer paper for the front desk.",
    mkOpts("more", "many", "few", "several"), "A",
    "Chúng tôi cần mua thêm giấy in cho quầy lễ tân.",
    "'paper' là danh từ không đếm được nên dùng 'more' (thêm); 'many/few/several' chỉ đi với danh từ đếm được số nhiều.",
    [["printer", "n.", "máy in"], ["paper", "n.", "giấy"], ["front desk", "n.", "quầy lễ tân"]]],
  [109, "Please speak _______ because people are taking a test next door.",
    mkOpts("quietly", "quiet", "quietness", "quieter"), "A",
    "Vui lòng nói chuyện nhỏ nhẹ vì mọi người đang làm bài kiểm tra ở phòng bên cạnh.",
    "Cần trạng từ 'quietly' bổ nghĩa cho động từ 'speak'.",
    [["speak", "v.", "nói"], ["quietly", "adv.", "nhỏ nhẹ, yên lặng"], ["next door", "adv.", "phòng bên cạnh"]]],
  [110, "The bakery sells fresh bread, sweet cakes, _______ hot tea.",
    mkOpts("and", "but", "so", "yet"), "A",
    "Tiệm bánh bán bánh mì tươi, bánh ngọt và trà nóng.",
    "Liệt kê các món cùng loại (A, B, and C) nên dùng 'and'.",
    [["bakery", "n.", "tiệm bánh"], ["fresh", "adj.", "tươi mới"], ["bread", "n.", "bánh mì"]]],
  [111, "Our meeting room is _______ the second floor near the elevator.",
    mkOpts("on", "in", "at", "under"), "A",
    "Phòng họp của chúng tôi nằm ở tầng hai gần thang máy.",
    "Với tầng lầu (the second floor) luôn dùng giới từ 'on'.",
    [["meeting room", "n.", "phòng họp"], ["floor", "n.", "tầng, sàn"], ["elevator", "n.", "thang máy"]]],
  [112, "Thank you for _______ our online store last weekend.",
    mkOpts("visiting", "visit", "visited", "visits"), "A",
    "Cảm ơn bạn đã ghé thăm cửa hàng trực tuyến của chúng tôi cuối tuần trước.",
    "Sau giới từ 'for' dùng động từ dạng V-ing ('visiting').",
    [["online store", "n.", "cửa hàng trực tuyến"], ["visit", "v.", "ghé thăm"], ["weekend", "n.", "cuối tuần"]]],
  [113, "The blue jacket is _______ than the black one on sale.",
    mkOpts("cheaper", "cheap", "cheapest", "cheaply"), "A",
    "Chiếc áo khoác màu xanh rẻ hơn chiếc màu đen đang giảm giá.",
    "Có từ 'than' nên dùng tính từ so sánh hơn 'cheaper'.",
    [["jacket", "n.", "áo khoác"], ["on sale", "phr.", "đang giảm giá"], ["cheap", "adj.", "rẻ"]]],
  [114, "Mr. Brown will _______ the new office computer tomorrow morning.",
    mkOpts("fix", "fixes", "fixed", "fixing"), "A",
    "Ông Brown sẽ sửa chiếc máy tính văn phòng mới vào sáng mai.",
    "Sau 'will' luôn là động từ nguyên thể không 'to': 'fix'.",
    [["computer", "n.", "máy tính"], ["fix", "v.", "sửa chữa"], ["tomorrow", "adv.", "ngày mai"]]],
  [115, "Students must show a _______ ID card to enter the gym.",
    mkOpts("valid", "validly", "validity", "validate"), "A",
    "Sinh viên phải xuất trình thẻ sinh viên còn hiệu lực để vào phòng tập thể dục.",
    "Trước danh từ 'ID card' cần tính từ 'valid' (còn hiệu lực).",
    [["student", "n.", "sinh viên"], ["valid", "adj.", "còn hiệu lực"], ["enter", "v.", "đi vào"]]],
  [116, "This box is very _______, so please ask someone to help carry it.",
    mkOpts("heavy", "heavily", "heaviness", "heavier"), "A",
    "Chiếc hộp này rất nặng, nên hãy nhờ ai đó giúp khiêng nó.",
    "Sau 'is very' cần tính từ nguyên cấp 'heavy'.",
    [["box", "n.", "cái hộp"], ["heavy", "adj.", "nặng"], ["carry", "v.", "mang, khiêng"]]],
  [117, "The supermarket is open every day _______ 7:00 A.M. to 10:00 P.M.",
    mkOpts("from", "between", "since", "until"), "A",
    "Siêu thị mở cửa mỗi ngày từ 7:00 sáng đến 10:00 tối.",
    "Cặp giới từ chỉ khoảng thời gian cố định là 'from ... to ...' (từ ... đến ...).",
    [["supermarket", "n.", "siêu thị"], ["open", "adj.", "mở cửa"], ["every day", "adv.", "mỗi ngày"]]],
  [118, "Anna was late for work _______ her bus stopped because of rain.",
    mkOpts("because", "although", "unless", "so"), "A",
    "Anna đi làm muộn vì xe buýt của cô ấy dừng lại do trời mưa.",
    "Vế sau giải thích nguyên nhân cho vế trước nên dùng 'because'.",
    [["late", "adj.", "muộn"], ["bus", "n.", "xe buýt"], ["rain", "n.", "cơn mưa"]]],
  [119, "Please write your full name _______ the top of the page.",
    mkOpts("at", "with", "over", "into"), "A",
    "Vui lòng viết họ tên đầy đủ của bạn ở đầu trang giấy.",
    "Cụm giới từ quen thuộc 'at the top of' (ở phía trên cùng của).",
    [["full name", "n.", "họ tên đầy đủ"], ["page", "n.", "trang giấy"], ["top", "n.", "phía trên"]]],
  [120, "Every customer received a _______ tote bag at the grand opening.",
    mkOpts("free", "freely", "freedom", "freed"), "A",
    "Mỗi khách hàng đều nhận được một chiếc túi vải miễn phí tại lễ khai trương.",
    "Trước cụm danh từ 'tote bag' cần tính từ 'free' (miễn phí).",
    [["customer", "n.", "khách hàng"], ["receive", "v.", "nhận được"], ["grand opening", "n.", "lễ khai trương"]]],
  [121, "There are twenty-five chairs _______ the small conference room.",
    mkOpts("in", "on", "to", "from"), "A",
    "Có hai mươi lăm chiếc ghế ở trong phòng họp nhỏ.",
    "Chỉ vị trí bên trong một căn phòng dùng giới từ 'in'.",
    [["chair", "n.", "cái ghế"], ["conference room", "n.", "phòng họp"], ["small", "adj.", "nhỏ"]]],
  [122, "Did you _______ the package from the post office this morning?",
    mkOpts("pick up", "turn off", "put on", "look at"), "A",
    "Sáng nay bạn đã lấy kiện hàng từ bưu điện chưa?",
    "'pick up' nghĩa là đến lấy, đón; phù hợp với ngữ cảnh nhận hàng ở bưu điện.",
    [["package", "n.", "kiện hàng"], ["post office", "n.", "bưu điện"], ["pick up", "v.", "đến lấy, nhặt lên"]]],
  [123, "The hotel manager is always _______ and ready to help guests.",
    mkOpts("friendly", "friend", "friends", "friendship"), "A",
    "Quản lý khách sạn luôn thân thiện và sẵn sàng giúp đỡ khách.",
    "Sau động từ 'is always' cần tính từ 'friendly' (thân thiện).",
    [["manager", "n.", "người quản lý"], ["guest", "n.", "khách (lưu trú)"], ["friendly", "adj.", "thân thiện"]]],
  [124, "We will have a short _______ in the main hall after the talk.",
    mkOpts("break", "broke", "broken", "breaking"), "A",
    "Chúng ta sẽ có một giờ nghỉ ngắn ở sảnh chính sau buổi nói chuyện.",
    "Sau 'a short' cần danh từ 'break' (giờ nghỉ giải lao).",
    [["short", "adj.", "ngắn"], ["main hall", "n.", "sảnh chính"], ["talk", "n.", "buổi nói chuyện"]]],
  [125, "Please check your _______ before you leave the restaurant.",
    mkOpts("bill", "menu", "plate", "kitchen"), "A",
    "Vui lòng kiểm tra hóa đơn thanh toán trước khi rời khỏi nhà hàng.",
    "Trước khi rời nhà hàng thì cần kiểm tra 'bill' (hóa đơn).",
    [["check", "v.", "kiểm tra"], ["bill", "n.", "hóa đơn"], ["restaurant", "n.", "nhà hàng"]]],
  [126, "The museum is closed _______ Mondays for regular cleaning.",
    mkOpts("on", "in", "at", "for"), "A",
    "Bảo tàng đóng cửa vào các ngày thứ Hai để vệ sinh định kỳ.",
    "Trước các thứ trong tuần (Mondays) luôn dùng giới từ 'on'.",
    [["museum", "n.", "bảo tàng"], ["closed", "adj.", "đóng cửa"], ["cleaning", "n.", "việc dọn dẹp"]]],
  [127, "My coworker helped _______ finish the monthly report on time.",
    mkOpts("me", "I", "my", "mine"), "A",
    "Đồng nghiệp của tôi đã giúp tôi hoàn thành báo cáo hàng tháng đúng hạn.",
    "Sau động từ 'helped' cần đại từ tân ngữ 'me'.",
    [["coworker", "n.", "đồng nghiệp"], ["monthly", "adj.", "hàng tháng"], ["on time", "phr.", "đúng giờ/hạn"]]],
  [128, "This new printer works very _______ and makes almost no noise.",
    mkOpts("well", "good", "better", "best"), "A",
    "Chiếc máy in mới này hoạt động rất tốt và hầu như không gây tiếng ồn.",
    "Bổ nghĩa cho động từ thường 'works' cần trạng từ 'well' (tốt).",
    [["work", "v.", "hoạt động"], ["noise", "n.", "tiếng ồn"], ["almost", "adv.", "hầu như"]]],
  [129, "If you have questions, please _______ an e-mail to our team.",
    mkOpts("send", "sends", "sent", "sending"), "A",
    "Nếu bạn có câu hỏi, vui lòng gửi e-mail cho nhóm của chúng tôi.",
    "Câu mệnh lệnh lịch sự 'please + V nguyên thể': 'send'.",
    [["question", "n.", "câu hỏi"], ["send", "v.", "gửi"], ["team", "n.", "nhóm, đội"]]],
  [130, "Ms. Lee bought two new _______ for the guest waiting area.",
    mkOpts("sofas", "sofa", "sofas'", "sofa's"), "A",
    "Cô Lee đã mua hai chiếc ghế sô-pha mới cho khu vực chờ của khách.",
    "Có số lượng 'two' phía trước nên danh từ đếm được phải ở dạng số nhiều 'sofas'.",
    [["sofa", "n.", "ghế sô-pha"], ["waiting area", "n.", "khu vực chờ"], ["buy", "v.", "mua"]]]
];

const part5 = part5Raw.map(([id, questionText, options, correct, translation, explanation, vocab]) => ({
  id: `reading-lv1-test-1-q${id}`,
  questionNumber: id,
  etsYear: '2026',
  etsTestId: 'reading-lv1-test-1',
  part: 'Part 5',
  partNumber: 5,
  partName: 'Part 5: Hoàn thành câu (Incomplete Sentences)',
  title: `Test 01 (Level 1) • Câu ${id} (Part 5: Hoàn thành câu)`,
  passageTitle: '',
  passageHtml: '',
  questionText,
  options,
  correct,
  translation,
  explanation,
  vocab: mkVocab(vocab)
}));

// ==================== PART 6 (Q131 - Q146, 16 câu = 4 đoạn ngắn Level 1) ====================
const part6Groups = [
  {
    passageTitle: 'Questions 131-134 refer to the following notice:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">Sunny Bakery — New Opening Hours</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Dear Customers,</p>
      <p class="mt-2">Starting next Monday, May 5, Sunny Bakery will open one hour earlier than before. Our new hours will be 6:30 A.M. to 7:00 P.M., Monday through Saturday. On Sundays, we will still open <strong>[131]</strong> 8:00 A.M. to 4:00 P.M.</p>
      <p class="mt-2">We made this change so morning commuters can stop by for fresh coffee and warm bread before <strong>[132]</strong> to work. Our bakers will prepare fresh croissants, muffins, and fruit tarts every morning.</p>
      <p class="mt-2"><strong>[133]</strong>. Simply show your receipt from your morning visit to get 10 percent off any afternoon drink.</p>
      <p class="mt-2">Thank you for your <strong>[134]</strong> support!</p>
    </div>`,
    questions: [
      [131, 'Select the best answer to complete blank [131].',
        mkOpts('from', 'at', 'on', 'with'), 'A',
        'Vào các ngày Chủ Nhật, chúng tôi vẫn mở cửa từ 8:00 sáng đến 4:00 chiều.',
        'Cặp giới từ cố định chỉ khoảng giờ là "from ... to ...".',
        [['opening hours', 'n.', 'giờ mở cửa'], ['commuter', 'n.', 'người đi làm hàng ngày'], ['prepare', 'v.', 'chuẩn bị']]],
      [132, 'Select the best answer to complete blank [132].',
        mkOpts('going', 'go', 'went', 'goes'), 'A',
        'Chúng tôi thay đổi để người đi làm buổi sáng có thể ghé mua cà phê và bánh mì nóng trước khi đi làm.',
        'Sau giới từ "before" cần động từ dạng V-ing: "before going to work".',
        [['stop by', 'v.', 'ghé qua'], ['warm', 'adj.', 'ấm, nóng'], ['work', 'n.', 'công việc, nơi làm']]],
      [133, 'Select the best sentence to complete blank [133].',
        mkOpts(
          'We are also offering a special afternoon discount this month.',
          'Our bakery sells birthday cakes for large family parties.',
          'The bus stop across the street is closed for repairs.',
          'Please remember to lock your bicycle outside the door.'
        ), 'A',
        'Tháng này chúng tôi cũng có ưu đãi giảm giá đặc biệt vào buổi chiều.',
        'Câu ngay sau đó giải thích cách nhận giảm giá 10% cho đồ uống buổi chiều -> câu giới thiệu ưu đãi buổi chiều nối mạch hoàn hảo.',
        [['discount', 'n.', 'giảm giá'], ['receipt', 'n.', 'hóa đơn'], ['offer', 'v.', 'cung cấp, ưu đãi']]],
      [134, 'Select the best answer to complete blank [134].',
        mkOpts('continued', 'continue', 'continues', 'continuing'), 'A',
        'Cảm ơn sự ủng hộ liên tục của các bạn!',
        'Trước danh từ "support" dùng tính từ "continued" (liên tục, không ngừng).',
        [['support', 'n.', 'sự ủng hộ'], ['continued', 'adj.', 'tiếp tục, liên tục'], ['drink', 'n.', 'đồ uống']]]
    ]
  },
  {
    passageTitle: 'Questions 135-138 refer to the following e-mail:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>To:</strong> Sales Team<br><strong>From:</strong> David Park, Sales Manager<br><strong>Date:</strong> June 6<br><strong>Subject:</strong> Monday Morning Meeting</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Hi Everyone,</p>
      <p class="mt-2">We will have our weekly sales meeting this Monday at 9:00 A.M. Please note that the meeting will take place in Room 204 instead of Room 102 because Room 102 is being painted. I will bring printed copies of our May sales numbers for <strong>[135]</strong>.</p>
      <p class="mt-2">During the meeting, we will talk about our summer promotion and welcome our two new team members, Lisa and Tom. <strong>[136]</strong>. Please bring a pen and a notebook so you can write down important dates.</p>
      <p class="mt-2">If you cannot attend the meeting, please e-mail me <strong>[137]</strong> Friday afternoon. I hope to <strong>[138]</strong> all of you on Monday morning.</p>
      <p class="mt-2">Best,<br>David</p>
    </div>`,
    questions: [
      [135, 'Select the best answer to complete blank [135].',
        mkOpts('everyone', 'anyone', 'no one', 'someone'), 'A',
        'Tôi sẽ mang theo bản in số liệu bán hàng tháng Năm cho mọi người.',
        'Thư gửi "Hi Everyone" nên mang bản in cho "everyone" (tất cả mọi người).',
        [['weekly', 'adj.', 'hàng tuần'], ['instead of', 'prep.', 'thay vì'], ['printed copy', 'n.', 'bản in']]],
      [136, 'Select the best sentence to complete blank [136].',
        mkOpts(
          'They both joined our office earlier this week.',
          'The cafeteria on the first floor serves hot soup.',
          'All printers need new black ink next month.',
          'Please park your car behind the main building.'
        ), 'A',
        'Cả hai người họ đều vừa gia nhập văn phòng chúng ta đầu tuần này.',
        'Câu trước vừa nhắc tới "two new team members, Lisa and Tom" nên đại từ "They both" nối tiếp tự nhiên nhất.',
        [['join', 'v.', 'gia nhập, tham gia'], ['notebook', 'n.', 'sổ tay'], ['important', 'adj.', 'quan trọng']]],
      [137, 'Select the best answer to complete blank [137].',
        mkOpts('by', 'at', 'on', 'with'), 'A',
        'Nếu bạn không thể tham dự cuộc họp, vui lòng gửi e-mail cho tôi trước chiều thứ Sáu.',
        '"by + mốc thời gian" mang nghĩa "muộn nhất là vào / trước lúc" (trước chiều thứ Sáu).',
        [['attend', 'v.', 'tham dự'], ['e-mail', 'v.', 'gửi thư điện tử'], ['date', 'n.', 'ngày tháng']]],
      [138, 'Select the best answer to complete blank [138].',
        mkOpts('see', 'sees', 'saw', 'seeing'), 'A',
        'Tôi hy vọng sẽ gặp tất cả các bạn vào sáng thứ Hai.',
        'Cấu trúc "hope to + V nguyên thể": "hope to see".',
        [['hope', 'v.', 'hy vọng'], ['welcome', 'v.', 'chào đón'], ['paint', 'v.', 'sơn']]]
    ]
  },
  {
    passageTitle: 'Questions 139-142 refer to the following advertisement:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center text-base">Summer Swimming Classes at City Sports Center</p>
      <p class="mt-2">Do you want to learn how to swim or get better exercise this summer? Join our friendly swimming classes at City Sports Center! We have small groups for beginners, children, and adults. Each class is forty-five minutes <strong>[139]</strong> and is taught by a trained coach.</p>
      <p class="mt-2">Classes start on July 7 and meet twice a week on Tuesdays and Thursdays. Morning and evening times are available, so you can choose a schedule that <strong>[140]</strong> best for you.</p>
      <p class="mt-2"><strong>[141]</strong>. Families who sign up two or more people get a 15 percent discount on the total fee.</p>
      <p class="mt-2">Visit our front desk before June 30 to sign up and pay the class <strong>[142]</strong>.</p>
    </div>`,
    questions: [
      [139, 'Select the best answer to complete blank [139].',
        mkOpts('long', 'tall', 'high', 'wide'), 'A',
        'Mỗi buổi học kéo dài bốn mươi lăm phút và do huấn luyện viên được đào tạo giảng dạy.',
        'Nói về độ dài thời gian dùng tính từ "long" ("forty-five minutes long").',
        [['beginner', 'n.', 'người mới học'], ['coach', 'n.', 'huấn luyện viên'], ['exercise', 'n.', 'tập thể dục']]],
      [140, 'Select the best answer to complete blank [140].',
        mkOpts('works', 'work', 'working', 'worked'), 'A',
        'Có các ca sáng và tối, nên bạn có thể chọn lịch phù hợp nhất với mình.',
        'Chủ ngữ số ít "a schedule", câu ở hiện tại đơn nên động từ chia "works" (works best: phù hợp nhất).',
        [['twice a week', 'adv.', 'hai lần một tuần'], ['available', 'adj.', 'có sẵn'], ['choose', 'v.', 'lựa chọn']]],
      [141, 'Select the best sentence to complete blank [141].',
        mkOpts(
          'The center also offers special group prices for families.',
          'Our outdoor tennis courts open at seven o’clock.',
          'Bring a warm jacket if you walk home late at night.',
          'The parking lot has thirty spaces for visitors.'
        ), 'A',
        'Trung tâm cũng có mức giá nhóm đặc biệt dành cho các gia đình.',
        'Câu sau đó nói rõ "Families who sign up two or more people get a 15 percent discount" -> khớp với câu giới thiệu giá cho gia đình.',
        [['sign up', 'v.', 'đăng ký'], ['adult', 'n.', 'người lớn'], ['center', 'n.', 'trung tâm']]],
      [142, 'Select the best answer to complete blank [142].',
        mkOpts('fee', 'job', 'name', 'room'), 'A',
        'Ghé quầy lễ tân trước ngày 30 tháng 6 để đăng ký và đóng học phí.',
        '"pay the class fee" nghĩa là đóng học phí lớp học.',
        [['fee', 'n.', 'lệ phí, học phí'], ['total', 'adj.', 'tổng cộng'], ['friendly', 'adj.', 'thân thiện']]]
    ]
  },
  {
    passageTitle: 'Questions 143-146 refer to the following letter:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p>August 12</p>
      <p class="mt-2">Dear Ms. Carter,</p>
      <p class="mt-2">Thank you for booking a table for ten people at Green Garden Cafe this Saturday, August 16, at 7:00 P.M. We are very happy to host your birthday dinner in our quiet garden room.</p>
      <p class="mt-2">Your group will have a <strong>[143]</strong> waiter to take your drink and food orders quickly. If anyone in your party cannot eat nuts or dairy, please tell us before Friday so our chef can prepare safe dishes for <strong>[144]</strong>.</p>
      <p class="mt-2"><strong>[145]</strong>. Free parking is right behind our restaurant on River Road.</p>
      <p class="mt-2">Please call us at 555-0192 if you need to change the number of guests. We look forward to <strong>[146]</strong> you soon!</p>
      <p class="mt-2">Warm regards,<br>Tom Wilson<br>Green Garden Cafe</p>
    </div>`,
    questions: [
      [143, 'Select the best answer to complete blank [143].',
        mkOpts('dedicated', 'dedicate', 'dedicates', 'dedication'), 'A',
        'Nhóm của bạn sẽ có một nhân viên phục vụ riêng để ghi món đồ uống và đồ ăn thật nhanh chóng.',
        'Trước danh từ "waiter" cần tính từ "dedicated" (chuyên trách, phục vụ riêng).',
        [['book', 'v.', 'đặt trước'], ['host', 'v.', 'tiếp đón, tổ chức'], ['waiter', 'n.', 'nhân viên phục vụ']]],
      [144, 'Select the best answer to complete blank [144].',
        mkOpts('them', 'they', 'their', 'theirs'), 'A',
        'Nếu có ai không ăn được các loại hạt hoặc sữa, vui lòng báo trước thứ Sáu để đầu bếp chuẩn bị món ăn an toàn cho họ.',
        'Sau giới từ "for" cần đại từ tân ngữ "them" (thay cho những người dị ứng trong nhóm).',
        [['chef', 'n.', 'đầu bếp'], ['dish', 'n.', 'món ăn'], ['safe', 'adj.', 'an toàn']]],
      [145, 'Select the best sentence to complete blank [145].',
        mkOpts(
          'Your guests can also drive to the cafe easily.',
          'Our lunch menu includes three kinds of noodle soup.',
          'Last month we bought ten new wooden chairs.',
          'The cafe is closed every Tuesday morning.'
        ), 'A',
        'Khách của bạn cũng có thể lái xe đến quán một cách dễ dàng.',
        'Câu ngay sau nói về bãi đỗ xe miễn phí ngay phía sau nhà hàng -> câu dẫn về việc lái xe tới quán rất tự nhiên.',
        [['parking', 'n.', 'bãi đỗ xe'], ['guest', 'n.', 'khách mời'], ['garden', 'n.', 'khu vườn']]],
      [146, 'Select the best answer to complete blank [146].',
        mkOpts('seeing', 'see', 'saw', 'seen'), 'A',
        'Chúng tôi rất mong được sớm đón tiếp bạn!',
        'Cấu trúc "look forward to + V-ing": "look forward to seeing you".',
        [['look forward to', 'v.', 'mong đợi'], ['change', 'v.', 'thay đổi'], ['number', 'n.', 'số lượng']]]
    ]
  }
];

const part6 = [];
part6Groups.forEach((grp) => {
  grp.questions.forEach(([id, questionText, options, correct, translation, explanation, vocab]) => {
    part6.push({
      id: `reading-lv1-test-1-q${id}`,
      questionNumber: id,
      etsYear: '2026',
      etsTestId: 'reading-lv1-test-1',
      part: 'Part 6',
      partNumber: 6,
      partName: 'Part 6: Hoàn thành đoạn văn (Text Completion)',
      title: `Test 01 (Level 1) • Câu ${id} (Part 6: Hoàn thành đoạn văn)`,
      passageTitle: grp.passageTitle,
      passageHtml: grp.passageHtml,
      questionText,
      options,
      correct,
      translation,
      explanation,
      vocab: mkVocab(vocab)
    });
  });
});

// ==================== PART 7 (Q147 - Q200, 54 câu ngắn rõ ràng Level 1) ====================
const part7Passages = [
  // Single 1: Q147-148 (2 câu)
  {
    passageTitle: 'Questions 147-148 refer to the following coupon:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center text-base">FRESH MARKET GROCERY — $5 OFF COUPON</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Save $5 when you spend $30 or more on fresh fruit, vegetables, and bakery items in one shopping trip!</p>
      <p class="mt-2"><strong>Valid Dates:</strong> October 10 – October 20<br><strong>Store Hours:</strong> 8:00 A.M. – 9:00 P.M. daily<br><strong>Note:</strong> Show this paper coupon at the checkout counter. Limit one coupon per customer.</p>
    </div>`,
    questions: [
      [147, 'How much must a shopper spend to use this coupon?',
        mkOpts('At least $30', 'At least $5', 'Exactly $10', 'More than $50'), 'A',
        'Người mua phải chi tối thiểu bao nhiêu để dùng phiếu giảm giá này? — Ít nhất $30.',
        'Phiếu ghi rõ: "Save $5 when you spend $30 or more".',
        [['coupon', 'n.', 'phiếu giảm giá'], ['spend', 'v.', 'chi tiêu'], ['checkout counter', 'n.', 'quầy thanh toán']]],
      [148, 'When is the last day to use the coupon?',
        mkOpts('October 20', 'October 10', 'October 30', 'Every weekend'), 'A',
        'Ngày cuối cùng có thể dùng phiếu này là khi nào? — Ngày 20 tháng 10.',
        'Mục Valid Dates ghi: "October 10 – October 20".',
        [['valid', 'adj.', 'có hiệu lực'], ['limit', 'n.', 'giới hạn'], ['daily', 'adv.', 'hằng ngày']]]
    ]
  },
  // Single 2: Q149-150 (2 câu)
  {
    passageTitle: 'Questions 149-150 refer to the following text messages:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>Ben (11:05 A.M.):</strong> Hi Sara, are you going to the sandwich shop near our office for lunch?</p>
      <p class="mt-2"><strong>Sara (11:08 A.M.):</strong> Yes! I am walking there at 12:15 P.M. Do you want me to buy something for you?</p>
      <p class="mt-2"><strong>Ben (11:10 A.M.):</strong> That would be great. Could you get me a chicken salad sandwich and an iced tea? I will pay you back when you return.</p>
      <p class="mt-2"><strong>Sara (11:12 A.M.):</strong> No problem. See you around 12:40 P.M.!</p>
    </div>`,
    questions: [
      [149, 'Where is Sara going at 12:15 P.M.?',
        mkOpts('To a sandwich shop', 'To a post office', 'To a meeting room', 'To a train station'), 'A',
        'Sara sẽ đi đâu lúc 12:15 trưa? — Đến một cửa hàng bánh mì kẹp.',
        'Ben hỏi về "the sandwich shop near our office", và Sara trả lời "Yes! I am walking there at 12:15 P.M."',
        [['sandwich', 'n.', 'bánh mì kẹp'], ['iced tea', 'n.', 'trà đá'], ['pay back', 'v.', 'trả lại tiền']]],
      [150, 'What does Ben ask Sara to buy for him?',
        mkOpts('A sandwich and an iced tea', 'A cup of hot coffee and cake', 'A bowl of chicken soup', 'Two bottles of cold water'), 'A',
        'Ben nhờ Sara mua gì cho anh ấy? — Một bánh mì kẹp salad gà và một trà đá.',
        'Ben nhắn: "Could you get me a chicken salad sandwich and an iced tea?"',
        [['buy', 'v.', 'mua'], ['return', 'v.', 'quay trở lại'], ['around', 'prep.', 'khoảng chừng']]]
    ]
  },
  // Single 3: Q151-153 (3 câu)
  {
    passageTitle: 'Questions 151-153 refer to the following receipt:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">BLUE SKY BOOKSTORE</p>
      <p class="text-xs text-center">45 Elm Street • Tel: 555-0133 • Date: March 14</p>
      <hr class="my-2 border-neutral-300">
      <p>1 × Easy English Grammar Book ....... $18.00<br>2 × Blue Gel Pens ($2.50 each) ....... $5.00<br>1 × Desk Calendar ..................... $7.00</p>
      <hr class="my-2 border-neutral-300">
      <p><strong>Total Paid (Cash):</strong> $30.00</p>
      <p class="mt-2 text-xs">Items in new condition may be returned within 14 days with this receipt.</p>
    </div>`,
    questions: [
      [151, 'How many pens did the customer buy?',
        mkOpts('2', '1', '3', '4'), 'A',
        'Khách hàng đã mua bao nhiêu cây bút? — 2 cây.',
        'Hóa đơn ghi: "2 × Blue Gel Pens ($2.50 each)".',
        [['receipt', 'n.', 'hóa đơn biên nhận'], ['cash', 'n.', 'tiền mặt'], ['condition', 'n.', 'tình trạng']]],
      [152, 'How did the customer pay for the items?',
        mkOpts('With cash', 'With a credit card', 'With a gift coupon', 'By mobile app'), 'A',
        'Khách hàng đã thanh toán bằng cách nào? — Bằng tiền mặt.',
        'Hóa đơn ghi rõ: "Total Paid (Cash): $30.00".',
        [['total', 'n.', 'tổng số tiền'], ['calendar', 'n.', 'lịch'], ['return', 'v.', 'trả lại hàng']]],
      [153, 'What is the price of one desk calendar?',
        mkOpts('$7.00', '$5.00', '$18.00', '$30.00'), 'A',
        'Giá của một cuốn lịch để bàn là bao nhiêu? — $7.00.',
        'Dòng thứ ba trên hóa đơn ghi: "1 × Desk Calendar ... $7.00".',
        [['desk calendar', 'n.', 'lịch để bàn'], ['price', 'n.', 'giá cả'], ['within', 'prep.', 'trong vòng']]]
    ]
  },
  // Single 4: Q154-156 (3 câu)
  {
    passageTitle: 'Questions 154-156 refer to the following movie schedule:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">STARLIGHT CINEMA — FRIDAY SHOWTIMES</p>
      <table class="w-full mt-2 border-collapse border border-neutral-300 text-xs sm:text-sm">
        <thead><tr class="bg-neutral-100"><th class="border border-neutral-300 p-2 text-left">Movie Title</th><th class="border border-neutral-300 p-2 text-left">Screen</th><th class="border border-neutral-300 p-2 text-left">Times</th></tr></thead>
        <tbody>
          <tr><td class="border border-neutral-300 p-2">Morning Train</td><td class="border border-neutral-300 p-2">Screen 1</td><td class="border border-neutral-300 p-2">1:00 P.M., 4:00 P.M., 7:00 P.M.</td></tr>
          <tr><td class="border border-neutral-300 p-2">Ocean Friends (Kids)</td><td class="border border-neutral-300 p-2">Screen 2</td><td class="border border-neutral-300 p-2">12:30 P.M., 3:00 P.M., 5:30 P.M.</td></tr>
          <tr><td class="border border-neutral-300 p-2">City Lights</td><td class="border border-neutral-300 p-2">Screen 3</td><td class="border border-neutral-300 p-2">2:15 P.M., 6:00 P.M., 8:45 P.M.</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-xs">Ticket Prices: Adults $12 • Children under 12: $8</p>
    </div>`,
    questions: [
      [154, 'Which screen shows the movie Ocean Friends?',
        mkOpts('Screen 2', 'Screen 1', 'Screen 3', 'Screen 4'), 'A',
        'Phòng chiếu nào chiếu phim Ocean Friends? — Phòng chiếu 2 (Screen 2).',
        'Bảng lịch chiếu dòng 2: "Ocean Friends (Kids) | Screen 2".',
        [['cinema', 'n.', 'rạp chiếu phim'], ['showtime', 'n.', 'giờ chiếu phim'], ['screen', 'n.', 'màn hình/phòng chiếu']]],
      [155, 'What is the latest showtime for City Lights?',
        mkOpts('8:45 P.M.', '7:00 P.M.', '5:30 P.M.', '6:00 P.M.'), 'A',
        'Suất chiếu muộn nhất của phim City Lights là mấy giờ? — 8:45 tối.',
        'Phim City Lights có các suất: 2:15 P.M., 6:00 P.M., 8:45 P.M.',
        [['latest', 'adj.', 'muộn nhất'], ['ticket', 'n.', 'vé'], ['adult', 'n.', 'người lớn']]],
      [156, 'How much does a movie ticket cost for an 8-year-old child?',
        mkOpts('$8', '$12', '$10', '$15'), 'A',
        'Giá vé xem phim cho trẻ em 8 tuổi là bao nhiêu? — $8.',
        'Dòng giá vé ghi: "Children under 12: $8".',
        [['child', 'n.', 'trẻ em'], ['cost', 'v.', 'có giá là'], ['under', 'prep.', 'dưới']]]
    ]
  },
  // Single 5: Q157-159 (3 câu)
  {
    passageTitle: 'Questions 157-159 refer to the following office notice:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">OFFICE KITCHEN CLEANING NOTICE</p>
      <p class="mt-2">To all employees on the third floor:</p>
      <p class="mt-2">The cleaning staff will clean the office refrigerator every Friday at 5:00 P.M. Please take home any food, lunch boxes, or drinks you want to keep before 4:45 P.M. on Friday. Any items left inside after 5:00 P.M. without a name label will be thrown away.</p>
      <p class="mt-2">Thank you for helping keep our shared kitchen clean and fresh!</p>
    </div>`,
    questions: [
      [157, 'Who is this notice for?',
        mkOpts('Employees on the third floor', 'Building security guards', 'New customers visiting the office', 'Delivery drivers'), 'A',
        'Thông báo này dành cho ai? — Nhân viên ở tầng ba.',
        'Dòng đầu thông báo ghi: "To all employees on the third floor".',
        [['refrigerator', 'n.', 'tủ lạnh'], ['throw away', 'v.', 'vứt bỏ đi'], ['shared', 'adj.', 'dùng chung']]],
      [158, 'When will the cleaning staff clean the refrigerator?',
        mkOpts('Every Friday at 5:00 P.M.', 'Every Monday at 8:00 A.M.', 'Every Wednesday at noon', 'Every Saturday morning'), 'A',
        'Nhân viên vệ sinh sẽ lau dọn tủ lạnh khi nào? — Thứ Sáu hàng tuần lúc 5:00 chiều.',
        'Đoạn 2: "The cleaning staff will clean the office refrigerator every Friday at 5:00 P.M."',
        [['cleaning staff', 'n.', 'nhân viên dọn vệ sinh'], ['label', 'n.', 'nhãn dán tên'], ['lunch box', 'n.', 'hộp cơm trưa']]],
      [159, 'What will happen to unlabeled food left in the fridge after 5:00 P.M.?',
        mkOpts('It will be thrown away.', 'It will be moved to the first floor.', 'It will be given to new staff.', 'It will be kept until Monday.'), 'A',
        'Chuyện gì sẽ xảy ra với đồ ăn không dán tên để lại trong tủ lạnh sau 5:00 chiều? — Sẽ bị vứt bỏ.',
        'Thông báo nêu: "Any items left inside after 5:00 P.M. without a name label will be thrown away."',
        [['item', 'n.', 'món đồ'], ['keep', 'v.', 'giữ lại'], ['fresh', 'adj.', 'sạch sẽ, tươi mới']]]
    ]
  },
  // Single 6: Q160-163 (4 câu)
  {
    passageTitle: 'Questions 160-163 refer to the following lunch menu:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center text-base">RIVERVIEW CAFE — WEEKDAY LUNCH SPECIALS (11:30 A.M. – 2:00 P.M.)</p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Lunch Set A ($11):</strong> Grilled chicken sandwich, French fries, and a small green salad.</li>
        <li><strong>Lunch Set B ($10):</strong> Tomato vegetable soup, warm garlic bread, and apple juice.</li>
        <li><strong>Lunch Set C ($13):</strong> Beef noodle bowl with fresh herbs and a bottle of mineral water.</li>
      </ul>
      <p class="mt-2">Add a cup of hot coffee or iced green tea to any lunch set for just $2 extra! Free delivery for orders over $25 within two miles.</p>
    </div>`,
    questions: [
      [160, 'When are the weekday lunch specials served?',
        mkOpts('From 11:30 A.M. to 2:00 P.M.', 'From 8:00 A.M. to 11:00 A.M.', 'From 5:00 P.M. to 8:00 P.M.', 'All day Saturday and Sunday'), 'A',
        'Suất ăn trưa đặc biệt ngày thường được phục vụ khi nào? — Từ 11:30 trưa đến 2:00 chiều.',
        'Tiêu đề ghi rõ: "WEEKDAY LUNCH SPECIALS (11:30 A.M. – 2:00 P.M.)".',
        [['weekday', 'n.', 'ngày trong tuần'], ['grilled', 'adj.', 'nướng'], ['extra', 'adj.', 'thêm, phụ thêm']]],
      [161, 'Which lunch set is the least expensive?',
        mkOpts('Lunch Set B', 'Lunch Set A', 'Lunch Set C', 'All sets cost the same.'), 'A',
        'Suất ăn trưa nào có giá rẻ nhất? — Lunch Set B ($10).',
        'Set A giá $11, Set B giá $10, Set C giá $13 -> Set B rẻ nhất.',
        [['expensive', 'adj.', 'đắt tiền'], ['vegetable', 'n.', 'rau củ'], ['garlic', 'n.', 'tỏi']]],
      [162, 'How much extra does it cost to add a cup of hot coffee to a lunch set?',
        mkOpts('$2', '$10', '$11', '$25'), 'A',
        'Thêm một tách cà phê nóng vào suất ăn trưa tốn thêm bao nhiêu? — $2.',
        'Đoạn cuối: "Add a cup of hot coffee or iced green tea to any lunch set for just $2 extra!"',
        [['cup', 'n.', 'tách, cốc'], ['herb', 'n.', 'rau thơm'], ['mineral water', 'n.', 'nước khoáng']]],
      [163, 'How can customers get free delivery?',
        mkOpts('By ordering more than $25 within two miles', 'By ordering before 11:00 A.M.', 'By buying three cups of iced green tea', 'By paying in cash at the cafe'), 'A',
        'Khách hàng làm sao để được giao hàng miễn phí? — Đặt đơn trên $25 trong bán kính hai dặm.',
        'Câu cuối: "Free delivery for orders over $25 within two miles."',
        [['delivery', 'n.', 'việc giao hàng'], ['order', 'n.', 'đơn hàng'], ['mile', 'n.', 'dặm (đơn vị đo)']]]
    ]
  },
  // Single 7: Q164-166 (3 câu)
  {
    passageTitle: 'Questions 164-166 refer to the following train ticket:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">METRO RAIL — PASSENGER BOARDING PASS</p>
      <hr class="my-2 border-neutral-300">
      <p><strong>Passenger:</strong> Helen Cho<br><strong>From:</strong> Central Station → <strong>To:</strong> Harbor City<br><strong>Date:</strong> Saturday, September 20 • <strong>Departure:</strong> 10:15 A.M.<br><strong>Car:</strong> 4 • <strong>Seat:</strong> 12A (Window)<br><strong>Ticket Price:</strong> $24.00</p>
      <p class="mt-2 text-xs">Please arrive at the platform at least 10 minutes before departure. Each passenger may carry two bags for free.</p>
    </div>`,
    questions: [
      [164, 'Where is Helen Cho traveling to?',
        mkOpts('Harbor City', 'Central Station', 'Oak Street', 'Starlight Cinema'), 'A',
        'Helen Cho đang đi du lịch tới đâu? — Harbor City.',
        'Vé ghi: "From: Central Station → To: Harbor City".',
        [['passenger', 'n.', 'hành khách'], ['departure', 'n.', 'giờ khởi hành'], ['seat', 'n.', 'chỗ ngồi']]],
      [165, 'Which seat does Helen Cho have?',
        mkOpts('12A in Car 4', '4A in Car 12', '10A in Car 1', '15B in Car 2'), 'A',
        'Helen Cho ngồi ở ghế nào? — Ghế 12A ở toa số 4 (Car 4).',
        'Thông tin trên vé: "Car: 4 • Seat: 12A (Window)".',
        [['car', 'n.', 'toa tàu'], ['window', 'n.', 'cửa sổ'], ['bag', 'n.', 'túi hành lý']]],
      [166, 'How many bags can each passenger bring without paying extra?',
        mkOpts('Two bags', 'One bag', 'Four bags', 'Ten bags'), 'A',
        'Mỗi hành khách được mang bao nhiêu túi miễn phí? — Hai túi.',
        'Dòng lưu ý: "Each passenger may carry two bags for free."',
        [['carry', 'v.', 'mang theo'], ['for free', 'phr.', 'miễn phí'], ['station', 'n.', 'nhà ga']]]
    ]
  },
  // Single 8: Q167-169 (3 câu)
  {
    passageTitle: 'Questions 167-169 refer to the following job advertisement:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">HELP WANTED: PART-TIME FLOWER SHOP ASSISTANT</p>
      <p class="mt-2">Daisy Corner Flower Shop is looking for a friendly part-time assistant to work on Saturdays and Sundays from 9:00 A.M. to 3:00 P.M.</p>
      <p class="mt-2"><strong>Duties:</strong> Greet customers, water plants, wrap flower bouquets, and help at the cash register.<br><strong>Pay:</strong> $16 per hour + free lunch.<br>No previous flower shop experience is needed—we will train you! Call Lisa at 555-0177 or visit our shop at 22 Maple Avenue.</p>
    </div>`,
    questions: [
      [167, 'When will the assistant work?',
        mkOpts('On Saturdays and Sundays', 'Monday through Friday', 'Every evening after 6:00 P.M.', 'Only on Wednesday mornings'), 'A',
        'Nhân viên phụ việc sẽ làm việc vào lúc nào? — Vào các ngày thứ Bảy và Chủ Nhật.',
        'Đoạn 1 ghi: "work on Saturdays and Sundays from 9:00 A.M. to 3:00 P.M."',
        [['part-time', 'adj.', 'bán thời gian'], ['assistant', 'n.', 'trợ lý, phụ việc'], ['bouquet', 'n.', 'bó hoa']]],
      [168, 'What is the hourly pay for this job?',
        mkOpts('$16 per hour', '$12 per hour', '$22 per hour', '$30 per hour'), 'A',
        'Mức lương theo giờ cho công việc này là bao nhiêu? — $16 một giờ.',
        'Mục Pay ghi: "$16 per hour + free lunch."',
        [['hourly pay', 'n.', 'lương theo giờ'], ['cash register', 'n.', 'máy tính tiền'], ['wrap', 'v.', 'gói, bọc']]],
      [169, 'What is true about experience for this job?',
        mkOpts('No previous experience is required.', 'Two years of experience is required.', 'Applicants must know how to drive a truck.', 'Only college students may apply.'), 'A',
        'Điều gì đúng về yêu cầu kinh nghiệm cho công việc này? — Không cần kinh nghiệm trước đó.',
        'Dòng cuối ghi: "No previous flower shop experience is needed—we will train you!"',
        [['previous', 'adj.', 'trước đây'], ['train', 'v.', 'đào tạo, hướng dẫn'], ['plant', 'n.', 'cây xanh']]]
    ]
  },
  // Single 9: Q170-172 (3 câu)
  {
    passageTitle: 'Questions 170-172 refer to the following instructions:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">HOW TO USE THE OFFICE COFFEE MAKER</p>
      <ol class="list-decimal pl-5 mt-2 space-y-1">
        <li>Fill the water tank on the left side with clean cold water.</li>
        <li>Place one coffee pod into the top holder and close the lid firmly.</li>
        <li>Put your mug under the spout and press the green <strong>BREW</strong> button.</li>
        <li>Wait about 40 seconds until the green light stops blinking.</li>
      </ol>
      <p class="mt-2 text-xs">Please throw away the used pod after making your coffee so the machine stays clean for the next person.</p>
    </div>`,
    questions: [
      [170, 'Where should users pour the cold water?',
        mkOpts('Into the tank on the left side', 'Into the top coffee pod holder', 'Directly onto the green button', 'Into the mug under the spout'), 'A',
        'Người dùng nên đổ nước lạnh vào đâu? — Vào bình chứa ở phía bên trái.',
        'Bước 1: "Fill the water tank on the left side with clean cold water."',
        [['water tank', 'n.', 'bình chứa nước'], ['mug', 'n.', 'cốc lớn, ca'], ['lid', 'n.', 'nắp đậy']]],
      [171, 'How long does it take to brew a cup of coffee?',
        mkOpts('About 40 seconds', 'About 5 minutes', 'About 10 minutes', 'Exactly 2 seconds'), 'A',
        'Pha một tách cà phê mất bao lâu? — Khoảng 40 giây.',
        'Bước 4: "Wait about 40 seconds until the green light stops blinking."',
        [['brew', 'v.', 'pha (cà phê/trà)'], ['blink', 'v.', 'nhấp nháy'], ['firmly', 'adv.', 'chắc chắn, chặt']]],
      [172, 'What should users do after making their coffee?',
        mkOpts('Throw away the used coffee pod', 'Unplug the machine immediately', 'Wash the green button with soap', 'Refill the machine with hot water'), 'A',
        'Người dùng nên làm gì sau khi pha xong cà phê? — Vứt bỏ viên nén cà phê đã dùng.',
        'Lưu ý cuối: "Please throw away the used pod after making your coffee".',
        [['used', 'adj.', 'đã qua sử dụng'], ['clean', 'adj.', 'sạch sẽ'], ['next', 'adj.', 'tiếp theo']]]
    ]
  },
  // Single 10: Q173-175 (3 câu)
  {
    passageTitle: 'Questions 173-175 refer to the following hotel review:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">★★★★★ — Clean Rooms and Great Breakfast! (By Mark T.)</p>
      <p class="mt-2">My wife and I stayed at Harbor Inn for three nights last weekend. Our room on the fourth floor was bright, quiet, and very clean. The hotel is just a five-minute walk from the main subway station, which made sightseeing around the city super easy.</p>
      <p class="mt-2">Every morning, the hotel served a free hot breakfast with eggs, toast, fresh fruit, and coffee. The staff at the front desk even printed our museum tickets for us. We will definitely stay here again next summer!</p>
    </div>`,
    questions: [
      [173, 'How long did Mark T. and his wife stay at Harbor Inn?',
        mkOpts('Three nights', 'One night', 'Five nights', 'Two weeks'), 'A',
        'Mark T. và vợ đã ở lại Harbor Inn bao lâu? — Ba đêm.',
        'Đoạn 1: "stayed at Harbor Inn for three nights last weekend."',
        [['stay', 'v.', 'ở lại, lưu trú'], ['bright', 'adj.', 'sáng sủa'], ['sightseeing', 'n.', 'ngắm cảnh, du lịch']]],
      [174, 'Why was it easy for Mark T. to travel around the city?',
        mkOpts('The hotel is a short walk from a subway station.', 'The hotel gave guests a free rental car.', 'A tour bus stopped right inside the lobby.', 'All museums were across the street.'), 'A',
        'Vì sao Mark T. dễ dàng đi lại quanh thành phố? — Khách sạn chỉ cách ga tàu điện ngầm năm phút đi bộ.',
        'Câu 3 đoạn 1: "The hotel is just a five-minute walk from the main subway station".',
        [['subway station', 'n.', 'ga tàu điện ngầm'], ['walk', 'n.', 'quãng đi bộ'], ['definitely', 'adv.', 'chắc chắn rồi']]],
      [175, 'How did the front desk staff help Mark T.?',
        mkOpts('They printed museum tickets for him.', 'They drove him to the airport.', 'They cooked eggs for his dinner.', 'They upgraded his room to a suite.'), 'A',
        'Nhân viên lễ tân đã giúp Mark T. việc gì? — Họ đã in vé bảo tàng giúp anh ấy.',
        'Đoạn 2: "The staff at the front desk even printed our museum tickets for us."',
        [['print', 'v.', 'in ấn'], ['toast', 'n.', 'bánh mì nướng'], ['breakfast', 'n.', 'bữa sáng']]]
    ]
  },

  // Double Passage 1: Q176-180 (5 câu Level 1)
  {
    passageTitle: 'Questions 176-180 refer to the following e-mail and order invoice:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: E-mail</p>
        <p><strong>To:</strong> orders@sweetdaybakery.com<br><strong>From:</strong> Amy Chen<br><strong>Date:</strong> July 2<br><strong>Subject:</strong> Birthday Cake Order</p>
        <p class="mt-1">Hello! I would like to order a birthday cake for my sister's party on Saturday, July 5. Can you make a medium chocolate cake with the message "Happy Birthday Mia!" on top? I also need two boxes of strawberry cookies. I can pick up the order at 2:00 P.M. on Saturday. Please send me the total cost.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Sweet Day Bakery — Order Summary</p>
        <p class="text-xs text-slate-600">Customer: Amy Chen • Pickup Date: Saturday, July 5 at 2:00 P.M.</p>
        <p class="mt-1">1 × Medium Chocolate Cake ("Happy Birthday Mia!") ..... $35.00<br>2 × Strawberry Cookie Box ($8.00 each) ................. $16.00<br><strong>Total Amount:</strong> $51.00 (Pay at pickup)</p>
      </div>
    </div>`,
    questions: [
      [176, 'Why is Amy Chen ordering a cake?',
        mkOpts('For her sister’s birthday party', 'For a company office lunch', 'For a wedding celebration', 'For a school graduation'), 'A',
        'Amy Chen đặt bánh để làm gì? — Cho tiệc sinh nhật của em/chị gái cô ấy.',
        'Email ghi: "order a birthday cake for my sister\'s party on Saturday, July 5."',
        [['party', 'n.', 'bữa tiệc'], ['message', 'n.', 'lời nhắn'], ['chocolate', 'n.', 'sô-cô-la']]],
      [177, 'What flavor cake did Amy Chen ask for?',
        mkOpts('Chocolate', 'Strawberry', 'Vanilla', 'Lemon'), 'A',
        'Amy Chen đã đặt bánh vị gì? — Vị sô-cô-la.',
        'Email nêu rõ: "a medium chocolate cake".',
        [['flavor', 'n.', 'hương vị'], ['medium', 'adj.', 'cỡ vừa'], ['strawberry', 'n.', 'dâu tây']]],
      [178, 'When will Amy Chen pick up her order?',
        mkOpts('On July 5 at 2:00 P.M.', 'On July 2 at 2:00 P.M.', 'On July 5 at 9:00 A.M.', 'On July 6 in the evening'), 'A',
        'Khi nào Amy Chen sẽ tới lấy đơn hàng? — Ngày 5 tháng 7 lúc 2:00 chiều.',
        'Cả hai văn bản đều ghi rõ: "Saturday, July 5 at 2:00 P.M."',
        [['pickup', 'n.', 'việc đến lấy hàng'], ['summary', 'n.', 'bản tóm tắt'], ['cookie', 'n.', 'bánh quy']]],
      [179, 'How much does one box of strawberry cookies cost?',
        mkOpts('$8.00', '$16.00', '$35.00', '$51.00'), 'A',
        'Một hộp bánh quy dâu tây giá bao nhiêu? — $8.00.',
        'Bảng đơn hàng ghi: "2 × Strawberry Cookie Box ($8.00 each) ... $16.00".',
        [['amount', 'n.', 'số tiền'], ['each', 'adv.', 'mỗi cái/hộp'], ['bakery', 'n.', 'tiệm bánh']]],
      [180, 'When will Amy Chen pay for the order?',
        mkOpts('When she picks up the items', 'By credit card on July 2', 'After the birthday party ends', 'At a nearby grocery store'), 'A',
        'Amy Chen sẽ thanh toán khi nào? — Khi cô ấy đến lấy hàng.',
        'Cuối Document 2 ghi: "(Pay at pickup)".',
        [['pay', 'v.', 'thanh toán'], ['sister', 'n.', 'chị/em gái'], ['top', 'n.', 'bề mặt trên']]]
    ]
  },

  // Double Passage 2: Q181-185 (5 câu Level 1)
  {
    passageTitle: 'Questions 181-185 refer to the following flyer and text message:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Event Flyer</p>
        <p class="font-bold">CITY PARK BOOK FAIR — SUNDAY, MAY 18 (10:00 A.M. – 5:00 P.M.)</p>
        <p class="mt-1">Come visit over 30 book tents at City Park! Free entry for everyone.</p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>11:00 A.M.:</strong> Children's Story Hour (Green Tent)</li>
          <li><strong>1:30 P.M.:</strong> Cooking Book Talk with Chef Carlos (Blue Tent)</li>
          <li><strong>3:00 P.M.:</strong> Used Books Sale — All paperbacks $2!</li>
        </ul>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Text Message from Nina to Leo</p>
        <p class="mt-1">Hi Leo! Are you free this Sunday afternoon? Let's go to the City Park Book Fair together! I really want to hear Chef Carlos talk about cooking books at 1:30 P.M., and then we can look for cheap novels at 3:00 P.M. Let's meet at the park front gate at 1:00 P.M.!</p>
      </div>
    </div>`,
    questions: [
      [181, 'How much does it cost to enter the City Park Book Fair?',
        mkOpts('It is free.', '$2 per person', '$5 per family', '$10 at the gate'), 'A',
        'Vé vào cửa hội chợ sách City Park giá bao nhiêu? — Miễn phí.',
        'Tờ rơi ghi rõ: "Free entry for everyone."',
        [['book fair', 'n.', 'hội chợ sách'], ['entry', 'n.', 'lối vào/vé vào'], ['tent', 'n.', 'lều, gian hàng']]],
      [182, 'Which tent will host the Children’s Story Hour?',
        mkOpts('Green Tent', 'Blue Tent', 'Red Tent', 'Front Gate'), 'A',
        'Gian hàng nào tổ chức Giờ kể chuyện cho trẻ em? — Lều Xanh lá (Green Tent).',
        'Tờ rơi: "11:00 A.M.: Children\'s Story Hour (Green Tent)".',
        [['story', 'n.', 'câu chuyện'], ['cheap', 'adj.', 'rẻ'], ['novel', 'n.', 'tiểu thuyết']]],
      [183, 'Why does Nina want to arrive by 1:30 P.M.?',
        mkOpts('To listen to Chef Carlos’s talk', 'To attend Children’s Story Hour', 'To set up a book tent', 'To meet a friend for breakfast'), 'A',
        'Vì sao Nina muốn có mặt trước 1:30 chiều? — Để nghe buổi nói chuyện của Đầu bếp Carlos.',
        'Nina viết: "I really want to hear Chef Carlos talk about cooking books at 1:30 P.M."',
        [['cooking', 'n.', 'việc nấu ăn'], ['gate', 'n.', 'cổng'], ['together', 'adv.', 'cùng nhau']]],
      [184, 'How much do used paperback books cost at 3:00 P.M.?',
        mkOpts('$2 each', '$1 each', '$5 each', '$10 each'), 'A',
        'Sách bìa mềm cũ bán lúc 3:00 chiều giá bao nhiêu? — $2 mỗi cuốn.',
        'Tờ rơi: "3:00 P.M.: Used Books Sale — All paperbacks $2!"',
        [['paperback', 'n.', 'sách bìa mềm'], ['used', 'adj.', 'đã qua sử dụng'], ['sale', 'n.', 'đợt giảm giá/bán hàng']]],
      [185, 'Where does Nina ask Leo to meet her?',
        mkOpts('At the park front gate', 'Inside the Blue Tent', 'At a downtown bookstore', 'At a nearby bus stop'), 'A',
        'Nina hẹn gặp Leo ở đâu? — Ở cổng trước công viên.',
        'Câu cuối tin nhắn: "Let\'s meet at the park front gate at 1:00 P.M.!"',
        [['meet', 'v.', 'gặp gỡ'], ['afternoon', 'n.', 'buổi chiều'], ['free', 'adj.', 'rảnh rỗi/miễn phí']]]
    ]
  },

  // Triple Passage 1: Q186-190 (5 câu Level 1)
  {
    passageTitle: 'Questions 186-190 refer to the following bus schedule, e-mail, and text message:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Airport Express Bus Schedule (Daily)</p>
        <p class="mt-1"><strong>From City Airport to Downtown Hotel:</strong><br>Bus #101: Departs 8:00 A.M. — Arrives 8:40 A.M.<br>Bus #102: Departs 9:30 A.M. — Arrives 10:10 A.M.<br>Bus #103: Departs 11:00 A.M. — Arrives 11:40 A.M.<br>Ticket: $10 one-way (buy on bus or online).</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: E-mail from Kenji Sato to Hotel Front Desk</p>
        <p class="mt-1">Hello, my flight arrives at City Airport at 9:00 A.M. on Tuesday, August 5. I plan to take Bus #102 at 9:30 A.M. to your Downtown Hotel. Can I leave my suitcase at the front desk when I arrive at 10:10 A.M. before room check-in at 2:00 P.M.? Thank you, Kenji Sato.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: Hotel Front Desk Reply</p>
        <p class="mt-1">Dear Mr. Sato, yes, of course! We will be happy to hold your suitcase for free starting at 10:10 A.M. Just show your passport at our lobby desk. See you on Tuesday!</p>
      </div>
    </div>`,
    questions: [
      [186, 'How long does the Airport Express Bus ride take?',
        mkOpts('40 minutes', '20 minutes', '60 minutes', '90 minutes'), 'A',
        'Chuyến xe buýt tốc hành sân bay mất bao lâu? — 40 phút.',
        'Bus #101 đi 8:00 → 8:40; Bus #102 đi 9:30 → 10:10 -> tất cả đều mất đúng 40 phút.',
        [['express bus', 'n.', 'xe buýt tốc hành'], ['one-way', 'adj.', 'một chiều'], ['flight', 'n.', 'chuyến bay']]],
      [187, 'Which bus will Kenji Sato take to the hotel?',
        mkOpts('Bus #102', 'Bus #101', 'Bus #103', 'Bus #104'), 'A',
        'Kenji Sato sẽ đi xe buýt số mấy tới khách sạn? — Bus #102.',
        'Anh viết trong e-mail: "I plan to take Bus #102 at 9:30 A.M."',
        [['plan', 'v.', 'dự định'], ['suitcase', 'n.', 'va-li'], ['check-in', 'n.', 'làm thủ tục nhận phòng']]],
      [188, 'How much is a one-way bus ticket?',
        mkOpts('$10', '$20', '$40', '$15'), 'A',
        'Giá vé xe buýt một chiều là bao nhiêu? — $10.',
        'Lịch xe buýt ghi: "Ticket: $10 one-way".',
        [['ticket', 'n.', 'vé'], ['online', 'adv.', 'trực tuyến'], ['lobby', 'n.', 'sảnh khách sạn']]],
      [189, 'What does Kenji Sato want to do when he reaches the hotel at 10:10 A.M.?',
        mkOpts('Leave his suitcase at the front desk', 'Have lunch in the hotel garden', 'Take a taxi back to the airport', 'Change his flight to Wednesday'), 'A',
        'Kenji Sato muốn làm gì khi tới khách sạn lúc 10:10 sáng? — Gửi lại va-li ở quầy lễ tân.',
        'Anh hỏi: "Can I leave my suitcase at the front desk when I arrive at 10:10 A.M.?"',
        [['leave', 'v.', 'để lại, gửi lại'], ['hold', 'v.', 'giữ giúp'], ['arrive', 'v.', 'tới nơi']]],
      [190, 'What should Mr. Sato show at the lobby desk?',
        mkOpts('His passport', 'His bus ticket', 'His driver’s license', 'His office ID'), 'A',
        'Ông Sato cần xuất trình gì tại quầy sảnh lễ tân? — Hộ chiếu (passport) của ông ấy.',
        'Thư trả lời của khách sạn ghi: "Just show your passport at our lobby desk."',
        [['passport', 'n.', 'hộ chiếu'], ['reply', 'n.', 'thư trả lời'], ['free', 'adj.', 'miễn phí']]]
    ]
  },

  // Triple Passage 2: Q191-195 (5 câu Level 1)
  {
    passageTitle: 'Questions 191-195 refer to the following gym price list, sign-up form, and e-mail:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Peak Fitness Gym — Monthly Plans</p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Basic Plan ($30/month):</strong> Gym machines &amp; locker room (6:00 A.M. – 10:00 P.M.).</li>
          <li><strong>Plus Plan ($45/month):</strong> All Basic Plan features + Yoga and Cycling classes.</li>
          <li><strong>VIP Plan ($65/month):</strong> All Plus Plan features + Swimming pool &amp; 2 personal trainer sessions.</li>
        </ul>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Member Sign-Up Form</p>
        <p class="mt-1"><strong>Name:</strong> Daniel Park • <strong>Selected Plan:</strong> Plus Plan ($45/month)<br><strong>Start Date:</strong> September 1 • <strong>Goal:</strong> Join Tuesday evening Yoga classes.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: Welcome E-mail</p>
        <p class="mt-1">Welcome to Peak Fitness, Daniel! Your Plus Plan starts on September 1. Please come 15 minutes early on your first visit to pick up your member keycard at the front desk. Remember to bring clean sports shoes and a small towel.</p>
      </div>
    </div>`,
    questions: [
      [191, 'How much will Daniel Park pay each month?',
        mkOpts('$45', '$30', '$65', '$15'), 'A',
        'Daniel Park sẽ trả bao nhiêu tiền mỗi tháng? — $45.',
        'Đơn đăng ký ghi: "Selected Plan: Plus Plan ($45/month)".',
        [['monthly', 'adj.', 'hàng tháng'], ['locker room', 'n.', 'phòng thay đồ có tủ khóa'], ['plan', 'n.', 'gói dịch vụ']]],
      [192, 'Which feature is included only in the VIP Plan?',
        mkOpts('Swimming pool access', 'Locker room use', 'Gym machines', 'Yoga classes'), 'A',
        'Tiện ích nào chỉ có trong gói VIP? — Sử dụng hồ bơi.',
        'Bảng giá ghi VIP Plan có thêm "Swimming pool & 2 personal trainer sessions".',
        [['feature', 'n.', 'tính năng, tiện ích'], ['personal trainer', 'n.', 'huấn luyện viên cá nhân'], ['session', 'n.', 'buổi tập']]],
      [193, 'Why did Daniel Park choose the Plus Plan?',
        mkOpts('He wants to take Tuesday evening Yoga classes.', 'He wants to swim every morning.', 'He needs a personal trainer twice a month.', 'He only wants to use gym machines.'), 'A',
        'Tại sao Daniel Park chọn gói Plus Plan? — Vì anh ấy muốn tham gia lớp Yoga tối thứ Ba.',
        'Đơn đăng ký ghi mục Goal: "Join Tuesday evening Yoga classes."',
        [['goal', 'n.', 'mục tiêu'], ['cycling', 'n.', 'đạp xe'], ['visit', 'n.', 'lần ghé thăm']]],
      [194, 'Where will Daniel get his member keycard?',
        mkOpts('At the front desk', 'In the yoga studio', 'By postal mail', 'At the swimming pool'), 'A',
        'Daniel sẽ nhận thẻ hội viên ở đâu? — Tại quầy lễ tân.',
        'Email chào mừng: "pick up your member keycard at the front desk."',
        [['keycard', 'n.', 'thẻ từ ra vào'], ['towel', 'n.', 'khăn lau'], ['early', 'adv.', 'sớm']]],
      [195, 'What should Daniel bring with him to the gym?',
        mkOpts('Clean sports shoes and a small towel', 'A yoga mat and two water bottles', 'A paper receipt and a padlock', 'Swimwear and a large backpack'), 'A',
        'Daniel nên mang theo gì khi đến phòng tập? — Giày thể thao sạch và một chiếc khăn nhỏ.',
        'Câu cuối email: "Remember to bring clean sports shoes and a small towel."',
        [['sports shoes', 'n.', 'giày thể thao'], ['remember', 'v.', 'nhớ'], ['welcome', 'v.', 'chào mừng']]]
    ]
  },

  // Triple Passage 3: Q196-200 (5 câu Level 1)
  {
    passageTitle: 'Questions 196-200 refer to the following school notice, room list, and e-mail:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Notice — BrightFuture Language School</p>
        <p class="mt-1">Room 105 is closed for air-conditioner repair on Wednesday, October 8. All Wednesday classes in Room 105 must move to an open room on the second floor.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Second-Floor Open Rooms (Wednesday 6:00–8:00 P.M.)</p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Room 201:</strong> 12 seats (Whiteboard) — Open</li>
          <li><strong>Room 203:</strong> 24 seats (Whiteboard + Projector) — Open</li>
          <li><strong>Room 205:</strong> 20 seats (Whiteboard) — Booked</li>
        </ul>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: E-mail from Teacher Laura Bell</p>
        <p class="mt-1">Hi Office Staff, my Beginner English class meets on Wednesday from 6:00 to 8:00 P.M. (usually in Room 105). I have 18 students, and I need a projector for my lesson slides. Please move our class to a matching open room!</p>
      </div>
    </div>`,
    questions: [
      [196, 'Why is Room 105 closed on Wednesday, October 8?',
        mkOpts('The air conditioner is being repaired.', 'New student desks are arriving.', 'The teacher is out of town.', 'The floor is being painted.'), 'A',
        'Tại sao Phòng 105 đóng cửa vào thứ Tư ngày 8 tháng 10? — Vì máy điều hòa đang được sửa chữa.',
        'Thông báo ghi: "Room 105 is closed for air-conditioner repair on Wednesday, October 8."',
        [['air conditioner', 'n.', 'máy điều hòa'], ['repair', 'n.', 'sự sửa chữa'], ['open', 'adj.', 'trống, sẵn sàng']]],
      [197, 'How many students are in Laura Bell’s class?',
        mkOpts('18 students', '12 students', '20 students', '24 students'), 'A',
        'Lớp của cô Laura Bell có bao nhiêu học viên? — 18 học viên.',
        'Email cô viết: "I have 18 students".',
        [['student', 'n.', 'học viên'], ['lesson', 'n.', 'bài học'], ['projector', 'n.', 'máy chiếu']]],
      [198, 'What equipment does Laura Bell need for her class?',
        mkOpts('A projector', 'Twenty-four laptops', 'A television set', 'Two microphones'), 'A',
        'Cô Laura Bell cần thiết bị gì cho buổi học? — Một máy chiếu (projector).',
        'Email ghi: "I need a projector for my lesson slides."',
        [['slide', 'n.', 'trang trình chiếu'], ['whiteboard', 'n.', 'bảng trắng'], ['booked', 'adj.', 'đã được đặt trước']]],
      [199, 'Why can’t Laura Bell’s class use Room 201?',
        mkOpts('It only has 12 seats and no projector.', 'It is already booked for another class.', 'It is on the first floor.', 'Its air conditioner is broken.'), 'A',
        'Tại sao lớp của cô Laura Bell không thể dùng Phòng 201? — Vì phòng chỉ có 12 chỗ ngồi và không có máy chiếu.',
        'Phòng 201 chỉ có 12 ghế (không đủ 18 học viên) và chỉ có Whiteboard.',
        [['seat', 'n.', 'chỗ ngồi'], ['match', 'v.', 'phù hợp, khớp'], ['usually', 'adv.', 'thông thường']]],
      [200, 'Which room should Laura Bell’s class move to?',
        mkOpts('Room 203', 'Room 201', 'Room 205', 'Room 105'), 'A',
        'Lớp của cô Laura Bell nên chuyển sang phòng nào? — Phòng 203.',
        'Phòng 203 có 24 chỗ (>18 học viên), có Whiteboard + Projector và đang Open.',
        [['move', 'v.', 'di chuyển, chuyển sang'], ['office staff', 'n.', 'nhân viên văn phòng'], ['language school', 'n.', 'trường ngoại ngữ']]]
    ]
  }
];

const part7 = [];
part7Passages.forEach((grp) => {
  grp.questions.forEach(([id, questionText, options, correct, translation, explanation, vocab]) => {
    part7.push({
      id: `reading-lv1-test-1-q${id}`,
      questionNumber: id,
      etsYear: '2026',
      etsTestId: 'reading-lv1-test-1',
      part: 'Part 7',
      partNumber: 7,
      partName: 'Part 7: Đọc hiểu (Reading Comprehension)',
      title: `Test 01 (Level 1) • Câu ${id} (Part 7: Đọc hiểu)`,
      passageTitle: grp.passageTitle,
      passageHtml: grp.passageHtml,
      questionText,
      options,
      correct,
      translation,
      explanation,
      vocab: mkVocab(vocab)
    });
  });
});

const allExercises = [...part5, ...part6, ...part7].map(item => {
  const dist = distributeCorrectOption(item.options, item.correct, item.questionNumber);
  return { ...item, options: dist.options, correct: dist.correct };
});

const meta = {
  id: 'reading-lv1-test-1',
  level: 1,
  year: '2026',
  code: 'Test 01',
  title: 'Đề Luyện đọc Level 1 (300–400) - Test 01'
};

const readingDir = path.join(ROOT, 'reading');
fs.mkdirSync(readingDir, { recursive: true });

const output = `/**
 * Đề Luyện đọc Level 1 (300–400) Test 01 (100 câu Part 5–7 độc lập).
 * Sinh tự động bởi tools/build_reading_lv1_test1.js — không sửa tay.
 */
(function () {
    const D = window.DAU_DATA = window.DAU_DATA || {};
    D.etsReadingTests = D.etsReadingTests || [];
    D.readingExercises = D.readingExercises || [];
    const meta = ${JSON.stringify(meta)};
    if (!D.etsReadingTests.some(x => x.id === meta.id)) D.etsReadingTests.push(meta);
    D.readingExercises.push(...${JSON.stringify(allExercises)});
})();
`;

const outPath = path.join(readingDir, 'lv1-test-01.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`Built ${outPath}: total=${allExercises.length} (P5=${part5.length}, P6=${part6.length}, P7=${part7.length})`);
