/**
 * KAI TOEIC - BÀI GIẢNG CHI TIẾT 22 CHUYÊN ĐỀ NGỮ PHÁP TOEIC
 * Mỗi bài gồm: Giới thiệu, Lý thuyết (kèm bảng), Bẫy thường gặp trong đề ETS, Mẹo làm bài.
 * Khóa (key) trùng với id của grammarTopics trong data.js
 */
window.GRAMMAR_LECTURES = {
    // ======================= 01. VERB TENSES =======================
    "gram-01-verb-tenses": {
        intro: "Thì động từ cho biết hành động xảy ra khi nào và trạng thái của nó (đang diễn ra, đã hoàn tất...). Trong TOEIC, câu hỏi về thì gần như luôn có 'dấu hiệu thời gian' trong câu – nhiệm vụ của bạn là tìm ra dấu hiệu đó.",
        sections: [
            {
                heading: "1. Bảng công thức 12 thì (trọng tâm 8 thì in đậm hay thi)",
                table: {
                    head: ["Thì", "Khẳng định", "Dấu hiệu nhận biết"],
                    rows: [
                        ["**Hiện tại đơn**", "S + V(s/es)", "every, usually, often, annually, regularly"],
                        ["**Hiện tại tiếp diễn**", "S + am/is/are + V-ing", "now, currently, at the moment, this week"],
                        ["**Hiện tại hoàn thành**", "S + have/has + V3", "since, for, recently, already, yet, so far, over the past + time"],
                        ["Hiện tại HT tiếp diễn", "S + have/has been + V-ing", "for + time, all day (nhấn mạnh tính liên tục)"],
                        ["**Quá khứ đơn**", "S + V2/ed", "yesterday, ago, last + time, in + năm quá khứ"],
                        ["**Quá khứ tiếp diễn**", "S + was/were + V-ing", "when + QKĐ, while, at 9 a.m. yesterday"],
                        ["**Quá khứ hoàn thành**", "S + had + V3", "before/by the time + QKĐ, after"],
                        ["Quá khứ HT tiếp diễn", "S + had been + V-ing", "for + time + before + QKĐ"],
                        ["**Tương lai đơn**", "S + will + V", "tomorrow, next + time, soon, upcoming"],
                        ["Tương lai tiếp diễn", "S + will be + V-ing", "at this time tomorrow"],
                        ["**Tương lai hoàn thành**", "S + will have + V3", "by + mốc tương lai, by the time + HTĐ"],
                        ["Tương lai HT tiếp diễn", "S + will have been + V-ing", "by + time + for + khoảng thời gian"]
                    ]
                }
            },
            {
                heading: "2. Cách dùng đặc biệt hay gặp trong TOEIC",
                points: [
                    "Hiện tại đơn diễn tả LỊCH TRÌNH cố định trong tương lai: The train <b>leaves</b> at 8 a.m. tomorrow.",
                    "Hiện tại tiếp diễn diễn tả KẾ HOẠCH đã sắp xếp: We <b>are meeting</b> the client on Friday.",
                    "Hiện tại hoàn thành nhấn mạnh KẾT QUẢ còn liên quan đến hiện tại: The report <b>has been submitted</b>.",
                    "Không dùng thì tiếp diễn với động từ trạng thái: know, believe, own, belong, need, prefer, seem, consist."
                ]
            }
        ],
        traps: [
            "Thấy 'since' nhưng câu có mốc quá khứ đã kết thúc ở vế chính → kiểm tra kỹ, vế chứa 'since + mốc' thì vế chính chia HTHT.",
            "'Recently' có thể đi với cả Quá khứ đơn và HTHT – hãy chọn đáp án đúng về dạng (chủ động/bị động) trước.",
            "Đáp án dạng V-ing đứng một mình (không có be) không bao giờ là động từ chính của câu."
        ],
        tips: [
            "Bước 1: Xác định chỗ trống có phải động từ chính không. Bước 2: Chủ động/bị động. Bước 3: Số ít/số nhiều. Bước 4: Dấu hiệu thời gian.",
            "Loại trừ nhanh: nếu chủ ngữ số ít, loại ngay các đáp án 'have/are/were'."
        ]
    },

    // ======================= 02. SEQUENCE OF TENSES =======================
    "gram-02-sequence-of-tenses": {
        intro: "Sự phối thì là sự hòa hợp về thời gian giữa mệnh đề chính và mệnh đề phụ. TOEIC tập trung vào mệnh đề trạng ngữ chỉ thời gian và câu có 'since', 'by the time'.",
        sections: [
            {
                heading: "1. Mệnh đề thời gian ở tương lai – KHÔNG dùng 'will'",
                points: [
                    "Liên từ: when, before, after, as soon as, until, once, by the time, while.",
                    "Công thức: Liên từ + S + V(hiện tại đơn / HTHT), S + will + V.",
                    "Ví dụ: Once the contract <b>is signed</b>, we <b>will begin</b> production."
                ]
            },
            {
                heading: "2. Bảng phối thì thường gặp",
                table: {
                    head: ["Mệnh đề phụ", "Mệnh đề chính", "Ví dụ"],
                    rows: [
                        ["When + HTĐ", "will + V", "When she arrives, I will call you."],
                        ["When + QKĐ", "QKĐ / QKTD / QKHT", "When I arrived, the meeting had started."],
                        ["Since + QKĐ", "HTHT", "He has worked here since he graduated."],
                        ["By the time + HTĐ", "will have + V3", "By the time you come, we will have left."],
                        ["By the time + QKĐ", "had + V3", "By the time he called, I had finished."],
                        ["After + QKHT", "QKĐ", "After she had reviewed it, she signed it."],
                        ["Before + QKĐ", "QKHT", "The staff had left before the alarm rang."]
                    ]
                }
            },
            {
                heading: "3. Phối thì với động từ chính ở quá khứ",
                points: [
                    "Nếu động từ chính ở quá khứ (said, announced, thought, knew), mệnh đề 'that' thường lùi thì: will → would, can → could.",
                    "Ngoại lệ: chân lý, sự thật hiển nhiên giữ nguyên hiện tại đơn."
                ]
            }
        ],
        traps: [
            "Đáp án 'will + V' sau 'as soon as/once/when' (nghĩa tương lai) là đáp án bẫy phổ biến nhất.",
            "'When' dùng như từ để hỏi (I don't know when he will come) thì VẪN được dùng 'will'."
        ],
        tips: [
            "Gạch chân liên từ thời gian → nhìn vế còn lại xem chia thì gì → suy ra thì cho chỗ trống.",
            "Cặp 'by the time' luôn đi với thì hoàn thành ở vế chính."
        ]
    },

    // ======================= 03. SUBJECT-VERB AGREEMENT =======================
    "gram-03-subject-verb-agreement": {
        intro: "Động từ phải hòa hợp với chủ ngữ về số (ít/nhiều). TOEIC thường cài cụm bổ nghĩa dài giữa chủ ngữ và động từ để đánh lừa thí sinh.",
        sections: [
            {
                heading: "1. Chủ ngữ luôn chia SỐ ÍT",
                points: [
                    "Each / Every / Either / Neither + N số ít.",
                    "Đại từ bất định: everyone, someone, anybody, nothing, everything.",
                    "Danh động từ / To-V / Mệnh đề làm chủ ngữ: <b>Reviewing</b> the files <b>takes</b> time.",
                    "Danh từ không đếm được: information, equipment, furniture, advice, luggage, news.",
                    "Khoảng thời gian, tiền, khoảng cách: Ten dollars <b>is</b> enough.",
                    "The number of + N số nhiều → V số ít."
                ]
            },
            {
                heading: "2. Chủ ngữ luôn chia SỐ NHIỀU",
                points: [
                    "A number of + N số nhiều; Both A and B; The + adj chỉ nhóm người (the elderly, the unemployed).",
                    "Danh từ luôn số nhiều: people, police, staff (thường), goods, belongings, earnings."
                ]
            },
            {
                heading: "3. Chia theo danh từ gần nhất / danh từ chính",
                table: {
                    head: ["Cấu trúc", "Chia theo", "Ví dụ"],
                    rows: [
                        ["Either A or B / Neither A nor B / Not only A but also B", "B", "Neither the manager nor the clerks are here."],
                        ["A as well as / along with / together with B", "A", "The CEO, along with his assistants, is arriving."],
                        ["N1 + of + N2", "N1", "The cost of the materials has risen."],
                        ["Most / Some / All / Half of + N", "N", "Most of the budget is spent. Most of the files are lost."]
                    ]
                }
            }
        ],
        traps: [
            "Cụm 'of + danh từ số nhiều' đứng ngay trước chỗ trống làm bạn chọn nhầm động từ số nhiều.",
            "Mệnh đề quan hệ: động từ trong MĐQH chia theo danh từ được bổ nghĩa – 'one of the employees who <b>are</b>...'."
        ],
        tips: [
            "Gạch bỏ toàn bộ cụm giới từ / mệnh đề quan hệ / cụm phân từ giữa chủ ngữ và động từ để tìm chủ ngữ thật.",
            "Hãy kết hợp kiểm tra số ít/nhiều với chủ động/bị động để loại đáp án nhanh."
        ]
    },

    // ======================= 04. GERUNDS =======================
    "gram-04-gerunds": {
        intro: "Danh động từ (V-ing) là động từ được dùng như một danh từ nhưng vẫn giữ khả năng mang tân ngữ. Đây là điểm phân biệt V-ing với danh từ thuần.",
        sections: [
            {
                heading: "1. Vị trí của Danh động từ",
                points: [
                    "Làm chủ ngữ: <b>Recycling</b> paper reduces costs.",
                    "Sau giới từ: before <b>leaving</b>, without <b>asking</b>, by <b>using</b>, for <b>attending</b>.",
                    "Sau một số động từ và cụm động từ cố định (xem bảng).",
                    "Làm tân ngữ / bổ ngữ: Her job is <b>managing</b> the accounts."
                ]
            },
            {
                heading: "2. Động từ + V-ing hay thi",
                table: {
                    head: ["Nhóm", "Động từ"],
                    rows: [
                        ["Đề xuất, cân nhắc", "suggest, recommend, consider, propose (= suggest)"],
                        ["Trì hoãn, tránh", "postpone, delay, put off, avoid, resist"],
                        ["Hoàn tất, ngừng", "finish, quit, discontinue, give up"],
                        ["Khác", "mind, enjoy, admit, deny, risk, involve, include, keep, practice"],
                        ["Cụm 'to' là giới từ", "look forward to, be used to, be committed/dedicated/devoted to, object to, contribute to, in addition to, with a view to"],
                        ["Cụm cố định", "be worth, it's no use, have difficulty (in), spend time (in), be busy"]
                    ]
                }
            },
            {
                heading: "3. Phân biệt V-ing (danh động từ) với Danh từ",
                points: [
                    "Nếu sau chỗ trống CÓ tân ngữ (cụm danh từ) → chọn V-ing: for <b>reviewing</b> the proposal.",
                    "Nếu sau chỗ trống KHÔNG có tân ngữ (giới từ / hết câu) → chọn danh từ: for the <b>review</b> of the proposal.",
                    "Có mạo từ (a/an/the) đứng trước → chọn danh từ."
                ]
            }
        ],
        traps: [
            "'look forward to + V-ing' – nhiều thí sinh chọn nhầm V nguyên mẫu.",
            "'Stop + V-ing' (ngừng việc đang làm) khác 'stop + to V' (dừng lại để làm việc khác)."
        ],
        tips: [
            "Sau giới từ mà có tân ngữ theo sau → 99% là V-ing.",
            "Học thuộc nhóm 'to' là giới từ vì TOEIC rất hay ra 'be committed to' và 'look forward to'."
        ]
    },

    // ======================= 05. INFINITIVES =======================
    "gram-05-infinitives": {
        intro: "Động từ nguyên mẫu gồm hai dạng: có 'to' (to V) và không 'to' (bare infinitive). TOEIC kiểm tra động từ đi kèm, cấu trúc chỉ mục đích và động từ sai khiến.",
        sections: [
            {
                heading: "1. Động từ + to V",
                table: {
                    head: ["Cấu trúc", "Động từ thường gặp"],
                    rows: [
                        ["V + to V", "want, plan, decide, agree, hope, expect, offer, promise, refuse, fail, manage, intend, aim, seek, strive, afford, tend, hesitate"],
                        ["V + O + to V", "ask, require, allow, permit, enable, encourage, invite, advise, remind, urge, instruct, persuade, expect, force"],
                        ["Bị động", "be required/asked/allowed/expected/encouraged + to V"],
                        ["Tính từ + to V", "be able/eager/willing/likely/ready/pleased/reluctant + to V"],
                        ["Danh từ + to V", "the ability/opportunity/decision/plan/effort/right + to V"]
                    ]
                }
            },
            {
                heading: "2. To V chỉ mục đích",
                points: [
                    "To V / In order to V / So as to V = để mà. Phủ định: in order not to V / so as not to V.",
                    "Đứng đầu câu: <b>To qualify</b> for a discount, customers must register."
                ]
            },
            {
                heading: "3. Động từ nguyên mẫu không 'to'",
                points: [
                    "Sau modal verbs: can, must, should, will, may...",
                    "Sau make / let / have + O(người) + V: The manager <b>had</b> her <b>revise</b> the report.",
                    "help + O + (to) V: both are correct.",
                    "Sau had better, would rather, why not."
                ]
            },
            {
                heading: "4. Động từ + to V / V-ing nhưng KHÁC nghĩa",
                table: {
                    head: ["Động từ", "+ to V", "+ V-ing"],
                    rows: [
                        ["remember / forget", "nhớ/quên phải làm (chưa làm)", "nhớ/quên đã làm"],
                        ["stop", "dừng lại để làm", "ngừng hẳn việc đang làm"],
                        ["try", "cố gắng", "thử làm"],
                        ["regret", "lấy làm tiếc phải (thông báo)", "hối hận đã làm"]
                    ]
                }
            }
        ],
        traps: [
            "'allow' + O + to V nhưng 'allow' + V-ing (không có tân ngữ): allow smoking.",
            "Nhầm 'enable' với 'be able': enable + O + to V / be able to V."
        ],
        tips: [
            "Chỗ trống đầu câu, sau đó là dấu phẩy + mệnh đề hoàn chỉnh → đáp án 'To V' (chỉ mục đích).",
            "Thấy động từ 'require/ask/encourage' ở dạng bị động → chọn ngay 'to V'."
        ]
    },

    // ======================= 06. SUBJUNCTIVE MOOD =======================
    "gram-06-subjunctive-mood": {
        intro: "Thức giả định diễn tả mong muốn, yêu cầu, đề nghị hoặc điều không có thật. Trong TOEIC, dạng phổ biến nhất là giả định với 'that' – động từ giữ nguyên mẫu.",
        sections: [
            {
                heading: "1. Giả định với 'that' (Present Subjunctive)",
                points: [
                    "Động từ: suggest, recommend, request, require, demand, insist, ask, propose, urge, advise + that + S + (should) + V nguyên mẫu.",
                    "Tính từ: It is essential / important / necessary / vital / imperative / mandatory / crucial + that + S + V nguyên mẫu.",
                    "Danh từ: the recommendation / requirement / request / suggestion + that + S + V nguyên mẫu.",
                    "Phủ định: not + V (The board recommended that he <b>not sign</b> it). Bị động: be + V3."
                ]
            },
            {
                heading: "2. Giả định với wish / if only / as if",
                table: {
                    head: ["Thời điểm", "Cấu trúc", "Ví dụ"],
                    rows: [
                        ["Hiện tại", "S + wish + S + V2 (were)", "I wish I were in charge."],
                        ["Quá khứ", "S + wish + S + had V3", "I wish I had applied earlier."],
                        ["Tương lai", "S + wish + S + would V", "I wish he would reply."],
                        ["As if / As though", "V2 / had V3", "He talks as if he knew everything."]
                    ]
                }
            },
            {
                heading: "3. It's (high) time + S + V2",
                points: ["It's time we <b>updated</b> the software. (= Đã đến lúc chúng ta nên...)"]
            }
        ],
        traps: [
            "Chọn nhầm động từ chia số ít (completes) vì chủ ngữ số ít – giả định luôn dùng nguyên mẫu.",
            "'Suggest' khi không có 'that' đi với V-ing: suggest postponing."
        ],
        tips: ["Thấy 'recommend/require/essential that' → tìm đáp án nguyên mẫu không 's', không 'ed'."]
    },

    // ======================= 07. MODAL VERBS =======================
    "gram-07-modal-verbs": {
        intro: "Động từ khuyết thiếu bổ sung ý nghĩa khả năng, sự cho phép, nghĩa vụ, lời khuyên cho động từ chính. Sau modal luôn là động từ nguyên mẫu không 'to'.",
        sections: [
            {
                heading: "1. Bảng ý nghĩa Modal Verbs",
                table: {
                    head: ["Modal", "Ý nghĩa", "Ví dụ"],
                    rows: [
                        ["can / could", "khả năng, xin phép", "Could you send me the file?"],
                        ["may / might", "khả năng (không chắc), cho phép trang trọng", "Visitors may park here."],
                        ["must", "bắt buộc (quy định), suy luận chắc chắn", "Employees must wear badges."],
                        ["have to", "bắt buộc (do hoàn cảnh)", "We have to finish by noon."],
                        ["should / ought to", "lời khuyên", "You should back up your data."],
                        ["need not / don't have to", "không cần thiết", "You needn't bring a laptop."],
                        ["must not", "cấm", "You must not smoke here."],
                        ["had better", "tốt hơn nên (cảnh báo)", "You'd better leave early."],
                        ["would rather", "thích hơn", "I'd rather stay late than come early."]
                    ]
                }
            },
            {
                heading: "2. Modal + have + V3 (nói về quá khứ)",
                points: [
                    "should have V3: đáng lẽ nên làm (nhưng đã không làm).",
                    "must have V3: chắc hẳn đã. can't have V3: không thể nào đã.",
                    "could/might have V3: có lẽ đã / lẽ ra đã có thể."
                ]
            },
            {
                heading: "3. Modal bị động",
                points: ["Modal + be + V3: The package <b>must be delivered</b> by Friday."]
            }
        ],
        traps: [
            "Sau modal không bao giờ là V-ing, to V hay V(s).",
            "'Don't have to' (không cần) khác hoàn toàn 'must not' (cấm)."
        ],
        tips: ["Thấy modal trước chỗ trống → chọn nguyên mẫu; nếu chủ ngữ là vật chịu tác động → 'be + V3'."]
    },

    // ======================= 08. PASSIVE VOICE =======================
    "gram-08-passive-voice": {
        intro: "Câu bị động dùng khi muốn nhấn mạnh đối tượng chịu tác động thay vì người thực hiện. Đây là chủ đề xuất hiện trong hầu hết các câu hỏi về dạng động từ ở Part 5.",
        sections: [
            {
                heading: "1. Công thức bị động theo thì",
                table: {
                    head: ["Thì", "Bị động"],
                    rows: [
                        ["Hiện tại đơn", "am/is/are + V3"],
                        ["Hiện tại tiếp diễn", "am/is/are being + V3"],
                        ["Hiện tại hoàn thành", "have/has been + V3"],
                        ["Quá khứ đơn", "was/were + V3"],
                        ["Quá khứ tiếp diễn", "was/were being + V3"],
                        ["Quá khứ hoàn thành", "had been + V3"],
                        ["Tương lai đơn", "will be + V3"],
                        ["Tương lai hoàn thành", "will have been + V3"],
                        ["Modal", "modal + be + V3"]
                    ]
                }
            },
            {
                heading: "2. Cấu trúc bị động đặc biệt",
                points: [
                    "Động từ 2 tân ngữ: Staff <b>were given</b> a bonus. / A bonus <b>was given</b> to staff.",
                    "Bị động với to V: be required/expected/asked/scheduled/supposed + to V.",
                    "Bị động khách quan: It is said/believed/reported that... = S + is said + to V.",
                    "Have/Get + O(vật) + V3: We <b>had</b> the printer <b>repaired</b>.",
                    "Bị động + giới từ khác 'by': be interested in, be satisfied with, be located in, be known for, be equipped with, be devoted to."
                ]
            },
            {
                heading: "3. Nội động từ – KHÔNG có dạng bị động",
                points: ["arrive, occur, happen, take place, exist, rise, fall, remain, emerge, expire, last, appear, disappear, function, proceed"]
            }
        ],
        traps: [
            "Chọn bị động cho nội động từ: 'was occurred' là SAI.",
            "Một số động từ có tân ngữ là 'to V' hoặc mệnh đề – đừng vội kết luận 'không có tân ngữ'."
        ],
        tips: [
            "Sau chỗ trống có danh từ (tân ngữ) → chủ động; có giới từ / trạng từ / hết câu → bị động.",
            "Kiểm tra nghĩa: chủ ngữ là vật (report, product, meeting) thường đi với bị động."
        ]
    },

    // ======================= 09. CONDITIONAL SENTENCES =======================
    "gram-09-conditional-sentences": {
        intro: "Câu điều kiện diễn tả một giả thiết và kết quả của nó. TOEIC thường cho sẵn một vế và yêu cầu chọn dạng động từ cho vế còn lại.",
        sections: [
            {
                heading: "1. Bảng 4 loại câu điều kiện",
                table: {
                    head: ["Loại", "Mệnh đề If", "Mệnh đề chính", "Cách dùng"],
                    rows: [
                        ["Loại 0", "If + HTĐ", "HTĐ", "Sự thật, quy luật"],
                        ["Loại 1", "If + HTĐ", "will/can/may + V / Mệnh lệnh", "Có thể xảy ra ở hiện tại / tương lai"],
                        ["Loại 2", "If + V2 (were)", "would/could + V", "Không có thật ở hiện tại"],
                        ["Loại 3", "If + had V3", "would/could have V3", "Không có thật ở quá khứ"],
                        ["Hỗn hợp", "If + had V3", "would + V (now)", "Quá khứ ảnh hưởng hiện tại"]
                    ]
                }
            },
            {
                heading: "2. Từ thay thế 'If'",
                points: [
                    "Unless = If ... not (trừ khi).",
                    "Provided (that) / Providing (that) / As long as / On condition that = miễn là.",
                    "In case (phòng khi) / In the event that / In the event of + N.",
                    "Otherwise (nếu không thì) – trạng từ, đứng đầu mệnh đề sau dấu chấm/chấm phẩy.",
                    "Without / But for + N = If it weren't for / If it hadn't been for."
                ]
            },
            {
                heading: "3. Đảo ngữ câu điều kiện",
                points: [
                    "Loại 1: Should + S + V → <b>Should</b> you have questions, call us.",
                    "Loại 2: Were + S + to V / N / adj → <b>Were</b> I you, I would accept.",
                    "Loại 3: Had + S + V3 → <b>Had</b> we known, we would have helped."
                ]
            }
        ],
        traps: [
            "Mệnh đề If loại 1 không dùng 'will'.",
            "'Unless' đã mang nghĩa phủ định – không dùng thêm 'not'."
        ],
        tips: ["Nhìn động từ ở vế đã cho (would have V3 → loại 3) rồi suy ra vế còn lại."]
    },

    // ======================= 10. REPORTED SPEECH =======================
    "gram-10-reported-speech": {
        intro: "Câu tường thuật (gián tiếp) thuật lại lời nói của người khác. TOEIC chủ yếu kiểm tra lùi thì và cách dùng động từ tường thuật đi kèm tân ngữ.",
        sections: [
            {
                heading: "1. Quy tắc lùi thì",
                table: {
                    head: ["Câu trực tiếp", "Câu gián tiếp"],
                    rows: [
                        ["Hiện tại đơn", "Quá khứ đơn"],
                        ["Hiện tại tiếp diễn", "Quá khứ tiếp diễn"],
                        ["Hiện tại hoàn thành / Quá khứ đơn", "Quá khứ hoàn thành"],
                        ["will / can / may / must", "would / could / might / had to"],
                        ["now / today / tomorrow / here", "then / that day / the next day / there"]
                    ]
                }
            },
            {
                heading: "2. Động từ tường thuật",
                points: [
                    "Không có tân ngữ người: say, announce, explain, state, mention, report + (that).",
                    "Bắt buộc tân ngữ người: tell, inform, notify, assure, remind, advise + O + that / of.",
                    "Câu hỏi: ask / wonder / want to know + if/whether/Wh- + S + V (KHÔNG đảo ngữ).",
                    "Mệnh lệnh / Đề nghị: ask/tell/advise/remind + O + (not) to V; suggest + V-ing / that."
                ]
            }
        ],
        traps: [
            "'said me' là SAI – phải là 'told me' hoặc 'said to me'.",
            "Câu hỏi gián tiếp giữ trật tự S + V: 'She asked where the office <b>was</b>' (không phải 'was the office')."
        ],
        tips: ["Thấy tân ngữ chỉ người ngay sau chỗ trống → chọn inform/notify/tell/assure."]
    },

    // ======================= 11. TAG QUESTIONS =======================
    "gram-11-tag-questions": {
        intro: "Câu hỏi đuôi dùng để xác nhận thông tin. Trong TOEIC, nó xuất hiện chủ yếu ở Listening Part 2 – việc hiểu cách trả lời quan trọng hơn cấu trúc.",
        sections: [
            {
                heading: "1. Quy tắc cấu tạo",
                points: [
                    "Vế trước khẳng định → đuôi phủ định; vế trước phủ định → đuôi khẳng định.",
                    "Đuôi dùng trợ động từ của vế trước + đại từ chủ ngữ.",
                    "Vế trước có never, seldom, rarely, hardly, barely, no, nothing → coi như phủ định."
                ]
            },
            {
                heading: "2. Trường hợp đặc biệt",
                table: {
                    head: ["Vế chính", "Câu hỏi đuôi"],
                    rows: [
                        ["I am ...", "aren't I?"],
                        ["Let's ...", "shall we?"],
                        ["Câu mệnh lệnh", "will you? / won't you?"],
                        ["Everyone / Somebody ...", "... they?"],
                        ["Nothing / Everything ...", "... it?"],
                        ["There is / are ...", "isn't there? / aren't there?"],
                        ["I think + mệnh đề", "đuôi theo mệnh đề sau"]
                    ]
                }
            },
            {
                heading: "3. Trả lời câu hỏi đuôi trong Part 2",
                points: [
                    "Đúng sự thật → Yes; không đúng → No (không phụ thuộc đuôi khẳng định hay phủ định).",
                    "Đáp án đúng thường là câu trả lời gián tiếp: 'You're coming to the seminar, aren't you?' → 'I have to check my schedule.'"
                ]
            }
        ],
        traps: ["Đáp án lặp lại từ trong câu hỏi thường là bẫy âm thanh ở Part 2."],
        tips: ["Tập trung vào nội dung chính của câu (bỏ qua phần đuôi) rồi tìm câu trả lời hợp logic."]
    },

    // ======================= 12. RELATIVE CLAUSES =======================
    "gram-12-relative-clauses": {
        intro: "Mệnh đề quan hệ bổ nghĩa cho danh từ đứng trước nó. TOEIC kiểm tra cách chọn đại từ quan hệ và dạng rút gọn.",
        sections: [
            {
                heading: "1. Đại từ / Trạng từ quan hệ",
                table: {
                    head: ["Từ", "Thay cho", "Theo sau"],
                    rows: [
                        ["who", "người (chủ ngữ)", "+ V"],
                        ["whom", "người (tân ngữ)", "+ S + V"],
                        ["which", "vật", "+ V / + S + V"],
                        ["that", "người/vật (MĐQH xác định)", "+ V / + S + V"],
                        ["whose", "sở hữu (người/vật)", "+ N + V"],
                        ["where", "nơi chốn (= in/at which)", "+ S + V (đủ thành phần)"],
                        ["when", "thời gian (= on/in which)", "+ S + V"],
                        ["why", "lý do (= for which)", "+ S + V"]
                    ]
                }
            },
            {
                heading: "2. MĐQH xác định và không xác định",
                points: [
                    "Không xác định (có dấu phẩy): không dùng 'that', không lược bỏ đại từ.",
                    "Sau giới từ chỉ dùng 'which / whom': the client <b>with whom</b> we met.",
                    "Lượng từ + of which / of whom: ten applicants, <b>most of whom</b> are qualified."
                ]
            },
            {
                heading: "3. Rút gọn mệnh đề quan hệ",
                points: [
                    "Chủ động → V-ing: Employees <b>working</b> overtime will be paid extra.",
                    "Bị động → V3: The items <b>ordered</b> last week have arrived.",
                    "Sau the first / the last / the only / so sánh nhất → to V: the first person <b>to arrive</b>."
                ]
            }
        ],
        traps: [
            "Chọn 'which' sau dấu phẩy khi thay cho cả mệnh đề trước là đúng – không chọn 'that'.",
            "'whose' luôn có danh từ theo sau, 'who' luôn có động từ theo sau."
        ],
        tips: [
            "Nhìn ngay sau chỗ trống: động từ → who/which/that; danh từ không mạo từ → whose; S + V đầy đủ → where/when hoặc whom/which (thiếu tân ngữ).",
            "Câu đã có động từ chính → chỗ trống bổ nghĩa cho danh từ là V-ing/V3."
        ]
    },

    // ======================= 13. TYPES OF CLAUSES =======================
    "gram-13-types-of-clauses": {
        intro: "Có 3 loại mệnh đề phụ: mệnh đề danh từ, mệnh đề tính từ (quan hệ) và mệnh đề trạng ngữ. Nhận diện đúng loại mệnh đề giúp bạn chọn đúng từ nối.",
        sections: [
            {
                heading: "1. Mệnh đề danh từ (Noun Clause)",
                points: [
                    "Làm chủ ngữ, tân ngữ, bổ ngữ trong câu.",
                    "That + mệnh đề đầy đủ: <b>That</b> the project failed surprised us.",
                    "What + mệnh đề thiếu thành phần: <b>What</b> we need is more time.",
                    "Whether / If (liệu rằng): We are unsure <b>whether</b> the event will proceed. (Chỉ 'whether' đứng đầu câu, sau giới từ, trước 'or not', trước to V).",
                    "Whoever / Whatever / Whichever: Give it to <b>whoever</b> needs it."
                ]
            },
            {
                heading: "2. Mệnh đề trạng ngữ (Adverbial Clause)",
                table: {
                    head: ["Ý nghĩa", "Liên từ"],
                    rows: [
                        ["Thời gian", "when, while, before, after, until, since, as soon as, once"],
                        ["Nguyên nhân", "because, since, as, now that, given that"],
                        ["Nhượng bộ", "although, though, even though, whereas, while"],
                        ["Mục đích", "so that, in order that (+ can/could/will)"],
                        ["Điều kiện", "if, unless, provided that, as long as, in case"],
                        ["Kết quả", "so + adj + that, such + N + that"]
                    ]
                }
            },
            {
                heading: "3. Rút gọn mệnh đề trạng ngữ (cùng chủ ngữ)",
                points: [
                    "Chủ động: <b>When reviewing</b> the contract, check the dates.",
                    "Bị động: <b>Once approved</b>, the budget will be released.",
                    "Phân từ hoàn thành: <b>Having finished</b> the report, she left."
                ]
            }
        ],
        traps: ["Nhầm 'what' với 'that': sau 'that' mệnh đề phải đầy đủ; sau 'what' mệnh đề thiếu chủ ngữ/tân ngữ."],
        tips: ["Xác định chức năng của mệnh đề (chủ ngữ, tân ngữ hay trạng ngữ) trước khi chọn từ nối."]
    },

    // ======================= 14. INVERSION =======================
    "gram-14-inversion": {
        intro: "Đảo ngữ là đưa trợ động từ lên trước chủ ngữ để nhấn mạnh. TOEIC chủ yếu ra đảo ngữ câu điều kiện ('Should you...') và đảo ngữ với trạng từ phủ định.",
        sections: [
            {
                heading: "1. Đảo ngữ với từ phủ định / hạn chế đứng đầu câu",
                table: {
                    head: ["Từ đứng đầu", "Ví dụ"],
                    rows: [
                        ["Never / Rarely / Seldom", "Rarely <b>does</b> the CEO attend such meetings."],
                        ["Hardly / Scarcely ... when; No sooner ... than", "No sooner <b>had</b> we arrived than it rained."],
                        ["Not only ... but also", "Not only <b>is</b> it cheap, but it is also durable."],
                        ["Only after / Only when / Only if / Only by", "Only after the audit <b>will</b> we know the results."],
                        ["Under no circumstances / In no way / On no account", "Under no circumstances <b>should</b> you share passwords."],
                        ["Not until", "Not until Friday <b>did</b> he reply."],
                        ["So + adj/adv ... that", "So popular <b>was</b> the product that it sold out."]
                    ]
                }
            },
            {
                heading: "2. Đảo ngữ câu điều kiện",
                points: [
                    "<b>Should</b> + S + V (loại 1) – rất phổ biến trong email: Should you need assistance, please contact us.",
                    "<b>Were</b> + S + to V (loại 2).",
                    "<b>Had</b> + S + V3 (loại 3)."
                ]
            },
            {
                heading: "3. Đảo ngữ với 'as / than' và 'so / neither'",
                points: [
                    "So + aux + S (cũng vậy): He passed, and so <b>did</b> she.",
                    "Neither/Nor + aux + S (cũng không): I can't go, nor <b>can</b> he.",
                    "Attached / Enclosed / Included + is/are + N (đảo ngữ tính từ đầu câu): <b>Enclosed is</b> a copy of the invoice."
                ]
            }
        ],
        traps: ["Sau 'Should' đảo ngữ là động từ nguyên mẫu – không chia."],
        tips: ["Chỗ trống đầu câu, sau đó là S + V nguyên mẫu, vế sau là mệnh lệnh 'please...' → chọn 'Should'."]
    },

    // ======================= 15. ARTICLES =======================
    "gram-15-articles": {
        intro: "Mạo từ gồm 'a/an' (không xác định) và 'the' (xác định). Quy tắc quan trọng nhất: danh từ đếm được số ít không đứng một mình.",
        sections: [
            {
                heading: "1. A / An",
                points: [
                    "Dùng với danh từ đếm được số ít, nhắc đến lần đầu hoặc không xác định.",
                    "Chọn theo ÂM chứ không theo chữ: <b>an</b> hour, <b>an</b> MBA, <b>a</b> university, <b>a</b> one-day seminar.",
                    "Dùng với nghề nghiệp, số lượng: a dozen, a hundred, twice a week."
                ]
            },
            {
                heading: "2. The",
                points: [
                    "Danh từ đã được xác định (nhắc lại, có mệnh đề/cụm bổ nghĩa theo sau).",
                    "Vật duy nhất: the sun, the Internet; so sánh nhất; số thứ tự; the same.",
                    "Tên sông, biển, dãy núi, quốc gia số nhiều: the Pacific, the United States.",
                    "The + adj = nhóm người: the elderly, the disabled."
                ]
            },
            {
                heading: "3. Không dùng mạo từ (Zero article)",
                points: [
                    "Danh từ số nhiều / không đếm được mang nghĩa chung: Information is valuable.",
                    "Tên bữa ăn, môn học, ngôn ngữ, phần lớn tên quốc gia, thành phố.",
                    "Cụm cố định: by car, at work, in person, on time, in advance."
                ]
            }
        ],
        traps: ["Không dùng 'a/an' với danh từ không đếm được: an advice, an equipment, an information là SAI."],
        tips: ["Thấy danh từ đếm được số ít trơ trọi → cần a/an/the hoặc tính từ sở hữu."]
    },

    // ======================= 16. PREPOSITIONS =======================
    "gram-16-prepositions": {
        intro: "Giới từ đứng trước danh từ/cụm danh từ/V-ing để chỉ thời gian, nơi chốn, phương tiện, nguyên nhân... TOEIC chú trọng giới từ thời gian và cụm giới từ cố định.",
        sections: [
            {
                heading: "1. Giới từ chỉ thời gian",
                table: {
                    head: ["Giới từ", "Cách dùng", "Ví dụ"],
                    rows: [
                        ["at", "giờ, thời điểm", "at 9 a.m., at noon"],
                        ["on", "ngày, thứ, ngày tháng", "on Monday, on May 5"],
                        ["in", "tháng, năm, mùa, buổi; sau một khoảng thời gian", "in 2025, in two weeks"],
                        ["by", "hạn chót (muộn nhất là)", "submit by Friday"],
                        ["until / till", "kéo dài đến khi", "open until 10 p.m."],
                        ["within", "trong vòng", "within 30 days"],
                        ["during", "trong suốt (+ N sự kiện)", "during the meeting"],
                        ["for", "khoảng thời gian", "for three years"],
                        ["since", "từ mốc (HTHT)", "since 2020"],
                        ["throughout", "suốt cả", "throughout the year"],
                        ["prior to / ahead of", "trước", "prior to departure"]
                    ]
                }
            },
            {
                heading: "2. Giới từ chỉ nơi chốn và phương hướng",
                points: [
                    "at (điểm cụ thể), in (không gian bao quanh), on (bề mặt, tầng, đường).",
                    "across from / opposite (đối diện), next to / beside, between (giữa 2), among (giữa nhiều), along (dọc theo), throughout (khắp)."
                ]
            },
            {
                heading: "3. Cụm giới từ hay gặp trong TOEIC",
                points: [
                    "according to, in accordance with, in charge of, on behalf of, in response to, in addition to, regardless of, instead of, as of (kể từ), in terms of, with regard to, due to, owing to, because of, thanks to, despite, in spite of, except for, aside from.",
                    "Tính từ + giới từ: responsible for, eligible for, familiar with, aware of, capable of, compatible with, similar to, subject to."
                ]
            }
        ],
        traps: [
            "Nhầm 'by' và 'until': submit/complete/finish đi với 'by'; stay/remain/wait/valid đi với 'until'.",
            "Giới từ không đi với mệnh đề (S + V) – nếu sau chỗ trống là mệnh đề thì phải là liên từ."
        ],
        tips: ["Học giới từ theo cụm (collocation) thay vì học riêng lẻ."]
    },

    // ======================= 17. CONJUNCTIONS =======================
    "gram-17-conjunctions": {
        intro: "Liên từ nối các từ, cụm từ hoặc mệnh đề. Câu hỏi kinh điển trong TOEIC là phân biệt liên từ (+ mệnh đề), giới từ (+ cụm danh từ) và trạng từ liên kết.",
        sections: [
            {
                heading: "1. Ba loại liên từ",
                points: [
                    "Kết hợp (FANBOYS): for, and, nor, but, or, yet, so.",
                    "Tương quan: both...and, either...or, neither...nor, not only...but also, whether...or.",
                    "Phụ thuộc: because, although, when, if, unless, while, so that, once..."
                ]
            },
            {
                heading: "2. Bảng phân biệt Liên từ - Giới từ - Trạng từ liên kết",
                table: {
                    head: ["Ý nghĩa", "Liên từ (+ S + V)", "Giới từ (+ N / V-ing)", "Trạng từ liên kết"],
                    rows: [
                        ["Mặc dù", "although, though, even though", "despite, in spite of, notwithstanding", "however, nevertheless, nonetheless"],
                        ["Bởi vì", "because, since, as, now that", "because of, due to, owing to, thanks to", "—"],
                        ["Do đó", "so", "—", "therefore, thus, consequently, as a result, hence"],
                        ["Trong khi", "while, whereas", "during", "meanwhile, in the meantime"],
                        ["Nếu không", "unless", "without, barring", "otherwise"],
                        ["Ngoài ra", "—", "in addition to, besides", "moreover, furthermore, in addition, also"],
                        ["Thay vì", "—", "instead of, rather than", "instead"]
                    ]
                }
            },
            {
                heading: "3. Vị trí trạng từ liên kết",
                points: [
                    "Đứng đầu câu (sau dấu chấm) hoặc sau dấu chấm phẩy, theo sau là dấu phẩy: ...; <b>however</b>, the price rose.",
                    "Không dùng trạng từ liên kết để nối hai mệnh đề chỉ bằng dấu phẩy."
                ]
            }
        ],
        traps: [
            "'Despite' + mệnh đề là SAI → phải là 'despite the fact that + mệnh đề'.",
            "Nhầm 'so that' (để mà) với 'so' (vì vậy)."
        ],
        tips: [
            "Bước 1: nhìn sau chỗ trống là mệnh đề hay cụm danh từ. Bước 2: xét nghĩa quan hệ giữa hai vế (tương phản, nguyên nhân, kết quả).",
            "Part 6 thường hỏi trạng từ liên kết đầu câu – đọc câu trước để xác định quan hệ logic."
        ]
    },

    // ======================= 18. DEGREES OF COMPARISON =======================
    "gram-18-comparisons": {
        intro: "So sánh dùng tính từ/trạng từ để đối chiếu các đối tượng. Dấu hiệu so sánh trong câu (as, than, the, of all) chính là chìa khóa giải đề.",
        sections: [
            {
                heading: "1. Bảng cấu trúc so sánh",
                table: {
                    head: ["Loại", "Tính từ ngắn", "Tính từ dài"],
                    rows: [
                        ["So sánh bằng", "as + adj + as", "as + adj + as"],
                        ["So sánh hơn", "adj-er + than", "more + adj + than"],
                        ["So sánh nhất", "the + adj-est", "the most + adj"],
                        ["So sánh kém", "less + adj + than", "the least + adj"]
                    ]
                }
            },
            {
                heading: "2. Bất quy tắc",
                points: [
                    "good/well → better → best; bad/badly → worse → worst; many/much → more → most; little → less → least; far → farther/further → farthest/furthest."
                ]
            },
            {
                heading: "3. Cấu trúc nâng cao",
                points: [
                    "Nhấn mạnh so sánh hơn: much, far, even, still, a lot, significantly, considerably, substantially.",
                    "Nhấn mạnh so sánh nhất: by far, easily, the very best.",
                    "So sánh kép: The + so sánh hơn + S + V, the + so sánh hơn + S + V (The sooner you apply, the better).",
                    "So sánh lũy tiến: more and more, better and better.",
                    "So sánh gấp bội: twice / three times + as + adj + as.",
                    "the same + N + as; different from; similar to; superior/inferior to (không dùng than)."
                ]
            }
        ],
        traps: [
            "Dùng 'very' để nhấn mạnh so sánh hơn là SAI (very better).",
            "Chọn tính từ hay trạng từ dựa vào từ được bổ nghĩa: động từ thường → trạng từ (more quickly)."
        ],
        tips: ["Quét câu tìm 'than' (so sánh hơn), 'as...as' (bằng), 'the / of all / in + nơi chốn / ever' (nhất)."]
    },

    // ======================= 19. ORDER OF ADJECTIVES =======================
    "gram-19-order-of-adjectives": {
        intro: "Khi nhiều tính từ cùng bổ nghĩa cho một danh từ, chúng tuân theo trật tự nhất định. TOEIC còn kiểm tra tính từ phân từ (-ing/-ed) và danh từ ghép.",
        sections: [
            {
                heading: "1. Quy tắc OSASCOMP",
                table: {
                    head: ["Thứ tự", "Loại", "Ví dụ"],
                    rows: [
                        ["1", "Opinion (ý kiến)", "beautiful, reliable, excellent"],
                        ["2", "Size (kích thước)", "large, small, compact"],
                        ["3", "Age (tuổi)", "new, old, modern"],
                        ["4", "Shape (hình dạng)", "round, square"],
                        ["5", "Color (màu)", "black, blue"],
                        ["6", "Origin (nguồn gốc)", "Japanese, Italian"],
                        ["7", "Material (chất liệu)", "wooden, leather, steel"],
                        ["8", "Purpose (mục đích)", "conference, sleeping, office"]
                    ]
                }
            },
            {
                heading: "2. Tính từ phân từ -ing và -ed",
                points: [
                    "-ing: mang nghĩa chủ động, chỉ bản chất gây ra cảm xúc: an exciting offer, the remaining items, a leading company, existing customers, rising costs.",
                    "-ed: mang nghĩa bị động, chỉ cảm xúc của người: satisfied clients, the attached file, an experienced engineer, a detailed report, limited time."
                ]
            },
            {
                heading: "3. Danh từ ghép (Compound Nouns) hay gặp",
                points: [
                    "N + N, danh từ đầu đóng vai trò tính từ: safety regulations, customer satisfaction, job opening, sales representative, application form, expiration date, retirement party, budget proposal."
                ]
            }
        ],
        traps: ["Tính từ đứng sau danh từ trong một số trường hợp: something important, the person responsible, the tickets available."],
        tips: ["Vật gây ra cảm xúc → -ing; người cảm nhận → -ed."]
    },

    // ======================= 20. WORD FORMATION =======================
    "gram-20-word-formation": {
        intro: "Chuyên đề Word Formation (Cấu tạo từ) gồm 4 bài học trọng tâm theo từng từ loại: Danh từ, Tính từ, Trạng từ và Động từ — mỗi bài tích hợp đầy đủ hậu tố nhận diện, bẫy đuôi từ và quy tắc vị trí trong đề TOEIC Part 5.",
        sections: [
            {
                heading: "Bài 1: Danh từ (Nouns) — Hậu tố, Bẫy đuôi từ & Cụm danh từ",
                visual: {
                    wordTypeKey: "noun",
                    wordTypeLabel: "Danh từ",
                    shortTitle: "Danh từ (Nouns)",
                    subtitle: "Hậu tố • 3 Bẫy đuôi • Cụm N & V-ing",
                    color: "indigo",
                    icon: "fa-cube",
                    suffixGroups: [
                        { suffix: "-tion / -sion", meaning: "Hành động, quá trình", examples: ["application", "decision", "production"] },
                        { suffix: "-ment / -ness / -ity", meaning: "Trạng thái, kết quả, tính chất", examples: ["improvement", "awareness", "ability"] },
                        { suffix: "-ance / -ence / -ship / -age / -ure", meaning: "Sự việc, quan hệ, tình trạng", examples: ["attendance", "membership", "shortage", "departure"] },
                        { suffix: "-er / -or / -ist / -ee", meaning: "Danh từ chỉ người / vai trò", examples: ["manager", "director", "specialist", "employee"] }
                    ],
                    trapGroups: [
                        {
                            title: "Bẫy 1: Đuôi -al nhưng là Danh từ",
                            note: "Thường bị nhầm sang Tính từ — đứng sau mạo từ / sở hữu cách / giới từ",
                            words: [
                                { word: "approval", meaning: "sự phê duyệt" },
                                { word: "proposal", meaning: "đề xuất" },
                                { word: "renewal", meaning: "sự gia hạn" },
                                { word: "removal", meaning: "sự gỡ bỏ" },
                                { word: "arrival", meaning: "sự đến nơi" },
                                { word: "refusal", meaning: "sự từ chối" },
                                { word: "manual", meaning: "sổ tay hướng dẫn" },
                                { word: "potential", meaning: "tiềm năng" },
                                { word: "individual", meaning: "cá nhân" },
                                { word: "professional", meaning: "chuyên gia" }
                            ]
                        },
                        {
                            title: "Bẫy 2: Đuôi -ive nhưng là Danh từ",
                            note: "Vừa có gốc giống Tính từ, nhưng trong TOEIC rất hay làm Danh từ đếm được",
                            words: [
                                { word: "representative", meaning: "người đại diện" },
                                { word: "executive", meaning: "giám đốc điều hành" },
                                { word: "initiative", meaning: "sáng kiến" },
                                { word: "alternative", meaning: "phương án thay thế" },
                                { word: "objective", meaning: "mục tiêu" },
                                { word: "incentive", meaning: "chế độ khích lệ" }
                            ]
                        },
                        {
                            title: "Bẫy 3: Đuôi -ant / -ent chỉ Danh từ người",
                            note: "Không chỉ làm Tính từ — khi đứng làm chủ ngữ/tân ngữ chỉ người là Danh từ",
                            words: [
                                { word: "applicant", meaning: "ứng viên" },
                                { word: "assistant", meaning: "trợ lý" },
                                { word: "accountant", meaning: "kế toán viên" },
                                { word: "consultant", meaning: "chuyên viên tư vấn" },
                                { word: "participant", meaning: "người tham gia" },
                                { word: "recipient", meaning: "người nhận" },
                                { word: "resident", meaning: "cư dân" }
                            ]
                        }
                    ],
                    positions: [
                        { label: "Vị trí 1", formula: "[___] + V  hoặc  V + [___]", desc: "Làm chủ ngữ đầu câu hoặc tân ngữ sau ngoại động từ", example: "**Attendance** is mandatory; please submit the **report**." },
                        { label: "Vị trí 2", formula: "of / in / for / with / by + [N]", desc: "Đứng sau giới từ (hoặc làm tân ngữ của cụm giới từ)", example: "the cost of **production**; responsible for **safety**" },
                        { label: "Vị trí 3", formula: "a / an / the / its / 's + [N]", desc: "Sau mạo từ, tính từ sở hữu (its, their...) hoặc sở hữu cách ('s)", example: "a **proposal**; their **annual budget**; the manager's **approval**" },
                        { label: "Vị trí 4", formula: "many / much / several / each + [N]", desc: "Sau lượng từ (chú ý hòa hợp số ít / số nhiều / không đếm được)", example: "several **applicants**; much **information**; every **employee**" }
                    ],
                    focusBlocks: [
                        {
                            kind: "wordChips",
                            title: "Danh từ ghép (Compound Nouns) xuất hiện dày đặc",
                            subtitle: "2 danh từ đứng liền nhau để tạo cụm danh từ cố định trong kinh doanh",
                            badge: "6 cụm kinh điển",
                            tone: "indigo",
                            items: [
                                { word: "customer satisfaction", meaning: "sự hài lòng của khách hàng" },
                                { word: "safety regulations", meaning: "quy định an toàn" },
                                { word: "performance review", meaning: "đánh giá hiệu suất" },
                                { word: "application form", meaning: "đơn đăng ký" },
                                { word: "maintenance schedule", meaning: "lịch bảo trì" },
                                { word: "budget proposal", meaning: "đề xuất ngân sách" }
                            ]
                        },
                        {
                            kind: "wordChips",
                            title: "Danh từ không đếm được — Cấm dùng a/an & cấm thêm -s",
                            subtitle: "Luôn đi với động từ số ít và không bao giờ thêm -s/-es ở cuối",
                            badge: "8 từ hay bẫy",
                            tone: "rose",
                            items: [
                                { word: "equipment", meaning: "trang thiết bị" },
                                { word: "information", meaning: "thông tin" },
                                { word: "furniture", meaning: "nội thất" },
                                { word: "feedback", meaning: "phản hồi" },
                                { word: "merchandise", meaning: "hàng hóa" },
                                { word: "staff", meaning: "đội ngũ nhân viên" },
                                { word: "access", meaning: "quyền truy cập" },
                                { word: "compliance", meaning: "sự tuân thủ" }
                            ]
                        },
                        {
                            kind: "decisionSplit",
                            title: "Phân biệt nhanh V-ing (Danh động từ) vs. Danh từ gốc",
                            subtitle: "Nhìn ngay từ đứng NGAY SAU chỗ trống để chọn trong 2 giây",
                            branches: [
                                { badge: "Chọn V-ing", title: "Phía sau có TÂN NGỮ TRỰC TIẾP", rule: "V-ing giữ tính chất động từ nên kéo theo tân ngữ trực tiếp ngay sau nó.", examples: ["**improving** productivity", "**managing** client accounts"], tone: "emerald" },
                                { badge: "Chọn Danh từ gốc", title: "Phía sau có GIỚI TỪ (of, in, for...) hoặc hết cụm", rule: "Danh từ gốc không nhận tân ngữ trực tiếp mà phải nối qua giới từ.", examples: ["the **improvement** of productivity", "responsible for **management**"], tone: "indigo" }
                            ]
                        }
                    ],
                    comparisonSection: {
                        title: "Phân biệt 2 danh từ cùng gốc (Người vs. Vật / Hành động)",
                        subtitle: "Đọc nghĩa động từ và ngữ cảnh để biết chỗ trống cần chỉ người hay chỉ sự việc",
                        columnsClass: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3",
                        pairs: [
                            {
                                title: "Gốc APPLY (Ứng tuyển)",
                                items: [
                                    { word: "applicant", tag: "Người", meaning: "người nộp đơn / ứng viên", tone: "indigo" },
                                    { word: "application", tag: "Vật / Việc", meaning: "đơn xin việc / sự áp dụng", tone: "slate" }
                                ]
                            },
                            {
                                title: "Gốc EMPLOY (Tuyển dụng)",
                                items: [
                                    { word: "employer", tag: "Người (Chủ)", meaning: "nhà tuyển dụng / công ty", tone: "indigo" },
                                    { word: "employee", tag: "Người (Thợ)", meaning: "nhân viên", tone: "emerald" },
                                    { word: "employment", tag: "Sự việc", meaning: "việc làm / sự tuyển dụng", tone: "slate" }
                                ]
                            },
                            {
                                title: "Gốc SUPERVISE (Giám sát)",
                                items: [
                                    { word: "supervisor", tag: "Người", meaning: "người giám sát / quản lý", tone: "indigo" },
                                    { word: "supervision", tag: "Sự việc", meaning: "sự giám sát", tone: "slate" }
                                ]
                            },
                            {
                                title: "Gốc PRESENT (Thuyết trình)",
                                items: [
                                    { word: "presenter", tag: "Người", meaning: "người thuyết trình", tone: "indigo" },
                                    { word: "presentation", tag: "Vật / Việc", meaning: "bài thuyết trình", tone: "slate" }
                                ]
                            }
                        ]
                    }
                },
                table: {
                    head: ["Chủ điểm trọng tâm", "Hậu tố, Quy tắc & Ví dụ TOEIC"],
                    rows: [
                        ["**Hậu tố nhận diện Danh từ**", "**-tion/-sion, -ment, -ness, -ity, -ance/-ence, -ship, -age, -ure, -er/-or, -ist, -ee** (application, improvement, awareness, ability, attendance, manager, employee)"],
                        ["**Bẫy 1: Đuôi -al nhưng là Danh từ**", "**approval, proposal, renewal, removal, arrival, refusal, manual, potential, individual, professional**"],
                        ["**Bẫy 2: Đuôi -ive nhưng là Danh từ**", "**representative, executive, initiative, alternative, objective, incentive**"],
                        ["**Bẫy 3: Đuôi -ant / -ent chỉ Danh từ người**", "**applicant, assistant, accountant, consultant, participant, recipient, resident**"],
                        ["**Danh từ ghép (Compound Nouns)**", "Xuất hiện dày đặc: **customer satisfaction**, **safety regulations**, **performance review**, **application form**, **maintenance schedule**, **budget proposal**"],
                        ["**2 danh từ cùng gốc (Người vs Vật/Hành động)**", "**applicant** (người nộp đơn) vs **application** (đơn); **employer** (nhà tuyển dụng) vs **employee** (nhân viên) vs **employment** (việc làm); **supervisor** (giám sát viên) vs **supervision** (sự giám sát); **presenter** (người thuyết trình) vs **presentation** (bài thuyết trình)"],
                        ["**Danh từ đếm được vs Không đếm được**", "**Không đếm được** (không đi với a/an, không thêm -s): **equipment, information, furniture, feedback, merchandise, staff, access, compliance**"],
                        ["**V-ing (Danh động từ) vs Danh từ gốc**", "Chọn **V-ing** khi phía sau có **tân ngữ trực tiếp** (**improving productivity**); chọn **Danh từ gốc** khi phía sau có **giới từ** (**the improvement of productivity**) hoặc kết thúc cụm"]
                    ]
                },
                positionTable: {
                    head: ["Vị trí của Danh từ trong câu", "Ví dụ"],
                    rows: [
                        ["Làm **chủ ngữ** hoặc **tân ngữ**", "**Attendance** is mandatory; please submit the **report**."],
                        ["Sau **giới từ** (of, in, for, with, by...)", "the cost of **production**; responsible for **safety**; in **compliance** with"],
                        ["Sau **mạo từ** (a/an/the), **tính từ sở hữu** (its, their...), **sở hữu cách** ('s)", "a **proposal**; their **annual budget**; the manager's **approval**"],
                        ["Sau **lượng từ** (many, much, several, each, every...)", "several **applicants**; much **information**; every **employee**"]
                    ]
                },
                points: [
                    "Cảnh giác 3 nhóm bẫy đuôi danh từ đặc sản TOEIC: **-al** (approval, proposal), **-ive** (representative, incentive) và **-ant/-ent** (applicant, consultant).",
                    "Khi đứng ngay trước một danh từ khác, kiểm tra xem chỗ trống cần **Tính từ bổ nghĩa** hay tạo thành **Danh từ ghép** quen thuộc trong TOEIC.",
                    "Luôn phân biệt danh từ chỉ **người** và danh từ chỉ **vật/hành động** dựa vào động từ hoặc ngữ cảnh chủ ngữ/tân ngữ."
                ]
            },
            {
                heading: "Bài 2: Tính từ (Adjectives) — Hậu tố, Bẫy đuôi từ & Phân từ (V-ing / V-ed)",
                visual: {
                    wordTypeKey: "adjective",
                    wordTypeLabel: "Tính từ",
                    shortTitle: "Tính từ (Adjectives)",
                    subtitle: "Hậu tố • V+O+Adj • V-ing/V-ed • 8 Cặp nhầm",
                    color: "emerald",
                    icon: "fa-wand-magic-sparkles",
                    suffixGroups: [
                        { suffix: "-able / -ible", meaning: "Có thể, xứng đáng", examples: ["reliable", "available", "accessible"] },
                        { suffix: "-ful / -less", meaning: "Đầy đủ / không có", examples: ["helpful", "careful", "careless"] },
                        { suffix: "-ive / -ous", meaning: "Có tính chất, khuynh hướng", examples: ["effective", "competitive", "ambitious"] },
                        { suffix: "-al / -ic / -ant / -ent / -y", meaning: "Thuộc về, có đặc điểm", examples: ["annual", "specific", "important", "healthy"] }
                    ],
                    trapGroups: [
                        {
                            title: "Bẫy kinh điển: Đuôi -ly nhưng là TÍNH TỪ (không phải Trạng từ!)",
                            note: "Được tạo từ Danh từ + -ly — dùng bổ nghĩa cho danh từ hoặc đứng sau Linking Verb",
                            words: [
                                { word: "costly", meaning: "đắt đỏ, tốn kém" },
                                { word: "timely", meaning: "kịp thời" },
                                { word: "friendly", meaning: "thân thiện" },
                                { word: "likely", meaning: "có khả năng" },
                                { word: "orderly", meaning: "ngăn nắp, trật tự" },
                                { word: "daily", meaning: "hằng ngày" },
                                { word: "weekly", meaning: "hằng tuần" },
                                { word: "monthly", meaning: "hằng tháng" },
                                { word: "quarterly", meaning: "hằng quý" }
                            ]
                        }
                    ],
                    positions: [
                        { label: "Vị trí 1", formula: "a / an / the + [Adj] + Noun", desc: "Đứng ngay trước danh từ để bổ nghĩa cho danh từ đó", example: "a **reliable** supplier; an **updated** schedule" },
                        { label: "Vị trí 2", formula: "Linking Verb + [Adj]", desc: "Sau be, become, remain, seem, appear, feel, look, stay, prove", example: "The instructions remain **clear**; the tool proved **effective**." },
                        { label: "Cấu trúc VÀNG", formula: "V + Tân ngữ + [Adj]", desc: "Sau make, keep, find, consider, deem, leave, render + O (rất hay bẫy chọn Adv!)", example: "**make** the process **efficient**; **keep** clients **informed**; **find** it **acceptable**" }
                    ],
                    focusBlocks: [
                        {
                            kind: "decisionSplit",
                            title: "Phân biệt Tính từ phân từ: Đuôi -ing vs. Đuôi -ed",
                            subtitle: "Xác định xem danh từ được bổ nghĩa tự gây ra hành động (-ing) hay chịu tác động / đã hoàn tất (-ed)",
                            branches: [
                                {
                                    badge: "V-ing (Chủ động / Bản chất)",
                                    title: "Chỉ tính chất tự thân, đang diễn ra",
                                    rule: "Danh từ tự thực hiện hoặc mang tính chất đó.",
                                    examples: ["**growing** demand (nhu cầu đang tăng)", "**existing** system (hệ thống hiện có)", "**leading** provider (nhà cung cấp hàng đầu)", "**challenging** task (nhiệm vụ đầy thách thức)"],
                                    tone: "emerald"
                                },
                                {
                                    badge: "V-ed (Bị động / Đã hoàn tất)",
                                    title: "Chỉ trạng thái bị tác động hoặc đã xong",
                                    rule: "Danh từ được ai đó làm cho như vậy (hoặc cảm xúc của người).",
                                    examples: ["**updated** schedule (lịch đã cập nhật)", "**revised** policy (chính sách đã sửa)", "**attached** file / **enclosed** document (tài liệu đính kèm)", "**qualified** candidate / **limited** time"],
                                    tone: "amber"
                                }
                            ]
                        }
                    ],
                    comparisonSection: {
                        title: "8 Cặp Tính từ cùng gốc cực dễ nhầm nghĩa trong TOEIC",
                        subtitle: "Đọc kỹ ngữ cảnh câu khi 2 đáp án cùng là Tính từ khác đuôi",
                        columnsClass: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3",
                        pairs: [
                            { title: "Cặp 1: Kinh tế vs Tiết kiệm", items: [{ word: "economic", tag: "Thuộc kinh tế", meaning: "economic growth (tăng trưởng kinh tế)", tone: "indigo" }, { word: "economical", tag: "Tiết kiệm", meaning: "economical car (xe tiết kiệm nhiên liệu)", tone: "emerald" }] },
                            { title: "Cặp 2: Đáng kể vs Chu đáo", items: [{ word: "considerable", tag: "Đáng kể / Lớn", meaning: "considerable cost (chi phí đáng kể)", tone: "indigo" }, { word: "considerate", tag: "Chu đáo", meaning: "considerate staff (nhân viên ân cần)", tone: "emerald" }] },
                            { title: "Cặp 3: Tương đương vs Tương đối", items: [{ word: "comparable", tag: "Tương đương", meaning: "comparable quality (chất lượng ngang nhau)", tone: "indigo" }, { word: "comparative", tag: "So sánh", meaning: "comparative study (nghiên cứu đối chiếu)", tone: "emerald" }] },
                            { title: "Cặp 4: Tự tin vs Bảo mật", items: [{ word: "confident", tag: "Tự tin", meaning: "confident speaker (người nói tự tin)", tone: "indigo" }, { word: "confidential", tag: "Bảo mật / Kín", meaning: "confidential file (tài liệu mật)", tone: "rose" }] },
                            { title: "Cặp 5: Am hiểu vs Nhiều thông tin", items: [{ word: "informed", tag: "Am hiểu / Biết tin", meaning: "well-informed decision", tone: "indigo" }, { word: "informative", tag: "Bổ ích", meaning: "informative seminar (hội thảo nhiều thông tin)", tone: "emerald" }] },
                            { title: "Cặp 6: Kính trọng / Tương ứng / Đáng kính", items: [{ word: "respectful", tag: "Lễ phép", meaning: "respectful tone", tone: "indigo" }, { word: "respective", tag: "Tương ứng", meaning: "their respective roles", tone: "amber" }, { word: "respectable", tag: "Đáng kính", meaning: "a respectable company", tone: "emerald" }] },
                            { title: "Cặp 7: Thành công vs Liên tiếp", items: [{ word: "successful", tag: "Thành công", meaning: "successful launch", tone: "indigo" }, { word: "successive", tag: "Liên tiếp", meaning: "three successive years", tone: "emerald" }] },
                            { title: "Cặp 8: Thuận lợi vs Yêu thích", items: [{ word: "favorable", tag: "Thuận lợi", meaning: "favorable terms (điều khoản có lợi)", tone: "indigo" }, { word: "favorite", tag: "Yêu thích", meaning: "favorite brand", tone: "emerald" }] }
                        ]
                    }
                },
                table: {
                    head: ["Phân loại / Cặp dễ nhầm", "Hậu tố, Cách dùng & Ví dụ TOEIC"],
                    rows: [
                        ["**Hậu tố nhận diện Tính từ**", "**-able/-ible, -ful/-less, -ive, -ous, -al, -ic, -ant/-ent, -y** (reliable, effective, annual, important)"],
                        ["**Bẫy: Đuôi -ly nhưng là Tính từ**", "**costly, timely, friendly, likely, orderly, daily, weekly, monthly, quarterly** (không phải trạng từ!)"],
                        ["**Tính từ đuôi -ing (chủ động / bản chất)**", "**growing demand** (nhu cầu đang tăng), **existing system** (hệ thống hiện có), **leading provider** (nhà cung cấp hàng đầu), **challenging task** (nhiệm vụ đầy thách thức)"],
                        ["**Tính từ đuôi -ed (bị động / đã hoàn tất)**", "**updated schedule** (lịch trình đã cập nhật), **revised policy** (chính sách đã sửa đổi), **attached file** (tệp đính kèm), **enclosed document** (tài liệu đính kèm), **qualified candidate** (ứng viên đủ điều kiện), **limited time** (thời gian có hạn)"],
                        ["**Cặp dễ nhầm 1: economic / economical**", "**economic** (thuộc kinh tế) vs **economical** (tiết kiệm, kinh tế)"],
                        ["**Cặp dễ nhầm 2: considerable / considerate**", "**considerable** (đáng kể, nhiều) vs **considerate** (chu đáo, ân cần)"],
                        ["**Cặp dễ nhầm 3: comparable / comparative**", "**comparable** (tương đương, có thể so sánh) vs **comparative** (tương đối, mang tính so sánh)"],
                        ["**Cặp dễ nhầm 4: confident / confidential**", "**confident** (tự tin) vs **confidential** (bảo mật, kín)"],
                        ["**Cặp dễ nhầm 5: informed / informative**", "**informed** (am hiểu, được thông báo) vs **informative** (cung cấp nhiều thông tin)"],
                        ["**Cặp dễ nhầm 6: respectful / respective / respectable**", "**respectful** (lễ phép, kính trọng) vs **respective** (tương ứng) vs **respectable** (đáng kính, kha khá)"],
                        ["**Cặp dễ nhầm 7: successful / successive**", "**successful** (thành công) vs **successive** (liên tiếp, kế tiếp)"],
                        ["**Cặp dễ nhầm 8: favorable / favorite**", "**favorable** (thuận lợi, tán thành) vs **favorite** (yêu thích nhất)"]
                    ]
                },
                positionTable: {
                    head: ["Vị trí chuẩn & Cấu trúc vàng", "Ví dụ"],
                    rows: [
                        ["**Đứng trước danh từ**", "a **reliable** supplier; an **updated** schedule"],
                        ["**Sau động từ nối (Linking Verbs)** (be, become, remain, seem, appear, feel, look, stay, prove)", "The instructions remain **clear**; the new software proved **effective**."],
                        ["**Cấu trúc 'vàng' V + O + Adj** (make, keep, find, consider, deem, leave, render + O + Adj)", "**make** the process **efficient**; **keep** clients **informed**; **find** the proposal **acceptable**"]
                    ]
                },
                points: [
                    "Gặp **make / keep / find / consider / deem / leave / render + Tân ngữ + ___**, chọn ngay **Tính từ** (rất nhiều thí sinh bị bẫy chọn Trạng từ).",
                    "Nhớ kỹ nhóm **tính từ đuôi -ly** (**costly, timely, friendly, likely, orderly, daily, weekly, monthly, quarterly**) để không nhầm sang trạng từ."
                ]
            },
            {
                heading: "Bài 3: Trạng từ (Adverbs) — Hậu tố & Các cặp trạng từ gây bẫy",
                visual: {
                    wordTypeKey: "adverb",
                    wordTypeLabel: "Trạng từ",
                    shortTitle: "Trạng từ (Adverbs)",
                    subtitle: "Hậu tố -ly • 5 Vị trí • 9 Cặp bẫy 650+",
                    color: "violet",
                    icon: "fa-gauge-high",
                    suffixGroups: [
                        { suffix: "Adj + -ly", meaning: "Quy tắc tạo Trạng từ phổ biến nhất", examples: ["quickly", "efficiently", "carefully", "promptly"] },
                        { suffix: "Biến đổi chính tả (-y → -ily / -le → -ly)", meaning: "Lưu ý dạng viết đúng", examples: ["easily", "possibly", "truly"] },
                        { suffix: "Trạng từ bất quy tắc", meaning: "Không thêm -ly", examples: ["well", "fast", "hard"] }
                    ],
                    trapGroups: [
                        {
                            title: "Cảnh giác: Phân biệt Trạng từ -ly vs Tính từ -ly",
                            note: "Các từ sau là TÍNH TỪ dù kết thúc bằng -ly — đừng chọn cho vị trí bổ nghĩa động từ!",
                            words: [
                                { word: "costly", meaning: "tính từ (đắt đỏ)" },
                                { word: "timely", meaning: "tính từ (kịp thời)" },
                                { word: "friendly", meaning: "tính từ (thân thiện)" },
                                { word: "likely", meaning: "tính từ (có khả năng)" },
                                { word: "orderly", meaning: "tính từ (ngăn nắp)" },
                                { word: "daily / weekly / monthly / quarterly", meaning: "tính từ / định kỳ" }
                            ]
                        }
                    ],
                    positions: [
                        { label: "Vị trí 1", formula: "[Adv], + S + V + O", desc: "Đứng đầu câu trước dấu phẩy để bổ nghĩa cho cả câu", example: "**Unfortunately**, the event was postponed; **Additionally**, ..." },
                        { label: "Vị trí 2", formula: "V + [Adv]  hoặc  [Adv] + V", desc: "Bổ nghĩa trực tiếp cho động từ thường", example: "work **efficiently**; **strongly** recommend" },
                        { label: "Vị trí 3", formula: "aux / be / have + [Adv] + V", desc: "Xen giữa trợ động từ (will, has, is...) và động từ chính", example: "will **soon** launch; has **recently** completed; is **widely** recognized" },
                        { label: "Vị trí 4", formula: "[Adv] + Adj  /  [Adv] + Adv", desc: "Đứng ngay trước để nhấn mạnh mức độ cho Tính từ hoặc Trạng từ khác", example: "**highly** qualified; **very** quickly" },
                        { label: "Vị trí 5", formula: "[Adv] + Số / Giới từ / Liên từ", desc: "Bổ nghĩa ngay trước lượng từ, giới từ hoặc liên từ", example: "**approximately** 50; **shortly** after; **directly** to" }
                    ],
                    focusBlocks: [],
                    comparisonSection: {
                        title: "9 Cặp Trạng từ khác nghĩa hoàn toàn khi thêm -ly (Gài bẫy mức 650+)",
                        subtitle: "Không phải thêm -ly chỉ để thành trạng từ — 9 cặp này đổi hẳn nghĩa so với từ gốc!",
                        columnsClass: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3",
                        pairs: [
                            { title: "Cặp 1: hard vs hardly", items: [{ word: "hard", tag: "Chăm chỉ / Mạnh", meaning: "work hard (làm việc chăm chỉ)", tone: "indigo" }, { word: "hardly", tag: "Hầu như không", meaning: "hardly ever (hầu như không bao giờ)", tone: "rose" }] },
                            { title: "Cặp 2: late vs lately", items: [{ word: "late", tag: "Muộn / Trễ", meaning: "arrive late (đến muộn)", tone: "indigo" }, { word: "lately", tag: "Gần đây", meaning: "= recently (thời gian gần đây)", tone: "emerald" }] },
                            { title: "Cặp 3: near vs nearly", items: [{ word: "near", tag: "Gần (vị trí)", meaning: "live near the station", tone: "indigo" }, { word: "nearly", tag: "Gần như / Xấp xỉ", meaning: "= almost (nearly 500 guests)", tone: "emerald" }] },
                            { title: "Cặp 4: high vs highly", items: [{ word: "high", tag: "Cao (vị trí/mức)", meaning: "fly high / aim high", tone: "indigo" }, { word: "highly", tag: "Rất / Cực kỳ", meaning: "highly qualified (rất có năng lực)", tone: "emerald" }] },
                            { title: "Cặp 5: close vs closely", items: [{ word: "close", tag: "Gần (khoảng cách)", meaning: "sit close together", tone: "indigo" }, { word: "closely", tag: "Chặt chẽ / Kỹ", meaning: "work closely (hợp tác chặt chẽ)", tone: "emerald" }] },
                            { title: "Cặp 6: short vs shortly", items: [{ word: "short", tag: "Ngắn / Thiếu", meaning: "fall short of expectations", tone: "indigo" }, { word: "shortly", tag: "Chẳng bao lâu", meaning: "shortly after (ngay sau khi)", tone: "emerald" }] },
                            { title: "Cặp 7: wide vs widely", items: [{ word: "wide", tag: "Rộng mở", meaning: "open wide", tone: "indigo" }, { word: "widely", tag: "Rộng rãi", meaning: "widely recognized (được công nhận rộng rãi)", tone: "emerald" }] },
                            { title: "Cặp 8: most vs mostly", items: [{ word: "most", tag: "Nhất / Hầu hết", meaning: "the most efficient way", tone: "indigo" }, { word: "mostly", tag: "Chủ yếu là", meaning: "= mainly (mostly online)", tone: "emerald" }] },
                            { title: "Cặp 9: free vs freely", items: [{ word: "free", tag: "Miễn phí", meaning: "enter free of charge", tone: "indigo" }, { word: "freely", tag: "Tự do / Thoải mái", meaning: "speak freely (nói thoải mái)", tone: "emerald" }] }
                        ]
                    }
                },
                table: {
                    head: ["Hậu tố / Cặp trạng từ khác nghĩa khi có -ly (650+)", "Phân biệt nghĩa & Ví dụ TOEIC"],
                    rows: [
                        ["**Hậu tố nhận diện Trạng từ**", "**Adj + -ly** (**quickly, efficiently, carefully**) — cảnh giác không nhầm với tính từ đuôi -ly (**costly, timely, friendly, likely, orderly, daily, weekly, monthly, quarterly**)"],
                        ["**hard / hardly**", "**hard** (chăm chỉ, vất vả, mạnh) vs **hardly** (hầu như không)"],
                        ["**late / lately**", "**late** (muộn, trễ) vs **lately** (gần đây = recently)"],
                        ["**near / nearly**", "**near** (gần về khoảng cách) vs **nearly** (gần như, xấp xỉ = almost)"],
                        ["**high / highly**", "**high** (cao về vị trí/mức độ) vs **highly** (rất, cực kỳ: **highly qualified**)"],
                        ["**close / closely**", "**close** (gần) vs **closely** (chặt chẽ, kỹ lưỡng: **work closely**)"],
                        ["**short / shortly**", "**short** (ngắn, thiếu) vs **shortly** (chẳng bao lâu nữa: **shortly after**)"],
                        ["**wide / widely**", "**wide** (rộng mở) vs **widely** (rộng rãi: **widely recognized**)"],
                        ["**most / mostly**", "**most** (nhất / hầu hết) vs **mostly** (chủ yếu là = mainly)"],
                        ["**free / freely**", "**free** (miễn phí) vs **freely** (tự do, thoải mái)"]
                    ]
                },
                positionTable: {
                    head: ["Vị trí ăn điểm nhanh của Trạng từ", "Ví dụ"],
                    rows: [
                        ["**Đầu câu trước dấu phẩy** (bổ nghĩa cả câu)", "**Unfortunately**, the event was postponed; **Additionally**, ..."],
                        ["**Bổ nghĩa cho động từ thường**", "work **efficiently**; **strongly** recommend"],
                        ["**Xen giữa trợ động từ / be / have và động từ chính**", "will **soon** launch; has **recently** completed; is **widely** recognized"],
                        ["**Đứng trước tính từ hoặc trạng từ khác**", "**highly** qualified; **very** quickly"],
                        ["**Đứng trước lượng từ / giới từ / liên từ**", "**approximately** 50; **shortly** after; **directly** to"]
                    ]
                },
                points: [
                    "Khi câu đã đầy đủ thành phần (**S + V + O**), bỏ chỗ trống đi mà câu vẫn đúng ngữ pháp thì chỗ trống thường là **Trạng từ**."
                ]
            },
            {
                heading: "Bài 4: Động từ (Verbs) — Hậu tố & Cấu trúc trong câu Word Form",
                visual: {
                    wordTypeKey: "verb",
                    wordTypeLabel: "Động từ",
                    shortTitle: "Động từ (Verbs)",
                    subtitle: "Hậu tố -ate • V chính • Giả định & Bị động",
                    color: "amber",
                    icon: "fa-bolt",
                    suffixGroups: [
                        { suffix: "-ize / -ise", meaning: "Làm cho trở nên, hóa", examples: ["organize", "specialize", "finalize"] },
                        { suffix: "-ify / -en", meaning: "Tạo ra, làm tăng/giảm", examples: ["simplify", "qualify", "strengthen", "lengthen"] },
                        { suffix: "-ate", meaning: "Thực hiện hành động", examples: ["negotiate", "operate", "coordinate"] }
                    ],
                    trapGroups: [
                        {
                            title: "Bẫy đa năng: Đuôi -ate vừa là Động từ, vừa là Tính từ / Danh từ",
                            note: "Bắt buộc xét vị trí đứng sau chủ ngữ/modal hay đứng trước danh từ/sau mạo từ!",
                            words: [
                                { word: "associate", meaning: "liên kết (V) / cộng sự (N)" },
                                { word: "delegate", meaning: "ủy quyền (V) / đại biểu (N)" },
                                { word: "appropriate", meaning: "thích hợp (Adj) / trích quỹ (V)" },
                                { word: "separate", meaning: "tách rời (V) / riêng biệt (Adj)" },
                                { word: "certificate", meaning: "giấy chứng nhận (N)" }
                            ]
                        }
                    ],
                    positions: [
                        { label: "Vị trí 1", formula: "Chủ ngữ (S) + [V chính chia thì]", desc: "Động từ chính tạo vị ngữ cho câu (khi câu chưa có động từ chính)", example: "The company **expanded** its overseas operations." },
                        { label: "Vị trí 2", formula: "Modal / to + [V0 nguyên mẫu]", desc: "Sau will, can, should, must, may hoặc sau giới từ to (chỉ mục đích/kế hoạch)", example: "The team will **submit** the report; they plan to **renovate**." },
                        { label: "Cấu trúc ĐẶC BIỆT", formula: "suggest / require + that + S + [V0]", desc: "Thức giả định (Subjunctive): luôn dùng V0, KHÔNG thêm -s/-es hay quá khứ", example: "The policy requires that every visitor **sign** in." }
                    ],
                    focusBlocks: [
                        {
                            kind: "decisionSplit",
                            title: "Bước 1 khi gặp đáp án Động từ: Kiểm tra câu đã có ĐỘNG TỪ CHÍNH chưa?",
                            subtitle: "Một mệnh đề đơn chỉ có DUY NHẤT 1 động từ chính chia thì",
                            branches: [
                                {
                                    badge: "CHƯA có Động từ chính",
                                    title: "Chỗ trống chính là ĐỘNG TỪ CHÍNH",
                                    rule: "Chia theo thì và hòa hợp số ít / số nhiều với Chủ ngữ chính.",
                                    examples: ["The new software **reduces** processing time.", "All applications **require** supervisor approval."],
                                    tone: "amber"
                                },
                                {
                                    badge: "ĐÃ CÓ Động từ chính",
                                    title: "LOẠI ngay đáp án chia thì",
                                    rule: "Chỗ trống lúc này cần Danh từ, Tính từ, Trạng từ hoặc Phân từ rút gọn (V-ing / V3/ed).",
                                    examples: ["Employees **attending** the seminar will receive credits.", "The schedule **updated** yesterday is now posted."],
                                    tone: "indigo"
                                }
                            ]
                        }
                    ],
                    comparisonSection: {
                        title: "2 Bẫy kinh điển dễ nhầm với câu Động từ Word Form",
                        subtitle: "Nhìn thật kỹ trợ động từ 'be' và động từ chính của cả câu trước khi chốt đáp án",
                        columnsClass: "grid-cols-1 md:grid-cols-2 gap-4",
                        pairs: [
                            {
                                title: "Bẫy 1: Câu bị động be + (Adv) + V3/ed",
                                items: [
                                    { word: "is ___ recognized", tag: "Chọn Trạng từ", meaning: "Đã có đủ be + V3/ed → chỗ trống xen giữa là Trạng từ (widely)", tone: "emerald" },
                                    { word: "will be ___ soon", tag: "Chọn V3/ed", meaning: "Thiếu phân từ bị động hoàn chỉnh sau be → chọn V3/ed (completed)", tone: "amber" }
                                ]
                            },
                            {
                                title: "Bẫy 2: Rút gọn Mệnh đề quan hệ (khi đã có V chính)",
                                items: [
                                    { word: "N + V-ing (chủ động)", tag: "Chủ động", meaning: "Customers **purchasing** tickets online get a discount. (V chính: get)", tone: "indigo" },
                                    { word: "N + V3/ed (bị động)", tag: "Bị động", meaning: "The documents **enclosed** in this folder are confidential. (V chính: are)", tone: "rose" }
                                ]
                            }
                        ]
                    }
                },
                table: {
                    head: ["Hậu tố, Quy tắc & Cấu trúc Động từ", "Cách nhận diện & Ví dụ TOEIC"],
                    rows: [
                        ["**Hậu tố nhận diện Động từ**", "**-ize/-ise, -ify, -en, -ate** (**organize, simplify, strengthen, negotiate, operate**)"],
                        ["**Bẫy: Đuôi -ate vừa là Verb, vừa là Adj / Noun**", "**associate, delegate, appropriate, separate, certificate** (cần xét vị trí và chức năng trong câu để biết là Động từ, Tính từ hay Danh từ)"],
                        ["**Kiểm tra động từ chính chia thì**", "Xác định xem câu đã có **động từ chính chia thì** (finite verb) chưa: nếu **chưa có** → chỗ trống cần **Động từ chính**; nếu **đã có** → chỗ trống cần Danh từ / Tính từ / Phân từ"],
                        ["**Động từ nguyên mẫu (V0) sau modal & to**", "Sau động từ khuyết thiếu (**will, can, should, must, may**) và sau **to**: The team will **submit** the report; plan to **renovate**"],
                        ["**Cấu trúc giả định (Subjunctive) đặc trưng TOEIC**", "**suggest / recommend / require / request / insist / imperative + that + S + V0** (luôn dùng V0 nguyên mẫu): The policy requires that every visitor **sign** in."],
                        ["**Bẫy bị động: be + (Adv) + V3/ed**", "Nếu câu có **be + ___ + V3/ed**, chỗ trống xen giữa cần **Trạng từ** (is **widely** recognized); nếu thiếu V3/ed mới chọn phân từ bị động"],
                        ["**Bẫy rút gọn mệnh đề quan hệ (V-ing / V3/ed)**", "Khi câu **đã có động từ chính**, cụm bổ nghĩa ngay sau danh từ dùng **V-ing** (chủ động) hoặc **V3/ed** (bị động), không chia lại động từ chính"]
                    ]
                },
                points: [
                    "Bước đầu tiên khi làm câu Word Form có đáp án dạng động từ là **tìm chủ ngữ và động từ chính của cả câu**.",
                    "Trong cấu trúc giả định (**suggest / recommend / require / request / insist / imperative + that + S + V0**), không thêm `-s/-es` hay chia quá khứ dù chủ ngữ số ít."
                ]
            }
        ],
        traps: [
            "Nhóm bẫy đuôi từ đặc sản TOEIC: **-al** (approval, proposal), **-ive** (representative, incentive), **-ly** (costly, timely, friendly), **-ant/-ent** (applicant, consultant) và **-ate** (associate, certificate).",
            "Cấu trúc **V + O + Adj** (**make / keep / find / consider / deem / leave / render + O + Adj**) rất hay gài bẫy chọn nhầm sang Trạng từ.",
            "Các cặp tính từ cùng gốc dễ nhầm (**economic/economical, considerable/considerate, confident/confidential, respectful/respective/respectable**) và cặp trạng từ **hard/hardly, late/lately, near/nearly, high/highly, short/shortly**.",
            "Nhầm lẫn câu đã có động từ chính chia thì với rút gọn mệnh đề quan hệ (**V-ing / V3/ed**) hoặc cấu trúc giả định **that + S + V0**."
        ],
        tips: [
            "Bước 1: Nhìn 4 đáp án để phân loại nhanh **Noun / Verb / Adj / Adv** và cảnh giác các đuôi bẫy.",
            "Bước 2: Kiểm tra câu đã có **động từ chính chia thì** chưa để quyết định chọn Động từ chính hay loại bỏ đáp án động từ.",
            "Bước 3: Xét từ đứng **trước và sau chỗ trống** (mạo từ, giới từ, linking verb, V + O + ___, trợ động từ + ___ + V, hoặc sau V-ing có tân ngữ trực tiếp hay giới từ)."
        ]
    },

    // ======================= 21. QUANTIFIERS =======================
    "gram-21-quantifiers": {
        intro: "Từ chỉ số lượng đứng trước danh từ để nói về số lượng. Điều cần nắm là loại danh từ mà mỗi từ đi kèm (đếm được số ít, số nhiều, không đếm được).",
        sections: [
            {
                heading: "1. Bảng từ chỉ số lượng",
                table: {
                    head: ["Đi với", "Từ chỉ số lượng"],
                    rows: [
                        ["N đếm được số ít", "each, every, another, either, neither, one"],
                        ["N đếm được số nhiều", "many, (a) few, several, a number of, both, various, numerous, a variety of, a range of"],
                        ["N không đếm được", "much, (a) little, a great deal of, a large amount of"],
                        ["Cả hai (số nhiều & không đếm được)", "some, any, all, most, a lot of, lots of, plenty of, no, other, more"]
                    ]
                }
            },
            {
                heading: "2. Few / A few / Little / A little",
                points: [
                    "a few / a little: một vài, một chút (đủ dùng – nghĩa tích cực).",
                    "few / little: rất ít, hầu như không (nghĩa tiêu cực)."
                ]
            },
            {
                heading: "3. Most / Almost / Most of",
                points: [
                    "most + N (chung chung): Most employees agree.",
                    "most of + the/my/these + N (xác định): Most of the employees agree.",
                    "almost là trạng từ: almost all (of) the employees, almost every employee."
                ]
            },
            {
                heading: "4. Other / Another / The other / Others",
                points: [
                    "another + N số ít (một cái khác); another + số + N số nhiều (thêm...).",
                    "other + N số nhiều / không đếm được.",
                    "the other + N (cái còn lại trong số đã xác định); others = other + N số nhiều (đại từ)."
                ]
            }
        ],
        traps: ["'Each/Every + N số ít + V số ít' – không bao giờ đi với danh từ số nhiều."],
        tips: ["Nhìn danh từ sau chỗ trống (số ít/số nhiều/không đếm được) để loại đáp án."]
    },

    // ======================= 22. COMPREHENSIVE STRUCTURES =======================
    "gram-22-comprehensive-structures": {
        intro: "Phần tổng hợp các cấu trúc câu không thuộc riêng chủ đề nào nhưng xuất hiện đều đặn trong Part 5 – 6: cấu trúc song song, so...that, too...to, đại từ...",
        sections: [
            {
                heading: "1. Cấu trúc song song (Parallelism)",
                points: [
                    "Các thành phần nối bởi and/or/but/as well as/rather than/both...and phải cùng dạng: N – N, V-ing – V-ing, to V – (to) V, adj – adj.",
                    "Ví dụ: The job involves <b>planning</b>, <b>organizing</b>, and <b>supervising</b> events."
                ]
            },
            {
                heading: "2. Cấu trúc kết quả và mức độ",
                table: {
                    head: ["Cấu trúc", "Ví dụ"],
                    rows: [
                        ["so + adj/adv + that + S + V", "The demand was so high that we sold out."],
                        ["such + (a/an) + adj + N + that", "It was such a popular event that tickets ran out."],
                        ["too + adj/adv + (for O) + to V", "The room is too small to hold 50 people."],
                        ["adj/adv + enough + to V", "The hall is large enough to seat 500."],
                        ["enough + N + to V", "We have enough staff to cover the shift."]
                    ]
                }
            },
            {
                heading: "3. Đại từ (Pronouns)",
                table: {
                    head: ["Chủ ngữ", "Tân ngữ", "TT sở hữu", "Đại từ sở hữu", "Phản thân"],
                    rows: [
                        ["I", "me", "my", "mine", "myself"],
                        ["you", "you", "your", "yours", "yourself"],
                        ["he / she", "him / her", "his / her", "his / hers", "himself / herself"],
                        ["it", "it", "its", "—", "itself"],
                        ["we", "us", "our", "ours", "ourselves"],
                        ["they", "them", "their", "theirs", "themselves"]
                    ]
                },
                points: [
                    "Tính từ sở hữu + N; đại từ sở hữu đứng một mình (= TT sở hữu + N).",
                    "Phản thân: chủ ngữ và tân ngữ là một; nhấn mạnh; by + oneself (= alone).",
                    "those who + V (những người mà); those + V-ing/V3 (rút gọn)."
                ]
            },
            {
                heading: "4. Cấu trúc thông dụng khác",
                points: [
                    "It takes + O + time + to V; spend + time + V-ing.",
                    "would like + to V; be used to + V-ing (quen với) vs. used to + V (đã từng).",
                    "prefer + V-ing + to + V-ing; would rather + V + than + V.",
                    "It is + adj + for O + to V; find it + adj + to V."
                ]
            }
        ],
        traps: [
            "Phá vỡ cấu trúc song song: 'organizing, planning and to supervise' là SAI.",
            "Nhầm 'its' (tính từ sở hữu) với 'it's' (it is)."
        ],
        tips: ["Thấy and/or ở gần chỗ trống → xem các thành phần đã cho có dạng gì và chọn đáp án cùng dạng."]
    }
};

