/**
 * KAI TOEIC - Kho Dữ Liệu Toàn Diện
 * Bao gồm:
 * 1. Đề thi thử TOEIC (Mock Tests) với đủ Listening & Reading, giải thích song ngữ chi tiết
 * 2. Bài tập Luyện Nghe Chép Chính Tả (Dictation) & Nghe theo Part
 * 3. Ngân hàng Ngữ Pháp Part 5 & Đọc Hiểu Song Ngữ Part 7 (Hỗ trợ click tra từ)
 * 4. Đề thi Speaking & Writing kèm hệ thống chấm điểm AI chi tiết
 * 5. Bộ 600 Từ Vựng TOEIC cốt lõi theo chủ đề
 */

const wordFormationQuestionRows = {
    noun: [
        ["The company announced the _______ of a new research center.", ["(A) establish", "(B) establishment", "(C) established", "(D) establishing"], 1, "Sau mạo từ 'the' và trước cụm 'of...' cần danh từ: establishment."],
        ["The _______ of the annual report was delayed by one week.", ["(A) publish", "(B) publisher", "(C) publication", "(D) public"], 2, "Chủ ngữ cần danh từ chỉ sự việc: publication."],
        ["All job _______ must submit a résumé by Friday.", ["(A) apply", "(B) applicant", "(C) applicants", "(D) applicable"], 2, "Sau 'All job' cần danh từ chỉ người số nhiều: applicants."],
        ["The manager expressed her _______ for the team's hard work.", ["(A) appreciate", "(B) appreciative", "(C) appreciation", "(D) appreciably"], 2, "Sau tính từ sở hữu 'her' cần danh từ: appreciation."],
        ["The new software improved the _______ of inventory tracking.", ["(A) accurate", "(B) accurately", "(C) accuracy", "(D) accuracies"], 2, "Sau 'the' và trước 'of' cần danh từ: accuracy."],
        ["The hotel offers free _______ to guests arriving after midnight.", ["(A) transport", "(B) transportation", "(C) transportable", "(D) transported"], 1, "Sau tính từ 'free' cần danh từ chỉ dịch vụ: transportation."],
        ["The board reached a final _______ after reviewing the proposal.", ["(A) decide", "(B) decisive", "(C) decision", "(D) decisively"], 2, "Sau tính từ 'final' cần danh từ: decision."],
        ["Employee _______ is essential for maintaining a safe workplace.", ["(A) cooperate", "(B) cooperative", "(C) cooperation", "(D) cooperatively"], 2, "Vị trí chủ ngữ cần danh từ: cooperation."],
        ["The product's _______ depends on regular maintenance.", ["(A) reliable", "(B) reliably", "(C) reliability", "(D) rely"], 2, "Sau tính từ sở hữu 'product's' cần danh từ: reliability."],
        ["The conference attracted several industry _______.", ["(A) specialize", "(B) specialty", "(C) specialists", "(D) specialized"], 2, "Sau 'several industry' cần danh từ đếm được số nhiều chỉ người: specialists."],
        ["Please contact the _______ department for assistance with your account.", ["(A) finance", "(B) financial", "(C) financially", "(D) financier"], 0, "Cụm danh từ 'finance department' dùng danh từ bổ nghĩa cho danh từ."],
        ["The sudden _______ in demand surprised the sales team.", ["(A) grow", "(B) growth", "(C) growing", "(D) grown"], 1, "Sau tính từ 'sudden' cần danh từ: growth."],
        ["Customer _______ remains the company's top priority.", ["(A) satisfy", "(B) satisfied", "(C) satisfaction", "(D) satisfactorily"], 2, "Cụm chủ ngữ cần danh từ: satisfaction."],
        ["The city approved the _______ of a new airport terminal.", ["(A) construct", "(B) constructive", "(C) construction", "(D) constructed"], 2, "Sau mạo từ 'the' cần danh từ: construction."],
        ["The _______ of the shipment should be confirmed by email.", ["(A) arrive", "(B) arrival", "(C) arriving", "(D) arrived"], 1, "Chủ ngữ cần danh từ: arrival."],
        ["The company provides additional _______ for employees who relocate.", ["(A) assist", "(B) assistant", "(C) assistance", "(D) assisted"], 2, "Sau tính từ 'additional' cần danh từ: assistance."],
        ["The _______ addressed questions from reporters after the meeting.", ["(A) speak", "(B) speaker", "(C) speech", "(D) speaking"], 1, "Chủ ngữ chỉ người thực hiện hành động: speaker."],
        ["There has been a noticeable _______ in online sales this quarter.", ["(A) improve", "(B) improved", "(C) improvement", "(D) improving"], 2, "Sau mạo từ 'a' và tính từ cần danh từ: improvement."],
        ["The office manager is responsible for budget _______.", ["(A) administer", "(B) administrative", "(C) administration", "(D) administratively"], 2, "Sau danh từ 'budget' và trước giới từ cần danh từ: administration."],
        ["The technician checked the _______ of every instrument before use.", ["(A) function", "(B) functional", "(C) functionally", "(D) functioned"], 0, "Sau mạo từ 'the' cần danh từ: function."]
    ],
    verb: [
        ["The human resources department _______ new employees every month.", ["(A) orientation", "(B) orients", "(C) oriented", "(D) orienting"], 1, "Câu hiện tại đơn, chủ ngữ số ít: dùng động từ orients."],
        ["All visitors must _______ at the reception desk.", ["(A) register", "(B) registration", "(C) registered", "(D) registering"], 0, "Sau modal 'must' dùng động từ nguyên mẫu: register."],
        ["The supplier _______ the order before the end of the day.", ["(A) confirmation", "(B) confirming", "(C) confirmed", "(D) confirmable"], 2, "Câu cần động từ quá khứ phù hợp với ngữ cảnh đã hoàn tất: confirmed."],
        ["The new policy will _______ operating costs significantly.", ["(A) reduction", "(B) reduce", "(C) reduced", "(D) reducing"], 1, "Sau 'will' dùng động từ nguyên mẫu: reduce."],
        ["The director _______ the revised schedule to all staff yesterday.", ["(A) circulation", "(B) circulated", "(C) circulatory", "(D) circulating"], 1, "Có 'yesterday' nên dùng động từ quá khứ: circulated."],
        ["Each applicant _______ to provide two professional references.", ["(A) requirement", "(B) requires", "(C) required", "(D) requiring"], 1, "Chủ ngữ 'Each applicant' số ít, câu hiện tại đơn: requires."],
        ["The technician is _______ the network connection now.", ["(A) examination", "(B) examine", "(C) examined", "(D) examining"], 3, "Sau 'is' trong hiện tại tiếp diễn dùng V-ing: examining."],
        ["The company plans to _______ its services to three new markets.", ["(A) expansion", "(B) expand", "(C) expansive", "(D) expanded"], 1, "Sau 'to' cần động từ nguyên mẫu: expand."],
        ["Please _______ the attached form and return it by Monday.", ["(A) completion", "(B) complete", "(C) completely", "(D) completed"], 1, "Câu mệnh lệnh bắt đầu bằng động từ nguyên mẫu: complete."],
        ["The marketing team _______ a new campaign last week.", ["(A) launch", "(B) launches", "(C) launched", "(D) launching"], 2, "Có 'last week' nên dùng quá khứ đơn: launched."],
        ["The software automatically _______ customer records every night.", ["(A) backup", "(B) backups", "(C) backs up", "(D) backing up"], 2, "Chủ ngữ số ít, hiện tại đơn: backs up."],
        ["The committee will _______ the applications in alphabetical order.", ["(A) review", "(B) reviewer", "(C) reviewable", "(D) reviewing"], 0, "Sau modal 'will' dùng động từ nguyên mẫu: review."],
        ["Production _______ once the replacement parts arrive.", ["(A) resume", "(B) resumes", "(C) resumption", "(D) resumed"], 1, "Chủ ngữ 'Production' số ít, nói về tương lai theo mệnh đề thời gian dùng hiện tại đơn: resumes."],
        ["The sales representative _______ the client about the delivery delay.", ["(A) notification", "(B) notified", "(C) notifying", "(D) noticeable"], 1, "Câu kể sự việc đã xảy ra, cần động từ quá khứ: notified."],
        ["Employees are encouraged to _______ any safety concerns immediately.", ["(A) report", "(B) reporter", "(C) reported", "(D) reporting"], 0, "Sau 'to' cần động từ nguyên mẫu: report."],
        ["The updated system _______ users to track their orders online.", ["(A) enablement", "(B) enables", "(C) enabled", "(D) enabling"], 1, "Chủ ngữ số ít 'system', hiện tại đơn: enables."],
        ["The company _______ its hiring process to attract more candidates.", ["(A) simplify", "(B) simplified", "(C) simplification", "(D) simplifying"], 1, "Câu cần động từ quá khứ: simplified."],
        ["Before signing the contract, both parties should _______ the terms carefully.", ["(A) consideration", "(B) consider", "(C) considerate", "(D) considered"], 1, "Sau modal 'should' dùng động từ nguyên mẫu: consider."],
        ["The head office _______ all regional branches with updated guidelines.", ["(A) supplies", "(B) supply", "(C) supplied", "(D) supplying"], 0, "Chủ ngữ số ít 'The head office', hiện tại đơn: supplies."],
        ["The manager asked the assistant to _______ the meeting room for the presentation.", ["(A) preparation", "(B) preparatory", "(C) prepare", "(D) prepared"], 2, "Sau cấu trúc 'ask someone to' dùng động từ nguyên mẫu: prepare."]
    ],
    adjective: [
        ["The company is seeking a _______ candidate for the accounting position.", ["(A) qualify", "(B) qualification", "(C) qualified", "(D) qualifyingly"], 2, "Đứng trước danh từ 'candidate' cần tính từ: qualified."],
        ["Please submit the _______ documents before your appointment.", ["(A) require", "(B) required", "(C) requirement", "(D) requiringly"], 1, "Đứng trước danh từ 'documents' cần tính từ/phân từ: required."],
        ["The new equipment is _______ with the existing computer system.", ["(A) compatible", "(B) compatibility", "(C) compatibly", "(D) compatibilize"], 0, "Sau động từ nối 'is' cần tính từ: compatible."],
        ["The manager gave a _______ explanation of the revised procedure.", ["(A) detail", "(B) detailed", "(C) detailing", "(D) detailingly"], 1, "Trước danh từ 'explanation' cần tính từ: detailed."],
        ["The training session was _______ to all newly hired employees.", ["(A) access", "(B) accessible", "(C) accessibly", "(D) accessibility"], 1, "Sau 'was' cần tính từ mô tả session: accessible."],
        ["The firm introduced a _______ method for processing invoices.", ["(A) efficiency", "(B) efficiently", "(C) efficient", "(D) efficiencies"], 2, "Trước danh từ 'method' cần tính từ: efficient."],
        ["The office will remain _______ during the renovation.", ["(A) operation", "(B) operational", "(C) operationally", "(D) operate"], 1, "Sau động từ nối 'remain' cần tính từ: operational."],
        ["Customers found the online booking system very _______.", ["(A) convenience", "(B) conveniently", "(C) convenient", "(D) convene"], 2, "Sau 'find + object' dùng tính từ mô tả tân ngữ: convenient."],
        ["The company received an _______ response to its new product launch.", ["(A) enthusiasm", "(B) enthusiastic", "(C) enthusiastically", "(D) enthuse"], 1, "Trước danh từ 'response' cần tính từ: enthusiastic."],
        ["Please make sure the information is _______ before sending the report.", ["(A) accuracy", "(B) accurately", "(C) accurate", "(D) accuracies"], 2, "Sau 'is' cần tính từ: accurate."],
        ["The hotel offers _______ parking for guests attending the conference.", ["(A) compliment", "(B) complimentary", "(C) complimentarily", "(D) complimented"], 1, "Trước danh từ 'parking' cần tính từ: complimentary."],
        ["The revised schedule is more _______ for employees who commute by train.", ["(A) access", "(B) accessible", "(C) accessibly", "(D) accessibility"], 1, "Sau 'is more' cần tính từ: accessible."],
        ["The board is reviewing several _______ proposals for the expansion.", ["(A) finance", "(B) financial", "(C) financially", "(D) financier"], 1, "Trước danh từ 'proposals' cần tính từ: financial."],
        ["The instructions were clear and _______ for all participants.", ["(A) understand", "(B) understanding", "(C) understandable", "(D) understandably"], 2, "Sau 'were' và liên từ 'and' song song với tính từ clear: understandable."],
        ["The manufacturer guarantees that every component is _______.", ["(A) depend", "(B) dependable", "(C) dependably", "(D) dependability"], 1, "Sau 'is' cần tính từ: dependable."],
        ["We need a more _______ estimate before approving the budget.", ["(A) precisely", "(B) precision", "(C) precise", "(D) precisions"], 2, "Trước danh từ 'estimate' cần tính từ: precise."],
        ["The conference room is _______ for a group of twenty people.", ["(A) spacious", "(B) space", "(C) spaciously", "(D) spaciousness"], 0, "Sau 'is' cần tính từ: spacious."],
        ["The company has adopted an _______ approach to customer feedback.", ["(A) act", "(B) active", "(C) actively", "(D) activity"], 1, "Trước danh từ 'approach' cần tính từ: active."],
        ["The legal department considers the proposed changes _______.", ["(A) accept", "(B) acceptance", "(C) acceptable", "(D) acceptably"], 2, "Sau 'consider + object' cần tính từ bổ nghĩa cho tân ngữ: acceptable."],
        ["The replacement parts are _______ for immediate delivery.", ["(A) availability", "(B) available", "(C) availably", "(D) avail"], 1, "Sau 'are' cần tính từ: available."]
    ],
    adverb: [
        ["The staff handled the customer complaint _______.", ["(A) professional", "(B) professionally", "(C) profession", "(D) professionalize"], 1, "Bổ nghĩa cho động từ 'handled' cần trạng từ: professionally."],
        ["The new policy was _______ explained during the orientation.", ["(A) clear", "(B) clarity", "(C) clearly", "(D) clearing"], 2, "Bổ nghĩa cho 'explained' cần trạng từ: clearly."],
        ["The shipment arrived _______ despite the heavy traffic.", ["(A) safe", "(B) safety", "(C) safely", "(D) safeness"], 2, "Bổ nghĩa cho động từ 'arrived' cần trạng từ: safely."],
        ["The director was _______ impressed by the team's results.", ["(A) high", "(B) height", "(C) highly", "(D) heighten"], 2, "Trước tính từ/phân từ 'impressed' cần trạng từ: highly."],
        ["Please read the contract _______ before signing it.", ["(A) careful", "(B) carefully", "(C) care", "(D) carefulness"], 1, "Bổ nghĩa cho động từ 'read' cần trạng từ: carefully."],
        ["The software has _______ reduced the time required to process orders.", ["(A) significant", "(B) significance", "(C) significantly", "(D) signify"], 2, "Đứng giữa trợ động từ 'has' và V3 'reduced' cần trạng từ: significantly."],
        ["The customer service team responded _______ to every inquiry.", ["(A) prompt", "(B) promptly", "(C) promptness", "(D) prompting"], 1, "Bổ nghĩa cho 'responded' cần trạng từ: promptly."],
        ["The presentation was _______ organized and easy to follow.", ["(A) excellent", "(B) excellently", "(C) excellence", "(D) excel"], 1, "Bổ nghĩa cho phân từ 'organized' cần trạng từ: excellently."],
        ["The company _______ reviews its workplace safety procedures.", ["(A) regular", "(B) regularity", "(C) regularly", "(D) regulate"], 2, "Bổ nghĩa cho động từ 'reviews' cần trạng từ: regularly."],
        ["The technician completed the installation _______.", ["(A) successful", "(B) success", "(C) successfully", "(D) succeeding"], 2, "Bổ nghĩa cho động từ 'completed' cần trạng từ: successfully."],
        ["The new printer operates _______ than the previous model.", ["(A) quiet", "(B) quietly", "(C) more quietly", "(D) quietness"], 2, "Có 'than' nên cần so sánh hơn của trạng từ để bổ nghĩa cho 'operates': more quietly."],
        ["The manager _______ approved the revised budget this morning.", ["(A) final", "(B) finalize", "(C) finally", "(D) finality"], 2, "Bổ nghĩa cho động từ 'approved' cần trạng từ: finally."],
        ["All documents must be _______ stored in the shared folder.", ["(A) secure", "(B) security", "(C) securely", "(D) securing"], 2, "Bổ nghĩa cho phân từ 'stored' cần trạng từ: securely."],
        ["The finance department _______ checks expense reports for errors.", ["(A) frequent", "(B) frequency", "(C) frequently", "(D) frequented"], 2, "Bổ nghĩa cho động từ 'checks' cần trạng từ: frequently."],
        ["The conference speaker spoke _______ about the company's future plans.", ["(A) enthusiasm", "(B) enthusiastic", "(C) enthusiastically", "(D) enthusiast"], 2, "Bổ nghĩa cho động từ 'spoke' cần trạng từ: enthusiastically."],
        ["The revised instructions are _______ easier to understand.", ["(A) considerable", "(B) considerably", "(C) consideration", "(D) consider"], 1, "Bổ nghĩa cho tính từ so sánh 'easier' cần trạng từ: considerably."],
        ["The hotel staff _______ prepared the ballroom for the event.", ["(A) efficient", "(B) efficiency", "(C) efficiently", "(D) efficiencies"], 2, "Bổ nghĩa cho động từ 'prepared' cần trạng từ: efficiently."],
        ["The sales representative _______ described the product's main features.", ["(A) accurate", "(B) accuracy", "(C) accurately", "(D) accuracies"], 2, "Bổ nghĩa cho động từ 'described' cần trạng từ: accurately."],
        ["The company has _______ expanded its delivery service to rural areas.", ["(A) recent", "(B) recently", "(C) recency", "(D) renew"], 1, "Đứng giữa 'has' và V3 'expanded' cần trạng từ: recently."],
        ["Applicants should complete the online form _______ to avoid delays.", ["(A) correct", "(B) correction", "(C) correctly", "(D) corrective"], 2, "Bổ nghĩa cho động từ 'complete' cần trạng từ: correctly."]
    ]
};

