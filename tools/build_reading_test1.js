/**
 * Sinh đề Luyện đọc Test 01 (100 câu Part 5, 6, 7 độc lập, không liên quan Test 1 của mockTests).
 * Chạy: node tools/build_reading_test1.js
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

// ==================== PART 5 (Q101 - Q130, 30 câu) ====================
const part5Raw = [
  [101, "Ms. Alvarez _______ the regional sales presentation before the board members arrived.",
    mkOpts("had rehearsed", "rehearses", "will rehearse", "is rehearsing"), "A",
    "Cô Alvarez đã tập dượt bài thuyết trình bán hàng khu vực trước khi các thành viên hội đồng quản trị đến.",
    "Mệnh đề 'before the board members arrived' chia quá khứ đơn; hành động tập dượt xảy ra trước đó nên dùng quá khứ hoàn thành 'had rehearsed'.",
    [["rehearse", "v.", "tập dượt, diễn tập"], ["regional", "adj.", "thuộc khu vực"], ["board member", "n.", "thành viên hội đồng quản trị"]]],
  [102, "All laboratory technicians must wear protective eyewear _______ inside the testing facility.",
    mkOpts("while", "during", "despite", "unless"), "A",
    "Tất cả kỹ thuật viên phòng thí nghiệm phải đeo kính bảo hộ khi ở bên trong cơ sở kiểm nghiệm.",
    "'while' có thể dùng với cụm giới từ chỉ nơi chốn ('while inside...'). 'during' phải đi với danh từ.",
    [["protective", "adj.", "bảo hộ, bảo vệ"], ["eyewear", "n.", "kính mắt"], ["facility", "n.", "cơ sở, trang thiết bị"]]],
  [103, "The new accounting software automates invoice tracking far more _______ than the previous version.",
    mkOpts("accurately", "accurate", "accuracy", "accuracies"), "A",
    "Phần mềm kế toán mới tự động hóa việc theo dõi hóa đơn chính xác hơn nhiều so với phiên bản trước.",
    "Cần trạng từ bổ nghĩa cho động từ 'automates' trong cấu trúc so sánh hơn ('more accurately than').",
    [["automate", "v.", "tự động hóa"], ["invoice", "n.", "hóa đơn"], ["track", "v.", "theo dõi"]]],
  [104, "Please review the attached itinerary and notify _______ of any necessary travel adjustments.",
    mkOpts("us", "we", "our", "ours"), "A",
    "Vui lòng xem lại lịch trình đính kèm và thông báo cho chúng tôi về bất kỳ điều chỉnh đi lại cần thiết nào.",
    "Sau ngoại động từ 'notify' cần đại từ tân ngữ 'us'.",
    [["itinerary", "n.", "lịch trình chuyến đi"], ["notify", "v.", "thông báo"], ["adjustment", "n.", "sự điều chỉnh"]]],
  [105, "Because of severe winter storms, several domestic flights were _______ until early tomorrow morning.",
    mkOpts("postponed", "postpone", "postponing", "postponement"), "A",
    "Do bão tuyết mùa đông nghiêm trọng, một số chuyến bay nội địa đã bị hoãn đến sáng sớm mai.",
    "Cấu trúc bị động 'were + V3/ed' diễn tả các chuyến bay bị hoãn.",
    [["severe", "adj.", "nghiêm trọng, khắc nghiệt"], ["domestic", "adj.", "nội địa"], ["postpone", "v.", "hoãn lại"]]],
  [106, "GreenLeaf Organics plans to _______ its line of herbal teas into twelve European markets next spring.",
    mkOpts("expand", "expanse", "expansion", "expansive"), "A",
    "GreenLeaf Organics dự kiến mở rộng dòng trà thảo mộc sang mười hai thị trường châu Âu vào mùa xuân tới.",
    "Sau 'plans to' cần động từ nguyên thể 'expand'.",
    [["expand", "v.", "mở rộng"], ["herbal", "adj.", "thảo mộc"], ["market", "n.", "thị trường"]]],
  [107, "The architectural firm received high praise for _______ innovative use of recycled timber.",
    mkOpts("its", "it", "they", "their"), "A",
    "Công ty kiến trúc nhận được nhiều lời khen ngợi nhờ việc sử dụng sáng tạo gỗ tái chế.",
    "Chủ ngữ số ít 'The architectural firm' cần tính từ sở hữu số ít 'its' đứng trước cụm danh từ.",
    [["architectural", "adj.", "thuộc kiến trúc"], ["praise", "n.", "lời khen ngợi"], ["timber", "n.", "gỗ xây dựng"]]],
  [108, "_______ the renovation budget was tight, the design team delivered a modern and welcoming lobby.",
    mkOpts("Although", "Because", "Therefore", "However"), "A",
    "Mặc dù ngân sách cải tạo khá eo hẹp, nhóm thiết kế vẫn mang đến một sảnh đón hiện đại và thân thiện.",
    "Hai mệnh đề mang nghĩa tương phản (ngân sách eo hẹp >< kết quả đẹp) nên dùng liên từ 'Although'.",
    [["renovation", "n.", "sự cải tạo, nâng cấp"], ["tight", "adj.", "eo hẹp, chặt chẽ"], ["lobby", "n.", "sảnh chờ"]]],
  [109, "Employees who wish to enroll in the wellness program must submit their forms _______ Friday at noon.",
    mkOpts("by", "until", "since", "within"), "A",
    "Nhân viên muốn đăng ký chương trình chăm sóc sức khỏe phải nộp mẫu đơn trước trưa thứ Sáu.",
    "'by + mốc thời gian' mang nghĩa 'muộn nhất là vào / trước lúc'. 'submit' là hành động dứt điểm nên dùng 'by'.",
    [["enroll", "v.", "đăng ký tham gia"], ["wellness", "n.", "sức khỏe toàn diện"], ["submit", "v.", "nộp, đệ trình"]]],
  [110, "Mr. Takahashi was promoted to senior director in recognition of his _______ leadership.",
    mkOpts("exceptional", "exception", "exceptionally", "exceptions"), "A",
    "Ông Takahashi được thăng chức giám đốc cấp cao để ghi nhận khả năng lãnh đạo xuất sắc của ông.",
    "Cần tính từ đứng trước danh từ 'leadership' để bổ nghĩa.",
    [["promote", "v.", "thăng chức"], ["recognition", "n.", "sự ghi nhận"], ["exceptional", "adj.", "xuất sắc, vượt trội"]]],
  [111, "Any damaged merchandise returned within fourteen days is eligible for a full _______.",
    mkOpts("refund", "refundable", "refunded", "refunding"), "A",
    "Mọi hàng hóa bị hư hỏng được trả lại trong vòng mười bốn ngày đều đủ điều kiện hoàn tiền đầy đủ.",
    "Sau mạo từ 'a' và tính từ 'full' cần danh từ 'refund'.",
    [["merchandise", "n.", "hàng hóa"], ["eligible", "adj.", "đủ điều kiện"], ["refund", "n.", "khoản tiền hoàn lại"]]],
  [112, "The city transit authority will _______ additional shuttle buses during the annual music festival.",
    mkOpts("operate", "operation", "operative", "operator"), "A",
    "Cơ quan giao thông thành phố sẽ vận hành thêm xe buýt trung chuyển trong suốt lễ hội âm nhạc thường niên.",
    "Sau trợ động từ khuyết thiếu 'will' cần động từ nguyên thể 'operate'.",
    [["transit", "n.", "giao thông công cộng"], ["shuttle", "n.", "xe trung chuyển"], ["annual", "adj.", "thường niên"]]],
  [113, "Dr. Patel's keynote speech on renewable energy was both informative _______ inspiring.",
    mkOpts("and", "or", "but", "nor"), "A",
    "Bài phát biểu chính của Tiến sĩ Patel về năng lượng tái tạo vừa giàu thông tin vừa truyền cảm hứng.",
    "Cấu trúc tương quan 'both ... and ...' (vừa ... vừa ...).",
    [["keynote speech", "n.", "bài phát biểu chính"], ["renewable", "adj.", "tái tạo được"], ["inspiring", "adj.", "truyền cảm hứng"]]],
  [114, "Sales representatives are encouraged to follow up with prospective clients _______ after trade shows.",
    mkOpts("promptly", "prompt", "promptness", "prompts"), "A",
    "Đại diện bán hàng được khuyến khích liên hệ lại kịp thời với khách hàng tiềm năng sau các hội chợ thương mại.",
    "Cần trạng từ 'promptly' bổ nghĩa cho cụm động từ 'follow up'.",
    [["prospective", "adj.", "tiềm năng"], ["trade show", "n.", "hội chợ thương mại"], ["promptly", "adv.", "kịp thời, nhanh chóng"]]],
  [115, "_______ of the committee members agreed that the proposed safety policy needed minor revisions.",
    mkOpts("Most", "Almost", "Every", "Each"), "A",
    "Hầu hết các thành viên ủy ban đều đồng ý rằng chính sách an toàn được đề xuất cần chỉnh sửa nhỏ.",
    "'Most of the + danh từ số nhiều' đúng ngữ pháp. 'Almost' không đi trực tiếp với 'of'; 'Every/Each of' đi với động từ số ít.",
    [["committee", "n.", "ủy ban"], ["propose", "v.", "đề xuất"], ["revision", "n.", "sự chỉnh sửa"]]],
  [116, "The hotel's rooftop restaurant offers a _______ view of the harbor and city skyline.",
    mkOpts("spectacular", "spectacle", "spectacularly", "spectator"), "A",
    "Nhà hàng tầng thượng của khách sạn mang đến tầm nhìn ngoạn mục ra bến cảng và đường chân trời thành phố.",
    "Trước danh từ 'view' cần tính từ 'spectacular'.",
    [["rooftop", "n.", "tầng thượng"], ["harbor", "n.", "bến cảng"], ["spectacular", "adj.", "ngoạn mục, ấn tượng"]]],
  [117, "If the shipment _______ before five o'clock, the warehouse crew will unload it right away.",
    mkOpts("arrives", "arrived", "will arrive", "arriving"), "A",
    "Nếu lô hàng đến trước năm giờ, đội ngũ kho sẽ bốc dỡ ngay lập tức.",
    "Câu điều kiện loại 1: mệnh đề If dùng thì hiện tại đơn ('arrives'), mệnh đề chính dùng tương lai đơn ('will unload').",
    [["shipment", "n.", "lô hàng"], ["unload", "v.", "bốc dỡ hàng"], ["right away", "adv.", "ngay lập tức"]]],
  [118, "Ms. Lin worked closely with the legal department to ensure full _______ with privacy regulations.",
    mkOpts("compliance", "comply", "compliant", "complied"), "A",
    "Cô Lin đã phối hợp chặt chẽ với bộ phận pháp chế để đảm bảo tuân thủ đầy đủ các quy định về quyền riêng tư.",
    "Sau tính từ 'full' và trước giới từ 'with' cần danh từ 'compliance'.",
    [["legal", "adj.", "thuộc pháp lý"], ["compliance", "n.", "sự tuân thủ"], ["privacy", "n.", "quyền riêng tư"]]],
  [119, "Passengers holding priority boarding passes may enter the aircraft _______ the general boarding group.",
    mkOpts("ahead of", "because of", "instead of", "in spite of"), "A",
    "Hành khách có thẻ lên máy bay ưu tiên có thể lên máy bay trước nhóm hành khách thông thường.",
    "'ahead of' mang nghĩa 'trước (về thứ tự/thời gian)', phù hợp với quyền ưu tiên lên máy bay.",
    [["priority", "n.", "sự ưu tiên"], ["boarding pass", "n.", "thẻ lên máy bay"], ["aircraft", "n.", "máy bay"]]],
  [120, "The new coffee roaster operates quietly and uses significantly _______ electricity than older models.",
    mkOpts("less", "few", "little", "fewer"), "A",
    "Máy rang cà phê mới vận hành êm ái và tiêu thụ ít điện năng hơn đáng kể so với các mẫu cũ.",
    "'electricity' là danh từ không đếm được nên dùng dạng so sánh hơn 'less' (ít hơn).",
    [["roaster", "n.", "máy rang"], ["significantly", "adv.", "đáng kể"], ["electricity", "n.", "điện năng"]]],
  [121, "Visitors must sign in at the reception desk _______ receiving a temporary security badge.",
    mkOpts("prior to", "except for", "due to", "as well as"), "A",
    "Khách tham quan phải ký tên tại quầy lễ tân trước khi nhận thẻ an ninh tạm thời.",
    "'prior to + V-ing/N' nghĩa là 'trước khi làm gì'.",
    [["reception desk", "n.", "quầy lễ tân"], ["temporary", "adj.", "tạm thời"], ["prior to", "prep.", "trước khi"]]],
  [122, "The marketing campaign generated a _______ increase in online subscriptions during July.",
    mkOpts("substantial", "substance", "substantially", "substantiate"), "A",
    "Chiến dịch tiếp thị đã tạo ra mức tăng đáng kể về số lượt đăng ký trực tuyến trong tháng Bảy.",
    "Cần tính từ 'substantial' đứng giữa mạo từ 'a' và danh từ 'increase'.",
    [["generate", "v.", "tạo ra"], ["subscription", "n.", "lượt đăng ký thuê bao"], ["substantial", "adj.", "đáng kể, lớn"]]],
  [123, "Neither the printer nor the scanners in the annex _______ connected to the wireless network yet.",
    mkOpts("are", "is", "was", "has been"), "A",
    "Cả máy in lẫn các máy quét trong khu nhà phụ đều chưa được kết nối với mạng không dây.",
    "Cấu trúc 'Neither A nor B', động từ chia theo danh từ gần nhất là 'the scanners' (số nhiều) nên dùng 'are'.",
    [["scanner", "n.", "máy quét"], ["annex", "n.", "khu nhà phụ"], ["wireless", "adj.", "không dây"]]],
  [124, "To maintain high product standards, every circuit board is inspected _______ before packaging.",
    mkOpts("thoroughly", "thorough", "thoroughness", "more thorough"), "A",
    "Để duy trì tiêu chuẩn sản phẩm cao, mọi bảng mạch đều được kiểm tra kỹ lưỡng trước khi đóng gói.",
    "Cần trạng từ 'thoroughly' bổ nghĩa cho động từ 'is inspected'.",
    [["circuit board", "n.", "bảng mạch điện tử"], ["inspect", "v.", "kiểm tra kỹ"], ["thoroughly", "adv.", "kỹ lưỡng, triệt để"]]],
  [125, "Candidates applying for the translator role should be _______ in at least two Asian languages.",
    mkOpts("fluent", "fluency", "fluently", "fluencies"), "A",
    "Ứng viên ứng tuyển vị trí biên dịch viên nên thông thạo ít nhất hai ngôn ngữ châu Á.",
    "Sau động từ 'be' cần tính từ 'fluent' (cụm 'be fluent in').",
    [["candidate", "n.", "ứng viên"], ["translator", "n.", "biên dịch viên"], ["fluent", "adj.", "thông thạo, trôi chảy"]]],
  [126, "The warranty covers all manufacturing defects, _______ normal wear and tear is excluded.",
    mkOpts("whereas", "therefore", "moreover", "otherwise"), "A",
    "Chế độ bảo hành bao gồm mọi lỗi sản xuất, trong khi hao mòn tự nhiên được loại trừ.",
    "'whereas' dùng để nối hai vế tương phản ('trong khi đó').",
    [["warranty", "n.", "bảo hành"], ["defect", "n.", "lỗi, khuyết tật"], ["exclude", "v.", "loại trừ"]]],
  [127, "Please keep the emergency exit corridor _______ at all times in case an evacuation is needed.",
    mkOpts("clear", "clearly", "clarity", "clarify"), "A",
    "Vui lòng giữ lối thoát hiểm thông thoáng mọi lúc phòng trường hợp cần sơ tán.",
    "Cấu trúc 'keep + tân ngữ + tính từ' (keep the corridor clear: giữ lối đi thông thoáng).",
    [["corridor", "n.", "hành lang"], ["evacuation", "n.", "sự sơ tán"], ["clear", "adj.", "thông thoáng, không cản trở"]]],
  [128, "After _______ the quarterly financial statements, the auditor met with the chief financial officer.",
    mkOpts("examining", "examine", "examined", "examination"), "A",
    "Sau khi kiểm tra báo cáo tài chính quý, kiểm toán viên đã họp với giám đốc tài chính.",
    "Sau giới từ 'After' khi không có chủ ngữ riêng thì dùng danh động từ V-ing ('examining').",
    [["financial statement", "n.", "báo cáo tài chính"], ["auditor", "n.", "kiểm toán viên"], ["examine", "v.", "kiểm tra, xem xét"]]],
  [129, "Our customer support hotline operates twenty-four hours a day to provide _______ assistance.",
    mkOpts("timely", "time", "timed", "timeliness"), "A",
    "Đường dây nóng hỗ trợ khách hàng hoạt động suốt 24 giờ mỗi ngày để cung cấp hỗ trợ kịp thời.",
    "'timely' là tính từ (đuôi -ly nhưng là tính từ) mang nghĩa 'kịp thời', bổ nghĩa cho danh từ 'assistance'.",
    [["hotline", "n.", "đường dây nóng"], ["assistance", "n.", "sự hỗ trợ"], ["timely", "adj.", "kịp thời, đúng lúc"]]],
  [130, "Not only did the workshop attract local entrepreneurs, _______ it also drew investors from abroad.",
    mkOpts("but", "and", "or", "so"), "A",
    "Hội thảo không chỉ thu hút các doanh nhân địa phương mà còn lôi kéo các nhà đầu tư nước ngoài.",
    "Cấu trúc 'Not only ... but (also) ...' (không những ... mà còn ...).",
    [["entrepreneur", "n.", "doanh nhân khởi nghiệp"], ["investor", "n.", "nhà đầu tư"], ["abroad", "adv.", "ở nước ngoài"]]]
];

const part5 = part5Raw.map(([id, questionText, options, correct, translation, explanation, vocab]) => ({
  id: `reading-test-1-q${id}`,
  questionNumber: id,
  etsYear: '2026',
  etsTestId: 'reading-test-1',
  part: 'Part 5',
  partNumber: 5,
  partName: 'Part 5: Hoàn thành câu (Incomplete Sentences)',
  title: `Test 01 • Câu ${id} (Part 5: Hoàn thành câu)`,
  passageTitle: '',
  passageHtml: '',
  questionText,
  options,
  correct,
  translation,
  explanation,
  vocab: mkVocab(vocab)
}));

// ==================== PART 6 (Q131 - Q146, 16 câu = 4 đoạn) ====================
const part6Groups = [
  {
    passageTitle: 'Questions 131-134 refer to the following notice:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center uppercase">Harborview Medical Clinic — Parking Garage Upgrade</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Starting Monday, April 14, Harborview Medical Clinic will install an automated license-plate recognition system at both entrances of the visitor parking garage. This upgrade is designed to shorten wait times and <strong>[131]</strong> traffic flow during peak morning appointment hours.</p>
      <p class="mt-2">While the new gates are being calibrated, lanes 2 and 3 will be closed temporarily. Drivers are asked to use Lane 1 and follow the directions posted by parking attendants. The installation is expected to take five business days and should be <strong>[132]</strong> by Friday afternoon.</p>
      <p class="mt-2">Patients who have valid monthly passes do not need to replace their cards right away. <strong>[133]</strong>, they should register their license plate numbers at the main reception desk before May 1 so the gate cameras can recognize their vehicles automatically.</p>
      <p class="mt-2"><strong>[134]</strong>. Thank you for your patience as we work to improve our clinic facilities.</p>
    </div>`,
    questions: [
      [131, 'Select the best answer to complete blank [131].',
        mkOpts('improve', 'improves', 'improved', 'improvement'), 'A',
        'Bản nâng cấp này được thiết kế để rút ngắn thời gian chờ và cải thiện lưu thông xe cộ vào giờ cao điểm buổi sáng.',
        'Liên từ "and" nối hai động từ nguyên thể song song sau "to": "to shorten ... and (to) improve".',
        [['traffic flow', 'n.', 'lưu lượng giao thông'], ['upgrade', 'n.', 'sự nâng cấp'], ['peak hours', 'n.', 'giờ cao điểm']]],
      [132, 'Select the best answer to complete blank [132].',
        mkOpts('completed', 'completing', 'complete', 'completion'), 'A',
        'Việc lắp đặt dự kiến kéo dài năm ngày làm việc và sẽ hoàn tất vào chiều thứ Sáu.',
        'Cấu trúc bị động sau "should be": "should be completed" (được hoàn tất).',
        [['calibrate', 'v.', 'hiệu chuẩn'], ['attendant', 'n.', 'nhân viên hướng dẫn'], ['completed', 'adj.', 'được hoàn thành']]],
      [133, 'Select the best answer to complete blank [133].',
        mkOpts('However', 'Therefore', 'For example', 'In addition'), 'A',
        'Tuy nhiên, họ nên đăng ký biển số xe tại quầy lễ tân chính trước ngày 1 tháng 5 để camera cổng tự động nhận diện.',
        'Câu trước nói không cần đổi thẻ ngay, câu sau nói vẫn cần đăng ký biển số xe -> mang nghĩa tương phản nhẹ nên dùng "However".',
        [['valid', 'adj.', 'còn hiệu lực'], ['license plate', 'n.', 'biển số xe'], ['recognize', 'v.', 'nhận diện']]],
      [134, 'Select the best sentence to complete blank [134].',
        mkOpts(
          'Complimentary valet parking will be offered at the west entrance throughout the week.',
          'The clinic pharmacy has recently extended its weekend operating hours.',
          'All new medical staff completed their orientation sessions last month.',
          'Parking fees for commercial delivery vans will increase next January.'
        ), 'A',
        'Dịch vụ đỗ xe miễn phí có người hỗ trợ sẽ được cung cấp tại cổng tây trong suốt tuần này.',
        'Đoạn văn đang nói về việc sửa chữa/nâng cấp bãi đỗ xe gây đóng làn, nên câu chèn hợp lý nhất là phương án đỗ xe thay thế miễn phí trong tuần đó.',
        [['complimentary', 'adj.', 'miễn phí'], ['valet parking', 'n.', 'dịch vụ đỗ xe hộ'], ['patience', 'n.', 'sự kiên nhẫn']]]
    ]
  },
  {
    passageTitle: 'Questions 135-138 refer to the following e-mail:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>To:</strong> All Marketing &amp; Design Staff<br><strong>From:</strong> Hannah Cho, Creative Director<br><strong>Date:</strong> August 19<br><strong>Subject:</strong> Autumn Catalog Print Deadline</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Dear Team,</p>
      <p class="mt-2">Our print vendor has just confirmed that the final digital proofs for the autumn home-decor catalog must be uploaded by 4:00 p.m. this Thursday. Meeting this cutoff is essential so the printed copies can reach retail stores on <strong>[135]</strong>.</p>
      <p class="mt-2">Yesterday, the photography crew finished retouching the dining-room images, which <strong>[136]</strong> in the opening section. Copywriters should double-check all product dimensions and prices listed beneath those photos before noon tomorrow.</p>
      <p class="mt-2"><strong>[137]</strong>. Please label any updated layout files clearly with the version number and save them in the shared cloud folder.</p>
      <p class="mt-2">Let me know right away if you encounter any technical <strong>[138]</strong> while exporting high-resolution files.</p>
      <p class="mt-2">Best,<br>Hannah</p>
    </div>`,
    questions: [
      [135, 'Select the best answer to complete blank [135].',
        mkOpts('schedule', 'budget', 'order', 'display'), 'A',
        'Đáp ứng mốc thời gian này là điều thiết yếu để các bản in có thể đến các cửa hàng bán lẻ đúng lịch.',
        'Cụm cố định "on schedule" nghĩa là đúng tiến độ, đúng lịch trình.',
        [['cutoff', 'n.', 'thời hạn chót'], ['retail store', 'n.', 'cửa hàng bán lẻ'], ['on schedule', 'phr.', 'đúng lịch trình']]],
      [136, 'Select the best answer to complete blank [136].',
        mkOpts('will appear', 'appeared', 'appearing', 'has appeared'), 'A',
        'Hôm qua, đội ngũ nhiếp ảnh đã chỉnh sửa xong các bức ảnh phòng ăn, những ảnh sẽ xuất hiện ở phần mở đầu.',
        'Catalog mùa thu sắp được in ấn nên ảnh sẽ xuất hiện trong phần mở đầu ("will appear").',
        [['retouch', 'v.', 'chỉnh sửa ảnh'], ['opening section', 'n.', 'phần mở đầu'], ['proof', 'n.', 'bản in thử']]],
      [137, 'Select the best sentence to complete blank [137].',
        mkOpts(
          'Doing so will prevent outdated drafts from accidentally being sent to the press.',
          'Our autumn collection features handcrafted ceramic bowls from three workshops.',
          'The annual photography contest will open for submissions next Monday.',
          'Several retail branches reported higher foot traffic over the holiday weekend.'
        ), 'A',
        'Làm như vậy sẽ ngăn các bản nháp cũ vô tình bị gửi đi nhà in.',
        'Câu trước yêu cầu kiểm tra kỹ thông số và giá; câu sau dặn đặt tên file kèm số phiên bản -> "Doing so will prevent outdated drafts..." nối mạch hoàn hảo.',
        [['outdated', 'adj.', 'lỗi thời, cũ'], ['draft', 'n.', 'bản nháp'], ['accidentally', 'adv.', 'vô tình']]],
      [138, 'Select the best answer to complete blank [138].',
        mkOpts('difficulties', 'difficult', 'difficulty', 'difficultly'), 'A',
        'Hãy báo ngay cho tôi biết nếu bạn gặp bất kỳ khó khăn kỹ thuật nào khi xuất file độ phân giải cao.',
        'Sau "any technical" có thể dùng danh từ đếm được số nhiều "difficulties" (các trục trặc/khó khăn kỹ thuật).',
        [['encounter', 'v.', 'gặp phải'], ['high-resolution', 'adj.', 'độ phân giải cao'], ['export', 'v.', 'xuất tệp']]]
    ]
  },
  {
    passageTitle: 'Questions 139-142 refer to the following advertisement:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center text-base">Work Smarter at CedarWorks Co-Working Hub</p>
      <p class="mt-2">Looking for a quiet, flexible workspace in downtown Portland? CedarWorks offers private suites, dedicated desks, and sunlit lounge areas tailored for freelancers and growing startups. Every membership includes high-speed fiber Internet, unlimited specialty coffee, and <strong>[139]</strong> to four soundproof meeting rooms.</p>
      <p class="mt-2">Unlike traditional office leases that lock you into multiyear contracts, our plans renew on a convenient month-to-month basis. You can scale your space up or down as your team <strong>[140]</strong>.</p>
      <p class="mt-2"><strong>[141]</strong>. Members who sign up before September 30 will receive 50 percent off their first two months of membership.</p>
      <p class="mt-2">Visit cedarworkshub.com today to schedule a complimentary tour and experience our vibrant community <strong>[142]</strong>.</p>
    </div>`,
    questions: [
      [139, 'Select the best answer to complete blank [139].',
        mkOpts('access', 'accessible', 'accessing', 'accessed'), 'A',
        'Mỗi gói thành viên bao gồm Internet cáp quang tốc độ cao, cà phê pha máy không giới hạn và quyền sử dụng bốn phòng họp cách âm.',
        'Động từ "includes" cần các danh từ song song: "Internet, coffee, and access to...".',
        [['co-working', 'n.', 'không gian làm việc chung'], ['soundproof', 'adj.', 'cách âm'], ['access', 'n.', 'quyền truy cập/sử dụng']]],
      [140, 'Select the best answer to complete blank [140].',
        mkOpts('changes', 'change', 'changing', 'to change'), 'A',
        'Bạn có thể mở rộng hoặc thu hẹp không gian làm việc khi quy mô nhóm của bạn thay đổi.',
        'Chủ ngữ "your team" là danh từ tập hợp số ít, câu ở thì hiện tại đơn nên động từ chia "changes".',
        [['lease', 'n.', 'hợp đồng thuê'], ['month-to-month', 'adj.', 'gia hạn từng tháng'], ['scale', 'v.', 'mở rộng/thu hẹp quy mô']]],
      [141, 'Select the best sentence to complete blank [141].',
        mkOpts(
          'In addition, we are currently offering a special autumn promotion for new members.',
          'Our cafe serves freshly baked pastries until three o’clock every afternoon.',
          'Parking permits can be purchased at the municipal garage across the street.',
          'Soundproofing panels were installed in all conference rooms last spring.'
        ), 'A',
        'Ngoài ra, chúng tôi hiện đang triển khai chương trình ưu đãi mùa thu đặc biệt dành cho thành viên mới.',
        'Câu ngay sau đó nêu chi tiết ưu đãi giảm 50% cho người đăng ký trước 30/9 -> câu giới thiệu chương trình ưu đãi là hợp lý nhất.',
        [['promotion', 'n.', 'chương trình khuyến mãi'], ['sign up', 'v.', 'đăng ký'], ['vibrant', 'adj.', 'sôi nổi, năng động']]],
      [142, 'Select the best answer to complete blank [142].',
        mkOpts('firsthand', 'firstly', 'former', 'frequent'), 'A',
        'Truy cập cedarworkshub.com hôm nay để đặt lịch tham quan miễn phí và trực tiếp trải nghiệm cộng đồng năng động của chúng tôi.',
        'Trạng từ "firsthand" mang nghĩa "trực tiếp, tận mắt trải nghiệm" ("experience ... firsthand").',
        [['complimentary', 'adj.', 'miễn phí'], ['firsthand', 'adv.', 'trực tiếp, tận mắt'], ['freelancer', 'n.', 'người làm tự do']]]
    ]
  },
  {
    passageTitle: 'Questions 143-146 refer to the following letter:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p>October 8</p>
      <p class="mt-2">Dear Ms. Kowalski,</p>
      <p class="mt-2">Thank you for submitting your application for the Senior Supply Chain Analyst position at Veridian Foods. After carefully reviewing your qualifications and previous experience in cold-storage logistics, we would like to invite you for an interview at our headquarters.</p>
      <p class="mt-2">The interview panel will consist of two department directors and our human resources lead. They look forward to <strong>[143]</strong> your ideas on reducing warehouse spoilage and optimizing regional distribution routes.</p>
      <p class="mt-2">Please let us know which of the following slots works best for you: Tuesday, October 15, at 10:00 a.m., or Thursday, October 17, at 2:30 p.m. <strong>[144]</strong>. Once you confirm a time, we will e-mail you a visitor pass along with detailed parking instructions.</p>
      <p class="mt-2">Should you need to reschedule or request a virtual video interview <strong>[145]</strong>, please reply to this message at least twenty-four hours in advance. We truly appreciate your <strong>[146]</strong> in joining Veridian Foods.</p>
      <p class="mt-2">Sincerely,<br>Marcus Bennett<br>Talent Acquisition Specialist</p>
    </div>`,
    questions: [
      [143, 'Select the best answer to complete blank [143].',
        mkOpts('hearing', 'hear', 'heard', 'to hear'), 'A',
        'Họ rất mong được lắng nghe những ý tưởng của bạn về việc giảm thất thoát kho lạnh và tối ưu tuyến phân phối.',
        'Cấu trúc "look forward to + V-ing" (mong chờ làm gì) nên chọn "hearing".',
        [['qualification', 'n.', 'bằng cấp, năng lực'], ['spoilage', 'n.', 'sự hư hỏng hàng hóa'], ['optimize', 'v.', 'tối ưu hóa']]],
      [144, 'Select the best sentence to complete blank [144].',
        mkOpts(
          'Plan to allow approximately sixty minutes for the conversation and a brief facility tour.',
          'Our manufacturing plant recently earned an international food-safety certification.',
          'Salary ranges for all full-time positions are reviewed annually in December.',
          'Applications for the summer internship program will close next Friday.'
        ), 'A',
        'Vui lòng sắp xếp khoảng sáu mươi phút cho buổi trao đổi và một lượt tham quan ngắn cơ sở.',
        'Đoạn đang bàn về lịch hẹn phỏng vấn (hai khung giờ lựa chọn, vé khách, hướng dẫn gửi xe) -> thông báo thời lượng buổi phỏng vấn là khớp nhất.',
        [['approximately', 'adv.', 'xấp xỉ, khoảng'], ['panel', 'n.', 'hội đồng (phỏng vấn)'], ['confirm', 'v.', 'xác nhận']]],
      [145, 'Select the best answer to complete blank [145].',
        mkOpts('instead', 'though', 'already', 'besides'), 'A',
        'Nếu bạn cần đổi lịch hoặc đề nghị phỏng vấn trực tuyến qua video để thay thế, vui lòng phản hồi trước ít nhất 24 giờ.',
        '"instead" đứng cuối mệnh đề mang nghĩa "thay vào đó" (phỏng vấn online thay cho đến trực tiếp).',
        [['reschedule', 'v.', 'sắp xếp lại lịch'], ['virtual', 'adj.', 'trực tuyến, ảo'], ['in advance', 'phr.', 'trước']]],
      [146, 'Select the best answer to complete blank [146].',
        mkOpts('interest', 'interesting', 'interested', 'interestedly'), 'A',
        'Chúng tôi thực sự trân trọng sự quan tâm của bạn đối với việc gia nhập Veridian Foods.',
        'Sau tính từ sở hữu "your" cần danh từ "interest" ("your interest in...").',
        [['talent acquisition', 'n.', 'tuyển dụng nhân tài'], ['appreciate', 'v.', 'trân trọng, đánh giá cao'], ['interest', 'n.', 'sự quan tâm']]]
    ]
  }
];

const part6 = [];
part6Groups.forEach((grp, gIdx) => {
  const baseQ = 131 + gIdx * 4;
  grp.questions.forEach(([id, questionText, options, correct, translation, explanation, vocab]) => {
    part6.push({
      id: `reading-test-1-q${id}`,
      questionNumber: id,
      etsYear: '2026',
      etsTestId: 'reading-test-1',
      part: 'Part 6',
      partNumber: 6,
      partName: 'Part 6: Hoàn thành đoạn văn (Text Completion)',
      title: `Test 01 • Câu ${id} (Part 6: Hoàn thành đoạn văn)`,
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

// ==================== PART 7 (Q147 - Q200, 54 câu) ====================
// 10 single passages (Q147-175: 29 câu) + 2 double passages (Q176-185: 10 câu) + 3 triple passages (Q186-200: 15 câu)
const part7Passages = [
  // Single 1: Q147-148 (2 câu)
  {
    passageTitle: 'Questions 147-148 refer to the following notice:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">WESTSIDE PUBLIC LIBRARY — DIGITAL ARCHIVE WORKSHOP</p>
      <hr class="my-2 border-neutral-300">
      <p>Learn how to preserve family photographs, letters, and audio tapes using the library's newly acquired scanning stations. This free hands-on session takes place on Saturday, November 8, from 10:00 a.m. to 12:00 p.m. in Media Lab 2.</p>
      <p class="mt-2">Because seats are limited to fifteen participants, advance registration is required. Please reserve your spot at the reference desk or call 555-0148 by Thursday, November 6. Participants are encouraged to bring up to five printed photos to practice digitizing.</p>
    </div>`,
    questions: [
      [147, 'Why did Westside Public Library post this notice?',
        mkOpts('To announce a free training workshop', 'To advertise used scanning equipment for sale', 'To recruit part-time library assistants', 'To inform patrons of holiday closing hours'), 'A',
        'Tại sao Thư viện Công cộng Westside đăng thông báo này? — Để thông báo một buổi tập huấn thực hành miễn phí về số hóa tài liệu.',
        'Thông báo mời mọi người tham gia buổi hướng dẫn miễn phí ("free hands-on session") cách lưu trữ ảnh, thư và băng ghi âm.',
        [['archive', 'n.', 'kho lưu trữ'], ['hands-on', 'adj.', 'thực hành trực tiếp'], ['digitize', 'v.', 'số hóa']]],
      [148, 'What are attendees asked to do before November 6?',
        mkOpts('Sign up for a seat in advance', 'Pay a small materials fee', 'Install photo-editing software at home', 'Mail their audio tapes to Media Lab 2'), 'A',
        'Người tham dự được yêu cầu làm gì trước ngày 6 tháng 11? — Đăng ký giữ chỗ trước.',
        'Thông báo nêu rõ: "advance registration is required. Please reserve your spot... by Thursday, November 6."',
        [['participant', 'n.', 'người tham gia'], ['reserve', 'v.', 'đặt chỗ trước'], ['reference desk', 'n.', 'quầy tra cứu']]]
    ]
  },
  // Single 2: Q149-150 (2 câu)
  {
    passageTitle: 'Questions 149-150 refer to the following text message chain:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>Nadia (9:12 A.M.):</strong> Hi Carlos, did the florist confirm the delivery time for the awards banquet centerpieces?</p>
      <p class="mt-2"><strong>Carlos (9:15 A.M.):</strong> Yes, they'll arrive at the Grand Ballroom at 2:30 P.M. instead of 1:00 P.M. because of road construction on Oak Avenue.</p>
      <p class="mt-2"><strong>Nadia (9:17 A.M.):</strong> Got it. That still gives us plenty of time before guests check in at 5:30. Could you ask the catering supervisor to hold off on setting the table linens until the flowers are placed?</p>
      <p class="mt-2"><strong>Carlos (9:19 A.M.):</strong> I'll walk down to the kitchen right now and let him know.</p>
    </div>`,
    questions: [
      [149, 'Why will the flowers arrive later than originally planned?',
        mkOpts('There is construction work on a nearby street.', 'The florist had trouble locating the ballroom.', 'The catering team requested a later time.', 'Nadia changed the guest check-in schedule.'), 'A',
        'Vì sao hoa sẽ đến muộn hơn dự kiến? — Vì có công trình thi công trên một tuyến đường gần đó.',
        'Carlos giải thích hoa đến lúc 2:30 thay vì 1:00 "because of road construction on Oak Avenue".',
        [['centerpiece', 'n.', 'hoa trang trí giữa bàn'], ['banquet', 'n.', 'tiệc lớn'], ['catering', 'n.', 'dịch vụ ăn uống']]],
      [150, 'What will Carlos probably do next?',
        mkOpts('Speak with the catering supervisor in person', 'Call the florist to cancel the order', 'Meet Nadia at the guest check-in table', 'Drive to Oak Avenue to pick up the linens'), 'A',
        'Carlos có khả năng sẽ làm gì tiếp theo? — Nói chuyện trực tiếp với giám sát bộ phận tiệc.',
        'Tin nhắn cuối Carlos viết: "I\'ll walk down to the kitchen right now and let him know."',
        [['hold off', 'v.', 'tạm hoãn lại'], ['table linen', 'n.', 'khăn trải bàn'], ['supervisor', 'n.', 'người giám sát']]]
    ]
  },
  // Single 3: Q151-153 (3 câu)
  {
    passageTitle: 'Questions 151-153 refer to the following e-mail:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>To:</strong> customerservice@brightstepfootwear.com<br><strong>From:</strong> d.okafor@mailservice.net<br><strong>Date:</strong> May 12<br><strong>Subject:</strong> Order #BS-9042 Exchange Request</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Hello,</p>
      <p class="mt-2">I received my pair of TrailRunner hiking boots (Order #BS-9042) yesterday. While the quality and color match what I saw online, the size 9 feels too narrow across the toes. I would like to exchange this pair for a size 9.5 wide, provided it is currently in stock.</p>
      <p class="mt-2">I still have the original shoebox, tags, and packing slip, and the boots have only been worn indoors on carpet for a few minutes. Could you please send me a prepaid return shipping label so I can mail them back this week?</p>
      <p class="mt-2">Thank you,<br>David Okafor</p>
    </div>`,
    questions: [
      [151, 'Why is Mr. Okafor writing to BrightStep Footwear?',
        mkOpts('To exchange a pair of boots for a different size', 'To complain about a delay in shipping', 'To report a defect in the boot color', 'To ask for a full cash refund'), 'A',
        'Tại sao ông Okafor viết thư cho BrightStep Footwear? — Để đổi một đôi giày lấy cỡ khác.',
        'Ông viết: "the size 9 feels too narrow... I would like to exchange this pair for a size 9.5 wide".',
        [['exchange', 'v.', 'đổi trả hàng'], ['narrow', 'adj.', 'chật, hẹp'], ['in stock', 'phr.', 'còn hàng']]],
      [152, 'What does Mr. Okafor mention about the boots?',
        mkOpts('They have not been worn outside.', 'They arrived without a packing slip.', 'They were purchased at a retail outlet.', 'They are a different color from the website photo.'), 'A',
        'Ông Okafor nhắc đến điều gì về đôi giày? — Chúng chưa hề được mang ra ngoài trời.',
        'Ông nêu rõ: "the boots have only been worn indoors on carpet for a few minutes" (chỉ đi thử trong nhà trên thảm).',
        [['packing slip', 'n.', 'phiếu đóng gói'], ['indoors', 'adv.', 'trong nhà'], ['original', 'adj.', 'ban đầu, nguyên vẹn']]],
      [153, 'What does Mr. Okafor ask customer service to provide?',
        mkOpts('A prepaid return shipping label', 'A discount code for a future order', 'A phone call from a store manager', 'An updated product catalog'), 'A',
        'Ông Okafor nhờ bộ phận chăm sóc khách hàng cung cấp gì? — Nhãn gửi trả hàng đã trả cước trước.',
        'Câu cuối đoạn 2: "Could you please send me a prepaid return shipping label..."',
        [['prepaid', 'adj.', 'đã trả trước'], ['return label', 'n.', 'nhãn hoàn trả hàng'], ['toe', 'n.', 'mũi chân, ngón chân']]]
    ]
  },
  // Single 4: Q154-156 (3 câu)
  {
    passageTitle: 'Questions 154-156 refer to the following memo:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p><strong>MEMORANDUM</strong></p>
      <p><strong>To:</strong> All Corporate Travel Coordinators<br><strong>From:</strong> Finance &amp; Compliance Division<br><strong>Date:</strong> February 4<br><strong>Subject:</strong> Updated Meal Reimbursement Policy</p>
      <hr class="my-2 border-neutral-300">
      <p class="mt-2">Effective March 1, the daily meal allowance for employees traveling on domestic business trips will increase from $55 to $70. For international assignments, the daily cap will rise from $85 to $105 to reflect higher dining costs in major cities.</p>
      <p class="mt-2">Please remind travelers that itemized receipts must be uploaded to the Expensify portal within ten business days after returning. Credit card summary statements alone will no longer be accepted. Additionally, expenses for alcoholic beverages remain non-reimbursable under company policy.</p>
    </div>`,
    questions: [
      [154, 'What change will take effect on March 1?',
        mkOpts('Daily meal allowances for business travel will increase.', 'Employees will receive company credit cards for hotels.', 'International trips will require vice-president approval.', 'All expense reports will be submitted in paper form.'), 'A',
        'Thay đổi nào sẽ có hiệu lực vào ngày 1 tháng 3? — Hạn mức tiền ăn hằng ngày khi đi công tác sẽ tăng lên.',
        'Thông báo nêu mức chi cho bữa ăn nội địa tăng từ $55 lên $70, quốc tế tăng từ $85 lên $105.',
        [['reimbursement', 'n.', 'sự hoàn trả chi phí'], ['allowance', 'n.', 'tiền trợ cấp/hạn mức'], ['effective', 'adj.', 'có hiệu lực']]],
      [155, 'What is required when submitting meal expenses?',
        mkOpts('Detailed itemized receipts', 'Monthly credit card summaries', 'Signed letters from clients', 'Boarding passes from flights'), 'A',
        'Điều gì là bắt buộc khi nộp chi phí ăn uống? — Hóa đơn liệt kê chi tiết từng món.',
        'Đoạn 2: "itemized receipts must be uploaded... Credit card summary statements alone will no longer be accepted."',
        [['itemized receipt', 'n.', 'hóa đơn liệt kê chi tiết'], ['portal', 'n.', 'cổng thông tin'], ['non-reimbursable', 'adj.', 'không được hoàn tiền']]],
      [156, 'Which item is NOT covered by the policy?',
        mkOpts('Alcoholic drinks', 'Breakfast at an airport cafe', 'Dinner during international trips', 'Tips included on restaurant bills'), 'A',
        'Khoản nào KHÔNG được chính sách này chi trả? — Đồ uống có cồn.',
        'Câu cuối: "expenses for alcoholic beverages remain non-reimbursable under company policy."',
        [['beverage', 'n.', 'đồ uống'], ['cap', 'n.', 'mức trần, giới hạn tối đa'], ['reflect', 'v.', 'phản ánh']]]
    ]
  },
  // Single 5: Q157-159 (3 câu)
  {
    passageTitle: 'Questions 157-159 refer to the following article:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-base">Local Bakery Solves Packaging Waste with Edible Cups</p>
      <p class="mt-2">PORTLAND — SunRise Espresso &amp; Bakery has eliminated more than 40,000 disposable paper cups over the past six months by introducing wafer cups made from baked oat flour. The crunchy cups hold hot coffee or tea for up to forty minutes without leaking, after which customers can eat the cup as a light snack.</p>
      <p class="mt-2">Owner Mei-Ling Zhou said she tested twelve grain recipes before finding one sturdy enough for espresso drinks. Although the oat cups cost slightly more than standard paper sleeves, Zhou notes that her shop's trash-hauling fees have dropped by 35 percent—and foot traffic from eco-conscious shoppers has grown steadily.</p>
    </div>`,
    questions: [
      [157, 'What innovation did SunRise Espresso & Bakery introduce?',
        mkOpts('Coffee cups made from baked oat flour that can be eaten', 'Discounted refills for customers who bring glass jars', 'Compostable plastic lids shipped from Europe', 'Solar-powered espresso machines in its kitchen'), 'A',
        'Tiệm bánh SunRise Espresso & Bakery đã giới thiệu sáng kiến gì? — Cốc cà phê làm từ bột yến mạch nướng có thể ăn được.',
        'Bài báo mô tả tiệm thay cốc giấy bằng "wafer cups made from baked oat flour" và khách có thể ăn cốc sau khi uống.',
        [['disposable', 'adj.', 'dùng một lần'], ['edible', 'adj.', 'ăn được'], ['oat flour', 'n.', 'bột yến mạch']]],
      [158, 'What benefit did Mei-Ling Zhou observe after switching to the new cups?',
        mkOpts('Lower garbage collection expenses', 'Faster espresso brewing speeds', 'Fewer staff needed on morning shifts', 'Lower wholesale coffee bean prices'), 'A',
        'Bà Mei-Ling Zhou nhận thấy lợi ích gì sau khi đổi sang loại cốc mới? — Chi phí thu gom rác giảm.',
        'Đoạn 2 nêu: "her shop\'s trash-hauling fees have dropped by 35 percent".',
        [['trash-hauling fee', 'n.', 'phí thu gom rác'], ['eco-conscious', 'adj.', 'có ý thức bảo vệ môi trường'], ['sturdy', 'adj.', 'chắc chắn, bền']]],
      [159, 'How long can the wafer cups hold hot beverages without leaking?',
        mkOpts('Up to 40 minutes', 'Up to 12 minutes', 'About 35 minutes', 'Nearly 6 hours'), 'A',
        'Cốc bánh quế giữ đồ uống nóng không bị rò rỉ trong bao lâu? — Tối đa 40 phút.',
        'Đoạn 1: "The crunchy cups hold hot coffee or tea for up to forty minutes without leaking".',
        [['leak', 'v.', 'rò rỉ'], ['crunchy', 'adj.', 'giòn'], ['eliminate', 'v.', 'loại bỏ']]]
    ]
  },
  // Single 6: Q160-163 (4 câu)
  {
    passageTitle: 'Questions 160-163 refer to the following product information:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-base">AeroPure H400 Air Purifier — Quick Setup Guide</p>
      <p class="mt-2">Thank you for choosing the AeroPure H400 for rooms up to 450 square feet. Before turning on the unit for the first time, remove the back grille and take off the protective plastic bag wrapped around the HEPA filter.</p>
      <p class="mt-2"><strong>Indicator Lights:</strong></p>
      <ul class="list-disc pl-5 mt-1 space-y-1">
        <li><strong>Blue:</strong> Excellent air quality (fan operates at low speed in Auto Mode).</li>
        <li><strong>Amber:</strong> Moderate dust or odor detected (fan switches to medium speed).</li>
        <li><strong>Flashing Red:</strong> Filter life below 10%; replacement recommended within two weeks.</li>
      </ul>
      <p class="mt-2">For optimal performance, place the purifier at least 12 inches away from walls and curtains. Replacement filters (Model AP-F40) can be ordered at aeropurehome.com.</p>
    </div>`,
    questions: [
      [160, 'What must users do before operating the AeroPure H400 for the first time?',
        mkOpts('Remove the plastic wrapping from the filter', 'Wash the back grille with warm soapy water', 'Download the mobile app to activate Auto Mode', 'Connect the exhaust hose to an open window'), 'A',
        'Người dùng phải làm gì trước khi bật AeroPure H400 lần đầu? — Tháo túi nhựa bọc quanh bộ lọc.',
        'Đoạn 1: "remove the back grille and take off the protective plastic bag wrapped around the HEPA filter."',
        [['air purifier', 'n.', 'máy lọc không khí'], ['grille', 'n.', 'lưới tản gió/nắp sau'], ['filter', 'n.', 'bộ lọc']]],
      [161, 'What does a flashing red indicator light signal?',
        mkOpts('The filter will need to be replaced soon.', 'The air quality in the room is excellent.', 'The unit is placed too close to a curtain.', 'The fan has switched to high turbo speed.'), 'A',
        'Đèn báo màu đỏ nhấp nháy báo hiệu điều gì? — Bộ lọc sắp cần phải thay thế.',
        'Mục Indicator Lights: "Flashing Red: Filter life below 10%; replacement recommended within two weeks."',
        [['indicator light', 'n.', 'đèn báo'], ['moderate', 'adj.', 'trung bình, vừa phải'], ['replacement', 'n.', 'sự thay thế']]],
      [162, 'How far from walls should the purifier be positioned?',
        mkOpts('At least 12 inches', 'No more than 10 inches', 'Exactly 40 inches', 'Around 450 inches'), 'A',
        'Nên đặt máy lọc cách tường bao xa? — Ít nhất 12 inch.',
        'Đoạn cuối: "place the purifier at least 12 inches away from walls and curtains."',
        [['optimal', 'adj.', 'tối ưu'], ['position', 'v.', 'đặt vị trí'], ['odor', 'n.', 'mùi hôi']]],
      [163, 'Where can customers buy spare AP-F40 filters?',
        mkOpts('On the manufacturer’s website', 'Only through authorized repair technicians', 'At any local hardware store', 'Inside the original packaging box'), 'A',
        'Khách hàng có thể mua bộ lọc thay thế AP-F40 ở đâu? — Trên trang web của nhà sản xuất.',
        'Câu cuối: "Replacement filters (Model AP-F40) can be ordered at aeropurehome.com."',
        [['spare', 'adj.', 'dự phòng, thay thế'], ['manufacturer', 'n.', 'nhà sản xuất'], ['detect', 'v.', 'phát hiện']]]
    ]
  },
  // Single 7: Q164-166 (3 câu)
  {
    passageTitle: 'Questions 164-166 refer to the following schedule:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-center">ANNUAL RETAIL INNOVATION SUMMIT — FRIDAY, JUNE 20</p>
      <table class="w-full mt-2 border-collapse border border-neutral-300 text-xs sm:text-sm">
        <thead><tr class="bg-neutral-100"><th class="border border-neutral-300 p-2 text-left">Time</th><th class="border border-neutral-300 p-2 text-left">Session</th><th class="border border-neutral-300 p-2 text-left">Room</th></tr></thead>
        <tbody>
          <tr><td class="border border-neutral-300 p-2">8:30 – 9:15 A.M.</td><td class="border border-neutral-300 p-2">Registration &amp; Continental Breakfast</td><td class="border border-neutral-300 p-2">Atrium</td></tr>
          <tr><td class="border border-neutral-300 p-2">9:30 – 10:45 A.M.</td><td class="border border-neutral-300 p-2">Keynote: AI in Inventory Forecasting (Elena Rostova)</td><td class="border border-neutral-300 p-2">Main Hall</td></tr>
          <tr><td class="border border-neutral-300 p-2">11:00 – 12:15 P.M.</td><td class="border border-neutral-300 p-2">Panel: Omnichannel Customer Loyalty</td><td class="border border-neutral-300 p-2">Oak Room</td></tr>
          <tr><td class="border border-neutral-300 p-2">12:15 – 1:30 P.M.</td><td class="border border-neutral-300 p-2">Networking Luncheon</td><td class="border border-neutral-300 p-2">Garden Terrace</td></tr>
          <tr><td class="border border-neutral-300 p-2">1:45 – 3:00 P.M.</td><td class="border border-neutral-300 p-2">Workshop: Sustainable Last-Mile Delivery</td><td class="border border-neutral-300 p-2">Cedar Room</td></tr>
        </tbody>
      </table>
    </div>`,
    questions: [
      [164, 'Where will the morning keynote speech be held?',
        mkOpts('In the Main Hall', 'In the Atrium', 'In the Oak Room', 'In the Cedar Room'), 'A',
        'Bài phát biểu chính buổi sáng sẽ được tổ chức ở đâu? — Tại Main Hall.',
        'Bảng lịch trình ghi: "9:30 – 10:45 A.M. | Keynote: AI in Inventory Forecasting | Main Hall".',
        [['summit', 'n.', 'hội nghị thượng đỉnh'], ['forecasting', 'n.', 'dự báo'], ['inventory', 'n.', 'hàng tồn kho']]],
      [165, 'Which topic will be discussed right before lunch?',
        mkOpts('Customer loyalty across multiple sales channels', 'Reducing carbon emissions in final delivery', 'Using artificial intelligence to manage stock', 'Recruiting seasonal retail store associates'), 'A',
        'Chủ đề nào được thảo luận ngay trước bữa trưa? — Lòng trung thành của khách hàng trên nhiều kênh bán hàng.',
        'Ngay trước bữa trưa (12:15 – 1:30 P.M.) là phiên 11:00 – 12:15 P.M.: "Panel: Omnichannel Customer Loyalty".',
        [['omnichannel', 'adj.', 'đa kênh'], ['loyalty', 'n.', 'lòng trung thành'], ['luncheon', 'n.', 'tiệc trưa']]],
      [166, 'Who will speak at 9:30 A.M.?',
        mkOpts('Elena Rostova', 'A panel of store owners', 'A sustainable delivery team', 'The conference organizer'), 'A',
        'Ai sẽ phát biểu lúc 9:30 sáng? — Elena Rostova.',
        'Phiên 9:30 – 10:45 A.M. ghi tên diễn giả "(Elena Rostova)".',
        [['sustainable', 'adj.', 'bền vững'], ['terrace', 'n.', 'sân hiên'], ['atrium', 'n.', 'sảnh lớn']]]
    ]
  },
  // Single 8: Q167-169 (3 câu)
  {
    passageTitle: 'Questions 167-169 refer to the following announcement:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">Notice to All Horizon Tower Tenants</p>
      <p class="mt-2">Our building management team will conduct an annual inspection of the emergency backup generators this Sunday, March 23, between 7:00 A.M. and 9:00 A.M. During this two-hour window, elevator service in the West Wing will be paused for approximately fifteen minutes while technicians switch power sources.</p>
      <p class="mt-2">Lighting in hallways and stairwells will remain fully operational throughout the test. Tenants who plan to work in their offices on Sunday morning should save computer files frequently and avoid riding West Wing elevators between 7:30 A.M. and 8:00 A.M.</p>
    </div>`,
    questions: [
      [167, 'What is the purpose of the announcement?',
        mkOpts('To inform tenants about scheduled generator testing', 'To warn residents about an unexpected power outage', 'To announce new security keycards for the West Wing', 'To recruit technicians for building maintenance'), 'A',
        'Mục đích của thông báo là gì? — Thông báo cho khách thuê về lịch kiểm tra máy phát điện dự phòng.',
        'Đoạn 1: "conduct an annual inspection of the emergency backup generators this Sunday, March 23".',
        [['tenant', 'n.', 'khách thuê văn phòng/nhà'], ['generator', 'n.', 'máy phát điện'], ['operational', 'adj.', 'đang hoạt động']]],
      [168, 'How long will West Wing elevator service be interrupted?',
        mkOpts('About 15 minutes', 'Two full hours', 'Nearly 30 minutes', 'All Sunday morning'), 'A',
        'Dịch vụ thang máy khu Tây sẽ bị gián đoạn trong bao lâu? — Khoảng 15 phút.',
        'Thông báo ghi: "elevator service in the West Wing will be paused for approximately fifteen minutes".',
        [['interrupt', 'v.', 'làm gián đoạn'], ['stairwell', 'n.', 'buồng thang bộ'], ['power source', 'n.', 'nguồn điện']]],
      [169, 'What are tenants advised to avoid between 7:30 A.M. and 8:00 A.M.?',
        mkOpts('Using the West Wing elevators', 'Entering the building stairwells', 'Turning on hallway lighting', 'Printing large office documents'), 'A',
        'Khách thuê được khuyên tránh làm gì trong khoảng 7:30 đến 8:00 sáng? — Tránh đi thang máy khu Tây.',
        'Câu cuối: "avoid riding West Wing elevators between 7:30 A.M. and 8:00 A.M."',
        [['backup', 'adj.', 'dự phòng'], ['conduct', 'v.', 'tiến hành'], ['frequently', 'adv.', 'thường xuyên']]]
    ]
  },
  // Single 9: Q170-172 (3 câu)
  {
    passageTitle: 'Questions 170-172 refer to the following job posting:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold text-base">Position Open: Bilingual Tour Coordinator — SilverBay Cruises</p>
      <p class="mt-2">SilverBay Cruises seeks an enthusiastic, detail-oriented Tour Coordinator to join our waterfront operations team in Seattle. The coordinator will greet international tour groups, manage daily boarding manifests, and collaborate with vessel captains to keep harbor excursions on schedule.</p>
      <p class="mt-2"><strong>Requirements:</strong></p>
      <ul class="list-disc pl-5 mt-1 space-y-1">
        <li>Fluency in English plus Japanese or Mandarin</li>
        <li>At least two years of hospitality, tourism, or event coordination experience</li>
        <li>Availability to work weekends and holidays during the peak summer season (May–September)</li>
      </ul>
      <p class="mt-2">We offer competitive hourly pay, full health benefits after 90 days, and complimentary ferry passes for family members. Send a résumé and brief cover note to careers@silverbaycruises.com.</p>
    </div>`,
    questions: [
      [170, 'Which responsibility is part of the Tour Coordinator position?',
        mkOpts('Managing passenger boarding lists', 'Piloting harbor cruise vessels', 'Preparing meals on the ferry', 'Designing online travel brochures'), 'A',
        'Trách nhiệm nào thuộc vị trí Điều phối viên tour? — Quản lý danh sách hành khách lên tàu.',
        'Đoạn 1 nêu nhiệm vụ: "greet international tour groups, manage daily boarding manifests, and collaborate with vessel captains".',
        [['bilingual', 'adj.', 'song ngữ'], ['manifest', 'n.', 'bảng kê danh sách hành khách'], ['excursion', 'n.', 'chuyến tham quan ngắn']]],
      [171, 'What is required of applicants for this role?',
        mkOpts('Fluency in two languages', 'A commercial boating license', 'Five years of accounting experience', 'Willingness to relocate to Japan'), 'A',
        'Ứng viên cần đáp ứng yêu cầu nào? — Thông thạo hai ngôn ngữ.',
        'Mục Requirements: "Fluency in English plus Japanese or Mandarin".',
        [['hospitality', 'n.', 'ngành dịch vụ khách sạn - du lịch'], ['competitive', 'adj.', 'cạnh tranh'], ['availability', 'n.', 'sự sẵn sàng']]],
      [172, 'What benefit is offered to employees after three months?',
        mkOpts('Full health insurance coverage', 'Paid round-trip international flights', 'A free summer vacation package', 'An annual performance bonus'), 'A',
        'Phúc lợi nào được cung cấp cho nhân viên sau ba tháng? — Bảo hiểm y tế đầy đủ.',
        'Đoạn cuối: "full health benefits after 90 days" (90 ngày tương đương 3 tháng).',
        [['benefits', 'n.', 'phúc lợi'], ['complimentary', 'adj.', 'miễn phí'], ['cover note', 'n.', 'thư giới thiệu ngắn']]]
    ]
  },
  // Single 10: Q173-175 (3 câu)
  {
    passageTitle: 'Questions 173-175 refer to the following online review:',
    passageHtml: `<div class="border-2 border-neutral-800 bg-white p-4 sm:p-5 text-sm leading-relaxed text-neutral-900 shadow-sm mb-3">
      <p class="font-bold">★★★★☆ — Great Keyboard for Long Typing Sessions! (Posted by Kevin M.)</p>
      <p class="mt-2">I bought the KeyWave Pro wireless mechanical keyboard three weeks ago for my home office. The tactile switches feel crisp without being loud enough to disturb people on video calls, and the battery has lasted nearly twenty days on a single USB-C charge.</p>
      <p class="mt-2">Switching between my work laptop and desktop computer takes only one press of the function key. My only minor complaint is that the detachable wrist rest is sold separately rather than included in the box. Even so, it's easily the most comfortable keyboard I have used under $120.</p>
    </div>`,
    questions: [
      [173, 'Why does Kevin M. like using the KeyWave Pro during video calls?',
        mkOpts('The keys are relatively quiet when typed.', 'It has a built-in microphone and webcam.', 'Its battery charges automatically via Wi-Fi.', 'It connects directly to video conferencing apps.'), 'A',
        'Tại sao Kevin M. thích dùng KeyWave Pro trong các cuộc gọi video? — Các phím gõ tương đối êm.',
        'Anh viết: "The tactile switches feel crisp without being loud enough to disturb people on video calls".',
        [['tactile', 'adj.', 'có độ nảy xúc giác tốt'], ['crisp', 'adj.', 'gọn gàng, sắc nét'], ['disturb', 'v.', 'làm phiền']]],
      [174, 'What feature makes it easy for Kevin to use two computers?',
        mkOpts('A single function key switches devices.', 'Two separate USB receivers are built into the desk.', 'A voice assistant pairs the laptop automatically.', 'The keyboard splits physically into two halves.'), 'A',
        'Tính năng nào giúp Kevin dễ dàng dùng hai máy tính? — Một phím chức năng giúp chuyển đổi thiết bị.',
        'Đoạn 2: "Switching between my work laptop and desktop computer takes only one press of the function key."',
        [['detachable', 'adj.', 'có thể tháo rời'], ['wrist rest', 'n.', 'kê tay'], ['separately', 'adv.', 'riêng lẻ']]],
      [175, 'What minor drawback does the reviewer mention?',
        mkOpts('The wrist rest is not included with the keyboard.', 'The USB-C cable is too short for desktop towers.', 'The battery runs out after less than three days.', 'The price recently went above $120.'), 'A',
        'Nhược điểm nhỏ nào được người đánh giá nhắc tới? — Phần kê tay không đi kèm trong hộp bàn phím.',
        'Câu: "My only minor complaint is that the detachable wrist rest is sold separately rather than included in the box."',
        [['complaint', 'n.', 'lời phàn nàn'], ['drawback', 'n.', 'nhược điểm'], ['minor', 'adj.', 'nhỏ, không đáng kể']]]
    ]
  },

  // Double Passage 1: Q176-180 (5 câu)
  {
    passageTitle: 'Questions 176-180 refer to the following e-mail and invoice:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: E-mail</p>
        <p><strong>To:</strong> orders@apexoffice.com<br><strong>From:</strong> Rachel Lim, Office Administrator, Crestwood Legal<br><strong>Date:</strong> September 9<br><strong>Subject:</strong> Discrepancy on Invoice #AP-3318</p>
        <p class="mt-2">Dear Apex Office Supply Team,</p>
        <p class="mt-1">We received our quarterly supply shipment this morning, along with Invoice #AP-3318. Most items arrived in excellent condition, including the ergonomic desk chairs and copy paper boxes. However, we noticed two issues that need correction before our accounting department can approve payment.</p>
        <p class="mt-1">First, although we ordered 12 packs of dry-erase markers, only 8 packs were inside the carton. Second, the invoice reflects a delivery charge of $45, even though orders over $1,000 qualify for free standard shipping under our corporate account agreement. Could you please ship the 4 missing marker packs and issue a revised invoice removing the shipping fee?</p>
        <p class="mt-1">Thank you,<br>Rachel Lim</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Invoice #AP-3318 (Apex Office Supply)</p>
        <p class="text-xs text-slate-600">Billed To: Crestwood Legal • Invoice Date: September 7 • Terms: Net 30</p>
        <table class="w-full mt-2 border-collapse border border-slate-300 text-xs sm:text-sm bg-white">
          <thead><tr class="bg-slate-100"><th class="border border-slate-300 p-1.5 text-left">Item</th><th class="border border-slate-300 p-1.5 text-center">Qty</th><th class="border border-slate-300 p-1.5 text-right">Unit Price</th><th class="border border-slate-300 p-1.5 text-right">Total</th></tr></thead>
          <tbody>
            <tr><td class="border border-slate-300 p-1.5">Ergonomic Mesh Desk Chair</td><td class="border border-slate-300 p-1.5 text-center">4</td><td class="border border-slate-300 p-1.5 text-right">$240.00</td><td class="border border-slate-300 p-1.5 text-right">$960.00</td></tr>
            <tr><td class="border border-slate-300 p-1.5">Letter Copy Paper (Case of 10)</td><td class="border border-slate-300 p-1.5 text-center">5</td><td class="border border-slate-300 p-1.5 text-right">$42.00</td><td class="border border-slate-300 p-1.5 text-right">$210.00</td></tr>
            <tr><td class="border border-slate-300 p-1.5">Dry-Erase Markers (Pack of 6)</td><td class="border border-slate-300 p-1.5 text-center">12</td><td class="border border-slate-300 p-1.5 text-right">$8.00</td><td class="border border-slate-300 p-1.5 text-right">$96.00</td></tr>
            <tr><td class="border border-slate-300 p-1.5 font-semibold" colspan="3">Standard Shipping Fee</td><td class="border border-slate-300 p-1.5 text-right">$45.00</td></tr>
            <tr class="bg-slate-50 font-bold"><td class="border border-slate-300 p-1.5" colspan="3">Total Amount Due</td><td class="border border-slate-300 p-1.5 text-right">$1,311.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>`,
    questions: [
      [176, 'Why did Ms. Lim write the e-mail?',
        mkOpts('To report missing items and a billing error', 'To cancel her company’s corporate account', 'To place an urgent order for four desk chairs', 'To ask for an extension on the Net 30 payment deadline'), 'A',
        'Tại sao cô Lim viết e-mail? — Để báo thiếu hàng và sai sót trong hóa đơn.',
        'Cô nêu hai vấn đề: thiếu 4 gói bút lông bảng và hóa đơn tính nhầm phí giao hàng $45.',
        [['discrepancy', 'n.', 'sự sai lệch, chênh lệch'], ['corporate account', 'n.', 'tài khoản doanh nghiệp'], ['qualify for', 'v.', 'đủ điều kiện cho']]],
      [177, 'How many dry-erase marker packs were missing from the delivery?',
        mkOpts('4 packs', '6 packs', '8 packs', '12 packs'), 'A',
        'Có bao nhiêu gói bút dạ viết bảng bị thiếu trong lô hàng? — 4 gói.',
        'Đặt 12 gói ("ordered 12 packs"), nhận được 8 gói ("only 8 packs were inside") -> thiếu 4 gói.',
        [['carton', 'n.', 'thùng bìa cứng'], ['dry-erase marker', 'n.', 'bút lông viết bảng'], ['missing', 'adj.', 'bị thiếu']]],
      [178, 'Why does Crestwood Legal qualify for free standard shipping?',
        mkOpts('Its merchandise subtotal exceeds $1,000.', 'It placed the order on September 7.', 'The shipment contained office furniture.', 'It agreed to pay within 30 days.'), 'A',
        'Tại sao Crestwood Legal đủ điều kiện miễn phí giao hàng tiêu chuẩn? — Tổng tiền hàng vượt quá $1,000.',
        'Email nêu "orders over $1,000 qualify for free standard shipping". Hóa đơn có tiền hàng $960 + $210 + $96 = $1,266 (> $1,000).',
        [['subtotal', 'n.', 'tổng tiền hàng chưa phụ phí'], ['shipping fee', 'n.', 'phí vận chuyển'], ['approve', 'v.', 'phê duyệt']]],
      [179, 'According to the invoice, what is the unit price of a case of copy paper?',
        mkOpts('$42.00', '$8.00', '$45.00', '$240.00'), 'A',
        'Theo hóa đơn, đơn giá một thùng giấy in là bao nhiêu? — $42.00.',
        'Bảng hóa đơn dòng 2: "Letter Copy Paper (Case of 10) | Qty 5 | Unit Price $42.00".',
        [['unit price', 'n.', 'đơn giá'], ['amount due', 'n.', 'tổng tiền phải trả'], ['ergonomic', 'adj.', 'công thái học']]],
      [180, 'What should the corrected total on the revised invoice be?',
        mkOpts('$1,266.00', '$1,311.00', '$1,234.00', '$1,170.00'), 'A',
        'Tổng tiền đúng trên hóa đơn sửa đổi phải là bao nhiêu? — $1,266.00.',
        'Tổng cũ là $1,311.00; bỏ phí giao hàng $45.00 (và giao bù 4 gói bút đã tính tiền) -> $1,311.00 - $45.00 = $1,266.00.',
        [['revised', 'adj.', 'được chỉnh sửa'], ['remove', 'v.', 'loại bỏ'], ['invoice', 'n.', 'hóa đơn']]]
    ]
  },

  // Double Passage 2: Q181-185 (5 câu)
  {
    passageTitle: 'Questions 181-185 refer to the following flyer and web feedback:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Event Flyer</p>
        <p class="font-bold">Midtown Neighborhood Street Fair — Sunday, July 13 (11:00 A.M. – 6:00 P.M.)</p>
        <p class="mt-1">Join us on Elm Street between 3rd and 7th Avenue for food trucks, handmade crafts, and live acoustic music! Admission is free for all visitors.</p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Artisan Market (3rd–4th Ave):</strong> Over 40 local potters, jewelers, and woodworkers.</li>
          <li><strong>Food Court (5th Ave):</strong> 12 gourmet food trucks offering vegetarian, seafood, and dessert options.</li>
          <li><strong>Main Acoustic Stage (6th–7th Ave):</strong> Live performances every hour starting at noon.</li>
        </ul>
        <p class="mt-1"><strong>Note:</strong> Elm Street will be closed to motor vehicles from 8:00 A.M. to 8:00 P.M. Free bicycle valet parking is available near 3rd Avenue.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: Visitor Feedback Form</p>
        <p class="text-xs text-slate-600">Submitted by: Maya Lin • Date: July 14</p>
        <p class="mt-1">My family attended the street fair yesterday afternoon and really enjoyed the ceramic booths in the Artisan Market and the jazz trio at 3:00 P.M. The bicycle valet near 3rd Avenue made getting there effortless! However, around 1:30 P.M., the Food Court area on 5th Avenue felt quite crowded, and several trucks ran out of cold bottled water because of the 90-degree heat. Adding two extra water-refill stations next summer would be a huge help.</p>
      </div>
    </div>`,
    questions: [
      [181, 'What is true about admission to the Midtown Neighborhood Street Fair?',
        mkOpts('It does not cost anything.', 'Tickets must be bought at 3rd Avenue.', 'Only residents of Elm Street enter free.', 'A discount applies before noon.'), 'A',
        'Điều gì đúng về vé vào cửa lễ hội đường phố Midtown? — Hoàn toàn miễn phí.',
        'Tờ rơi ghi: "Admission is free for all visitors."',
        [['admission', 'n.', 'vé vào cửa'], ['artisan', 'n.', 'nghệ nhân thủ công'], ['gourmet', 'adj.', 'ẩm thực cao cấp']]],
      [182, 'At what time did the live music performances begin?',
        mkOpts('12:00 P.M.', '8:00 A.M.', '11:00 A.M.', '3:00 P.M.'), 'A',
        'Các tiết mục nhạc sống bắt đầu vào lúc mấy giờ? — 12 giờ trưa (noon).',
        'Tờ rơi: "Main Acoustic Stage... Live performances every hour starting at noon."',
        [['acoustic', 'adj.', 'nhạc mộc (không điện tử)'], ['performance', 'n.', 'buổi biểu diễn'], ['effortless', 'adj.', 'nhẹ nhàng, không tốn sức']]],
      [183, 'How did Maya Lin most likely travel to the street fair?',
        mkOpts('By bicycle', 'By subway', 'By private car', 'By city shuttle bus'), 'A',
        'Maya Lin nhiều khả năng đã đi tới lễ hội bằng phương tiện gì? — Xe đạp.',
        'Cô nhận xét: "The bicycle valet near 3rd Avenue made getting there effortless!"',
        [['valet', 'n.', 'dịch vụ trông giữ xe'], ['motor vehicle', 'n.', 'xe cơ giới'], ['ceramic', 'adj.', 'gốm sứ']]],
      [184, 'Which area of the fair did Maya Lin find too crowded?',
        mkOpts('5th Avenue', '3rd Avenue', '6th Avenue', '7th Avenue'), 'A',
        'Khu vực nào của lễ hội mà Maya Lin thấy quá đông đúc? — Đại lộ số 5 (5th Avenue).',
        'Phản hồi của cô: "the Food Court area on 5th Avenue felt quite crowded".',
        [['crowded', 'adj.', 'đông đúc'], ['run out of', 'v.', 'hết sạch'], ['refill station', 'n.', 'trạm tiếp nước']]],
      [185, 'What improvement does Maya Lin suggest for next year?',
        mkOpts('Installing additional water-refill stations', 'Extending the Artisan Market to 7th Avenue', 'Opening Elm Street to cars at 6:00 P.M.', 'Scheduling fewer acoustic bands'), 'A',
        'Maya Lin gợi ý cải tiến gì cho năm sau? — Lắp đặt thêm các trạm lấy nước.',
        'Câu cuối phần phản hồi: "Adding two extra water-refill stations next summer would be a huge help."',
        [['suggest', 'v.', 'đề xuất'], ['bottled water', 'n.', 'nước đóng chai'], ['potter', 'n.', 'thợ làm gốm']]]
    ]
  },

  // Triple Passage 1: Q186-190 (5 câu)
  {
    passageTitle: 'Questions 186-190 refer to the following notice, e-mail, and room booking chart:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Company Intranet Notice</p>
        <p><strong>Building Upgrade Alert — North Annex Conference Suites</strong><br>From May 12 to May 16, Facilities will upgrade the ceiling projectors and soundbars in Suite A and Suite B (North Annex). During this week, both suites will be unavailable for meetings. Teams needing audiovisual presentation equipment should reserve either the Executive Boardroom or Room 304 in the Main Building.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: E-mail</p>
        <p><strong>To:</strong> facilities@novatech.io<br><strong>From:</strong> Owen Park, Product Lead<br><strong>Date:</strong> May 7<br><strong>Subject:</strong> Client Demo Meeting on May 14</p>
        <p class="mt-1">Hi Facilities Team,</p>
        <p class="mt-1">I originally booked Suite A for our Q2 client software demonstration on Wednesday, May 14, from 1:00 P.M. to 3:00 P.M. Since Suite A is undergoing projector upgrades, could you move our reservation to an available room with a projector for 14 attendees during that same time slot?</p>
        <p class="mt-1">Thanks,<br>Owen Park</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: Main Building Availability — Wednesday, May 14 (1:00–3:00 P.M.)</p>
        <table class="w-full mt-2 border-collapse border border-slate-300 text-xs sm:text-sm bg-white">
          <thead><tr class="bg-slate-100"><th class="border border-slate-300 p-1.5 text-left">Room</th><th class="border border-slate-300 p-1.5 text-center">Capacity</th><th class="border border-slate-300 p-1.5 text-left">Equipment</th><th class="border border-slate-300 p-1.5 text-center">Status (1–3 P.M.)</th></tr></thead>
          <tbody>
            <tr><td class="border border-slate-300 p-1.5">Executive Boardroom</td><td class="border border-slate-300 p-1.5 text-center">20</td><td class="border border-slate-300 p-1.5">4K Projector, Dual Mic</td><td class="border border-slate-300 p-1.5 text-center">Booked (1:00–2:30 P.M.)</td></tr>
            <tr><td class="border border-slate-300 p-1.5">Room 302</td><td class="border border-slate-300 p-1.5 text-center">8</td><td class="border border-slate-300 p-1.5">Whiteboard only</td><td class="border border-slate-300 p-1.5 text-center">Available</td></tr>
            <tr><td class="border border-slate-300 p-1.5">Room 304</td><td class="border border-slate-300 p-1.5 text-center">16</td><td class="border border-slate-300 p-1.5">Ceiling Projector, Audio</td><td class="border border-slate-300 p-1.5 text-center">Available</td></tr>
          </tbody>
        </table>
      </div>
    </div>`,
    questions: [
      [186, 'Why is Suite A closed during the week of May 12?',
        mkOpts('Its audiovisual equipment is being upgraded.', 'The air-conditioning ducts are being cleaned.', 'An external audit team reserved the entire annex.', 'The ceiling lights failed a safety inspection.'), 'A',
        'Tại sao phòng Suite A đóng cửa trong tuần lễ ngày 12 tháng 5? — Vì thiết bị nghe nhìn của phòng đang được nâng cấp.',
        'Thông báo nội bộ nêu: "upgrade the ceiling projectors and soundbars in Suite A and Suite B".',
        [['audiovisual', 'adj.', 'nghe nhìn'], ['intranet', 'n.', 'mạng nội bộ công ty'], ['unavailable', 'adj.', 'không sẵn sàng/không trống']]],
      [187, 'What did Owen Park originally plan to do in Suite A on May 14?',
        mkOpts('Present a software demonstration to a client', 'Hold a training session for new facilities staff', 'Interview fourteen job candidates', 'Film a marketing promotional video'), 'A',
        'Owen Park ban đầu định làm gì ở phòng Suite A vào ngày 14 tháng 5? — Trình diễn phần mềm cho khách hàng.',
        'Email ghi: "our Q2 client software demonstration on Wednesday, May 14".',
        [['demonstration', 'n.', 'buổi trình diễn/giới thiệu sản phẩm'], ['capacity', 'n.', 'sức chứa'], ['attendee', 'n.', 'người tham dự']]],
      [188, 'Why can’t Owen Park’s meeting be moved to the Executive Boardroom?',
        mkOpts('It is already reserved during part of his meeting time.', 'It does not have enough seats for 14 people.', 'It lacks a projector and audio system.', 'It is closed for maintenance until May 16.'), 'A',
        'Tại sao cuộc họp của Owen Park không thể chuyển sang Executive Boardroom? — Vì phòng đó đã có người đặt trong một phần khung giờ của anh.',
        'Bảng lịch phòng ghi Executive Boardroom bị đặt từ 1:00–2:30 P.M., trùng với lịch 1:00–3:00 P.M. của Owen.',
        [['time slot', 'n.', 'khung giờ'], ['undergo', 'v.', 'trải qua (sửa chữa/nâng cấp)'], ['status', 'n.', 'trạng thái']]],
      [189, 'Which room best meets all of Owen Park’s requirements?',
        mkOpts('Room 304', 'Suite B', 'Room 302', 'Executive Boardroom'), 'A',
        'Phòng nào đáp ứng tốt nhất mọi yêu cầu của Owen Park? — Room 304.',
        'Room 304 có sức chứa 16 (>14 người), có máy chiếu trần & âm thanh, và đang trống (Available) khung 1–3 P.M.',
        [['reservation', 'n.', 'lịch đặt trước'], ['equipment', 'n.', 'trang thiết bị'], ['boardroom', 'n.', 'phòng họp ban giám đốc']]],
      [190, 'What is mentioned about Room 302?',
        mkOpts('It is too small and lacks a projector.', 'It is located in the North Annex.', 'It has dual microphones installed.', 'It is booked until 2:30 P.M.'), 'A',
        'Điều gì được nhắc tới về Phòng 302? — Phòng quá nhỏ (8 chỗ) và không có máy chiếu.',
        'Bảng ghi Room 302 có Capacity 8 (không đủ 14 người) và Equipment "Whiteboard only".',
        [['whiteboard', 'n.', 'bảng trắng'], ['dual', 'adj.', 'kép, đôi'], ['alert', 'n.', 'cảnh báo, thông báo']]]
    ]
  },

  // Triple Passage 2: Q191-195 (5 câu)
  {
    passageTitle: 'Questions 191-195 refer to the following webpage, e-mail, and order confirmation:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Webpage — Alpine Roasters Wholesale Portal</p>
        <p><strong>Coffee Bean Pricing (20-lb Commercial Bags):</strong></p>
        <ul class="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Summit House Blend:</strong> $150/bag (Medium Roast)</li>
          <li><strong>Andes Single-Origin:</strong> $180/bag (Light Roast)</li>
          <li><strong>Espresso Velvet Dark:</strong> $165/bag (Dark Roast)</li>
        </ul>
        <p class="mt-1 text-xs">Bulk Discount: Order 5 or more bags in a single shipment and receive 10% off the total bean price. Shipping is $25 flat rate per order.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: E-mail</p>
        <p><strong>To:</strong> wholesale@alpineroasters.com<br><strong>From:</strong> Mateo Diaz, Cafe Owner, Corner Cup<br><strong>Date:</strong> October 2<br><strong>Subject:</strong> October Coffee Order</p>
        <p class="mt-1">Hi Alpine Team, we are expanding our morning espresso menu next week. Please process an order for 3 bags of Espresso Velvet Dark and 2 bags of Summit House Blend. Please charge our card on file and deliver to our Main Street cafe.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: Order Confirmation #AR-7720</p>
        <p class="text-xs text-slate-600">Customer: Corner Cup Cafe • Ship Date: October 3</p>
        <p class="mt-1">Items: 3 × Espresso Velvet Dark ($495.00) + 2 × Summit House Blend ($300.00)<br>
        Subtotal: $795.00 • Bulk Discount (10%): -$79.50 • Shipping: $25.00<br>
        <strong>Total Charged: $740.50</strong></p>
      </div>
    </div>`,
    questions: [
      [191, 'Who is Mateo Diaz?',
        mkOpts('The owner of Corner Cup Cafe', 'A sales manager at Alpine Roasters', 'A coffee grower from the Andes', 'A delivery driver for wholesale orders'), 'A',
        'Mateo Diaz là ai? — Chủ quán Corner Cup Cafe.',
        'Phần From của e-mail ghi: "Mateo Diaz, Cafe Owner, Corner Cup".',
        [['wholesale', 'n.', 'bán sỉ'], ['bulk discount', 'n.', 'chiết khấu mua số lượng lớn'], ['flat rate', 'n.', 'mức phí cố định']]],
      [192, 'Why did Corner Cup Cafe qualify for the 10% bulk discount?',
        mkOpts('It ordered a total of 5 commercial bags.', 'It paid the $25 shipping fee in advance.', 'It purchased only single-origin beans.', 'It placed the order on October 2.'), 'A',
        'Tại sao Corner Cup Cafe được hưởng chiết khấu 10%? — Vì quán đặt tổng cộng 5 bao cà phê.',
        'Trang web quy định đặt từ 5 bao trở lên được giảm 10%; quán đặt 3 bao Espresso Velvet Dark + 2 bao Summit House Blend = 5 bao.',
        [['single-origin', 'adj.', 'đơn nguồn gốc'], ['roast', 'n.', 'mức độ rang'], ['card on file', 'phr.', 'thẻ đã lưu trong hệ thống']]],
      [193, 'Which coffee bean variety was NOT included in order #AR-7720?',
        mkOpts('Andes Single-Origin', 'Summit House Blend', 'Espresso Velvet Dark', 'Medium Roast Blend'), 'A',
        'Loại hạt cà phê nào KHÔNG có trong đơn #AR-7720? — Andes Single-Origin.',
        'Xác nhận đơn chỉ có Espresso Velvet Dark và Summit House Blend; không có Andes Single-Origin.',
        [['variety', 'n.', 'chủng loại'], ['confirmation', 'n.', 'xác nhận'], ['process', 'v.', 'xử lý (đơn hàng)']]],
      [194, 'What was the shipping cost for Corner Cup’s order?',
        mkOpts('$25.00', '$79.50', '$15.00', 'Free'), 'A',
        'Phí vận chuyển cho đơn hàng của Corner Cup là bao nhiêu? — $25.00.',
        'Xác nhận đơn hàng ghi rõ: "Shipping: $25.00".',
        [['subtotal', 'n.', 'tạm tính'], ['charge', 'v.', 'tính phí, trừ tiền'], ['commercial', 'adj.', 'thương mại']]],
      [195, 'According to the confirmation, when will the order ship?',
        mkOpts('October 3', 'October 2', 'Next week', 'At the end of October'), 'A',
        'Theo xác nhận đơn hàng, đơn sẽ được gửi đi khi nào? — Ngày 3 tháng 10.',
        'Document 3 ghi: "Ship Date: October 3".',
        [['ship date', 'n.', 'ngày giao hàng đi'], ['blend', 'n.', 'hỗn hợp pha trộn'], ['portal', 'n.', 'cổng đặt hàng']]]
    ]
  },

  // Triple Passage 3: Q196-200 (5 câu)
  {
    passageTitle: 'Questions 196-200 refer to the following job listing, e-mail, and internal note:',
    passageHtml: `<div class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm leading-relaxed space-y-4">
      <div>
        <p class="font-bold text-slate-900">Document 1: Job Listing — UrbanGrid Energy</p>
        <p><strong>Role:</strong> Junior Data Analyst (Full-Time, Hybrid — Austin, TX)<br><strong>Qualifications:</strong> Bachelor's degree in statistics, economics, or computer science; proficiency in SQL and Python; strong ability to build executive dashboards. Start Date: August 4.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 2: E-mail</p>
        <p><strong>To:</strong> hr@urbangridenergy.com<br><strong>From:</strong> Priya Nair<br><strong>Date:</strong> July 3<br><strong>Subject:</strong> Application — Junior Data Analyst</p>
        <p class="mt-1">Dear Hiring Team, I am applying for the Junior Data Analyst role. I hold a B.S. in Statistics and have two years of experience writing SQL and Python pipelines for a utility billing company, where I built weekly executive dashboards. I am currently completing a project in Dallas and will relocate to Austin by July 28.</p>
      </div>
      <hr class="border-slate-300">
      <div>
        <p class="font-bold text-slate-900">Document 3: HR Screening Note</p>
        <p><strong>Candidate:</strong> Priya Nair • <strong>Reviewer:</strong> Samira Patel<br><strong>Assessment:</strong> Meets all technical and degree requirements; relocation timeline (July 28) fits our August 4 start date cleanly. Recommend advancing to technical interview with the Analytics Lead on July 11 at 10:30 A.M. via video call.</p>
      </div>
    </div>`,
    questions: [
      [196, 'Where will the Junior Data Analyst work?',
        mkOpts('In a hybrid arrangement in Austin', 'Fully remotely from Dallas', 'On-site five days a week in Dallas', 'At an international branch office'), 'A',
        'Chuyên viên phân tích dữ liệu sơ cấp sẽ làm việc ở đâu? — Theo hình thức kết hợp (hybrid) tại Austin.',
        'Tin tuyển dụng ghi: "Hybrid — Austin, TX".',
        [['hybrid', 'adj.', 'kết hợp tại văn phòng và từ xa'], ['proficiency', 'n.', 'sự thành thạo'], ['executive dashboard', 'n.', 'bảng điều khiển báo cáo cho lãnh đạo']]],
      [197, 'What academic degree does Priya Nair hold?',
        mkOpts('A bachelor’s degree in statistics', 'A master’s degree in economics', 'A certificate in energy engineering', 'An associate degree in billing'), 'A',
        'Priya Nair có bằng cấp học thuật gì? — Bằng cử nhân ngành Thống kê.',
        'Email nêu: "I hold a B.S. in Statistics".',
        [['bachelor’s degree', 'n.', 'bằng cử nhân'], ['utility', 'n.', 'tiện ích công cộng (điện/nước)'], ['pipeline', 'n.', 'quy trình luồng dữ liệu']]],
      [198, 'When does Priya Nair plan to move to Austin?',
        mkOpts('By July 28', 'On August 4', 'On July 11', 'By July 3'), 'A',
        'Priya Nair dự định chuyển đến Austin khi nào? — Trước ngày 28 tháng 7.',
        'Email ghi: "will relocate to Austin by July 28."',
        [['relocate', 'v.', 'chuyển chỗ ở/công tác'], ['timeline', 'n.', 'mốc thời gian'], ['screening', 'n.', 'sàng lọc hồ sơ']]],
      [199, 'What does Samira Patel recommend for Priya Nair?',
        mkOpts('Inviting her to a video technical interview', 'Offering her the position immediately', 'Asking her to take an additional SQL course', 'Delaying the job start date until September'), 'A',
        'Samira Patel đề xuất gì cho Priya Nair? — Mời cô tham gia phỏng vấn chuyên môn qua video.',
        'Ghi chú nhân sự nêu: "Recommend advancing to technical interview with the Analytics Lead on July 11 at 10:30 A.M. via video call."',
        [['assessment', 'n.', 'sự đánh giá'], ['advance', 'v.', 'tiến vào vòng tiếp theo'], ['technical interview', 'n.', 'phỏng vấn chuyên môn']]],
      [200, 'Who will conduct Priya Nair’s next interview?',
        mkOpts('The Analytics Lead', 'Samira Patel', 'A Dallas utility manager', 'The company president'), 'A',
        'Ai sẽ thực hiện buổi phỏng vấn tiếp theo của Priya Nair? — Trưởng nhóm Phân tích (Analytics Lead).',
        'Document 3: "technical interview with the Analytics Lead on July 11".',
        [['conduct', 'v.', 'tiến hành'], ['lead', 'n.', 'trưởng nhóm'], ['fit cleanly', 'phr.', 'khớp hoàn toàn']]]
    ]
  }
];

const part7 = [];
part7Passages.forEach((grp) => {
  grp.questions.forEach(([id, questionText, options, correct, translation, explanation, vocab]) => {
    part7.push({
      id: `reading-test-1-q${id}`,
      questionNumber: id,
      etsYear: '2026',
      etsTestId: 'reading-test-1',
      part: 'Part 7',
      partNumber: 7,
      partName: 'Part 7: Đọc hiểu (Reading Comprehension)',
      title: `Test 01 • Câu ${id} (Part 7: Đọc hiểu)`,
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
  id: 'reading-test-1',
  year: '2026',
  code: 'Test 01',
  title: 'Đề Luyện đọc 01 - TOEIC Reading'
};

const readingDir = path.join(ROOT, 'reading');
fs.mkdirSync(readingDir, { recursive: true });

const output = `/**
 * Đề Luyện đọc Test 01 (100 câu Part 5–7 độc lập cho mục Luyện đọc).
 * Sinh tự động bởi tools/build_reading_test1.js — không sửa tay.
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

const outPath = path.join(readingDir, 'test-01.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`Built ${outPath}: total=${allExercises.length} (P5=${part5.length}, P6=${part6.length}, P7=${part7.length})`);