/**
 * BỔ SUNG CÂU HỎI LUYỆN TẬP PART 5 (Câu 3, 4, 5) CHO ĐỦ 5 CÂU / CHUYÊN ĐỀ (Tổng 110 câu trên 22 chuyên đề)
 */
window.GRAMMAR_EXTRA_QUESTIONS = {
    "gram-01-verb-tenses": [
        {
            q: "3. Next Friday, the board of directors _______ to vote on the proposed acquisition of TechNova Inc.",
            options: ["(A) met", "(B) will meet", "(C) has met", "(D) had met"],
            correctIndex: 1,
            explanation: "Có dấu hiệu thời gian tương lai 'Next Friday' (Thứ Sáu tới) -> chia thì Tương lai đơn: (B) will meet."
        },
        {
            q: "4. Ms. Gomez _______ the financial audit before the regional director arrived at the branch office yesterday.",
            options: ["(A) completes", "(B) will complete", "(C) had completed", "(D) is completing"],
            correctIndex: 2,
            explanation: "Hành động xảy ra và hoàn tất trước một hành động khác trong quá khứ ('before the regional director arrived... yesterday') -> chia Quá khứ hoàn thành: (C) had completed."
        },
        {
            q: "5. Currently, our software engineers _______ a security patch to resolve the login issue.",
            options: ["(A) are developing", "(B) developed", "(C) had developed", "(D) were developing"],
            correctIndex: 0,
            explanation: "Trạng từ 'Currently' (Hiện tại) ở đầu câu là dấu hiệu của thì Hiện tại tiếp diễn -> chọn (A) are developing."
        }
    ],
    "gram-02-sequence-of-tenses": [
        {
            q: "3. Once the safety inspection _______ completed, the factory will resume normal operations.",
            options: ["(A) will be", "(B) is", "(C) was", "(D) had been"],
            correctIndex: 1,
            explanation: "Mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng 'Once' (Một khi) đi với mệnh đề chính ở tương lai ('will resume') -> chia Hiện tại đơn: (B) is."
        },
        {
            q: "4. Since the company _______ its loyalty program last May, customer retention has increased by 18%.",
            options: ["(A) launches", "(B) launched", "(C) has launched", "(D) will launch"],
            correctIndex: 1,
            explanation: "Cấu trúc 'Since + Quá khứ đơn (last May), Hiện tại hoàn thành' -> chọn (B) launched."
        },
        {
            q: "5. By the time the keynote speaker arrived, most of the attendees _______ their seats in the main hall.",
            options: ["(A) take", "(B) have taken", "(C) had already taken", "(D) will have taken"],
            correctIndex: 2,
            explanation: "Cấu trúc 'By the time + Quá khứ đơn (arrived)', mệnh đề chính chia Quá khứ hoàn thành -> chọn (C) had already taken."
        }
    ],
    "gram-03-subject-verb-agreement": [
        {
            q: "3. Neither the sales representatives nor the branch manager _______ aware of the schedule change.",
            options: ["(A) were", "(B) are", "(C) was", "(D) have been"],
            correctIndex: 2,
            explanation: "Cấu trúc 'Neither A nor B' chia động từ theo chủ ngữ gần nhất là 'the branch manager' (danh từ số ít) -> chọn (C) was."
        },
        {
            q: "4. Reviewing all the vendor contracts before the end of the fiscal quarter _______ a great deal of attention.",
            options: ["(A) require", "(B) requires", "(C) requiring", "(D) are requiring"],
            correctIndex: 1,
            explanation: "Chủ ngữ chính là Danh động từ (V-ing) 'Reviewing...' luôn chia động từ ở ngôi thứ 3 số ít -> chọn (B) requires."
        },
        {
            q: "5. The chief executive officer, along with two legal advisors, _______ attending the international summit in Geneva.",
            options: ["(A) is", "(B) are", "(C) were", "(D) have been"],
            correctIndex: 0,
            explanation: "Chủ ngữ nối bằng 'along with' chia theo chủ ngữ đầu tiên 'The chief executive officer' (số ít) -> chọn (A) is."
        }
    ],
    "gram-04-gerunds": [
        {
            q: "3. Applicants can check the status of their submission by _______ into the recruitment portal.",
            options: ["(A) log", "(B) logged", "(C) logging", "(D) to log"],
            correctIndex: 2,
            explanation: "Đứng ngay sau giới từ 'by' cần một Danh động từ (V-ing) -> chọn (C) logging."
        },
        {
            q: "4. To reduce printing costs, the office manager recommended _______ double-sided copies for internal memos.",
            options: ["(A) use", "(B) to use", "(C) using", "(D) used"],
            correctIndex: 2,
            explanation: "Sau động từ 'recommend' không có 'that' hay tân ngữ chỉ người -> cộng trực tiếp V-ing: (C) using."
        },
        {
            q: "5. In addition to _______ regional sales, Mr. Park is also responsible for training new account executives.",
            options: ["(A) oversee", "(B) overseeing", "(C) oversaw", "(D) overseen"],
            correctIndex: 1,
            explanation: "Trong cụm 'In addition to' (Bên cạnh việc...), chữ 'to' là giới từ nên theo sau là V-ing -> chọn (B) overseeing."
        }
    ],
    "gram-05-infinitives": [
        {
            q: "3. The updated accounting software enables small business owners _______ their tax returns more accurately.",
            options: ["(A) prepare", "(B) preparing", "(C) to prepare", "(D) prepared"],
            correctIndex: 2,
            explanation: "Cấu trúc 'enable + Tân ngữ + to V_inf' (cho phép/giúp ai làm gì) -> chọn (C) to prepare."
        },
        {
            q: "4. Due to unforeseen supply chain delays, the contractor failed _______ the renovation project on schedule.",
            options: ["(A) complete", "(B) completing", "(C) to complete", "(D) completed"],
            correctIndex: 2,
            explanation: "Cấu trúc 'fail + to V_inf' (không thể hoàn thành/thất bại trong việc làm gì) -> chọn (C) to complete."
        },
        {
            q: "5. Please let our customer service team _______ if you have any questions regarding your monthly billing statement.",
            options: ["(A) know", "(B) to know", "(C) knowing", "(D) knew"],
            correctIndex: 0,
            explanation: "Động từ sai khiến 'let + Tân ngữ + V_nguyên_mẫu (không to)' -> chọn (A) know ('let our team know')."
        }
    ],
    "gram-06-subjunctive-mood": [
        {
            q: "3. The board of directors requested that the financial chief _______ a revised budget proposal by Friday.",
            options: ["(A) submits", "(B) submit", "(C) submitted", "(D) submitting"],
            correctIndex: 1,
            explanation: "Thức giả định sau 'requested that + S + V_nguyên_mẫu' -> chọn (B) submit (không chia -s dù chủ ngữ số ít)."
        },
        {
            q: "4. It is vital that confidential client data _______ shared with any unauthorized third parties.",
            options: ["(A) not be", "(B) is not", "(C) not to be", "(D) was not"],
            correctIndex: 0,
            explanation: "Giả định phủ định bị động sau 'It is vital that': 'S + not + be + V3/ed' -> chọn (A) not be."
        },
        {
            q: "5. The hospital administrator urged that every visitor _______ a visitor badge while on the premises.",
            options: ["(A) wears", "(B) wore", "(C) wear", "(D) wearing"],
            correctIndex: 2,
            explanation: "Sau 'urged that + S + V_nguyên_mẫu' -> chọn (C) wear."
        }
    ],
    "gram-07-modal-verbs": [
        {
            q: "3. Employees _______ share their login credentials with anyone, even with members of the IT department.",
            options: ["(A) must not", "(B) don't have to", "(C) ought not", "(D) might not"],
            correctIndex: 0,
            explanation: "Quy định bảo mật nghiêm cấm chia sẻ mật khẩu -> dùng 'must not' (cấm tuyệt đối)."
        },
        {
            q: "4. All travel expense claims must _______ to the accounting department within 14 days of returning from a trip.",
            options: ["(A) submit", "(B) be submitted", "(C) submitting", "(D) have submitted"],
            correctIndex: 1,
            explanation: "Chủ ngữ là vật ('travel expense claims') đứng trước Modal Verb 'must' và không có tân ngữ -> dùng bị động 'must be submitted'."
        },
        {
            q: "5. We _______ reserved a larger banquet hall, as more than 300 guests registered for the charity gala.",
            options: ["(A) should have", "(B) must be", "(C) would rather", "(D) had better"],
            correctIndex: 0,
            explanation: "'should have + V3/ed' (should have reserved) diễn tả sự tiếc nuối về một việc đáng lẽ nên làm trong quá khứ nhưng đã không làm."
        }
    ],
    "gram-08-passive-voice": [
        {
            q: "3. The newly renovated community library _______ to the public next Monday at 9:00 A.M.",
            options: ["(A) will open", "(B) will be opened", "(C) has opened", "(D) opening"],
            correctIndex: 1,
            explanation: "Chủ ngữ là 'library' được mở cửa đón công chúng vào thứ Hai tới -> bị động tương lai (B) will be opened."
        },
        {
            q: "4. All employees are required _______ the annual fire safety drill scheduled for Thursday afternoon.",
            options: ["(A) attend", "(B) attending", "(C) to attend", "(D) attended"],
            correctIndex: 2,
            explanation: "Cấu trúc bị động 'be required + to V_inf' (được yêu cầu làm gì) -> chọn (C) to attend."
        },
        {
            q: "5. The quarterly sales conference _______ at the Harborview Convention Center from May 12 to May 14.",
            options: ["(A) will take place", "(B) will be taken place", "(C) is taking place by", "(D) taken place"],
            correctIndex: 0,
            explanation: "Cụm động từ 'take place' (diễn ra) là nội động từ, KHÔNG bao giờ chia bị động -> chọn (A) will take place."
        }
    ],
    "gram-09-conditional-sentences": [
        {
            q: "3. _______ the merchandise arrives damaged, customers may return it for a full refund at no extra cost.",
            options: ["(A) In the event that", "(B) Because of", "(C) Despite", "(D) In case of"],
            correctIndex: 0,
            explanation: "Sau chỗ trống là một mệnh đề hoàn chỉnh ('the merchandise arrives damaged') -> cần liên từ điều kiện 'In the event that' (= If)."
        },
        {
            q: "4. If the marketing team had conducted more thorough focus group testing, the product launch _______ more successful.",
            options: ["(A) will be", "(B) would be", "(C) would have been", "(D) had been"],
            correctIndex: 2,
            explanation: "Mệnh đề If chia Quá khứ hoàn thành ('had conducted') -> Câu điều kiện loại 3, mệnh đề chính dùng 'would have + V3/ed': (C) would have been."
        },
        {
            q: "5. Visitors are welcome to use the guest parking lot _______ they display a valid temporary permit on their dashboard.",
            options: ["(A) as long as", "(B) unless", "(C) prior to", "(D) in spite of"],
            correctIndex: 0,
            explanation: "'as long as' (= provided that: miễn là) nối mệnh đề điều kiện hợp nghĩa nhất với câu."
        }
    ],
    "gram-10-reported-speech": [
        {
            q: "3. Our legal advisor _______ us that the new environmental regulations would take effect in January.",
            options: ["(A) said", "(B) explained", "(C) assured", "(D) mentioned"],
            correctIndex: 2,
            explanation: "Ngay sau chỗ trống có tân ngữ chỉ người 'us' + 'that'. Trong 4 đáp án chỉ có 'assure + Someone + that' đúng cấu trúc -> chọn (C) assured."
        },
        {
            q: "4. Several customers called to ask when the out-of-stock espresso machine _______ available again.",
            options: ["(A) would be", "(B) will it be", "(C) would it be", "(D) is"],
            correctIndex: 0,
            explanation: "Câu hỏi gián tiếp sau 'called to ask when...' không đảo trợ động từ lên trước chủ ngữ và lùi thì theo 'called' -> chọn (A) would be."
        },
        {
            q: "5. The receptionist reminded the visiting consultants _______ their ID badges at the front desk before leaving.",
            options: ["(A) return", "(B) returning", "(C) to return", "(D) returned"],
            correctIndex: 2,
            explanation: "Cấu trúc tường thuật lời nhắc: 'remind + Someone + to V_inf' -> chọn (C) to return."
        }
    ],
    "gram-11-tag-questions": [
        {
            q: "3. Let's review the quarterly marketing metrics before we meet with the client, _______?",
            options: ["(A) don't we", "(B) will we", "(C) shall we", "(D) aren't we"],
            correctIndex: 2,
            explanation: "Câu bắt đầu bằng 'Let's + V_inf' luôn dùng câu hỏi đuôi cố định là (C) shall we."
        },
        {
            q: "4. Ms. Patel was promoted to senior vice president of operations last month, _______?",
            options: ["(A) didn't she", "(B) wasn't she", "(C) hasn't she", "(D) isn't she"],
            correctIndex: 1,
            explanation: "Vế chính dùng 'was promoted' (Quá khứ đơn bị động với 'was'), chủ ngữ là 'Ms. Patel' (nữ) -> câu hỏi đuôi là (B) wasn't she."
        },
        {
            q: "5. Everything for tomorrow's product demonstration has been set up in the conference room, _______?",
            options: ["(A) haven't they", "(B) hasn't it", "(C) isn't it", "(D) WASN'T it"],
            correctIndex: 1,
            explanation: "Chủ ngữ 'Everything' được thay bằng đại từ 'it' ở phần đuôi, trợ động từ là 'has' -> chọn (B) hasn't it."
        }
    ],
    "gram-12-relative-clauses": [
        {
            q: "3. All brochures _______ at the trade show must be approved by the communications director first.",
            options: ["(A) distribute", "(B) distributing", "(C) distributed", "(D) will distribute"],
            correctIndex: 2,
            explanation: "Câu đã có động từ chính 'must be approved'. Chỗ trống rút gọn mệnh đề quan hệ bị động ('which are distributed') bổ nghĩa cho 'All brochures' -> chọn (C) distributed."
        },
        {
            q: "4. The boutique hotel _______ the annual leadership retreat will be held overlooks the Pacific Ocean.",
            options: ["(A) which", "(B) where", "(C) whose", "(D) when"],
            correctIndex: 1,
            explanation: "'The boutique hotel' là danh từ chỉ nơi chốn, và mệnh đề theo sau ('the annual leadership retreat will be held') đã đủ chủ ngữ và động từ bị động -> dùng trạng từ quan hệ chỉ nơi chốn (B) where (= at which)."
        },
        {
            q: "5. The human resources department interviewed twelve candidates, three of _______ were offered full-time positions.",
            options: ["(A) who", "(B) whom", "(C) which", "(D) that"],
            correctIndex: 1,
            explanation: "Sau giới từ 'of' thay thế cho danh từ chỉ người ('twelve candidates') bắt buộc dùng đại từ quan hệ (B) whom ('three of whom')."
        }
    ],
    "gram-13-types-of-clauses": [
        {
            q: "3. _______ the board of directors will approve the overseas expansion plan remains uncertain.",
            options: ["(A) What", "(B) Whether", "(C) Which", "(D) If"],
            correctIndex: 1,
            explanation: "Mệnh đề danh từ đứng đầu câu làm chủ ngữ cho động từ 'remains uncertain' mang nghĩa 'Liệu rằng...' -> chỉ dùng (B) Whether (không dùng 'If' đứng đầu câu làm chủ ngữ)."
        },
        {
            q: "4. Once _______ by both parties, the lease agreement cannot be modified without written consent.",
            options: ["(A) sign", "(B) signing", "(C) signed", "(D) to sign"],
            correctIndex: 2,
            explanation: "Rút gọn mệnh đề trạng ngữ đồng chủ ngữ ('the lease agreement' - hợp đồng thuê) mang nghĩa bị động sau liên từ 'Once' -> chọn (C) signed."
        },
        {
            q: "5. We are committed to delivering _______ our clients need to succeed in a competitive marketplace.",
            options: ["(A) that", "(B) what", "(C) which", "(D) whether"],
            correctIndex: 1,
            explanation: "Động từ 'delivering' thiếu tân ngữ và động từ 'need' phía sau cũng thiếu tân ngữ -> dùng 'what' (= the things that: những thứ mà)."
        }
    ],
    "gram-14-inversion": [
        {
            q: "3. Rarely _______ such a high level of customer satisfaction in our annual retail survey.",
            options: ["(A) we have seen", "(B) have we seen", "(C) we saw", "(D) did we seen"],
            correctIndex: 1,
            explanation: "Trạng từ phủ định 'Rarely' đứng đầu câu -> bắt buộc đảo trợ động từ lên trước chủ ngữ: 'have we seen'."
        },
        {
            q: "4. _______ is a copy of the revised service contract for your review and signature.",
            options: ["(A) Attaching", "(B) Attached", "(C) Attach", "(D) To attach"],
            correctIndex: 1,
            explanation: "Cấu trúc đảo ngữ phân từ đầu câu trong email thương mại: 'Attached / Enclosed is + Cụm danh từ' (= A copy of the contract is attached)."
        },
        {
            q: "5. Not only _______ the new packaging reduce shipping weight, but it is also 100% recyclable.",
            options: ["(A) do", "(B) does", "(C) is", "(D) has"],
            correctIndex: 1,
            explanation: "'Not only' đứng đầu câu đi với chủ ngữ số ít 'the new packaging' và động từ nguyên mẫu 'reduce' -> đảo trợ động từ (B) does."
        }
    ],
    "gram-15-articles": [
        {
            q: "3. Applicants must hold _______ bachelor's degree in computer science or a closely related field.",
            options: ["(A) a", "(B) an", "(C) the", "(D) some"],
            correctIndex: 0,
            explanation: "'bachelor's degree' là danh từ đếm được số ít chưa xác định, bắt đầu bằng phụ âm /b/ -> dùng mạo từ (A) a."
        },
        {
            q: "4. Mr. Sato was appointed as _______ chief financial officer of Kanto Logistics last week.",
            options: ["(A) a", "(B) an", "(C) the", "(D) one"],
            correctIndex: 2,
            explanation: "Chức vụ duy nhất tại một công ty cụ thể ('chief financial officer of Kanto Logistics') -> dùng mạo từ xác định (C) the."
        },
        {
            q: "5. It takes approximately _______ hour to travel from the downtown office to the international airport by train.",
            options: ["(A) a", "(B) an", "(C) the", "(D) each"],
            correctIndex: 1,
            explanation: "Danh từ 'hour' có chữ 'h' câm, phát âm bắt đầu bằng nguyên âm /aʊər/ -> dùng mạo từ (B) an."
        }
    ],
    "gram-16-prepositions": [
        {
            q: "3. The warranty on this commercial laser printer remains valid _______ November 30 of next year.",
            options: ["(A) by", "(B) until", "(C) within", "(D) during"],
            correctIndex: 1,
            explanation: "Động từ 'remains valid' (duy trì hiệu lực liên tục) đi với giới từ chỉ sự kéo dài đến một mốc thời gian là (B) until."
        },
        {
            q: "4. _______ accordance with city safety ordinances, all emergency exits must remain unobstructed at all times.",
            options: ["(A) In", "(B) On", "(C) By", "(D) With"],
            correctIndex: 0,
            explanation: "Cụm giới từ cố định 'In accordance with' (= Theo đúng quy định của...) rất phổ biến trong TOEIC."
        },
        {
            q: "5. All employees who wish to take paid leave must notify their supervisor _______ least three days in advance.",
            options: ["(A) at", "(B) in", "(C) on", "(D) for"],
            correctIndex: 0,
            explanation: "Cụm cố định 'at least' (ít nhất là) -> chọn (A) at."
        }
    ],
    "gram-17-conjunctions": [
        {
            q: "3. The outdoor concert was canceled _______ heavy rain and strong winds were forecast for the evening.",
            options: ["(A) due to", "(B) because of", "(C) because", "(D) despite"],
            correctIndex: 2,
            explanation: "Phía sau chỗ trống là một mệnh đề hoàn chỉnh có động từ chia thì ('heavy rain and strong winds were forecast') và mang nghĩa nguyên nhân -> chọn liên từ (C) because."
        },
        {
            q: "4. Sales of winter apparel declined slightly in November; _______, revenue from online accessories reached a record high.",
            options: ["(A) although", "(B) despite", "(C) however", "(D) whereas"],
            correctIndex: 2,
            explanation: "Đứng giữa dấu chấm phẩy (;) và dấu phẩy (,) nối hai mệnh đề tương phản -> cần Trạng từ liên kết (C) however."
        },
        {
            q: "5. Please save your document frequently _______ you do not lose any data in the event of a system crash.",
            options: ["(A) so that", "(B) in order to", "(C) because of", "(D) even though"],
            correctIndex: 0,
            explanation: "Theo sau chỗ trống là mệnh đề 'you do not lose...' chỉ mục đích ('để mà') -> chọn liên từ (A) so that."
        }
    ],
    "gram-18-comparisons": [
        {
            q: "3. The newly upgraded assembly line operates _______ than the previous system while consuming less energy.",
            options: ["(A) quiet", "(B) quietly", "(C) more quietly", "(D) most quietly"],
            correctIndex: 2,
            explanation: "Có từ 'than' (so sánh hơn) và cần bổ nghĩa cho động từ thường 'operates' -> dùng so sánh hơn của trạng từ: (C) more quietly."
        },
        {
            q: "4. Of all the proposals submitted for the city park redesign, Ms. Lin's concept was by far _______.",
            options: ["(A) creative", "(B) more creative", "(C) the most creative", "(D) creatively"],
            correctIndex: 2,
            explanation: "Đầu câu có 'Of all the proposals' (Trong tất cả các đề xuất) và 'by far' -> dấu hiệu của So sánh nhất: (C) the most creative."
        },
        {
            q: "5. The _______ you register for the international trade fair, the lower your exhibition booth fee will be.",
            options: ["(A) early", "(B) earlier", "(C) earliest", "(D) more early"],
            correctIndex: 1,
            explanation: "Cấu trúc So sánh kép 'The + so sánh hơn + S + V, the + so sánh hơn + S + V' (Càng... càng...) -> chọn (B) earlier."
        }
    ],
    "gram-19-order-of-adjectives": [
        {
            q: "3. All _______ employees are invited to attend the retirement dinner for Mr. Henderson this Friday.",
            options: ["(A) interest", "(B) interesting", "(C) interested", "(D) interestingly"],
            correctIndex: 2,
            explanation: "Bổ nghĩa cho danh từ chỉ người 'employees' (những nhân viên quan tâm/có hứng thú) -> dùng tính từ phân từ đuôi -ed: (C) interested."
        },
        {
            q: "4. Please review the _______ document carefully before signing and returning it to our legal department.",
            options: ["(A) attach", "(B) attaching", "(C) attached", "(D) attachment"],
            correctIndex: 2,
            explanation: "'the attached document' (tài liệu được đính kèm - mang nghĩa bị động) -> chọn (C) attached."
        },
        {
            q: "5. The keynote speaker delivered an _______ presentation on the future of renewable energy.",
            options: ["(A) inspire", "(B) inspired", "(C) inspiring", "(D) inspiration"],
            correctIndex: 2,
            explanation: "Bổ nghĩa cho danh từ chỉ sự vật 'presentation' (bài thuyết trình truyền cảm hứng - bản chất chủ động) -> dùng tính từ đuôi -ing: (C) inspiring."
        }
    ],
    "gram-20-word-formation": [
        {
            q: "3. All _______ for the senior accountant position must submit three professional references.",
            options: ["(A) apply", "(B) applications", "(C) applicants", "(D) applicable"],
            correctIndex: 2,
            explanation: "Cần danh từ số nhiều đứng sau 'All' làm chủ ngữ cho hành động 'submit three professional references' (người nộp đơn) -> chọn danh từ chỉ người số nhiều (C) applicants."
        },
        {
            q: "4. The software update has _______ improved the processing speed of our customer database.",
            options: ["(A) significant", "(B) significantly", "(C) significance", "(D) signify"],
            correctIndex: 1,
            explanation: "Đứng giữa trợ động từ 'has' và động từ chính 'improved' là vị trí của Trạng từ -> chọn (B) significantly."
        },
        {
            q: "5. To ensure _______, all measuring instruments in the laboratory are calibrated every six months.",
            options: ["(A) accurate", "(B) accurately", "(C) accuracy", "(D) accuracies"],
            correctIndex: 2,
            explanation: "Đứng sau ngoại động từ 'ensure' (đảm bảo) cần một Danh từ không đếm được làm tân ngữ -> chọn (C) accuracy (độ chính xác)."
        }
    ],
    "gram-21-quantifiers": [
        {
            q: "3. We have received _______ positive feedback from customers regarding the redesigned mobile app.",
            options: ["(A) many", "(B) several", "(C) a great deal of", "(D) a few"],
            correctIndex: 2,
            explanation: "'feedback' (phản hồi) là danh từ KHÔNG đếm được. Các đáp án (A), (B), (D) chỉ đi với danh từ đếm được số nhiều -> chọn (C) a great deal of."
        },
        {
            q: "4. One of the conference rooms is on the second floor, and _______ is located on the fifth floor.",
            options: ["(A) another", "(B) the other", "(C) others", "(D) other"],
            correctIndex: 1,
            explanation: "Khi nhắc đến cái còn lại xác định (có động từ số ít 'is located'), dùng đại từ xác định (B) the other."
        },
        {
            q: "5. _______ all of the tickets for Saturday's symphony performance have already been sold out.",
            options: ["(A) Most", "(B) Almost", "(C) Mostly", "(D) The most"],
            correctIndex: 1,
            explanation: "Trước đại từ lượng từ 'all of the...' chỉ dùng trạng từ chỉ mức độ (B) Almost ('Almost all of the tickets' = Hầu như tất cả vé)."
        }
    ],
    "gram-22-comprehensive-structures": [
        {
            q: "3. The new regional director is responsible for hiring staff, managing budgets, and _______ marketing campaigns.",
            options: ["(A) oversee", "(B) to oversee", "(C) overseeing", "(D) oversaw"],
            correctIndex: 2,
            explanation: "Cấu trúc song song (Parallelism) nối bởi 'and': 'hiring..., managing..., and overseeing...' (cùng dạng V-ing) -> chọn (C) overseeing."
        },
        {
            q: "4. Ms. Wallace decided to inspect the manufacturing facility _______ rather than sending an assistant.",
            options: ["(A) she", "(B) her", "(C) hers", "(D) herself"],
            correctIndex: 3,
            explanation: "Mệnh đề đã đủ S + V + O ('Ms. Wallace decided to inspect the facility'), dùng đại từ phản thân để nhấn mạnh đích thân cô ấy làm -> chọn (D) herself."
        },
        {
            q: "5. The demand for the limited-edition smartwatch was _______ high that the online store ran out of stock within two hours.",
            options: ["(A) so", "(B) such", "(C) too", "(D) very"],
            correctIndex: 0,
            explanation: "Cấu trúc 'so + Tính từ (high) + that + S + V' (quá... đến nỗi mà...) -> chọn (A) so."
        }
    ]
};