const wordFormationQuestionBank = Object.fromEntries(
    Object.entries(wordFormationQuestionRows).map(([wordType, rows]) => [
        wordType,
        rows.map(([q, options, correctIndex, explanation], index) => ({
            q: `${index + 1}. ${q}`,
            options,
            correctIndex,
            explanation,
            wordType
        }))
    ])
);

window.DAU_DATA = {
    // 1. DANH SÁCH ĐỀ THI THỬ (MOCK TESTS)
    mockTests: [],

    // 2. BÀI TẬP LUYỆN NGHE CHÉP CHÍNH TẢ (DICTATION) & NGHE THEO PART
    listeningExercises: [],

    // 3. LUYỆN ĐỌC SONG NGỮ PART 7 (BILINGUAL READING + CLICK-TO-TRANSLATE)
    readingPassages: [],

    // 4. LUYỆN NÓI & VIẾT (SPEAKING & WRITING) VỚI AI CHẤM ĐIỂM
    speakingPrompts: [],

    writingPrompts: [],

    // 5. KHO 600 TỪ VỰNG TOEIC THEO CHỦ ĐỀ (BARRON'S 600 ESSENTIAL WORDS - 50 LESSONS)
    vocabTopics: window.BARRONS_600_TOPICS || [],

    // 6. KHO 300 CỤM ĐỘNG TỪ TOEIC (300 ESSENTIAL PHRASAL VERBS - 25 LESSONS)
    phrasalVerbTopics: window.PHRASAL_VERBS_300_TOPICS || [],

    // 7. TRỌN BỘ 22 CHUYÊN ĐỀ NGỮ PHÁP TOEIC TRỌNG TÂM (GRAMMAR TOPICS + MINI QUIZ PART 5)
    grammarTopics: [
        // ================= NHÓM 1: HỆ THỐNG ĐỘNG TỪ (VERBS & TENSES) =================
        {
            id: "gram-01-verb-tenses",
            titleEn: "VERB TENSES",
            titleVi: "THÌ ĐỘNG TỪ",
            title: "VERB TENSES — THÌ ĐỘNG TỪ",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 450 - 800+",
            icon: "fa-clock",
            summary: "Nắm vững 6 thì cốt lõi xuất hiện trong 95% đề thi TOEIC (Hiện tại đơn, Hiện tại tiếp diễn, Hiện tại hoàn thành, Quá khứ đơn, Tương lai đơn và Tương lai hoàn thành) dựa vào trạng từ chỉ thời gian.",
            formulas: [
                {
                    rule: "1. Hiện tại đơn (Present Simple) & Hiện tại tiếp diễn (Present Continuous)",
                    detail: "Hiện tại đơn diễn tả lịch trình, thói quen, sự thật tại công sở. Hiện tại tiếp diễn diễn tả hành động đang xảy ra ngay lúc nói hoặc kế hoạch sắp diễn ra.",
                    suffixes: "usually, annually, every quarter, currently, right now, at the moment",
                    example: "Our company [conducts] performance reviews every six months."
                },
                {
                    rule: "2. Quá khứ đơn (Past Simple) & Hiện tại hoàn thành (Present Perfect)",
                    detail: "Quá khứ đơn (V2/ed) đi với mốc thời gian đã kết thúc. Hiện tại hoàn thành (have/has + V3/ed) đi với hành động kéo dài từ quá khứ đến hiện tại.",
                    suffixes: "yesterday, last month, in 2022  <=>  since, for, over the past 5 years, recently",
                    example: "Ms. Kim [has managed] the Tokyo branch since 2021."
                },
                {
                    rule: "3. Tương lai đơn (Future Simple) & Tương lai hoàn thành (Future Perfect)",
                    detail: "Tương lai hoàn thành (will have + V3/ed) luôn đi kèm giới từ 'By + mốc thời gian trong tương lai' (By next Friday, By the end of this year).",
                    suffixes: "tomorrow, next week, upcoming  <=>  by next month, by the time + HTĐ",
                    example: "By next month, Mr. Davis [will have worked] here for ten years."
                }
            ],
            questions: [
                {
                    q: "1. Over the past three years, Apex Electronics _______ its market share in Southeast Asia by 35 percent.",
                    options: ["(A) expands", "(B) expanded", "(C) has expanded", "(D) will expand"],
                    correctIndex: 2,
                    explanation: "Cụm trạng từ 'Over the past three years' (Trong suốt 3 năm qua) là dấu hiệu kinh điển của thì Hiện tại hoàn thành -> chọn (C) has expanded."
                },
                {
                    q: "2. The board of directors _______ the annual financial audit at 10:00 A.M. tomorrow.",
                    options: ["(A) reviewed", "(B) will review", "(C) has reviewed", "(D) reviewing"],
                    correctIndex: 1,
                    explanation: "Có mốc thời gian tương lai 'tomorrow' -> chia thì Tương lai đơn (will review)."
                }
            ]
        },
        {
            id: "gram-02-sequence-of-tenses",
            titleEn: "SEQUENCE OF TENSES",
            titleVi: "SỰ PHỐI THÌ",
            title: "SEQUENCE OF TENSES — SỰ PHỐI THÌ",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-arrows-left-right",
            summary: "Quy tắc phối hợp thì giữa mệnh đề chính và mệnh đề trạng ngữ chỉ thời gian (when, while, before, after, as soon as, until, by the time, since).",
            formulas: [
                {
                    rule: "1. Sự phối thì trong Tương lai (Không dùng Will ở mệnh đề thời gian)",
                    detail: "Trong mệnh đề bắt đầu bằng when, before, after, as soon as, until, once, by the time chỉ tương lai -> chia Hiện tại đơn, mệnh đề chính chia Tương lai đơn.",
                    suffixes: "When / As soon as / Once + S + V(s/es), S + will + V_inf",
                    example: "As soon as the shipment [arrives], we will notify the warehouse manager."
                },
                {
                    rule: "2. Quy tắc phối thì với 'Since'",
                    detail: "Mệnh đề trước 'Since' chia Hiện tại hoàn thành (have/has + V3/ed), mệnh đề ngay sau 'Since' chia Quá khứ đơn (V2/ed).",
                    suffixes: "S + have/has + V3/ed + SINCE + S + V2/ed",
                    example: "Sales [have increased] steadily since the new catalog was released."
                },
                {
                    rule: "3. Quy tắc phối thì với 'By the time'",
                    detail: "By the time + Hiện tại đơn -> S + will have + V3/ed. By the time + Quá khứ đơn -> S + had + V3/ed (Quá khứ hoàn thành).",
                    suffixes: "By the time + S + V2/ed, S + had + V3/ed",
                    example: "By the time the technician arrived, the server [had already crashed]."
                }
            ],
            questions: [
                {
                    q: "1. Please submit your travel expense receipts to the accounting office as soon as you _______ from the conference.",
                    options: ["(A) will return", "(B) returned", "(C) return", "(D) had returned"],
                    correctIndex: 2,
                    explanation: "Sau liên từ chỉ thời gian 'as soon as' mang nghĩa tương lai, không dùng 'will' mà chia thì Hiện tại đơn -> chọn (C) return."
                },
                {
                    q: "2. By the time the new safety regulations took effect last month, our factory _______ all necessary equipment.",
                    options: ["(A) upgrades", "(B) has upgraded", "(C) will have upgraded", "(D) had upgraded"],
                    correctIndex: 3,
                    explanation: "Cấu trúc 'By the time + Quá khứ đơn (took effect last month)', mệnh đề chính chia Quá khứ hoàn thành (had upgraded)."
                }
            ]
        },
        {
            id: "gram-03-subject-verb-agreement",
            titleEn: "SUBJECT-VERB AGREEMENT",
            titleVi: "SỰ HÒA HỢP GIỮA CHỦ NGỮ VÀ ĐỘNG TỪ",
            title: "SUBJECT-VERB AGREEMENT — SỰ HÒA HỢP GIỮA CHỦ NGỮ VÀ ĐỘNG TỪ",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 500 - 850+",
            icon: "fa-scale-balanced",
            summary: "Cách xác định nhanh Chủ ngữ chính (bỏ qua cụm giới từ đứng giữa) để chia động từ số ít hay số nhiều chính xác tuyệt đối.",
            formulas: [
                {
                    rule: "1. Chủ ngữ kèm cụm giới từ (N1 + of/in/at/with + N2 + V)",
                    detail: "Động từ luôn chia theo danh từ đứng đầu (N1), hoàn toàn bỏ qua cụm giới từ bổ nghĩa ở giữa.",
                    suffixes: "The quality of the products [is] / The results of the survey [are]",
                    example: "A list of eligible candidates [was posted] on the bulletin board."
                },
                {
                    rule: "2. Phân biệt 'The number of' và 'A number of'",
                    detail: "'The number of + N_nhiều' (Con số của...) -> chia động từ SỐ ÍT. 'A number of + N_nhiều' (Nhiều...) -> chia động từ SỐ NHIỀU.",
                    suffixes: "The number of + N_s + V_ít  <=>  A number of + N_s + V_nhiều",
                    example: "The number of remote workers [has risen] significantly this year."
                },
                {
                    rule: "3. Cấu trúc Either...or / Neither...nor / Not only...but also",
                    detail: "Động từ chia theo chủ ngữ đứng gần nó nhất (S2). Riêng 'Each / Every / Anyone / Everyone / Someone' luôn chia động từ số ít.",
                    suffixes: "Neither S1 nor S2 + V(theo S2)  |  Each/Every + N_ít + V_ít",
                    example: "Every employee in the regional offices [is required] to attend."
                }
            ],
            questions: [
                {
                    q: "1. The installation of the new security cameras _______ scheduled to be completed by Wednesday afternoon.",
                    options: ["(A) are", "(B) were", "(C) is", "(D) have been"],
                    correctIndex: 2,
                    explanation: "Chủ ngữ chính là danh từ số ít 'The installation' (bỏ qua cụm giới từ 'of the new security cameras'), nên động từ chia số ít là (C) is."
                },
                {
                    q: "2. A number of shareholders _______ expressed concern about the proposed merger with Westlake Corp.",
                    options: ["(A) has", "(B) have", "(C) is", "(D) was"],
                    correctIndex: 1,
                    explanation: "'A number of + danh từ số nhiều' luôn đi với động từ chia số nhiều -> chọn (B) have."
                }
            ]
        },
        {
            id: "gram-04-gerunds",
            titleEn: "GERUNDS",
            titleVi: "DANH ĐỘNG TỪ",
            title: "GERUNDS — DANH ĐỘNG TỪ",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-circle-play",
            summary: "Danh động từ (V-ing) đóng vai trò làm Chủ ngữ, đứng sau Giới từ và đứng sau nhóm động từ đặc trưng trong tiếng Anh thương mại.",
            formulas: [
                {
                    rule: "1. V-ing đứng đầu câu làm Chủ ngữ & đứng sau mọi Giới từ",
                    detail: "Khi đứng đầu câu làm chủ ngữ, V-ing luôn đi kèm tân ngữ và chia động từ chính ở ngôi số ít. Sau giới từ (in, on, of, for, about, by, without, before, after) + V-ing + O.",
                    suffixes: "Preposition + V-ing + Object",
                    example: "Thank you for [participating] in our annual customer satisfaction survey."
                },
                {
                    rule: "2. Các động từ bắt buộc theo sau bởi V-ing trong TOEIC",
                    detail: "Cần thuộc lòng nhóm động từ + V-ing hay ra thi nhất.",
                    suffixes: "consider, suggest, recommend, avoid, postpone, delay, finish, discontinue + V-ing",
                    example: "Management is considering [relocating] the warehouse to a larger facility."
                },
                {
                    rule: "3. Các cụm có 'to' nhưng là Giới từ (+ V-ing)",
                    detail: "Đừng nhầm với To-V! Các cụm cố định này có 'to' là giới từ nên bắt buộc cộng V-ing.",
                    suffixes: "look forward to, be committed to, be dedicated to, object to, prior to, in addition to + V-ing",
                    example: "We look forward to [hearing] from you in the near future."
                }
            ],
            questions: [
                {
                    q: "1. Horizon Airlines is committed to _______ passengers with the highest standards of safety and comfort.",
                    options: ["(A) provide", "(B) provided", "(C) providing", "(D) provision"],
                    correctIndex: 2,
                    explanation: "Cấu trúc 'be committed to + V-ing' (cam kết làm gì) với 'to' là giới từ, và phía sau có tân ngữ 'passengers' -> chọn (C) providing."
                },
                {
                    q: "2. The committee suggested _______ the product launch until the market research is finalized.",
                    options: ["(A) postpone", "(B) to postpone", "(C) postponing", "(D) postponed"],
                    correctIndex: 2,
                    explanation: "Động từ 'suggest' khi không có mệnh đề 'that' sẽ đi trực tiếp với V-ing ('suggest postponing')."
                }
            ]
        },
        {
            id: "gram-05-infinitives",
            titleEn: "INFINITIVES",
            titleVi: "ĐỘNG TỪ NGUYÊN MẪU",
            title: "INFINITIVES — ĐỘNG TỪ NGUYÊN MẪU",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-arrow-Right-to-bracket",
            summary: "Cách dùng Động từ nguyên mẫu có 'to' (To-V) để chỉ mục đích, đứng sau động từ/tính từ và động từ nguyên mẫu không 'to' (Bare Infinitive).",
            formulas: [
                {
                    rule: "1. To-Infinitive chỉ mục đích (Để làm gì)",
                    detail: "Đứng đầu câu hoặc cuối câu hoàn chỉnh để chỉ mục đích (= In order to / So as to + V_inf).",
                    suffixes: "(In order) to + V_inf",
                    example: "[To register] for the seminar, please fill out the online form."
                },
                {
                    rule: "2. Nhóm Động từ + (Tân ngữ) + To-V",
                    detail: "Các động từ hoạch định, yêu cầu, cho phép trong TOEIC luôn đi với To-V.",
                    suffixes: "decide, plan, agree, offer, fail, promise + to V  |  allow, require, ask, remind, encourage + O + to V",
                    example: "All visitors are required [to wear] security badges inside the building."
                },
                {
                    rule: "3. Động từ nguyên mẫu không 'to' (Bare Infinitive)",
                    detail: "Đứng sau các động từ sai khiến (make, have, let + O + V_inf) và động từ 'help + O + (to) V_inf'.",
                    suffixes: "make / let / have + Someone + V_inf  (Nhưng nếu vật: have + Something + V3/ed)",
                    example: "The new software helps accountants [process] invoices twice as fast."
                }
            ],
            questions: [
                {
                    q: "1. _______ eligible for the employee wellness reimbursement, staff members must submit their gym receipts.",
                    options: ["(A) Be", "(B) To be", "(C) Being", "(D) Been"],
                    correctIndex: 1,
                    explanation: "Đứng đầu câu trước dấu phẩy để chỉ mục đích ('Để đủ điều kiện nhận hoàn tiền...') -> dùng 'To + V_inf' (To be)."
                },
                {
                    q: "2. City regulations require all restaurant owners _______ their health permits annually.",
                    options: ["(A) renew", "(B) renewing", "(C) to renew", "(D) renewed"],
                    correctIndex: 2,
                    explanation: "Cấu trúc 'require + O + to V_inf' (yêu cầu ai làm gì) -> chọn (C) to renew."
                }
            ]
        },
        {
            id: "gram-06-subjunctive-mood",
            titleEn: "SUBJUNCTIVE MOOD",
            titleVi: "THỨC GIẢ ĐỊNH",
            title: "SUBJUNCTIVE MOOD — THỨC GIẢ ĐỊNH",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 700 - 950+",
            icon: "fa-wand-magic-sparkles",
            summary: "Cấu trúc bàng thái cách (Subjunctive) yêu cầu động từ ở mệnh đề 'that' luôn ở dạng nguyên mẫu không chia thì, dù chủ ngữ là ngôi thứ 3 số ít.",
            formulas: [
                {
                    rule: "1. Thức giả định sau Động từ khuyên bảo, đề nghị, yêu cầu",
                    detail: "Sau that + S + (should) + V_nguyên_mẫu (Phủ định: not + V_inf; Bị động: be + V3/ed).",
                    suffixes: "suggest, recommend, request, require, ask, insist, demand + that + S + V_inf",
                    example: "The auditor recommended that the company [reduce] its operating expenses."
                },
                {
                    rule: "2. Thức giả định sau Tính từ cần thiết, cấp bách",
                    detail: "It is + Adj + that + S + (should) + V_nguyên_mẫu.",
                    suffixes: "essential, imperative, important, vital, necessary, mandatory + that + S + V_inf",
                    example: "It is imperative that every package [be inspected] before shipping."
                }
            ],
            questions: [
                {
                    q: "1. It is essential that every new employee _______ the cybersecurity training module during their first week.",
                    options: ["(A) completes", "(B) completed", "(C) complete", "(D) will complete"],
                    correctIndex: 2,
                    explanation: "Sau cấu trúc giả định 'It is essential that + S + V_inf', động từ giữ nguyên mẫu không thêm -s dù chủ ngữ là 'every new employee' -> chọn (C) complete."
                },
                {
                    q: "2. The safety inspector insisted that the faulty electrical wiring _______ immediately.",
                    options: ["(A) replace", "(B) is replaced", "(C) be replaced", "(D) replaced"],
                    correctIndex: 2,
                    explanation: "Sau 'insisted that', chủ ngữ 'the faulty electrical wiring' chịu tác động bị động -> dùng giả định bị động 'be + V3/ed' (be replaced)."
                }
            ]
        },
        {
            id: "gram-07-modal-verbs",
            titleEn: "MODAL VERBS",
            titleVi: "ĐỘNG TỪ KHUYẾT THIẾU",
            title: "MODAL VERBS — ĐỘNG TỪ KHUYẾT THIẾU",
            group: "Nhóm 1: Hệ thống Động từ",
            level: "Mục tiêu 500 - 800+",
            icon: "fa-key",
            summary: "Cách dùng các động từ khuyết thiếu (can, could, may, might, must, should, ought to, have to, would rather, had better) ở dạng chủ động, bị động và hoàn thành.",
            formulas: [
                {
                    rule: "1. Động từ khuyết thiếu ở Hiện tại / Tương lai",
                    detail: "Theo sau Modal Verb luôn là động từ nguyên mẫu không 'to'. Nếu bị động: Modal + be + V3/ed.",
                    suffixes: "can/could/may/might/must/should/had better + V_inf  |  Bị động: Modal + be + V3/ed",
                    example: "Applicants must [submit] their portfolios before the deadline."
                },
                {
                    rule: "2. Động từ khuyết thiếu ở Quá khứ (Modal Perfect)",
                    detail: "Should have + V3/ed (Đáng lẽ đã nên làm nhưng không làm). Must have + V3/ed (Chắc hẳn đã xảy ra). Could have + V3/ed (Đáng lẽ đã có thể).",
                    suffixes: "should / must / could / might + have + V3/ed",
                    example: "We [should have ordered] more inventory before the holiday season."
                }
            ],
            questions: [
                {
                    q: "1. Refunds _______ only be processed if the original receipt is presented within 30 days of purchase.",
                    options: ["(A) can", "(B) are", "(C) have", "(D) ought"],
                    correctIndex: 0,
                    explanation: "Phía sau chỗ trống có trạng từ 'only' và động từ nguyên mẫu bị động 'be processed' -> cần một Modal Verb là (A) can ('can only be processed')."
                },
                {
                    q: "2. Attendees had better _______ at the auditorium at least 15 minutes early to secure a seat.",
                    options: ["(A) arriving", "(B) arrive", "(C) to arrive", "(D) arrived"],
                    correctIndex: 1,
                    explanation: "Sau cụm bán khuyết thiếu 'had better' (nên làm gì) luôn là động từ nguyên mẫu không 'to' -> chọn (B) arrive."
                }
            ]
        },

        // ================= NHÓM 2: CÁC LOẠI CÂU & MỆNH ĐỀ (SENTENCES & CLAUSES) =================
        {
            id: "gram-08-passive-voice",
            titleEn: "PASSIVE VOICE",
            titleVi: "CÂU BỊ ĐỘNG",
            title: "PASSIVE VOICE — CÂU BỊ ĐỘNG",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 500 - 850+",
            icon: "fa-rotate",
            summary: "Kỹ thuật 3 giây phân biệt Chủ động và Bị động dựa vào Tân ngữ phía sau chỗ trống và danh sách các nội động từ không bao giờ chia bị động.",
            formulas: [
                {
                    rule: "1. Quy tắc 'Không Tân Ngữ -> Chia Bị Động'",
                    detail: "Với ngoại động từ (cần tân ngữ), nếu ngay sau chỗ trống là Giới từ (by, in, at, to, for, with...), Trạng từ hoặc Dấu chấm hết câu -> chia Bị động (be + V3/ed).",
                    suffixes: "S + be + V3/ed + (by/in/at/to/for...)",
                    example: "The annual shareholders' meeting [will be held] at the Grand Hotel."
                },
                {
                    rule: "2. Các Nội động từ KHÔNG BAO GIỜ chia Bị động trong TOEIC",
                    detail: "Dù không có tân ngữ phía sau, các động từ tự thân này luôn chia ở dạng Chủ động.",
                    suffixes: "arrive, occur, happen, take place,last, remain, exist, rise, emerge, expire",
                    example: "The warranty on this printer [expired] last month."
                }
            ],
            questions: [
                {
                    q: "1. All complimentary parking passes _______ by the human resources department on Monday morning.",
                    options: ["(A) distribute", "(B) will distribute", "(C) will be distributed", "(D) distributing"],
                    correctIndex: 2,
                    explanation: "Chủ ngữ 'parking passes' (thẻ đỗ xe) và phía sau có 'by the human resources department' -> chia Bị động tương lai: (C) will be distributed."
                },
                {
                    q: "2. Several power outages _______ across the northern district during last night's thunderstorm.",
                    options: ["(A) occurred", "(B) were occurred", "(C) have been occurred", "(D) occurring"],
                    correctIndex: 0,
                    explanation: "'occur' (xảy ra) là nội động từ nên không bao giờ chia bị động -> chọn Quá khứ đơn chủ động (A) occurred."
                }
            ]
        },
        {
            id: "gram-09-conditional-sentences",
            titleEn: "CONDITIONAL SENTENCES",
            titleVi: "CÂU ĐIỀU KIỆN",
            title: "CONDITIONAL SENTENCES — CÂU ĐIỀU KIỆN",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-code-branch",
            summary: "Hệ thống Câu điều kiện Loại 0, Loại 1, Loại 2, Loại 3 và các liên từ điều kiện thay thế cho 'If' (Unless, Provided that, As long as, In case).",
            formulas: [
                {
                    rule: "1. Điều kiện Loại 1 (Có thật ở hiện tại/tương lai)",
                    detail: "If + S + V(s/es) [Hiện tại đơn], S + will/can/may + V_inf (hoặc câu mệnh lệnh: Please + V_inf).",
                    suffixes: "If + HTĐ, S + will/can + V_inf / Please + V_inf",
                    example: "If the order [exceeds] $200, shipping will be free of charge."
                },
                {
                    rule: "2. Điều kiện Loại 2 & Loại 3 (Không có thật)",
                    detail: "Loại 2 (Trái với hiện tại): If + S + V2/ed (were), S + would/could + V_inf. Loại 3 (Trái với quá khứ): If + S + had + V3/ed, S + would/could have + V3/ed.",
                    suffixes: "Loại 2: If + V2, would V  |  Loại 3: If + had V3, would have V3",
                    example: "If we [had received] the parts earlier, we would have met the deadline."
                },
                {
                    rule: "3. Các từ nối thay thế 'If'",
                    detail: "Unless (= If...not: Trừ khi), Provided that / Providing that / As long as (Miễn là), In case / In the event that (Phòng khi).",
                    suffixes: "Unless / Provided that / As long as / Once + S + V",
                    example: "[Provided that] the weather remains clear, the tour will depart on time."
                }
            ],
            questions: [
                {
                    q: "1. If you _______ any technical difficulties with the new portal, please contact the IT help desk immediately.",
                    options: ["(A) experience", "(B) will experience", "(C) experienced", "(D) had experienced"],
                    correctIndex: 0,
                    explanation: "Mệnh đề chính là câu mệnh lệnh ('please contact...') -> Câu điều kiện loại 1, mệnh đề 'If' chia Hiện tại đơn: (A) experience."
                },
                {
                    q: "2. The contract will be renewed automatically next year _______ either party gives written notice 30 days in advance.",
                    options: ["(A) unless", "(B) despite", "(C) because of", "(D) otherwise"],
                    correctIndex: 0,
                    explanation: "Cần liên từ nối mệnh đề mang nghĩa 'trừ khi' -> chọn (A) unless."
                }
            ]
        },
        {
            id: "gram-10-reported-speech",
            titleEn: "REPORTED SPEECH",
            titleVi: "CÂU TƯỜNG THUẬT",
            title: "REPORTED SPEECH — CÂU TƯỜNG THUẬT",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 550 - 800+",
            icon: "fa-comment-dots",
            summary: "Quy tắc lùi thì trong câu tường thuật gián tiếp (said, told, announced, reported, asked, wondered) và cách phân biệt cách dùng 'say / tell / inform / notify'.",
            formulas: [
                {
                    rule: "1. Quy tắc Lùi thì khi Động từ tường thuật ở Quá khứ",
                    detail: "Khi động từ chính ở quá khứ (said, announced, stated, told), động từ trong mệnh đề phía sau lùi 1 bậc về quá khứ (will -> would, can -> could, V_ht -> V2/ed, V2 -> had V3).",
                    suffixes: "said/announced that + S + would/could/had V3...",
                    example: "The CEO announced that the company [would open] two new branches."
                },
                {
                    rule: "2. Phân biệt 'Say / Announce' vs. 'Tell / Inform / Notify / Assure'",
                    detail: "Say / Announce / Explain + that + S + V (KHÔNG có tân ngữ chỉ người đứng ngay sau). Tell / Inform / Notify / Assure + Someone (BẮT BUỘC có tân ngữ chỉ người) + that + S + V.",
                    suffixes: "inform/notify/assure + O(người) + that + S + V",
                    example: "Ms. Lee [notified] the clients that their orders had been shipped."
                }
            ],
            questions: [
                {
                    q: "1. The project coordinator _______ the team that the deadline for the design phase had been extended by one week.",
                    options: ["(A) said", "(B) informed", "(C) explained", "(D) announced"],
                    correctIndex: 1,
                    explanation: "Ngay sau chỗ trống có tân ngữ chỉ người 'the team' trước 'that'. Trong 4 đáp án, chỉ có 'inform + Someone + that' đi trực tiếp với tân ngữ chỉ người -> chọn (B) informed."
                },
                {
                    q: "2. During yesterday's press conference, the spokesperson stated that the new electric vehicle _______ available in June.",
                    options: ["(A) will be", "(B) would be", "(C) is", "(D) has been"],
                    correctIndex: 1,
                    explanation: "Động từ tường thuật ở quá khứ ('stated'), lùi thì từ 'will be' sang 'would be' -> chọn (B)."
                }
            ]
        },
        {
            id: "gram-11-tag-questions",
            titleEn: "TAG QUESTIONS",
            titleVi: "CÂU HỎI ĐUÔI",
            title: "TAG QUESTIONS — CÂU HỎI ĐUÔI",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 500 - 800+ (Rất quan trọng cho Listening Part 2)",
            icon: "fa-question",
            summary: "Cấu trúc Câu hỏi đuôi (Khẳng định - Phủ định) và mẹo trả lời câu hỏi đuôi trong TOEIC Listening Part 2 không bị bẫy Yes/No.",
            formulas: [
                {
                    rule: "1. Quy tắc đối lập 'Trước Khẳng định - Sau Phủ định'",
                    detail: "Vế chính khẳng định -> đuôi phủ định viết tắt (isn't it, don't you, haven't they, won't she). Vế chính phủ định (hoặc có never, seldom, rarely, hardly, little) -> đuôi khẳng định.",
                    suffixes: "S + V(+), trợ động từ + n't + Đại từ?  |  Let's..., shall we?",
                    example: "The quarterly sales report has been finalized, [hasn't it]?"
                },
                {
                    rule: "2. Mẹo trả lời Câu hỏi đuôi trong TOEIC Part 2",
                    detail: "Dù người hỏi dùng đuôi khẳng định hay phủ định, cứ có thông tin ĐÚNG sự thật thì trả lời 'Yes', SAI sự thật thì trả lời 'No'.",
                    suffixes: "You're attending the workshop, aren't you? -> Yes, I signed up yesterday.",
                    example: "Mr. Tanaka is in charge of marketing, [isn't he]?"
                }
            ],
            questions: [
                {
                    q: "1. You have already submitted the travel reimbursement form to human resources, _______?",
                    options: ["(A) don't you", "(B) didn't you", "(C) haven't you", "(D) aren't you"],
                    correctIndex: 2,
                    explanation: "Mệnh đề chính dùng thì Hiện tại hoàn thành khẳng định ('You have already submitted...'), nên phần đuôi lấy trợ động từ 'have' chuyển sang phủ định là (C) haven't you."
                },
                {
                    q: "2. The new warehouse rarely experiences inventory shortages, _______?",
                    options: ["(A) doesn't it", "(B) does it", "(C) isn't it", "(D) is it"],
                    correctIndex: 1,
                    explanation: "Trong câu chính có trạng từ mang nghĩa phủ định 'rarely' (hiếm khi) và động từ thường số ít 'experiences', nên câu hỏi đuôi phải ở dạng khẳng định là (B) does it."
                }
            ]
        },
        {
            id: "gram-12-relative-clauses",
            titleEn: "RELATIVE CLAUSES",
            titleVi: "MỆNH ĐỀ QUAN HỆ",
            title: "RELATIVE CLAUSES — MỆNH ĐỀ QUAN HỆ",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 650 - 950+",
            icon: "fa-diagram-project",
            summary: "Cách chọn đại từ quan hệ (who, whom, whose, which, that) và kỹ thuật rút gọn mệnh đề quan hệ dạng V-ing (chủ động) hoặc V3/ed (bị động).",
            formulas: [
                {
                    rule: "1. Đại từ quan hệ Who / Whom / Whose / Which / That",
                    detail: "Who + V (thay cho người làm chủ ngữ). Whom + S + V (thay cho người làm tân ngữ). Whose + Noun (chỉ sở hữu đứng giữa 2 danh từ). Which + V / S + V (thay cho vật).",
                    suffixes: "N(người) + who + V  |  N1 + whose + N2 + V  |  N(vật) + which + V",
                    example: "We are looking for candidates [whose] qualifications match our requirements."
                },
                {
                    rule: "2. Rút gọn Mệnh đề quan hệ Chủ động (V-ing) & Bị động (V3/ed)",
                    detail: "Khi câu đã có động từ chính: nếu hành động phụ mang nghĩa Chủ động (có tân ngữ theo sau) -> rút thành V-ing; nếu mang nghĩa Bị động (theo sau bởi giới từ) -> rút thành V3/ed.",
                    suffixes: "Noun + V-ing (Chủ động)  <=>  Noun + V3/ed (Bị động)",
                    example: "Products [purchased] online can be exchanged within 30 days."
                }
            ],
            questions: [
                {
                    q: "1. Customers _______ a defective item may request a full refund or an immediate replacement within 14 days.",
                    options: ["(A) receive", "(B) received", "(C) receiving", "(D) will receive"],
                    correctIndex: 2,
                    explanation: "Câu đã có động từ chính là 'may request'. Chỗ trống rút gọn mệnh đề quan hệ bổ nghĩa cho 'Customers' và có tân ngữ 'a defective item' -> rút gọn chủ động (C) receiving."
                },
                {
                    q: "2. Orion Tech is seeking a project manager _______ leadership experience includes overseeing international teams.",
                    options: ["(A) who", "(B) whom", "(C) whose", "(D) which"],
                    correctIndex: 2,
                    explanation: "Sau chỗ trống là cụm danh từ 'leadership experience' (kinh nghiệm lãnh đạo của người quản lý) -> dùng đại từ quan hệ sở hữu (C) whose."
                }
            ]
        },
        {
            id: "gram-13-types-of-clauses",
            titleEn: "TYPES OF CLAUSES",
            titleVi: "CÁC LOẠI MỆNH ĐỀ",
            title: "TYPES OF CLAUSES — CÁC LOẠI MỆNH ĐỀ",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 650 - 900+",
            icon: "fa-layer-group",
            summary: "Phân biệt Mệnh đề Danh từ (Noun Clauses: that, what, whether/if, whoever, whichever) và Mệnh đề Trạng ngữ (Adverbial Clauses) kèm rút gọn đồng chủ ngữ.",
            formulas: [
                {
                    rule: "1. Mệnh đề Danh từ (Noun Clauses): What vs. That",
                    detail: "'That + S + V + O' (mệnh đề sau that đã đầy đủ thành phần). 'What + V' hoặc 'What + S + V(thiếu O)' (= the thing that: thứ mà...).",
                    suffixes: "whether/if (liệu rằng)  |  what (điều mà)  |  whoever (bất kỳ ai mà)",
                    example: "Please let us know [whether] you will be able to attend the banquet."
                },
                {
                    rule: "2. Rút gọn Mệnh đề Trạng ngữ đồng chủ ngữ",
                    detail: "Sau When, While, Before, After, Once, If, Unless, Although: nếu 2 vế cùng chủ ngữ, có thể lược bỏ chủ ngữ và rút thành V-ing (chủ động) hoặc V3/ed (bị động).",
                    suffixes: "When/While/Once/If + V-ing (chủ động) / V3/ed (bị động)",
                    example: "Once [approved] by the director, the budget will be implemented."
                }
            ],
            questions: [
                {
                    q: "1. _______ is selected as the new regional manager will be responsible for overseeing five retail branches.",
                    options: ["(A) Who", "(B) Whoever", "(C) Whom", "(D) Whomever"],
                    correctIndex: 1,
                    explanation: "Cần một đại từ làm chủ ngữ cho cả động từ phụ 'is selected' và động từ chính 'will be responsible' (= Anyone who) -> chọn (B) Whoever."
                },
                {
                    q: "2. When _______ the laboratory, all technicians must wear protective goggles and lab coats.",
                    options: ["(A) enter", "(B) entered", "(C) entering", "(D) to enter"],
                    correctIndex: 2,
                    explanation: "Rút gọn mệnh đề trạng ngữ đồng chủ ngữ ('all technicians') mang nghĩa chủ động có tân ngữ 'the laboratory' -> 'When entering'."
                }
            ]
        },
        {
            id: "gram-14-inversion",
            titleEn: "INVERSION",
            titleVi: "ĐẢO NGỮ",
            title: "INVERSION — ĐẢO NGỮ",
            group: "Nhóm 2: Các loại Câu & Mệnh đề",
            level: "Mục tiêu 750 - 990",
            icon: "fa-shuffle",
            summary: "Đảo ngữ câu điều kiện (Should / Were / Had đứng đầu câu) và đảo ngữ khi các trạng từ phủ định/giới hạn (Never, Rarely, Seldom, Not only, Only after) đứng đầu câu.",
            formulas: [
                {
                    rule: "1. Đảo ngữ Câu điều kiện Loại 1, 2, 3 (Rất hay gặp trong Email TOEIC)",
                    detail: "Loại 1: Should + S + V_inf (= If + S + should + V). Loại 2: Were + S + to V / Adj. Loại 3: Had + S + (not) + V3/ed.",
                    suffixes: "Should you have any questions...  |  Had we known earlier...",
                    example: "[Should] you require further assistance, please contact our support team."
                },
                {
                    rule: "2. Đảo ngữ với Trạng từ phủ định đứng đầu câu",
                    detail: "Khi Never, Rarely, Seldom, Hardly, Scarcely, Not only, Under no circumstances đứng đầu câu -> đảo trợ động từ lên trước chủ ngữ: Trợ động từ + S + V.",
                    suffixes: "Not only + Aux + S + V, but... also...",
                    example: "Not only [did the company exceed] its sales target, but it also won an award."
                }
            ],
            questions: [
                {
                    q: "1. _______ you need to reschedule your dental appointment, please notify our clinic at least 24 hours in advance.",
                    options: ["(A) Unless", "(B) Should", "(C) Were", "(D) Had"],
                    correctIndex: 1,
                    explanation: "Đảo ngữ câu điều kiện loại 1 kết hợp câu mệnh lệnh ('please notify...'): 'Should + S + V_inf (need)'."
                },
                {
                    q: "2. _______ the shipment arrived on time, the production line would not have been halted yesterday.",
                    options: ["(A) Should", "(B) Were", "(C) Had", "(D) If"],
                    correctIndex: 2,
                    explanation: "Mệnh đề chính có 'would not have been halted' (điều kiện loại 3), vế đầu đảo trợ động từ 'Had' lên trước chủ ngữ ('Had the shipment arrived')."
                }
            ]
        },

        // ================= NHÓM 3: TỪ LOẠI & CẤU TRÚC (PARTS OF SPEECH & STRUCTURES) =================
        {
            id: "gram-15-articles",
            titleEn: "ARTICLES",
            titleVi: "MẠO TỪ",
            title: "ARTICLES — MẠO TỪ",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 450 - 750+",
            icon: "fa-font",
            summary: "Cách dùng mạo từ bất định (a / an), mạo từ xác định (the) và quy tắc Danh từ đếm được số ít không bao giờ được đứng trơ trọi một mình.",
            formulas: [
                {
                    rule: "1. Quy tắc Vàng của Danh từ đếm được số ít",
                    detail: "Danh từ đếm được số ít (như employee, contract, representative, discount) BẮT BUỘC phải có từ hạn định đứng trước (a/an/the/my/this/each) hoặc phải thêm -s.",
                    suffixes: "a + phụ âm (a university, a European...)  |  an + nguyên âm (an hour, an update)",
                    example: "We offer [a] 10% discount to all first-time customers."
                },
                {
                    rule: "2. Khi nào bắt buộc dùng 'The'",
                    detail: "Dùng 'the' trước danh từ đã xác định, trước So sánh nhất (the most, the best), Số thứ tự (the first, the second) và cấu trúc 'The + N1 + of + N2'.",
                    suffixes: "the + superlative  |  the + N1 + of + N2",
                    example: "[The] expansion of the railway network will reduce commuting time."
                }
            ],
            questions: [
                {
                    q: "1. Customers who sign up for _______ annual membership will receive two complimentary training sessions.",
                    options: ["(A) a", "(B) an", "(C) those", "(D) many"],
                    correctIndex: 1,
                    explanation: "'membership' là danh từ đếm được số ít, đứng trước là tính từ 'annual' bắt đầu bằng âm nguyên âm /æ/ -> dùng mạo từ (B) an."
                },
                {
                    q: "2. Please send the signed agreement to _______ human resources department before Friday.",
                    options: ["(A) a", "(B) an", "(C) the", "(D) some"],
                    correctIndex: 2,
                    explanation: "Phòng nhân sự ('human resources department') trong công ty là đối tượng đã xác định rõ ràng giữa người nói và người nghe -> dùng (C) the."
                }
            ]
        },
        {
            id: "gram-16-prepositions",
            titleEn: "PREPOSITIONS",
            titleVi: "GIỚI TỪ",
            title: "PREPOSITIONS — GIỚI TỪ",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 500 - 850+",
            icon: "fa-map-pin",
            summary: "Cách dùng giới từ chỉ thời gian (in, on, at, by, until, during, within, throughout), giới từ nơi chốn và các cụm giới từ thương mại cố định.",
            formulas: [
                {
                    rule: "1. Phân biệt 'By' (Muộn nhất là) vs. 'Until' (Cho đến tận)",
                    detail: "'By + mốc thời gian' đi với hành động hoàn tất tại 1 điểm (submit, complete, finish, notify). 'Until + mốc thời gian' đi với hành động kéo dài liên tục (remain, wait, stay, be valid).",
                    suffixes: "submit/finish + BY Friday  <=>  remain open/valid + UNTIL Friday",
                    example: "This promotional voucher is valid [until] December 31."
                },
                {
                    rule: "2. Phân biệt 'During / For / Within / Throughout'",
                    detail: "During + N (trong suốt kỳ/buổi). For + khoảng thời gian có số đếm (for 3 weeks). Within + khoảng thời gian (trong vòng...). Throughout + N (khắp nơi / suốt cả năm).",
                    suffixes: "within 24 hours  |  throughout the year  |  prior to (= before)",
                    example: "All online orders are shipped [within] two business days."
                }
            ],
            questions: [
                {
                    q: "1. All applications for the management trainee program must be submitted _______ October 15 at the latest.",
                    options: ["(A) until", "(B) by", "(C) during", "(D) for"],
                    correctIndex: 1,
                    explanation: "Động từ 'submitted' (nộp - hành động chốt hạn) kèm 'at the latest' (muộn nhất là) luôn đi với giới từ chỉ hạn chót (B) by."
                },
                {
                    q: "2. Free Wi-Fi access is available _______ the entire convention center for all registered guests.",
                    options: ["(A) throughout", "(B) among", "(C) between", "(D) during"],
                    correctIndex: 0,
                    explanation: "'throughout the entire convention center' = ở khắp toàn bộ trung tâm hội nghị -> chọn (A) throughout."
                }
            ]
        },
        {
            id: "gram-17-conjunctions",
            titleEn: "CONJUNCTIONS",
            titleVi: "LIÊN TỪ",
            title: "CONJUNCTIONS — LIÊN TỪ",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 600 - 900+",
            icon: "fa-link",
            summary: "Phân biệt Liên từ kết hợp (FANBOYS), Liên từ tương quan (both...and, either...or, neither...nor, not only...but also) và Liên từ phụ thuộc vs. Giới từ.",
            formulas: [
                {
                    rule: "1. Liên từ Tương quan (Correlative Conjunctions)",
                    detail: "Nhìn phía sau có từ khóa cặp đôi để chọn ngay từ phía trước trong 2 giây.",
                    suffixes: "both A and B  |  either A or B  |  neither A nor B  |  not only A but (also) B  |  whether A or B",
                    example: "The workshop is designed for [both] beginners [and] experienced designers."
                },
                {
                    rule: "2. Liên từ (+ S + V) vs. Giới từ (+ Cụm danh từ)",
                    detail: "Mặc dù: Although / Even though / Though (+ S + V) <=> Despite / In spite of (+ N). Bởi vì: Because / Since / As / Now that (+ S + V) <=> Because of / Due to / Owing to (+ N).",
                    suffixes: "Although + S + V  <=>  Despite + Noun/V-ing",
                    example: "[Although] the budget was limited, the team delivered outstanding results."
                }
            ],
            questions: [
                {
                    q: "1. _______ the rising cost of raw materials, Apex Furniture has decided not to increase its retail prices this year.",
                    options: ["(A) Although", "(B) Despite", "(C) Because", "(D) Even though"],
                    correctIndex: 1,
                    explanation: "'the rising cost of raw materials' là một Cụm danh từ (không có động từ chia thì), nên cần một Giới từ. Chọn (B) Despite (= Mặc dù)."
                },
                {
                    q: "2. Neither the marketing director _______ the sales manager was able to attend yesterday's product briefing.",
                    options: ["(A) or", "(B) nor", "(C) and", "(D) but"],
                    correctIndex: 1,
                    explanation: "Cấu trúc liên từ tương quan 'Neither A nor B' (Cả A và B đều không) -> chọn (B) nor."
                }
            ]
        },
        {
            id: "gram-18-comparisons",
            titleEn: "DEGREES OF COMPARISON",
            titleVi: "CÁC CẤP SO SÁNH",
            title: "DEGREES OF COMPARISON — CÁC CẤP SO SÁNH",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-chart-simple",
            summary: "So sánh bằng (as...as), So sánh hơn (-er/more...than), So sánh nhất (the -est/most), So sánh kép (The more..., the more...) và các trạng từ nhấn mạnh so sánh hơn.",
            formulas: [
                {
                    rule: "1. Dấu hiệu nhận biết So sánh bằng, So sánh hơn & So sánh nhất",
                    detail: "Có 'as + Adj/Adv + as' -> So sánh bằng. Có 'than' -> So sánh hơn (Adj-er / more + Adj/Adv). Có 'the' đứng trước + 'in/of/ever' phía sau -> So sánh nhất.",
                    suffixes: "as + Adj/Adv + as  |  more... than  |  the most + Adj/Adv",
                    example: "The new processor operates [more efficiently] than the previous model."
                },
                {
                    rule: "2. Các từ nhấn mạnh đứng trước So sánh hơn (Rất hay ra thi Part 5)",
                    detail: "Để nhấn mạnh mức độ 'hơn nhiều lần', người ta đặt much, far, even, a lot, значительно (significantly, considerably, substantially) ngay trước cụm so sánh hơn.",
                    suffixes: "much / far / even / significantly / considerably + So sánh hơn",
                    example: "Third-quarter profits were [significantly] higher than analysts had predicted."
                }
            ],
            questions: [
                {
                    q: "1. The updated accounting software processes payroll data much _______ than the legacy system did.",
                    options: ["(A) quick", "(B) quickly", "(C) quicker", "(D) more quickly"],
                    correctIndex: 3,
                    explanation: "Có từ nhấn mạnh 'much' và từ 'than' phía sau, đồng thời cần bổ nghĩa cho động từ thường 'processes' -> dùng trạng từ so sánh hơn: (D) more quickly."
                },
                {
                    q: "2. Metro Bank offers some of the _______ interest rates for small business loans in the region.",
                    options: ["(A) competitive", "(B) more competitive", "(C) most competitive", "(D) competitively"],
                    correctIndex: 2,
                    explanation: "Trước chỗ trống có 'some of the' và cuối câu có 'in the region' -> dùng So sánh nhất: (C) most competitive."
                }
            ]
        },
        {
            id: "gram-19-order-of-adjectives",
            titleEn: "ORDER OF ADJECTIVES",
            titleVi: "TRẬT TỰ TÍNH TỪ",
            title: "ORDER OF ADJECTIVES — TRẬT TỰ TÍNH TỪ",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 550 - 850+",
            icon: "fa-arrow-down-a-z",
            summary: "Quy tắc sắp xếp các tính từ đứng trước danh từ theo công thức OSASCOMP và cách phân biệt Tính từ đuôi -ing (bản chất) với đuôi -ed (cảm xúc).",
            formulas: [
                {
                    rule: "1. Quy tắc OSASCOMP khi ghép nhiều tính từ trước danh từ",
                    detail: "Opinion (Ý kiến: beautiful, reliable) -> Size (Kích cỡ: large, compact) -> Age (Tuổi: new, antique) -> Shape -> Color -> Origin (Xuất xứ: Japanese) -> Material (Chất liệu: wooden, leather) -> Purpose + Noun.",
                    suffixes: "Opinion -> Size -> Age -> Color -> Origin -> Material + Noun",
                    example: "The CEO bought a [sleek new Italian leather] briefcase."
                },
                {
                    rule: "2. Phân biệt Tính từ Phân từ đuôi -ING và đuôi -ED",
                    detail: "Bổ nghĩa cho Vật/Sự việc/Bản chất: dùng V-ing (interesting, exciting,existing, remaining, leading, demanding). Chỉ cảm xúc của Người hoặc bị tác động: dùng V3/ed (interested, excited, satisfied, pleased, attached, enclosed).",
                    suffixes: "an [existing] policy, the [remaining] balance  <=>  [satisfied] customers, the [attached] file",
                    example: "Please review the [attached] document for further details."
                }
            ],
            questions: [
                {
                    q: "1. All _______ balance on your corporate credit card must be paid in full by the end of the billing cycle.",
                    options: ["(A) remain", "(B) remained", "(C) remaining", "(D) remainder"],
                    correctIndex: 2,
                    explanation: "Cần một tính từ đứng trước danh từ 'balance' (số dư còn lại). 'remain' là nội động từ nên luôn dùng phân từ hiện tại 'remaining' làm tính từ ('remaining balance')."
                },
                {
                    q: "2. The conference room was furnished with a _______ table to accommodate twenty executives.",
                    options: ["(A) wooden large conference", "(B) large wooden conference", "(C) conference large wooden", "(D) large conference wooden"],
                    correctIndex: 1,
                    explanation: "Theo trật tự OSASCOMP: Size (large) -> Material (wooden) -> Purpose (conference) + Noun (table) -> chọn (B)."
                }
            ]
        },
        {
            id: "gram-20-word-formation",
            titleEn: "WORD FORMATION",
            titleVi: "CẤU TẠO TỪ",
            title: "WORD FORMATION — CẤU TẠO TỪ",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 500 - 900+ (Chiếm 25% câu hỏi Part 5)",
            icon: "fa-shapes",
            summary: "Hệ thống 4 bài học Word Formation theo từng từ loại: (1) Danh từ — hậu tố, bẫy đuôi -al/-ive/-ant & cụm danh từ, (2) Tính từ — hậu tố, bẫy -ly & phân từ V-ing/V-ed, (3) Trạng từ — hậu tố -ly & cặp bẫy, (4) Động từ — hậu tố -ate & cấu trúc giả định/bị động.",
            formulas: [
                {
                    rule: "Bài 1: Danh từ — Hậu tố, Bẫy đuôi từ & Cụm danh từ",
                    detail: "Nhận diện hậu tố Danh từ (-tion, -ment, -ity...), 3 bẫy đuôi (-al, -ive, -ant/-ent), danh từ ghép, cặp người/vật, không đếm được và V-ing + O vs N + giới từ.",
                    suffixes: "-tion/-ment | bẫy -al/-ive/-ant | a/the/giới từ + N | V-ing + O vs N + prep",
                    example: "The board gave final [approval] for the customer satisfaction [proposal]."
                },
                {
                    rule: "Bài 2: Tính từ — Hậu tố, Bẫy -ly & Phân từ (V-ing / V-ed)",
                    detail: "Nhận diện hậu tố (-able, -ive, -al...), cảnh giác tính từ đuôi -ly (costly, timely), cấu trúc vàng V + O + Adj (make/keep/find), phân biệt V-ing/V-ed và cặp Adj dễ nhầm.",
                    suffixes: "-able/-ive/-al | bẫy -ly (timely) | Linking V + Adj | make/keep/find + O + Adj",
                    example: "Regular updates keep our clients [informed] about the [revised] policy."
                },
                {
                    rule: "Bài 3: Trạng từ — Hậu tố -ly & Cặp trạng từ gây bẫy",
                    detail: "Nhận diện hậu tố Adj + -ly, 5 vị trí ăn điểm nhanh của Trạng từ và phân biệt 9 cặp bẫy nghĩa (hard/hardly, late/lately, near/nearly, high/highly, short/shortly...).",
                    suffixes: "Adj + -ly | Adv, S + V | aux/be/have + Adv + V | Adv + Adj/giới từ",
                    example: "The consultant is [highly] qualified and [closely] monitors every deadline."
                },
                {
                    rule: "Bài 4: Động từ — Hậu tố -ate & Cấu trúc trong Word Form",
                    detail: "Nhận diện hậu tố (-ize, -ify, -en, -ate) và bẫy -ate (V/Adj/N); kiểm tra động từ chính chia thì, V0 sau modal/to/giả định, bẫy bị động be + (Adv) + V3/ed và rút gọn MĐQH.",
                    suffixes: "-ize/-ify/-en/-ate | S + V chính | modal/to + V0 | suggest/require + that + S + V0",
                    example: "Company policy requires that every visitor [sign] in at the reception desk."
                }
            ],
            practiceQuestionsByType: wordFormationQuestionBank,
            practiceModes: {
                fillWord: [
                    {
                        prompt: "The updated process has improved the _______ of the laboratory equipment.",
                        cue: "RELY",
                        answer: "reliability",
                        wordType: "noun",
                        explanation: "Sau mạo từ 'the' và trước cụm 'of the laboratory equipment' cần danh từ. RELY → reliability."
                    },
                    {
                        prompt: "The regional manager will _______ the new safety procedures next week.",
                        cue: "IMPLEMENT",
                        answer: "implement",
                        wordType: "verb",
                        explanation: "Sau modal 'will' dùng động từ nguyên mẫu. Đáp án: implement."
                    },
                    {
                        prompt: "Customers praised the staff for their _______ service.",
                        cue: "PROFESSION",
                        answer: "professional",
                        wordType: "adjective",
                        explanation: "Chỗ trống đứng trước danh từ 'service' nên cần tính từ. Đáp án: professional."
                    },
                    {
                        prompt: "The shipment was delivered _______ despite the severe weather.",
                        cue: "SAFE",
                        answer: "safely",
                        wordType: "adverb",
                        explanation: "Từ cần điền bổ nghĩa cho động từ 'delivered' nên dùng trạng từ. SAFE → safely."
                    }
                ],
                fillParagraph: [
                    {
                        intro: "Hoàn thành đoạn văn bằng cách biến đổi từ gợi ý trong ngoặc.",
                        wordType: "mixed",
                        parts: [
                            "To improve customer service, the company is reviewing each ",
                            " for the new support position. Applicants must communicate ",
                            " and demonstrate ",
                            " when handling account information."
                        ],
                        blanks: [
                            { cue: "APPLY", answer: "application", explanation: "Sau 'each' cần danh từ số ít: application." },
                            { cue: "EFFECTIVE", answer: "effectively", explanation: "Bổ nghĩa cho động từ 'communicate' nên dùng trạng từ: effectively." },
                            { cue: "RELY", answer: "reliability", explanation: "Sau 'demonstrate' cần danh từ làm tân ngữ: reliability." }
                        ]
                    },
                    {
                        intro: "Điền dạng đúng của từ trong ngoặc để hoàn chỉnh thông báo tuyển dụng.",
                        wordType: "mixed",
                        parts: [
                            "The ideal candidate will work ",
                            " with the sales team and prepare ",
                            " reports. Previous ",
                            " in a similar role is preferred."
                        ],
                        blanks: [
                            { cue: "CLOSE", answer: "closely", explanation: "Bổ nghĩa cho động từ 'work' nên dùng trạng từ: closely." },
                            { cue: "WEEK", answer: "weekly", explanation: "Bổ nghĩa cho danh từ 'reports' nên dùng tính từ: weekly." },
                            { cue: "EXPERIENCE", answer: "experience", explanation: "Sau tính từ 'previous' cần danh từ: experience." }
                        ]
                    }
                ],
                sentenceOrder: [
                    {
                        instruction: "Sắp xếp các từ để tạo thành câu đúng.",
                        wordType: "adverb",
                        tokens: ["accurately", "the", "report", "new", "assistant", "completed", "the"],
                        answer: "The new assistant completed the report accurately."
                    },
                    {
                        instruction: "Sắp xếp các từ để tạo thành câu đúng.",
                        wordType: "adjective",
                        tokens: ["highly", "the", "proposal", "was", "effective"],
                        answer: "The proposal was highly effective."
                    },
                    {
                        instruction: "Sắp xếp các từ để tạo thành câu đúng.",
                        wordType: "noun",
                        tokens: ["the", "carefully", "reviewed", "manager", "application", "each"],
                        answer: "The manager carefully reviewed each application."
                    },
                    {
                        instruction: "Sắp xếp các từ để tạo thành câu đúng.",
                        wordType: "verb",
                        tokens: ["will", "the", "manager", "review", "proposal", "the"],
                        answer: "The manager will review the proposal."
                    }
                ]
            },
            questions: []
        },
        {
            id: "gram-21-quantifiers",
            titleEn: "QUANTIFIERS",
            titleVi: "TỪ CHỈ SỐ LƯỢNG",
            title: "QUANTIFIERS — TỪ CHỈ SỐ LƯỢNG",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 500 - 850+",
            icon: "fa-cubes-stacked",
            summary: "Cách phân biệt từ chỉ số lượng đi với Danh từ đếm được số nhiều (many, few, several, both), Danh từ không đếm được (much, little, a great deal of) và nhóm đi với danh từ số ít (each, every, another).",
            formulas: [
                {
                    rule: "1. Nhóm đi với Danh từ Đếm được số nhiều vs. Không đếm được",
                    detail: "Đếm được số nhiều (+ N_s): many, a few / few, several, a number of, both, a variety of. Không đếm được (+ N_không đếm được): much, a little / little, a great deal of, a large amount of.",
                    suffixes: "several / a few + N_s  <=>  a little / much + N_không đếm được",
                    example: "We received [several] inquiries regarding the new insurance policy."
                },
                {
                    rule: "2. Phân biệt 'Other / Another / The other / Others'",
                    detail: "Another + N_đếm được số ít (hoặc Another + số đếm + N_nhiều: another 3 days). Other + N_nhiều / N_không đếm được. Others đứng một mình làm đại từ (= other + N_nhiều).",
                    suffixes: "another + N_ít  |  other + N_s  |  most + N  <=>  most of the/my + N",
                    example: "We need [another] week to finalize the architectural blueprints."
                }
            ],
            questions: [
                {
                    q: "1. _______ of the participants at the leadership seminar expressed interest in the advanced coaching program.",
                    options: ["(A) Almost", "(B) Most", "(C) Every", "(D) Another"],
                    correctIndex: 1,
                    explanation: "Trước 'of the + danh từ số nhiều' dùng 'Most' ('Most of the participants'). 'Almost' là trạng từ không đi trực tiếp với 'of' (phải là 'Almost all of...')."
                },
                {
                    q: "2. If this model is out of stock, our sales associate will gladly show you _______ option.",
                    options: ["(A) other", "(B) others", "(C) another", "(D) several"],
                    correctIndex: 2,
                    explanation: "Phía sau chỗ trống là danh từ đếm được số ít 'option' -> chọn (C) another."
                }
            ]
        },
        {
            id: "gram-22-comprehensive-structures",
            titleEn: "COMPREHENSIVE STRUCTURES",
            titleVi: "CẤU TRÚC TỔNG HỢP",
            title: "COMPREHENSIVE STRUCTURES — CẤU TRÚC TỔNG HỢP",
            group: "Nhóm 3: Từ loại & Cấu trúc",
            level: "Mục tiêu 650 - 990",
            icon: "fa-compass-drafting",
            summary: "Tổng hợp các cấu trúc câu song song (Parallelism), cấu trúc quá...đến nỗi (so...that / such...that / too...to / enough to) và các cấu trúc thương mại xuất hiện dày đặc trong TOEIC.",
            formulas: [
                {
                    rule: "1. Cấu trúc Song song (Parallel Structure)",
                    detail: "Các thành phần nối với nhau bằng 'and, or, but, as well as, rather than' phải đồng dạng từ loại (N and N; V-ing and V-ing; To-V and (to) V; Adv and Adv).",
                    suffixes: "A, B, and C (cùng từ loại / cùng dạng động từ)",
                    example: "The position requires [drafting] contracts, [reviewing] budgets, and [negotiating] with vendors."
                },
                {
                    rule: "2. Cấu trúc 'So...that / Such...that / Too...to / Enough to'",
                    detail: "So + Adj/Adv + that + S + V. Such + (a/an) + Adj + Noun + that + S + V. Too + Adj/Adv + (for O) + to V (quá...để có thể). Adj/Adv + enough + to V (đủ...để làm gì).",
                    suffixes: "so + Adj + that  |  such + (a) + Adj + N + that  |  Adj + enough + to V",
                    example: "The seminar was [so informative that] attendees requested a follow-up session."
                }
            ],
            questions: [
                {
                    q: "1. The human resources manager is responsible for recruiting new staff, organizing training sessions, and _______ employee performance.",
                    options: ["(A) evaluate", "(B) evaluated", "(C) evaluating", "(D) evaluation"],
                    correctIndex: 2,
                    explanation: "Cấu trúc song song nối bằng 'and' sau giới từ 'for': recruiting..., organizing..., and [evaluating]..."
                },
                {
                    q: "2. The conference hall is large _______ to accommodate up to 500 international delegates comfortably.",
                    options: ["(A) too", "(B) so", "(C) such", "(D) enough"],
                    correctIndex: 3,
                    explanation: "Đứng sau tính từ 'large' và trước 'to accommodate' là cấu trúc 'Adj + enough + to V_inf' (đủ rộng để chứa...) -> chọn (D) enough."
                }
            ]
        }
    ]
};
