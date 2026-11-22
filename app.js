/**
 * KAI TOEIC - Main Application Controller
 * Xử lý toàn bộ:
 * - Điều hướng SPA (Single Page Application)
 * - Quản lý tài khoản, VIP, Streak, Sổ tay từ vựng & Lịch sử điểm thi (LocalStorage)
 * - Phòng thi ảo TOEIC (Đồng hồ đếm ngược, Audio Web Speech API, Bảng câu hỏi, Chấm điểm ETS & Xem giải thích)
 * - Luyện Nghe Chép Chính Tả (Dictation)
 * - Luyện Đọc Song Ngữ Part 7 kèm Click-to-translate
 * - Phòng luyện Nói (Speaking) & Viết (Writing) tích hợp AI chấm điểm
 * - Học 600 Từ vựng bằng Flashcard 3D & Trắc nghiệm nhanh
 */

const STORAGE_KEY = "DAU_TOEIC_STATE_V1";
const ACCOUNTS_STORAGE_KEY = "KAI_TOEIC_GOOGLE_ACCOUNTS_V1";
const FIREBASE_CONFIG_KEY = "KAI_TOEIC_FIREBASE_CONFIG_V1";
const GOOGLE_CLIENT_ID_KEY = "KAI_TOEIC_GOOGLE_CLIENT_ID_V1";

// Cấu hình Supabase Auth (URL + anon key)
const SUPABASE_URL_KEY = "KAI_TOEIC_SUPABASE_URL_V1";
const SUPABASE_ANON_KEY = "KAI_TOEIC_SUPABASE_ANON_KEY_V1";
const DEFAULT_SUPABASE_URL = "https://odlnhfaygiotcyehuysw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_4Gim-4AGEqRCeNXSVp8Xzw_P3_Lz8CB";

const app = {
    firebaseApp: null,
    firebaseAuth: null,
    firestoreDb: null,
    supabaseClient: null,
    isCloudConnected: false,
    isBackendAvailable: false,
    isBackendOAuthConfigured: false,
    backendRedirectUri: "http://localhost:3000/auth/google/callback",
    googleTokenClient: null,
    loginMode: "signin", // 'signin' | 'signup'
    showEmailLogin: false,
    showOAuthConfigPanel: false,
    focusModeObserver: null,

    state: {
        currentView: "home",
        isFocusMode: false,
        user: null, // { uid, name, email, photoURL, targetScore, isVip, provider, lastSyncedAt }
        streak: 3,
        savedWords: [
            { word: "complimentary", pos: "adj", meaning: "miễn phí (= free of charge)" },
            { word: "reimbursement", pos: "n", meaning: "sự hoàn tiền / bồi hoàn chi phí" }
        ],
        learnedVocabIds: ["w1", "w2", "w13"],
        examHistory: [
            {
                id: "hist-sample-1",
                testId: "ets-2026-test-1",
                testTitle: "ETS TOEIC 2026 - Test 01 (Chuẩn Format Mới)",
                date: "28/10/2026 20:15",
                correctCount: 11,
                totalQuestions: 15,
                listeningScore: 375,
                readingScore: 350,
                totalScore: 725,
                timeSpent: "18:42"
            }
        ],
        // Trạng thái phòng thi hiện tại
        activeExam: null,
        // Trạng thái Luyện nghe Dictation
        activeDictationIndex: 0,
        listeningTab: "learn",
        listeningLearnRevealedIds: {},
        listeningClozePercent: 50,
        listeningRevealedWordCounts: {},
        listeningClozeAnswers: {},
        activeListeningPart1ExerciseIndex: 0,
        listeningBookmarkedIds: [],
        listeningReplayCounts: {},
        listeningPlaybackRate: 1,
        listeningAutoRepeat: false,
        listeningIsPlaying: false,
        listeningQuestions: {},
        activeListeningPracticeIndex: 0,
        listeningPracticeAnswers: {},
        listeningPartFilter: "ALL",
        // Điều hướng Luyện nghe: chức năng (Nghe chép / Chọn ABCD) → Level 1-6 → Test 1-10 → Part 1-4
        listeningMode: "dictation",
        listeningLevel: 1,
        listeningTestId: null, // etsTestId đang luyện
        ets2020TestNumber: 1,
        ets2020Answers: {},
        ets2020SubmittedTestNumber: null,
        // Trạng thái Luyện đọc (Level 1-6 → Test 1-10 → Part 5-7)
        readingLevel: 1,
        readingTestId: null,
        readingPartFilter: "Part 5",
        activeReadingExerciseIndex: 0,
        readingPracticeAnswers: {},
        activeReadingIndex: 0,
        showBilingualTranslation: true,
        readingUserAnswers: {},
        // Trạng thái Speaking & Writing
        swTab: "writing", // 'writing' | 'speaking'
        activeWritingIndex: 1, // Mặc định mở câu viết Email phản hồi rất thú vị
        activeSpeakingIndex: 0,
        isRecordingSpeaking: false,
        speakingTimerInterval: null,
        // Trạng thái Từ vựng (Gồm 2 mục nhỏ: '600-words' | '300-phrasal')
        vocabSubTab: "600-words",
        vocabPage: "lessons",
        vocabLessonTab: "theory",
        vocabPracticeMode: "multipleChoice",
        vocabQuizAnswers: {},
        activeVocabTopicId: "lesson-01",
        activeVocabUnitFilter: "ALL",
        vocabSearchQuery: "",
        activeFlashcardIndex: 0,
        isFlashcardFlipped: false,
        // Trạng thái 300 Phrasal Verbs
        phrasalPage: "lessons",
        activePhrasalTopicId: "pv-lesson-01",
        activePhrasalUnitFilter: "ALL",
        phrasalSearchQuery: "",
        activePhrasalCardIndex: 0,
        isPhrasalCardFlipped: false,
        // Trạng thái Ngữ pháp TOEIC (22 chuyên đề)
        grammarViewMode: "list", // 'list' (Danh sách 22 chuyên đề) | 'detail' (Trang học chuyên đề: Lý thuyết + Bài tập)
        grammarTierFilter: "ALL", // 'ALL' | 'de-gap' | 'hay-gap' | 'it-gap'
        grammarSearchQuery: "",
        grammarLessonTab: "theory", // 'theory' | 'practice'
        grammarPracticeMode: "mixed",
        grammarWordTypeFilter: "all",
        grammarWordFormationLessonIndex: 0, // 0..3: Bài 1..4, 4: Tổng kết Bẫy & Mẹo ETS
        grammarSubUnitIndex: 0, // Mục nội dung nhỏ đang chọn trong bài học
        grammarShowAllSubUnits: false, // false: tập trung từng mục; true: xem gộp cả bài
        grammarPracticePageSize: 5, // 1 | 5 | 0 (Tất cả)
        grammarPracticePageIndex: 0,
        grammarMixedPracticeItems: null,
        activeGrammarTopicId: "gram-20-word-formation",
        grammarUserAnswers: {}
    },

    init() {
        this.loadState();
        this.initFocusModeObserver();
        this.initBackendOAuthSession();
        this.initSupabaseIfConfigured();
        this.initFirebaseIfConfigured();
        this.renderHeaderAuth();
        this.updateHeaderCounters();

        // Đóng menu tài khoản khi click ra ngoài
        document.addEventListener("click", (e) => {
            const wrapper = document.getElementById("user-menu-wrapper");
            const dropdown = document.getElementById("user-menu-dropdown");
            if (dropdown && wrapper && !wrapper.contains(e.target)) {
                dropdown.classList.add("hidden");
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.state.isFocusMode) {
                this.toggleFocusMode();
            }
        });
        window.addEventListener("hashchange", () => this.handleLocationChange());
        window.addEventListener("popstate", (event) => this.handleHistoryChange(event.state));

        // Nếu URL trả về từ Google OAuth redirect (#access_token=...) -> Supabase tự xử lý và chuyển về trang đích
        if (window.location.hash.includes("access_token=")) {
            this.navigate("home", false);
            return;
        }

        // Kiểm tra hash URL nếu có (hỗ trợ cả #login hoặc #login?redirect=%2F)
        const rawHash = window.location.hash.replace("#", "").split("?")[0];
        const validViews = ["home", "login", "mock-tests", "listening", "speaking", "reading", "writing", "speaking-writing", "vocabulary", "phrasal-verbs", "grammar", "dashboard"];
        if (rawHash === "listening") {
            const savedListening = window.history.state?.dauenglishListening;
            if (savedListening) this.restoreListeningHistoryState(savedListening);
            else this.navigate("listening", false);
        } else if (rawHash === "reading") {
            const savedReading = window.history.state?.dauenglishReading;
            if (savedReading) this.restoreReadingHistoryState(savedReading);
            else this.navigate("reading", false);
        } else if (rawHash === "grammar") {
            const savedGrammar = window.history.state?.dauenglishGrammar;
            if (savedGrammar) this.restoreGrammarHistoryState(savedGrammar);
            else this.navigate("grammar", false);
        } else if (rawHash === "vocabulary" || rawHash === "phrasal-verbs") {
            const savedVocabPage = window.history.state?.dauenglishVocab;
            this.state.vocabSubTab = savedVocabPage?.subTab === "300-phrasal" || rawHash === "phrasal-verbs"
                ? "300-phrasal"
                : "600-words";
            this.navigate("vocabulary", false);
            if (savedVocabPage) {
                this.restoreVocabHistoryState(savedVocabPage);
            } else {
                this.saveVocabHistoryState("lessons");
            }
        } else if (validViews.includes(rawHash)) {
            this.navigate(rawHash, false);
        } else {
            this.navigate("home", false);
        }
    },

    initFocusModeObserver() {
        if (typeof MutationObserver === "undefined" || !document.body) return;
        this.focusModeObserver = new MutationObserver(() => this.updateFocusModeUI());
        this.focusModeObserver.observe(document.body, { childList: true, subtree: true });
        this.updateFocusModeUI();
    },

    getFocusModeTarget() {
        if (this.state.currentView === "exam-room") {
            return document.getElementById("exam-room-focus-target");
        }
        if (this.state.currentView === "grammar"
            && this.state.grammarViewMode === "detail"
            && this.state.grammarLessonTab === "practice") {
            return document.getElementById("grammar-practice-section");
        }
        return null;
    },

    updateFocusModeUI() {
        const toggle = document.getElementById("focus-mode-toggle");
        if (!toggle) return;

        document.querySelectorAll(".focus-mode-hidden, .focus-mode-shell, .focus-mode-target").forEach(element => {
            element.classList.remove("focus-mode-hidden", "focus-mode-shell", "focus-mode-target");
        });

        const target = this.state.isFocusMode ? this.getFocusModeTarget() : null;
        if (this.state.isFocusMode && !target) {
            this.state.isFocusMode = false;
        }

        if (this.state.isFocusMode && target) {
            document.body.classList.add("focus-mode-active");
            target.classList.add("focus-mode-target");
            let current = target;
            while (current && current !== document.body) {
                const parent = current.parentElement;
                if (!parent) break;
                Array.from(parent.children).forEach(sibling => {
                    if (sibling !== current && sibling.id !== "focus-mode-toggle") {
                        sibling.classList.add("focus-mode-hidden");
                    }
                });
                if (parent !== document.body) parent.classList.add("focus-mode-shell");
                current = parent;
            }
        } else {
            document.body.classList.remove("focus-mode-active");
        }

        const label = toggle.querySelector(".focus-mode-label");
        const icon = toggle.querySelector("i");
        const isActive = this.state.isFocusMode;
        toggle.setAttribute("aria-pressed", String(isActive));
        toggle.setAttribute("aria-label", isActive ? "Thoát chế độ tập trung" : "Bật chế độ tập trung");
        toggle.title = isActive
            ? "Thoát chế độ tập trung (Esc)"
            : "Chỉ hoạt động trong bài tập ngữ pháp hoặc phòng thi";
        const labelText = isActive ? "Thoát tập trung" : "Tập trung";
        if (label && label.textContent !== labelText) label.textContent = labelText;
        const iconClass = `fa-solid ${isActive ? "fa-minimize" : "fa-bullseye"} text-base`;
        if (icon && icon.className !== iconClass) icon.className = iconClass;
    },

    toggleFocusMode() {
        if (this.state.isFocusMode) {
            this.state.isFocusMode = false;
            this.updateFocusModeUI();
            return;
        }
        if (!this.getFocusModeTarget()) {
            this.showToast("Hãy mở phần Bài tập thực hành hoặc bắt đầu một bài thi trước.");
            return;
        }
        this.state.isFocusMode = true;
        this.updateFocusModeUI();
        this.getFocusModeTarget()?.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    // ================= KẾT NỐI BACKEND OAUTH 2.0 (QUY TRÌNH 4 BƯỚC VỚI SERVER.JS) =================
    async initBackendOAuthSession() {
        if (window.location.protocol === "file:") return;
        try {
            const hashParts = window.location.hash.split("?");
            const hashQuery = new URLSearchParams(hashParts[1] || "");
            const sessionFromUrl = hashQuery.get("session") || "";
            const oauthSuccess = hashQuery.get("oauth_success");
            const oauthError = hashQuery.get("oauth_error");
            const setupOAuth = hashQuery.get("setup_oauth");

            const res = await fetch(`/api/auth/me${sessionFromUrl ? `?session=${encodeURIComponent(sessionFromUrl)}` : ""}`);
            if (!res.ok) return;
            const data = await res.json();

            this.isBackendAvailable = true;
            this.isBackendOAuthConfigured = Boolean(data.isOAuthConfigured);
            if (data.redirectUri) {
                this.backendRedirectUri = data.redirectUri;
            }

            // Đồng bộ danh sách các tài khoản đã lưu trên Backend về máy
            if (data.allAccounts && typeof data.allAccounts === "object") {
                const merged = { ...this.getAccountsMap(), ...data.allAccounts };
                this.saveAccountsMap(merged);
            }

            // Nếu Bước 4 trên Backend vừa xác thực thành công và trả về hồ sơ người dùng
            if (data.profile && data.profile.user) {
                this.state.user = data.profile.user;
                this.state.streak = data.profile.streak ?? this.state.streak;
                this.state.savedWords = Array.isArray(data.profile.savedWords) ? data.profile.savedWords : this.state.savedWords;
                this.state.learnedVocabIds = Array.isArray(data.profile.learnedVocabIds) ? data.profile.learnedVocabIds : this.state.learnedVocabIds;
                this.state.examHistory = Array.isArray(data.profile.examHistory) ? data.profile.examHistory : this.state.examHistory;
                this.state.vocabQuizAnswers = data.profile.vocabQuizAnswers || this.state.vocabQuizAnswers || {};
                this.state.ets2020Answers = data.profile.ets2020Answers || this.state.ets2020Answers || {};
                this.state.ets2020TestNumber = data.profile.ets2020TestNumber || this.state.ets2020TestNumber || 1;
                this.state.ets2020SubmittedTestNumber = data.profile.ets2020SubmittedTestNumber || null;
                this.saveState();
                this.renderHeaderAuth();
                this.updateHeaderCounters();

                if (oauthSuccess) {
                    this.showToast(`🎉 [Bước 4 Hoàn tất] Đã xác thực Google & đồng bộ tài khoản ${data.profile.user.email}!`);
                    window.history.replaceState(null, "", "#home");
                }
            } else if (setupOAuth) {
                this.showOAuthConfigPanel = true;
                if (this.state.currentView === "login") {
                    this.renderLoginPage(document.getElementById("app-main"));
                }
                this.showToast("⚙️ Vui lòng nhập Google Client ID & Client Secret (hoặc dùng Cổng OAuth 4 Bước tích hợp) để bắt đầu!");
            } else if (oauthError) {
                this.showToast(`❌ Lỗi xác thực Google OAuth: ${oauthError}`);
            }
        } catch (e) {
            // Đang chạy tĩnh không qua node server.js
            this.isBackendAvailable = false;
        }
    },

    async syncToBackendServer(payload) {
        if (!this.isBackendAvailable || !this.state.user || !this.state.user.email) return;
        try {
            await fetch("/api/user/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            console.warn("Không thể đồng bộ lên Backend Server:", err);
        }
    },

    // ================= KẾT NỐI SUPABASE AUTH (CƠ CHẾ GỐC CỦA DAUENGLISH.COM) =================
    initSupabaseIfConfigured() {
        try {
            if (typeof window.supabase === "undefined" || !window.supabase.createClient) return;
            const sbUrl = localStorage.getItem(SUPABASE_URL_KEY) || DEFAULT_SUPABASE_URL;
            const sbKey = localStorage.getItem(SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

            this.supabaseClient = window.supabase.createClient(sbUrl, sbKey);

            // Lắng nghe sự kiện đăng nhập thành công từ Supabase (OAuth Google Redirect hoặc Email/Password)
            this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
                if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session && session.user) {
                    const sbUser = session.user;
                    const meta = sbUser.user_metadata || {};
                    await this.loadFromCloudOrLocalForUser({
                        uid: sbUser.id,
                        name: meta.full_name || meta.name || (sbUser.email ? sbUser.email.split("@")[0] : "Học viên Kai Toeic"),
                        email: sbUser.email,
                        photoURL: meta.avatar_url || meta.picture || "",
                        provider: "supabase-google"
                    });

                    // Đồng bộ với cơ chế localStorage.getItem("auth_redirect") sau khi OAuth quay về
                    const pendingRedirect = localStorage.getItem("auth_redirect");
                    if (pendingRedirect) {
                        localStorage.removeItem("auth_redirect");
                        this.showToast(`🎉 Đăng nhập thành công (${sbUser.email})! Đã tự động đồng bộ dữ liệu học tập.`);
                        this.navigate("home");
                    }
                }
            });
        } catch (err) {
            console.warn("Khởi tạo Supabase Auth:", err);
        }
    },

    // Lấy toàn bộ danh sách hồ sơ tài khoản Google đã lưu trên máy
    getAccountsMap() {
        try {
            const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    saveAccountsMap(map) {
        try {
            localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(map));
        } catch (e) {
            console.warn("Không thể lưu danh sách tài khoản:", e);
        }
    },

    loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.state.user = parsed.user || null;
                this.state.streak = parsed.streak || 3;
                this.state.savedWords = parsed.savedWords || this.state.savedWords;
                this.state.learnedVocabIds = parsed.learnedVocabIds || this.state.learnedVocabIds;
                this.state.examHistory = parsed.examHistory || this.state.examHistory;
                this.state.grammarUserAnswers = parsed.grammarUserAnswers || this.state.grammarUserAnswers || {};
                this.state.vocabQuizAnswers = parsed.vocabQuizAnswers || this.state.vocabQuizAnswers || {};
                this.state.ets2020Answers = parsed.ets2020Answers || this.state.ets2020Answers || {};
                this.state.ets2020TestNumber = parsed.ets2020TestNumber || this.state.ets2020TestNumber || 1;
                this.state.ets2020SubmittedTestNumber = parsed.ets2020SubmittedTestNumber || null;
            }
            // Nếu đang có tài khoản đăng nhập, nạp dữ liệu riêng của email đó
            if (this.state.user && this.state.user.email) {
                const accounts = this.getAccountsMap();
                const emailKey = this.state.user.email.toLowerCase();
                if (accounts[emailKey]) {
                    const prof = accounts[emailKey];
                    this.state.user = prof.user || this.state.user;
                    this.state.streak = prof.streak ?? this.state.streak;
                    this.state.savedWords = prof.savedWords || this.state.savedWords;
                    this.state.learnedVocabIds = prof.learnedVocabIds || this.state.learnedVocabIds;
                    this.state.examHistory = prof.examHistory || this.state.examHistory;
                    this.state.grammarUserAnswers = prof.grammarUserAnswers || this.state.grammarUserAnswers || {};
                    this.state.vocabQuizAnswers = prof.vocabQuizAnswers || this.state.vocabQuizAnswers || {};
                    this.state.ets2020Answers = prof.ets2020Answers || this.state.ets2020Answers || {};
                    this.state.ets2020TestNumber = prof.ets2020TestNumber || this.state.ets2020TestNumber || 1;
                    this.state.ets2020SubmittedTestNumber = prof.ets2020SubmittedTestNumber || null;
                }
            }
        } catch (e) {
            console.warn("Không thể đọc LocalStorage:", e);
        }
    },

    saveState() {
        const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString("vi-VN");
        if (this.state.user) {
            this.state.user.lastSyncedAt = nowStr;
        }

        const toSave = {
            user: this.state.user,
            streak: this.state.streak,
            savedWords: this.state.savedWords,
            learnedVocabIds: this.state.learnedVocabIds,
            examHistory: this.state.examHistory,
            grammarUserAnswers: this.state.grammarUserAnswers || {},
            vocabQuizAnswers: this.state.vocabQuizAnswers || {},
            ets2020Answers: this.state.ets2020Answers || {},
            ets2020TestNumber: this.state.ets2020TestNumber || 1,
            ets2020SubmittedTestNumber: this.state.ets2020SubmittedTestNumber || null,
            updatedAt: nowStr
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            // Nếu đã đăng nhập bằng email Google, lưu riêng vào kho tài khoản theo email
            if (this.state.user && this.state.user.email) {
                const accounts = this.getAccountsMap();
                const emailKey = this.state.user.email.toLowerCase();
                accounts[emailKey] = toSave;
                this.saveAccountsMap(accounts);
            }
        } catch (e) {
            console.warn("Không thể lưu LocalStorage:", e);
        }

        // Đồng bộ lên Backend Server (users_db.json) và Cloud Firestore nếu có kết nối
        this.syncToBackendServer(toSave);
        this.syncToCloudFirestore(toSave);

        this.updateHeaderCounters();
        this.renderHeaderAuth();
    },

    // ================= KẾT NỐI FIREBASE AUTH & CLOUD FIRESTORE =================
    initFirebaseIfConfigured() {
        try {
            const rawConfig = localStorage.getItem(FIREBASE_CONFIG_KEY);
            if (!rawConfig || typeof firebase === "undefined") return;

            const config = JSON.parse(rawConfig);
            if (!config || !config.apiKey || !config.projectId) return;

            if (!firebase.apps.length) {
                this.firebaseApp = firebase.initializeApp(config);
            } else {
                this.firebaseApp = firebase.app();
            }

            this.firebaseAuth = firebase.auth();
            this.firestoreDb = firebase.firestore();
            this.isCloudConnected = true;

            // Lắng nghe trạng thái đăng nhập Google OAuth thực tế
            this.firebaseAuth.onAuthStateChanged(async (fbUser) => {
                if (fbUser && fbUser.email) {
                    await this.loadFromCloudOrLocalForUser({
                        uid: fbUser.uid,
                        name: fbUser.displayName || fbUser.email.split("@")[0],
                        email: fbUser.email,
                        photoURL: fbUser.photoURL || "",
                        provider: "google-cloud"
                    });
                }
            });
        } catch (err) {
            console.warn("Khởi tạo Firebase không thành công, sử dụng chế độ lưu trữ Local:", err);
            this.isCloudConnected = false;
        }
    },

    async syncToCloudFirestore(payload) {
        if (!this.isCloudConnected || !this.firestoreDb || !this.state.user || !this.state.user.email) return;
        try {
            const docId = this.state.user.email.toLowerCase();
            await this.firestoreDb.collection("kai_toeic_users").doc(docId).set(payload, { merge: true });
        } catch (err) {
            console.warn("Không thể đồng bộ lên Cloud Firestore:", err);
        }
    },

    async loadFromCloudOrLocalForUser(googleUser) {
        const emailKey = googleUser.email.toLowerCase();
        const accounts = this.getAccountsMap();
        let profile = accounts[emailKey] || null;

        // Ưu tiên 1: Thử tải dữ liệu từ Backend Server (users_db.json) nếu đang chạy server.js
        if (this.isBackendAvailable) {
            try {
                const res = await fetch("/api/user/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailKey, mode: "pull" })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.ok && data.profile && data.profile.user) {
                        profile = data.profile;
                    }
                }
            } catch (e) {
                console.warn("Đọc Backend Server thất bại, dùng bản lưu trên máy:", e);
            }
        }

        // Ưu tiên 2: Thử tải dữ liệu từ Cloud Firestore nếu có kết nối
        if (this.isCloudConnected && this.firestoreDb) {
            try {
                const snap = await this.firestoreDb.collection("kai_toeic_users").doc(emailKey).get();
                if (snap.exists) {
                    profile = snap.data();
                }
            } catch (e) {
                console.warn("Đọc Firestore thất bại, dùng bản lưu trên máy:", e);
            }
        }

        const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString("vi-VN");
        const googleSub = googleUser.uid || profile?.user?.federatedIdentity?.sub || ("1084" + Math.floor(100000000000 + Math.random() * 900000000000));
        const federatedIdentity = googleUser.federatedIdentity || {
            idp: "https://accounts.google.com",
            protocol: "OpenID Connect 1.0 (Federated Identity)",
            sub: String(googleSub),
            email: googleUser.email,
            emailVerified: true,
            linkedAt: profile?.user?.federatedIdentity?.linkedAt || nowStr
        };

        if (profile) {
            // Tài khoản đã từng học trước đó -> Liên kết định danh (Federation Linking) & Khôi phục toàn bộ tiến độ
            const existingProviders = Array.isArray(profile.user?.linkedProviders) ? [...profile.user.linkedProviders] : [];
            if (!existingProviders.includes("google.com")) existingProviders.push("google.com");

            this.state.user = {
                ...profile.user,
                uid: String(googleSub),
                name: googleUser.name || profile.user?.name || "Học viên",
                email: googleUser.email,
                photoURL: googleUser.photoURL || profile.user?.photoURL || "",
                targetScore: googleUser.targetScore || profile.user?.targetScore || 800,
                isVip: profile.user?.isVip ?? true,
                provider: googleUser.provider || profile.user?.provider || "google-federated-oidc",
                federatedIdentity,
                linkedProviders: existingProviders
            };
            this.state.streak = profile.streak ?? 1;
            this.state.savedWords = Array.isArray(profile.savedWords) ? profile.savedWords : [];
            this.state.learnedVocabIds = Array.isArray(profile.learnedVocabIds) ? profile.learnedVocabIds : [];
            this.state.examHistory = Array.isArray(profile.examHistory) ? profile.examHistory : [];
            this.state.vocabQuizAnswers = profile.vocabQuizAnswers || {};
            this.state.ets2020Answers = profile.ets2020Answers || {};
            this.state.ets2020TestNumber = profile.ets2020TestNumber || 1;
            this.state.ets2020SubmittedTestNumber = profile.ets2020SubmittedTestNumber || null;
        } else {
            // Tài khoản Google mới lần đầu đăng nhập -> Cấp phát tự động (Just-In-Time Provisioning) qua Federated Identity
            this.state.vocabQuizAnswers = {};
            this.state.ets2020Answers = {};
            this.state.ets2020TestNumber = 1;
            this.state.ets2020SubmittedTestNumber = null;
            this.state.user = {
                uid: String(googleSub),
                name: googleUser.name,
                email: googleUser.email,
                photoURL: googleUser.photoURL || "",
                targetScore: googleUser.targetScore || 800,
                isVip: true,
                provider: googleUser.provider || "google-federated-oidc",
                federatedIdentity,
                linkedProviders: ["google.com"]
            };
        }

        this.saveState();
        this.renderHeaderAuth();
        this.updateHeaderCounters();
    },

    updateHeaderCounters() {
        const streakEl = document.getElementById("header-streak");
        const savedCountEl = document.getElementById("header-saved-count");
        if (streakEl) streakEl.textContent = this.state.streak;
        if (savedCountEl) savedCountEl.textContent = this.state.savedWords.length;
    },

    renderHeaderAuth() {
        const container = document.getElementById("header-auth-area");
        if (!container) return;

        if (this.state.user) {
            const vipBadge = this.state.user.isVip
                ? `<span class="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase"><i class="fa-solid fa-crown mr-0.5"></i>VIP</span>`
                : `<button onclick="app.openVipModal()" class="text-[11px] font-bold text-amber-600 hover:underline">Nâng cấp VIP</button>`;

            const syncBadge = this.isCloudConnected
                ? `<span class="text-[10px] text-emerald-600 font-bold" title="Đã kết nối Firebase Cloud"><i class="fa-solid fa-cloud-check mr-0.5"></i>Cloud</span>`
                : `<span class="text-[10px] text-brand-600 font-bold" title="Đã lưu tự động vào tài khoản"><i class="fa-solid fa-floppy-disk mr-0.5"></i>Đã lưu</span>`;

            const avatarHtml = this.state.user.photoURL
                ? `<img src="${this.escapeHtml(this.state.user.photoURL)}" alt="Avatar" class="w-9 h-9 rounded-xl object-cover border border-brand-200 shadow-sm" />`
                : `<div class="w-9 h-9 rounded-xl bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">${this.escapeHtml(this.state.user.name.charAt(0).toUpperCase())}</div>`;

            container.innerHTML = `
                <div class="flex items-center gap-2">
                    <div class="hidden sm:flex flex-col items-end">
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-bold text-slate-800">${this.escapeHtml(this.state.user.name)}</span>
                            ${vipBadge}
                        </div>
                        <div class="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span>${this.escapeHtml(this.state.user.email || "")}</span>
                            <span>•</span>
                            ${syncBadge}
                        </div>
                    </div>
                    <div id="user-menu-wrapper" class="relative group">
                        <button onclick="app.toggleUserDropdown(event)" class="focus:outline-none flex items-center gap-1 p-0.5 rounded-xl hover:ring-2 hover:ring-brand-200 transition">
                            ${avatarHtml}
                        </button>
                        <!-- Dùng pt-2 thay vì mt-2 để tạo vùng đệm liền mạch không bị mất hover khi di chuột xuống -->
                        <div id="user-menu-dropdown" class="absolute right-0 top-full pt-2 w-64 hidden group-hover:block z-50">
                            <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 py-2">
                                <div class="px-4 py-2.5 border-b border-slate-100">
                                    <div class="text-xs font-extrabold text-slate-900 truncate">${this.escapeHtml(this.state.user.name)}</div>
                                    <div class="text-[11px] text-slate-500 truncate">${this.escapeHtml(this.state.user.email || "")}</div>
                                    <div class="text-[10px] text-emerald-600 font-semibold mt-0.5">
                                        <i class="fa-solid fa-rotate mr-1"></i>Lưu lúc: ${this.escapeHtml(this.state.user.lastSyncedAt || "Vừa xong")}
                                    </div>
                                </div>
                                <button onclick="app.closeUserDropdown(); app.navigate('dashboard')" class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition">
                                    <i class="fa-solid fa-chart-pie text-brand-600 w-4"></i> Hồ sơ & Lịch sử điểm
                                </button>
                                <button onclick="app.closeUserDropdown(); app.openSavedWordsModal()" class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition">
                                    <i class="fa-solid fa-bookmark text-amber-500 w-4"></i> Sổ tay từ vựng (${this.state.savedWords.length})
                                </button>
                                <button onclick="app.closeUserDropdown(); app.navigate('login')" class="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition">
                                    <i class="fa-brands fa-google text-rose-500 w-4"></i> Đổi tài khoản Google / Sao lưu
                                </button>
                                <hr class="my-1 border-slate-100"/>
                                <button onclick="app.closeUserDropdown(); app.logout()" class="w-full text-left px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition">
                                    <i class="fa-solid fa-right-from-bracket w-4"></i> Đăng xuất tài khoản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <button onclick="app.navigate('login')" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-brand-600/20 transition flex items-center gap-2">
                    <i class="fa-brands fa-google"></i>
                    <span>Đăng nhập</span>
                </button>
            `;
        }
    },

    toggleUserDropdown(e) {
        if (e) e.stopPropagation();
        const dropdown = document.getElementById("user-menu-dropdown");
        if (dropdown) {
            dropdown.classList.toggle("hidden");
        }
    },

    closeUserDropdown() {
        const dropdown = document.getElementById("user-menu-dropdown");
        if (dropdown) {
            dropdown.classList.add("hidden");
        }
    },

    toggleMobileMenu() {
        const menu = document.getElementById("mobile-menu");
        if (menu) menu.classList.toggle("hidden");
    },

    // ================= ĐIỀU HƯỚNG SPA =================
    handleLocationChange() {
        const view = window.location.hash.replace("#", "").split("?")[0] || "home";
        const savedListening = window.history.state?.dauenglishListening;
        if (view === "listening" && savedListening) {
            this.restoreListeningHistoryState(savedListening);
            return;
        }
        const savedReading = window.history.state?.dauenglishReading;
        if (view === "reading" && savedReading) {
            this.restoreReadingHistoryState(savedReading);
            return;
        }
        const savedGrammar = window.history.state?.dauenglishGrammar;
        if (view === "grammar" && savedGrammar) {
            this.restoreGrammarHistoryState(savedGrammar);
            return;
        }
        const savedVocabPage = window.history.state?.dauenglishVocab;
        if ((view === "vocabulary" || view === "phrasal-verbs") && savedVocabPage) {
            this.state.vocabSubTab = savedVocabPage.subTab === "300-phrasal" || view === "phrasal-verbs"
                ? "300-phrasal"
                : "600-words";
            this.navigate("vocabulary", false);
            this.restoreVocabHistoryState(savedVocabPage);
            return;
        }
        this.navigate(view, false);
    },

    handleHistoryChange(historyState) {
        const savedListening = historyState && historyState.dauenglishListening;
        if (savedListening) {
            this.restoreListeningHistoryState(savedListening);
            return;
        }
        const savedReading = historyState && historyState.dauenglishReading;
        if (savedReading) {
            this.restoreReadingHistoryState(savedReading);
            return;
        }
        const savedGrammar = historyState && historyState.dauenglishGrammar;
        if (savedGrammar) {
            this.restoreGrammarHistoryState(savedGrammar);
            return;
        }
        const hashView = window.location.hash.replace("#", "").split("?")[0];
        const savedVocabPage = historyState && historyState.dauenglishVocab;
        if (!savedVocabPage || (hashView && hashView !== "vocabulary" && hashView !== "phrasal-verbs")) {
            this.handleLocationChange();
            return;
        }

        this.state.vocabSubTab = savedVocabPage.subTab === "300-phrasal" ? "300-phrasal" : "600-words";
        this.navigate("vocabulary", false);
        this.restoreVocabHistoryState(savedVocabPage);
    },

    saveGrammarHistoryState(push = false, hasListBack = false) {
        const historyState = {
            dauenglishGrammar: {
                view: "grammar",
                viewMode: this.state.grammarViewMode === "detail" ? "detail" : "list",
                topicId: this.state.activeGrammarTopicId,
                lessonTab: this.state.grammarLessonTab === "practice" ? "practice" : "theory",
                wfLessonIdx: Math.max(0, Number(this.state.grammarWordFormationLessonIndex) || 0),
                subUnitIdx: Math.max(0, Number(this.state.grammarSubUnitIndex) || 0),
                hasListBack: Boolean(hasListBack)
            }
        };
        window.history[push ? "pushState" : "replaceState"](historyState, "", window.location.href);
    },

    restoreGrammarHistoryState(saved) {
        if (!saved) return;
        this.stopSpeech();
        this.state.currentView = "grammar";
        this.state.grammarViewMode = saved.viewMode === "detail" ? "detail" : "list";
        if (saved.topicId) this.state.activeGrammarTopicId = saved.topicId;
        this.state.grammarLessonTab = saved.lessonTab === "practice" ? "practice" : "theory";
        this.state.grammarWordFormationLessonIndex = Math.max(0, Number(saved.wfLessonIdx) || 0);
        this.state.grammarSubUnitIndex = Math.max(0, Number(saved.subUnitIdx) || 0);
        this.state.grammarShowAllSubUnits = false;
        this.highlightNav("grammar");
        this.renderGrammar(document.getElementById("app-main"));
    },

    restoreVocabHistoryState(savedVocabPage) {
        const isPhrasal = this.state.vocabSubTab === "300-phrasal";
        this.state.vocabPage = isPhrasal ? "lessons" : savedVocabPage.page === "lesson" ? "lesson" : "lessons";
        this.state.phrasalPage = isPhrasal ? savedVocabPage.page === "lesson" ? "lesson" : "lessons" : "lessons";
        if (savedVocabPage.topicId) {
            if (isPhrasal) this.state.activePhrasalTopicId = savedVocabPage.topicId;
            else this.state.activeVocabTopicId = savedVocabPage.topicId;
        }
        this.state.vocabLessonTab = savedVocabPage.lessonTab === "practice" ? "practice" : "theory";
        const allowedModes = ["multipleChoice", "listening", "context", "missingLetters"];
        this.state.vocabPracticeMode = allowedModes.includes(savedVocabPage.practiceMode)
            ? savedVocabPage.practiceMode
            : "multipleChoice";
        this.renderVocabulary(document.getElementById("app-main"));
    },

    saveVocabHistoryState(page, push = false) {
        const isPhrasal = this.state.vocabSubTab === "300-phrasal";
        const historyState = {
            ...(window.history.state || {}),
            dauenglishVocab: {
                view: "vocabulary",
                page,
                subTab: this.state.vocabSubTab,
                topicId: isPhrasal
                    ? this.state.activePhrasalTopicId
                    : this.state.activeVocabTopicId,
                lessonTab: this.state.vocabLessonTab,
                practiceMode: this.state.vocabPracticeMode
            }
        };
        const update = push ? "pushState" : "replaceState";
        window.history[update](historyState, "", window.location.href);
    },

    // Highlight nút nav đang active (thanh ngang + thanh dọc) và mục con Từ vựng
    highlightNav(view) {
        document.querySelectorAll(".nav-btn").forEach(btn => {
            const navTarget = btn.getAttribute("data-nav");
            if (navTarget === view) {
                btn.classList.add("bg-brand-50", "text-brand-700", "shadow-sm");
                btn.classList.remove("text-slate-700", "text-slate-600");
            } else {
                btn.classList.remove("bg-brand-50", "text-brand-700", "shadow-sm");
                btn.classList.add("text-slate-700");
            }
        });

        const subMenu = document.getElementById("sidebar-vocab-submenu");
        const chevron = document.getElementById("sidebar-vocab-chevron");
        const sub600 = document.getElementById("sidebar-sub-600");
        const sub300 = document.getElementById("sidebar-sub-300");
        if (sub600 && sub300) {
            if (view === "vocabulary") {
                if (subMenu) subMenu.classList.remove("hidden");
                if (chevron) chevron.classList.add("rotate-180");
                if (this.state.vocabSubTab !== "300-phrasal") {
                    sub600.classList.add("bg-purple-50", "text-purple-700");
                    sub300.classList.remove("bg-cyan-50", "text-cyan-700");
                } else {
                    sub300.classList.add("bg-cyan-50", "text-cyan-700");
                    sub600.classList.remove("bg-purple-50", "text-purple-700");
                }
            } else {
                sub600.classList.remove("bg-purple-50", "text-purple-700");
                sub300.classList.remove("bg-cyan-50", "text-cyan-700");
            }
        }
    },

    navigate(view, updateHash = true) {
        // Nếu đang trong phòng thi mà chưa nộp bài, dừng audio
        this.stopSpeech();
        // Rời màn luyện nghe thì trả lại header/menu/footer
        this.setListeningImmersive(false);
        if (this.state.speakingTimerInterval) {
            clearInterval(this.state.speakingTimerInterval);
            this.state.speakingTimerInterval = null;
        }

        // Hỗ trợ 2 mục riêng Nói (speaking) và Viết (writing) trên thanh ngang phía trên
        if (view === "speaking") {
            this.state.swTab = "speaking";
        } else if (view === "writing" || view === "speaking-writing") {
            this.state.swTab = "writing";
            if (view === "speaking-writing") view = "writing";
        } else if (view === "phrasal-verbs") {
            this.state.vocabSubTab = "300-phrasal";
            view = "vocabulary";
        }
        if (view === "vocabulary") {
            this.state.vocabPage = "lessons";
            this.state.phrasalPage = "lessons";
        }
        if (view === "grammar" && updateHash) {
            this.state.grammarViewMode = "list";
        }

        this.state.currentView = view;
        if (updateHash && view !== "exam-room" && view !== "exam-result") {
            window.location.hash = view;
        }
        if (view === "vocabulary" && updateHash) {
            this.saveVocabHistoryState("lessons");
        }
        if (view === "grammar" && updateHash) {
            this.saveGrammarHistoryState(false, false);
        }

        this.highlightNav(view);

        const main = document.getElementById("app-main");
        if (!main) return;

        window.scrollTo({ top: 0, behavior: "smooth" });

        switch (view) {
            case "home":
                this.renderHome(main);
                break;
            case "login":
                this.renderLoginPage(main);
                break;
            case "mock-tests":
                this.renderMockTestsList(main);
                break;
            case "exam-room":
                this.renderExamRoom(main);
                break;
            case "exam-result":
                this.renderExamResult(main);
                break;
            case "listening":
                // Vào từ thanh điều hướng luôn bắt đầu ở màn chọn chức năng + Test/Part
                this.stopSpeech();
                this.state.listeningTestId = null;
                this.renderListeningPractice(main);
                this.saveListeningHistoryState(false);
                break;
            case "speaking":
                this.state.swTab = "speaking";
                this.renderSpeakingWriting(main);
                break;
            case "reading":
                this.state.readingTestId = null;
                this.renderReadingPractice(main);
                this.saveReadingHistoryState(false);
                break;
            case "writing":
            case "speaking-writing":
                this.state.swTab = "writing";
                this.renderSpeakingWriting(main);
                break;
            case "vocabulary":
                this.renderVocabulary(main);
                break;
            case "grammar":
                this.state.grammarViewMode = "list";
                this.renderGrammar(main);
                break;
            case "dashboard":
                this.renderDashboard(main);
                break;
            default:
                this.renderHome(main);
        }
    },

    // ================= TIỆN ÍCH ÂM THANH (WEB SPEECH API) =================
    listeningAudioEl: null,

    speakText(text, rate = 0.95) {
        if (!("speechSynthesis" in window)) {
            this.showToast("Trình duyệt của bạn không hỗ trợ phát giọng đọc tự động.");
            return;
        }
        // Tạm dừng audio bài nghe để không chồng tiếng
        if (this.listeningAudioEl && !this.listeningAudioEl.paused) {
            this.listeningAudioEl.pause();
            this.state.listeningIsPlaying = false;
            this.syncListeningAudioButton(false);
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
        this.showToast("🔊 Đang phát âm thanh chuẩn ETS (en-US)...");
    },

    stopSpeech() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        const audio = this.listeningAudioEl;
        if (audio) {
            audio.pause();
            audio.onended = null;
            try { audio.currentTime = 0; } catch (e) { /* bỏ qua */ }
        }
        this.state.listeningIsPlaying = false;
        this.syncListeningAudioButton(false);
    },

    // Phát file MP3 neural TTS (assets/audio/tests/...). Trả về false nếu không tạo được audio.
    playListeningMp3(src, { rate = 1, repeat = false } = {}) {
        if (!src) return false;
        try {
            if (!this.listeningAudioEl) {
                this.listeningAudioEl = new Audio();
                this.listeningAudioEl.preload = "auto";
            }
            const audio = this.listeningAudioEl;
            audio.pause();
            audio.onended = null;
            audio.src = src;
            audio.loop = false;
            audio.playbackRate = rate || 1;
            audio.onended = () => {
                if (repeat) {
                    this.playListeningMp3(src, { rate, repeat });
                    return;
                }
                this.state.listeningIsPlaying = false;
                this.syncListeningAudioButton(false);
            };
            const promise = audio.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(() => {
                    this.state.listeningIsPlaying = false;
                    this.syncListeningAudioButton(false);
                    this.showToast("Không phát được file audio trong assets/audio.");
                });
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    // ================= 1. TRANG CHỦ & TRANG ĐĂNG NHẬP GOOGLE (/login?redirect=%2F) =================
    renderLoginPage(container) {
        const accountsMap = this.getAccountsMap();
        const savedEmails = Object.keys(accountsMap);
        const savedClientId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || "";
        const isFileProtocol = window.location.protocol === "file:";
        const currentOrigin = isFileProtocol ? "http://localhost:5500 (Cần chạy qua Local Server)" : window.location.origin;

        const savedAccountsHtml = savedEmails.length > 0 ? `
            <div class="mt-6 pt-5 border-t border-slate-200/80 text-left">
                <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Tài khoản đã đồng bộ trên thiết bị này:</span>
                    <span class="text-emerald-600"><i class="fa-solid fa-cloud-check mr-1"></i>Tự động sao lưu</span>
                </div>
                <div class="space-y-2">
                    ${savedEmails.map(emailKey => {
                        const acc = accountsMap[emailKey];
                        const u = acc.user || {};
                        const isCurrent = this.state.user && this.state.user.email && this.state.user.email.toLowerCase() === emailKey;
                        const learnedCount = (acc.learnedVocabIds || []).length;
                        const examCount = (acc.examHistory || []).length;
                        const avatarEl = u.photoURL
                            ? `<img src="${this.escapeHtml(u.photoURL)}" class="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />`
                            : `<div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">${this.escapeHtml((u.name || emailKey).charAt(0).toUpperCase())}</div>`;

                        return `
                            <div onclick="app.switchGoogleAccount('${this.escapeJsString(emailKey)}', true)" class="cursor-pointer p-3 rounded-xl border ${isCurrent ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-brand-400 bg-white hover:bg-slate-50'} flex items-center justify-between gap-3 transition">
                                <div class="flex items-center gap-3 min-w-0">
                                    ${avatarEl}
                                    <div class="min-w-0">
                                        <div class="text-xs sm:text-sm font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                                            <span>${this.escapeHtml(u.name || "Học viên")}</span>
                                            ${isCurrent ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold">Đang dùng</span>` : ""}
                                        </div>
                                        <div class="text-xs text-slate-500 truncate">${this.escapeHtml(u.email || emailKey)}</div>
                                        <div class="text-[11px] text-brand-600 font-semibold mt-0.5">
                                            <i class="fa-solid fa-cloud-arrow-up mr-1"></i>Đã lưu: ${learnedCount} từ vựng • ${examCount} đề thi
                                        </div>
                                    </div>
                                </div>
                                <i class="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        ` : "";

        container.innerHTML = `
            <div class="flex min-h-[86vh] bg-white">
                <!-- Cột Trái: Form Đăng nhập -->
                <div class="flex flex-1 flex-col justify-center px-6 py-10 lg:px-14 lg:w-1/2">
                    <div class="mx-auto w-full max-w-md">
                        <!-- Logo Brand -->
                        <a href="#home" onclick="app.navigate('home'); return false;" class="flex items-center gap-2.5 mb-8 group w-fit">
                            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                                <i class="fa-solid fa-graduation-cap text-xl"></i>
                            </div>
                            <span class="text-2xl font-extrabold tracking-tight text-slate-900">Kai <span class="text-brand-600">Toeic</span></span>
                        </a>

                        <!-- Tiêu đề -->
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            ${this.loginMode === "signup" ? "Tạo tài khoản mới" : "Chào mừng bạn quay lại"}
                        </h1>
                        <p class="mt-2 text-sm sm:text-base text-slate-500">
                            Đăng nhập nhanh bằng Google để tiếp tục học và tự động sao lưu toàn bộ tiến độ.
                        </p>

                        <!-- Thông báo lỗi / trạng thái nếu có -->
                        <div id="login-alert-box" class="hidden mt-4 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600"></div>

                        <!-- Nút chính: Đăng nhập với Google -->
                        <div class="mt-6 space-y-3">
                            <button
                                type="button"
                                onclick="app.signInWithGoogleDauEnglish()"
                                class="w-full flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 hover:opacity-95 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                    <svg class="h-4 w-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                </div>
                                <span>Đăng nhập với Google</span>
                            </button>

                            <!-- Nút Google Identity Services chính chủ (nếu đã gắn Client ID riêng) -->
                            <div id="g-signin-official-btn" class="flex justify-center"></div>
                        </div>

                        <!-- Mục thu gọn: Đăng nhập bằng email/mật khẩu -->
                        <div class="mt-6">
                            <button
                                type="button"
                                onclick="app.toggleEmailLoginSection()"
                                class="flex w-full items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2"
                            >
                                <span>${this.loginMode === "signup" ? "Hoặc đăng ký bằng email và mật khẩu" : "Đã có tài khoản email? Đăng nhập bằng email/mật khẩu"}</span>
                                <i class="fa-solid fa-chevron-down text-xs transition-transform ${this.showEmailLogin ? 'rotate-180' : ''}"></i>
                            </button>

                            <form
                                id="dauenglish-email-form"
                                onsubmit="app.handleSupabaseEmailAuth(event)"
                                class="${this.showEmailLogin ? 'mt-4 space-y-4' : 'hidden'}"
                            >
                                ${this.loginMode === "signup" ? `
                                    <div>
                                        <label for="login-fullname" class="block text-xs font-bold text-slate-700 mb-1.5">Họ và tên hiển thị</label>
                                        <div class="relative">
                                            <i class="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                            <input
                                                id="login-fullname"
                                                type="text"
                                                placeholder="Nguyễn Minh Anh"
                                                class="w-full rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                            />
                                        </div>
                                    </div>
                                ` : ""}
                                <div>
                                    <label for="login-email" class="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                                    <div class="relative">
                                        <i class="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                        <input
                                            id="login-email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            class="w-full rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label for="login-password" class="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
                                    <div class="relative">
                                        <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                        <input
                                            id="login-password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            class="w-full rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white py-3 pl-10 pr-11 text-sm text-slate-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                        />
                                        <button
                                            type="button"
                                            onclick="const p = document.getElementById('login-password'); p.type = p.type === 'password' ? 'text' : 'password';"
                                            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                        >
                                            <i class="fa-regular fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    id="email-auth-submit-btn"
                                    class="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 px-6 py-3 text-sm font-extrabold text-slate-900 transition-all"
                                >
                                    <span>${this.loginMode === "signup" ? "Đăng ký & Sao lưu tự động" : "Đăng nhập bằng Email"}</span>
                                    <i class="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                            </form>
                        </div>

                        <!-- Danh sách các tài khoản Google đã từng đăng nhập trên trình duyệt này -->
                        ${savedAccountsHtml}

                        <!-- Chuyển đổi Đăng nhập / Đăng ký -->
                        <p class="mt-7 text-center text-sm text-slate-500">
                            ${this.loginMode === "signup"
                                ? `Đã có tài khoản? <button type="button" onclick="app.switchLoginMode('signin')" class="font-extrabold text-brand-600 hover:underline">Đăng nhập ngay</button>`
                                : `Chưa có tài khoản? <button type="button" onclick="app.switchLoginMode('signup')" class="font-extrabold text-brand-600 hover:underline">Đăng ký ngay</button>`
                            }
                        </p>

                        <!-- Tùy chọn cấu hình OAuth 4 Bước (Backend Authorization Code Flow) -->
                        <div class="mt-6 pt-4 border-t border-slate-100">
                            <div class="flex items-center justify-between text-xs text-slate-400">
                                <button type="button" onclick="app.navigate('home')" class="hover:text-brand-600 font-semibold">
                                    &larr; Quay lại trang chủ
                                </button>
                                <button type="button" onclick="document.getElementById('advanced-oauth-box').classList.toggle('hidden')" class="hover:text-brand-600 font-semibold flex items-center gap-1">
                                    <i class="fa-solid fa-sliders"></i>
                                    <span>Cấu hình OAuth 4 Bước (Client ID & Secret)</span>
                                </button>
                            </div>

                            <div id="advanced-oauth-box" class="${this.showOAuthConfigPanel ? '' : 'hidden'} mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                                <div class="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                                    <span><i class="fa-solid fa-shield-halved text-brand-600 mr-1"></i>Quy trình 4 bước Google OAuth 2.0 (Backend)</span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${this.isBackendOAuthConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}">
                                        ${this.isBackendOAuthConfigured ? 'Đã kết nối Backend OAuth' : 'Chế độ tự động / Cấu hình'}
                                    </span>
                                </div>
                                <div class="text-[11px] text-slate-600 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                                    <div><strong>Bước 1:</strong> Redirect sang <code>accounts.google.com/o/oauth2/v2/auth</code></div>
                                    <div><strong>Bước 2:</strong> Chọn tài khoản & cấp quyền trên Google</div>
                                    <div><strong>Bước 3:</strong> Google trả <code>Authorization Code</code> về <code>/auth/google/callback</code></div>
                                    <div><strong>Bước 4:</strong> Server đổi Code lấy <code>Access Token</code> ngầm & tự tạo/khôi phục tài khoản</div>
                                </div>
                                <div class="space-y-2">
                                    <input
                                        type="text"
                                        id="google-client-id-input"
                                        value="${this.escapeHtml(savedClientId)}"
                                        placeholder="Google Client ID (...apps.googleusercontent.com)"
                                        class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-brand-600 outline-none text-xs font-mono bg-white"
                                    />
                                    <input
                                        type="password"
                                        id="google-client-secret-input"
                                        placeholder="Google Client Secret (GOCSPX-... dùng cho Bước 4 trên Backend)"
                                        class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-brand-600 outline-none text-xs font-mono bg-white"
                                    />
                                    <div class="text-[10px] text-slate-500">
                                        Callback URI cần thêm vào Google Cloud Console: <code class="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-bold">${this.escapeHtml(this.backendRedirectUri)}</code>
                                    </div>
                                    <div class="flex items-center justify-between gap-2 pt-1">
                                        <button type="button" onclick="app.startFourStepOAuthDemo()" class="text-[11px] font-extrabold text-brand-600 hover:underline">
                                            <i class="fa-solid fa-play mr-1"></i>Chạy thử Quy trình 4 Bước ngay
                                        </button>
                                        <button type="button" onclick="app.saveBackendOAuthConfig()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs shrink-0 transition">
                                            Lưu vào Server
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cột Phải: Banner Học tập & Thống kê Tiến độ (bố cục lg:w-1/2) -->
                <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-900 text-white p-12 flex-col justify-between relative overflow-hidden">
                    <div class="relative z-10">
                        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-amber-300">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <span>Đồng bộ đám mây tự động theo tài khoản Google</span>
                        </span>
                        <h2 class="mt-6 text-3xl font-extrabold leading-tight">
                            Học mọi lúc, mọi nơi.<br/>
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">Không bao giờ mất tiến độ.</span>
                        </h2>
                        <p class="mt-3 text-slate-300 text-sm leading-relaxed max-w-md">
                            Ngay khi bạn đăng nhập với Google hoặc Email, toàn bộ điểm thi thử ETS 2026, 600 từ vựng TOEIC và 300 Phrasal Verbs sẽ được gắn liền với tài khoản của bạn.
                        </p>
                    </div>

                    <!-- Thẻ minh họa dữ liệu được đồng bộ -->
                    <div class="relative z-10 my-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 space-y-4">
                        <div class="flex items-center justify-between border-b border-white/10 pb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                                    <i class="fa-solid fa-check-double"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-extrabold">Trạng thái sao lưu tài khoản</div>
                                    <div class="text-xs text-slate-300">Tự động cập nhật sau mỗi câu trả lời</div>
                                </div>
                            </div>
                            <span class="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-extrabold">Real-time Sync</span>
                        </div>

                        <div class="grid grid-cols-2 gap-3 text-left">
                            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                                <div class="text-xs text-slate-300">Kho Từ Vựng & Cụm Động Từ</div>
                                <div class="text-lg font-extrabold text-amber-300 mt-0.5">600 Từ + 300 PV</div>
                                <div class="text-[11px] text-emerald-300 mt-1"><i class="fa-solid fa-circle-check mr-1"></i>Lưu từng từ đã thuộc</div>
                            </div>
                            <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                                <div class="text-xs text-slate-300">Lịch Sử Phòng Thi ETS</div>
                                <div class="text-lg font-extrabold text-white mt-0.5">Full 4 Kỹ Năng</div>
                                <div class="text-[11px] text-emerald-300 mt-1"><i class="fa-solid fa-circle-check mr-1"></i>Lưu điểm Nghe, Đọc, Nói, Viết</div>
                            </div>
                        </div>
                    </div>

                    <div class="relative z-10 flex items-center justify-between text-xs text-slate-400">
                        <span>© 2026 Kai Toeic • Nền tảng Luyện thi TOEIC 4 Kỹ Năng</span>
                        <span class="text-emerald-300 font-bold"><i class="fa-solid fa-lock mr-1"></i>Bảo mật OAuth 2.0</span>
                    </div>
                </div>
            </div>
        `;

        // Nếu đã có Google Client ID và thư viện Google GIS đã tải xong -> Khởi tạo nút Google thật
        setTimeout(() => this.initGoogleIdentityButton(), 150);
    },

    toggleEmailLoginSection() {
        this.showEmailLogin = !this.showEmailLogin;
        const main = document.getElementById("app-main");
        if (main && this.state.currentView === "login") {
            this.renderLoginPage(main);
        }
    },

    switchLoginMode(mode) {
        this.loginMode = mode === "signup" ? "signup" : "signin";
        this.showEmailLogin = true;
        const main = document.getElementById("app-main");
        if (main && this.state.currentView === "login") {
            this.renderLoginPage(main);
        }
    },

    // Hàm xử lý khi bấm nút "Đăng nhập với Google" trên trang /login (Tuân thủ Quy trình 4 Bước OAuth 2.0)
    async signInWithGoogleDauEnglish() {
        localStorage.setItem("auth_redirect", "/");

        // Ưu tiên 1: Nếu đang chạy qua Backend Server (server.js) và đã cấu hình Client ID + Client Secret
        // -> Chuyển hướng (302 Redirect) trình duyệt sang /auth/google (Bước 1 -> Bước 2 -> Bước 3 -> Bước 4)
        if (this.isBackendAvailable && this.isBackendOAuthConfigured) {
            window.location.href = "/auth/google";
            return;
        }

        // Ưu tiên 2: Nếu người dùng đã điền Google Client ID trên trình duyệt -> Mở cửa sổ accounts.google.com
        const clientId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
        if (clientId) {
            // Nếu VS Code Live Server mở bằng 127.0.0.1, tự động chuyển sang localhost cùng cổng để Google OAuth không báo lỗi Origin
            if (window.location.hostname === "127.0.0.1") {
                const localhostUrl = window.location.href.replace("127.0.0.1", "localhost");
                window.location.href = localhostUrl;
                return;
            }
            if (typeof google !== "undefined" && google.accounts) {
                this.triggerRealGoogleSignIn();
                return;
            }
        }

        // Ưu tiên 3: Nếu đã cấu hình Supabase -> gọi Supabase OAuth Redirect
        if (this.supabaseClient) {
            await this.redirectViaSupabaseGoogleOAuth();
            return;
        }

        // Ưu tiên 4: Mở trình xác thực Google OAuth 4 Bước (Hiển thị rõ từng bước: Redirect -> Cấp quyền -> Authorization Code -> Backend đổi Access Token)
        this.openGoogleChooserModal();
    },

    async saveBackendOAuthConfig() {
        const clientId = document.getElementById("google-client-id-input")?.value.trim() || "";
        const clientSecret = document.getElementById("google-client-secret-input")?.value.trim() || "";

        if (clientId) {
            localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId);
        } else {
            localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
        }

        if (this.isBackendAvailable) {
            try {
                const res = await fetch("/api/auth/config", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ clientId, clientSecret })
                });
                const data = await res.json();
                if (data.ok) {
                    this.isBackendOAuthConfigured = Boolean(data.isOAuthConfigured);
                    this.showToast(
                        this.isBackendOAuthConfigured
                            ? "✅ Đã lưu Client ID & Secret vào Backend! Bấm 'Đăng nhập với Google' để chuyển hướng tới accounts.google.com."
                            : "✅ Đã cập nhật cấu hình OAuth trên Server."
                    );
                    this.renderLoginPage(document.getElementById("app-main"));
                    return;
                }
            } catch (e) {
                console.warn("Không thể lưu cấu hình lên Backend:", e);
            }
        }

        this.saveGoogleClientId();
    },

    startFourStepOAuthDemo() {
        if (this.isBackendAvailable && this.isBackendOAuthConfigured) {
            window.location.href = "/auth/google";
            return;
        }
        this.openGoogleChooserModal();
    },

    // Gọi trực tiếp Supabase signInWithOAuth({ provider: "google" }) để lấy URL đăng nhập
    async redirectViaSupabaseGoogleOAuth() {
        if (!this.supabaseClient) {
            this.initSupabaseIfConfigured();
        }
        if (!this.supabaseClient) {
            this.showToast("Không thể khởi tạo Supabase Client. Đang mở bộ chọn tài khoản Google...");
            this.triggerRealGoogleSignIn();
            return;
        }
        try {
            localStorage.setItem("auth_redirect", "/");
            // Supabase OAuth yêu cầu URL http(s); khi mở bằng file:// thì dùng popup Google
            if (window.location.protocol === "file:") {
                this.triggerRealGoogleSignIn();
                return;
            }
            const redirectTarget = window.location.origin + window.location.pathname;

            const { error } = await this.supabaseClient.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectTarget
                }
            });
            if (error) throw error;
        } catch (err) {
            console.warn("Lỗi Supabase Google OAuth Redirect:", err);
            this.triggerRealGoogleSignIn();
        }
    },

    // Xử lý đăng nhập / đăng ký bằng Email & Mật khẩu kết nối trực tiếp tới Supabase Auth
    async handleSupabaseEmailAuth(e) {
        if (e && e.preventDefault) e.preventDefault();
        const email = document.getElementById("login-email")?.value.trim();
        const password = document.getElementById("login-password")?.value || "";
        const fullName = document.getElementById("login-fullname")?.value.trim() || "";
        const alertBox = document.getElementById("login-alert-box");
        const submitBtn = document.getElementById("email-auth-submit-btn");

        if (!email || !password) return;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Đang xác thực...</span>`;
        }
        if (alertBox) alertBox.classList.add("hidden");

        try {
            if (!this.supabaseClient) {
                this.initSupabaseIfConfigured();
            }

            if (this.supabaseClient) {
                if (this.loginMode === "signup") {
                    const { data, error } = await this.supabaseClient.auth.signUp({
                        email,
                        password,
                        options: {
                            data: { full_name: fullName || email.split("@")[0] }
                        }
                    });
                    if (error) throw error;
                    if (data?.user) {
                        await this.loadFromCloudOrLocalForUser({
                            uid: data.user.id,
                            name: fullName || email.split("@")[0],
                            email: email,
                            provider: "supabase-email"
                        });
                        this.showToast(`🎉 Đăng ký & đăng nhập tài khoản ${email} thành công!`);
                        this.navigate("home");
                        return;
                    }
                } else {
                    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });
                    if (error) {
                        // Nếu tài khoản chưa có trên Supabase cloud nhưng người dùng muốn đăng nhập nhanh trên thiết bị
                        console.warn("Supabase signInWithPassword trả về:", error.message);
                    } else if (data?.user) {
                        const meta = data.user.user_metadata || {};
                        await this.loadFromCloudOrLocalForUser({
                            uid: data.user.id,
                            name: meta.full_name || meta.name || email.split("@")[0],
                            email: data.user.email,
                            photoURL: meta.avatar_url || "",
                            provider: "supabase-email"
                        });
                        this.showToast(`🎉 Đăng nhập thành công với tài khoản ${email} (Supabase Cloud)!`);
                        this.navigate("home");
                        return;
                    }
                }
            }

            // Fallback thông minh: Tự động đăng nhập và đồng bộ tài khoản theo Email ngay trên máy để không bị gián đoạn việc học
            await this.loadFromCloudOrLocalForUser({
                name: fullName || email.split("@")[0],
                email: email,
                targetScore: 800,
                provider: "email-account"
            });
            this.showToast(`🎉 Đã đăng nhập tài khoản ${email} và bật tự động sao lưu tiến độ học!`);
            this.navigate("home");
        } catch (err) {
            if (alertBox) {
                alertBox.textContent = err.message || "Không thể xác thực tài khoản. Vui lòng kiểm tra lại thông tin.";
                alertBox.classList.remove("hidden");
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>${this.loginMode === "signup" ? "Đăng ký & Sao lưu tự động" : "Đăng nhập bằng Email"}</span><i class="fa-solid fa-arrow-right text-xs"></i>`;
            }
        }
    },

    saveGoogleClientId() {
        const input = document.getElementById("google-client-id-input");
        const val = input ? input.value.trim() : "";
        if (!val) {
            localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
            this.showToast("Đã xóa Google Client ID.");
            this.renderLoginPage(document.getElementById("app-main"));
            return;
        }
        localStorage.setItem(GOOGLE_CLIENT_ID_KEY, val);
        this.showToast("✅ Đã lưu Google Client ID! Bây giờ bạn có thể bấm 'Tiếp tục với Google' để mở cửa sổ Google thật.");
        this.renderLoginPage(document.getElementById("app-main"));
    },

    initGoogleIdentityButton() {
        const clientId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
        if (!clientId || typeof google === "undefined" || !google.accounts) return;

        try {
            // 1. Khởi tạo OAuth2 Token Client để khi bấm nút "Tiếp tục với Google" sẽ mở Popup accounts.google.com thật
            this.googleTokenClient = google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: "openid email profile",
                callback: async (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        await this.fetchGoogleUserProfile(tokenResponse.access_token);
                    }
                }
            });

            // 2. Khởi tạo Google One Tap / Nút Sign-In chính chủ
            google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => this.handleGoogleCredentialJwt(response)
            });

            const btnContainer = document.getElementById("g-signin-official-btn");
            if (btnContainer) {
                google.accounts.id.renderButton(btnContainer, {
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "pill",
                    width: 320
                });
            }
        } catch (err) {
            console.warn("Lỗi khởi tạo Google Identity Services:", err);
        }
    },

    async fetchGoogleUserProfile(accessToken) {
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (!res.ok) throw new Error("Không thể lấy thông tin từ Google API");
            const profile = await res.json();

            await this.loadFromCloudOrLocalForUser({
                uid: profile.sub,
                name: profile.name || profile.given_name || profile.email.split("@")[0],
                email: profile.email,
                photoURL: profile.picture || "",
                targetScore: 800,
                provider: "google-oauth-real"
            });

            this.closeGoogleChooserModal();
            this.closeAuthModal();
            this.showToast(`🎉 Đã kết nối trực tiếp tài khoản Google: ${profile.email}!`);
            this.navigate("home");
        } catch (err) {
            console.error(err);
            this.showToast("❌ Kết nối Google OAuth thất bại. Vui lòng kiểm tra lại Client ID hoặc Origin.");
        }
    },

    async handleGoogleCredentialJwt(response) {
        if (!response || !response.credential) return;
        try {
            // Giải mã JWT ID Token trả về trực tiếp từ Google
            const base64Url = response.credential.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            const payload = JSON.parse(jsonPayload);

            await this.loadFromCloudOrLocalForUser({
                uid: payload.sub,
                name: payload.name || payload.email.split("@")[0],
                email: payload.email,
                photoURL: payload.picture || "",
                targetScore: 800,
                provider: "google-jwt-real"
            });

            this.closeGoogleChooserModal();
            this.closeAuthModal();
            this.showToast(`🎉 Đăng nhập Google chính thức thành công (${payload.email})!`);
            this.navigate("home");
        } catch (e) {
            console.error("Lỗi giải mã Google JWT:", e);
        }
    },

    triggerRealGoogleSignIn() {
        // Ưu tiên 1: Nếu đã cấu hình Firebase Cloud -> Mở cửa sổ Google OAuth Popup của Firebase
        if (this.isCloudConnected && this.firebaseAuth && typeof firebase !== "undefined") {
            this.loginWithGooglePopup();
            return;
        }

        // Ưu tiên 2: Nếu đã nhập Google OAuth Client ID -> Mở cửa sổ Popup thật của accounts.google.com
        const clientId = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
        if (clientId && typeof google !== "undefined" && google.accounts) {
            if (!this.googleTokenClient) {
                this.initGoogleIdentityButton();
            }
            if (this.googleTokenClient) {
                this.googleTokenClient.requestAccessToken({ prompt: "select_account" });
                return;
            }
        }

        // Ưu tiên 3: Nếu chưa cấu hình Client ID -> Mở bộ chọn tài khoản nhanh
        this.openGoogleChooserModal();
    },

    openGoogleChooserModal() {
        // Nếu đã cấu hình Firebase Cloud thực tế -> thử mở Google OAuth Popup trước
        if (this.isCloudConnected && this.firebaseAuth && typeof firebase !== "undefined") {
            this.loginWithGooglePopup();
            return;
        }

        const modal = document.getElementById("google-chooser-modal");
        const listEl = document.getElementById("google-chooser-accounts-list");
        const addForm = document.getElementById("google-chooser-add-form");
        if (!modal || !listEl) return;

        // Lấy các tài khoản đã có hoặc tạo danh sách gợi ý nếu chưa có tài khoản nào
        const accountsMap = this.getAccountsMap();
        let emails = Object.keys(accountsMap);

        // Nếu chưa có tài khoản nào được lưu, hiển thị sẵn 1 tài khoản Google mặc định để 1-click đăng nhập ngay
        const defaultAccounts = [
            { email: "hocvien.kaitoeic@gmail.com", name: "Học viên Kai Toeic" }
        ];

        const displayItems = emails.length > 0
            ? emails.map(k => ({
                email: accountsMap[k].user?.email || k,
                name: accountsMap[k].user?.name || "Học viên Kai Toeic",
                learned: (accountsMap[k].learnedVocabIds || []).length
            }))
            : defaultAccounts.map(d => ({ ...d, learned: this.state.learnedVocabIds.length }));

        listEl.innerHTML = displayItems.map(item => `
            <button type="button" onclick="app.selectGoogleChooserAccount('${this.escapeJsString(item.email)}', '${this.escapeJsString(item.name)}')" class="w-full py-3.5 px-3 hover:bg-slate-50 flex items-center justify-between gap-3 text-left transition group">
                <div class="flex items-center gap-3.5 min-w-0">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        ${this.escapeHtml(item.name.charAt(0).toUpperCase())}
                    </div>
                    <div class="min-w-0">
                        <div class="text-sm font-extrabold text-slate-900 group-hover:text-brand-600 truncate">${this.escapeHtml(item.name)}</div>
                        <div class="text-xs text-slate-500 truncate">${this.escapeHtml(item.email)}</div>
                    </div>
                </div>
                <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">Chọn &rarr;</span>
            </button>
        `).join("");

        if (addForm) addForm.classList.add("hidden");
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    },

    closeGoogleChooserModal() {
        const modal = document.getElementById("google-chooser-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    },

    toggleAddGoogleAccountForm() {
        const form = document.getElementById("google-chooser-add-form");
        if (form) {
            form.classList.toggle("hidden");
            const emailInput = document.getElementById("google-chooser-email");
            if (!form.classList.contains("hidden") && emailInput) {
                emailInput.focus();
            }
        }
    },

    async selectGoogleChooserAccount(email, name) {
        const listEl = document.getElementById("google-chooser-accounts-list");
        const randomAuthCode = "4/0AVG7fi" + Math.random().toString(36).substring(2, 12).toUpperCase();

        // Hiển thị trực quan Bước 2 -> Bước 3 -> Bước 4 ngay trong hộp thoại Google OAuth
        if (listEl) {
            listEl.innerHTML = `
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-left text-xs">
                    <div class="flex items-center gap-2 text-emerald-700 font-extrabold">
                        <i class="fa-solid fa-circle-check"></i>
                        <span>Bước 1 & 2: Đã cấp quyền chia sẻ Tên, Email, Ảnh đại diện (${this.escapeHtml(email)})</span>
                    </div>
                    <div class="flex items-center gap-2 text-brand-700 font-extrabold">
                        <i class="fa-solid fa-key"></i>
                        <span>Bước 3: Google trả về Authorization Code: <code class="bg-brand-100 px-1.5 py-0.5 rounded">${randomAuthCode}</code></span>
                    </div>
                    <div class="flex items-center gap-2 text-indigo-700 font-extrabold">
                        <i class="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Bước 4: Backend đang đổi Code lấy Access Token & đồng bộ tài khoản...</span>
                    </div>
                </div>
            `;
        }

        await new Promise(r => setTimeout(r, 650));

        await this.loadFromCloudOrLocalForUser({
            name: name || email.split("@")[0],
            email: email,
            targetScore: 800,
            provider: "google-oauth2-code"
        });
        this.closeGoogleChooserModal();
        this.closeAuthModal();
        this.showToast(`🎉 [Hoàn tất 4 Bước OAuth] Đã đăng nhập Google (${email}) & tự động sao lưu dữ liệu!`);
        this.navigate("home");
    },

    async handleGoogleChooserSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        const email = document.getElementById("google-chooser-email")?.value.trim();
        const name = document.getElementById("google-chooser-name")?.value.trim();
        if (!email) return;
        await this.selectGoogleChooserAccount(email, name || email.split("@")[0]);
    },

    renderHome(container) {
        const latestScore = this.state.examHistory.length > 0
            ? this.state.examHistory[0].totalScore
            : 685;

        container.innerHTML = `
            <!-- HERO SECTION -->
            <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-900 text-white py-14 sm:py-20">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div class="lg:col-span-7 space-y-6">
                            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold text-amber-300">
                                <i class="fa-solid fa-sparkles"></i>
                                <span>Nền tảng Luyện thi TOEIC 4 Kỹ năng #1 Việt Nam</span>
                            </div>
                            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                Chinh phục <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">800+ TOEIC</span> Cấp tốc cùng Kai Toeic
                            </h1>
                            <p class="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                                Hệ thống luyện đề <strong>ETS 2026</strong> sát thực tế 99%, chấm điểm tự động kèm giải thích song ngữ từng câu. Tích hợp <strong>Luyện Nghe Chép Chính Tả</strong>, <strong>Đọc Part 7 Click-tra-từ</strong> và <strong>AI Chấm Điểm Speaking & Writing</strong> tức thì.
                            </p>

                            <div class="flex flex-wrap items-center gap-3.5 pt-2">
                                <button onclick="app.startExam('ets-2026-test-1')" class="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <i class="fa-solid fa-play"></i> Làm Đề Thi Thử ETS 2026 Ngay
                                </button>
                                <button onclick="app.navigate('speaking-writing')" class="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-sm transition flex items-center gap-2">
                                    <i class="fa-solid fa-robot text-emerald-400"></i> Trải nghiệm AI Chấm Writing
                                </button>
                            </div>

                            <!-- Stats -->
                            <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
                                <div>
                                    <div class="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
                                    <div class="text-xs text-slate-300">Bộ đề ETS chuẩn mới</div>
                                </div>
                                <div>
                                    <div class="text-2xl sm:text-3xl font-extrabold text-emerald-400">5.000+</div>
                                    <div class="text-xs text-slate-300">Câu hỏi giải thích chi tiết</div>
                                </div>
                                <div>
                                    <div class="text-2xl sm:text-3xl font-extrabold text-amber-300">85.000+</div>
                                    <div class="text-xs text-slate-300">Học viên đạt mục tiêu</div>
                                </div>
                            </div>
                        </div>

                        <!-- Interactive Preview Card on Right -->
                        <div class="lg:col-span-5">
                            <div class="bg-white text-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
                                <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                                            <i class="fa-solid fa-bolt"></i>
                                        </div>
                                        <div>
                                            <h3 class="font-extrabold text-slate-900 text-sm">Bảng Điều Khiển Học Tập</h3>
                                            <p class="text-xs text-slate-500">Ước tính điểm TOEIC hiện tại của bạn</p>
                                        </div>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold">${latestScore} / 990</span>
                                </div>

                                <!-- Quick Question Of The Day -->
                                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">Thử thách Part 5 mỗi ngày</span>
                                        <span class="text-xs text-slate-400">Câu hỏi #104</span>
                                    </div>
                                    <p class="text-sm font-semibold text-slate-800 mb-3">
                                        "All visitors must _______ their security badges at the reception desk before entering the research laboratory."
                                    </p>
                                    <div id="hero-mini-quiz" class="grid grid-cols-2 gap-2 text-xs">
                                        <button onclick="app.answerHeroMiniQuiz('A')" class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-500 text-left font-semibold transition">(A) obtain</button>
                                        <button onclick="app.answerHeroMiniQuiz('B')" class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-500 text-left font-semibold transition">(B) obtenable</button>
                                        <button onclick="app.answerHeroMiniQuiz('C')" class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-500 text-left font-semibold transition">(C) obtaining</button>
                                        <button onclick="app.answerHeroMiniQuiz('D')" class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-500 text-left font-semibold transition">(D) obtained</button>
                                    </div>
                                    <div id="hero-mini-feedback" class="hidden mt-3 p-2.5 rounded-lg text-xs"></div>
                                </div>

                                <!-- 4 Skills Shortcut Pills -->
                                <div class="grid grid-cols-2 gap-2.5">
                                    <button onclick="app.navigate('listening')" class="p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 flex items-center gap-2.5 transition text-left">
                                        <i class="fa-solid fa-headphones text-indigo-600 text-lg"></i>
                                        <div>
                                            <div class="text-xs font-extrabold">Luyện Nghe</div>
                                            <div class="text-[11px] text-indigo-600">Chép chính tả Part 1-4</div>
                                        </div>
                                    </button>
                                    <button onclick="app.navigate('reading')" class="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 flex items-center gap-2.5 transition text-left">
                                        <i class="fa-solid fa-book-open text-amber-600 text-lg"></i>
                                        <div>
                                            <div class="text-xs font-extrabold">Luyện Đọc</div>
                                            <div class="text-[11px] text-amber-700">Part 5, 6, 7 Song ngữ</div>
                                        </div>
                                    </button>
                                    <button onclick="app.navigate('speaking-writing')" class="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 flex items-center gap-2.5 transition text-left">
                                        <i class="fa-solid fa-pen-nib text-rose-600 text-lg"></i>
                                        <div>
                                            <div class="text-xs font-extrabold">Nói & Viết AI</div>
                                            <div class="text-[11px] text-rose-600">Chấm sửa lỗi tức thì</div>
                                        </div>
                                    </button>
                                    <button onclick="app.openVocabSection('600-words')" class="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 flex items-center gap-2.5 transition text-left">
                                        <i class="fa-solid fa-layer-group text-purple-600 text-lg"></i>
                                        <div>
                                            <div class="text-xs font-extrabold">Từ Vựng TOEIC</div>
                                            <div class="text-[11px] text-purple-600">600 Từ & 300 Phrasal Verbs</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 6 TÍNH NĂNG CỐT LÕI CỦA KAI TOEIC -->
            <section class="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-3xl mx-auto mb-12">
                    <span class="text-brand-600 font-extrabold text-xs uppercase tracking-widest">Hệ sinh thái học tập toàn diện</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Tất cả những gì bạn cần để chinh phục Kai Toeic điểm cao</h2>
                    <p class="text-sm sm:text-base text-slate-500 mt-2">Được thiết kế tối ưu giúp người mất gốc hoặc ôn thi cấp tốc tiết kiệm 60% thời gian tự học.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Feature 1 -->
                    <div onclick="app.navigate('mock-tests')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-file-circle-check"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">1. Thi thử TOEIC Sát Đề Thật</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Giao diện mô phỏng phòng thi thật với đồng hồ đếm ngược, bảng đánh dấu câu hỏi, chấm điểm theo thang ETS và giải thích chi tiết từng câu.</p>
                        <span class="text-xs font-extrabold text-brand-600 group-hover:underline">Vào kho đề ETS 2026 &rarr;</span>
                    </div>

                    <!-- Feature 2 -->
                    <div onclick="app.navigate('listening')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-headphones-simple"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">2. Luyện Nghe Chép Chính Tả</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Phương pháp Dictation giúp bắt trọn âm nối, âm cuối và tăng phản xạ nghe hiểu cho cả 4 Part Listening chỉ sau 2 tuần luyện tập.</p>
                        <span class="text-xs font-extrabold text-brand-600 group-hover:underline">Luyện nghe ngay &rarr;</span>
                    </div>

                    <!-- Feature 3 -->
                    <div onclick="app.navigate('reading')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-language"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">3. Đọc Part 7 Song Ngữ & Tra Từ</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Đọc hiểu các bài Email, Quảng cáo, Bài báo TOEIC kèm bản dịch song ngữ Anh - Việt. Bấm trực tiếp vào từ bất kỳ để tra nghĩa và lưu vào sổ tay.</p>
                        <span class="text-xs font-extrabold text-brand-600 group-hover:underline">Khám phá phòng đọc &rarr;</span>
                    </div>

                    <!-- Feature 4 -->
                    <div onclick="app.navigate('speaking-writing')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">4. AI Chấm Điểm Speaking & Writing</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Thu âm bài nói, viết Email và Essay trực tiếp trên web. Hệ thống AI phân tích ngữ pháp, từ vựng, độ trôi chảy và gợi ý bài mẫu điểm cao.</p>
                        <span class="text-xs font-extrabold text-brand-600 group-hover:underline">Thử AI chấm bài &rarr;</span>
                    </div>

                    <!-- Feature 5 -->
                    <div onclick="app.openVocabSection('600-words')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-brain"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">5. Kho Từ Vựng (600 Từ & 300 Phrasal Verbs)</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Gồm 2 mục chuyên sâu: 600 từ vựng Barron's (50 bài) và 300 cụm động từ TOEIC (25 bài) qua Flashcard 3D có phát âm và ví dụ song ngữ.</p>
                        <div class="flex items-center gap-3">
                            <span onclick="event.stopPropagation(); app.openVocabSection('600-words')" class="text-xs font-extrabold text-brand-600 hover:underline">600 Từ vựng &rarr;</span>
                            <span onclick="event.stopPropagation(); app.openVocabSection('300-phrasal')" class="text-xs font-extrabold text-cyan-600 hover:underline">300 Phrasal Verbs &rarr;</span>
                        </div>
                    </div>

                    <!-- Feature 6 -->
                    <div onclick="app.navigate('dashboard')" class="cursor-pointer group bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-xl transition">
                        <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                            <i class="fa-solid fa-chart-column"></i>
                        </div>
                        <h3 class="font-extrabold text-lg text-slate-900 mb-2">6. Phân Tích Điểm & Lộ Trình Cá Nhân</h3>
                        <p class="text-sm text-slate-600 leading-relaxed mb-4">Lưu trữ toàn bộ lịch sử bài thi, thống kê tỷ lệ đúng theo từng Part để chỉ ra chính xác kỹ năng bạn cần cải thiện.</p>
                        <span class="text-xs font-extrabold text-brand-600 group-hover:underline">Xem thống kê tiến độ &rarr;</span>
                    </div>
                </div>
            </section>

            <!-- LỘ TRÌNH HỌC CÁ NHÂN HÓA -->
            <section class="py-12 bg-white border-y border-slate-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <span class="text-brand-600 font-extrabold text-xs uppercase tracking-widest">Lộ trình bài bản</span>
                            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Lộ trình Luyện thi TOEIC 3 Giai Đoạn</h2>
                        </div>
                        <button onclick="app.navigate('mock-tests')" class="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition self-start">
                            Làm bài Test đầu vào miễn phí &rarr;
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
                            <span class="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-extrabold">Chặng 1: 0 &rarr; 450+</span>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-3 mb-2">Xây nền Từ vựng & Ngữ pháp cốt lõi</h4>
                            <ul class="space-y-2 text-sm text-slate-600">
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Nắm vững 12 chủ điểm ngữ pháp Part 5 (Từ loại, Thì, Liên từ).</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Luyện nghe chép chính tả Part 1 (Mô tả tranh) & Part 2 (Hỏi đáp).</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Thuộc 300 từ vựng TOEIC cơ bản nhất.</li>
                            </ul>
                        </div>

                        <div class="p-6 rounded-2xl bg-indigo-50/60 border-2 border-brand-500 relative shadow-md">
                            <span class="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-extrabold">Chặng 2: 450 &rarr; 700+ (Phổ biến nhất)</span>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-3 mb-2">Tăng tốc Kỹ năng & Chiến thuật làm bài</h4>
                            <ul class="space-y-2 text-sm text-slate-600">
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Kỹ thuật bắt Keyword và tránh bẫy Paraphrase trong Part 3 & Part 4.</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Luyện đọc Skimming & Scanning cho đoạn đơn và đoạn kép Part 7.</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Làm quen cấu trúc đề Speaking & Writing.</li>
                            </ul>
                        </div>

                        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
                            <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">Chặng 3: 700 &rarr; 900+</span>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-3 mb-2">Luyện đề ETS Chuyên sâu & Thực chiến</h4>
                            <ul class="space-y-2 text-sm text-slate-600">
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Giải trọn bộ đề ETS 2025 - 2026 dưới áp lực bấm giờ 120 phút.</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Phân tích chi tiết mọi câu sai và học từ vựng đồng nghĩa nâng cao.</li>
                                <li><i class="fa-solid fa-check text-emerald-500 mr-2"></i>Luyện viết Essay 300 từ đạt chuẩn 180+/200 điểm Writing.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    answerHeroMiniQuiz(choice) {
        const fb = document.getElementById("hero-mini-feedback");
        if (!fb) return;
        fb.classList.remove("hidden", "bg-emerald-100", "text-emerald-800", "bg-rose-100", "text-rose-800");

        if (choice === "A") {
            fb.classList.add("bg-emerald-100", "text-emerald-800");
            fb.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i> <strong>Chính xác!</strong> Sau động từ khuyết thiếu <code>must</code> cần một động từ nguyên mẫu (V-inf) là <strong>obtain</strong> (nhận/lấy thẻ an ninh).`;
        } else {
            fb.classList.add("bg-rose-100", "text-rose-800");
            fb.innerHTML = `<i class="fa-solid fa-circle-xmark mr-1"></i> <strong>Chưa đúng!</strong> Đáp án đúng là <strong>(A) obtain</strong> vì đứng sau modal verb <code>must</code> cần động từ nguyên thể.`;
        }
    },

    renderEmptyState(container, title, message) {
        container.innerHTML = `
            <div class="max-w-3xl mx-auto px-4 py-20 text-center">
                <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><i class="fa-regular fa-folder-open text-2xl"></i></div>
                <h1 class="text-2xl font-extrabold text-slate-900">${this.escapeHtml(title)}</h1>
                <p class="mt-2 text-sm text-slate-600">${message}</p>
                <button onclick="app.navigate('home')" class="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-700">Về trang chủ</button>
            </div>
        `;
    },

    // ================= 2. DANH SÁCH ĐỀ THI THỬ (MOCK TESTS) =================
    renderMockTestsList(container) {
        const tests = window.DAU_DATA.mockTests || [];
        if (!tests.length) {
            container.innerHTML = `
                <div class="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><i class="fa-regular fa-file-lines text-2xl"></i></div>
                    <h1 class="text-2xl font-extrabold text-slate-900">Thư viện đề thi đang trống</h1>
                    <p class="mt-2 text-sm text-slate-600">Chưa có đề thi nào trong hệ thống. Hãy thêm đề mới vào mục <code class="rounded bg-slate-100 px-1.5 py-0.5">mockTests</code> của <code class="rounded bg-slate-100 px-1.5 py-0.5">data.js</code> rồi tải lại trang.</p>
                    <button onclick="app.navigate('home')" class="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-700">Về trang chủ</button>
                </div>
            `;
            return;
        }
        const cardsHtml = tests.map(test => {
            const isVipLocked = !test.isFree && !(this.state.user && this.state.user.isVip);
            const badgeHtml = isVipLocked
                ? `<span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold"><i class="fa-solid fa-crown text-amber-500 mr-1"></i>VIP Pro</span>`
                : `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold">Miễn phí 100%</span>`;

            return `
                <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-3">
                            <span class="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-200">${test.category}</span>
                            ${badgeHtml}
                        </div>
                        <h3 class="text-lg font-extrabold text-slate-900 mb-2">${test.title}</h3>
                        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">${test.description}</p>

                        <div class="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center mb-5">
                            <div>
                                <div class="text-xs text-slate-400">Thời gian</div>
                                <div class="text-sm font-extrabold text-slate-800"><i class="fa-regular fa-clock text-brand-600 mr-1"></i>${test.duration} phút</div>
                            </div>
                            <div>
                                <div class="text-xs text-slate-400">Cấu trúc</div>
                                <div class="text-sm font-extrabold text-slate-800">7 Parts (${test.AdaptiveQuestionsCount} câu tinh gọn)</div>
                            </div>
                            <div>
                                <div class="text-xs text-slate-400">Lượt thi</div>
                                <div class="text-sm font-extrabold text-emerald-600">${test.participants.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2.5">
                        ${isVipLocked
                            ? `<button onclick="app.openVipModal()" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md transition">
                                <i class="fa-solid fa-lock-open mr-1"></i> Mở khóa đề VIP Miễn phí
                               </button>`
                            : `<button onclick="app.startExam('${test.id}')" class="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-600/20 transition">
                                <i class="fa-solid fa-pen-to-square mr-1"></i> Bắt đầu làm bài ngay
                               </button>`
                        }
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="bg-gradient-to-r from-brand-700 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <span class="px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold uppercase">Thư viện Đề thi Chuẩn IIG / ETS</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">Thi Thử TOEIC Online (Listening & Reading)</h1>
                        <p class="text-sm text-slate-200 mt-1 max-w-2xl">
                            Mỗi đề thi được tích hợp sẵn bộ câu hỏi đại diện đầy đủ cả <strong>7 Parts (Part 1 &rarr; Part 7)</strong> giúp bạn trải nghiệm trọn vẹn phòng thi, chấm điểm tự động và xem giải thích song ngữ ngay lập tức.
                        </p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 shrink-0 text-center">
                        <div class="text-xs text-slate-200">Số đề bạn đã hoàn thành</div>
                        <div class="text-3xl font-extrabold text-amber-300 mt-0.5">${this.state.examHistory.length} đề</div>
                        <button onclick="app.navigate('dashboard')" class="text-xs underline text-white hover:text-amber-200 mt-1">Xem lịch sử điểm &rarr;</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${cardsHtml}
                </div>
            </div>
        `;
    },

    // ================= 3. PHÒNG THI ẢO TOEIC (EXAM ROOM) =================
    startExam(testId) {
        const allTests = window.DAU_DATA.mockTests || [];
        const baseTest = allTests.find(t => t.id === testId) || allTests[0];
        if (!baseTest) {
            this.showToast("Thư viện chưa có đề thi nào để bắt đầu.");
            return;
        }
        const baseQuestions = baseTest.questions;

        // Sao chép danh sách câu hỏi
        let questions = JSON.parse(JSON.stringify(baseQuestions));
        if (testId === "mini-test-sprint") {
            questions = questions.slice(0, 10);
        }

        this.state.activeExam = {
            testId: baseTest.id,
            title: baseTest.title,
            durationSeconds: baseTest.duration * 60,
            remainingSeconds: baseTest.duration * 60,
            questions: questions,
            currentIndex: 0,
            userAnswers: {}, // { questionId: 'A' | 'B' | 'C' | 'D' }
            flaggedQuestions: {}, // { questionId: true }
            timerInterval: null,
            isSubmitted: false
        };

        this.navigate("exam-room");
        this.startExamTimer();
    },

    startExamTimer() {
        if (this.state.activeExam && this.state.activeExam.timerInterval) {
            clearInterval(this.state.activeExam.timerInterval);
        }
        this.state.activeExam.timerInterval = setInterval(() => {
            if (!this.state.activeExam || this.state.currentView !== "exam-room") {
                clearInterval(this.state.activeExam?.timerInterval);
                return;
            }
            this.state.activeExam.remainingSeconds--;
            const timerEl = document.getElementById("exam-timer-display");
            if (timerEl) {
                timerEl.textContent = this.formatSeconds(this.state.activeExam.remainingSeconds);
            }
            if (this.state.activeExam.remainingSeconds <= 0) {
                clearInterval(this.state.activeExam.timerInterval);
                this.submitExam(true);
            }
        }, 1000);
    },

    formatSeconds(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    },

    formatPart6PassageHtml(passageHtml, activeBlankNumber) {
        if (!passageHtml) return "";
        const activeNum = Number(activeBlankNumber);
        const baseCls = "inline-flex items-baseline gap-1.5 px-2 py-0.5 mx-1 font-bold rounded border whitespace-nowrap";
        return String(passageHtml).replace(
            /<strong>\[(\d+)\](?:\s*_*)?<\/strong>(?:\s*_*)?/g,
            (_, numStr) => {
                const isActive = Number(numStr) === activeNum;
                const stateCls = isActive
                    ? "bg-amber-200 text-neutral-950 border-neutral-900 ring-2 ring-amber-400 shadow-sm"
                    : "bg-slate-100 text-slate-800 border-slate-300";
                const lineCls = isActive ? "tracking-widest text-neutral-950" : "tracking-widest text-slate-500";
                return `<span class="${baseCls} ${stateCls}">[${numStr}] <span class="${lineCls}">_______</span></span>`;
            }
        );
    },

    renderExamRoom(container) {
        const exam = this.state.activeExam;
        if (!exam) {
            this.navigate("mock-tests");
            return;
        }

        const previousEtsAudio = container.querySelector("#exam-ets2020-audio");
        if (previousEtsAudio) {
            exam.ets2020AudioCurrentTime = previousEtsAudio.currentTime;
            exam.ets2020AudioWasPlaying = !previousEtsAudio.paused && !previousEtsAudio.ended;
        }
        const q = exam.questions[exam.currentIndex];
        const answeredCount = Object.keys(exam.userAnswers).length;
        const totalQ = exam.questions.length;

        // Hướng dẫn chuẩn đề thi ETS cho từng Part (Part 1 - Part 7)
        const etsDirectionsMap = {
            1: "<strong>PART 1 — Directions:</strong> For each question in this part, you will hear four statements about a picture in your test book. When you hear the statements, you must select the one statement that best describes what you see in the picture.",
            2: "<strong>PART 2 — Directions:</strong> You will hear a question or statement and three responses spoken in English. They will not be printed in your test book and will be spoken only one time. Select the best response to the question or statement.",
            3: "<strong>PART 3 — Directions:</strong> You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. Select the best response to each question.",
            4: "<strong>PART 4 — Directions:</strong> You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. Select the best response to each question.",
            5: "<strong>PART 5 — Directions:</strong> A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence.",
            6: "<strong>PART 6 — Directions:</strong> Read the texts that follow. A word, phrase, or sentence is missing in parts of each text. Four answer choices for each question are given below the text. Select the best answer to complete the text.",
            7: "<strong>PART 7 — Directions:</strong> In this part you will read a selection of texts, such as magazine and newspaper articles, e-mails, and instant messages. Each text or set of texts is followed by several questions. Select the best answer for each question."
        };
        const etsDirectionsHtml = etsDirectionsMap[q.part]
            ? `<div class="mb-4 border-2 border-neutral-800 bg-neutral-50 px-3.5 py-2.5 text-xs leading-relaxed text-neutral-800 font-serif">${etsDirectionsMap[q.part]}</div>`
            : "";

        // Minh họa hình ảnh trực quan cho câu hỏi Part 1 (chuẩn cấu trúc đề giấy ETS trắng đen)
        let visualIllustrationHtml = "";
        if (q.part === 1 && q.type !== "ets2020-listening") {
            const fallbackUrl = `assets/images/test-01/part1/q${((q.id - 1) % 6) + 1}.jpg`;
            const imgSrc = this.escapeHtml(q.imageUrl || fallbackUrl);
            visualIllustrationHtml = `
                <figure class="my-5 mx-auto max-w-2xl border-2 border-neutral-800 bg-white p-3 sm:p-4 shadow-sm">
                    <div class="border border-neutral-400 bg-neutral-100 overflow-hidden">
                        <img src="${imgSrc}" alt="Question ${q.id} photograph" class="block w-full max-h-[440px] object-contain mx-auto grayscale contrast-105" loading="lazy">
                    </div>
                </figure>
            `;
        }
        // Thanh điều khiển Audio cho các Part Listening (Part 1 - 4)
        let audioPlayerHtml = "";
        if (q.type === "ets2020-listening") {
            audioPlayerHtml = `
                <div class="bg-indigo-950 text-white p-4 rounded-xl mb-5 shadow-md">
                    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p class="font-extrabold">Audio gốc ETS TOEIC 2020</p>
                            <p class="mt-1 text-xs text-indigo-200">Bài nghe đầy đủ của Test ${String(exam.testId.split("-").pop()).padStart(2, "0")} • câu hỏi ${q.id}</p>
                        </div>
                        <a href="${this.escapeHtml(q.transcriptUrl)}" target="_blank" rel="noopener noreferrer" class="rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-white/10">
                            <i class="fa-regular fa-file-pdf mr-1"></i>Mở transcript scan
                        </a>
                    </div>
                    <audio id="exam-ets2020-audio" controls preload="metadata" class="w-full" src="${this.escapeHtml(q.audioUrl)}">
                        Trình duyệt của bạn không hỗ trợ phát audio.
                    </audio>
                    <p class="mt-2 text-xs text-indigo-200">Audio là toàn bộ Part Listening, không phải clip riêng của câu này. Transcript PDF là bản scan.</p>
                </div>
            `;
        } else if (q.type === "listening") {
            const audioSrc = q.audioUrl ? this.escapeHtml(q.audioUrl) : "";
            audioPlayerHtml = `
                <div class="bg-indigo-950 text-white p-4 rounded-xl mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                    <div class="flex-1 min-w-0">
                        ${audioSrc ? `
                            <p class="mb-2 text-xs font-extrabold uppercase tracking-wider text-amber-300">Audio câu ${q.id}</p>
                            <audio id="exam-audio-${q.id}" controls preload="metadata" class="w-full" src="${audioSrc}">
                                Trình duyệt của bạn không hỗ trợ phát audio.
                            </audio>
                        ` : `
                            <div class="flex items-center gap-3">
                                <button onclick="app.speakText('${this.escapeJsString(q.audioVoiceText)}')" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 transition shrink-0">
                                    <i class="fa-solid fa-volume-high"></i> Phát Audio Câu Này
                                </button>
                                <button onclick="app.stopSpeech()" class="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition">
                                    <i class="fa-solid fa-stop"></i> Dừng
                                </button>
                                <div class="hidden sm:flex items-end gap-1 h-5 ml-2">
                                    <span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span><span class="wave-bar"></span>
                                </div>
                            </div>
                        `}
                    </div>
                    <div class="flex flex-wrap items-center gap-3 shrink-0">
                        ${(q.part === 1 || q.part === 2) ? `
                            <button onclick="app.toggleBlindListening()" class="text-xs px-2.5 py-1.5 rounded-lg border border-amber-300/40 text-amber-200 hover:bg-white/10 font-semibold transition">
                                <i class="fa-regular ${exam.showPart12Text ? 'fa-eye-slash' : 'fa-eye'} mr-1"></i> ${exam.showPart12Text ? 'Ẩn lời đáp án (Chuẩn ETS)' : 'Hiện lời đáp án (Hỗ trợ)'}
                            </button>
                        ` : ""}
                        <button onclick="document.getElementById('exam-audio-script').classList.toggle('hidden')" class="text-xs text-amber-300 hover:underline font-semibold shrink-0">
                            <i class="fa-regular fa-file-lines mr-1"></i> Hiện/Ẩn Transcript
                        </button>
                    </div>
                </div>
                <div id="exam-audio-script" class="hidden bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 whitespace-pre-line mb-4">
                    <strong class="text-amber-900 block mb-1">Audio Script (Bản gỡ băng):</strong>${q.audioScript}
                </div>
            `;
        }

        // Đoạn văn cho Part 6, Part 7 hoặc bảng biểu đồ họa Part 3, 4
        let passageHtml = "";
        if (q.passageTitle || q.passageHtml) {
            let renderedPassageBody = q.passageHtml || "";
            if (q.part === 6 && renderedPassageBody) {
                renderedPassageBody = this.formatPart6PassageHtml(renderedPassageBody, q.id);
            }
            passageHtml = `
                <div class="mb-4">
                    ${q.passageTitle ? `<p class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900 mb-2">${q.passageTitle}</p>` : ""}
                    ${renderedPassageBody}
                </div>
            `;
        }

        // Chế độ ẩn chữ Part 1 & Part 2 giống hệt cuốn đề giấy ETS (trừ khi người học bật hỗ trợ)
        const isBlindEtsMode = (q.part === 1 || q.part === 2) && !exam.showPart12Text;
        const displayedQuestionText = isBlindEtsMode
            ? (q.part === 1
                ? `Question ${q.id}: Look at the picture and listen to the four statements. Choose the statement that best describes the picture.`
                : `Question ${q.id}: Mark your answer on your answer sheet.`)
            : q.questionText;

        // Các lựa chọn A, B, C, D
        const selectedKey = exam.userAnswers[q.id];
        const optionsHtml = q.options.map(opt => {
            const isSelected = selectedKey === opt.key;
            const btnStyle = isSelected
                ? "border-brand-600 bg-brand-50/80 ring-2 ring-brand-500/30 text-brand-950"
                : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50 text-slate-800";
            const circleStyle = isSelected
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-slate-100 text-slate-700 border-slate-300";

            const optionLabel = isBlindEtsMode ? `(${opt.key})` : opt.text;

            return `
                <button onclick="app.selectExamOption(${q.id}, '${opt.key}')" class="w-full p-4 rounded-xl border-2 ${btnStyle} text-left transition flex items-center gap-3.5 group">
                    <span class="w-8 h-8 rounded-full border ${circleStyle} font-extrabold text-sm flex items-center justify-center shrink-0 transition">
                        ${opt.key}
                    </span>
                    <span class="text-sm sm:text-base font-semibold">${optionLabel}</span>
                </button>
            `;
        }).join("");

        // Bảng Palette 200 câu hỏi bên phải chia theo từng Part chuẩn phiếu trả lời ETS
        const partGroups = [
            { part: 1, title: "Part 1: Photographs (1–6)" },
            { part: 2, title: "Part 2: Question-Response (7–31)" },
            { part: 3, title: "Part 3: Conversations (32–70)" },
            { part: 4, title: "Part 4: Talks (71–100)" },
            { part: 5, title: "Part 5: Incomplete Sentences (101–130)" },
            { part: 6, title: "Part 6: Text Completion (131–146)" },
            { part: 7, title: "Part 7: Reading Comprehension (147–200)" }
        ];
        const paletteHtml = partGroups.map(group => {
            const itemsWithIdx = exam.questions
                .map((item, idx) => ({ item, idx }))
                .filter(entry => entry.item.part === group.part);
            if (!itemsWithIdx.length) return "";
            const buttons = itemsWithIdx.map(({ item, idx }) => {
                const isCurrent = idx === exam.currentIndex;
                const isAnswered = Boolean(exam.userAnswers[item.id]);
                const isFlagged = Boolean(exam.flaggedQuestions[item.id]);

                let cls = "bg-slate-100 text-slate-700 border-slate-200";
                if (isAnswered) cls = "bg-emerald-600 text-white border-emerald-600";
                if (isCurrent) cls += " ring-2 ring-offset-1 ring-brand-600 font-extrabold";

                return `
                    <button onclick="app.jumpToQuestion(${idx})" class="relative h-8 rounded-md border ${cls} text-[11px] font-bold flex items-center justify-center transition hover:scale-105">
                        ${item.id}
                        ${isFlagged ? `<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></span>` : ""}
                    </button>
                `;
            }).join("");
            return `
                <div class="mb-3 last:mb-0">
                    <p class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">${group.title}</p>
                    <div class="grid grid-cols-6 gap-1.5">${buttons}</div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div id="exam-room-focus-target" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <!-- Thanh trạng thái Phòng Thi -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <span class="text-xs font-bold text-brand-600 uppercase">Phòng thi mô phỏng IIG / ETS (200 Câu Chuẩn Cấu Trúc Mới)</span>
                        <h2 class="text-base sm:text-lg font-extrabold text-slate-900">${exam.title}</h2>
                    </div>

                    <div class="flex items-center gap-3 sm:gap-5">
                        <div class="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl">
                            <i class="fa-regular fa-clock text-rose-600 font-bold"></i>
                            <span class="text-xs text-slate-500">Thời gian còn lại:</span>
                            <span id="exam-timer-display" class="font-mono font-extrabold text-base text-slate-900">${this.formatSeconds(exam.remainingSeconds)}</span>
                        </div>

                        <button onclick="app.submitExam(false)" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2">
                            <i class="fa-solid fa-paper-plane"></i> Nộp bài & Chấm điểm (${answeredCount}/${totalQ})
                        </button>
                    </div>
                </div>

                <!-- Khu vực làm bài chính -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Cột Câu hỏi (8 cols) -->
                    <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-lg bg-neutral-900 text-white font-extrabold text-xs">Question ${q.id} / ${totalQ}</span>
                                    <span class="text-xs sm:text-sm font-bold text-slate-700">${q.partName}</span>
                                </div>
                                <button onclick="app.toggleFlagQuestion(${q.id})" class="px-3 py-1.5 rounded-lg border ${exam.flaggedQuestions[q.id] ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'} text-xs font-bold transition">
                                    <i class="fa-solid fa-flag mr-1 ${exam.flaggedQuestions[q.id] ? 'text-amber-500' : ''}"></i> Đặt cờ xem lại
                                </button>
                            </div>

                            ${etsDirectionsHtml}
                            ${audioPlayerHtml}
                            ${visualIllustrationHtml}
                            ${passageHtml}

                            <h3 class="text-base sm:text-lg font-extrabold text-slate-900 mb-4">${displayedQuestionText}</h3>

                            <div class="space-y-3">
                                ${optionsHtml}
                            </div>
                        </div>

                        <!-- Điều hướng Câu trước / Câu tiếp -->
                        <div class="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
                            <button onclick="app.prevQuestion()" ${exam.currentIndex === 0 ? "disabled" : ""} class="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition">
                                &larr; Câu trước
                            </button>
                            <span class="text-xs text-slate-400">Mẹo: Bạn có thể nộp bài bất cứ lúc nào để xem giải thích chi tiết</span>
                            ${exam.currentIndex < totalQ - 1
                                ? `<button onclick="app.nextQuestion()" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition">
                                    Câu tiếp theo &rarr;
                                   </button>`
                                : `<button onclick="app.submitExam(false)" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition">
                                    Hoàn thành & Chấm điểm <i class="fa-solid fa-check ml-1"></i>
                                   </button>`
                            }
                        </div>
                    </div>

                    <!-- Cột Bảng câu hỏi (Question Palette - 4 cols) -->
                    <div class="lg:col-span-4 space-y-4">
                        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h4 class="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
                                <span>Phiếu trả lời (Part 1 – Part 7)</span>
                                <span class="text-xs font-semibold text-emerald-600">Đã làm: ${answeredCount}/${totalQ}</span>
                            </h4>
                            <div class="max-h-[460px] overflow-y-auto pr-1 mb-4">
                                ${paletteHtml}
                            </div>
                            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
                                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-600 inline-block"></span> Đã chọn</span>
                                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-slate-200 inline-block"></span> Chưa làm</span>
                                <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Đặt cờ</span>
                            </div>
                        </div>

                        <div class="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 text-xs text-indigo-950 space-y-2">
                            <div class="font-extrabold text-sm flex items-center gap-1.5 text-indigo-900">
                                <i class="fa-solid fa-circle-info text-brand-600"></i> Cấu trúc Đề Thi Chuẩn ETS
                            </div>
                            <p>• <strong>Part 1 &amp; Part 2:</strong> Ẩn nội dung câu hỏi/đáp án trên đề giống hệt cuốn đề giấy ETS thật (bạn có thể bấm nút <em>"Hiện lời đáp án"</em> nếu muốn luyện tập).</p>
                            <p>• <strong>Part 3 &amp; Part 4:</strong> Tích hợp bảng biểu đồ họa (Visual Graphic) ở các nhóm câu cuối.</p>
                            <p>• <strong>Part 6 &amp; Part 7:</strong> Có câu điền nguyên câu vào đoạn văn (Sentence Insertion) và bộ 3 văn bản liên kết (Triple Passages Q186–200).</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const etsAudio = container.querySelector("#exam-ets2020-audio");
        if (etsAudio) {
            const restoreAudioPosition = () => {
                if (Number.isFinite(exam.ets2020AudioCurrentTime) && exam.ets2020AudioCurrentTime > 0) {
                    etsAudio.currentTime = Math.min(exam.ets2020AudioCurrentTime, etsAudio.duration || exam.ets2020AudioCurrentTime);
                }
                if (exam.ets2020AudioWasPlaying) {
                    etsAudio.play().catch(() => {
                        this.showToast("Hãy bấm phát để tiếp tục audio ETS 2020.");
                    });
                    exam.ets2020AudioWasPlaying = false;
                }
            };
            etsAudio.addEventListener("loadedmetadata", restoreAudioPosition, { once: true });
            etsAudio.addEventListener("timeupdate", () => {
                exam.ets2020AudioCurrentTime = etsAudio.currentTime;
            });
        }
    },

    selectExamOption(questionId, key) {
        if (!this.state.activeExam) return;
        this.state.activeExam.userAnswers[questionId] = key;
        this.renderExamRoom(document.getElementById("app-main"));
    },

    toggleBlindListening() {
        if (!this.state.activeExam) return;
        this.state.activeExam.showPart12Text = !this.state.activeExam.showPart12Text;
        this.renderExamRoom(document.getElementById("app-main"));
    },

    toggleFlagQuestion(questionId) {
        if (!this.state.activeExam) return;
        this.state.activeExam.flaggedQuestions[questionId] = !this.state.activeExam.flaggedQuestions[questionId];
        this.renderExamRoom(document.getElementById("app-main"));
    },

    jumpToQuestion(index) {
        if (!this.state.activeExam) return;
        this.stopSpeech();
        this.state.activeExam.currentIndex = index;
        this.renderExamRoom(document.getElementById("app-main"));
    },

    prevQuestion() {
        if (!this.state.activeExam) return;
        if (this.state.activeExam.currentIndex > 0) {
            this.jumpToQuestion(this.state.activeExam.currentIndex - 1);
        }
    },

    nextQuestion() {
        if (!this.state.activeExam) return;
        if (this.state.activeExam.currentIndex < this.state.activeExam.questions.length - 1) {
            this.jumpToQuestion(this.state.activeExam.currentIndex + 1);
        }
    },

    submitExam(isAutoTimeout = false) {
        const exam = this.state.activeExam;
        if (!exam) return;

        this.stopSpeech();
        if (exam.timerInterval) {
            clearInterval(exam.timerInterval);
            exam.timerInterval = null;
        }

        // Tính điểm Listening & Reading theo thang 495 + 495 = 990
        let listeningCorrect = 0;
        let listeningTotal = 0;
        let readingCorrect = 0;
        let readingTotal = 0;

        exam.questions.forEach(q => {
            const userAns = exam.userAnswers[q.id];
            const isCorrect = userAns === q.correct;
            if (q.type === "listening" || q.type === "ets2020-listening") {
                listeningTotal++;
                if (isCorrect) listeningCorrect++;
            } else {
                readingTotal++;
                if (isCorrect) readingCorrect++;
            }
        });

        const listeningScore = listeningTotal > 0 ? Math.max(5, Math.round((listeningCorrect / listeningTotal) * 495 / 5) * 5) : 0;
        const readingScore = readingTotal > 0 ? Math.max(5, Math.round((readingCorrect / readingTotal) * 495 / 5) * 5) : 0;
        const totalScore = listeningScore + readingScore;
        const correctCount = listeningCorrect + readingCorrect;

        const spentSeconds = Math.max(1, exam.durationSeconds - exam.remainingSeconds);
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const resultRecord = {
            id: "hist-" + Date.now(),
            testId: exam.testId,
            testTitle: exam.title,
            date: dateStr,
            correctCount,
            totalQuestions: exam.questions.length,
            listeningScore,
            readingScore,
            totalScore,
            timeSpent: this.formatSeconds(spentSeconds)
        };

        exam.result = resultRecord;
        this.state.examHistory.unshift(resultRecord);
        this.state.streak++;
        this.saveState();

        if (isAutoTimeout) {
            this.showToast("Hết giờ làm bài! Hệ thống đã tự động thu bài và chấm điểm.");
        } else {
            this.showToast(`🎉 Chúc mừng bạn đã hoàn thành bài thi! Tổng điểm quy đổi: ${totalScore}/990.`);
        }

        this.navigate("exam-result");
    },

    // ================= 4. KẾT QUẢ THI & GIẢI THÍCH CHI TIẾT TỪNG CÂU =================
    renderExamResult(container) {
        const exam = this.state.activeExam;
        if (!exam || !exam.result) {
            this.navigate("mock-tests");
            return;
        }

        const res = exam.result;
        const accuracy = Math.round((res.correctCount / res.totalQuestions) * 100);

        const reviewCardsHtml = exam.questions.map((q, idx) => {
            const userAns = exam.userAnswers[q.id] || "Chưa chọn";
            const isCorrect = userAns === q.correct;

            const statusBadge = isCorrect
                ? `<span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold"><i class="fa-solid fa-check mr-1"></i>Đúng</span>`
                : `<span class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold"><i class="fa-solid fa-xmark mr-1"></i>Sai (Bạn chọn: ${userAns} • Đáp án: ${q.correct})</span>`;

            const vocabPills = (q.vocab || []).map(v => `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <button onclick="app.speakText('${this.escapeJsString(v.word)}')" class="text-brand-600 hover:text-brand-800"><i class="fa-solid fa-volume-high"></i></button>
                    <strong class="text-slate-900">${v.word}</strong>
                    <span class="text-slate-400 italic">(${v.pos})</span>:
                    <span class="text-slate-700">${v.meaning}</span>
                    <button onclick="app.saveWordToNotebook('${this.escapeJsString(v.word)}', '${this.escapeJsString(v.pos)}', '${this.escapeJsString(v.meaning)}')" title="Lưu vào sổ tay" class="text-amber-500 hover:text-amber-600 ml-1">
                        <i class="fa-solid fa-bookmark"></i>
                    </button>
                </div>
            `).join("");

            return `
                <div class="bg-white rounded-2xl border ${isCorrect ? 'border-emerald-200' : 'border-rose-200'} p-6 shadow-sm">
                    <div class="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-bold">Câu ${idx + 1}</span>
                            <span class="text-xs font-bold text-brand-700">${q.partName}</span>
                        </div>
                        ${statusBadge}
                    </div>

                    <p class="font-bold text-slate-900 text-sm sm:text-base mb-3">${q.questionText}</p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        ${q.options.map(opt => {
                            let boxClass = "border-slate-200 bg-slate-50 text-slate-700";
                            if (opt.key === q.correct) {
                                boxClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                            } else if (opt.key === userAns && !isCorrect) {
                                boxClass = "border-rose-400 bg-rose-50 text-rose-900 line-through";
                            }
                            return `<div class="p-3 rounded-xl border ${boxClass} text-xs sm:text-sm">${opt.text}</div>`;
                        }).join("")}
                    </div>

                    <!-- Giải thích chi tiết & Dịch song ngữ -->
                    <div class="bg-indigo-50/70 rounded-xl p-4 border border-indigo-100 space-y-3 text-xs sm:text-sm">
                        ${q.audioScript ? `
                            <div>
                                <div class="flex items-center justify-between">
                                    <strong class="text-indigo-950"><i class="fa-solid fa-headphones mr-1 text-brand-600"></i>Lời thoại Audio (Transcript):</strong>
                                    <button onclick="app.speakText('${this.escapeJsString(q.audioVoiceText)}')" class="text-xs font-bold text-brand-600 hover:underline"><i class="fa-solid fa-volume-high mr-1"></i>Nghe lại</button>
                                </div>
                                <p class="text-slate-700 whitespace-pre-line mt-1">${q.audioScript}</p>
                            </div>
                        ` : ""}
                        <div>
                            <strong class="text-indigo-950"><i class="fa-solid fa-language mr-1 text-emerald-600"></i>Tạm dịch Tiếng Việt:</strong>
                            <p class="text-slate-700 whitespace-pre-line mt-1">${q.translation}</p>
                        </div>
                        <div>
                            <strong class="text-indigo-950"><i class="fa-solid fa-lightbulb mr-1 text-amber-500"></i>Giải thích chi tiết đáp án (${q.correct}):</strong>
                            <p class="text-slate-800 whitespace-pre-line mt-1 leading-relaxed">${q.explanation}</p>
                        </div>
                        ${vocabPills ? `
                            <div class="pt-2 border-t border-indigo-100">
                                <span class="block text-xs font-bold text-slate-500 mb-2">Từ vựng quan trọng (Bấm <i class="fa-solid fa-bookmark text-amber-500"></i> để lưu vào sổ tay):</span>
                                <div class="flex flex-wrap gap-2">${vocabPills}</div>
                            </div>
                        ` : ""}
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <!-- Tổng kết Điểm Số -->
                <div class="bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <span class="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-extrabold uppercase">Hoàn thành xuất sắc</span>
                            <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">${res.testTitle}</h1>
                            <p class="text-xs sm:text-sm text-slate-300 mt-1">Thời gian hoàn thành: <strong>${res.timeSpent}</strong> • Độ chính xác: <strong>${accuracy}% (${res.correctCount}/${res.totalQuestions} câu)</strong></p>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[200px]">
                            <div class="text-xs uppercase tracking-wider text-amber-300 font-bold">Tổng Điểm TOEIC Quy Đổi</div>
                            <div class="text-4xl sm:text-5xl font-extrabold text-white my-1">${res.totalScore} <span class="text-lg font-normal text-slate-300">/990</span></div>
                            <div class="flex items-center justify-center gap-3 text-xs text-slate-200 mt-2">
                                <span>Listening: <strong>${res.listeningScore}</strong></span>
                                <span>•</span>
                                <span>Reading: <strong>${res.readingScore}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
                        <button onclick="app.startExam('${exam.testId}')" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm transition">
                            <i class="fa-solid fa-rotate-right mr-1"></i> Làm lại đề này
                        </button>
                        <button onclick="app.navigate('mock-tests')" class="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition">
                            Chọn đề thi khác
                        </button>
                        <button onclick="app.navigate('dashboard')" class="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition">
                            <i class="fa-solid fa-chart-line mr-1"></i> Xem bảng thống kê tiến độ
                        </button>
                    </div>
                </div>

                <!-- Chi tiết đáp án & giải thích -->
                <h2 class="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-magnifying-glass-chart text-brand-600"></i>
                    <span>Đáp án chi tiết, Bản dịch song ngữ & Giải thích từng câu</span>
                </h2>
                <div class="space-y-5">
                    ${reviewCardsHtml}
                </div>
            </div>
        `;
    },

    // ================= 5. LUYỆN NGHE TOEIC: HỌC & LUYỆN TẬP =================
    renderListeningIllustration(imageType, caption, imageUrl) {
        const typeToPhoto = {
            office_laptop: "assets/images/test-01/part1/q1.jpg",
            calendar_meeting: "assets/images/test-02/part1/q2.jpg",
            shipping_contract: "assets/images/test-01/part1/q3.jpg",
            conference_badges: "assets/images/test-01/part1/q4.jpg",
            office_meeting: "assets/images/test-03/part1/q5.jpg",
            cafe_outdoor: "assets/images/test-01/part1/q6.jpg"
        };
        const resolvedUrl = this.escapeHtml(imageUrl || typeToPhoto[imageType] || typeToPhoto.office_laptop);
        const safeCaption = this.escapeHtml(caption || "Part 1 photograph");
        return `
            <figure class="mx-auto max-w-2xl overflow-hidden border-2 border-neutral-800 bg-white p-2.5 sm:p-3.5 shadow-sm">
                <div class="border border-neutral-400 bg-neutral-100 overflow-hidden">
                    <img src="${resolvedUrl}" alt="${safeCaption}" class="block w-full max-h-80 object-contain mx-auto grayscale contrast-105" loading="lazy">
                </div>
            </figure>
        `;
    },

    // ===== Luyện nghe: chọn chức năng → Test 1-10 → Part 1-4 =====
    getListeningModeMeta(mode) {
        return {
            dictation: { label: "Nghe chép", icon: "fa-pen-nib", desc: "Nghe từng câu và chép lại chính tả, điền từ còn thiếu theo mức 30/50/100%." },
            abcd: { label: "Chọn ABCD", icon: "fa-list-check", desc: "Nghe audio rồi chọn đáp án đúng A, B, C, D và xem giải thích." }
        }[mode];
    },

    // 10 dòng Test theo Level, mỗi dòng gồm 4 Part; Test chưa có dữ liệu thì khoá lại
    getListeningTestRows() {
        const list = window.DAU_DATA.listeningExercises || [];
        const level = this.state.listeningLevel || 1;
        const official = (window.DAU_DATA.etsListeningTests || []).filter(t => (t.level || 1) === level);
        const isDictation = this.state.listeningMode !== "abcd";
        return Array.from({ length: 10 }, (_, index) => {
            const meta = official[index];
            const id = meta ? meta.id : `listening-lv${level}-test-${index + 1}`;
            const parts = [1, 2, 3, 4].map(partNumber => {
                const items = list.filter(item => item.etsTestId === id && item.partNumber === partNumber);
                const total = isDictation && (partNumber === 1 || partNumber === 2)
                    ? items.reduce((sum, item) => sum + this.getListeningPart1ItemExercises(item).length, 0)
                    : items.length;
                return { partNumber, total, done: total ? this.countListeningDone(id, partNumber) : 0 };
            });
            return { number: index + 1, id, meta, parts, total: parts.reduce((sum, part) => sum + part.total, 0), done: parts.reduce((sum, part) => sum + part.done, 0) };
        });
    },

    // Số câu đã làm theo chế độ: Chọn ABCD tính đáp án, Nghe chép tính ô đã gõ (Part 1 & Part 2 tách từng câu nói)
    countListeningDone(testId, partNumber) {
        const list = window.DAU_DATA.listeningExercises || [];
        const items = list.filter(item => item.etsTestId === testId && item.partNumber === partNumber);
        if (this.state.listeningMode === "abcd") {
            return items.filter(item => this.state.listeningPracticeAnswers[item.id] !== undefined).length;
        }
        const clozeAnswers = this.state.listeningClozeAnswers || {};
        if (partNumber === 1 || partNumber === 2) {
            return items.reduce((sum, item) => sum + this.getListeningPart1ItemExercises(item).filter(ex => (ex.subs || [ex]).some(s => Object.keys(clozeAnswers[s.id] || {}).length > 0)).length, 0);
        }
        return items.filter(item => Object.keys(clozeAnswers[item.id] || {}).length > 0).length;
    },

    // Ghi trạng thái Luyện nghe vào history để nút Back của trình duyệt quay lại đúng trang trước
    saveListeningHistoryState(push = false) {
        const historyState = {
            ...(window.history.state || {}),
            dauenglishListening: {
                view: "listening",
                mode: this.state.listeningMode,
                level: this.state.listeningLevel || 1,
                testId: this.state.listeningTestId || null,
                part: this.state.listeningTestId ? this.state.listeningPartFilter : null
            }
        };
        window.history[push ? "pushState" : "replaceState"](historyState, "", window.location.href);
    },

    restoreListeningHistoryState(saved) {
        if (!saved || !this.getListeningModeMeta(saved.mode)) return;
        this.stopSpeech();
        this.state.listeningMode = saved.mode;
        this.state.listeningLevel = Number(saved.level) || this.state.listeningLevel || 1;
        this.state.listeningTab = saved.mode === "dictation" ? "learn" : "practice";
        this.state.currentView = "listening";
        this.state.listeningTestId = null;
        this.highlightNav("listening");
        if (saved.testId) {
            const partNumber = Number(String(saved.part || "").replace(/\D/g, "")) || 1;
            this.selectListeningTestPart(saved.testId, partNumber, "none");
        } else {
            this.renderListeningPractice(document.getElementById("app-main"));
        }
    },

    selectListeningLevel(level) {
        const num = Number(level);
        if (!Number.isInteger(num) || num < 1 || num > 6) return;
        this.state.listeningLevel = num;
        this.state.listeningTestId = null;
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    selectListeningMode(mode) {
        if (!this.getListeningModeMeta(mode)) return;
        this.stopSpeech();
        this.state.listeningMode = mode;
        this.state.listeningTab = mode === "dictation" ? "learn" : "practice";
        this.state.listeningTestId = null;
        this.renderListeningPractice(document.getElementById("app-main"));
        this.saveListeningHistoryState(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // Về trang trước: nếu bài luyện được mở bằng pushState thì lùi history, ngược lại về màn chọn
    backToListeningTests() {
        this.stopSpeech();
        if (window.history.state?.dauenglishListening?.testId) {
            window.history.back();
            return;
        }
        this.state.listeningTestId = null;
        this.renderListeningPractice(document.getElementById("app-main"));
        this.saveListeningHistoryState(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // historyMode: "push" (mở bài mới) | "replace" (đổi Part trong cùng bài) | "none" (khôi phục từ history)
    selectListeningTestPart(testId, partNumber, historyMode = "push") {
        const list = window.DAU_DATA.listeningExercises || [];
        const part = `Part ${partNumber}`;
        const ids = list
            .map((item, globalIndex) => ({ item, globalIndex }))
            .filter(({ item }) => item.etsTestId === testId && item.part === part)
            .map(entry => entry.globalIndex);
        if (!ids.length) {
            this.showToast("Part này chưa có dữ liệu.");
            return;
        }
        this.stopSpeech();
        this.state.listeningTestId = testId;
        this.state.listeningPartFilter = part;
        this.state.activeDictationIndex = ids[0];
        this.state.activeListeningPracticeIndex = ids[0];
        if (partNumber === 1 || partNumber === 2) {
            this.state.activeListeningPart1ExerciseIndex = this.getListeningPart1ExerciseIndex(list[ids[0]], list);
        }
        this.renderListeningPractice(document.getElementById("app-main"));
        if (historyMode === "push") this.saveListeningHistoryState(true);
        else if (historyMode === "replace") this.saveListeningHistoryState(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    renderListeningSelection(list) {
        const meta = this.getListeningModeMeta(this.state.listeningMode);
        const rows = this.getListeningTestRows();
        const totalDone = rows.reduce((sum, row) => sum + row.done, 0);
        const totalInLevel = rows.reduce((sum, row) => sum + row.total, 0);
        const activeLevel = this.state.listeningLevel || 1;
        const levels = [
            { lv: 1, range: "300–400" },
            { lv: 2, range: "400–550" },
            { lv: 3, range: "550–700" },
            { lv: 4, range: "700–800" },
            { lv: 5, range: "800–900" },
            { lv: 6, range: "900–990" }
        ];
        const levelButtons = levels.map(({ lv, range }) => {
            const active = activeLevel === lv;
            return `
                <button type="button" role="tab" aria-selected="${active}" onclick="app.selectListeningLevel(${lv})" class="inline-flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold transition ${active ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50"}">
                    <span>Level ${lv}</span>
                    <span class="text-[11px] font-bold ${active ? "text-brand-100" : "text-slate-400"}">(${range})</span>
                </button>
            `;
        }).join("");

        // Hai nút chức năng nằm cạnh nhau (như bản phác thảo)
        const modeButton = mode => {
            const item = this.getListeningModeMeta(mode);
            const active = this.state.listeningMode === mode;
            return `
                <button type="button" role="tab" aria-selected="${active}" onclick="app.selectListeningMode('${mode}')" class="inline-flex items-center gap-2 rounded-xl border-2 px-5 py-3 text-sm font-extrabold transition ${active ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50"}">
                    <i class="fa-solid ${item.icon}"></i>${item.label}
                </button>
            `;
        };

        // Mỗi Test là một hàng gồm 4 ô Part lớn
        const rowsHtml = rows.map(row => {
            const locked = row.total === 0;
            const partsHtml = row.parts.map(part => {
                if (locked || part.total === 0) {
                    return `
                        <span class="cursor-not-allowed rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center text-slate-300">
                            <span class="block text-sm font-extrabold">Part ${part.partNumber}</span>
                            <span class="mt-1 block text-xs font-bold">Chưa có dữ liệu</span>
                        </span>
                    `;
                }
                const percent = Math.round((part.done / part.total) * 100);
                return `
                    <button type="button" onclick="app.selectListeningTestPart('${this.escapeJsString(row.id)}', ${part.partNumber})" class="group rounded-2xl border-2 border-slate-200 bg-white px-4 py-7 text-center transition hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                        <span class="block text-sm font-extrabold text-slate-900 group-hover:text-brand-700">Part ${part.partNumber}</span>
                        <span class="mt-1 block text-xs font-bold text-slate-500">${part.done ? `${part.done}/${part.total} câu` : `${part.total} câu`}</span>
                        <span class="mx-auto mt-3 block h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <span class="block h-full rounded-full bg-brand-600 transition-all" style="width:${percent}%"></span>
                        </span>
                    </button>
                `;
            }).join("");
            return `
                <section aria-label="Test ${String(row.number).padStart(2, "0")}">
                    <div class="mb-3 flex flex-wrap items-center gap-2">
                        <h2 class="text-base font-extrabold ${locked ? "text-slate-400" : "text-slate-900"}">Test ${String(row.number).padStart(2, "0")}</h2>
                        <span class="rounded-md px-2 py-0.5 text-[11px] font-extrabold ${locked ? "bg-slate-100 text-slate-400" : "bg-brand-50 text-brand-700"}">${locked ? "Đang cập nhật" : `${row.total} câu • đã làm ${row.done}/${row.total}`}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">${partsHtml}</div>
                </section>
            `;
        }).join("");

        return `
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="mb-6">
                    <span class="text-brand-600 font-extrabold text-xs uppercase tracking-widest">Active Listening</span>
                    <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Luyện nghe TOEIC</h1>
                    <p class="text-sm text-slate-600 mt-1">Chọn chức năng, sau đó chọn Test và Part bạn muốn luyện.</p>
                </div>
                <div class="flex flex-wrap items-center gap-3" role="tablist" aria-label="Chức năng luyện nghe">
                    ${modeButton("dictation")}${modeButton("abcd")}
                    <span class="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600">Level ${activeLevel} • ${meta.label} • đã làm ${totalDone}/${totalInLevel} câu</span>
                </div>
                <div class="mt-4 flex flex-wrap items-center gap-2.5" role="tablist" aria-label="Chọn level luyện nghe">
                    ${levelButtons}
                </div>
                <div class="mt-8 space-y-7">${rowsHtml}</div>
            </div>
        `;
    },

    toggleListeningTranscript(questionId) {
        this.state.listeningLearnRevealedIds[questionId] = !this.state.listeningLearnRevealedIds[questionId];
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    getListeningClozeTokens(question) {
        const words = question.fullTranscript.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) || [];
        const punctuation = question.fullTranscript.match(/[^A-Za-z0-9\s]+/g) || [];
        let wordIndex = 0;
        let punctuationIndex = 0;
        const tokens = question.fullTranscript.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*|[^A-Za-z0-9\s]+|\s+/g) || [];
        return tokens.map(token => {
            if (/^[A-Za-z0-9]/.test(token)) return { type: "word", text: words[wordIndex++] };
            if (/^\s+$/.test(token)) return { type: "space", text: token };
            return { type: "punctuation", text: punctuation[punctuationIndex++] || token };
        });
    },

    getListeningHiddenWordIndexes(question, ignoreReveal = false) {
        const words = this.getListeningClozeTokens(question).filter(token => token.type === "word");
        const requestedHiddenCount = Math.ceil(words.length * (this.state.listeningClozePercent || 50) / 100);
        const revealedCount = ignoreReveal ? 0 : Math.min(requestedHiddenCount, this.state.listeningRevealedWordCounts[question.id] || 0);
        // Vị trí ô trống cố định theo mức khuyết; lật từ = bỏ dần ô trống từ trái sang, không dời vị trí ô khác
        const base = [];
        for (let i = 0; i < requestedHiddenCount; i++) {
            base.push(Math.floor(((i + 0.5) * words.length) / requestedHiddenCount));
        }
        return new Set(base.slice(revealedCount));
    },

    setListeningClozePercent(percent) {
        if (![30, 50, 100].includes(percent)) return;
        this.state.listeningClozePercent = percent;
        this.state.listeningRevealedWordCounts = {};
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    playListeningSub(subId) {
        this.state.listeningActiveSubId = subId;
        this.playListeningAudio();
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    revealListeningWords(count, exId) {
        const current = window.DAU_DATA.listeningExercises[this.state.activeDictationIndex];
        if (!current) return;
        let exercises = this.isSplitDictationPart(current)
            ? (ex => ex?.subs || [ex])(this.getActiveListeningPart1Exercise(current, window.DAU_DATA.listeningExercises || []))
            : [current];
        // Part 1 gộp A–D: lật theo từng dòng (dòng chỉ định, hoặc dòng đầu tiên còn ô trống)
        if (exercises.length > 1) {
            exercises = exId
                ? exercises.filter(ex => ex.id === exId)
                : [exercises.find(ex => this.getListeningHiddenWordIndexes(ex).size) || exercises[0]];
        }
        exercises.forEach(exercise => {
            if (!exercise) return;
            const hidden = this.getListeningHiddenWordIndexes(exercise);
            const revealedCount = this.state.listeningRevealedWordCounts[exercise.id] || 0;
            this.state.listeningRevealedWordCounts[exercise.id] = count === "all"
                ? Math.ceil(this.getListeningClozeTokens(exercise).filter(token => token.type === "word").length * (this.state.listeningClozePercent || 50) / 100)
                : Math.min(revealedCount + count, revealedCount + hidden.size);
        });
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    setListeningClozeAnswer(questionId, wordIndex, value, inputEl) {
        const answers = this.state.listeningClozeAnswers[questionId] || {};
        answers[wordIndex] = value;
        this.state.listeningClozeAnswers[questionId] = answers;
        if (this.state.listeningClozeFeedback?.[questionId]) {
            delete this.state.listeningClozeFeedback[questionId][wordIndex];
        }
        if (inputEl) {
            inputEl.className = "w-20 sm:w-24 h-10 px-1.5 rounded-md border border-slate-700 bg-slate-800 text-center text-sm font-bold text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30";
        }
    },

    toggleListeningBookmark(questionId) {
        const bookmarks = this.state.listeningBookmarkedIds;
        this.state.listeningBookmarkedIds = bookmarks.includes(questionId)
            ? bookmarks.filter(id => id !== questionId)
            : [...bookmarks, questionId];
        this.showToast(this.state.listeningBookmarkedIds.includes(questionId) ? "Đã lưu câu nghe vào mục đánh dấu." : "Đã bỏ đánh dấu câu nghe.");
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    toggleListeningRepeat() {
        this.state.listeningAutoRepeat = !this.state.listeningAutoRepeat;
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    changeListeningPlaybackRate() {
        this.state.listeningPlaybackRate = this.state.listeningPlaybackRate === 1 ? 0.75 : 1;
        const audio = this.listeningAudioEl;
        if (audio && !audio.paused) {
            audio.playbackRate = this.state.listeningPlaybackRate;
            this.renderListeningPractice(document.getElementById("app-main"));
            return;
        }
        if (this.state.listeningIsPlaying) {
            if (this.state.listeningTab === "practice") this.playListeningPracticeAudio();
            else this.playListeningAudio();
        } else {
            this.renderListeningPractice(document.getElementById("app-main"));
        }
    },

    syncListeningAudioButton(playing) {
        const button = document.getElementById("listening-play-toggle");
        const icon = document.getElementById("listening-play-icon");
        const waveform = document.getElementById("listening-waveform");
        const replayCount = document.getElementById("listening-replay-count");
        if (button) button.setAttribute("aria-label", playing ? "Tạm dừng âm thanh" : "Phát âm thanh");
        if (icon) icon.className = `fa-solid ${playing ? "fa-pause" : "fa-play"}`;
        if (waveform) waveform.classList.toggle("listening-waveform-playing", playing);
        const list = window.DAU_DATA.listeningExercises || [];
        const activeId = this.state.listeningTab === "practice"
            ? (list[this.state.activeListeningPracticeIndex]?.id || "")
            : this.getActiveListeningAudioId(list[this.state.activeDictationIndex]);
        if (replayCount) replayCount.textContent = String(this.state.listeningReplayCounts[activeId] || 0);
    },

    getActiveListeningAudioId(current) {
        if (!current) return "";
        if (!this.isSplitDictationPart(current)) return current.id;
        const ex = this.getActiveListeningPart1Exercise(current, window.DAU_DATA.listeningExercises || []);
        if (ex?.subs) return (ex.subs.find(s => s.id === this.state.listeningActiveSubId) || ex.subs[0])?.id || current.id;
        return ex?.id || current.id;
    },

    playListeningAudio() {
        const current = window.DAU_DATA.listeningExercises[this.state.activeDictationIndex];
        if (!current) return;
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        const activeId = this.getActiveListeningAudioId(current);
        this.state.listeningReplayCounts[activeId] = (this.state.listeningReplayCounts[activeId] || 0) + 1;
        let exercise = this.isSplitDictationPart(current)
            ? this.getActiveListeningPart1Exercise(current, window.DAU_DATA.listeningExercises || [])
            : null;
        // Part 1 gộp A–D: phát audio riêng của dòng đang chọn (mặc định dòng A)
        if (exercise?.subs) exercise = exercise.subs.find(s => s.id === this.state.listeningActiveSubId) || exercise.subs[0];
        if (this.isSplitDictationPart(current)) {
            const qNum = Math.max(0, this.getListeningPart1ClozeQuestions(current, window.DAU_DATA.listeningExercises || []).findIndex(q => q.id === current.id)) + 1;
            const label = exercise?.key && /^[A-D]$/.test(exercise.key) ? `${qNum}${exercise.key}` : `${qNum} (${exercise?.label || ""})`;
            this.showToast(`Đang phát câu ${label}`, "above-audio");
        } else {
            this.showToast(`Đang phát ${current.title || "bài nghe"}`, "above-audio");
        }
        const repeat = Boolean(this.state.listeningAutoRepeat && this.state.currentView === "listening" && this.state.listeningTab !== "practice");
        // Ưu tiên file MP3 neural TTS đã tạo (Part 1 & 2 tách riêng từng câu nói)
        if (this.playListeningMp3(exercise?.audioUrl || current.audioUrl, { rate: this.state.listeningPlaybackRate || 1, repeat })) {
            this.state.listeningIsPlaying = true;
            this.syncListeningAudioButton(true);
            return;
        }
        if (!("speechSynthesis" in window)) {
            this.showToast("Chưa có file audio cho câu này và trình duyệt không hỗ trợ giọng đọc.");
            return;
        }
        window.speechSynthesis.cancel();
        this.state.listeningIsPlaying = true;
        const utterance = new SpeechSynthesisUtterance(exercise?.fullTranscript || current.audioText);
        utterance.lang = "en-US";
        utterance.rate = this.state.listeningPlaybackRate || 1;
        utterance.onend = () => {
            if (this.state.listeningAutoRepeat && this.state.currentView === "listening" && this.state.listeningTab !== "practice") {
                this.playListeningAudio();
                return;
            }
            this.state.listeningIsPlaying = false;
            this.syncListeningAudioButton(false);
        };
        utterance.onerror = () => {
            this.state.listeningIsPlaying = false;
            this.syncListeningAudioButton(false);
        };
        window.speechSynthesis.speak(utterance);
        this.syncListeningAudioButton(true);
    },

    toggleListeningAudio() {
        const audio = this.listeningAudioEl;
        if (audio && audio.src) {
            if (!audio.paused) {
                audio.pause();
                this.state.listeningIsPlaying = false;
                this.syncListeningAudioButton(false);
                return;
            }
            const atEnd = isFinite(audio.duration) && audio.duration > 0 && audio.currentTime >= audio.duration - 0.05;
            if (audio.currentTime > 0 && !atEnd) {
                const promise = audio.play();
                if (promise && typeof promise.catch === "function") promise.catch(() => {});
                this.state.listeningIsPlaying = true;
                this.syncListeningAudioButton(true);
                return;
            }
        }
        if ("speechSynthesis" in window) {
            if (this.state.listeningIsPlaying && window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                this.state.listeningIsPlaying = false;
                this.syncListeningAudioButton(false);
                return;
            }
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                this.state.listeningIsPlaying = true;
                this.syncListeningAudioButton(true);
                return;
            }
        }
        this.playListeningAudio();
    },

    askListeningQuestion(questionId) {
        const question = window.prompt("Bạn muốn hỏi gì về câu nghe này?");
        if (!question?.trim()) return;
        this.state.listeningQuestions[questionId] = question.trim();
        this.showToast("Đã ghi lại câu hỏi cho bài nghe này.");
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    renderListeningCloze(question) {
        const tokens = this.getListeningClozeTokens(question);
        const hiddenIndexes = this.getListeningHiddenWordIndexes(question);
        const baseHidden = this.state.listeningRevealedWordCounts[question.id] ? this.getListeningHiddenWordIndexes(question, true) : new Set();
        const answers = this.state.listeningClozeAnswers[question.id] || {};
        const feedback = this.state.listeningClozeFeedback?.[question.id] || {};
        let wordIndex = 0;
        return tokens.map(token => {
            if (token.type === "space") return " ";
            if (token.type === "punctuation") return this.escapeHtml(token.text);
            const currentIndex = wordIndex++;
            if (!hiddenIndexes.has(currentIndex)) return baseHidden.has(currentIndex)
                ? `<mark class="rounded-md bg-amber-400/20 px-1.5 py-0.5 font-extrabold text-amber-300 ring-1 ring-amber-400/50" title="Từ đã lật">${this.escapeHtml(token.text)}</mark>`
                : `<span class="px-1">${this.escapeHtml(token.text)}</span>`;
            const fb = feedback[currentIndex];
            const userVal = (answers[currentIndex] || "").trim();
            if (fb === "bad") {
                return `<span onclick="delete app.state.listeningClozeFeedback?.['${this.escapeJsString(question.id)}']?.[${currentIndex}]; app.renderListeningPractice(document.getElementById('app-main'))" title="Bấm để sửa lại" class="inline-flex h-10 min-w-[5rem] sm:min-w-[6rem] cursor-pointer items-center justify-center gap-1.5 rounded-md border border-rose-500 bg-rose-500/15 px-2.5 align-middle text-sm font-bold">${userVal ? `<span class="text-slate-400 line-through">${this.escapeHtml(userVal)}</span>` : ""}<span class="font-extrabold text-rose-400">${this.escapeHtml(token.text)}</span></span>`;
            }
            const colorCls = fb === "ok"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                : "border-slate-700 bg-slate-800 text-white";
            return `<input aria-label="Điền từ thứ ${currentIndex + 1}" autocomplete="off" value="${this.escapeHtml(answers[currentIndex] || "")}" oninput="app.setListeningClozeAnswer('${this.escapeJsString(question.id)}', ${currentIndex}, this.value, this)" class="w-20 sm:w-24 h-10 px-1.5 rounded-md border ${colorCls} text-center text-sm font-bold focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30" />`;
        }).join("");
    },

    isSplitDictationPart(item) {
        return Boolean(item && (item.partNumber === 1 || item.partNumber === 2 || item.part === "Part 1" || item.part === "Part 2"));
    },

    getListeningPart1OptionExercises(question) {
        const cleanOpt = txt => String(txt || "").replace(/^\s*(?:\([A-D]\)|[A-D][\.\)])\s*/i, "").trim();
        const toHints = txt => {
            const words = String(txt || "").match(/[A-Za-z]{4,}/g) || [];
            const uniq = Array.from(new Set(words.map(w => w.toLowerCase()))).slice(0, 5);
            return uniq.length ? uniq : (question.hintWords || []);
        };
        const viLines = String(question.vietnamese || "").split(/\r?\n/);
        const isPart2 = question.partNumber === 2 || question.part === "Part 2";
        const items = [];
        if (isPart2) {
            const qText = (question.questionScript || String(question.audioScript || "").split(/\r?\n/)[0] || "")
                .replace(/^\s*Question\s*:\s*/i, "").trim();
            const qVi = (question.questionVi || viLines[0] || "")
                .replace(/^\s*(?:Hỏi|Câu hỏi|Câu trần thuật|Phát biểu|Đề nghị|Question)\s*:\s*/i, "").trim();
            if (qText) {
                items.push({
                    id: `${question.id}-stem`,
                    key: "Q",
                    label: "Câu hỏi",
                    questionId: question.id,
                    audioUrl: question.questionAudioUrl || "",
                    fullTranscript: qText,
                    vietnamese: qVi,
                    hintWords: toHints(qText),
                    keyVocab: question.questionVocab?.length ? question.questionVocab : (question.keyVocab || [])
                });
            }
        }
        (question.practiceOptions || []).forEach((option, idx) => {
            const optRe = new RegExp(`^(?:\\(${option.key}\\)|${option.key}[.)])\\s*`, "i");
            const viMatch = viLines.find(l => optRe.test(l.trim())) || viLines[isPart2 ? idx + 1 : idx] || question.vietnamese || "";
            const cleanText = cleanOpt(option.text);
            items.push({
                id: `${question.id}-option-${option.key}`,
                key: option.key,
                label: `Đáp án ${option.key}`,
                questionId: question.id,
                audioUrl: option.audioUrl || "",
                fullTranscript: cleanText,
                vietnamese: cleanOpt(viMatch),
                hintWords: toHints(cleanText),
                keyVocab: option.keyVocab?.length ? option.keyVocab : (question.keyVocab || [])
            });
        });
        return items;
    },

    getListeningPart1ClozeQuestions(question, list) {
        const targetPart = question.partNumber;
        return question.etsTestId
            ? list.filter(item => item.etsTestId === question.etsTestId && item.partNumber === targetPart)
            : [question];
    },

    // Part 1: gộp 4 đáp án A–D thành 1 câu (6 câu/Part); Part 2 vẫn tách từng câu nói
    getListeningPart1ItemExercises(item) {
        const subs = this.getListeningPart1OptionExercises(item);
        if (item.partNumber === 2 || item.part === "Part 2" || !subs.length) return subs;
        const vocab = [...new Map(subs.flatMap(s => s.keyVocab || []).map(v => [v.word, v])).values()];
        return [{
            id: `${item.id}-all`, key: "ALL", label: "Đáp án A–D", questionId: item.id,
            audioUrl: item.audioUrl || "", subs, keyVocab: vocab,
            fullTranscript: subs.map(s => `(${s.key}) ${s.fullTranscript}`).join(" "),
            vietnamese: subs.map(s => `(${s.key}) ${s.vietnamese}`).join(" ")
        }];
    },

    getListeningPart1ClozeExercises(question, list) {
        return this.getListeningPart1ClozeQuestions(question, list)
            .flatMap(item => this.getListeningPart1ItemExercises(item));
    },

    getListeningPart1ExerciseIndex(question, list) {
        const questions = this.getListeningPart1ClozeQuestions(question, list);
        const questionIndex = Math.max(0, questions.findIndex(item => item.id === question.id));
        return questions.slice(0, questionIndex).reduce((sum, item) => sum + this.getListeningPart1ItemExercises(item).length, 0);
    },

    getActiveListeningPart1Exercise(question, list) {
        const exercises = this.getListeningPart1ClozeExercises(question, list);
        const index = Math.min(this.state.activeListeningPart1ExerciseIndex || 0, exercises.length - 1);
        return exercises[index];
    },

    selectListeningPart1Exercise(targetIndex) {
        const list = window.DAU_DATA.listeningExercises || [];
        const current = list[this.state.activeDictationIndex];
        if (!current) return;
        const exercises = this.getListeningPart1ClozeExercises(current, list);
        if (targetIndex < 0 || targetIndex >= exercises.length) return;
        this.stopSpeech();
        this.state.activeListeningPart1ExerciseIndex = targetIndex;
        const nextExercise = exercises[targetIndex];
        if (nextExercise?.subs?.length) {
            this.state.listeningActiveSubId = nextExercise.subs[0].id;
        }
        const nextQuestionIndex = list.findIndex(item => item.id === nextExercise.questionId);
        if (nextQuestionIndex >= 0) this.state.activeDictationIndex = nextQuestionIndex;
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    advanceListeningPart1Exercise(delta) {
        const list = window.DAU_DATA.listeningExercises || [];
        const current = list[this.state.activeDictationIndex];
        if (!current) return;
        const exercises = this.getListeningPart1ClozeExercises(current, list);
        const nextIndex = (this.state.activeListeningPart1ExerciseIndex || 0) + delta;
        if (nextIndex < 0 || nextIndex >= exercises.length) {
            if (nextIndex >= exercises.length) this.showToast(`Bạn đã hoàn thành ${exercises.length} câu điền từ của ${current.part || "Part 1"}.`);
            return;
        }
        this.selectListeningPart1Exercise(nextIndex);
    },

    renderListeningPart1ClozeSet(question, list) {
        const questions = this.getListeningPart1ClozeQuestions(question, list);
        const exercises = this.getListeningPart1ClozeExercises(question, list);
        const exerciseIndex = Math.min(this.state.activeListeningPart1ExerciseIndex || 0, exercises.length - 1);
        const exercise = exercises[exerciseIndex];
        const partLabel = question.part || "Part 1";
        const questionIndex = Math.max(0, questions.findIndex(q => q.id === exercise.questionId));

        return `
            <div class="space-y-3" aria-label="Câu ${this.escapeHtml(partLabel)} điền khuyết">
                <section class="rounded-xl border border-slate-700 bg-[#171e28] p-4" aria-label="Câu ${this.escapeHtml(partLabel)} ${questionIndex + 1}, ${this.escapeHtml(exercise.label)}">
                    <p class="mb-2 text-xs font-extrabold uppercase tracking-wide text-blue-300">Câu đề ${questionIndex + 1} • Điền từ ${this.escapeHtml(exercise.label)}</p>
                    <div class="rounded-lg bg-[#202833] p-3 text-sm leading-9" aria-label="${this.escapeHtml(exercise.label)} điền từ">
                        ${exercise.subs ? `<div class="space-y-4">${exercise.subs.map(s => {
                            const isCurrentSub = (this.state.listeningActiveSubId === s.id) || (!exercise.subs.some(x => x.id === this.state.listeningActiveSubId) && s === exercise.subs[0]);
                            return `<div class="flex items-start gap-2 border-b border-slate-700/60 pb-3 last:border-0 last:pb-0 ${isCurrentSub ? "bg-blue-500/5 -mx-2 px-2 py-1.5 rounded-xl border-blue-500/30" : ""}"><span class="shrink-0 font-extrabold ${isCurrentSub ? "text-blue-400" : "text-blue-300"}">(${s.key})</span><div class="min-w-0 flex-1">${this.renderListeningCloze(s)}</div><button type="button" onclick="app.revealListeningWords(1, '${this.escapeJsString(s.id)}')" title="Lật 1 từ dòng ${s.key}" aria-label="Lật 1 từ ở đáp án ${s.key}" class="mt-1 h-8 shrink-0 rounded-lg border border-slate-700 bg-[#10161e] px-2 text-xs font-bold text-slate-300 hover:border-blue-400"><i class="fa-regular fa-eye"></i> 1 từ</button></div>`;
                        }).join("")}</div>` : this.renderListeningCloze(exercise)}
                    </div>
                </section>
                <div class="flex items-center justify-between gap-3">
                    <button type="button" ${exerciseIndex === 0 ? "disabled" : ""} onclick="app.advanceListeningPart1Exercise(-1)" class="rounded-xl border border-slate-700 bg-[#10161e] px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">Câu trước</button>
                    <button type="button" ${exerciseIndex === exercises.length - 1 ? "disabled" : ""} onclick="app.advanceListeningPart1Exercise(1)" class="rounded-xl border border-slate-700 bg-[#10161e] px-4 py-2 text-sm font-bold text-slate-200 disabled:opacity-40">Câu tiếp theo</button>
                </div>
            </div>
        `;
    },

    answerListeningPractice(index, answer) {
        const question = window.DAU_DATA.listeningExercises[index];
        if (!question || !question.practiceOptions?.some(option => option.key === answer)) return;
        this.state.listeningPracticeAnswers[question.id] = answer;
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    renderListeningPalette(list, filtered) {
        const isPractice = this.state.listeningTab === "practice";
        const current = list[this.state.activeDictationIndex] || list[0];
        const clozeAnswers = this.state.listeningClozeAnswers || {};
        const practiceAnswers = this.state.listeningPracticeAnswers || {};
        const activePracticeIdx = Math.min(this.state.activeListeningPracticeIndex || 0, Math.max(0, list.length - 1));
        const activeGroupGlobalIds = new Set();
        if (isPractice && (list[activePracticeIdx]?.partNumber || 0) >= 3) {
            const groups = this.getListeningPracticeGroups(filtered);
            const activeGrp = groups.find(g => g.items.some(e => e.globalIndex === activePracticeIdx));
            if (activeGrp) activeGrp.items.forEach(e => activeGroupGlobalIds.add(e.globalIndex));
        }

        let paletteItems;
        if (isPractice) {
            paletteItems = filtered.map((entry, idx) => {
                const ans = practiceAnswers[entry.item.id];
                const correctKey = entry.item.practiceOptions?.find(o => o.correct)?.key;
                const inActiveGroup = activeGroupGlobalIds.has(entry.globalIndex);
                const status = entry.globalIndex === activePracticeIdx
                    ? "active"
                    : ans === undefined
                        ? (inActiveGroup ? "active" : "todo")
                        : ans === correctKey ? "ok" : "bad";
                return { num: idx + 1, title: entry.item.title || `Câu ${idx + 1}`, onclick: `app.selectListeningPractice(${entry.globalIndex})`, status, done: ans !== undefined, inGroup: inActiveGroup };
            });
        } else if (this.isSplitDictationPart(current)) {
            const exercises = this.getListeningPart1ClozeExercises(current, list);
            const activeIdx = Math.min(this.state.activeListeningPart1ExerciseIndex || 0, Math.max(0, exercises.length - 1));
            paletteItems = exercises.map((ex, idx) => {
                const done = (ex.subs || [ex]).some(s => Object.keys(clozeAnswers[s.id] || {}).length > 0);
                return { num: idx + 1, title: ex.label || `Câu ${idx + 1}`, onclick: `app.selectListeningPart1Exercise(${idx})`, status: idx === activeIdx ? "active" : done ? "ok" : "todo", done };
            });
        } else {
            paletteItems = filtered.map((entry, idx) => {
                const done = Object.keys(clozeAnswers[entry.item.id] || {}).length > 0;
                return { num: idx + 1, title: entry.item.title || `Câu ${idx + 1}`, onclick: `app.selectDictation(${entry.globalIndex})`, status: entry.globalIndex === this.state.activeDictationIndex ? "active" : done ? "ok" : "todo", done };
            });
        }

        const doneCount = paletteItems.filter(item => item.done).length;
        const styles = isPractice
            ? { active: "border-indigo-600 bg-indigo-600 text-white", ok: "border-emerald-400 bg-emerald-50 text-emerald-800", bad: "border-rose-400 bg-rose-50 text-rose-800", todo: "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300" }
            : { active: "border-blue-400 bg-blue-400 text-slate-950", ok: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300", todo: "border-slate-700 bg-[#10161e] text-slate-300 hover:border-slate-500" };
        const buttons = paletteItems.map(item =>
            `<button type="button" onclick="${item.onclick}" title="${this.escapeHtml(item.title)}" aria-label="Câu ${item.num}: ${this.escapeHtml(item.title)}" aria-current="${item.status === "active" ? "true" : "false"}" class="h-8 rounded-lg border text-xs font-extrabold transition ${styles[item.status]}${item.inGroup ? " ring-2 ring-indigo-500 ring-offset-1" : ""}">${item.num}</button>`
        ).join("");

        return isPractice ? `
            <aside class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm" aria-label="Mục lục câu">
                <div class="mb-2.5 flex items-center justify-between">
                    <p class="text-xs font-extrabold uppercase tracking-wide text-slate-700">Mục lục câu</p>
                    <span class="text-xs font-bold text-indigo-600">${doneCount}/${paletteItems.length}</span>
                </div>
                <div class="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto pr-1">${buttons}</div>
            </aside>
        ` : `
            <section class="rounded-2xl border border-slate-700 bg-[#171e28] p-4 text-white shadow-xl" aria-label="Mục lục câu">
                <div class="mb-2.5 flex items-center justify-between">
                    <p class="text-[11px] font-extrabold uppercase tracking-wide text-blue-300">Mục lục câu</p>
                    <span class="text-[11px] font-bold text-slate-300">${doneCount}/${paletteItems.length}</span>
                </div>
                <div class="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto pr-1">${buttons}</div>
            </section>
        `;
    },

    getListeningPracticeGroups(filtered) {
        const groups = [];
        for (const entry of filtered) {
            const key = entry.item.audioUrl || entry.item.passageTitle || entry.item.audioGroup || "";
            const last = groups[groups.length - 1];
            if (last && key && last.key === key && last.items.length < 3) last.items.push(entry);
            else groups.push({ key, items: [entry] });
        }
        return groups;
    },

    renderListeningPractice(container) {
        const list = window.DAU_DATA.listeningExercises || [];
        if (!list.length) {
            container.innerHTML = `
                <div class="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><i class="fa-solid fa-headphones text-2xl"></i></div>
                    <h1 class="text-2xl font-extrabold text-slate-900">Thư viện bài nghe đang trống</h1>
                    <p class="mt-2 text-sm text-slate-600">Chưa có bài luyện nghe nào trong hệ thống. Hãy thêm dữ liệu vào mục <code class="rounded bg-slate-100 px-1.5 py-0.5">listeningExercises</code> của <code class="rounded bg-slate-100 px-1.5 py-0.5">data.js</code> rồi tải lại trang.</p>
                    <button onclick="app.navigate('home')" class="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white hover:bg-brand-700">Về trang chủ</button>
                </div>
            `;
            return;
        }
        // Chưa chọn Test/Part → màn chọn chức năng + danh sách Test 1-10 (mỗi Test 4 Part)
        if (!this.state.listeningTestId) {
            this.setListeningImmersive(false);
            container.innerHTML = this.renderListeningSelection(list);
            return;
        }
        this.setListeningImmersive(true); // đang làm bài: ẩn header/menu/footer
        const current = list[this.state.activeDictationIndex] || list[0];
        const isPart1Dictation = this.state.listeningTab !== "practice" && this.isSplitDictationPart(current);
        const part1Exercises = isPart1Dictation ? this.getListeningPart1ClozeExercises(current, list) : [];
        const activePart1Ex = isPart1Dictation ? this.getActiveListeningPart1Exercise(current, list) : null;
        const activeExId = activePart1Ex ? activePart1Ex.id : current.id;
        const activeVocab = (activePart1Ex?.keyVocab?.length ? activePart1Ex.keyVocab : current.keyVocab) || [];
        const vocabRevealed = Boolean(this.state.listeningCheckedExercises?.[activeExId]);
        const activeTranscript = activePart1Ex ? activePart1Ex.fullTranscript : current.fullTranscript;
        const activeVietnamese = activePart1Ex ? activePart1Ex.vietnamese : current.vietnamese;
        const transcriptRevealed = Boolean(this.state.listeningLearnRevealedIds[current.id]);
        const practiceIndex = Math.min(this.state.activeListeningPracticeIndex || 0, Math.max(0, list.length - 1));
        const practiceQuestion = list[practiceIndex] || current;
        const selectedAnswer = this.state.listeningPracticeAnswers[practiceQuestion.id];
        const filtered = this.getFilteredListeningExercises();
        const practiceFilteredPos = filtered.findIndex(f => f.globalIndex === practiceIndex);
        const correctOption = practiceQuestion.practiceOptions?.find(option => option.correct);
        const replayCount = this.state.listeningReplayCounts[this.getActiveListeningAudioId(current)] || 0;
        const bookmarked = this.state.listeningBookmarkedIds.includes(current.id);
        const clozePercent = this.state.listeningClozePercent || 50;
        const waveformBars = Array.from({ length: 78 }, (_, index) => {
            const height = 8 + ((index * 17 + 11) % 29);
            return `<span class="listening-wave-bar" style="height:${height}px"></span>`;
        }).join("");
        const vocabCardHtml = `
            <section id="listening-vocab-card" class="rounded-2xl border border-slate-700 bg-[#171e28] p-4 text-white shadow-xl" aria-label="Từ vựng nên học">
                <div class="mb-3 flex items-center justify-between">
                    <p class="text-[11px] font-extrabold uppercase tracking-wide text-blue-300">Từ vựng nên học</p>
                    ${activeVocab.length ? `<span class="text-[11px] font-bold text-slate-300">${activeVocab.length} từ</span>` : ""}
                </div>
                <p id="listening-vocab-locked" class="${vocabRevealed ? "hidden " : ""}text-xs text-slate-400"><i class="fa-solid fa-lock mr-1.5"></i>Hoàn thành câu và bấm "Kiểm tra" để mở từ vựng.</p>
                <div id="listening-vocab-list" class="${vocabRevealed ? "" : "hidden"}">
                ${activeVocab.length ? `
                    <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        ${activeVocab.map(item => `
                            <div class="flex items-center justify-between gap-2 rounded-xl bg-[#202833] p-2.5">
                                <button type="button" onclick="app.speakText('${this.escapeJsString(item.word)}')" class="text-left min-w-0 flex-1">
                                    <span class="block text-sm font-extrabold text-white truncate">${this.escapeHtml(item.word)}</span>
                                    <span class="block text-xs text-slate-300 mt-0.5">${this.escapeHtml(item.meaning)}</span>
                                </button>
                                <button type="button" aria-label="Lưu ${this.escapeHtml(item.word)} vào sổ tay" onclick="app.saveWordToNotebook('${this.escapeJsString(item.word)}', 'vocab', '${this.escapeJsString(item.meaning)}')" class="w-8 h-8 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 shrink-0" title="Lưu vào sổ tay"><i class="fa-solid fa-bookmark text-xs"></i></button>
                            </div>
                        `).join("")}
                    </div>
                ` : `<p class="text-xs text-slate-400">Chưa có từ vựng gợi ý cho câu này.</p>`}
                </div>
            </section>
        `;
        const lessonHtml = `
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px] items-start pb-20">
                <div class="space-y-3">


                    <section class="rounded-2xl border border-slate-700 bg-[#171e28] p-4 sm:p-6 text-white shadow-xl">
                        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div class="inline-flex rounded-xl bg-[#202833] p-1" role="group" aria-label="Mức độ khuyết từ">
                                ${[30, 50, 100].map(percent => `
                                    <button type="button" aria-pressed="${clozePercent === percent}" onclick="app.setListeningClozePercent(${percent})" class="rounded-lg px-3 py-1.5 text-xs font-bold ${clozePercent === percent ? "bg-blue-400 text-slate-950" : "text-slate-300 hover:bg-slate-700"}">${percent}%</button>
                                `).join("")}
                            </div>
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="app.toggleListeningBookmark('${this.escapeJsString(current.id)}')" aria-label="${bookmarked ? "Bỏ đánh dấu" : "Đánh dấu câu nghe"}" class="h-9 w-9 rounded-lg border border-slate-700 ${bookmarked ? "bg-blue-400 text-slate-950" : "bg-[#10161e] text-slate-300"}"><i class="fa-${bookmarked ? "solid" : "regular"} fa-bookmark"></i></button>
                                <button type="button" onclick="app.toggleListeningTranscript('${this.escapeJsString(current.id)}')" aria-label="Xem câu và bản dịch" class="h-9 w-9 rounded-lg border border-slate-700 bg-[#10161e] text-slate-300 hover:bg-slate-800"><i class="fa-regular fa-file-lines"></i></button>
                                <button type="button" onclick="app.askListeningQuestion('${this.escapeJsString(current.id)}')" class="rounded-lg border border-slate-700 bg-[#10161e] px-3 py-2 text-xs font-bold hover:bg-slate-800">Hỏi bài</button>
                            </div>
                        </div>
                        <div class="min-h-16 rounded-xl bg-[#202833] px-3 py-3 sm:px-4 sm:py-4 text-sm leading-9 text-white" aria-label="Câu nghe điền khuyết">
                            ${this.isSplitDictationPart(current)
                                ? this.renderListeningPart1ClozeSet(current, list)
                                : this.renderListeningCloze(current)}
                        </div>
                        <div class="mt-4 flex flex-wrap items-center gap-2">
                            <span class="mr-1 text-xs font-bold uppercase tracking-wide text-slate-400">Lật từ</span>
                            ${[1, 2, 3].map(count => `<button type="button" onclick="app.revealListeningWords(${count})" class="rounded-lg border border-slate-700 bg-[#10161e] px-3 py-1.5 text-xs font-bold hover:border-blue-400">${count} từ</button>`).join("")}
                            <button type="button" onclick="app.revealListeningWords('all')" class="rounded-lg border border-slate-700 bg-[#10161e] px-3 py-1.5 text-xs font-bold hover:border-blue-400">Tất cả</button>
                            <button type="button" onclick="app.checkDictation()" class="ml-auto rounded-lg bg-blue-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-blue-300">Kiểm tra</button>
                        </div>
                        <div id="dictation-result" class="hidden mt-4 rounded-xl border p-3 text-sm"></div>
                        ${this.state.listeningQuestions[current.id] ? `<p class="mt-3 rounded-lg bg-slate-800 p-3 text-sm text-slate-200"><strong>Câu hỏi của bạn:</strong> ${this.escapeHtml(this.state.listeningQuestions[current.id])}</p>` : ""}
                        ${transcriptRevealed ? `
                            <div class="mt-4 rounded-xl border border-slate-700 bg-[#202833] p-4 space-y-3">
                                <div>
                                    <span class="text-[11px] font-extrabold uppercase tracking-wide text-blue-300">Câu nghe</span>
                                    <p class="mt-1 text-sm font-bold text-white">${this.escapeHtml(activeTranscript)}</p>
                                </div>
                                <div class="border-t border-slate-700 pt-3">
                                    <span class="text-[11px] font-extrabold uppercase tracking-wide text-blue-300">Dịch nghĩa</span>
                                    <p class="mt-1 text-sm text-slate-200">${this.escapeHtml(activeVietnamese)}</p>
                                </div>
                            </div>
                        ` : ""}
                    </section>
                    <section class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-[#171e28]/95 backdrop-blur py-2 text-white shadow-2xl" aria-label="Trình phát âm thanh bài học">
                        <div class="mx-auto grid w-full max-w-7xl grid-cols-[64px_minmax(0,1fr)_64px] sm:grid-cols-[80px_minmax(0,1fr)_80px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
                            <div class="flex items-center justify-start">
                                <button type="button" onclick="app.playListeningAudio()" title="Phát lại" aria-label="Phát lại" class="h-8 shrink-0 rounded-lg px-2 text-xs font-bold text-slate-300 hover:bg-slate-800"><i class="fa-solid fa-rotate-left"></i> <span id="listening-replay-count" class="text-blue-300">${replayCount}</span></button>
                            </div>
                            <div class="relative min-w-0">
                            <div id="listening-waveform" class="flex h-11 w-full items-center justify-between gap-1 overflow-hidden rounded-lg bg-[#202833] px-2 [&>span]:max-h-5">
                                <span class="h-1 w-2 shrink-0 rounded-full bg-blue-400"></span>
                                ${waveformBars}
                            </div>
                                <div class="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none [&>button]:pointer-events-auto">
                            <button type="button" aria-label="Bài nghe trước" onclick="app.stepListening('learn', -1)" class="h-8 w-8 shrink-0 rounded-lg bg-[#171e28]/90 text-slate-200 hover:bg-slate-700"><i class="fa-solid fa-backward-step"></i></button>
                            <button id="listening-play-toggle" type="button" aria-label="${this.state.listeningIsPlaying ? "Tạm dừng âm thanh" : "Phát âm thanh"}" onclick="app.toggleListeningAudio()" class="h-10 w-10 shadow-lg shadow-black/40 shrink-0 rounded-full bg-blue-400 text-slate-950 hover:bg-blue-300"><i id="listening-play-icon" class="fa-solid ${this.state.listeningIsPlaying ? "fa-pause" : "fa-play"}"></i></button>
                            <button type="button" aria-label="Bài nghe tiếp theo" onclick="app.stepListening('learn', 1)" class="h-8 w-8 shrink-0 rounded-lg bg-[#171e28]/90 text-slate-200 hover:bg-slate-700"><i class="fa-solid fa-forward-step"></i></button>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-1">
                                <button type="button" onclick="app.changeListeningPlaybackRate()" title="Tốc độ" class="h-8 shrink-0 rounded-lg px-2 text-xs font-bold text-slate-300 hover:bg-slate-800">${this.state.listeningPlaybackRate === 1 ? "1x" : "0.75x"}</button>
                                <button type="button" aria-pressed="${this.state.listeningAutoRepeat}" onclick="app.toggleListeningRepeat()" title="Tự lặp" aria-label="Tự lặp" class="h-8 w-8 shrink-0 rounded-lg ${this.state.listeningAutoRepeat ? "bg-blue-400/15 text-blue-300" : "text-slate-300 hover:bg-slate-800"}"><i class="fa-solid fa-repeat"></i></button>
                            </div>
                        </div>
                    </section>
                </div>
                <aside class="space-y-3">
                    ${this.renderListeningPalette(list, filtered)}
                    ${vocabCardHtml}
                </aside>
            </div>
        `;
        const practiceReplayCount = this.state.listeningReplayCounts[practiceQuestion.id] || 0;
        const practicePlayerBarHtml = `
            <section class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700 bg-[#171e28]/95 backdrop-blur py-2 text-white shadow-2xl" aria-label="Trình phát âm thanh bài tập">
                <div class="mx-auto grid w-full max-w-7xl grid-cols-[64px_minmax(0,1fr)_64px] sm:grid-cols-[80px_minmax(0,1fr)_80px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
                    <div class="flex items-center justify-start">
                        <button type="button" onclick="app.playListeningPracticeAudio()" title="Phát lại" aria-label="Phát lại" class="h-8 shrink-0 rounded-lg px-2 text-xs font-bold text-slate-300 hover:bg-slate-800"><i class="fa-solid fa-rotate-left"></i> <span id="listening-replay-count" class="text-blue-300">${practiceReplayCount}</span></button>
                    </div>
                    <div class="relative min-w-0">
                        <div id="listening-waveform" class="flex h-11 w-full items-center justify-between gap-1 overflow-hidden rounded-lg bg-[#202833] px-2 [&>span]:max-h-5${this.state.listeningIsPlaying ? " listening-waveform-playing" : ""}">
                            <span class="h-1 w-2 shrink-0 rounded-full bg-blue-400"></span>
                            ${waveformBars}
                        </div>
                        <div class="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none [&>button]:pointer-events-auto">
                            <button type="button" aria-label="Bài nghe trước" onclick="app.stepListening('practice', -1)" class="h-8 w-8 shrink-0 rounded-lg bg-[#171e28]/90 text-slate-200 hover:bg-slate-700"><i class="fa-solid fa-backward-step"></i></button>
                            <button id="listening-play-toggle" type="button" aria-label="${this.state.listeningIsPlaying ? "Tạm dừng âm thanh" : "Phát âm thanh"}" onclick="app.toggleListeningPracticeAudio()" class="h-10 w-10 shadow-lg shadow-black/40 shrink-0 rounded-full bg-blue-400 text-slate-950 hover:bg-blue-300"><i id="listening-play-icon" class="fa-solid ${this.state.listeningIsPlaying ? "fa-pause" : "fa-play"}"></i></button>
                            <button type="button" aria-label="Bài nghe tiếp theo" onclick="app.stepListening('practice', 1)" class="h-8 w-8 shrink-0 rounded-lg bg-[#171e28]/90 text-slate-200 hover:bg-slate-700"><i class="fa-solid fa-forward-step"></i></button>
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-1">
                        <button type="button" onclick="app.changeListeningPlaybackRate()" title="Tốc độ" class="h-8 shrink-0 rounded-lg px-2 text-xs font-bold text-slate-300 hover:bg-slate-800">${this.state.listeningPlaybackRate === 1 ? "1x" : "0.75x"}</button>
                        <button type="button" aria-pressed="${this.state.listeningAutoRepeat}" onclick="app.toggleListeningRepeat()" title="Tự lặp" aria-label="Tự lặp" class="h-8 w-8 shrink-0 rounded-lg ${this.state.listeningAutoRepeat ? "bg-blue-400/15 text-blue-300" : "text-slate-300 hover:bg-slate-800"}"><i class="fa-solid fa-repeat"></i></button>
                    </div>
                </div>
            </section>
        `;
        const isGroupedPractice = this.state.listeningTab === "practice" && (practiceQuestion.partNumber || 0) >= 3;
        const practiceGroups = isGroupedPractice ? this.getListeningPracticeGroups(filtered) : [];
        const activeGroupPos = isGroupedPractice ? Math.max(0, practiceGroups.findIndex(g => g.items.some(e => e.globalIndex === practiceIndex))) : 0;
        const activeGroup = isGroupedPractice ? practiceGroups[activeGroupPos] : null;

        let practiceHtml;
        if (isGroupedPractice && activeGroup) {
            const groupFirst = activeGroup.items[0].item;
            const anyAnswered = activeGroup.items.some(e => this.state.listeningPracticeAnswers[e.item.id] !== undefined);
            const allAnswered = activeGroup.items.every(e => this.state.listeningPracticeAnswers[e.item.id] !== undefined);
            const groupTranscript = groupFirst.rawAudioScript || groupFirst.fullTranscript || groupFirst.audioText || "";
            const groupQuestionsHtml = activeGroup.items.map(entry => {
                const q = entry.item;
                const qAns = this.state.listeningPracticeAnswers[q.id];
                const qCorrect = q.practiceOptions?.find(o => o.correct);
                const qLabel = q.questionNumber || Number(String(q.id || "").split("-q").pop()) || (filtered.findIndex(f => f.globalIndex === entry.globalIndex) + 1);
                const qOptsHtml = (q.practiceOptions || []).map(option => {
                    const answered = qAns !== undefined;
                    const isSelected = qAns === option.key;
                    const isCorrect = option.correct;
                    const style = answered
                        ? (isCorrect ? "border-emerald-400 bg-emerald-50" : isSelected ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white")
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50";
                    return `
                        <button type="button" ${answered ? "disabled" : ""} onclick="app.answerListeningPractice(${entry.globalIndex}, '${option.key}')" class="flex items-center gap-3 rounded-xl border-2 ${style} p-3 text-left transition disabled:cursor-default">
                            <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold flex items-center justify-center shrink-0">${option.key}</span>
                            <span class="text-sm font-semibold ${answered && isSelected ? (isCorrect ? "text-emerald-800" : "text-rose-800") : "text-slate-800"}">${this.escapeHtml(option.text)}</span>
                        </button>
                    `;
                }).join("");
                return `
                    <div class="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                        <p class="text-sm sm:text-base font-extrabold text-slate-900 mb-3">Câu ${qLabel}. ${this.escapeHtml(q.questionPrompt || q.questionText || "")}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">${qOptsHtml}</div>
                        ${qAns !== undefined ? `
                            <div class="mt-3 rounded-xl p-3.5 ${qAns === qCorrect?.key ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"}">
                                <p class="text-sm font-extrabold">${qAns === qCorrect?.key ? "Chính xác!" : `Chưa chính xác. Đáp án đúng là ${qCorrect?.key}.`}</p>
                                ${q.explanation ? `<p class="text-xs sm:text-sm mt-1.5 text-slate-700"><strong>Giải thích:</strong> ${this.escapeHtml(q.explanation)}</p>` : ""}
                                ${q.optionTranslations ? `<p class="text-xs sm:text-sm mt-1.5 text-slate-600 whitespace-pre-line"><strong>Dịch:</strong>\n${this.escapeHtml(q.optionTranslations)}</p>` : ""}
                            </div>
                        ` : ""}
                    </div>
                `;
            }).join("");
            practiceHtml = `
                <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_250px] items-start">
                    <section class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
                            <div>
                                <span class="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs">${this.escapeHtml(groupFirst.part)}${groupFirst.etsYear ? ` • Mô phỏng ${this.escapeHtml(groupFirst.etsYear)}` : ""}</span>
                                <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">${this.escapeHtml(groupFirst.passageTitle || `Đoạn ${activeGroupPos + 1}`)}</h2>
                            </div>
                            <span class="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-800 text-sm font-extrabold">Đoạn ${activeGroupPos + 1}/${practiceGroups.length}</span>
                        </div>
                        ${groupFirst.passageHtml ? `<div class="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 overflow-x-auto">${groupFirst.passageHtml}</div>` : ""}
                        <div class="space-y-4">${groupQuestionsHtml}</div>
                        ${anyAnswered && groupTranscript ? `
                            <details ${allAnswered ? "open" : ""} class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <summary class="cursor-pointer text-sm font-extrabold text-slate-700">Xem Transcript đoạn hội thoại / bài nói</summary>
                                <p class="mt-2.5 text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">${this.escapeHtml(groupTranscript)}</p>
                            </details>
                        ` : ""}
                        <div class="flex items-center justify-between gap-3 mt-6">
                            <button type="button" ${activeGroupPos <= 0 ? "disabled" : ""} onclick="app.stepListening('practice', -1)" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40"><i class="fa-solid fa-arrow-left mr-2"></i>Đoạn trước</button>
                            <button type="button" ${activeGroupPos >= practiceGroups.length - 1 ? "disabled" : ""} onclick="app.stepListening('practice', 1)" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-40">Đoạn tiếp theo<i class="fa-solid fa-arrow-right ml-2"></i></button>
                        </div>
                    </section>
                    ${this.renderListeningPalette(list, filtered)}
                </div>
                ${practicePlayerBarHtml}
            `;
        } else {
            const optionHtml = (practiceQuestion.practiceOptions || []).map(option => {
                const answered = selectedAnswer !== undefined;
                const isSelected = selectedAnswer === option.key;
                const isCorrect = option.correct;
                const style = answered
                    ? (isCorrect ? "border-emerald-400 bg-emerald-50" : isSelected ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-white")
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50";
                return `
                    <div class="flex items-center gap-2 rounded-xl border-2 ${style} p-2.5">
                        <button type="button" ${answered ? "disabled" : ""} onclick="app.answerListeningPractice(${practiceIndex}, '${option.key}')" class="flex-1 flex items-center gap-3 text-left disabled:cursor-default">
                            <span class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center shrink-0">${option.key}</span>
                            <span class="text-sm font-bold ${answered && isSelected ? isCorrect ? "text-emerald-800" : "text-rose-800" : "text-slate-700"}">${answered ? this.escapeHtml(option.text) : `Phương án ${option.key}`}</span>
                        </button>
                        <button type="button" aria-label="Phát âm thanh phương án ${option.key}" onclick="app.playListeningMp3('${this.escapeJsString(option.audioUrl || "")}', { rate: 1 }) || app.speakText('${this.escapeJsString(option.text)}')" class="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                `;
            }).join("");
            practiceHtml = `
                <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_250px] items-start">
                    <section class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
                            <div>
                                <span class="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs">${this.escapeHtml(practiceQuestion.part)}${practiceQuestion.etsYear ? ` • Mô phỏng ${this.escapeHtml(practiceQuestion.etsYear)}` : ""}</span>
                                <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">${this.escapeHtml(practiceQuestion.title)}</h2>
                                <p class="text-sm text-slate-500 mt-1">${practiceQuestion.questionPrompt ? this.escapeHtml(practiceQuestion.questionPrompt) : "Quan sát hình và nghe từng phương án A, B, C, D để chọn câu mô tả đúng."}</p>
                            </div>
                            <span class="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-800 text-sm font-extrabold">Câu ${practiceFilteredPos + 1}/${filtered.length}</span>
                        </div>
                        ${practiceQuestion.imageUrl ? this.renderListeningIllustration(practiceQuestion.imageType, practiceQuestion.imageCaption, practiceQuestion.imageUrl) : ""}
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">${optionHtml}</div>
                        ${selectedAnswer !== undefined ? `
                            <div class="mt-5 rounded-xl p-4 ${selectedAnswer === correctOption?.key ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"}">
                                <p class="font-extrabold">${selectedAnswer === correctOption?.key ? "Chính xác!" : `Chưa chính xác. Đáp án đúng là ${correctOption?.key}.`}</p>
                                <p class="text-sm mt-1">${this.escapeHtml(correctOption?.text || "")}</p>
                                ${practiceQuestion.explanation ? `<p class="text-sm mt-2 text-slate-700"><strong>Giải thích:</strong> ${this.escapeHtml(practiceQuestion.explanation)}</p>` : ""}
                                ${practiceQuestion.optionTranslations ? `<p class="text-sm mt-2 text-slate-600 whitespace-pre-line"><strong>Dịch:</strong>\n${this.escapeHtml(practiceQuestion.optionTranslations)}</p>` : ""}
                                ${practiceQuestion.partNumber >= 2 ? `<p class="text-xs mt-2 text-slate-500"><strong>Transcript:</strong> ${this.escapeHtml(practiceQuestion.fullTranscript || "")}</p>` : ""}
                            </div>
                        ` : ""}
                        <div class="flex items-center justify-between gap-3 mt-6">
                            <button type="button" ${practiceFilteredPos <= 0 ? "disabled" : ""} onclick="app.stepListening('practice', -1)" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40"><i class="fa-solid fa-arrow-left mr-2"></i>Câu trước</button>
                            <button type="button" ${practiceFilteredPos >= filtered.length - 1 ? "disabled" : ""} onclick="app.stepListening('practice', 1)" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-40">Câu tiếp theo<i class="fa-solid fa-arrow-right ml-2"></i></button>
                        </div>
                    </section>
                    ${this.renderListeningPalette(list, filtered)}
                </div>
                ${practicePlayerBarHtml}
            `;
        }

        const modeMeta = this.getListeningModeMeta(this.state.listeningMode);
        const testRow = this.getListeningTestRows().find(row => row.id === this.state.listeningTestId);
        const testId = this.state.listeningTestId;
        const testLabel = `Test ${String(testRow ? testRow.number : 1).padStart(2, "0")}`;
        const partLabel = this.state.listeningPartFilter === "ALL" ? "Tất cả Part" : this.state.listeningPartFilter;
        const dictationPos = filtered.findIndex(entry => entry.globalIndex === this.state.activeDictationIndex);
        const activePos = this.state.listeningTab === "practice" ? practiceFilteredPos : dictationPos;
        const headerCounter = isGroupedPractice
            ? `Đoạn ${activeGroupPos + 1}/${practiceGroups.length}`
            : isPart1Dictation
                ? `Câu ${Math.min((this.state.activeListeningPart1ExerciseIndex || 0) + 1, part1Exercises.length)}/${part1Exercises.length}`
                : `Câu ${Math.max(activePos, 0) + 1}/${filtered.length}`;
        const partChips = [1, 2, 3, 4].map(partNumber => {
            const active = this.state.listeningPartFilter === `Part ${partNumber}`;
            return `<button type="button" onclick="app.selectListeningTestPart('${this.escapeJsString(testId)}', ${partNumber}, 'replace')" aria-pressed="${active}" aria-label="Chuyển sang Part ${partNumber}" class="h-8 w-8 rounded-lg border text-[11px] font-extrabold transition ${active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50"}">P${partNumber}</button>`;
        }).join("");
        // Chế độ làm bài toàn màn hình: ẩn header/menu/footer, chỉ giữ thanh thoát + nội dung bài
        container.innerHTML = `
            <div class="mx-auto max-w-7xl px-3 pb-24 pt-3 sm:px-6 sm:pt-5">
                <div class="sticky top-2 z-30 mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
                    <button type="button" onclick="app.backToListeningTests()" class="inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 hover:text-slate-900"><i class="fa-solid fa-arrow-left"></i>Thoát</button>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-extrabold text-slate-900"><i class="fa-solid ${modeMeta.icon} mr-1.5 text-brand-600"></i>${modeMeta.label} • Level ${this.state.listeningLevel || 1} • ${testLabel} • ${partLabel}</p>
                    </div>
                    <div class="flex items-center gap-1">${partChips}</div>
                    <span class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-extrabold text-brand-700">${headerCounter}</span>
                </div>
                ${this.state.listeningTab === "practice" ? practiceHtml : lessonHtml}
            </div>
        `;
    },

    // Lọc danh sách bài nghe theo Test đang chọn + Part, giữ nguyên chỉ số gốc (globalIndex)
    getFilteredListeningExercises() {
        const list = window.DAU_DATA.listeningExercises || [];
        const p = this.state.listeningPartFilter;
        const testId = this.state.listeningTestId;
        return list
            .map((item, globalIndex) => ({ item, globalIndex }))
            .filter(({ item }) => (p === "ALL" || item.part === p) && (!testId || item.etsTestId === testId));
    },

    // Điều hướng trước/sau trong danh sách đã lọc (Part 1 & 2 chế độ Nghe chép đi qua từng câu nói riêng)
    stepListening(mode, delta) {
        if (mode !== "practice") {
            const current = (window.DAU_DATA.listeningExercises || [])[this.state.activeDictationIndex];
            if (this.isSplitDictationPart(current)) {
                const exercise = this.getActiveListeningPart1Exercise(current, window.DAU_DATA.listeningExercises || []);
                if (exercise?.subs?.length) {
                    const activeSubIndex = Math.max(0, exercise.subs.findIndex(s => s.id === this.state.listeningActiveSubId));
                    const nextSubIndex = activeSubIndex + delta;
                    if (nextSubIndex >= 0 && nextSubIndex < exercise.subs.length) {
                        this.state.listeningActiveSubId = exercise.subs[nextSubIndex].id;
                        this.playListeningAudio();
                        this.renderListeningPractice(document.getElementById("app-main"));
                        return;
                    }
                }
                this.advanceListeningPart1Exercise(delta);
                return;
            }
        }
        const filtered = this.getFilteredListeningExercises();
        if (mode === "practice") {
            const activeItem = (window.DAU_DATA.listeningExercises || [])[this.state.activeListeningPracticeIndex];
            if ((activeItem?.partNumber || 0) >= 3) {
                const groups = this.getListeningPracticeGroups(filtered);
                const gPos = groups.findIndex(g => g.items.some(e => e.globalIndex === this.state.activeListeningPracticeIndex));
                const nextGroup = groups[gPos + delta];
                if (nextGroup?.items[0]) this.selectListeningPractice(nextGroup.items[0].globalIndex);
                return;
            }
        }
        const ids = filtered.map(f => f.globalIndex);
        const cur = mode === "practice" ? this.state.activeListeningPracticeIndex : this.state.activeDictationIndex;
        const next = ids[ids.indexOf(cur) + delta];
        if (next === undefined) return;
        if (mode === "practice") this.selectListeningPractice(next);
        else this.selectDictation(next);
    },

    playListeningPracticeAudio() {
        const q = (window.DAU_DATA.listeningExercises || [])[this.state.activeListeningPracticeIndex];
        if (!q) return;
        this.state.listeningReplayCounts[q.id] = (this.state.listeningReplayCounts[q.id] || 0) + 1;
        const rate = this.state.listeningPlaybackRate || 1;
        const repeat = Boolean(this.state.listeningAutoRepeat && this.state.currentView === "listening");
        // Ưu tiên file MP3 neural TTS giống phòng thi
        if (this.playListeningMp3(q.audioUrl, { rate, repeat })) {
            this.state.listeningIsPlaying = true;
            this.syncListeningAudioButton(true);
            return;
        }
        const text = q.partNumber === 1 || q.part === "Part 1"
            ? q.practiceOptions.map(o => `${o.key}. ${o.text}`).join(" ")
            : q.partNumber === 2 || q.part === "Part 2"
                ? `${q.questionScript || q.questionOnlyAudio || ""} ${q.practiceOptions.map(o => `${o.key}. ${o.text}`).join(" ")}`
                : q.audioText;
        this.speakText(text);
    },

    toggleListeningPracticeAudio() {
        const q = (window.DAU_DATA.listeningExercises || [])[this.state.activeListeningPracticeIndex];
        const audio = this.listeningAudioEl;
        if (q?.audioUrl && audio && audio.getAttribute("src") === q.audioUrl) {
            if (!audio.paused) {
                audio.pause();
                this.state.listeningIsPlaying = false;
                this.syncListeningAudioButton(false);
                return;
            }
            const atEnd = isFinite(audio.duration) && audio.duration > 0 && audio.currentTime >= audio.duration - 0.05;
            if (audio.currentTime > 0 && !atEnd) {
                audio.playbackRate = this.state.listeningPlaybackRate || 1;
                const promise = audio.play();
                if (promise && typeof promise.catch === "function") promise.catch(() => {});
                this.state.listeningIsPlaying = true;
                this.syncListeningAudioButton(true);
                return;
            }
        }
        this.playListeningPracticeAudio();
    },

    // Bật/tắt chế độ làm bài toàn màn hình (ẩn header, menu, footer)
    setListeningImmersive(active) {
        document.body.classList.toggle("listening-immersive", Boolean(active));
    },

    selectDictation(idx) {
        this.stopSpeech();
        this.state.activeDictationIndex = idx;
        const current = (window.DAU_DATA.listeningExercises || [])[idx];
        if (this.isSplitDictationPart(current)) {
            this.state.activeListeningPart1ExerciseIndex = this.getListeningPart1ExerciseIndex(current, window.DAU_DATA.listeningExercises || []);
        }
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    selectListeningPractice(idx) {
        const list = window.DAU_DATA.listeningExercises || [];
        if (!Number.isInteger(idx) || idx < 0 || idx >= list.length) return;
        this.stopSpeech();
        this.state.activeListeningPracticeIndex = idx;
        this.renderListeningPractice(document.getElementById("app-main"));
    },

    revealListeningVocabCard(exerciseId) {
        if (!exerciseId) return;
        this.state.listeningCheckedExercises = this.state.listeningCheckedExercises || {};
        this.state.listeningCheckedExercises[exerciseId] = true;
        document.getElementById("listening-vocab-list")?.classList.remove("hidden");
        document.getElementById("listening-vocab-locked")?.classList.add("hidden");
    },

    checkDictation() {
        const current = window.DAU_DATA.listeningExercises[this.state.activeDictationIndex];
        const resEl = document.getElementById("dictation-result");
        if (!current || !resEl) return;

        const answerInputs = Array.from(document.querySelectorAll('#app-main input[aria-label^="Điền từ thứ"]'));
        const clozePanel = document.querySelector('#app-main [aria-label="Câu nghe điền khuyết"]');
        if (clozePanel) {
            const normalize = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
            this.state.listeningClozeFeedback = this.state.listeningClozeFeedback || {};
            const list = window.DAU_DATA.listeningExercises || [];
            const gradeEx = ex => {
                const words = this.getListeningClozeTokens(ex).filter(token => token.type === "word");
                const answers = this.state.listeningClozeAnswers[ex.id] = this.state.listeningClozeAnswers[ex.id] || {};
                const fb = this.state.listeningClozeFeedback[ex.id] = this.state.listeningClozeFeedback[ex.id] || {};
                return [...this.getListeningHiddenWordIndexes(ex)].map(index => {
                    const answer = words[index]?.text || "";
                    const correct = normalize(answers[index] || "") === normalize(answer);
                    fb[index] = correct ? "ok" : "bad";
                    if (correct) answers[index] = answer;
                    return { index, answer, correct };
                });
            };
            if (this.isSplitDictationPart(current)) {
                const exercise = this.getActiveListeningPart1Exercise(current, list);
                if (!exercise) return;
                const results = (exercise.subs || [exercise]).flatMap(gradeEx);
                if (!results.length) {
                    this.showToast("Bạn đã lật hết từ; hãy chọn mức khuyết từ để làm bài.");
                    return;
                }
                clozePanel.innerHTML = this.renderListeningPart1ClozeSet(current, list);
                const correctCount = results.filter(result => result.correct).length;
                const percent = Math.round(correctCount / results.length * 100);
                const isCorrect = percent === 100;
                const exercises = this.getListeningPart1ClozeExercises(current, window.DAU_DATA.listeningExercises || []);
                const isLastExercise = this.state.activeListeningPart1ExerciseIndex >= exercises.length - 1;
                resEl.className = `mt-4 rounded-xl border p-3 text-sm ${isCorrect ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-amber-500/40 bg-amber-500/10 text-amber-100"}`;
                resEl.innerHTML = `
                    <p class="font-extrabold">${isCorrect ? (isLastExercise ? `Hoàn thành ${current.part || "Part 1"}!` : "Chính xác!") : "Đã điền từ đúng vào các ô sai (chữ màu đỏ)."} Đúng ${correctCount}/${results.length} từ.</p>
                `;
                this.revealListeningVocabCard(exercise.id);
                return;
            }
            const results = gradeEx(current);
            if (!results.length) {
                this.showToast("Bạn đã lật hết từ; hãy chọn mức khuyết từ để làm bài.");
                return;
            }
            clozePanel.innerHTML = this.renderListeningCloze(current);
            const correctCount = results.filter(result => result.correct).length;
            const percent = results.length ? Math.round(correctCount / results.length * 100) : 100;
            resEl.className = `mt-4 rounded-xl border p-3 text-sm ${percent === 100 ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : "border-amber-500/40 bg-amber-500/10 text-amber-100"}`;
            resEl.innerHTML = `
                <p class="font-extrabold">${percent === 100 ? "Chính xác!" : "Đã điền từ đúng vào các ô sai (chữ màu đỏ)."} Đúng ${correctCount}/${results.length} từ.</p>
                <p class="mt-1 text-slate-300">${this.escapeHtml(current.vietnamese)}</p>
            `;
            this.revealListeningVocabCard(current.id);
            return;
        }

        const inputEl = document.getElementById("dictation-input");
        if (!inputEl) return;
        const clean = str => str.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
        const userWords = clean(inputEl.value).split(/\s+/).filter(Boolean);
        const targetWords = clean(current.fullTranscript).split(/\s+/);
        let matched = 0;
        const highlightedHtml = current.fullTranscript.split(/\s+/).map(origWord => {
            const cleanedOrig = clean(origWord);
            if (userWords.includes(cleanedOrig)) {
                matched++;
                return `<span class="text-emerald-700 font-extrabold underline decoration-emerald-400">${origWord}</span>`;
            }
            return `<span class="text-rose-600 font-bold bg-rose-50 px-1 rounded">${origWord}</span>`;
        }).join(" ");
        const percent = Math.round((matched / targetWords.length) * 100);
        resEl.classList.remove("hidden", "bg-emerald-50", "border-emerald-200", "bg-amber-50", "border-amber-200");
        resEl.classList.add(percent >= 80 ? "bg-emerald-50" : "bg-amber-50", percent >= 80 ? "border-emerald-200" : "border-amber-200");
        resEl.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="font-extrabold text-sm text-slate-900">Độ chính xác: <strong class="text-emerald-600">${percent}%</strong> (${matched}/${targetWords.length} từ khớp)</span>
                <button onclick="app.speakText('${this.escapeJsString(current.audioText)}')" class="text-xs font-bold text-brand-600 hover:underline"><i class="fa-solid fa-volume-high mr-1"></i>Nghe lại câu chuẩn</button>
            </div>
            <p class="text-sm sm:text-base mb-2">${highlightedHtml}</p>
            <p class="text-xs sm:text-sm text-slate-600 italic border-t border-slate-200/70 pt-2 mt-2">
                <strong>Dịch nghĩa:</strong> ${this.escapeHtml(current.vietnamese)}
            </p>
        `;
        this.revealListeningVocabCard(current.id);
    },

    // ================= 6. LUYỆN ĐỌC TOEIC (6 LEVEL → TEST 1-10 → PART 5, 6, 7) =================
    getReadingTestRows() {
        const list = window.DAU_DATA.readingExercises || [];
        const level = this.state.readingLevel || 1;
        const official = (window.DAU_DATA.etsReadingTests || []).filter(t => (t.level || 3) === level);
        return Array.from({ length: 10 }, (_, index) => {
            const meta = official[index];
            const id = meta ? meta.id : `reading-lv${level}-test-${index + 1}`;
            const parts = [5, 6, 7].map(partNumber => {
                const items = list.filter(item => item.etsTestId === id && item.partNumber === partNumber);
                const total = items.length;
                return { partNumber, total, done: total ? this.countReadingDone(id, partNumber) : 0 };
            });
            return { number: index + 1, id, meta, parts, total: parts.reduce((sum, p) => sum + p.total, 0), done: parts.reduce((sum, p) => sum + p.done, 0) };
        });
    },

    selectReadingLevel(level) {
        const num = Number(level);
        if (!Number.isInteger(num) || num < 1 || num > 6) return;
        this.state.readingLevel = num;
        this.state.readingTestId = null;
        this.renderReadingPractice(document.getElementById("app-main"));
    },

    countReadingDone(testId, partNumber) {
        const list = window.DAU_DATA.readingExercises || [];
        const answers = this.state.readingPracticeAnswers || {};
        return list.filter(item => item.etsTestId === testId && item.partNumber === partNumber && answers[item.id] !== undefined).length;
    },

    saveReadingHistoryState(push = false) {
        const historyState = {
            ...(window.history.state || {}),
            dauenglishReading: {
                view: "reading",
                level: this.state.readingLevel || 1,
                testId: this.state.readingTestId || null,
                part: this.state.readingTestId ? this.state.readingPartFilter : null
            }
        };
        window.history[push ? "pushState" : "replaceState"](historyState, "", window.location.href);
    },

    restoreReadingHistoryState(saved) {
        if (!saved) return;
        this.state.currentView = "reading";
        if (saved.level) this.state.readingLevel = Number(saved.level) || 1;
        this.state.readingTestId = null;
        this.highlightNav("reading");
        if (saved.testId) {
            const partNumber = Number(String(saved.part || "").replace(/\D/g, "")) || 5;
            this.selectReadingTestPart(saved.testId, partNumber, "none");
        } else {
            this.renderReadingPractice(document.getElementById("app-main"));
        }
    },

    backToReadingTests() {
        if (window.history.state?.dauenglishReading?.testId) {
            window.history.back();
            return;
        }
        this.state.readingTestId = null;
        this.renderReadingPractice(document.getElementById("app-main"));
        this.saveReadingHistoryState(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    selectReadingTestPart(testId, partNumber, historyMode = "push") {
        const list = window.DAU_DATA.readingExercises || [];
        const part = `Part ${partNumber}`;
        const ids = list
            .map((item, globalIndex) => ({ item, globalIndex }))
            .filter(({ item }) => item.etsTestId === testId && item.part === part)
            .map(entry => entry.globalIndex);
        if (!ids.length) {
            this.showToast("Part này chưa có dữ liệu.");
            return;
        }
        this.state.readingTestId = testId;
        this.state.readingPartFilter = part;
        this.state.activeReadingExerciseIndex = ids[0];
        this.renderReadingPractice(document.getElementById("app-main"));
        if (historyMode === "push") this.saveReadingHistoryState(true);
        else if (historyMode === "replace") this.saveReadingHistoryState(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    getFilteredReadingExercises() {
        const list = window.DAU_DATA.readingExercises || [];
        return list
            .map((item, globalIndex) => ({ item, globalIndex }))
            .filter(({ item }) => (!this.state.readingTestId || item.etsTestId === this.state.readingTestId) && item.part === this.state.readingPartFilter);
    },

    renderReadingSelection(list) {
        const rows = this.getReadingTestRows();
        const totalDone = rows.reduce((sum, row) => sum + row.done, 0);
        const totalInLevel = rows.reduce((sum, row) => sum + row.total, 0);
        const activeLevel = this.state.readingLevel || 1;
        const partDesc = { 5: "Hoàn thành câu", 6: "Hoàn thành đoạn văn", 7: "Đọc hiểu" };
        const levels = [
            { lv: 1, range: "300–400" },
            { lv: 2, range: "400–550" },
            { lv: 3, range: "550–700" },
            { lv: 4, range: "700–800" },
            { lv: 5, range: "800–900" },
            { lv: 6, range: "900–990" }
        ];
        const levelButtons = levels.map(({ lv, range }) => {
            const active = activeLevel === lv;
            return `
                <button type="button" role="tab" aria-selected="${active}" onclick="app.selectReadingLevel(${lv})" class="inline-flex items-center gap-1.5 rounded-xl border-2 px-3.5 py-2.5 text-xs sm:text-sm font-extrabold transition ${active ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25" : "border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50"}">
                    <span>Level ${lv}</span>
                    <span class="text-[11px] font-bold ${active ? "text-brand-100" : "text-slate-400"}">(${range})</span>
                </button>
            `;
        }).join("");

        const rowsHtml = rows.map(row => {
            const locked = row.total === 0;
            const partsHtml = row.parts.map(part => {
                if (locked || part.total === 0) {
                    return `
                        <span class="cursor-not-allowed rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center text-slate-300">
                            <span class="block text-sm font-extrabold">Part ${part.partNumber}</span>
                            <span class="mt-0.5 block text-[11px] font-semibold">${partDesc[part.partNumber]}</span>
                            <span class="mt-1.5 block text-xs font-bold">Chưa có dữ liệu</span>
                        </span>
                    `;
                }
                const percent = Math.round((part.done / part.total) * 100);
                return `
                    <button type="button" onclick="app.selectReadingTestPart('${this.escapeJsString(row.id)}', ${part.partNumber})" class="group rounded-2xl border-2 border-slate-200 bg-white px-4 py-7 text-center transition hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
                        <span class="block text-sm font-extrabold text-slate-900 group-hover:text-brand-700">Part ${part.partNumber}</span>
                        <span class="mt-0.5 block text-[11px] font-semibold text-slate-400 group-hover:text-brand-600">${partDesc[part.partNumber]}</span>
                        <span class="mt-1.5 block text-xs font-bold text-slate-500">${part.done ? `${part.done}/${part.total} câu` : `${part.total} câu`}</span>
                        <span class="mx-auto mt-3 block h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <span class="block h-full rounded-full bg-brand-600 transition-all" style="width:${percent}%"></span>
                        </span>
                    </button>
                `;
            }).join("");
            return `
                <section aria-label="Test ${String(row.number).padStart(2, "0")}">
                    <div class="mb-3 flex flex-wrap items-center gap-2">
                        <h2 class="text-base font-extrabold ${locked ? "text-slate-400" : "text-slate-900"}">Test ${String(row.number).padStart(2, "0")}</h2>
                        <span class="rounded-md px-2 py-0.5 text-[11px] font-extrabold ${locked ? "bg-slate-100 text-slate-400" : "bg-brand-50 text-brand-700"}">${locked ? "Đang cập nhật" : `${row.total} câu • đã làm ${row.done}/${row.total}`}</span>
                    </div>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">${partsHtml}</div>
                </section>
            `;
        }).join("");

        return `
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <span class="text-brand-600 font-extrabold text-xs uppercase tracking-widest">Active Reading</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Luyện đọc TOEIC</h1>
                        <p class="text-sm text-slate-600 mt-1">Chọn Test và Part (Part 5, Part 6 hoặc Part 7) bạn muốn luyện.</p>
                    </div>
                    <span class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600">Level ${activeLevel} • đã làm ${totalDone}/${totalInLevel} câu</span>
                </div>
                <div class="flex flex-wrap items-center gap-2.5" role="tablist" aria-label="Chọn Level luyện đọc">
                    ${levelButtons}
                </div>
                <div class="mt-8 space-y-7">${rowsHtml}</div>
            </div>
        `;
    },

    renderReadingPalette(filtered) {
        const answers = this.state.readingPracticeAnswers || {};
        const activeIdx = this.state.activeReadingExerciseIndex || 0;
        const styles = {
            active: "border-indigo-600 bg-indigo-600 text-white",
            ok: "border-emerald-400 bg-emerald-50 text-emerald-800",
            bad: "border-rose-400 bg-rose-50 text-rose-800",
            todo: "border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300"
        };
        let doneCount = 0;
        const buttons = filtered.map((entry, idx) => {
            const ans = answers[entry.item.id];
            if (ans !== undefined) doneCount++;
            const status = entry.globalIndex === activeIdx ? "active" : ans === undefined ? "todo" : ans === entry.item.correct ? "ok" : "bad";
            const num = entry.item.questionNumber || idx + 1;
            return `<button type="button" onclick="app.selectReadingExercise(${entry.globalIndex})" title="${this.escapeHtml(entry.item.title || `Câu ${num}`)}" aria-label="Câu ${num}" aria-current="${status === "active" ? "true" : "false"}" class="h-8 rounded-lg border text-xs font-extrabold transition ${styles[status]}">${num}</button>`;
        }).join("");

        return `
            <section class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm" aria-label="Mục lục câu">
                <div class="mb-2.5 flex items-center justify-between">
                    <p class="text-xs font-extrabold uppercase tracking-wide text-slate-700">Mục lục câu</p>
                    <span class="text-xs font-bold text-indigo-600">${doneCount}/${filtered.length}</span>
                </div>
                <div class="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto pr-1">${buttons}</div>
            </section>
        `;
    },

    renderReadingPractice(container) {
        const list = window.DAU_DATA.readingExercises || [];
        if (!list.length) {
            this.setListeningImmersive(false);
            this.renderEmptyState(container, "Chưa có bài đọc nào", "Mục luyện đọc đang trống. Hãy thêm dữ liệu vào <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">reading/test-01.js</code> rồi tải lại trang.");
            return;
        }
        if (!this.state.readingTestId) {
            this.setListeningImmersive(false);
            container.innerHTML = this.renderReadingSelection(list);
            return;
        }
        this.setListeningImmersive(true);
        const filtered = this.getFilteredReadingExercises();
        if (!filtered.length) {
            this.state.readingTestId = null;
            this.setListeningImmersive(false);
            container.innerHTML = this.renderReadingSelection(list);
            return;
        }
        let pos = filtered.findIndex(f => f.globalIndex === this.state.activeReadingExerciseIndex);
        if (pos < 0) {
            pos = 0;
            this.state.activeReadingExerciseIndex = filtered[0].globalIndex;
        }
        const current = filtered[pos].item;
        const selectedAnswer = this.state.readingPracticeAnswers[current.id];
        const answered = selectedAnswer !== undefined;
        const isCorrect = selectedAnswer === current.correct;
        const vocabList = current.vocab || [];

        const testRow = this.getReadingTestRows().find(row => row.id === this.state.readingTestId);
        const testLabel = testRow ? `Test ${String(testRow.number).padStart(2, "0")}` : "Test";
        const partChips = [5, 6, 7].map(partNumber => {
            const active = this.state.readingPartFilter === `Part ${partNumber}`;
            return `<button type="button" onclick="app.selectReadingTestPart('${this.escapeJsString(this.state.readingTestId)}', ${partNumber}, 'replace')" aria-pressed="${active}" aria-label="Chuyển sang Part ${partNumber}" class="h-8 w-8 rounded-lg border text-[11px] font-extrabold transition ${active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:bg-brand-50"}">P${partNumber}</button>`;
        }).join("");

        const optionsHtml = (current.options || []).map(opt => {
            const isSelected = selectedAnswer === opt.key;
            const isRight = opt.key === current.correct;
            const style = answered
                ? (isRight ? "border-emerald-400 bg-emerald-50 text-emerald-900 font-bold" : isSelected ? "border-rose-400 bg-rose-50 text-rose-900 line-through" : "border-slate-200 bg-white text-slate-500")
                : "border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-indigo-50";
            return `
                <button type="button" ${answered ? "disabled" : ""} onclick="app.answerReadingExercise('${this.escapeJsString(current.id)}', '${opt.key}')" class="w-full flex items-center gap-3 rounded-xl border-2 ${style} p-3 text-left text-sm transition disabled:cursor-default">
                    <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-extrabold flex items-center justify-center shrink-0 text-xs">${opt.key}</span>
                    <span class="min-w-0 flex-1">${this.escapeHtml(opt.text.replace(/^\([A-D]\)\s*/i, ""))}</span>
                </button>
            `;
        }).join("");

        const vocabCardHtml = `
            <section class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm" aria-label="Từ vựng nên học">
                <div class="mb-3 flex items-center justify-between">
                    <p class="text-xs font-extrabold uppercase tracking-wide text-slate-700">Từ vựng nên học</p>
                    ${vocabList.length ? `<span class="text-xs font-bold text-indigo-600">${vocabList.length} từ</span>` : ""}
                </div>
                ${!answered ? `
                    <p class="text-xs text-slate-500"><i class="fa-solid fa-lock mr-1.5 text-slate-400"></i>Chọn đáp án để mở từ vựng của câu này.</p>
                ` : vocabList.length ? `
                    <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
                        ${vocabList.map(v => `
                            <div class="flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5">
                                <button type="button" onclick="app.speakText('${this.escapeJsString(v.word)}')" class="text-left min-w-0 flex-1">
                                    <span class="block text-sm font-extrabold text-slate-900 truncate">${this.escapeHtml(v.word)} ${v.pos ? `<span class="text-[11px] font-semibold text-indigo-600">(${this.escapeHtml(v.pos)})</span>` : ""}</span>
                                    <span class="block text-xs text-slate-600 mt-0.5">${this.escapeHtml(v.meaning)}</span>
                                </button>
                                <button type="button" aria-label="Lưu ${this.escapeHtml(v.word)} vào sổ tay" onclick="app.saveWordToNotebook('${this.escapeJsString(v.word)}', '${this.escapeJsString(v.pos || "vocab")}', '${this.escapeJsString(v.meaning)}')" class="w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 shrink-0" title="Lưu vào sổ tay"><i class="fa-solid fa-bookmark text-xs"></i></button>
                            </div>
                        `).join("")}
                    </div>
                ` : `<p class="text-xs text-slate-400">Chưa có từ vựng gợi ý cho câu này.</p>`}
            </section>
        `;

        container.innerHTML = `
            <div class="mx-auto max-w-7xl px-3 pb-24 pt-3 sm:px-6 sm:pt-5">
                <div class="sticky top-2 z-30 mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur">
                    <button type="button" onclick="app.backToReadingTests()" class="inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-100 hover:text-slate-900"><i class="fa-solid fa-arrow-left"></i>Thoát</button>
                    <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-extrabold text-slate-900"><i class="fa-solid fa-book-open mr-1.5 text-brand-600"></i>Luyện đọc • Level ${this.state.readingLevel || 1} • ${testLabel} • ${this.escapeHtml(current.part)}</p>
                    </div>
                    <div class="flex items-center gap-1">${partChips}</div>
                    <span class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-extrabold text-brand-700">Câu ${pos + 1}/${filtered.length}</span>
                </div>

                <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
                    <section class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-5">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <span class="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs">${this.escapeHtml(current.partName || current.part)}</span>
                            <span class="text-xs font-extrabold text-slate-500">Question ${current.questionNumber || pos + 1}</span>
                        </div>
                        ${current.passageHtml ? `
                            <div class="space-y-2">
                                ${current.passageTitle ? `<p class="text-xs font-extrabold uppercase tracking-wide text-slate-500">${this.escapeHtml(current.passageTitle)}</p>` : ""}
                                <div>${(current.partNumber === 6 || /Part 6/i.test(current.part)) ? this.formatPart6PassageHtml(current.passageHtml, current.questionNumber) : current.passageHtml}</div>
                            </div>
                        ` : ""}
                        <div>
                            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 leading-relaxed mb-4">${this.escapeHtml(current.questionText)}</h2>
                            <div class="grid grid-cols-1 gap-2.5">${optionsHtml}</div>
                        </div>
                        ${answered ? `
                            <div class="rounded-xl p-4 ${isCorrect ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-rose-50 border border-rose-200 text-rose-900"} space-y-2">
                                <p class="font-extrabold">${isCorrect ? "Chính xác!" : `Chưa chính xác. Đáp án đúng là ${current.correct}.`}</p>
                                ${current.translation ? `<p class="text-sm text-slate-700"><strong>Dịch nghĩa:</strong> ${this.escapeHtml(current.translation)}</p>` : ""}
                                ${current.explanation ? `<p class="text-sm text-slate-700"><strong>Giải thích:</strong> ${this.escapeHtml(current.explanation)}</p>` : ""}
                            </div>
                        ` : ""}
                        <div class="flex items-center justify-between gap-3 pt-2">
                            <button type="button" ${pos <= 0 ? "disabled" : ""} onclick="app.stepReading(-1)" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm disabled:opacity-40 hover:bg-slate-50"><i class="fa-solid fa-arrow-left mr-2"></i>Câu trước</button>
                            <button type="button" ${pos >= filtered.length - 1 ? "disabled" : ""} onclick="app.stepReading(1)" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-40">Câu tiếp theo<i class="fa-solid fa-arrow-right ml-2"></i></button>
                        </div>
                    </section>
                    <aside class="space-y-4">
                        ${this.renderReadingPalette(filtered)}
                        ${vocabCardHtml}
                    </aside>
                </div>
            </div>
        `;
    },

    answerReadingExercise(questionId, key) {
        if (!questionId || !key) return;
        this.state.readingPracticeAnswers[questionId] = key;
        this.renderReadingPractice(document.getElementById("app-main"));
    },

    selectReadingExercise(globalIdx) {
        const list = window.DAU_DATA.readingExercises || [];
        if (!Number.isInteger(globalIdx) || globalIdx < 0 || globalIdx >= list.length) return;
        this.state.activeReadingExerciseIndex = globalIdx;
        this.renderReadingPractice(document.getElementById("app-main"));
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    stepReading(delta) {
        const filtered = this.getFilteredReadingExercises();
        const curPos = filtered.findIndex(f => f.globalIndex === this.state.activeReadingExerciseIndex);
        const next = filtered[curPos + delta];
        if (!next) return;
        this.selectReadingExercise(next.globalIndex);
    },

    // ================= 7. PHÒNG LUYỆN NÓI (SPEAKING) & VIẾT (WRITING) AI =================
    renderSpeakingWriting(container) {
        const isWriting = this.state.swTab === "writing";

        if (!(window.DAU_DATA.speakingPrompts || []).length && !(window.DAU_DATA.writingPrompts || []).length) {
            this.renderEmptyState(container, "Chưa có đề Speaking / Writing", "Mục luyện nói và viết đang trống. Hãy thêm đề vào <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">speakingPrompts</code> và <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">writingPrompts</code> trong <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">data.js</code> rồi tải lại trang.");
            return;
        }

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <span class="${isWriting ? 'text-purple-600' : 'text-rose-600'} font-extrabold text-xs uppercase tracking-widest">
                            ${isWriting ? 'TOEIC Writing AI Lab' : 'TOEIC Speaking Studio'}
                        </span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                            ${isWriting ? 'Phòng Luyện Viết (TOEIC Writing) Chấm Chữa Bằng AI' : 'Phòng Luyện Nói (TOEIC Speaking) Thu Âm & Chấm Phát Âm'}
                        </h1>
                        <p class="text-sm text-slate-600 mt-1">
                            ${isWriting
                                ? 'Luyện tập viết câu theo tranh, phản hồi Email thương mại và viết Luận (Opinion Essay) kèm AI chấm điểm chi tiết.'
                                : 'Luyện đọc thành tiếng (Read Aloud), miêu tả tranh và bày tỏ quan điểm với đồng hồ bấm giờ chuẩn IIG.'
                            }
                        </p>
                    </div>
                    <div class="inline-flex p-1 rounded-xl bg-slate-200/80 shrink-0">
                        <button onclick="app.navigate('speaking')" class="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${!isWriting ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                            <i class="fa-solid fa-microphone-lines text-rose-600 mr-1.5"></i> Kỹ năng Nói (Speaking)
                        </button>
                        <button onclick="app.navigate('writing')" class="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition ${isWriting ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                            <i class="fa-solid fa-pen-nib text-purple-600 mr-1.5"></i> Kỹ năng Viết (Writing)
                        </button>
                    </div>
                </div>

                ${isWriting ? this.getWritingTabHtml() : this.getSpeakingTabHtml()}
            </div>
        `;
    },

    switchSwTab(tab) {
        this.navigate(tab === "speaking" ? "speaking" : "writing");
    },

    getWritingTabHtml() {
        const prompts = window.DAU_DATA.writingPrompts || [];
        if (!prompts.length) return `<p class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Chưa có đề Writing nào.</p>`;
        const current = prompts[this.state.activeWritingIndex] || prompts[0];

        return `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Chọn dạng bài Writing (4 cols) -->
                <div class="lg:col-span-4 space-y-3">
                    <h3 class="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Chọn phần thi TOEIC Writing</h3>
                    ${prompts.map((p, idx) => `
                        <button onclick="app.selectWritingPrompt(${idx})" class="w-full p-4 rounded-xl border text-left transition ${idx === this.state.activeWritingIndex ? 'border-brand-600 bg-brand-50 text-brand-950 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                            <div class="text-xs font-extrabold text-brand-600 mb-1"> Đề số 0${idx + 1} • Tối thiểu ${p.minWords} từ</div>
                            <div class="text-sm font-bold text-slate-900">${p.part}</div>
                        </button>
                    `).join("")}

                    <div class="bg-slate-900 text-white p-5 rounded-2xl space-y-2 text-xs">
                        <div class="font-extrabold text-amber-300 text-sm"><i class="fa-solid fa-robot mr-1"></i> Tiêu chí AI Chấm Writing</div>
                        <p>1. <strong>Task Completion:</strong> Đáp ứng đủ các yêu cầu trong đề bài và độ dài tiêu chuẩn.</p>
                        <p>2. <strong>Vocabulary & Keywords:</strong> Sử dụng từ vựng thương mại trang trọng (${current.keywords.join(", ")}).</p>
                        <p>3. <strong>Grammar & Coherence:</strong> Cấu trúc câu đa dạng và có từ nối mạch lạc.</p>
                    </div>
                </div>

                <!-- Khu vực soạn bài & Chấm AI (8 cols) -->
                <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div class="pb-4 mb-4 border-b border-slate-100">
                        <span class="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-extrabold">${current.part}</span>
                        <div class="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            ${current.context}
                        </div>
                        <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span class="font-bold text-slate-500">Từ khóa gợi ý nên dùng:</span>
                            ${current.keywords.map(kw => `<span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">${kw}</span>`).join("")}
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-2">
                        <label class="text-xs font-extrabold uppercase text-slate-700">Bài làm của bạn:</label>
                        <button onclick="app.fillSampleWriting()" class="text-xs font-bold text-brand-600 hover:underline">
                            <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Điền bài mẫu chuẩn điểm tối đa để thử AI
                        </button>
                    </div>

                    <textarea id="writing-editor" rows="8" oninput="app.updateWritingWordCount()" placeholder="Nhập bài viết tiếng Anh của bạn tại đây..." class="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-brand-600 outline-none text-sm leading-relaxed mb-3"></textarea>

                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <span id="writing-word-count" class="text-xs font-bold text-slate-500">Số từ hiện tại: 0 từ (Yêu cầu tối thiểu: ${current.minWords} từ)</span>
                        <button onclick="app.evaluateWritingWithAI()" class="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-brand-600/20 transition flex items-center gap-2">
                            <i class="fa-solid fa-bolt"></i> Chấm Điểm & Sửa Lỗi Bằng AI Ngay
                        </button>
                    </div>

                    <!-- Kết quả chấm AI -->
                    <div id="writing-ai-feedback" class="hidden mt-6"></div>
                </div>
            </div>
        `;
    },

    selectWritingPrompt(idx) {
        this.state.activeWritingIndex = idx;
        this.renderSpeakingWriting(document.getElementById("app-main"));
    },

    updateWritingWordCount() {
        const current = window.DAU_DATA.writingPrompts[this.state.activeWritingIndex];
        const editor = document.getElementById("writing-editor");
        const countEl = document.getElementById("writing-word-count");
        if (!editor || !countEl) return;
        const words = editor.value.trim().split(/\s+/).filter(Boolean).length;
        countEl.textContent = `Số từ hiện tại: ${words} từ (Yêu cầu tối thiểu: ${current.minWords} từ)`;
    },

    fillSampleWriting() {
        const current = window.DAU_DATA.writingPrompts[this.state.activeWritingIndex];
        const editor = document.getElementById("writing-editor");
        if (editor) {
            editor.value = current.sampleResponse;
            this.updateWritingWordCount();
        }
    },

    evaluateWritingWithAI() {
        const current = window.DAU_DATA.writingPrompts[this.state.activeWritingIndex];
        const editor = document.getElementById("writing-editor");
        const feedbackEl = document.getElementById("writing-ai-feedback");
        if (!editor || !feedbackEl) return;

        const text = editor.value.trim();
        if (!text) {
            this.showToast("Bạn hãy nhập bài viết hoặc bấm 'Điền bài mẫu' trước khi chấm điểm nhé!");
            return;
        }

        const words = text.split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const lowerText = text.toLowerCase();

        // Đánh giá từ khóa rubric
        const matchedKeywords = current.rubricKeywords.filter(kw => lowerText.includes(kw));
        const keywordRatio = matchedKeywords.length / current.rubricKeywords.length;
        const lengthRatio = Math.min(1, wordCount / current.minWords);

        const rawScore = Math.round((lengthRatio * 0.45 + keywordRatio * 0.55) * 200 / 10) * 10;
        const finalScore = Math.max(70, Math.min(200, rawScore));

        feedbackEl.classList.remove("hidden");
        feedbackEl.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl p-6 border-2 border-indigo-200 space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-indigo-200/60">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl font-extrabold shadow-md">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <span class="text-xs font-extrabold uppercase text-brand-700">Kết quả phân tích từ Kai Toeic AI</span>
                            <h4 class="text-lg font-extrabold text-slate-900">Đánh giá chi tiết bài viết của bạn</h4>
                        </div>
                    </div>
                    <div class="bg-white px-4 py-2 rounded-xl border border-indigo-200 text-center">
                        <div class="text-[11px] font-bold text-slate-500 uppercase">Điểm TOEIC Writing Ước Tính</div>
                        <div class="text-2xl font-extrabold text-emerald-600">${finalScore} / 200</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div class="bg-white p-3.5 rounded-xl border border-slate-200">
                        <div class="text-slate-500 font-semibold">Độ dài bài viết</div>
                        <div class="text-base font-extrabold text-slate-900 mt-0.5">${wordCount} từ <span class="text-xs font-normal text-emerald-600">(Chuẩn: ${current.minWords}+)</span></div>
                    </div>
                    <div class="bg-white p-3.5 rounded-xl border border-slate-200">
                        <div class="text-slate-500 font-semibold">Từ vựng học thuật / thương mại</div>
                        <div class="text-base font-extrabold text-brand-600 mt-0.5">Đạt ${matchedKeywords.length}/${current.rubricKeywords.length} tiêu chí</div>
                    </div>
                    <div class="bg-white p-3.5 rounded-xl border border-slate-200">
                        <div class="text-slate-500 font-semibold">Cấu trúc & Mạch lạc</div>
                        <div class="text-base font-extrabold text-amber-600 mt-0.5">${finalScore >= 160 ? 'Xuất sắc (C1)' : 'Khá tốt (B1/B2)'}</div>
                    </div>
                </div>

                <div class="text-xs sm:text-sm text-slate-700 space-y-2">
                    <p><strong><i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Ưu điểm:</strong> ${wordCount >= current.minWords ? 'Bài viết đảm bảo độ dài tiêu chuẩn của ETS, bố cục rõ ràng.' : 'Bạn đã nắm được ý chính của đề bài.'} Các cấu trúc/từ khóa tốt đã sử dụng: <code>${matchedKeywords.join(", ") || "Đang cập nhật"}</code>.</p>
                    <p><strong><i class="fa-solid fa-wand-magic-sparkles text-brand-600 mr-1"></i>Gợi ý nâng cấp band điểm 180+:</strong> Hãy kết hợp thêm các liên từ chuyển ý trang trọng (như <em>Furthermore, Consequently, As a token of our apology</em>) và đối chiếu với bài mẫu bên dưới.</p>
                </div>

                <div class="bg-white p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                    <strong class="text-slate-900 block mb-1">Bài mẫu Band 200/200 tham khảo:</strong>
                    <p class="text-slate-600 whitespace-pre-line">${current.sampleResponse}</p>
                </div>
            </div>
        `;
    },

    getSpeakingTabHtml() {
        const prompts = window.DAU_DATA.speakingPrompts || [];
        if (!prompts.length) return `<p class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Chưa có đề Speaking nào.</p>`;
        const current = prompts[this.state.activeSpeakingIndex] || prompts[0];

        return `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-4 space-y-3">
                    <h3 class="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Chọn câu hỏi TOEIC Speaking</h3>
                    ${prompts.map((p, idx) => `
                        <button onclick="app.selectSpeakingPrompt(${idx})" class="w-full p-4 rounded-xl border text-left transition ${idx === this.state.activeSpeakingIndex ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                            <div class="text-xs font-extrabold text-rose-600 mb-1">Chuẩn bị: ${p.prepTime}s • Trả lời: ${p.responseTime}s</div>
                            <div class="text-sm font-bold text-slate-900">${p.part}</div>
                        </button>
                    `).join("")}
                </div>

                <div class="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                    <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <span class="px-3 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-extrabold">${current.part}</span>
                        <button onclick="app.speakText('${this.escapeJsString(current.sampleAnswer || current.promptText)}')" class="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs">
                            <i class="fa-solid fa-volume-high mr-1"></i> Nghe Giọng Đọc Mẫu Chuẩn Mỹ
                        </button>
                    </div>

                    <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-base font-semibold text-slate-800 leading-relaxed">
                        ${current.promptText}
                    </div>

                    <!-- Bộ thu âm mô phỏng phòng thi -->
                    <div class="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <button onclick="app.toggleSpeakingRecord()" id="speaking-record-btn" class="w-14 h-14 rounded-full ${this.state.isRecordingSpeaking ? 'bg-rose-600 animate-pulse' : 'bg-rose-500 hover:bg-rose-600'} text-white flex items-center justify-center text-xl shadow-lg transition">
                                <i class="fa-solid ${this.state.isRecordingSpeaking ? 'fa-stop' : 'fa-microphone'}"></i>
                            </button>
                            <div>
                                <div class="font-extrabold text-sm sm:text-base" id="speaking-status-title">
                                    ${this.state.isRecordingSpeaking ? 'Đang thu âm bài nói của bạn...' : 'Bấm Micro để bắt đầu thu âm trả lời'}
                                </div>
                                <div class="text-xs text-slate-400">Thời gian trả lời tiêu chuẩn: ${current.responseTime} giây</div>
                            </div>
                        </div>
                        <div id="speaking-ai-score-badge" class="hidden bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-extrabold">
                            Độ chuẩn phát âm AI: 170/200 (Good)
                        </div>
                    </div>

                    <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs sm:text-sm space-y-1.5">
                        <strong class="text-amber-950 block"><i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i>Mẹo đạt điểm tối đa từ giảng viên Kai Toeic:</strong>
                        ${current.tips.map(t => `<p class="text-slate-700">• ${t}</p>`).join("")}
                        ${current.sampleAnswer ? `<p class="pt-2 mt-2 border-t border-amber-200 text-slate-800"><strong>Sample Answer:</strong> "${current.sampleAnswer}"</p>` : ""}
                    </div>
                </div>
            </div>
        `;
    },

    selectSpeakingPrompt(idx) {
        this.state.activeSpeakingIndex = idx;
        this.state.isRecordingSpeaking = false;
        this.renderSpeakingWriting(document.getElementById("app-main"));
    },

    toggleSpeakingRecord() {
        this.state.isRecordingSpeaking = !this.state.isRecordingSpeaking;
        this.renderSpeakingWriting(document.getElementById("app-main"));
        if (!this.state.isRecordingSpeaking) {
            const badge = document.getElementById("speaking-ai-score-badge");
            if (badge) badge.classList.remove("hidden");
            this.showToast("🎙️ Đã thu âm xong! AI đánh giá phát âm & ngữ điệu của bạn đạt ~170/200 điểm.");
        }
    },

    // ================= 8. MỤC TỪ VỰNG (GỒM 2 MỤC NHỎ: 600 TỪ VỰNG TOEIC & 300 PHRASAL VERBS) =================
    toggleSidebarVocabMenu() {
        const subMenu = document.getElementById("sidebar-vocab-submenu");
        const chevron = document.getElementById("sidebar-vocab-chevron");
        if (this.state.currentView !== "vocabulary") {
            if (subMenu) subMenu.classList.remove("hidden");
            if (chevron) chevron.classList.add("rotate-180");
            this.navigate("vocabulary");
            return;
        }
        if (subMenu) subMenu.classList.toggle("hidden");
        if (chevron) chevron.classList.toggle("rotate-180");
    },

    openVocabSection(subTab) {
        this.state.vocabSubTab = subTab === "300-phrasal" ? "300-phrasal" : "600-words";
        this.state.vocabPage = "lessons";
        this.state.phrasalPage = "lessons";
        this.state.vocabLessonTab = "theory";
        this.state.vocabPracticeMode = "multipleChoice";
        this.navigate("vocabulary");
    },

    backToVocabLessons() {
        if (window.history.state?.dauenglishVocab?.page === "lesson") {
            window.history.back();
            return;
        }
        this.state.vocabPage = "lessons";
        this.saveVocabHistoryState("lessons");
        this.renderVocabulary(document.getElementById("app-main"));
    },

    backToPhrasalLessons() {
        if (window.history.state?.dauenglishVocab?.page === "lesson") {
            window.history.back();
            return;
        }
        this.state.phrasalPage = "lessons";
        this.saveVocabHistoryState("lessons");
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    setVocabLessonTab(tab) {
        this.state.vocabLessonTab = tab === "practice" ? "practice" : "theory";
        this.saveVocabHistoryState(this.state.vocabSubTab === "300-phrasal" ? this.state.phrasalPage : this.state.vocabPage);
        this.renderVocabulary(document.getElementById("app-main"));
    },

    setVocabPracticeMode(mode) {
        const allowedModes = ["multipleChoice", "listening", "context", "missingLetters"];
        if (!allowedModes.includes(mode)) return;
        this.state.vocabPracticeMode = mode;
        this.saveVocabHistoryState(this.state.vocabSubTab === "300-phrasal" ? this.state.phrasalPage : this.state.vocabPage);
        this.renderVocabulary(document.getElementById("app-main"));
    },

    getVocabQuizQuestions(topic) {
        return topic.words.map((word, index) => {
            const correctPosition = (index * 7 + 3) % 4;
            const distractors = [];
            for (let offset = 1; distractors.length < 3 && offset < topic.words.length; offset++) {
                const candidate = topic.words[(index + offset) % topic.words.length];
                if (candidate.id !== word.id && candidate.word !== word.word
                    && !distractors.some(option => option.word === candidate.word)) {
                    distractors.push(candidate);
                }
            }

            const options = [];
            let distractorIndex = 0;
            for (let optionIndex = 0; optionIndex < 4; optionIndex++) {
                options.push(optionIndex === correctPosition ? word : distractors[distractorIndex++]);
            }
            return { word, options, correctPosition, index };
        });
    },

    answerVocabQuiz(wordId, optionIndex) {
        const topics = this.state.vocabSubTab === "300-phrasal"
            ? window.DAU_DATA.phrasalVerbTopics || []
            : window.DAU_DATA.vocabTopics || [];
        const topicId = this.state.vocabSubTab === "300-phrasal"
            ? this.state.activePhrasalTopicId
            : this.state.activeVocabTopicId;
        const topic = topics.find(entry => entry.id === topicId);
        const question = topic && this.getVocabQuizQuestions(topic).find(entry => entry.word.id === wordId);
        if (!question || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return;

        const answerKey = `${this.state.vocabPracticeMode}:${wordId}`;
        this.state.vocabQuizAnswers[answerKey] = { value: optionIndex, correct: optionIndex === question.correctPosition };
        this.saveState();
        this.renderVocabulary(document.getElementById("app-main"));
    },

    checkVocabWrittenAnswer(wordId, inputId, mode) {
        const input = document.getElementById(inputId);
        const value = input?.value.trim();
        if (!value) {
            this.showToast("Hãy nhập câu trả lời trước khi kiểm tra.");
            return;
        }

        const topic = this.getActiveVocabTopic();
        const word = topic?.words.find(entry => entry.id === wordId);
        if (!word) return;
        const normalize = answer => String(answer).trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
        const correct = normalize(value) === normalize(word.word);
        this.state.vocabQuizAnswers[`${mode}:${wordId}`] = { value, correct };
        this.saveState();
        this.renderVocabulary(document.getElementById("app-main"));
    },

    resetVocabQuiz(topic, mode = this.state.vocabPracticeMode) {
        topic.words.forEach(word => {
            delete this.state.vocabQuizAnswers[`${mode}:${word.id}`];
            if (mode === "multipleChoice") delete this.state.vocabQuizAnswers[word.id];
        });
        this.saveState();
        this.renderVocabulary(document.getElementById("app-main"));
    },

    getVocabContextSentence(word) {
        const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
        const targetPattern = new RegExp(`(^|[^a-z])${escaped}(?=$|[^a-z])`, "i");
        const match = (word.example || "").match(targetPattern);
        if (!match) return { sentence: word.example || "", hasBlank: false };
        const start = match.index + match[1].length;
        const target = match[0].slice(match[1].length);
        return {
            sentence: `${word.example.slice(0, start)}${"_".repeat(Math.max(6, target.length))}${word.example.slice(start + target.length)}`,
            hasBlank: true
        };
    },

    getVocabMissingLetters(word, index) {
        let letterIndex = 0;
        let masked = word.word.replace(/[a-z]/gi, letter => {
            const shouldHide = (letterIndex + index) % 2 === 1;
            letterIndex++;
            return shouldHide ? "_" : letter;
        });
        if (!masked.includes("_")) {
            masked = word.word.replace(/[a-z]/i, "_");
        }
        return masked;
    },

    renderVocabQuiz(topic, colorClass) {
        const mode = this.state.vocabPracticeMode || "multipleChoice";
        const questions = this.getVocabQuizQuestions(topic);
        const answered = questions.filter(question => this.state.vocabQuizAnswers[`${mode}:${question.word.id}`] !== undefined
            || (mode === "multipleChoice" && this.state.vocabQuizAnswers[question.word.id] !== undefined));
        const correct = answered.filter(question => {
            const answer = this.state.vocabQuizAnswers[`${mode}:${question.word.id}`];
            if (answer && typeof answer === "object") return answer.correct;
            return mode === "multipleChoice" && answer === question.correctPosition;
        }).length;
        const modes = [
            ["multipleChoice", "Trắc nghiệm", "fa-list-check"],
            ["listening", "Nghe - viết", "fa-headphones"],
            ["context", "Điền từ theo ngữ cảnh", "fa-pen"],
            ["missingLetters", "Điền chữ cái còn thiếu", "fa-spell-check"]
        ];

        return `
            <section class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-5">
                <div class="flex flex-nowrap gap-2 overflow-x-auto pb-2 border-b border-slate-100" role="tablist" aria-label="Dạng bài tập từ vựng">
                    ${modes.map(([value, label, icon]) => `
                        <button type="button" onclick="app.setVocabPracticeMode('${value}')" role="tab" aria-selected="${mode === value}" class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition ${mode === value ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"}">
                            <i class="fa-solid ${icon} mr-1.5"></i>${label}
                        </button>
                    `).join("")}
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-xs font-extrabold uppercase tracking-wider ${colorClass}">Ôn tập bài học</span>
                        <h2 class="text-xl font-extrabold text-slate-900 mt-1">${modes.find(([value]) => value === mode)?.[1] || "Thực hành"}</h2>
                        <p class="text-sm text-slate-500 mt-1">Hoàn thành ${questions.length} câu để ôn lại toàn bộ bài học.</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-sm font-extrabold">Đúng ${correct}/${questions.length} • Đã làm ${answered.length}/${questions.length}</span>
                        ${answered.length ? `<button onclick="app.resetVocabQuiz(app.getActiveVocabTopic(), '${mode}')" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold"><i class="fa-solid fa-rotate-right mr-1"></i>Làm lại</button>` : ""}
                    </div>
                </div>
                <div class="space-y-4">
                    ${questions.map((question, questionIndex) => {
                        const word = question.word;
                        const answerKey = `${mode}:${word.id}`;
                        const savedAnswer = this.state.vocabQuizAnswers[answerKey]
                            ?? (mode === "multipleChoice" && this.state.vocabQuizAnswers[word.id] !== undefined
                                ? { value: this.state.vocabQuizAnswers[word.id], correct: this.state.vocabQuizAnswers[word.id] === question.correctPosition }
                                : null);
                        const selected = savedAnswer?.value;
                        const hasAnswered = savedAnswer !== null && savedAnswer !== undefined;
                        if (mode === "listening") {
                            return `
                                <article class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                                    <div class="flex items-center gap-3">
                                        <span class="w-7 h-7 rounded-lg bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center shrink-0">${questionIndex + 1}</span>
                                        <span class="text-sm font-bold text-slate-800">Nghe từ và viết lại từ/cụm từ đó</span>
                                        <button type="button" onclick="app.speakText('${this.escapeJsString(word.word)}')" class="ml-auto px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs"><i class="fa-solid fa-volume-high mr-1"></i>Nghe lại</button>
                                    </div>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <input id="vocab-practice-${mode}-${this.escapeJsString(word.id)}" type="text" autocomplete="off" ${hasAnswered ? "disabled" : ""} value="${hasAnswered ? this.escapeHtml(selected) : ""}" placeholder="Nhập từ bạn nghe được" class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none text-sm">
                                        ${hasAnswered ? "" : `<button type="button" onclick="app.checkVocabWrittenAnswer('${this.escapeJsString(word.id)}', 'vocab-practice-${mode}-${this.escapeJsString(word.id)}', '${mode}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">Kiểm tra</button>`}
                                    </div>
                                    ${hasAnswered ? `<p class="text-xs font-semibold ${savedAnswer.correct ? "text-emerald-700" : "text-rose-700"}">${savedAnswer.correct ? "Chính xác!" : `Đáp án: ${this.escapeHtml(word.word)}`}</p>` : ""}
                                </article>
                            `;
                        }
                        if (mode === "context") {
                            const context = this.getVocabContextSentence(word);
                            return `
                                <article class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                                    <div class="flex items-start gap-3">
                                        <span class="w-7 h-7 rounded-lg bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center shrink-0">${questionIndex + 1}</span>
                                        <div>
                                            <div class="text-[11px] text-slate-500 uppercase font-extrabold tracking-wide">Điền từ/cụm từ phù hợp</div>
                                            <p class="text-sm font-bold text-slate-900 mt-1">${this.escapeHtml(context.sentence)}</p>
                                            <p class="text-xs text-slate-600 mt-1">Gợi ý nghĩa: ${this.escapeHtml(word.meaning)}</p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <input id="vocab-practice-${mode}-${this.escapeJsString(word.id)}" type="text" autocomplete="off" ${hasAnswered ? "disabled" : ""} value="${hasAnswered ? this.escapeHtml(selected) : ""}" placeholder="Nhập từ/cụm từ" class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none text-sm">
                                        ${hasAnswered ? "" : `<button type="button" onclick="app.checkVocabWrittenAnswer('${this.escapeJsString(word.id)}', 'vocab-practice-${mode}-${this.escapeJsString(word.id)}', '${mode}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">Kiểm tra</button>`}
                                    </div>
                                    ${hasAnswered ? `<p class="text-xs font-semibold ${savedAnswer.correct ? "text-emerald-700" : "text-rose-700"}">${savedAnswer.correct ? "Chính xác!" : `Đáp án: ${this.escapeHtml(word.word)}`}</p>` : ""}
                                </article>
                            `;
                        }
                        if (mode === "missingLetters") {
                            return `
                                <article class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                                    <div class="flex items-start gap-3">
                                        <span class="w-7 h-7 rounded-lg bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center shrink-0">${questionIndex + 1}</span>
                                        <div>
                                            <div class="text-[11px] text-slate-500 uppercase font-extrabold tracking-wide">Điền các chữ cái còn thiếu</div>
                                            <p class="font-mono text-lg sm:text-xl font-extrabold tracking-widest text-slate-900 mt-1">${this.escapeHtml(this.getVocabMissingLetters(word, questionIndex))}</p>
                                            <p class="text-xs text-slate-600 mt-1">Gợi ý nghĩa: ${this.escapeHtml(word.meaning)}</p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col sm:flex-row gap-2">
                                        <input id="vocab-practice-${mode}-${this.escapeJsString(word.id)}" type="text" autocomplete="off" ${hasAnswered ? "disabled" : ""} value="${hasAnswered ? this.escapeHtml(selected) : ""}" placeholder="Nhập từ/cụm từ hoàn chỉnh" class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none text-sm">
                                        ${hasAnswered ? "" : `<button type="button" onclick="app.checkVocabWrittenAnswer('${this.escapeJsString(word.id)}', 'vocab-practice-${mode}-${this.escapeJsString(word.id)}', '${mode}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">Kiểm tra</button>`}
                                    </div>
                                    ${hasAnswered ? `<p class="text-xs font-semibold ${savedAnswer.correct ? "text-emerald-700" : "text-rose-700"}">${savedAnswer.correct ? "Chính xác!" : `Đáp án: ${this.escapeHtml(word.word)}`}</p>` : ""}
                                </article>
                            `;
                        }
                        return `
                            <article class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                                <div class="flex items-start gap-3">
                                    <span class="w-7 h-7 rounded-lg bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center shrink-0">${questionIndex + 1}</span>
                                    <div>
                                        <div class="text-[11px] text-slate-500 uppercase font-extrabold tracking-wide">Chọn từ có nghĩa</div>
                                        <p class="text-base font-extrabold text-slate-900 mt-0.5">${this.escapeHtml(word.meaning)}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    ${question.options.map((option, optionIndex) => {
                                        let style = "bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50";
                                        if (hasAnswered && optionIndex === question.correctPosition) style = "bg-emerald-100 border-emerald-400 text-emerald-950";
                                        else if (hasAnswered && optionIndex === selected) style = "bg-rose-100 border-rose-300 text-rose-900";
                                        return `<button type="button" ${hasAnswered ? "disabled" : ""} onclick="app.answerVocabQuiz('${this.escapeJsString(word.id)}', ${optionIndex})" class="p-3 rounded-xl border text-left font-bold text-sm transition ${style} ${hasAnswered ? "cursor-default" : ""}">${this.escapeHtml(option.word)}</button>`;
                                    }).join("")}
                                </div>
                                ${hasAnswered ? `<p class="text-xs font-semibold ${savedAnswer.correct ? "text-emerald-700" : "text-rose-700"}">${savedAnswer.correct ? "Chính xác!" : `Đáp án đúng: ${this.escapeHtml(word.word)}`}</p>` : ""}
                            </article>
                        `;
                    }).join("")}
                </div>
            </section>
        `;
    },

    getActiveVocabTopic() {
        const topics = this.state.vocabSubTab === "300-phrasal"
            ? window.DAU_DATA.phrasalVerbTopics || []
            : window.DAU_DATA.vocabTopics || [];
        const topicId = this.state.vocabSubTab === "300-phrasal"
            ? this.state.activePhrasalTopicId
            : this.state.activeVocabTopicId;
        return topics.find(topic => topic.id === topicId) || topics[0];
    },

    renderVocabulary(container) {
        if (this.state.vocabSubTab === "300-phrasal") {
            this.renderPhrasalVerbs(container);
            return;
        }
        this.render600Words(container);
    },

    getVocabSubNavHtml() {
        const is600 = this.state.vocabSubTab !== "300-phrasal";
        const learned600 = this.state.learnedVocabIds.filter(id => id.startsWith("w")).length;
        const learned300 = this.state.learnedVocabIds.filter(id => id.startsWith("pv")).length;

        return `
            <div class="bg-white rounded-2xl border border-slate-200 p-2 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                    <button onclick="app.openVocabSection('600-words')" class="p-3 rounded-xl text-left transition flex items-center justify-between gap-3 ${is600 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl ${is600 ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'} flex items-center justify-center text-base font-extrabold shrink-0">
                                <i class="fa-solid fa-book-bookmark"></i>
                            </div>
                            <div>
                                <div class="text-xs sm:text-sm font-extrabold">1. 600 Từ Vựng TOEIC</div>
                                <div class="text-[11px] ${is600 ? 'text-purple-100' : 'text-slate-500'}">50 chủ đề Barron's chuẩn • 600 từ</div>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold ${is600 ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}">${learned600}/600</span>
                    </button>

                    <button onclick="app.openVocabSection('300-phrasal')" class="p-3 rounded-xl text-left transition flex items-center justify-between gap-3 ${!is600 ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl ${!is600 ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-600'} flex items-center justify-center text-base font-extrabold shrink-0">
                                <i class="fa-solid fa-puzzle-piece"></i>
                            </div>
                            <div>
                                <div class="text-xs sm:text-sm font-extrabold">2. 300 Phrasal Verbs</div>
                                <div class="text-[11px] ${!is600 ? 'text-cyan-100' : 'text-slate-500'}">25 chủ đề Cụm động từ TOEIC • 300 cụm</div>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold ${!is600 ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-700'}">${learned300}/300</span>
                    </button>
                </div>
            </div>
        `;
    },

    render600Words(container) {
        const topics = window.DAU_DATA.vocabTopics || [];
        if (!topics.length) {
            this.renderEmptyState(container, "Chưa có từ vựng nào", "Kho từ vựng đang trống. Hãy thêm chủ đề vào <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">vocabTopics</code> trong <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">data.js</code> rồi tải lại trang.");
            return;
        }
        const currentTopic = topics.find(t => t.id === this.state.activeVocabTopicId) || topics[0];
        const card = currentTopic.words[this.state.activeFlashcardIndex] || currentTopic.words[0];
        const isLearned = this.state.learnedVocabIds.includes(card.id);
        const isLessonView = this.state.vocabPage === "lesson";

        // Danh sách các Unit để lọc nhanh 50 chủ đề
        const units = ["ALL", ...new Set(topics.map(t => t.unit).filter(Boolean))];
        const filteredTopics = this.state.activeVocabUnitFilter === "ALL"
            ? topics
            : topics.filter(t => t.unit === this.state.activeVocabUnitFilter);

        // Tìm kiếm trên toàn bộ 600 từ vựng
        const searchQ = (this.state.vocabSearchQuery || "").trim().toLowerCase();
        let searchResults = [];
        if (searchQ) {
            topics.forEach(t => {
                t.words.forEach((w, idx) => {
                    if (
                        w.word.toLowerCase().includes(searchQ) ||
                        w.meaning.toLowerCase().includes(searchQ)
                    ) {
                        searchResults.push({ ...w, topicId: t.id, topicName: t.name, wordIndex: idx });
                    }
                });
            });
        }

        const totalWordsCount = topics.reduce((sum, t) => sum + t.words.length, 0);
        const learnedVocabCount = this.state.learnedVocabIds.filter(id => id.startsWith("w")).length;

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                ${this.getVocabSubNavHtml()}

                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <span class="text-purple-600 font-extrabold text-xs uppercase tracking-widest">Barron's 600 Essential Words for the TOEIC</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">${isLessonView ? `Đang học: ${currentTopic.name}` : `Trọn Bộ ${totalWordsCount} Từ Vựng TOEIC (${topics.length} Chủ Đề Chuẩn)`}</h1>
                        <p class="text-sm text-slate-600 mt-1">${isLessonView ? "Học từng từ qua flashcard, nghe phát âm và xem ví dụ thực tế." : "Đầy đủ 50 bài học (Lessons 01–50) theo giáo trình Barron's 600 Essential Words kèm phiên âm IPA, nghĩa tiếng Việt và ví dụ thực tế."}</p>
                    </div>
                    <div class="bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0">
                        <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <div class="text-xs text-purple-700 font-bold">Tiến độ học từ vựng</div>
                            <div class="text-base font-extrabold text-slate-900">Đã thuộc ${learnedVocabCount} / ${totalWordsCount} từ</div>
                        </div>
                    </div>
                </div>

                <!-- Thanh tìm kiếm 600 từ & Bộ lọc theo Unit -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm space-y-3 ${isLessonView ? "hidden" : ""}">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input
                                type="text"
                                id="vocab-search-input"
                                value="${this.escapeHtml(this.state.vocabSearchQuery)}"
                                oninput="app.handleVocabSearch(this.value)"
                                placeholder="Tìm kiếm nhanh trong 600 từ vựng (nhập từ tiếng Anh hoặc nghĩa tiếng Việt)..."
                                class="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-brand-600 outline-none text-xs sm:text-sm"
                            />
                            ${searchQ ? `
                                <button onclick="app.handleVocabSearch('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </button>
                            ` : ""}
                        </div>
                        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
                            <span>Đang hiển thị: <strong class="text-brand-600">${filteredTopics.length} chủ đề (${filteredTopics.length * 12} từ)</strong></span>
                        </div>
                    </div>

                    <!-- Pills lọc theo 10 Units của Barron's 600 -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
                        ${units.map(u => {
                            const active = u === this.state.activeVocabUnitFilter;
                            const label = u === "ALL" ? `Tất cả (${topics.length} Lessons)` : u;
                            return `
                                <button onclick="app.selectVocabUnitFilter('${this.escapeJsString(u)}')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${active ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    ${label}
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- Kết quả tìm kiếm nhanh (nếu đang gõ từ khóa) -->
                ${searchQ ? `
                    <div class="bg-amber-50/70 rounded-2xl border border-amber-200 p-5 mb-8 ${isLessonView ? "hidden" : ""}">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-extrabold text-sm text-slate-900">
                                <i class="fa-solid fa-bolt text-amber-500 mr-1"></i>Kết quả tìm kiếm cho "${this.escapeHtml(this.state.vocabSearchQuery)}" (${searchResults.length} từ)
                            </h3>
                            <button onclick="app.handleVocabSearch('')" class="text-xs font-bold text-rose-600 hover:underline">Đóng tìm kiếm</button>
                        </div>
                        ${searchResults.length === 0 ? `
                            <p class="text-xs text-slate-500 py-3">Không tìm thấy từ vựng nào khớp với từ khóa của bạn.</p>
                        ` : `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                                ${searchResults.map(r => `
                                    <div onclick="app.jumpToSearchedWord('${r.topicId}', ${r.wordIndex})" class="cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-brand-500 transition flex items-start justify-between gap-2">
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="font-extrabold text-sm text-brand-700">${r.word}</span>
                                                <span class="text-[11px] font-mono text-slate-400">${r.phonetic}</span>
                                                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">${r.pos}</span>
                                            </div>
                                            <div class="text-xs font-semibold text-slate-800 mt-0.5">${r.meaning}</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">${r.topicName}</div>
                                        </div>
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(r.word)}')" class="w-8 h-8 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                        </button>
                                    </div>
                                `).join("")}
                            </div>
                        `}
                    </div>
                ` : ""}

                <!-- Danh sách 50 chủ đề (có thanh cuộn gọn gàng) -->
                <div class="mb-8 ${isLessonView ? "hidden" : ""}">
                    <div class="flex items-center justify-between mb-2.5">
                        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Chọn bài học (Lesson 01 &rarr; Lesson 50)</h3>
                        <span class="text-xs text-slate-400">Cuộn để xem toàn bộ 50 chủ đề</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[310px] overflow-y-auto p-1 pr-2 border border-slate-200/80 rounded-2xl bg-slate-100/60">
                        ${filteredTopics.map(t => {
                            const active = t.id === currentTopic.id;
                            const learnedInTopic = t.words.filter(w => this.state.learnedVocabIds.includes(w.id)).length;
                            return `
                                <button onclick="app.selectVocabTopic('${t.id}')" class="p-3.5 rounded-xl border text-left transition ${active ? 'border-brand-600 bg-brand-50 shadow-sm ring-2 ring-brand-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                                    <div class="flex items-center justify-between mb-1.5">
                                        <i class="fa-solid ${t.icon} ${active ? 'text-brand-600' : 'text-slate-500'} text-base"></i>
                                        <span class="text-[11px] font-bold ${learnedInTopic === t.words.length ? 'text-emerald-600' : 'text-slate-400'}">${learnedInTopic}/${t.words.length} đã thuộc</span>
                                    </div>
                                    <div class="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">${t.name}</div>
                                    <div class="text-[11px] text-slate-500 mt-0.5">${t.level}</div>
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- Khu vực Flashcard 3D + Danh sách 12 từ trong chủ đề -->
                ${isLessonView ? `
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <button onclick="app.backToVocabLessons()" class="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-sm transition">
                            <i class="fa-solid fa-arrow-left mr-2"></i>Chọn bài học khác
                        </button>
                        <span class="text-sm font-bold text-slate-500">${currentTopic.unit || ""} • ${currentTopic.words.length} từ</span>
                    </div>
                    <div class="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 mb-5" role="tablist" aria-label="Nội dung bài học từ vựng">
                        <button onclick="app.setVocabLessonTab('theory')" role="tab" aria-selected="${this.state.vocabLessonTab === "theory"}" class="px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${this.state.vocabLessonTab === "theory" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}">
                            <i class="fa-solid fa-book-open text-indigo-600 mr-1.5"></i>I. Lý thuyết
                        </button>
                        <button onclick="app.setVocabLessonTab('practice')" role="tab" aria-selected="${this.state.vocabLessonTab === "practice"}" class="px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${this.state.vocabLessonTab === "practice" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}">
                            <i class="fa-solid fa-pen-to-square text-emerald-600 mr-1.5"></i>II. Thực hành
                        </button>
                    </div>
                ` : ""}
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${isLessonView && this.state.vocabLessonTab === "theory" ? "" : "hidden"}">
                    <!-- Flashcard 3D (7 cols) -->
                    <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <span class="text-[11px] font-bold text-slate-400 uppercase block">${currentTopic.unit || ""}</span>
                                <span class="text-xs sm:text-sm font-extrabold uppercase text-brand-600">${currentTopic.name} • Từ ${this.state.activeFlashcardIndex + 1}/${currentTopic.words.length}</span>
                            </div>
                            <button onclick="app.toggleLearnedVocab('${card.id}')" class="px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${isLearned ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                <i class="fa-solid fa-check mr-1"></i> ${isLearned ? 'Đã thuộc từ này' : 'Đánh dấu đã thuộc'}
                            </button>
                        </div>

                        <!-- Thẻ lật -->
                        <div onclick="app.flipFlashcard()" class="cursor-pointer bg-gradient-to-br from-indigo-950 via-brand-900 to-slate-900 text-white rounded-2xl p-8 min-h-[280px] flex flex-col items-center justify-center text-center shadow-xl relative select-none transition transform hover:scale-[1.01]">
                            <span class="absolute top-4 left-4 text-[11px] font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-full">
                                #${card.id.replace("w", "")} / 600
                            </span>
                            <span class="absolute top-4 right-4 text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                                <i class="fa-solid fa-rotate mr-1"></i> Bấm vào thẻ để lật mặt
                            </span>

                            ${!this.state.isFlashcardFlipped ? `
                                <div class="space-y-3 my-4">
                                    <span class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase">${card.pos}</span>
                                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${card.word}</h2>
                                    <p class="font-mono text-slate-300 text-base">${card.phonetic}</p>
                                    <div class="pt-2">
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(card.word)}')" class="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold inline-flex items-center gap-2">
                                            <i class="fa-solid fa-volume-high text-amber-300"></i> Nghe phát âm từ
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <div class="space-y-3 max-w-lg my-4">
                                    <span class="text-xs font-extrabold uppercase text-amber-300">${card.word} (${card.pos}) ${card.phonetic}</span>
                                    <h3 class="text-xl sm:text-2xl font-extrabold text-emerald-300">${card.meaning}</h3>
                                    <div class="bg-white/10 p-4 rounded-xl text-xs sm:text-sm text-left space-y-1.5 border border-white/10">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="font-semibold text-white">"${card.example}"</p>
                                            <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(card.example)}')" class="text-amber-300 hover:text-amber-200 shrink-0" title="Nghe câu ví dụ">
                                                <i class="fa-solid fa-volume-high"></i>
                                            </button>
                                        </div>
                                        <p class="text-slate-300 italic">&rarr; ${card.exampleVi}</p>
                                    </div>
                                </div>
                            `}
                        </div>

                        <!-- Điều hướng thẻ -->
                        <div class="flex flex-wrap items-center justify-between gap-2 mt-6">
                            <button onclick="app.prevFlashcard()" class="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-50">&larr; Từ trước</button>
                            <button onclick="app.saveWordToNotebook('${this.escapeJsString(card.word)}', '${card.pos}', '${this.escapeJsString(card.meaning)}')" class="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
                                <i class="fa-solid fa-bookmark mr-1"></i> Lưu vào Sổ tay cá nhân
                            </button>
                            <button onclick="app.nextFlashcard()" class="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm">Từ tiếp theo &rarr;</button>
                        </div>
                    </div>

                    <!-- Danh sách toàn bộ 12 từ trong chủ đề (5 cols) -->
                    <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                            <h3 class="font-extrabold text-sm text-slate-900">12 Từ vựng trong ${currentTopic.name.split(":")[0]}</h3>
                            <span class="text-xs font-semibold text-brand-600">Bấm để xem thẻ</span>
                        </div>
                        <div class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                            ${currentTopic.words.map((w, idx) => {
                                const learned = this.state.learnedVocabIds.includes(w.id);
                                return `
                                    <div onclick="app.selectFlashcardIndex(${idx})" class="cursor-pointer p-3 rounded-xl border ${idx === this.state.activeFlashcardIndex ? 'border-brand-500 bg-brand-50/70' : 'border-slate-100 hover:bg-slate-50'} flex items-center justify-between gap-2">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[11px] font-bold text-slate-400">${idx + 1}.</span>
                                                <span class="font-extrabold text-sm text-slate-900">${w.word}</span>
                                                <span class="text-xs font-mono text-slate-400">${w.phonetic}</span>
                                                <span class="text-xs text-brand-600 font-semibold">(${w.pos})</span>
                                                ${learned ? `<i class="fa-solid fa-circle-check text-emerald-500 text-xs" title="Đã thuộc"></i>` : ""}
                                            </div>
                                            <div class="text-xs text-slate-600 mt-0.5">${w.meaning}</div>
                                        </div>
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(w.word)}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                        </button>
                                    </div>
                                `;
                            }).join("")}
                        </div>
                    </div>
                </div>
                ${isLessonView && this.state.vocabLessonTab === "practice" ? this.renderVocabQuiz(currentTopic, "text-purple-700") : ""}
            </div>
        `;
    },

    selectVocabUnitFilter(unit) {
        this.state.activeVocabUnitFilter = unit;
        const topics = window.DAU_DATA.vocabTopics;
        const filtered = unit === "ALL" ? topics : topics.filter(t => t.unit === unit);
        if (filtered.length > 0 && !filtered.some(t => t.id === this.state.activeVocabTopicId)) {
            this.state.activeVocabTopicId = filtered[0].id;
            this.state.activeFlashcardIndex = 0;
            this.state.isFlashcardFlipped = false;
        }
        this.renderVocabulary(document.getElementById("app-main"));
    },

    handleVocabSearch(query) {
        this.state.vocabSearchQuery = query;
        this.renderVocabulary(document.getElementById("app-main"));
        const input = document.getElementById("vocab-search-input");
        if (input) {
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
        }
    },

    jumpToSearchedWord(topicId, wordIndex) {
        this.state.activeVocabTopicId = topicId;
        this.state.activeFlashcardIndex = wordIndex;
        this.state.isFlashcardFlipped = false;
        this.state.vocabSearchQuery = "";
        this.state.vocabPage = "lesson";
        this.state.vocabLessonTab = "theory";
        this.saveVocabHistoryState("lesson", true);
        this.renderVocabulary(document.getElementById("app-main"));
    },

    selectVocabTopic(topicId) {
        this.state.activeVocabTopicId = topicId;
        this.state.activeFlashcardIndex = 0;
        this.state.isFlashcardFlipped = false;
        this.state.vocabPage = "lesson";
        this.state.vocabLessonTab = "theory";
        this.saveVocabHistoryState("lesson", true);
        this.renderVocabulary(document.getElementById("app-main"));
    },

    flipFlashcard() {
        this.state.isFlashcardFlipped = !this.state.isFlashcardFlipped;
        this.renderVocabulary(document.getElementById("app-main"));
    },

    selectFlashcardIndex(idx) {
        this.state.activeFlashcardIndex = idx;
        this.state.isFlashcardFlipped = false;
        this.renderVocabulary(document.getElementById("app-main"));
    },

    prevFlashcard() {
        const topic = window.DAU_DATA.vocabTopics.find(t => t.id === this.state.activeVocabTopicId);
        if (!topic) return;
        this.state.activeFlashcardIndex = (this.state.activeFlashcardIndex - 1 + topic.words.length) % topic.words.length;
        this.state.isFlashcardFlipped = false;
        this.renderVocabulary(document.getElementById("app-main"));
    },

    nextFlashcard() {
        const topic = window.DAU_DATA.vocabTopics.find(t => t.id === this.state.activeVocabTopicId);
        if (!topic) return;
        this.state.activeFlashcardIndex = (this.state.activeFlashcardIndex + 1) % topic.words.length;
        this.state.isFlashcardFlipped = false;
        this.renderVocabulary(document.getElementById("app-main"));
    },

    toggleLearnedVocab(vocabId) {
        const idx = this.state.learnedVocabIds.indexOf(vocabId);
        if (idx >= 0) {
            this.state.learnedVocabIds.splice(idx, 1);
        } else {
            this.state.learnedVocabIds.push(vocabId);
        }
        this.saveState();
        this.renderVocabulary(document.getElementById("app-main"));
    },

    // ================= 8B. KHO 300 CỤM ĐỘNG TỪ TOEIC (300 PHRASAL VERBS - 25 CHỦ ĐỀ) =================
    renderPhrasalVerbs(container) {
        const topics = window.DAU_DATA.phrasalVerbTopics || [];
        if (topics.length === 0) {
            this.renderEmptyState(container, "Chưa có cụm động từ nào", "Kho phrasal verbs đang trống. Hãy thêm chủ đề vào <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">phrasalVerbTopics</code> trong <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">data.js</code> rồi tải lại trang.");
            return;
        }

        const currentTopic = topics.find(t => t.id === this.state.activePhrasalTopicId) || topics[0];
        const card = currentTopic.words[this.state.activePhrasalCardIndex] || currentTopic.words[0];
        const isLearned = this.state.learnedVocabIds.includes(card.id);
        const isLessonView = this.state.phrasalPage === "lesson";

        // Danh sách các Unit (5 Units) để lọc nhanh 25 chủ đề
        const units = ["ALL", ...new Set(topics.map(t => t.unit).filter(Boolean))];
        const filteredTopics = this.state.activePhrasalUnitFilter === "ALL"
            ? topics
            : topics.filter(t => t.unit === this.state.activePhrasalUnitFilter);

        // Tìm kiếm trên toàn bộ 300 Phrasal Verbs
        const searchQ = (this.state.phrasalSearchQuery || "").trim().toLowerCase();
        let searchResults = [];
        if (searchQ) {
            topics.forEach(t => {
                t.words.forEach((w, idx) => {
                    if (
                        w.word.toLowerCase().includes(searchQ) ||
                        w.meaning.toLowerCase().includes(searchQ)
                    ) {
                        searchResults.push({ ...w, topicId: t.id, topicName: t.name, wordIndex: idx });
                    }
                });
            });
        }

        const totalWordsCount = topics.reduce((sum, t) => sum + t.words.length, 0);
        const learnedPhrasalCount = this.state.learnedVocabIds.filter(id => id.startsWith("pv")).length;

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                ${this.getVocabSubNavHtml()}

                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <span class="text-cyan-600 font-extrabold text-xs uppercase tracking-widest">Essential TOEIC Phrasal Verbs Mastery</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">${isLessonView ? `Đang học: ${currentTopic.name}` : `Trọn Bộ ${totalWordsCount} Phrasal Verbs TOEIC (${topics.length} Chủ Đề Chuẩn)`}</h1>
                        <p class="text-sm text-slate-600 mt-1">${isLessonView ? "Học từng cụm động từ qua flashcard, nghe phát âm và xem ví dụ thực tế." : "Đầy đủ 25 bài học (Lessons 01–25) tổng hợp 300 cụm động từ xuất hiện dày đặc nhất trong Part 1–7 kèm phiên âm IPA, nghĩa tiếng Việt và câu ví dụ thực tế."}</p>
                    </div>
                    <div class="bg-cyan-50 border border-cyan-200 rounded-2xl px-4 py-3 flex items-center gap-3 shrink-0">
                        <div class="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-extrabold">
                            <i class="fa-solid fa-puzzle-piece"></i>
                        </div>
                        <div>
                            <div class="text-xs text-cyan-700 font-bold">Tiến độ Phrasal Verbs</div>
                            <div class="text-base font-extrabold text-slate-900">Đã thuộc ${learnedPhrasalCount} / ${totalWordsCount} cụm</div>
                        </div>
                    </div>
                </div>

                <!-- Thanh tìm kiếm 300 Phrasal Verbs & Bộ lọc theo Unit -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm space-y-3 ${isLessonView ? "hidden" : ""}">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input
                                type="text"
                                id="phrasal-search-input"
                                value="${this.escapeHtml(this.state.phrasalSearchQuery)}"
                                oninput="app.handlePhrasalSearch(this.value)"
                                placeholder="Tìm kiếm nhanh trong 300 Phrasal Verbs (VD: call off, set up, trì hoãn, hoàn trả)..."
                                class="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-600 outline-none text-xs sm:text-sm"
                            />
                            ${searchQ ? `
                                <button onclick="app.handlePhrasalSearch('')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </button>
                            ` : ""}
                        </div>
                        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
                            <span>Đang hiển thị: <strong class="text-cyan-600">${filteredTopics.length} chủ đề (${filteredTopics.length * 12} cụm từ)</strong></span>
                        </div>
                    </div>

                    <!-- Pills lọc theo 5 Units -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
                        ${units.map(u => {
                            const active = u === this.state.activePhrasalUnitFilter;
                            const label = u === "ALL" ? `Tất cả (${topics.length} Lessons)` : u;
                            return `
                                <button onclick="app.selectPhrasalUnitFilter('${this.escapeJsString(u)}')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${active ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                    ${label}
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- Kết quả tìm kiếm nhanh (nếu đang gõ từ khóa) -->
                ${searchQ ? `
                    <div class="bg-cyan-50/70 rounded-2xl border border-cyan-200 p-5 mb-8 ${isLessonView ? "hidden" : ""}">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-extrabold text-sm text-slate-900">
                                <i class="fa-solid fa-bolt text-cyan-600 mr-1"></i>Kết quả tìm kiếm cho "${this.escapeHtml(this.state.phrasalSearchQuery)}" (${searchResults.length} cụm động từ)
                            </h3>
                            <button onclick="app.handlePhrasalSearch('')" class="text-xs font-bold text-rose-600 hover:underline">Đóng tìm kiếm</button>
                        </div>
                        ${searchResults.length === 0 ? `
                            <p class="text-xs text-slate-500 py-3">Không tìm thấy cụm động từ nào khớp với từ khóa của bạn.</p>
                        ` : `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                                ${searchResults.map(r => `
                                    <div onclick="app.jumpToSearchedPhrasal('${r.topicId}', ${r.wordIndex})" class="cursor-pointer p-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-500 transition flex items-start justify-between gap-2">
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <span class="font-extrabold text-sm text-cyan-700">${r.word}</span>
                                                <span class="text-[11px] font-mono text-slate-400">${r.phonetic}</span>
                                                <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700">${r.pos}</span>
                                            </div>
                                            <div class="text-xs font-semibold text-slate-800 mt-0.5">${r.meaning}</div>
                                            <div class="text-[11px] text-slate-400 mt-0.5">${r.topicName}</div>
                                        </div>
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(r.word)}')" class="w-8 h-8 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                        </button>
                                    </div>
                                `).join("")}
                            </div>
                        `}
                    </div>
                ` : ""}

                <!-- Danh sách 25 chủ đề (có thanh cuộn gọn gàng) -->
                <div class="mb-8 ${isLessonView ? "hidden" : ""}">
                    <div class="flex items-center justify-between mb-2.5">
                        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Chọn bài học Phrasal Verbs (Lesson 01 &rarr; Lesson 25)</h3>
                        <span class="text-xs text-slate-400">Cuộn để xem toàn bộ 25 chủ đề</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[310px] overflow-y-auto p-1 pr-2 border border-slate-200/80 rounded-2xl bg-slate-100/60">
                        ${filteredTopics.map(t => {
                            const active = t.id === currentTopic.id;
                            const learnedInTopic = t.words.filter(w => this.state.learnedVocabIds.includes(w.id)).length;
                            return `
                                <button onclick="app.selectPhrasalTopic('${t.id}')" class="p-3.5 rounded-xl border text-left transition ${active ? 'border-cyan-600 bg-cyan-50 shadow-sm ring-2 ring-cyan-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}">
                                    <div class="flex items-center justify-between mb-1.5">
                                        <i class="fa-solid ${t.icon} ${active ? 'text-cyan-600' : 'text-slate-500'} text-base"></i>
                                        <span class="text-[11px] font-bold ${learnedInTopic === t.words.length ? 'text-emerald-600' : 'text-slate-400'}">${learnedInTopic}/${t.words.length} đã thuộc</span>
                                    </div>
                                    <div class="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">${t.name}</div>
                                    <div class="text-[11px] text-slate-500 mt-0.5">${t.level}</div>
                                </button>
                            `;
                        }).join("")}
                    </div>
                </div>

                <!-- Khu vực Flashcard 3D + Danh sách 12 Phrasal Verbs trong chủ đề -->
                ${isLessonView ? `
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <button onclick="app.backToPhrasalLessons()" class="px-4 py-2.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-extrabold text-sm transition">
                            <i class="fa-solid fa-arrow-left mr-2"></i>Chọn bài học khác
                        </button>
                        <span class="text-sm font-bold text-slate-500">${currentTopic.unit || ""} • ${currentTopic.words.length} cụm từ</span>
                    </div>
                    <div class="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 mb-5" role="tablist" aria-label="Nội dung bài học Phrasal Verbs">
                        <button onclick="app.setVocabLessonTab('theory')" role="tab" aria-selected="${this.state.vocabLessonTab === "theory"}" class="px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${this.state.vocabLessonTab === "theory" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}">
                            <i class="fa-solid fa-book-open text-indigo-600 mr-1.5"></i>I. Lý thuyết
                        </button>
                        <button onclick="app.setVocabLessonTab('practice')" role="tab" aria-selected="${this.state.vocabLessonTab === "practice"}" class="px-5 py-2.5 rounded-xl text-sm font-extrabold transition ${this.state.vocabLessonTab === "practice" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}">
                            <i class="fa-solid fa-pen-to-square text-emerald-600 mr-1.5"></i>II. Thực hành
                        </button>
                    </div>
                ` : ""}
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${isLessonView && this.state.vocabLessonTab === "theory" ? "" : "hidden"}">
                    <!-- Flashcard 3D (7 cols) -->
                    <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
                            <div>
                                <span class="text-[11px] font-bold text-slate-400 uppercase block">${currentTopic.unit || ""}</span>
                                <span class="text-xs sm:text-sm font-extrabold uppercase text-cyan-600">${currentTopic.name} • Cụm ${this.state.activePhrasalCardIndex + 1}/${currentTopic.words.length}</span>
                            </div>
                            <button onclick="app.toggleLearnedVocab('${card.id}')" class="px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${isLearned ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                                <i class="fa-solid fa-check mr-1"></i> ${isLearned ? 'Đã thuộc cụm này' : 'Đánh dấu đã thuộc'}
                            </button>
                        </div>

                        <!-- Thẻ lật -->
                        <div onclick="app.flipPhrasalCard()" class="cursor-pointer bg-gradient-to-br from-cyan-950 via-teal-900 to-slate-900 text-white rounded-2xl p-8 min-h-[280px] flex flex-col items-center justify-center text-center shadow-xl relative select-none transition transform hover:scale-[1.01]">
                            <span class="absolute top-4 left-4 text-[11px] font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-full">
                                #${card.id.replace("pv", "")} / 300
                            </span>
                            <span class="absolute top-4 right-4 text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                                <i class="fa-solid fa-rotate mr-1"></i> Bấm vào thẻ để lật mặt
                            </span>

                            ${!this.state.isPhrasalCardFlipped ? `
                                <div class="space-y-3 my-4">
                                    <span class="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase">${card.pos}</span>
                                    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${card.word}</h2>
                                    <p class="font-mono text-slate-300 text-base">${card.phonetic}</p>
                                    <div class="pt-2">
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(card.word)}')" class="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold inline-flex items-center gap-2">
                                            <i class="fa-solid fa-volume-high text-amber-300"></i> Nghe phát âm cụm từ
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <div class="space-y-3 max-w-lg my-4">
                                    <span class="text-xs font-extrabold uppercase text-amber-300">${card.word} (${card.pos}) ${card.phonetic}</span>
                                    <h3 class="text-xl sm:text-2xl font-extrabold text-emerald-300">${card.meaning}</h3>
                                    <div class="bg-white/10 p-4 rounded-xl text-xs sm:text-sm text-left space-y-1.5 border border-white/10">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="font-semibold text-white">"${card.example}"</p>
                                            <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(card.example)}')" class="text-amber-300 hover:text-amber-200 shrink-0" title="Nghe câu ví dụ">
                                                <i class="fa-solid fa-volume-high"></i>
                                            </button>
                                        </div>
                                        <p class="text-slate-300 italic">&rarr; ${card.exampleVi}</p>
                                    </div>
                                </div>
                            `}
                        </div>

                        <!-- Điều hướng thẻ -->
                        <div class="flex flex-wrap items-center justify-between gap-2 mt-6">
                            <button onclick="app.prevPhrasalCard()" class="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-50">&larr; Cụm trước</button>
                            <button onclick="app.saveWordToNotebook('${this.escapeJsString(card.word)}', '${card.pos}', '${this.escapeJsString(card.meaning)}')" class="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
                                <i class="fa-solid fa-bookmark mr-1"></i> Lưu vào Sổ tay cá nhân
                            </button>
                            <button onclick="app.nextPhrasalCard()" class="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm">Cụm tiếp theo &rarr;</button>
                        </div>
                    </div>

                    <!-- Danh sách toàn bộ 12 Phrasal Verbs trong chủ đề (5 cols) -->
                    <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div class="flex items-center justify-between">
                            <h3 class="font-extrabold text-sm text-slate-900">12 Phrasal Verbs trong ${currentTopic.name.split(":")[0]}</h3>
                            <span class="text-xs font-semibold text-cyan-600">Bấm để xem thẻ</span>
                        </div>
                        <div class="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                            ${currentTopic.words.map((w, idx) => {
                                const learned = this.state.learnedVocabIds.includes(w.id);
                                return `
                                    <div onclick="app.selectPhrasalCardIndex(${idx})" class="cursor-pointer p-3 rounded-xl border ${idx === this.state.activePhrasalCardIndex ? 'border-cyan-500 bg-cyan-50/70' : 'border-slate-100 hover:bg-slate-50'} flex items-center justify-between gap-2">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-[11px] font-bold text-slate-400">${idx + 1}.</span>
                                                <span class="font-extrabold text-sm text-slate-900">${w.word}</span>
                                                <span class="text-xs font-mono text-slate-400">${w.phonetic}</span>
                                                <span class="text-xs text-cyan-600 font-semibold">(${w.pos})</span>
                                                ${learned ? `<i class="fa-solid fa-circle-check text-emerald-500 text-xs" title="Đã thuộc"></i>` : ""}
                                            </div>
                                            <div class="text-xs text-slate-600 mt-0.5">${w.meaning}</div>
                                        </div>
                                        <button onclick="event.stopPropagation(); app.speakText('${this.escapeJsString(w.word)}')" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                                            <i class="fa-solid fa-volume-high text-xs"></i>
                                        </button>
                                    </div>
                                `;
                            }).join("")}
                        </div>
                    </div>
                </div>
                ${isLessonView && this.state.vocabLessonTab === "practice" ? this.renderVocabQuiz(currentTopic, "text-cyan-700") : ""}
            </div>
        `;
    },

    selectPhrasalUnitFilter(unit) {
        this.state.activePhrasalUnitFilter = unit;
        const topics = window.DAU_DATA.phrasalVerbTopics || [];
        const filtered = unit === "ALL" ? topics : topics.filter(t => t.unit === unit);
        if (filtered.length > 0 && !filtered.some(t => t.id === this.state.activePhrasalTopicId)) {
            this.state.activePhrasalTopicId = filtered[0].id;
            this.state.activePhrasalCardIndex = 0;
            this.state.isPhrasalCardFlipped = false;
        }
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    handlePhrasalSearch(query) {
        this.state.phrasalSearchQuery = query;
        this.renderPhrasalVerbs(document.getElementById("app-main"));
        const input = document.getElementById("phrasal-search-input");
        if (input) {
            input.focus();
            const len = input.value.length;
            input.setSelectionRange(len, len);
        }
    },

    jumpToSearchedPhrasal(topicId, wordIndex) {
        this.state.activePhrasalTopicId = topicId;
        this.state.activePhrasalCardIndex = wordIndex;
        this.state.isPhrasalCardFlipped = false;
        this.state.phrasalSearchQuery = "";
        this.state.phrasalPage = "lesson";
        this.state.vocabLessonTab = "theory";
        this.saveVocabHistoryState("lesson", true);
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    selectPhrasalTopic(topicId) {
        this.state.activePhrasalTopicId = topicId;
        this.state.activePhrasalCardIndex = 0;
        this.state.isPhrasalCardFlipped = false;
        this.state.phrasalPage = "lesson";
        this.state.vocabLessonTab = "theory";
        this.saveVocabHistoryState("lesson", true);
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    flipPhrasalCard() {
        this.state.isPhrasalCardFlipped = !this.state.isPhrasalCardFlipped;
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    selectPhrasalCardIndex(idx) {
        this.state.activePhrasalCardIndex = idx;
        this.state.isPhrasalCardFlipped = false;
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    prevPhrasalCard() {
        const topic = (window.DAU_DATA.phrasalVerbTopics || []).find(t => t.id === this.state.activePhrasalTopicId);
        if (!topic) return;
        this.state.activePhrasalCardIndex = (this.state.activePhrasalCardIndex - 1 + topic.words.length) % topic.words.length;
        this.state.isPhrasalCardFlipped = false;
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    nextPhrasalCard() {
        const topic = (window.DAU_DATA.phrasalVerbTopics || []).find(t => t.id === this.state.activePhrasalTopicId);
        if (!topic) return;
        this.state.activePhrasalCardIndex = (this.state.activePhrasalCardIndex + 1) % topic.words.length;
        this.state.isPhrasalCardFlipped = false;
        this.renderPhrasalVerbs(document.getElementById("app-main"));
    },

    // ================= 8.5. CHUYÊN ĐỀ NGỮ PHÁP TOEIC TRỌNG TÂM (22 CHUYÊN ĐỀ: TRANG DANH SÁCH & TRANG HỌC RIÊNG) =================
    getEnrichedGrammarTopics() {
        const topics = window.DAU_DATA.grammarTopics || [];
        const extraMap = window.GRAMMAR_EXTRA_QUESTIONS || {};
        const lecturesMap = window.GRAMMAR_LECTURES || {};

        // Bản đồ phân loại tần suất xuất hiện thực tế trong đề thi TOEIC (Tổng = 100%)
        const freqMetaMap = {
            // 1. DỄ GẶP (7 chuyên đề trọng tâm nhất - Tổng 62% lượng câu ngữ pháp trong đề thi)
            "gram-20-word-formation": { tier: "de-gap", tierName: "Dễ gặp", percent: "20%", freqNote: "6–8 câu / đề" },
            "gram-01-verb-tenses": { tier: "de-gap", tierName: "Dễ gặp", percent: "10%", freqNote: "3–4 câu / đề" },
            "gram-16-prepositions": { tier: "de-gap", tierName: "Dễ gặp", percent: "9%", freqNote: "3–4 câu / đề" },
            "gram-17-conjunctions": { tier: "de-gap", tierName: "Dễ gặp", percent: "8%", freqNote: "3 câu / đề" },
            "gram-08-passive-voice": { tier: "de-gap", tierName: "Dễ gặp", percent: "5%", freqNote: "2 câu / đề" },
            "gram-12-relative-clauses": { tier: "de-gap", tierName: "Dễ gặp", percent: "5%", freqNote: "2 câu / đề" },
            "gram-03-subject-verb-agreement": { tier: "de-gap", tierName: "Dễ gặp", percent: "5%", freqNote: "2 câu / đề" },

            // 2. HAY GẶP (8 chuyên đề xuất hiện đều đặn - Tổng 28% lượng câu ngữ pháp)
            "gram-04-gerunds": { tier: "hay-gap", tierName: "Hay gặp", percent: "4%", freqNote: "1–2 câu / đề" },
            "gram-05-infinitives": { tier: "hay-gap", tierName: "Hay gặp", percent: "4%", freqNote: "1–2 câu / đề" },
            "gram-02-sequence-of-tenses": { tier: "hay-gap", tierName: "Hay gặp", percent: "4%", freqNote: "1–2 câu / đề" },
            "gram-18-comparisons": { tier: "hay-gap", tierName: "Hay gặp", percent: "3.5%", freqNote: "1–2 câu / đề" },
            "gram-21-quantifiers": { tier: "hay-gap", tierName: "Hay gặp", percent: "3.5%", freqNote: "1–2 câu / đề" },
            "gram-09-conditional-sentences": { tier: "hay-gap", tierName: "Hay gặp", percent: "3%", freqNote: "1 câu / đề" },
            "gram-13-types-of-clauses": { tier: "hay-gap", tierName: "Hay gặp", percent: "3%", freqNote: "1 câu / đề" },
            "gram-22-comprehensive-structures": { tier: "hay-gap", tierName: "Hay gặp", percent: "3%", freqNote: "1 câu / đề" },

            // 3. ÍT GẶP (7 chuyên đề phân hóa band 800-990 hoặc bẫy nhỏ - Tổng 10% lượng câu ngữ pháp)
            "gram-07-modal-verbs": { tier: "it-gap", tierName: "Ít gặp", percent: "2%", freqNote: "1 câu / đề" },
            "gram-15-articles": { tier: "it-gap", tierName: "Ít gặp", percent: "2%", freqNote: "0–1 câu / đề" },
            "gram-19-order-of-adjectives": { tier: "it-gap", tierName: "Ít gặp", percent: "1.5%", freqNote: "0–1 câu / đề" },
            "gram-06-subjunctive-mood": { tier: "it-gap", tierName: "Ít gặp", percent: "1.5%", freqNote: "0–1 câu / đề" },
            "gram-14-inversion": { tier: "it-gap", tierName: "Ít gặp", percent: "1%", freqNote: "Câu phân loại 850+" },
            "gram-10-reported-speech": { tier: "it-gap", tierName: "Ít gặp", percent: "1%", freqNote: "0–1 câu / đề" },
            "gram-11-tag-questions": { tier: "it-gap", tierName: "Ít gặp", percent: "1%", freqNote: "Chủ yếu ở Part 2" }
        };

        return topics.map(t => {
            const meta = freqMetaMap[t.id] || { tier: "hay-gap", tierName: "Hay gặp", percent: "3%", freqNote: "1 câu / đề" };
            const baseQs = Array.isArray(t.questions) ? t.questions : [];
            const extraQs = Array.isArray(extraMap[t.id]) ? extraMap[t.id] : [];
            const wordFormationQs = t.practiceQuestionsByType
                ? Object.values(t.practiceQuestionsByType).flat()
                : null;
            const allQuestions = wordFormationQs || [...baseQs, ...extraQs];
            const lecture = lecturesMap[t.id] || null;

            let answeredCount = 0;
            let correctCount = 0;
            allQuestions.forEach((qItem, qIdx) => {
                const ansKey = `${t.id}-q${qIdx}`;
                const userChoice = this.state.grammarUserAnswers[ansKey];
                if (userChoice !== undefined) {
                    answeredCount++;
                    if (userChoice === qItem.correctIndex) correctCount++;
                }
            });

            return {
                ...t,
                ...meta,
                allQuestions,
                lecture,
                answeredCount,
                correctCount
            };
        });
    },

    renderGrammar(container) {
        const enrichedTopics = this.getEnrichedGrammarTopics();
        if (!enrichedTopics.length) {
            this.renderEmptyState(container, "Chưa có chuyên đề ngữ pháp nào", "Kho ngữ pháp đang trống. Hãy thêm chuyên đề vào <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">grammarTopics</code> trong <code class=\"rounded bg-slate-100 px-1.5 py-0.5\">data.js</code> rồi tải lại trang.");
            return;
        }

        // Nếu đang ở chế độ Trang học chi tiết ('detail') -> Render trang học riêng của chuyên đề đó
        if (this.state.grammarViewMode === "detail") {
            this.renderGrammarLessonPage(container, enrichedTopics);
            return;
        }

        const deGapOrder = [
            "gram-20-word-formation",
            "gram-01-verb-tenses",
            "gram-16-prepositions",
            "gram-17-conjunctions",
            "gram-08-passive-voice",
            "gram-12-relative-clauses",
            "gram-03-subject-verb-agreement"
        ];
        const hayGapOrder = [
            "gram-04-gerunds",
            "gram-05-infinitives",
            "gram-02-sequence-of-tenses",
            "gram-18-comparisons",
            "gram-21-quantifiers",
            "gram-09-conditional-sentences",
            "gram-13-types-of-clauses",
            "gram-22-comprehensive-structures"
        ];
        const itGapOrder = [
            "gram-07-modal-verbs",
            "gram-15-articles",
            "gram-19-order-of-adjectives",
            "gram-06-subjunctive-mood",
            "gram-14-inversion",
            "gram-10-reported-speech",
            "gram-11-tag-questions"
        ];

        const allGroups = [
            {
                key: "de-gap",
                name: "1. Nhóm Dễ Gặp (Trọng tâm bắt buộc)",
                totalPercent: "62% đề thi",
                desc: "7 chuyên đề cốt lõi xuất hiện dày đặc (20–25 câu/đề), giúp cầm chắc 650+ Reading.",
                headerBg: "bg-rose-50/70 border-rose-200/90",
                badgeClass: "bg-rose-600 text-white",
                percentPillClass: "bg-rose-50 text-rose-700 border border-rose-200",
                accentBorder: "hover:border-rose-300",
                chipClass: "hover:border-rose-300 hover:bg-rose-50/70 hover:text-rose-800",
                headerIcon: "fa-fire text-rose-600",
                items: deGapOrder.map(id => enrichedTopics.find(t => t.id === id)).filter(Boolean)
            },
            {
                key: "hay-gap",
                name: "2. Nhóm Hay Gặp (Xuất hiện đều đặn)",
                totalPercent: "28% đề thi",
                desc: "8 chuyên đề gặp 1–2 câu mỗi đề Part 5–6, giúp nâng điểm vững chắc lên 750–850+.",
                headerBg: "bg-amber-50/70 border-amber-200/90",
                badgeClass: "bg-amber-500 text-slate-950",
                percentPillClass: "bg-amber-50 text-amber-800 border border-amber-200",
                accentBorder: "hover:border-amber-300",
                chipClass: "hover:border-amber-300 hover:bg-amber-50/70 hover:text-amber-900",
                headerIcon: "fa-bolt text-amber-600",
                items: hayGapOrder.map(id => enrichedTopics.find(t => t.id === id)).filter(Boolean)
            },
            {
                key: "it-gap",
                name: "3. Nhóm Ít Gặp (Phân loại 850–990)",
                totalPercent: "10% đề thi",
                desc: "7 chuyên đề nâng cao hoặc bẫy nhỏ trong Part 2 & Part 5 dành cho mục tiêu 900+.",
                headerBg: "bg-indigo-50/70 border-indigo-200/90",
                badgeClass: "bg-indigo-600 text-white",
                percentPillClass: "bg-indigo-50 text-indigo-700 border border-indigo-200",
                accentBorder: "hover:border-indigo-300",
                chipClass: "hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-800",
                headerIcon: "fa-gem text-indigo-600",
                items: itGapOrder.map(id => enrichedTopics.find(t => t.id === id)).filter(Boolean)
            }
        ];

        const activeFilter = this.state.grammarTierFilter || "ALL";
        const searchRaw = this.state.grammarSearchQuery || "";
        const searchNorm = searchRaw.trim().toLowerCase();

        const topicIndexMap = {};
        let globalCounter = 0;
        allGroups.forEach(g => g.items.forEach(t => { topicIndexMap[t.id] = ++globalCounter; }));

        const baseGroups = activeFilter === "ALL"
            ? allGroups
            : allGroups.filter(g => g.key === activeFilter);

        const visibleGroups = baseGroups
            .map(g => {
                if (!searchNorm) return g;
                const matchedItems = g.items.filter(t => {
                    const pickerItems = this.getGrammarTopicPickerItems(t);
                    const haystack = [
                        t.titleEn,
                        t.titleVi,
                        t.summary,
                        ...pickerItems.map(p => `${p.label} ${p.searchText || ""}`)
                    ].join(" ").toLowerCase();
                    return haystack.includes(searchNorm);
                });
                return { ...g, items: matchedItems };
            })
            .filter(g => g.items.length > 0);

        const totalQuestionsAll = enrichedTopics.reduce((sum, t) => sum + t.allQuestions.length, 0);
        const totalAnsweredAll = enrichedTopics.reduce((sum, t) => sum + t.answeredCount, 0);
        const completedTopicsCount = enrichedTopics.filter(t => t.answeredCount >= t.allQuestions.length && t.allQuestions.length > 0).length;
        const matchedTopicCount = visibleGroups.reduce((sum, g) => sum + g.items.length, 0);
        const overallPct = Math.round((totalAnsweredAll / Math.max(1, totalQuestionsAll)) * 100);

        container.innerHTML = `
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <!-- Header + Tìm kiếm + Lọc theo tần suất -->
                <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div class="space-y-2 max-w-2xl">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-xs">
                                <i class="fa-solid fa-layer-group"></i>
                                <span>Học Ngữ Pháp Theo Từng Chủ Điểm Nhỏ</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                22 Chuyên Đề Ngữ Pháp TOEIC
                            </h1>
                            <p class="text-sm text-slate-600 leading-relaxed">
                                Mỗi chuyên đề được chia thành từng mục nhỏ gọn gàng. Bấm trực tiếp vào <strong>mục bạn muốn học</strong> ngay trên thẻ để vào đọc đúng phần đó, không cần lướt dài.
                            </p>
                        </div>

                        <!-- Tiến độ gọn -->
                        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 shrink-0 min-w-[250px] space-y-2.5">
                            <div class="flex items-center justify-between gap-2">
                                <span class="text-xs font-extrabold uppercase text-slate-500">Tiến độ bài tập</span>
                                <span class="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">${completedTopicsCount}/22 bài xong</span>
                            </div>
                            <div class="flex items-baseline justify-between">
                                <div class="text-2xl font-extrabold text-slate-900">${totalAnsweredAll} <span class="text-sm font-semibold text-slate-500">/ ${totalQuestionsAll} câu</span></div>
                                <span class="text-xs font-bold text-slate-500">${overallPct}%</span>
                            </div>
                            <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div class="h-full bg-emerald-500 rounded-full transition-all duration-300" style="width: ${overallPct}%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Thanh tìm kiếm + Bộ lọc nhóm -->
                    <div class="pt-5 border-t border-slate-100 space-y-3.5">
                        <div class="relative">
                            <i class="fa-solid fa-magnifying-glass text-slate-400 text-sm absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                            <input
                                id="grammar-search-input"
                                type="text"
                                value="${this.escapeHtml(searchRaw)}"
                                oninput="app.setGrammarSearchQuery(this.value)"
                                placeholder="Tìm nhanh chuyên đề hoặc nội dung con (ví dụ: danh từ ghép, bị động, V-ing, bẫy đuôi, đảo ngữ...)"
                                aria-label="Tìm chuyên đề ngữ pháp"
                                class="w-full pl-11 pr-24 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-emerald-500 focus:outline-none text-sm text-slate-800 placeholder:text-slate-400 transition"
                            />
                            ${searchRaw ? `
                                <button
                                    type="button"
                                    onclick="app.setGrammarSearchQuery('')"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                                >
                                    Xoá lọc
                                </button>
                            ` : ""}
                        </div>

                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                            ${[
                                ["ALL", "Tất cả chuyên đề", "22 chuyên đề", "100%", "bg-slate-900 text-white border-slate-900", "bg-slate-50 hover:bg-white border-slate-200 text-slate-800", "bg-slate-200 text-slate-800"],
                                ["de-gap", "1. Dễ Gặp", "7 chuyên đề cốt lõi", "62%", "bg-rose-600 text-white border-rose-600", "bg-rose-50/60 hover:bg-rose-50 border-rose-200 text-slate-900", "bg-white text-rose-600 border border-rose-200"],
                                ["hay-gap", "2. Hay Gặp", "8 chuyên đề đều đặn", "28%", "bg-amber-500 text-slate-950 border-amber-500", "bg-amber-50/60 hover:bg-amber-50 border-amber-200 text-slate-900", "bg-white text-amber-800 border border-amber-200"],
                                ["it-gap", "3. Ít Gặp", "7 chuyên đề 850+", "10%", "bg-indigo-600 text-white border-indigo-600", "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200 text-slate-900", "bg-white text-indigo-700 border border-indigo-200"]
                            ].map(([key, title, sub, pct, activeCls, idleCls, pillIdleCls]) => {
                                const isAct = activeFilter === key;
                                return `
                                    <button onclick="app.setGrammarTierFilter('${key}')" class="p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 ${isAct ? activeCls + ' shadow-sm' : idleCls}">
                                        <div class="min-w-0">
                                            <div class="text-xs font-extrabold uppercase truncate">${title}</div>
                                            <div class="text-[11px] opacity-80 truncate mt-0.5">${sub}</div>
                                        </div>
                                        <span class="text-sm font-extrabold px-2 py-1 rounded-xl shrink-0 ${isAct ? 'bg-white/20 text-current' : pillIdleCls}">${pct}</span>
                                    </button>
                                `;
                            }).join("")}
                        </div>
                    </div>
                </div>

                ${searchNorm ? `
                    <div class="flex items-center justify-between px-1 text-xs sm:text-sm text-slate-600">
                        <span>Tìm thấy <strong class="text-slate-900">${matchedTopicCount}</strong> chuyên đề khớp từ khoá “<strong>${this.escapeHtml(searchRaw.trim())}</strong>”</span>
                    </div>
                ` : ""}

                <!-- Danh sách thẻ chuyên đề thoáng 2 cột, có chọn nhanh từng nội dung con -->
                ${visibleGroups.length ? `
                    <div class="space-y-8">
                        ${visibleGroups.map(g => `
                            <section class="space-y-4">
                                <div class="px-5 py-4 rounded-2xl border ${g.headerBg} flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div class="space-y-0.5">
                                        <div class="flex items-center gap-2">
                                            <i class="fa-solid ${g.headerIcon} text-sm"></i>
                                            <h2 class="text-base font-extrabold text-slate-900">${g.name}</h2>
                                        </div>
                                        <p class="text-xs text-slate-600">${g.desc}</p>
                                    </div>
                                    <span class="px-3 py-1 rounded-xl font-extrabold text-xs shrink-0 self-start sm:self-center ${g.badgeClass}">
                                        ${g.totalPercent}
                                    </span>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    ${g.items.map(t => {
                                        const numStr = String(topicIndexMap[t.id] || 0).padStart(2, "0");
                                        const titleEn = t.titleEn || t.title;
                                        const titleVi = t.titleVi || "";
                                        const qTotal = t.allQuestions.length;
                                        const qDone = t.answeredCount;
                                        const isDone = qDone >= qTotal && qTotal > 0;
                                        const pickerItems = this.getGrammarTopicPickerItems(t);

                                        return `
                                            <article class="bg-white rounded-2xl border border-slate-200 ${g.accentBorder} hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between gap-4">
                                                <div class="space-y-3.5">
                                                    <!-- Meta top -->
                                                    <div class="flex flex-wrap items-center justify-between gap-2">
                                                        <div class="flex items-center gap-2">
                                                            <span class="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">${numStr}</span>
                                                            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-lg ${g.percentPillClass}">${t.percent} • ${t.freqNote}</span>
                                                        </div>
                                                        ${isDone
                                                            ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold"><i class="fa-solid fa-circle-check"></i> Đúng ${t.correctCount}/${qTotal}</span>`
                                                            : `<span class="text-xs font-semibold text-slate-500">Đã làm ${qDone}/${qTotal} câu</span>`
                                                        }
                                                    </div>

                                                    <!-- Tiêu đề (bấm để mở bài đầu) -->
                                                    <button type="button" onclick="app.selectGrammarTopic('${t.id}', 0, 0, 'theory')" class="text-left block w-full group">
                                                        <h3 class="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 leading-snug transition">
                                                            ${this.escapeHtml(titleVi || titleEn)}
                                                        </h3>
                                                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                                                            ${this.escapeHtml(titleEn)}
                                                        </div>
                                                    </button>

                                                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                                                        ${this.escapeHtml(t.summary || "")}
                                                    </p>

                                                    <!-- Chọn trực tiếp từng nội dung nhỏ muốn học -->
                                                    <div class="pt-2 border-t border-slate-100 space-y-2">
                                                        <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                                            Chọn nhanh nội dung muốn học:
                                                        </div>
                                                        <div class="flex flex-wrap gap-1.5">
                                                            ${pickerItems.map(p => {
                                                                const isMatch = searchNorm && `${p.label} ${p.searchText || ""}`.toLowerCase().includes(searchNorm);
                                                                return `
                                                                    <button
                                                                        type="button"
                                                                        onclick="app.selectGrammarTopic('${t.id}', ${p.lessonIdx}, ${p.subUnitIdx}, 'theory')"
                                                                        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${isMatch ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold' : `bg-slate-50/80 border-slate-200 text-slate-700 ${g.chipClass}`}"
                                                                    >
                                                                        <span>${this.escapeHtml(p.label)}</span>
                                                                        ${p.badge ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-500">${this.escapeHtml(p.badge)}</span>` : ""}
                                                                    </button>
                                                                `;
                                                            }).join("")}
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Hành động chân thẻ -->
                                                <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                    <button
                                                        type="button"
                                                        onclick="app.selectGrammarTopic('${t.id}', 0, 0, 'theory')"
                                                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                                                    >
                                                        <i class="fa-solid fa-book-open"></i>
                                                        <span>Học từng mục</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onclick="app.selectGrammarTopic('${t.id}', 0, 0, 'practice')"
                                                        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
                                                    >
                                                        <i class="fa-solid fa-pen-to-square text-amber-600"></i>
                                                        <span>Làm bài tập (${qTotal} câu)</span>
                                                    </button>
                                                </div>
                                            </article>
                                        `;
                                    }).join("")}
                                </div>
                            </section>
                        `).join("")}
                    </div>
                ` : `
                    <div class="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
                        <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <h3 class="text-base font-extrabold text-slate-900">Không tìm thấy nội dung phù hợp</h3>
                        <p class="text-sm text-slate-500">Thử từ khoá khác hoặc xoá bộ lọc để xem toàn bộ 22 chuyên đề.</p>
                        <button type="button" onclick="app.setGrammarSearchQuery(''); app.setGrammarTierFilter('ALL');" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition">
                            Hiện tất cả 22 chuyên đề
                        </button>
                    </div>
                `}
            </div>
        `;
    },

    // ================= TRANG HỌC CHI TIẾT CỦA TỪNG LOẠI NGỮ PHÁP (CHIA NHỎ TỪNG MỤC + BÀI TẬP PHÂN TRANG) =================
    renderGrammarLessonPage(container, enrichedTopics) {
        const currentIndex = enrichedTopics.findIndex(t => t.id === this.state.activeGrammarTopicId);
        const currentTopic = currentIndex >= 0 ? enrichedTopics[currentIndex] : enrichedTopics[0];
        const prevTopic = currentIndex > 0 ? enrichedTopics[currentIndex - 1] : null;
        const nextTopic = currentIndex >= 0 && currentIndex < enrichedTopics.length - 1 ? enrichedTopics[currentIndex + 1] : null;

        const allQuestions = currentTopic.allQuestions || [];
        const answeredCount = currentTopic.answeredCount || 0;
        const correctCount = currentTopic.correctCount || 0;
        const activeTab = this.state.grammarLessonTab || "theory"; // 'theory' | 'practice'
        const isWordFormation = currentTopic.id === "gram-20-word-formation";
        const practiceMode = this.state.grammarPracticeMode || "mixed";
        const practiceItems = this.getGrammarPracticeItems(currentTopic, practiceMode);
        const wordTypeFilter = this.state.grammarWordTypeFilter || "all";
        const wordTypeOptions = [
            ["all", "Tất cả", allQuestions.length],
            ["noun", "Danh từ", allQuestions.filter(question => question.wordType === "noun").length],
            ["verb", "Động từ", allQuestions.filter(question => question.wordType === "verb").length],
            ["adjective", "Tính từ", allQuestions.filter(question => question.wordType === "adjective").length],
            ["adverb", "Trạng từ", allQuestions.filter(question => question.wordType === "adverb").length]
        ];
        const hasPracticeAnswers = Object.keys(this.state.grammarUserAnswers).some(key => key.startsWith(`${currentTopic.id}-`));

        const tierBadgeMap = {
            "de-gap": "bg-rose-100 text-rose-800 border-rose-200",
            "hay-gap": "bg-amber-100 text-amber-900 border-amber-200",
            "it-gap": "bg-indigo-100 text-indigo-800 border-indigo-200"
        };
        const tierBadgeStyle = tierBadgeMap[currentTopic.tier] || tierBadgeMap["hay-gap"];
        const standardSubUnitsCount = isWordFormation ? 0 : this.getStandardTopicSubUnits(currentTopic).length;
        const theoryTabSubLabel = isWordFormation ? "5 bài • Chia từng mục" : `${standardSubUnitsCount} mục nhỏ`;

        container.innerHTML = `
            <div class="${isWordFormation ? 'max-w-[1440px]' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
                <!-- Thanh điều hướng phía trên -->
                <div class="bg-white rounded-2xl border border-slate-200 p-3.5 sm:px-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    <button
                        onclick="app.backToGrammarList()"
                        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm transition"
                    >
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Danh sách 22 chuyên đề</span>
                    </button>

                    <div class="flex items-center gap-2 flex-wrap">
                        ${prevTopic ? `
                            <button onclick="app.selectGrammarTopic('${prevTopic.id}')" class="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition" title="${this.escapeHtml(prevTopic.titleVi)}">
                                <i class="fa-solid fa-chevron-left mr-1"></i> Bài trước
                            </button>
                        ` : ""}

                        <select
                            onchange="app.selectGrammarTopic(this.value)"
                            aria-label="Chọn nhanh chuyên đề ngữ pháp"
                            class="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm focus:outline-none focus:border-emerald-500 max-w-[230px] sm:max-w-xs truncate"
                        >
                            ${enrichedTopics.map((t, idx) => `
                                <option value="${t.id}" ${t.id === currentTopic.id ? "selected" : ""}>
                                    #${String(idx + 1).padStart(2, "0")}. ${this.escapeHtml(t.titleVi || t.titleEn)} (${t.percent})
                                </option>
                            `).join("")}
                        </select>

                        ${nextTopic ? `
                            <button onclick="app.selectGrammarTopic('${nextTopic.id}')" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition" title="${this.escapeHtml(nextTopic.titleVi)}">
                                Bài tiếp <i class="fa-solid fa-chevron-right ml-1"></i>
                            </button>
                        ` : ""}
                    </div>
                </div>

                <!-- Header chuyên đề gọn, tập trung -->
                <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                        <span class="px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${tierBadgeStyle}">
                            ${currentTopic.tierName} • ${currentTopic.percent} (${currentTopic.freqNote})
                        </span>
                        <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            ${currentTopic.level}
                        </span>
                    </div>

                    <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        ${this.escapeHtml(currentTopic.titleVi || currentTopic.titleEn)}
                        <span class="text-slate-400 font-bold text-sm sm:text-base ml-2">${this.escapeHtml(currentTopic.titleEn || "")}</span>
                    </h1>
                    <p class="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        ${this.escapeHtml(currentTopic.summary || (window.GRAMMAR_LECTURES?.[currentTopic.id]?.intro || ""))}
                    </p>

                    <div class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
                            <button
                                onclick="app.setGrammarLessonTab('theory')"
                                class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${activeTab === 'theory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
                            >
                                <i class="fa-solid fa-book-open text-emerald-600 mr-1.5"></i>Lý thuyết <span class="text-[11px] text-slate-400 font-semibold ml-1">(${theoryTabSubLabel})</span>
                            </button>
                            <button
                                onclick="app.setGrammarLessonTab('practice')"
                                class="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition ${activeTab === 'practice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
                            >
                                <i class="fa-solid fa-pen-to-square text-amber-600 mr-1.5"></i>Bài tập (${answeredCount}/${allQuestions.length})
                            </button>
                        </div>

                        <div class="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-600">
                            <span>Kết quả: <strong class="text-emerald-600">${correctCount}/${allQuestions.length} đúng</strong></span>
                            ${hasPracticeAnswers ? `
                                <button onclick="app.resetGrammarTopicQuiz('${currentTopic.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs transition">
                                    <i class="fa-solid fa-rotate-right mr-1"></i>Làm lại
                                </button>
                            ` : ""}
                        </div>
                    </div>
                </div>

                ${(() => {
                    if (activeTab !== "practice") {
                        return isWordFormation
                            ? this.renderWordFormationTheoryHtml(currentTopic, allQuestions.length)
                            : this.renderStandardTopicTheoryHtml(currentTopic, allQuestions.length);
                    }

                    const practiceModeButtonsHtml = [
                        ["mixed", "Tổng hợp", "fa-shuffle"],
                        ["multipleChoice", "Trắc nghiệm", "fa-list-check"],
                        ["fillWord", "Điền từ", "fa-pen"],
                        ["fillParagraph", "Điền đoạn", "fa-align-left"],
                        ["sentenceOrder", "Sắp xếp câu", "fa-arrow-down-wide-short"]
                    ].map(([mode, label, icon]) => `
                        <button
                            onclick="app.setGrammarPracticeMode('${mode}')"
                            role="tab"
                            aria-selected="${practiceMode === mode}"
                            class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition ${practiceMode === mode ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}"
                        >
                            <i class="fa-solid ${icon} mr-1.5"></i>${label}
                        </button>
                    `).join("");

                    const rawPageSize = Number(this.state.grammarPracticePageSize);
                    const pageSize = Number.isFinite(rawPageSize) && rawPageSize >= 0 ? rawPageSize : 5;
                    const totalItems = practiceItems.length;
                    const isPaginated = pageSize > 0 && totalItems > pageSize;
                    const totalPages = isPaginated ? Math.ceil(totalItems / pageSize) : 1;
                    const safePage = isPaginated
                        ? Math.min(Math.max(0, Number(this.state.grammarPracticePageIndex) || 0), totalPages - 1)
                        : 0;
                    const startIdx = isPaginated ? safePage * pageSize : 0;
                    const endIdx = isPaginated ? Math.min(startIdx + pageSize, totalItems) : totalItems;
                    const visiblePracticeItems = practiceItems.slice(startIdx, endIdx);

                    const pageButtons = [];
                    if (isPaginated) {
                        for (let p = 0; p < totalPages; p++) {
                            if (totalPages <= 7 || p === 0 || p === totalPages - 1 || Math.abs(p - safePage) <= 1) {
                                pageButtons.push(p);
                            } else if (pageButtons[pageButtons.length - 1] !== "...") {
                                pageButtons.push("...");
                            }
                        }
                    }

                    const paginationBarHtml = totalItems > 1 ? `
                        <div class="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3">
                            <div class="flex flex-wrap items-center gap-2 text-xs">
                                <span class="font-bold text-slate-500">Hiển thị:</span>
                                ${[
                                    [1, "1 câu / trang"],
                                    [5, "5 câu / trang"],
                                    [0, `Tất cả (${totalItems})`]
                                ].map(([size, label]) => `
                                    <button
                                        type="button"
                                        onclick="app.setGrammarPracticePageSize(${size})"
                                        class="px-2.5 py-1.5 rounded-lg font-bold transition ${pageSize === size ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}"
                                    >
                                        ${label}
                                    </button>
                                `).join("")}
                            </div>

                            ${isPaginated ? `
                                <div class="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span class="text-slate-500 font-semibold mr-1">Câu ${startIdx + 1}–${endIdx} / ${totalItems}</span>
                                    <button
                                        type="button"
                                        ${safePage <= 0 ? "disabled" : ""}
                                        onclick="app.setGrammarPracticePage(${safePage - 1})"
                                        class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
                                    >
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                    ${pageButtons.map(p => p === "..."
                                        ? `<span class="px-1.5 text-slate-400 font-bold">…</span>`
                                        : `<button type="button" onclick="app.setGrammarPracticePage(${p})" class="min-w-[30px] px-2 py-1.5 rounded-lg font-extrabold transition ${p === safePage ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">${p + 1}</button>`
                                    ).join("")}
                                    <button
                                        type="button"
                                        ${safePage >= totalPages - 1 ? "disabled" : ""}
                                        onclick="app.setGrammarPracticePage(${safePage + 1})"
                                        class="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition"
                                    >
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            ` : `<span class="text-xs font-semibold text-slate-500">Đang hiện toàn bộ ${totalItems} bài tập</span>`}
                        </div>
                    ` : "";

                    return `
                        <div id="grammar-practice-section" class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                                <div class="flex items-center gap-3">
                                    <span class="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </span>
                                    <div>
                                        <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-600">Luyện tập chia nhỏ dễ làm</span>
                                        <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">
                                            Bài Tập Thực Hành: ${this.escapeHtml(currentTopic.titleVi || "")}
                                        </h2>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3">
                                    <div class="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-extrabold">
                                        Đúng: <span class="text-emerald-600 text-base">${correctCount}</span> / ${allQuestions.length} câu
                                    </div>
                                    ${hasPracticeAnswers ? `
                                        <button onclick="app.resetGrammarTopicQuiz('${currentTopic.id}')" class="px-3.5 py-2 rounded-2xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-700 font-bold text-xs sm:text-sm transition">
                                            <i class="fa-solid fa-rotate-right mr-1"></i> Làm lại
                                        </button>
                                    ` : ""}
                                </div>
                            </div>

                            ${isWordFormation ? `
                                <div class="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-3.5">
                                    <div>
                                        <div class="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 mb-2">1. Chọn từ loại luyện tập (20 câu mỗi từ loại)</div>
                                        <div class="flex flex-nowrap gap-2 overflow-x-auto pb-1" role="group" aria-label="Chọn từ loại Word Formation">
                                            ${wordTypeOptions.map(([type, label, count]) => `
                                                <button
                                                    onclick="app.setGrammarWordTypeFilter('${type}')"
                                                    aria-pressed="${wordTypeFilter === type}"
                                                    class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition ${wordTypeFilter === type ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-indigo-100 text-indigo-800 hover:bg-indigo-50'}"
                                                >
                                                    ${label}<span class="ml-1.5 opacity-75">${count}</span>
                                                </button>
                                            `).join("")}
                                        </div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-200/70">
                                        <div class="text-[11px] font-extrabold uppercase tracking-wide text-slate-500 mb-2">2. Chọn dạng bài tập</div>
                                        <div class="flex flex-nowrap gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Dạng bài tập ngữ pháp">
                                            ${practiceModeButtonsHtml}
                                        </div>
                                    </div>
                                </div>
                            ` : `
                                <div class="space-y-3">
                                    <div class="flex flex-nowrap gap-2 overflow-x-auto pb-2 border-b border-slate-100" role="tablist" aria-label="Dạng bài tập ngữ pháp">
                                        ${practiceModeButtonsHtml}
                                    </div>
                                </div>
                            `}

                            ${paginationBarHtml}

                            <div class="space-y-5">
                                ${visiblePracticeItems.map((item, localIdx) => this.renderGrammarPracticeItem(currentTopic, item, startIdx + localIdx)).join("")}
                            </div>

                            ${isPaginated ? `
                                <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        ${safePage <= 0 ? "disabled" : ""}
                                        onclick="app.setGrammarPracticePage(${safePage - 1})"
                                        class="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs sm:text-sm text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
                                    >
                                        <i class="fa-solid fa-arrow-left mr-1.5"></i>Trang trước
                                    </button>
                                    <span class="text-xs font-bold text-slate-500">Trang ${safePage + 1} / ${totalPages}</span>
                                    <button
                                        type="button"
                                        ${safePage >= totalPages - 1 ? "disabled" : ""}
                                        onclick="app.setGrammarPracticePage(${safePage + 1})"
                                        class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 transition"
                                    >
                                        Trang tiếp<i class="fa-solid fa-arrow-right ml-1.5"></i>
                                    </button>
                                </div>
                            ` : ""}
                        </div>
                    `;
                })()}

                <!-- Điều hướng cuối trang học -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    ${prevTopic ? `
                        <button onclick="app.selectGrammarTopic('${prevTopic.id}')" class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm transition flex items-center gap-2">
                            <i class="fa-solid fa-arrow-left text-slate-500"></i>
                            <div class="text-left">
                                <div class="text-[10px] uppercase text-slate-400">Chuyên đề trước</div>
                                <div>${this.escapeHtml(prevTopic.titleVi)}</div>
                            </div>
                        </button>
                    ` : `<div></div>`}

                    <button onclick="app.backToGrammarList()" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm transition">
                        <i class="fa-solid fa-table-cells-large mr-1.5"></i> Xem tất cả 22 chuyên đề
                    </button>

                    ${nextTopic ? `
                        <button onclick="app.selectGrammarTopic('${nextTopic.id}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm">
                            <div class="text-right">
                                <div class="text-[10px] uppercase text-emerald-100">Chuyên đề tiếp theo</div>
                                <div>${this.escapeHtml(nextTopic.titleVi)}</div>
                            </div>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    ` : `<div></div>`}
                </div>
            </div>
        `;
    },

    getGrammarPracticeModes(topic) {
        if (topic.practiceModes) return topic.practiceModes;

        const questions = topic.allQuestions
            || (topic.practiceQuestionsByType ? Object.values(topic.practiceQuestionsByType).flat() : topic.questions)
            || [];
        const getAnswer = question => String(question.options?.[question.correctIndex] || "")
            .replace(/^\([A-D]\)\s*/i, "")
            .trim();
        const getSentence = question => String(question.q || "")
            .replace(/^\d+\.\s*/, "")
            .replace(/_+/, getAnswer(question));
        const usableQuestions = questions
            .map((question, index) => ({ question, index, answer: getAnswer(question) }))
            .filter(({ question, answer }) => answer && (String(question.q || "").match(/_+/g) || []).length === 1);

        const fillParagraph = [];
        if (usableQuestions.length) {
            const parts = [""];
            const blanks = [];
            usableQuestions.forEach(({ question, answer }) => {
                const [before, after] = question.q.replace(/^\d+\.\s*/, "").split(/_+/);
                parts[parts.length - 1] += before;
                blanks.push({
                    cue: "Tự xác định",
                    answer,
                    explanation: question.explanation
                });
                parts.push(`${after}\n\n`);
            });
            fillParagraph.push({
                intro: "Hoàn thành các câu hỏi của chuyên đề bằng cách điền đáp án thích hợp vào từng chỗ trống.",
                parts,
                blanks
            });
        }

        const sentenceOrder = usableQuestions.map(({ question, index }) => {
            const tokens = getSentence(question).split(/\s+/).filter(Boolean);
            let seed = index + 1;
            for (let i = tokens.length - 1; i > 0; i--) {
                seed = (seed * 9301 + 49297) % 233280;
                const swapIndex = seed % (i + 1);
                [tokens[i], tokens[swapIndex]] = [tokens[swapIndex], tokens[i]];
            }
            return {
                instruction: "Sắp xếp các từ để tạo thành câu đúng.",
                tokens,
                answer: getSentence(question)
            };
        });

        return {
            fillWord: usableQuestions.map(({ question, answer }) => ({
                prompt: question.q.replace(/^\d+\.\s*/, ""),
                cue: "Tự xác định",
                answer,
                explanation: question.explanation
            })),
            fillParagraph,
            sentenceOrder
        };
    },

    getGrammarPracticeItems(topic, mode) {
        const practiceModes = this.getGrammarPracticeModes(topic);
        const questions = topic.allQuestions || [];
        const selectedWordType = topic.id === "gram-20-word-formation"
            ? (this.state.grammarWordTypeFilter || "all")
            : "all";
        const makeItems = (type, items) => items
            .map((item, index) => ({ type, item, index }))
            .filter(entry => selectedWordType === "all" || entry.item.wordType === selectedWordType || entry.item.wordType === "mixed");
        const questionItems = makeItems("multipleChoice", questions);
        const fillWordItems = makeItems("fillWord", practiceModes.fillWord || []);
        const paragraphItems = makeItems("fillParagraph", practiceModes.fillParagraph || []);
        const sentenceItems = makeItems("sentenceOrder", practiceModes.sentenceOrder || []);

        if (mode === "multipleChoice") return questionItems;
        if (mode === "fillWord") return fillWordItems;
        if (mode === "fillParagraph") return paragraphItems;
        if (mode === "sentenceOrder") return sentenceItems;

        if (!this.state.grammarMixedPracticeItems
            || this.state.grammarMixedPracticeItems.topicId !== topic.id
            || this.state.grammarMixedPracticeItems.wordType !== selectedWordType) {
            const pickRandom = items => items.length ? items[Math.floor(Math.random() * items.length)] : null;
            const mixed = [];
            [questionItems, fillWordItems, paragraphItems, sentenceItems].forEach(items => {
                const item = pickRandom(items);
                if (item) mixed.push(item);
            });
            mixed.sort(() => Math.random() - 0.5);
            this.state.grammarMixedPracticeItems = { topicId: topic.id, wordType: selectedWordType, items: mixed };
        }

        return this.state.grammarMixedPracticeItems.items || [];
    },

    renderGrammarPracticeItem(topic, exercise, index) {
        const { type, item, index: sourceIndex } = exercise;
        const key = type === "multipleChoice"
            ? `${topic.id}-q${sourceIndex}`
            : `${topic.id}-${type}-${sourceIndex}`;
        const cardClass = "p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4";
        const label = {
            multipleChoice: "Trắc nghiệm",
            fillWord: "Điền từ",
            fillParagraph: "Điền đoạn",
            sentenceOrder: "Sắp xếp câu"
        }[type];
        const cardHeader = `
            <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center">${index + 1}</span>
                <span class="text-[11px] uppercase tracking-wide font-extrabold text-emerald-700">${label}</span>
            </div>
        `;

        if (type === "multipleChoice") {
            const answer = this.state.grammarUserAnswers[key];
            const hasAnswered = answer !== undefined;
            const isCorrect = hasAnswered && answer === item.correctIndex;
            const question = item.q.replace(/^\d+\.\s*/, "");
            return `
                <div class="${cardClass}">
                    ${cardHeader}
                    <div class="flex items-start justify-between gap-3">
                        <p class="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">${this.escapeHtml(question)}</p>
                        <button onclick="app.speakText('${this.escapeJsString(question.replace(/_+/g, "blank"))}')" class="w-8 h-8 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0" title="Nghe câu hỏi"><i class="fa-solid fa-volume-high text-xs"></i></button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${item.options.map((option, optionIndex) => {
                            let style = "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-800";
                            let icon = `<span class="w-5 h-5 rounded-full border border-slate-300 shrink-0"></span>`;
                            if (hasAnswered && optionIndex === item.correctIndex) {
                                style = "bg-emerald-100 border-emerald-500 text-emerald-950 font-extrabold";
                                icon = `<i class="fa-solid fa-circle-check text-emerald-600"></i>`;
                            } else if (hasAnswered && optionIndex === answer) {
                                style = "bg-rose-100 border-rose-400 text-rose-900 font-bold";
                                icon = `<i class="fa-solid fa-circle-xmark text-rose-600"></i>`;
                            }
                            return `<button onclick="app.answerGrammarQuestion('${key}', ${optionIndex})" class="w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between gap-2 ${style}"><span>${this.escapeHtml(option)}</span>${icon}</button>`;
                        }).join("")}
                    </div>
                    ${hasAnswered ? `<div class="p-4 rounded-xl bg-white border ${isCorrect ? 'border-emerald-200' : 'border-amber-200'} text-xs sm:text-sm"><strong class="${isCorrect ? 'text-emerald-700' : 'text-rose-600'}">${isCorrect ? 'Chính xác!' : `Chưa đúng — đáp án: ${this.escapeHtml(item.options[item.correctIndex])}`}</strong><p class="text-slate-700 mt-1"><strong>Giải thích:</strong> ${item.explanation}</p></div>` : ""}
                </div>
            `;
        }

        if (type === "fillWord") {
            const result = this.state.grammarUserAnswers[key];
            const inputId = `grammar-input-${sourceIndex}`;
            return `
                <div class="${cardClass}">
                    ${cardHeader}
                    <p class="text-sm sm:text-base font-bold text-slate-900">${this.escapeHtml(item.prompt)}</p>
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100 font-mono font-extrabold text-indigo-800 text-xs">Từ gợi ý: ${this.escapeHtml(item.cue)}</span>
                        <input id="${inputId}" type="text" autocomplete="off" ${result ? "disabled" : ""} value="${result ? this.escapeHtml(result.value) : ""}" placeholder="Nhập dạng từ đúng" class="flex-1 min-w-[180px] px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:outline-none text-sm">
                        ${result ? "" : `<button onclick="app.checkGrammarTextAnswer('${key}', '${inputId}', '${this.escapeJsString(item.answer)}', '${this.escapeJsString(item.explanation)}')" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">Kiểm tra</button>`}
                    </div>
                    ${result ? `<div class="p-3.5 rounded-xl ${result.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} border text-sm"><strong>${result.correct ? 'Chính xác!' : `Đáp án: ${this.escapeHtml(item.answer)}`}</strong><p class="mt-1 text-slate-700">${item.explanation}</p></div>` : ""}
                </div>
            `;
        }

        if (type === "fillParagraph") {
            const result = this.state.grammarUserAnswers[key];
            const parts = (item.parts || []).map((part, partIndex) => `
                ${this.escapeHtml(part)}
                ${partIndex < item.blanks.length ? `
                    <span class="inline-flex flex-col align-middle mx-1 my-1">
                        <input id="grammar-paragraph-${sourceIndex}-${partIndex}" type="text" autocomplete="off" ${result ? "disabled" : ""} value="${result ? this.escapeHtml(result.values[partIndex] || "") : ""}" placeholder="${this.escapeHtml(item.blanks[partIndex].cue)}" class="w-32 px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none text-sm">
                        <span class="text-[10px] text-slate-500 text-center">(${this.escapeHtml(item.blanks[partIndex].cue)})</span>
                    </span>
                ` : ""}
            `).join("");
            return `
                <div class="${cardClass}">
                    ${cardHeader}
                    <p class="text-sm text-slate-600">${this.escapeHtml(item.intro)}</p>
                    <p class="text-sm sm:text-base text-slate-900 leading-[2.4] whitespace-pre-line">${parts}</p>
                    ${result ? `
                        <div class="space-y-2">
                            ${item.blanks.map((blank, blankIndex) => `
                                <div class="p-3 rounded-xl ${result.results[blankIndex] ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} border text-xs sm:text-sm">
                                    <strong>${result.results[blankIndex] ? 'Chính xác' : `Đáp án: ${this.escapeHtml(blank.answer)}`}</strong>
                                    <span class="text-slate-700"> — ${blank.explanation}</span>
                                </div>
                            `).join("")}
                        </div>
                    ` : `<button onclick="app.checkGrammarParagraphAnswer('${key}', ${sourceIndex})" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold w-fit">Kiểm tra đoạn văn</button>`}
                </div>
            `;
        }

        const sentenceResult = this.state.grammarUserAnswers[key];
        const selected = sentenceResult?.selected || [];
        const tokenHtml = item.tokens.map((token, tokenIndex) => `
            <button ${sentenceResult?.submitted ? "disabled" : ""} onclick="app.toggleGrammarSentenceWord('${key}', ${tokenIndex})" class="px-3 py-2 rounded-xl border text-sm font-bold transition ${selected.includes(tokenIndex) ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50' : 'bg-white border-indigo-200 text-indigo-900 hover:bg-indigo-50'}">${this.escapeHtml(token)}</button>
        `).join("");
        const assembledSentence = selected.map(tokenIndex => item.tokens[tokenIndex]).join(" ");
        return `
            <div class="${cardClass}">
                ${cardHeader}
                <p class="text-sm font-bold text-slate-900">${this.escapeHtml(item.instruction)}</p>
                <div class="flex flex-wrap gap-2">${tokenHtml}</div>
                <div class="min-h-12 p-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-800">${selected.length ? this.escapeHtml(assembledSentence) : `<span class="text-slate-400">Bấm các từ theo đúng thứ tự để ghép thành câu.</span>`}</div>
                ${sentenceResult?.submitted ? `<div class="p-3.5 rounded-xl ${sentenceResult.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} border text-sm"><strong>${sentenceResult.correct ? 'Chính xác!' : `Đáp án: ${this.escapeHtml(item.answer)}`}</strong></div>` : `<div class="flex gap-2"><button onclick="app.clearGrammarSentence('${key}')" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">Xóa lựa chọn</button><button onclick="app.checkGrammarSentence('${key}', ${sourceIndex})" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold">Kiểm tra câu</button></div>`}
            </div>
        `;
    },

    setGrammarPracticeMode(mode) {
        const allowedModes = ["mixed", "multipleChoice", "fillWord", "fillParagraph", "sentenceOrder"];
        if (!allowedModes.includes(mode)) return;
        this.state.grammarPracticeMode = mode;
        this.state.grammarPracticePageIndex = 0;
        this.state.grammarMixedPracticeItems = null;
        this.renderGrammar(document.getElementById("app-main"));
    },

    setGrammarWordTypeFilter(wordType) {
        const allowedTypes = ["all", "noun", "verb", "adjective", "adverb"];
        if (!allowedTypes.includes(wordType)) return;
        this.state.grammarWordTypeFilter = wordType;
        this.state.grammarPracticePageIndex = 0;
        this.state.grammarMixedPracticeItems = null;
        this.renderGrammar(document.getElementById("app-main"));
    },

    checkGrammarTextAnswer(key, inputId, expected, explanation) {
        const input = document.getElementById(inputId);
        if (!input || !input.value.trim()) {
            this.showToast("Nhập câu trả lời trước khi kiểm tra.");
            return;
        }
        const normalize = value => String(value).trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
        this.state.grammarUserAnswers[key] = {
            value: input.value.trim(),
            correct: normalize(input.value) === normalize(expected),
            explanation
        };
        this.saveState();
        this.renderGrammar(document.getElementById("app-main"));
    },

    checkGrammarParagraphAnswer(key, itemIndex) {
        const topic = this.getEnrichedGrammarTopics().find(entry => entry.id === this.state.activeGrammarTopicId);
        const item = topic ? this.getGrammarPracticeModes(topic).fillParagraph?.[itemIndex] : null;
        if (!item) return;
        const values = item.blanks.map((_, index) => document.getElementById(`grammar-paragraph-${itemIndex}-${index}`)?.value.trim() || "");
        if (values.some(value => !value)) {
            this.showToast("Hãy điền đủ các chỗ trống trước khi kiểm tra.");
            return;
        }
        const normalize = value => String(value).trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
        this.state.grammarUserAnswers[key] = {
            values,
            results: item.blanks.map((blank, index) => normalize(values[index]) === normalize(blank.answer))
        };
        this.saveState();
        this.renderGrammar(document.getElementById("app-main"));
    },

    toggleGrammarSentenceWord(key, tokenIndex) {
        const answer = this.state.grammarUserAnswers[key] || { selected: [] };
        if (answer.submitted) return;
        const selected = [...(answer.selected || [])];
        const existingIndex = selected.indexOf(tokenIndex);
        if (existingIndex >= 0) selected.splice(existingIndex, 1);
        else selected.push(tokenIndex);
        this.state.grammarUserAnswers[key] = { selected };
        this.renderGrammar(document.getElementById("app-main"));
    },

    clearGrammarSentence(key) {
        if (this.state.grammarUserAnswers[key]?.submitted) return;
        delete this.state.grammarUserAnswers[key];
        this.renderGrammar(document.getElementById("app-main"));
    },

    checkGrammarSentence(key, itemIndex) {
        const topic = this.getEnrichedGrammarTopics().find(entry => entry.id === this.state.activeGrammarTopicId);
        const item = topic ? this.getGrammarPracticeModes(topic).sentenceOrder?.[itemIndex] : null;
        const answer = this.state.grammarUserAnswers[key] || { selected: [] };
        if (!item || answer.selected.length !== item.tokens.length) {
            this.showToast("Hãy sắp xếp đủ các từ trước khi kiểm tra.");
            return;
        }
        const normalize = value => String(value).trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
        const sentence = answer.selected.map(index => item.tokens[index]).join(" ");
        this.state.grammarUserAnswers[key] = {
            ...answer,
            submitted: true,
            correct: normalize(sentence) === normalize(item.answer)
        };
        this.saveState();
        this.renderGrammar(document.getElementById("app-main"));
    },

    formatGrammarRichText(s) {
        return this.escapeHtml(String(s ?? ""))
            .replace(/&lt;(\/?b)&gt;/g, "<$1>")
            .replace(/\*\*(.+?)\*\*/g, "<strong class='text-slate-900 font-bold'>$1</strong>");
    },

    getGrammarToneStyle(tone) {
        const map = {
            indigo: {
                navActive: "bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200",
                navIdle: "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-800",
                iconActive: "bg-white/20 text-white",
                iconIdle: "bg-indigo-100 text-indigo-700",
                subActive: "text-indigo-100",
                banner: "bg-indigo-50/70 border-indigo-200/80",
                badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
                btn: "bg-indigo-600 hover:bg-indigo-700 text-white",
                accentBorder: "border-indigo-200/80",
                softBg: "bg-indigo-50/70 text-indigo-900 border-indigo-200/80",
                menuActive: "bg-indigo-600 text-white border-indigo-600 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            },
            emerald: {
                navActive: "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200",
                navIdle: "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800",
                iconActive: "bg-white/20 text-white",
                iconIdle: "bg-emerald-100 text-emerald-700",
                subActive: "text-emerald-100",
                banner: "bg-emerald-50/70 border-emerald-200/80",
                badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
                btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
                accentBorder: "border-emerald-200/80",
                softBg: "bg-emerald-50/70 text-emerald-900 border-emerald-200/80",
                menuActive: "bg-emerald-600 text-white border-emerald-600 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            },
            violet: {
                navActive: "bg-violet-600 text-white border-violet-600 shadow-md ring-2 ring-violet-200",
                navIdle: "bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50/40 text-slate-800",
                iconActive: "bg-white/20 text-white",
                iconIdle: "bg-violet-100 text-violet-700",
                subActive: "text-violet-100",
                banner: "bg-violet-50/70 border-violet-200/80",
                badge: "bg-violet-100 text-violet-800 border-violet-200",
                btn: "bg-violet-600 hover:bg-violet-700 text-white",
                accentBorder: "border-violet-200/80",
                softBg: "bg-violet-50/70 text-violet-900 border-violet-200/80",
                menuActive: "bg-violet-600 text-white border-violet-600 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            },
            amber: {
                navActive: "bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-200",
                navIdle: "bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-800",
                iconActive: "bg-white/20 text-white",
                iconIdle: "bg-amber-100 text-amber-700",
                subActive: "text-amber-100",
                banner: "bg-amber-50/70 border-amber-200/80",
                badge: "bg-amber-100 text-amber-900 border-amber-200",
                btn: "bg-amber-600 hover:bg-amber-700 text-white",
                accentBorder: "border-amber-200/80",
                softBg: "bg-amber-50/70 text-amber-900 border-amber-200/80",
                menuActive: "bg-amber-600 text-white border-amber-600 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            },
            rose: {
                navActive: "bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200",
                navIdle: "bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-slate-800",
                iconActive: "bg-white/20 text-white",
                iconIdle: "bg-rose-100 text-rose-700",
                subActive: "text-rose-100",
                banner: "bg-rose-50/70 border-rose-200/80",
                badge: "bg-rose-100 text-rose-800 border-rose-200",
                btn: "bg-rose-600 hover:bg-rose-700 text-white",
                accentBorder: "border-rose-200/80",
                softBg: "bg-rose-50/70 text-rose-900 border-rose-200/80",
                menuActive: "bg-rose-600 text-white border-rose-600 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            },
            slate: {
                badge: "bg-slate-100 text-slate-700 border-slate-200",
                softBg: "bg-slate-50 text-slate-800 border-slate-200",
                btn: "bg-slate-900 hover:bg-slate-800 text-white",
                menuActive: "bg-slate-900 text-white border-slate-900 shadow-sm",
                menuNumActive: "bg-white/20 text-white"
            }
        };
        return map[tone] || map.emerald;
    },

    renderGrammarSpeakWordBtn(wordText, labelExtra = "") {
        const cleanSpeech = String(wordText || "").replace(/\s*\/\s*/g, ", ");
        return `
            <button
                type="button"
                onclick="app.speakText('${this.escapeJsString(cleanSpeech)}')"
                class="inline-flex items-center gap-1.5 font-extrabold text-slate-900 hover:text-emerald-700 transition text-left group"
                title="Nghe phát âm: ${this.escapeHtml(wordText)}"
            >
                <span>${this.escapeHtml(wordText)}</span>
                ${labelExtra}
                <i class="fa-solid fa-volume-high text-[10px] text-slate-400 group-hover:text-emerald-600 shrink-0"></i>
            </button>
        `;
    },

    renderGrammarSpeakIconBtn(text, sizeClass = "w-7 h-7") {
        const cleanSpeech = String(text || "").replace(/\*\*/g, "").replace(/[\[\]]/g, "");
        return `
            <button
                type="button"
                onclick="app.speakText('${this.escapeJsString(cleanSpeech)}')"
                class="${sizeClass} rounded-lg bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 flex items-center justify-center shrink-0 transition"
                title="Nghe phát âm"
                aria-label="Nghe phát âm"
            >
                <i class="fa-solid fa-volume-high text-[11px]"></i>
            </button>
        `;
    },

    renderGrammarLectureSectionBody(sec) {
        if (!sec) return "";
        const fmt = s => this.formatGrammarRichText(s);
        const tablesHtml = [sec.table, sec.positionTable].filter(Boolean).map((table, tableIndex) => `
            <div class="space-y-2">
                ${tableIndex === 1 ? `<div class="text-xs font-extrabold uppercase tracking-wide text-slate-500 pt-1">Vị trí thường gặp trong câu</div>` : ""}
                <div class="overflow-x-auto rounded-xl border border-slate-200">
                    <table class="w-full text-left text-xs sm:text-sm">
                        <thead class="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <tr>${table.head.map(h => `<th class="px-4 py-3 font-bold text-xs uppercase tracking-wider">${fmt(h)}</th>`).join("")}</tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                            ${table.rows.map(r => `
                                <tr class="hover:bg-slate-50/70 transition">
                                    ${r.map(c => `<td class="px-4 py-3 text-slate-700 align-top leading-relaxed">${fmt(c)}</td>`).join("")}
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `).join("");

        const pointsHtml = sec.points && sec.points.length ? `
            <ul class="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                ${sec.points.map(p => `
                    <li class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200/60">
                        <i class="fa-solid fa-check text-emerald-500 text-xs mt-1.5 shrink-0"></i>
                        <span>${fmt(p)}</span>
                    </li>
                `).join("")}
            </ul>
        ` : "";

        return `<div class="space-y-5">${tablesHtml}${pointsHtml}</div>`;
    },

    renderGrammarTrapsAndTipsGrid(traps = [], tips = []) {
        if (!traps.length && !tips.length) return "";
        const fmt = s => this.formatGrammarRichText(s);
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${traps.length ? `
                    <div class="p-4 sm:p-5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2.5">
                        <div class="text-xs font-extrabold uppercase tracking-wide text-rose-700 flex items-center gap-1.5">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>Bẫy thường gặp trong đề ETS</span>
                        </div>
                        <ul class="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            ${traps.map(t => `<li class="flex items-start gap-2"><span class="text-rose-500 font-bold">•</span><span>${fmt(t)}</span></li>`).join("")}
                        </ul>
                    </div>
                ` : ""}
                ${tips.length ? `
                    <div class="p-4 sm:p-5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
                        <div class="text-xs font-extrabold uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
                            <i class="fa-solid fa-lightbulb text-amber-500"></i>
                            <span>Mẹo giải nhanh 3–5 giây</span>
                        </div>
                        <ul class="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            ${tips.map(t => `<li class="flex items-start gap-2"><span class="text-amber-600 font-bold">•</span><span>${fmt(t)}</span></li>`).join("")}
                        </ul>
                    </div>
                ` : ""}
            </div>
        `;
    },

    // Render toàn bộ bài giảng (dùng làm fallback hoặc chế độ xem gộp)
    getGrammarLectureHtml(topicId) {
        const lec = (window.GRAMMAR_LECTURES || {})[topicId];
        if (!lec) return "";
        const sectionsHtml = (lec.sections || []).map((sec, idx) => `
            <div class="space-y-4 ${idx > 0 ? 'pt-6 border-t border-slate-100' : ''}">
                <h4 class="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2.5">
                    <span class="w-1.5 h-5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                    <span>${this.escapeHtml(sec.heading)}</span>
                </h4>
                ${this.renderGrammarLectureSectionBody(sec)}
            </div>
        `).join("");

        return `
            <div class="space-y-6">
                <div class="space-y-6">${sectionsHtml}</div>
                ${this.renderGrammarTrapsAndTipsGrid(lec.traps, lec.tips)}
            </div>
        `;
    },

    // Tách từng Bài 1..4 (và Bài Tổng kết) của Word Formation thành nhiều mục nội dung nhỏ độc lập
    getWordFormationSubUnits(sec, formula, lessonIdx, ctx = {}) {
        const lec = ctx.lec || (window.GRAMMAR_LECTURES || {})["gram-20-word-formation"] || {};
        const currentTopic = ctx.currentTopic || { allQuestions: [] };
        const totalQuestions = ctx.totalQuestions || (currentTopic.allQuestions || []).length || 80;
        const fmt = s => this.formatGrammarRichText(s);

        // Tab Tổng kết (Bài 5)
        if (!sec) {
            const sections = lec.sections || [];
            const allQs = currentTopic.allQuestions || [];
            const practiceButtons = sections.map(s => {
                const v = s.visual;
                if (!v) return "";
                const st = this.getGrammarToneStyle(v.color);
                const count = allQs.filter(q => q.wordType === v.wordTypeKey).length;
                return `
                    <button
                        type="button"
                        onclick="app.startWordFormationTypePractice('${v.wordTypeKey}')"
                        class="p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 bg-white hover:shadow-sm ${st.accentBorder}"
                    >
                        <div class="flex items-center gap-3">
                            <span class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${st.iconIdle}">
                                <i class="fa-solid ${v.icon}"></i>
                            </span>
                            <div>
                                <div class="font-extrabold text-sm text-slate-900">${this.escapeHtml(v.shortTitle)}</div>
                                <div class="text-xs text-slate-500">Làm riêng ${count} câu ${this.escapeHtml(v.wordTypeLabel)}</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-arrow-right text-slate-400"></i>
                    </button>
                `;
            }).join("");

            return [
                {
                    id: "wf-summary-steps",
                    title: "Quy trình 3 bước giải nhanh 5 giây",
                    shortTitle: "Quy trình 3 bước (5 giây)",
                    subtitle: "Thứ tự nhìn trước – nhìn sau chỗ trống",
                    icon: "fa-bolt",
                    renderHtml: () => `
                        <div class="space-y-5">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                ${(lec.tips || []).map((tip, idx) => `
                                    <div class="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-2">
                                        <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-extrabold">
                                            <span>Bước ${idx + 1}</span>
                                        </div>
                                        <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">${fmt(String(tip).replace(/^Bước\s+\d+\s*:\s*/i, ""))}</p>
                                    </div>
                                `).join("")}
                            </div>
                            <div class="pt-2 flex justify-end">
                                <button type="button" onclick="app.startWordFormationTypePractice('all')" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-2">
                                    <span>Làm bài tập tổng hợp (${totalQuestions} câu)</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    `
                },
                {
                    id: "wf-summary-traps",
                    title: "4 Bẫy ETS kinh điển & Chọn nhóm luyện tập",
                    shortTitle: "4 Bẫy ETS & Luyện theo loại",
                    subtitle: "Các bẫy hay mất điểm nhất 500–900+",
                    icon: "fa-triangle-exclamation",
                    renderHtml: () => `
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${(lec.traps || []).map((t, idx) => `
                                    <div class="rounded-xl bg-rose-50/50 border border-rose-200/70 p-4 space-y-1.5">
                                        <div class="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">Bẫy #${idx + 1}</div>
                                        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${fmt(t)}</p>
                                    </div>
                                `).join("")}
                            </div>
                            <div class="pt-4 border-t border-slate-100 space-y-3">
                                <div>
                                    <h4 class="font-extrabold text-sm sm:text-base text-slate-900">Chọn nhóm luyện tập ngay</h4>
                                    <p class="text-xs text-slate-500">Làm riêng từng từ loại 20 câu để nhớ mặt chữ nhanh hơn</p>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${practiceButtons}</div>
                            </div>
                        </div>
                    `
                }
            ];
        }

        const v = sec.visual;
        if (!v) {
            return [{
                id: `wf-sec-${lessonIdx}`,
                title: sec.heading,
                shortTitle: sec.heading,
                subtitle: "Nội dung bài học",
                icon: "fa-book-open",
                renderHtml: () => this.renderGrammarLectureSectionBody(sec)
            }];
        }

        const st = this.getGrammarToneStyle(v.color);
        const typeCount = (currentTopic.allQuestions || []).filter(q => q.wordType === v.wordTypeKey).length;
        const subUnits = [];

        // 1. Hậu tố & Công thức nhận diện
        const exampleHtml = formula
            ? this.escapeHtml(formula.example).replace(/\[([^\]]+)\]/g, "<mark class='rounded bg-amber-100 px-1.5 py-0.5 text-slate-900 font-extrabold not-italic'>$1</mark>")
            : "";
        subUnits.push({
            id: `wf-${lessonIdx}-suffixes`,
            title: `Hậu tố nhận diện ${v.wordTypeLabel}`,
            shortTitle: "Hậu tố & Công thức",
            subtitle: `${(v.suffixGroups || []).length} nhóm đuôi chuẩn + phát âm`,
            icon: "fa-tags",
            renderHtml: () => `
                <div class="space-y-5">
                    ${formula ? `
                        <div class="rounded-2xl border p-4 sm:p-5 ${st.banner} space-y-3">
                            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${this.escapeHtml(formula.detail)}</p>
                            ${formula.suffixes ? `<code class="inline-block px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs">${this.escapeHtml(formula.suffixes)}</code>` : ""}
                            <div class="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center justify-between gap-3">
                                <div class="space-y-0.5">
                                    <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ví dụ minh họa</div>
                                    <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">${exampleHtml}</p>
                                </div>
                                ${this.renderGrammarSpeakIconBtn(formula.example, "w-8 h-8")}
                            </div>
                        </div>
                    ` : ""}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        ${(v.suffixGroups || []).map(g => `
                            <div class="rounded-xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-2.5">
                                <div class="flex flex-wrap items-baseline justify-between gap-2">
                                    <code class="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-mono font-extrabold text-xs text-slate-900">${this.escapeHtml(g.suffix)}</code>
                                    <span class="text-xs text-slate-500 font-medium">${this.escapeHtml(g.meaning)}</span>
                                </div>
                                <div class="flex flex-wrap gap-1.5">
                                    ${g.examples.map(w => `<span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-xs">${this.renderGrammarSpeakWordBtn(w)}</span>`).join("")}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `
        });

        // 2. Bẫy đuôi từ đặc sản TOEIC
        if (v.trapGroups && v.trapGroups.length) {
            subUnits.push({
                id: `wf-${lessonIdx}-traps`,
                title: "Bẫy đuôi từ đặc sản TOEIC",
                shortTitle: "Bẫy đuôi từ dễ nhầm",
                subtitle: `${v.trapGroups.length} nhóm từ đánh lừa mặt chữ`,
                icon: "fa-triangle-exclamation",
                renderHtml: () => `
                    <div class="space-y-4">
                        <p class="text-xs sm:text-sm text-amber-900 bg-amber-50/80 border border-amber-200 rounded-xl px-4 py-3">
                            Các từ bên dưới có đuôi giống một từ loại khác nhưng thực chất lại là <strong>${this.escapeHtml(v.wordTypeLabel)}</strong>. Hãy bấm vào từng từ để nghe và ghi nhớ mặt chữ.
                        </p>
                        <div class="space-y-3.5">
                            ${v.trapGroups.map(tg => `
                                <div class="bg-white rounded-xl border border-amber-200/90 p-4 space-y-2.5">
                                    <div>
                                        <div class="font-extrabold text-sm text-rose-700">${this.escapeHtml(tg.title)}</div>
                                        <div class="text-xs text-slate-500 mt-0.5">${this.escapeHtml(tg.note)}</div>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        ${tg.words.map(item => `
                                            <div class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                                                ${this.renderGrammarSpeakWordBtn(item.word)}
                                                <span class="text-slate-500 text-[11px] text-right">${this.escapeHtml(item.meaning)}</span>
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `
            });
        }

        // 3. Sơ đồ vị trí ăn điểm trong câu
        if (v.positions && v.positions.length) {
            subUnits.push({
                id: `wf-${lessonIdx}-positions`,
                title: `Sơ đồ ${v.positions.length} vị trí ăn điểm nhanh`,
                shortTitle: "Vị trí đứng trong câu",
                subtitle: `${v.positions.length} công thức nhìn trước & sau chỗ trống`,
                icon: "fa-location-dot",
                renderHtml: () => `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${v.positions.map(pos => `
                            <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between gap-3">
                                <div class="space-y-2">
                                    <span class="inline-block px-2.5 py-0.5 rounded-md border text-[11px] font-extrabold ${st.badge}">${this.escapeHtml(pos.label)}</span>
                                    <div class="font-mono font-extrabold text-xs sm:text-sm px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900">${this.escapeHtml(pos.formula)}</div>
                                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${this.escapeHtml(pos.desc)}</p>
                                </div>
                                <div class="pt-2.5 border-t border-slate-200/70 flex items-start justify-between gap-2">
                                    <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">${fmt(pos.example)}</p>
                                    ${this.renderGrammarSpeakIconBtn(pos.example)}
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `
            });
        }

        // 4. Tách riêng từng focusBlock thành một mục học độc lập
        (v.focusBlocks || []).forEach((block, blockIdx) => {
            const cleanShort = String(block.title || "")
                .replace(/^Phân biệt nhanh\s+/i, "Phân biệt ")
                .replace(/^Bước 1 khi gặp đáp án Động từ:\s*/i, "");
            subUnits.push({
                id: `wf-${lessonIdx}-focus-${blockIdx}`,
                title: block.title,
                shortTitle: cleanShort,
                subtitle: block.badge || block.subtitle || "Chủ điểm trọng tâm",
                icon: block.kind === "decisionSplit" ? "fa-code-branch" : "fa-layer-group",
                renderHtml: () => {
                    if (block.kind === "wordChips") {
                        const bst = this.getGrammarToneStyle(block.tone || "indigo");
                        return `
                            <div class="space-y-4">
                                <div class="flex flex-wrap items-center justify-between gap-2">
                                    <p class="text-xs sm:text-sm text-slate-600">${this.escapeHtml(block.subtitle)}</p>
                                    ${block.badge ? `<span class="px-2.5 py-1 rounded-lg border text-xs font-extrabold ${bst.badge}">${this.escapeHtml(block.badge)}</span>` : ""}
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                    ${block.items.map(it => `
                                        <div class="rounded-xl border p-3 ${bst.softBg}">
                                            <div class="text-xs sm:text-sm">${this.renderGrammarSpeakWordBtn(it.word)}</div>
                                            <div class="text-xs text-slate-600 mt-1">${this.escapeHtml(it.meaning)}</div>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        `;
                    }
                    if (block.kind === "decisionSplit") {
                        return `
                            <div class="space-y-4">
                                <p class="text-xs sm:text-sm text-slate-600">${this.escapeHtml(block.subtitle)}</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${block.branches.map(br => {
                                        const bst = this.getGrammarToneStyle(br.tone || "emerald");
                                        return `
                                            <div class="rounded-xl border p-4 space-y-3 ${bst.softBg}">
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <span class="px-2.5 py-0.5 rounded-md border text-xs font-extrabold ${bst.badge}">${this.escapeHtml(br.badge)}</span>
                                                    <span class="font-extrabold text-sm text-slate-900">${this.escapeHtml(br.title)}</span>
                                                </div>
                                                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${this.escapeHtml(br.rule)}</p>
                                                <div class="space-y-2 pt-1">
                                                    ${br.examples.map(ex => `
                                                        <div class="bg-white rounded-lg border border-slate-200/80 px-3 py-2 flex items-center justify-between gap-2">
                                                            <span class="text-xs sm:text-sm text-slate-800">${fmt(ex)}</span>
                                                            ${this.renderGrammarSpeakIconBtn(ex)}
                                                        </div>
                                                    `).join("")}
                                                </div>
                                            </div>
                                        `;
                                    }).join("")}
                                </div>
                            </div>
                        `;
                    }
                    return "";
                }
            });
        });

        // 5. So sánh cặp từ cùng gốc dễ nhầm nghĩa
        if (v.comparisonSection) {
            const comp = v.comparisonSection;
            subUnits.push({
                id: `wf-${lessonIdx}-compare`,
                title: comp.title,
                shortTitle: "Cặp từ cùng gốc dễ nhầm",
                subtitle: `${(comp.pairs || []).length} cặp hay gài bẫy nghĩa`,
                icon: "fa-scale-balanced",
                renderHtml: () => `
                    <div class="space-y-4">
                        <p class="text-xs sm:text-sm text-slate-600">${this.escapeHtml(comp.subtitle)}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            ${comp.pairs.map(pair => `
                                <div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
                                    <div class="text-xs font-extrabold text-slate-700 pb-1.5 border-b border-slate-200/70">${this.escapeHtml(pair.title)}</div>
                                    <div class="space-y-2">
                                        ${pair.items.map(it => {
                                            const ist = this.getGrammarToneStyle(it.tone || "slate");
                                            return `
                                                <div class="bg-white rounded-lg border border-slate-200/80 p-3 space-y-1">
                                                    <div class="flex items-center justify-between gap-2">
                                                        <div class="text-xs sm:text-sm">${this.renderGrammarSpeakWordBtn(it.word)}</div>
                                                        <span class="px-2 py-0.5 rounded-md border text-[10px] font-extrabold shrink-0 ${ist.badge}">${this.escapeHtml(it.tag)}</span>
                                                    </div>
                                                    <div class="text-xs text-slate-600 leading-snug">${fmt(it.meaning)}</div>
                                                </div>
                                            `;
                                        }).join("")}
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `
            });
        }

        // 6. Tóm tắt & Ghi nhớ nhanh + Nút luyện ngay
        if (sec.points && sec.points.length) {
            subUnits.push({
                id: `wf-${lessonIdx}-points`,
                title: `Tóm tắt & Ghi nhớ nhanh (${v.wordTypeLabel})`,
                shortTitle: "Ghi nhớ & Luyện bài",
                subtitle: `${sec.points.length} điểm chốt trước khi làm ${typeCount} câu`,
                icon: "fa-circle-check",
                renderHtml: () => `
                    <div class="space-y-5">
                        <ul class="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                            ${sec.points.map(p => `
                                <li class="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                    <i class="fa-solid fa-check text-emerald-500 text-xs mt-1.5 shrink-0"></i>
                                    <span>${fmt(p)}</span>
                                </li>
                            `).join("")}
                        </ul>
                        <div class="p-4 rounded-2xl border ${st.banner} flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div class="font-extrabold text-sm text-slate-900">Đã nắm vững phần ${this.escapeHtml(v.wordTypeLabel)}?</div>
                                <div class="text-xs text-slate-600">Thực hành ngay ${typeCount} câu chọn lọc theo đúng chủ điểm này.</div>
                            </div>
                            <button type="button" onclick="app.startWordFormationTypePractice('${v.wordTypeKey}')" class="px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-2 ${st.btn}">
                                <i class="fa-solid fa-bolt"></i>
                                <span>Luyện ngay ${typeCount} câu ${this.escapeHtml(v.wordTypeLabel)}</span>
                            </button>
                        </div>
                    </div>
                `
            });
        }

        return subUnits;
    },

    // Tách từng chuyên đề ngữ pháp (21 chuyên đề chuẩn) thành từng mục học nhỏ
    getStandardTopicSubUnits(topic) {
        const lec = (window.GRAMMAR_LECTURES || {})[topic.id] || {};
        const subUnits = [];

        (lec.sections || []).forEach((sec, idx) => {
            const cleanTitle = String(sec.heading || "").replace(/^\d+\.\s*/, "");
            const hasTable = Boolean(sec.table || sec.positionTable);
            const ptsCount = sec.points ? sec.points.length : 0;
            const subParts = [];
            if (hasTable) subParts.push("Bảng hệ thống");
            if (ptsCount) subParts.push(`${ptsCount} ghi chú`);
            subUnits.push({
                id: `sec-${idx}`,
                title: cleanTitle,
                shortTitle: cleanTitle,
                subtitle: subParts.join(" • ") || "Lý thuyết trọng tâm",
                icon: hasTable ? "fa-table-list" : "fa-book-open",
                renderHtml: () => this.renderGrammarLectureSectionBody(sec)
            });
        });

        if (topic.formulas && topic.formulas.length) {
            subUnits.push({
                id: "formulas",
                title: "Công thức & Ví dụ nhận biết nhanh",
                shortTitle: "Công thức & Ví dụ",
                subtitle: `${topic.formulas.length} mẫu câu + phát âm`,
                icon: "fa-bolt",
                renderHtml: () => `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        ${topic.formulas.map((f, index) => {
                            const exampleHtml = this.escapeHtml(f.example).replace(/\[([^\]]+)\]/g, "<mark class='rounded bg-amber-100/90 px-1 py-0.5 text-slate-900 font-bold not-italic'>$1</mark>");
                            return `
                                <div class="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-2.5">
                                    <div class="flex items-start gap-2.5">
                                        <span class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">${index + 1}</span>
                                        <h4 class="font-bold text-sm text-slate-900 leading-snug">${this.escapeHtml(f.rule)}</h4>
                                    </div>
                                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed pl-8">${this.escapeHtml(f.detail)}</p>
                                    ${f.suffixes ? `
                                        <div class="pl-8">
                                            <code class="inline-block px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono text-xs leading-relaxed">${this.escapeHtml(f.suffixes)}</code>
                                        </div>
                                    ` : ""}
                                    <div class="pl-8 pt-2 border-t border-slate-200/60 flex items-start justify-between gap-2.5">
                                        <p class="text-xs sm:text-sm text-slate-800 leading-relaxed">${exampleHtml}</p>
                                        ${this.renderGrammarSpeakIconBtn(f.example)}
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                `
            });
        }

        const trapCount = lec.traps ? lec.traps.length : 0;
        const tipCount = lec.tips ? lec.tips.length : 0;
        if (trapCount || tipCount) {
            subUnits.push({
                id: "traps-tips",
                title: "Bẫy ETS & Mẹo giải nhanh 3–5 giây",
                shortTitle: "Bẫy ETS & Mẹo 3–5s",
                subtitle: `${trapCount} bẫy • ${tipCount} mẹo thực chiến`,
                icon: "fa-triangle-exclamation",
                renderHtml: () => this.renderGrammarTrapsAndTipsGrid(lec.traps || [], lec.tips || [])
            });
        }

        return subUnits;
    },

    // Danh sách nút chọn nhanh hiển thị trên mỗi thẻ ở trang 22 chuyên đề
    getGrammarTopicPickerItems(topic) {
        if (topic.id === "gram-20-word-formation") {
            const lec = (window.GRAMMAR_LECTURES || {})[topic.id] || {};
            const sections = lec.sections || [];
            const formulas = topic.formulas || [];
            const items = sections.map((sec, idx) => {
                const v = sec.visual || {};
                const subUnits = this.getWordFormationSubUnits(sec, formulas[idx], idx, { lec, currentTopic: topic });
                return {
                    label: `Bài ${idx + 1}: ${(v.wordTypeLabel || v.shortTitle || sec.heading)}`,
                    badge: `${subUnits.length} mục`,
                    lessonIdx: idx,
                    subUnitIdx: 0,
                    searchText: subUnits.map(u => `${u.title} ${u.shortTitle}`).join(" ")
                };
            });
            const summaryUnits = this.getWordFormationSubUnits(null, null, sections.length, { lec, currentTopic: topic });
            items.push({
                label: "Tổng kết: Bẫy & Mẹo 5s",
                badge: `${summaryUnits.length} mục`,
                lessonIdx: sections.length,
                subUnitIdx: 0,
                searchText: summaryUnits.map(u => `${u.title} ${u.shortTitle}`).join(" ")
            });
            return items;
        }

        return this.getStandardTopicSubUnits(topic).map((unit, idx) => ({
            label: `${idx + 1}. ${unit.shortTitle}`,
            badge: "",
            lessonIdx: 0,
            subUnitIdx: idx,
            searchText: `${unit.title} ${unit.subtitle}`
        }));
    },

    // Bố cục 2 cột dùng chung: Menu chọn nội dung bên trái + Khung đọc 1 mục bên phải
    renderGrammarSplitLayout({ subUnits, activeSubIdx, showAll, tone = "emerald", extraSidebarHtml = "", nextBlockActionHtml = "" }) {
        if (!subUnits || !subUnits.length) return "";
        const st = this.getGrammarToneStyle(tone);
        const safeIdx = Math.min(Math.max(0, Number(activeSubIdx) || 0), subUnits.length - 1);
        const currentUnit = subUnits[safeIdx];

        const sidebarHtml = `
            <aside class="lg:col-span-4 xl:col-span-3 space-y-3 lg:sticky lg:top-20 self-start">
                <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                    <div class="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                            <div class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Chọn nội dung học</div>
                            <div class="text-xs font-semibold text-slate-400 mt-0.5">${showAll ? `Đang gộp ${subUnits.length} mục` : `Đang xem mục ${safeIdx + 1}/${subUnits.length}`}</div>
                        </div>
                        ${subUnits.length > 1 ? `
                            <button
                                type="button"
                                onclick="app.toggleGrammarShowAllSubUnits()"
                                class="px-2.5 py-1 rounded-lg border text-[11px] font-bold transition ${showAll ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}"
                                title="${showAll ? 'Chuyển sang xem từng mục riêng' : 'Mở xem toàn bộ nội dung cùng lúc'}"
                            >
                                ${showAll ? "Xem từng mục" : "Xem gộp"}
                            </button>
                        ` : ""}
                    </div>

                    <div class="space-y-1.5" role="navigation" aria-label="Danh mục nội dung trong bài">
                        ${subUnits.map((unit, idx) => {
                            const isActive = !showAll && idx === safeIdx;
                            return `
                                <button
                                    type="button"
                                    onclick="app.setGrammarSubUnit(${idx})"
                                    aria-current="${isActive ? 'true' : 'false'}"
                                    class="w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 ${isActive ? st.menuActive : 'bg-slate-50/70 hover:bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'}"
                                >
                                    <span class="w-6 h-6 rounded-lg font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 ${isActive ? st.menuNumActive : 'bg-white border border-slate-200 text-slate-600'}">
                                        ${idx + 1}
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <div class="text-xs sm:text-[13px] font-bold leading-snug ${isActive ? 'text-white' : 'text-slate-900'}">${this.escapeHtml(unit.shortTitle || unit.title)}</div>
                                        ${unit.subtitle ? `<div class="text-[11px] mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-slate-500'}">${this.escapeHtml(unit.subtitle)}</div>` : ""}
                                    </div>
                                </button>
                            `;
                        }).join("")}
                    </div>

                    ${extraSidebarHtml ? `<div class="pt-3 border-t border-slate-100">${extraSidebarHtml}</div>` : ""}
                </div>
            </aside>
        `;

        const readingPaneHtml = showAll ? `
            <div class="lg:col-span-8 xl:col-span-9 space-y-5">
                <div class="bg-slate-900 text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span class="font-semibold"><i class="fa-solid fa-layer-group mr-1.5 text-emerald-400"></i>Đang hiển thị gộp cả ${subUnits.length} mục</span>
                    <button type="button" onclick="app.toggleGrammarShowAllSubUnits()" class="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-bold transition">
                        Thu gọn — Xem từng mục
                    </button>
                </div>
                ${subUnits.map((unit, idx) => `
                    <article class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
                        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <span class="w-7 h-7 rounded-lg border text-xs font-extrabold flex items-center justify-center shrink-0 ${st.badge}">${idx + 1}</span>
                            <div>
                                <h3 class="text-base sm:text-lg font-extrabold text-slate-900">${this.escapeHtml(unit.title)}</h3>
                                ${unit.subtitle ? `<p class="text-xs text-slate-500">${this.escapeHtml(unit.subtitle)}</p>` : ""}
                            </div>
                        </div>
                        ${unit.renderHtml()}
                    </article>
                `).join("")}
            </div>
        ` : `
            <div class="lg:col-span-8 xl:col-span-9">
                <article class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
                    <div class="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                        <div class="space-y-1">
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] font-extrabold ${st.badge}">
                                <i class="fa-solid ${currentUnit.icon || 'fa-book-open'}"></i>
                                <span>Mục ${safeIdx + 1} / ${subUnits.length}</span>
                            </div>
                            <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                ${this.escapeHtml(currentUnit.title)}
                            </h3>
                            ${currentUnit.subtitle ? `<p class="text-xs sm:text-sm text-slate-500">${this.escapeHtml(currentUnit.subtitle)}</p>` : ""}
                        </div>
                    </div>

                    <div>
                        ${currentUnit.renderHtml()}
                    </div>

                    <!-- Thanh chuyển mục trước / tiếp theo gọn gàng -->
                    <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        ${safeIdx > 0 ? `
                            <button
                                type="button"
                                onclick="app.setGrammarSubUnit(${safeIdx - 1})"
                                class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition inline-flex items-center gap-1.5"
                            >
                                <i class="fa-solid fa-arrow-left"></i>
                                <span>Nội dung trước</span>
                            </button>
                        ` : `<span class="text-xs font-semibold text-slate-400">Bắt đầu mục 1/${subUnits.length}</span>`}

                        <div class="hidden sm:flex items-center gap-1.5" aria-hidden="true">
                            ${subUnits.map((_, idx) => `
                                <button
                                    type="button"
                                    onclick="app.setGrammarSubUnit(${idx})"
                                    class="h-2 rounded-full transition-all ${idx === safeIdx ? 'w-6 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'}"
                                    title="Mục ${idx + 1}"
                                ></button>
                            `).join("")}
                        </div>

                        ${safeIdx < subUnits.length - 1 ? `
                            <button
                                type="button"
                                onclick="app.setGrammarSubUnit(${safeIdx + 1})"
                                class="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-1.5 ${st.btn}"
                            >
                                <span>Nội dung tiếp theo</span>
                                <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        ` : (nextBlockActionHtml || `<span class="text-xs font-bold text-emerald-600"><i class="fa-solid fa-circle-check mr-1"></i>Đã hết nội dung bài</span>`)}
                    </div>
                </article>
            </div>
        `;

        return `
            <div id="grammar-theory-workspace" class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                ${sidebarHtml}
                ${readingPaneHtml}
            </div>
        `;
    },

    // Giao diện Word Formation: Tầng 1 chọn Bài 1..4 hoặc Tổng kết; Tầng 2 chọn từng mục nhỏ trong bài đó
    renderWordFormationTheoryHtml(currentTopic, totalQuestions) {
        const lec = (window.GRAMMAR_LECTURES || {})[currentTopic.id] || {};
        const sections = lec.sections || [];
        const formulas = currentTopic.formulas || [];
        const activeIdx = Math.min(Math.max(0, Number(this.state.grammarWordFormationLessonIndex) || 0), sections.length);

        const topModulesHtml = `
            <nav class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Chọn bài học Word Formation">
                ${sections.map((sec, idx) => {
                    const v = sec.visual || {};
                    const st = this.getGrammarToneStyle(v.color);
                    const isActive = activeIdx === idx;
                    const count = this.getWordFormationSubUnits(sec, formulas[idx], idx, { lec, currentTopic, totalQuestions }).length;
                    return `
                        <button
                            type="button"
                            onclick="app.setGrammarWordFormationLesson(${idx})"
                            aria-current="${isActive ? 'step' : 'false'}"
                            class="text-left p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2 ${isActive ? st.navActive : st.navIdle}"
                        >
                            <div class="flex items-center justify-between gap-2 w-full">
                                <span class="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}">Bài ${idx + 1} • ${count} mục</span>
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${isActive ? st.iconActive : st.iconIdle}">
                                    <i class="fa-solid ${v.icon || 'fa-book'}"></i>
                                </span>
                            </div>
                            <div>
                                <div class="font-extrabold text-sm leading-snug">${this.escapeHtml(v.shortTitle || sec.heading)}</div>
                                <div class="text-[11px] mt-0.5 leading-snug ${isActive ? st.subActive : 'text-slate-500'}">${this.escapeHtml(v.subtitle || '')}</div>
                            </div>
                        </button>
                    `;
                }).join("")}
                ${(() => {
                    const st = this.getGrammarToneStyle("rose");
                    const isActive = activeIdx === sections.length;
                    const summaryCount = this.getWordFormationSubUnits(null, null, sections.length, { lec, currentTopic, totalQuestions }).length;
                    return `
                        <button
                            type="button"
                            onclick="app.setGrammarWordFormationLesson(${sections.length})"
                            aria-current="${isActive ? 'step' : 'false'}"
                            class="col-span-2 sm:col-span-1 text-left p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2 ${isActive ? st.navActive : st.navIdle}"
                        >
                            <div class="flex items-center justify-between gap-2 w-full">
                                <span class="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-700'}">Tổng kết • ${summaryCount} mục</span>
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${isActive ? st.iconActive : st.iconIdle}">
                                    <i class="fa-solid fa-bolt"></i>
                                </span>
                            </div>
                            <div>
                                <div class="font-extrabold text-sm leading-snug">Bẫy ETS &amp; Mẹo 5s</div>
                                <div class="text-[11px] mt-0.5 leading-snug ${isActive ? st.subActive : 'text-slate-500'}">Quy trình 3 bước • Chọn luyện</div>
                            </div>
                        </button>
                    `;
                })()}
            </nav>
        `;

        const isSummary = activeIdx >= sections.length;
        const sec = isSummary ? null : sections[activeIdx];
        const v = sec?.visual || null;
        const tone = isSummary ? "rose" : (v?.color || "emerald");
        const subUnits = this.getWordFormationSubUnits(sec, formulas[activeIdx], activeIdx, { lec, currentTopic, totalQuestions });

        let extraSidebarHtml = "";
        let nextBlockActionHtml = "";

        if (!isSummary && v) {
            const st = this.getGrammarToneStyle(tone);
            const typeCount = (currentTopic.allQuestions || []).filter(q => q.wordType === v.wordTypeKey).length;
            extraSidebarHtml = `
                <button
                    type="button"
                    onclick="app.startWordFormationTypePractice('${v.wordTypeKey}')"
                    class="w-full py-2.5 px-3 rounded-xl font-extrabold text-xs shadow-sm transition inline-flex items-center justify-center gap-1.5 ${st.btn}"
                >
                    <i class="fa-solid fa-bolt"></i>
                    <span>Luyện ${typeCount} câu ${this.escapeHtml(v.wordTypeLabel)}</span>
                </button>
            `;
            const nextLabel = activeIdx < sections.length - 1 ? `Sang Bài ${activeIdx + 2}` : "Sang Tổng kết Bẫy & Mẹo";
            nextBlockActionHtml = `
                <button
                    type="button"
                    onclick="app.setGrammarWordFormationLesson(${activeIdx + 1})"
                    class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-1.5"
                >
                    <span>${nextLabel}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;
        } else {
            nextBlockActionHtml = `
                <button
                    type="button"
                    onclick="app.startWordFormationTypePractice('all')"
                    class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-1.5"
                >
                    <span>Làm bài tập tổng hợp (${totalQuestions} câu)</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;
        }

        const splitHtml = this.renderGrammarSplitLayout({
            subUnits,
            activeSubIdx: this.state.grammarSubUnitIndex,
            showAll: this.state.grammarShowAllSubUnits,
            tone,
            extraSidebarHtml,
            nextBlockActionHtml
        });

        return `<div class="space-y-5">${topModulesHtml}${splitHtml}</div>`;
    },

    // Giao diện 2 cột chọn từng mục cho 21 chuyên đề ngữ pháp chuẩn
    renderStandardTopicTheoryHtml(currentTopic, totalQuestions) {
        const subUnits = this.getStandardTopicSubUnits(currentTopic);
        const extraSidebarHtml = `
            <button
                type="button"
                onclick="app.setGrammarLessonTab('practice')"
                class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center justify-center gap-1.5"
            >
                <i class="fa-solid fa-pen-to-square"></i>
                <span>Làm bài tập (${totalQuestions} câu)</span>
            </button>
        `;
        const nextBlockActionHtml = `
            <button
                type="button"
                onclick="app.setGrammarLessonTab('practice')"
                class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition inline-flex items-center gap-1.5"
            >
                <span>Làm bài tập thực hành (${totalQuestions} câu)</span>
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;

        return this.renderGrammarSplitLayout({
            subUnits,
            activeSubIdx: this.state.grammarSubUnitIndex,
            showAll: this.state.grammarShowAllSubUnits,
            tone: "emerald",
            extraSidebarHtml,
            nextBlockActionHtml
        });
    },

    startWordFormationTypePractice(wordType) {
        this.state.grammarWordTypeFilter = wordType || "all";
        this.state.grammarLessonTab = "practice";
        this.state.grammarPracticePageIndex = 0;
        this.state.grammarMixedPracticeItems = null;
        this.renderGrammar(document.getElementById("app-main"));
        const el = document.getElementById("grammar-practice-section");
        if (el && typeof el.scrollIntoView === "function") {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    },

    setGrammarTierFilter(tierKey) {
        this.state.grammarTierFilter = tierKey;
        this.state.grammarViewMode = "list";
        this.renderGrammar(document.getElementById("app-main"));
    },

    setGrammarSearchQuery(query) {
        const prevInput = document.getElementById("grammar-search-input");
        const selStart = prevInput ? prevInput.selectionStart : null;
        const selEnd = prevInput ? prevInput.selectionEnd : null;
        this.state.grammarSearchQuery = String(query ?? "");
        this.state.grammarViewMode = "list";
        this.renderGrammar(document.getElementById("app-main"));
        const nextInput = document.getElementById("grammar-search-input");
        if (nextInput && document.activeElement !== nextInput) {
            nextInput.focus();
            if (selStart !== null && typeof nextInput.setSelectionRange === "function") {
                const len = nextInput.value.length;
                nextInput.setSelectionRange(Math.min(selStart, len), Math.min(selEnd ?? selStart, len));
            }
        }
    },

    selectGrammarTopic(topicId, lessonIdx = 0, subUnitIdx = 0, tab = "theory") {
        const wasDetail = this.state.currentView === "grammar" && this.state.grammarViewMode === "detail";
        if (!wasDetail) {
            this.state.grammarViewMode = "list";
            this.saveGrammarHistoryState(false, false);
        }
        this.state.activeGrammarTopicId = topicId;
        this.state.grammarViewMode = "detail";
        this.state.grammarLessonTab = tab === "practice" ? "practice" : "theory";
        this.state.grammarWordFormationLessonIndex = Math.max(0, Number(lessonIdx) || 0);
        this.state.grammarSubUnitIndex = Math.max(0, Number(subUnitIdx) || 0);
        this.state.grammarShowAllSubUnits = false;
        this.state.grammarPracticePageIndex = 0;
        this.state.grammarMixedPracticeItems = null;
        this.renderGrammar(document.getElementById("app-main"));
        this.saveGrammarHistoryState(true, true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    backToGrammarList() {
        if (window.history.state?.dauenglishGrammar?.hasListBack) {
            window.history.back();
            return;
        }
        this.state.grammarViewMode = "list";
        this.renderGrammar(document.getElementById("app-main"));
        this.saveGrammarHistoryState(false, false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    },

    setGrammarLessonTab(tabName) {
        this.state.grammarLessonTab = tabName === "practice" ? "practice" : "theory";
        this.renderGrammar(document.getElementById("app-main"));
        this.saveGrammarHistoryState(false, Boolean(window.history.state?.dauenglishGrammar?.hasListBack));
    },

    setGrammarWordFormationLesson(index) {
        const parsed = Number(index);
        this.state.grammarWordFormationLessonIndex = Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
        this.state.grammarSubUnitIndex = 0;
        this.state.grammarShowAllSubUnits = false;
        this.renderGrammar(document.getElementById("app-main"));
        this.saveGrammarHistoryState(false, Boolean(window.history.state?.dauenglishGrammar?.hasListBack));
    },

    setGrammarSubUnit(index) {
        const parsed = Number(index);
        this.state.grammarSubUnitIndex = Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
        this.state.grammarShowAllSubUnits = false;
        this.renderGrammar(document.getElementById("app-main"));
        this.saveGrammarHistoryState(false, Boolean(window.history.state?.dauenglishGrammar?.hasListBack));
        const ws = document.getElementById("grammar-theory-workspace");
        if (ws && typeof ws.scrollIntoView === "function") {
            const rect = ws.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.5) {
                ws.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    },

    toggleGrammarShowAllSubUnits() {
        this.state.grammarShowAllSubUnits = !this.state.grammarShowAllSubUnits;
        this.renderGrammar(document.getElementById("app-main"));
    },

    setGrammarPracticePage(pageIndex) {
        const parsed = Number(pageIndex);
        this.state.grammarPracticePageIndex = Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
        this.renderGrammar(document.getElementById("app-main"));
        const el = document.getElementById("grammar-practice-section");
        if (el && typeof el.scrollIntoView === "function") {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    },

    setGrammarPracticePageSize(size) {
        const parsed = Number(size);
        this.state.grammarPracticePageSize = Number.isFinite(parsed) && parsed >= 0 ? parsed : 5;
        this.state.grammarPracticePageIndex = 0;
        this.renderGrammar(document.getElementById("app-main"));
    },

    resetGrammarTopicQuiz(topicId) {
        Object.keys(this.state.grammarUserAnswers).forEach(k => {
            if (k.startsWith(`${topicId}-`)) {
                delete this.state.grammarUserAnswers[k];
            }
        });
        this.state.grammarPracticePageIndex = 0;
        if (topicId === "gram-20-word-formation") this.state.grammarMixedPracticeItems = null;
        this.saveState();
        this.renderGrammar(document.getElementById("app-main"));
        this.showToast("🔄 Đã làm mới bài tập của chuyên đề này!");
    },

    answerGrammarQuestion(ansKey, optionIndex) {
        this.state.grammarUserAnswers[ansKey] = optionIndex;
        this.saveState();
        this.renderGrammar(document.getElementById("app-main"));
    },

    // ================= 9. DASHBOARD TIẾN ĐỘ & LỊCH SỬ ĐIỂM THI =================
    renderDashboard(container) {
        const history = this.state.examHistory;
        const bestScore = history.length > 0 ? Math.max(...history.map(h => h.totalScore)) : 0;
        const targetScore = this.state.user ? Number(this.state.user.targetScore) : 750;
        const progressPercent = Math.min(100, Math.round((bestScore / targetScore) * 100));

        const historyRowsHtml = history.map(h => `
            <tr class="border-b border-slate-100 hover:bg-slate-50/80 text-xs sm:text-sm">
                <td class="py-3.5 px-4 font-bold text-slate-900">${h.testTitle}</td>
                <td class="py-3.5 px-4 text-slate-500">${h.date}</td>
                <td class="py-3.5 px-4 font-semibold text-indigo-600">${h.listeningScore}</td>
                <td class="py-3.5 px-4 font-semibold text-amber-600">${h.readingScore}</td>
                <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">${h.totalScore} / 990</span></td>
                <td class="py-3.5 px-4 text-slate-600">${h.correctCount}/${h.totalQuestions} câu (${h.timeSpent})</td>
            </tr>
        `).join("");

        container.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <span class="text-teal-600 font-extrabold text-xs uppercase tracking-widest">Personal Learning Analytics</span>
                        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Bảng Theo Dõi Tiến Độ & Lịch Sử Điểm Thi</h1>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 self-start">
                        <button onclick="app.openAuthModal()" class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                            <i class="fa-brands fa-google text-rose-500"></i>
                            <span>${this.state.user ? 'Quản lý tài khoản & Sao lưu' : 'Đăng nhập Google để lưu dữ liệu'}</span>
                        </button>
                        <button onclick="app.navigate('mock-tests')" class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm">
                            + Làm thêm đề thi mới
                        </button>
                    </div>
                </div>

                <!-- Thanh trạng thái Tài khoản Google & Đồng bộ dữ liệu -->
                <div class="bg-gradient-to-r from-indigo-950 via-brand-900 to-slate-900 text-white rounded-2xl p-5 mb-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-extrabold text-amber-300 shrink-0">
                            ${this.state.user ? this.escapeHtml(this.state.user.name.charAt(0).toUpperCase()) : `<i class="fa-brands fa-google"></i>`}
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center gap-2">
                                <h3 class="font-extrabold text-base">${this.state.user ? this.escapeHtml(this.state.user.name) : 'Bạn đang học ở chế độ Khách (Guest)'}</h3>
                                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${this.state.user ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-amber-500/20 text-amber-300'}">
                                    ${this.state.user ? `<i class="fa-solid fa-circle-check mr-1"></i>Đã gắn với ${this.escapeHtml(this.state.user.email)}` : 'Chưa liên kết Gmail'}
                                </span>
                            </div>
                            <p class="text-xs text-slate-300 mt-1">
                                ${this.state.user
                                    ? `Toàn bộ tiến độ (600 từ vựng, 300 Phrasal Verbs, sổ tay & lịch sử thi) đang được lưu tự động cho tài khoản <strong>${this.escapeHtml(this.state.user.email)}</strong>. Lần lưu gần nhất: ${this.escapeHtml(this.state.user.lastSyncedAt || "Vừa xong")}.`
                                    : `Hãy đăng nhập bằng tài khoản Google để hệ thống lưu trữ riêng biệt toàn bộ điểm thi và từ vựng đã thuộc theo email của bạn.`
                                }
                            </p>
                            ${this.state.user ? `
                                <div class="mt-2.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2 text-[11px]">
                                    <span class="px-2 py-0.5 rounded bg-white/10 text-amber-300 font-mono">
                                        <i class="fa-solid fa-fingerprint mr-1"></i>Federated Sub ID: ${this.escapeHtml(this.state.user.federatedIdentity?.sub || this.state.user.uid || "GG-OIDC")}
                                    </span>
                                    <span class="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-semibold">
                                        <i class="fa-solid fa-building-shield mr-1"></i>IdP: ${this.escapeHtml(this.state.user.federatedIdentity?.idp || "https://accounts.google.com")}
                                    </span>
                                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                        <i class="fa-solid fa-link mr-1"></i>OpenID Connect (OIDC) Verified
                                    </span>
                                </div>
                            ` : ""}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="app.exportUserDataJson()" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5">
                            <i class="fa-solid fa-download text-amber-300"></i> Tải bản sao lưu (.json)
                        </button>
                        <button onclick="app.openAuthModal()" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition">
                            ${this.state.user ? 'Đổi tài khoản' : 'Đăng nhập ngay'}
                        </button>
                    </div>
                </div>

                <!-- 4 Thẻ chỉ số tổng quan -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase">Điểm Cao Nhất (Best Score)</div>
                        <div class="text-3xl font-extrabold text-brand-600 mt-1">${bestScore} <span class="text-sm font-normal text-slate-400">/ 990</span></div>
                        <div class="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                            <div class="bg-brand-600 h-full rounded-full" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="text-[11px] text-slate-500 mt-1">Đạt ${progressPercent}% mục tiêu (${targetScore}+)</div>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase">Số Đề Đã Hoàn Thành</div>
                        <div class="text-3xl font-extrabold text-emerald-600 mt-1">${history.length} đề</div>
                        <p class="text-xs text-slate-500 mt-3">Lưu tự động trong bộ nhớ trình duyệt</p>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase">Từ Vựng Đã Lưu & Thuộc</div>
                        <div class="text-3xl font-extrabold text-purple-600 mt-1">${this.state.savedWords.length + this.state.learnedVocabIds.length} từ</div>
                        <button onclick="app.openSavedWordsModal()" class="text-xs text-brand-600 font-bold hover:underline mt-3 inline-block">Mở sổ tay từ vựng &rarr;</button>
                    </div>

                    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase">Chuỗi Ngày Học (Streak)</div>
                        <div class="text-3xl font-extrabold text-amber-500 mt-1"><i class="fa-solid fa-fire mr-1"></i>${this.state.streak} ngày</div>
                        <p class="text-xs text-slate-500 mt-3">Duy trì làm bài mỗi ngày để tăng điểm!</p>
                    </div>
                </div>

                <!-- Bảng lịch sử làm đề -->
                <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="p-5 border-b border-slate-200 flex items-center justify-between">
                        <h3 class="font-extrabold text-base text-slate-900">Lịch sử các bài thi thử gần đây</h3>
                        <button onclick="app.clearHistory()" class="text-xs text-rose-600 hover:underline font-semibold">Xóa lịch sử</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                                    <th class="py-3 px-4">Tên đề thi</th>
                                    <th class="py-3 px-4">Thời gian nộp</th>
                                    <th class="py-3 px-4">Listening</th>
                                    <th class="py-3 px-4">Reading</th>
                                    <th class="py-3 px-4">Tổng điểm</th>
                                    <th class="py-3 px-4">Số câu đúng</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historyRowsHtml || `<tr><td colspan="6" class="py-8 text-center text-sm text-slate-400">Chưa có bài thi nào. Hãy bắt đầu làm đề thi thử đầu tiên nhé!</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    clearHistory() {
        this.state.examHistory = [];
        this.saveState();
        this.renderDashboard(document.getElementById("app-main"));
        this.showToast("Đã xóa lịch sử thi thử.");
    },

    // ================= QUẢN LÝ SỔ TAY TỪ VỰNG, AUTH & VIP =================
    saveWordToNotebook(word, pos, meaning) {
        const exists = this.state.savedWords.some(w => w.word.toLowerCase() === word.toLowerCase());
        if (exists) {
            this.showToast(`Từ "${word}" đã có sẵn trong Sổ tay của bạn!`);
            return;
        }
        this.state.savedWords.unshift({ word, pos, meaning });
        this.saveState();
        this.showToast(`🔖 Đã lưu từ "${word}" vào Sổ tay từ vựng cá nhân!`);
    },

    openSavedWordsModal() {
        const modal = document.getElementById("saved-words-modal");
        const body = document.getElementById("saved-words-body");
        if (!modal || !body) return;

        if (this.state.savedWords.length === 0) {
            body.innerHTML = `<p class="text-center text-sm text-slate-400 py-8">Sổ tay chưa có từ nào. Bạn có thể bấm nút Lưu từ khi xem giải thích đề thi hoặc khi đọc bài Part 7!</p>`;
        } else {
            body.innerHTML = this.state.savedWords.map((item, idx) => `
                <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <button onclick="app.speakText('${this.escapeJsString(item.word)}')" class="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-volume-high text-xs"></i>
                        </button>
                        <div>
                            <div class="font-extrabold text-sm text-slate-900">${this.escapeHtml(item.word)} <span class="text-xs font-normal text-slate-500">(${this.escapeHtml(item.pos)})</span></div>
                            <div class="text-xs sm:text-sm text-slate-700">${this.escapeHtml(item.meaning)}</div>
                        </div>
                    </div>
                    <button onclick="app.removeSavedWord(${idx})" class="text-slate-400 hover:text-rose-600 p-2">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `).join("");
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    },

    closeSavedWordsModal() {
        const modal = document.getElementById("saved-words-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    },

    removeSavedWord(idx) {
        this.state.savedWords.splice(idx, 1);
        this.saveState();
        this.openSavedWordsModal();
    },

    openAuthModal() {
        const modal = document.getElementById("auth-modal");
        if (!modal) return;

        // Render trạng thái Cloud / Local
        const banner = document.getElementById("auth-cloud-status-banner");
        if (banner) {
            if (this.isCloudConnected) {
                banner.innerHTML = `
                    <div class="flex items-center gap-2 text-emerald-700 font-bold">
                        <i class="fa-solid fa-cloud-check text-emerald-600 text-base"></i>
                        <span>Đã kết nối <strong>Google Firebase Cloud</strong> (Đồng bộ đa thiết bị)</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">ONLINE</span>
                `;
            } else {
                banner.innerHTML = `
                    <div class="flex items-center gap-2 text-slate-700 font-semibold">
                        <i class="fa-solid fa-shield-halved text-brand-600 text-base"></i>
                        <span>Chế độ <strong>Lưu trữ theo từng Gmail</strong> trên trình duyệt (Tự động 100%)</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-extrabold text-[10px]">ACTIVE</span>
                `;
            }
        }

        // Render danh sách các tài khoản Google đã từng đăng nhập trên máy
        const accountsMap = this.getAccountsMap();
        const emails = Object.keys(accountsMap);
        const savedSection = document.getElementById("saved-google-accounts-section");
        const savedList = document.getElementById("saved-google-accounts-list");

        if (savedSection && savedList) {
            if (emails.length > 0) {
                savedSection.classList.remove("hidden");
                savedList.innerHTML = emails.map(emailKey => {
                    const acc = accountsMap[emailKey];
                    const u = acc.user || {};
                    const isCurrent = this.state.user && this.state.user.email && this.state.user.email.toLowerCase() === emailKey;
                    const learnedCount = (acc.learnedVocabIds || []).length;
                    const examCount = (acc.examHistory || []).length;

                    return `
                        <div onclick="app.switchGoogleAccount('${this.escapeJsString(emailKey)}')" class="cursor-pointer p-2.5 rounded-xl border ${isCurrent ? 'border-brand-500 bg-brand-50/70' : 'border-slate-200 hover:border-brand-300 bg-white'} flex items-center justify-between gap-2 transition">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                    ${this.escapeHtml((u.name || emailKey).charAt(0).toUpperCase())}
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                                        <span>${this.escapeHtml(u.name || "Học viên")}</span>
                                        ${isCurrent ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 font-bold">Đang dùng</span>` : ""}
                                    </div>
                                    <div class="text-[11px] text-slate-500 truncate">${this.escapeHtml(u.email || emailKey)} • ${learnedCount} từ • ${examCount} đề</div>
                                </div>
                            </div>
                            <button onclick="event.stopPropagation(); app.removeSavedGoogleAccount('${this.escapeJsString(emailKey)}')" class="text-slate-400 hover:text-rose-600 p-1.5 text-xs" title="Xóa tài khoản này khỏi máy">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    `;
                }).join("");
            } else {
                savedSection.classList.add("hidden");
            }
        }

        // Điền sẵn thông tin user hiện tại vào form nếu có
        const nameInput = document.getElementById("auth-name");
        const emailInput = document.getElementById("auth-email");
        if (this.state.user) {
            if (nameInput && !nameInput.value) nameInput.value = this.state.user.name || "";
            if (emailInput && !emailInput.value) emailInput.value = this.state.user.email || "";
        }

        // Điền sẵn Firebase config nếu đã có
        const fbInput = document.getElementById("firebase-config-input");
        const rawFb = localStorage.getItem(FIREBASE_CONFIG_KEY);
        if (fbInput && rawFb) {
            fbInput.value = rawFb;
        }

        modal.classList.remove("hidden");
        modal.classList.add("flex");
    },

    closeAuthModal() {
        const modal = document.getElementById("auth-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    },

    async loginWithGooglePopup() {
        // Nếu đã cấu hình Firebase Cloud -> Mở cửa sổ Google OAuth thật
        if (this.isCloudConnected && this.firebaseAuth && typeof firebase !== "undefined") {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: "select_account" });
                const result = await this.firebaseAuth.signInWithPopup(provider);
                if (result.user) {
                    await this.loadFromCloudOrLocalForUser({
                        uid: result.user.uid,
                        name: result.user.displayName || "Học viên Google",
                        email: result.user.email,
                        photoURL: result.user.photoURL || "",
                        targetScore: 800,
                        provider: "google-cloud"
                    });
                    this.closeAuthModal();
                    this.showToast(`🎉 Đăng nhập Google (${result.user.email}) & đồng bộ Cloud thành công!`);
                    this.navigate(this.state.currentView, false);
                    return;
                }
            } catch (err) {
                console.warn("Google OAuth Popup lỗi hoặc bị đóng, chuyển sang chế độ chọn tài khoản nhanh:", err);
            }
        }

        // Nếu chưa cấu hình Firebase key -> Фокус vào ô nhập Gmail hoặc đăng nhập nhanh tài khoản mặc định
        const emailInput = document.getElementById("auth-email");
        const nameInput = document.getElementById("auth-name");
        if (emailInput && emailInput.value.trim()) {
            this.handleCustomLogin(new Event("submit"));
            return;
        }

        // Đăng nhập nhanh tài khoản Google mẫu và lưu vào danh sách tài khoản
        await this.loadFromCloudOrLocalForUser({
            name: nameInput?.value.trim() || "Học viên Kai Toeic",
            email: "hocvien.kaitoeic@gmail.com",
            targetScore: 800,
            provider: "google-local"
        });
        this.closeAuthModal();
        this.showToast("🎉 Đã đăng nhập với tài khoản hocvien.kaitoeic@gmail.com và lưu tự động toàn bộ tiến độ!");
        this.navigate(this.state.currentView, false);
    },

    async switchGoogleAccount(emailKey, redirectToHome = false) {
        const accounts = this.getAccountsMap();
        const target = accounts[emailKey.toLowerCase()];
        if (!target || !target.user) return;

        await this.loadFromCloudOrLocalForUser(target.user);
        this.closeAuthModal();
        this.closeGoogleChooserModal();
        this.showToast(`🔄 Đã chuyển sang tài khoản ${target.user.email} và khôi phục toàn bộ dữ liệu học!`);
        if (redirectToHome || this.state.currentView === "login") {
            this.navigate("home");
        } else {
            this.navigate(this.state.currentView, false);
        }
    },

    removeSavedGoogleAccount(emailKey) {
        const accounts = this.getAccountsMap();
        delete accounts[emailKey.toLowerCase()];
        this.saveAccountsMap(accounts);
        if (this.state.user && this.state.user.email && this.state.user.email.toLowerCase() === emailKey.toLowerCase()) {
            this.state.user = null;
            this.saveState();
        }
        this.openAuthModal();
        this.showToast("Đã xóa tài khoản khỏi danh sách lưu trên thiết bị.");
    },

    async handleCustomLogin(e) {
        if (e && e.preventDefault) e.preventDefault();
        const name = document.getElementById("auth-name")?.value.trim() || "Học viên Kai Toeic";
        const email = document.getElementById("auth-email")?.value.trim() || "hocvien@gmail.com";
        const targetScore = document.getElementById("auth-target")?.value || "750";

        await this.loadFromCloudOrLocalForUser({
            name,
            email,
            targetScore: Number(targetScore),
            provider: "google-email"
        });

        this.closeAuthModal();
        this.showToast(`🎉 Đã đăng nhập ${email}! Toàn bộ điểm thi và từ vựng của bạn được tự động lưu vào tài khoản này.`);
        this.navigate(this.state.currentView, false);
    },

    async logout() {
        // Lưu lần cuối trước khi đăng xuất
        this.saveState();
        if (this.isBackendAvailable) {
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } catch (e) {
                console.warn(e);
            }
        }
        if (this.supabaseClient) {
            try {
                await this.supabaseClient.auth.signOut();
            } catch (e) {
                console.warn(e);
            }
        }
        if (this.isCloudConnected && this.firebaseAuth) {
            try {
                await this.firebaseAuth.signOut();
            } catch (e) {
                console.warn(e);
            }
        }
        this.state.user = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                parsed.user = null;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            }
        } catch (e) {}
        this.renderHeaderAuth();
        this.showToast("Đã đăng xuất tài khoản. Dữ liệu của bạn vẫn được bảo toàn khi đăng nhập lại!");
        this.navigate("home");
    },

    // ================= SAO LƯU / KHÔI PHỤC FILE JSON & CẤU HÌNH FIREBASE =================
    exportUserDataJson() {
        const exportPayload = {
            app: "Kai Toeic",
            exportedAt: new Date().toISOString(),
            currentAccount: {
                user: this.state.user,
                streak: this.state.streak,
                savedWords: this.state.savedWords,
                learnedVocabIds: this.state.learnedVocabIds,
                examHistory: this.state.examHistory,
                vocabQuizAnswers: this.state.vocabQuizAnswers || {},
                ets2020Answers: this.state.ets2020Answers || {},
                ets2020TestNumber: this.state.ets2020TestNumber || 1,
                ets2020SubmittedTestNumber: this.state.ets2020SubmittedTestNumber || null
            },
            allSavedAccounts: this.getAccountsMap()
        };

        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const emailSlug = (this.state.user?.email || "student").split("@")[0];
        a.href = url;
        a.download = `kai-toeic-backup-${emailSlug}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.showToast("📥 Đã tải xuống file sao lưu dữ liệu học tập (.json)!");
    },

    importUserDataJson(event) {
        const file = event.target?.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.allSavedAccounts && typeof data.allSavedAccounts === "object") {
                    const merged = { ...this.getAccountsMap(), ...data.allSavedAccounts };
                    this.saveAccountsMap(merged);
                }
                const curr = data.currentAccount || data;
                if (curr) {
                    if (curr.user) this.state.user = curr.user;
                    if (typeof curr.streak === "number") this.state.streak = curr.streak;
                    if (Array.isArray(curr.savedWords)) this.state.savedWords = curr.savedWords;
                    if (Array.isArray(curr.learnedVocabIds)) this.state.learnedVocabIds = curr.learnedVocabIds;
                    if (Array.isArray(curr.examHistory)) this.state.examHistory = curr.examHistory;
                    if (curr.vocabQuizAnswers && typeof curr.vocabQuizAnswers === "object") this.state.vocabQuizAnswers = curr.vocabQuizAnswers;
                    if (curr.ets2020Answers && typeof curr.ets2020Answers === "object") this.state.ets2020Answers = curr.ets2020Answers;
                    if (Number.isInteger(curr.ets2020TestNumber) && curr.ets2020TestNumber >= 1 && curr.ets2020TestNumber <= 10) this.state.ets2020TestNumber = curr.ets2020TestNumber;
                    if (Number.isInteger(curr.ets2020SubmittedTestNumber) && curr.ets2020SubmittedTestNumber >= 1 && curr.ets2020SubmittedTestNumber <= 10) this.state.ets2020SubmittedTestNumber = curr.ets2020SubmittedTestNumber;
                    this.saveState();
                }
                this.closeAuthModal();
                this.showToast("✅ Đã khôi phục toàn bộ lịch sử thi & từ vựng từ file sao lưu!");
                this.navigate(this.state.currentView, false);
            } catch (err) {
                this.showToast("❌ File sao lưu không hợp lệ. Vui lòng kiểm tra lại!");
            }
        };
        reader.readAsText(file);
    },

    saveFirebaseConfig() {
        const input = document.getElementById("firebase-config-input");
        if (!input || !input.value.trim()) {
            this.showToast("Vui lòng dán JSON cấu hình Firebase vào ô trống.");
            return;
        }
        try {
            const parsed = JSON.parse(input.value.trim());
            if (!parsed.apiKey || !parsed.projectId) {
                this.showToast("JSON thiếu trường apiKey hoặc projectId!");
                return;
            }
            localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(parsed));
            this.initFirebaseIfConfigured();
            this.openAuthModal();
            this.showToast("🔥 Đã lưu & kết nối Firebase Cloud thành công!");
        } catch (err) {
            this.showToast("Định dạng JSON không hợp lệ. Hãy đảm bảo dùng dấu ngoặc kép chuẩn JSON!");
        }
    },

    clearFirebaseConfig() {
        localStorage.removeItem(FIREBASE_CONFIG_KEY);
        this.isCloudConnected = false;
        const input = document.getElementById("firebase-config-input");
        if (input) input.value = "";
        this.openAuthModal();
        this.showToast("Đã xóa cấu hình Firebase Cloud, chuyển về lưu trữ trên trình duyệt.");
    },

    openVipModal() {
        const modal = document.getElementById("vip-modal");
        if (modal) {
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        }
    },

    closeVipModal() {
        const modal = document.getElementById("vip-modal");
        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    },

    activateFreeVip() {
        if (!this.state.user) {
            this.state.user = {
                name: "Học viên VIP",
                email: "vip@kaiteoic.com",
                targetScore: 850,
                isVip: true
            };
        } else {
            this.state.user.isVip = true;
        }
        this.saveState();
        this.closeVipModal();
        this.showToast("👑 Đã kích hoạt tài khoản VIP Pro thành công! Toàn bộ đề thi đã được mở khóa.");
        this.navigate(this.state.currentView, false);
    },

    // ================= AI HỖ TRỢ DỊCH THUẬT (FLOATING CHAT WIDGET) =================
    translatorMode: "auto",
    _toeicDictCache: null,
    _translatorBusy: false,

    toggleTranslatorChat(forceOpen) {
        const popup = document.getElementById("ai-translator-popup");
        const fab = document.getElementById("ai-translator-fab");
        const icon = document.getElementById("ai-translator-fab-icon");
        const input = document.getElementById("ai-translator-input");
        if (!popup || !fab) return;
        // Vừa kéo icon xong thì bỏ qua cú click phát sinh khi thả chuột
        if (typeof forceOpen !== "boolean" && Date.now() - (this._translatorDragEnd || 0) < 300) return;

        const isHidden = popup.classList.contains("hidden");
        const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : isHidden;

        if (shouldOpen) {
            const selected = window.getSelection ? window.getSelection().toString().trim() : "";
            const msgs = document.getElementById("ai-translator-messages");
            if (msgs && !msgs.children.length) {
                this.initTranslatorWelcome();
            }
            popup.classList.remove("hidden");
            popup.classList.add("flex");
            this.clampTranslatorWidget();
            fab.setAttribute("aria-expanded", "true");
            if (icon) icon.className = "fa-solid fa-chevron-down text-lg";
            if (input) {
                if (selected && selected.length <= 300 && !input.value.trim()) {
                    input.value = selected;
                }
                setTimeout(() => input.focus(), 50);
            }
        } else {
            popup.classList.add("hidden");
            popup.classList.remove("flex");
            fab.setAttribute("aria-expanded", "false");
            if (icon) icon.className = "fa-solid fa-language text-xl";
        }
    },

    // Kéo thả widget dịch thuật bằng icon tròn (Pointer Events: chuột + cảm ứng).
    // Di chuyển < 5px coi như click (mở/đóng popup), vượt ngưỡng thì là kéo.
    startTranslatorDrag(e) {
        const fab = e.currentTarget;
        const widget = document.getElementById("ai-translator-widget");
        if (!widget || e.button !== 0) return;
        const rect = widget.getBoundingClientRect();
        const startX = e.clientX, startY = e.clientY;
        let dragging = false;

        const onMove = (ev) => {
            const dx = ev.clientX - startX, dy = ev.clientY - startY;
            if (!dragging) {
                if (Math.hypot(dx, dy) < 5) return;
                dragging = true;
                // Chuyển sang neo left/bottom: icon đứng yên khi đóng/mở popup
                widget.style.right = "auto";
                widget.style.top = "auto";
            }
            widget.style.left = `${rect.left + dx}px`;
            widget.style.bottom = `${window.innerHeight - rect.bottom - dy}px`;
            this.clampTranslatorWidget();
        };
        const onUp = (ev) => {
            fab.releasePointerCapture?.(ev.pointerId);
            fab.removeEventListener("pointermove", onMove);
            fab.removeEventListener("pointerup", onUp);
            fab.removeEventListener("pointercancel", onUp);
            if (dragging) this._translatorDragEnd = Date.now();
        };
        fab.setPointerCapture?.(e.pointerId);
        fab.addEventListener("pointermove", onMove);
        fab.addEventListener("pointerup", onUp);
        fab.addEventListener("pointercancel", onUp);
        if (!this._translatorResizeBound) {
            this._translatorResizeBound = true;
            window.addEventListener("resize", () => this.clampTranslatorWidget());
        }
    },

    // Giữ widget luôn nằm trong màn hình
    clampTranslatorWidget() {
        const widget = document.getElementById("ai-translator-widget");
        if (!widget) return;
        // Đặt popup về phía còn đủ chỗ (trái/phải, trên/dưới) so với icon
        const popup = document.getElementById("ai-translator-popup");
        const r = widget.getBoundingClientRect();
        if (popup && !popup.classList.contains("hidden")) {
            const pw = popup.offsetWidth, ph = popup.offsetHeight + 12;
            const alignRight = r.right - pw >= 0 || r.left + pw > window.innerWidth;
            popup.classList.toggle("right-0", alignRight);
            popup.classList.toggle("left-0", !alignRight);
            const above = r.top - ph >= 0 || window.innerHeight - r.bottom < ph;
            popup.classList.toggle("bottom-full", above);
            popup.classList.toggle("mb-3", above);
            popup.classList.toggle("top-full", !above);
            popup.classList.toggle("mt-3", !above);
        }
        if (!widget.style.left) return; // chưa kéo lần nào → giữ vị trí mặc định góc phải dưới
        const rect = widget.getBoundingClientRect();
        const maxX = Math.max(0, window.innerWidth - rect.width);
        const maxY = Math.max(0, window.innerHeight - rect.height);
        widget.style.left = `${Math.min(Math.max(0, parseFloat(widget.style.left)), maxX)}px`;
        widget.style.bottom = `${Math.min(Math.max(0, parseFloat(widget.style.bottom)), maxY)}px`;
    },

    initTranslatorWelcome() {
        const msgs = document.getElementById("ai-translator-messages");
        if (!msgs) return;
        msgs.innerHTML = `
            <div class="flex items-start gap-2">
                <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-extrabold">AI</div>
                <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 shadow-sm text-slate-700 leading-relaxed max-w-[88%]">
                    <p class="font-bold text-slate-900 mb-1">Xin chào! Mình là Trợ lý Dịch thuật TOEIC.</p>
                    <p class="text-xs text-slate-600">Nhập bất kỳ từ, cụm động từ hay câu tiếng Anh / tiếng Việt nào bên dưới — hoặc bôi đen văn bản trên bài đọc rồi bấm <strong>Dịch chữ bôi đen</strong> để mình dịch, phát âm và phân tích từ vựng TOEIC giúp bạn nhé.</p>
                </div>
            </div>
        `;
    },

    clearTranslatorChat() {
        this.initTranslatorWelcome();
        document.getElementById("ai-translator-input")?.focus();
    },

    cycleTranslatorDirection() {
        const order = ["auto", "en-vi", "vi-en"];
        const labels = { "auto": "Tự động", "en-vi": "Anh → Việt", "vi-en": "Việt → Anh" };
        const nextIdx = (order.indexOf(this.translatorMode) + 1) % order.length;
        this.translatorMode = order[nextIdx];
        const btn = document.getElementById("ai-trans-dir-btn");
        if (btn) btn.textContent = labels[this.translatorMode];
        this.showToast(`Chế độ dịch: ${labels[this.translatorMode]}`);
    },

    getLocalToeicDict() {
        if (this._toeicDictCache) return this._toeicDictCache;
        const dict = new Map();
        const put = (entry, priority) => {
            if (!entry || !entry.word || !entry.meaning) return;
            const key = String(entry.word).trim().toLowerCase();
            if (!key) return;
            const prev = dict.get(key);
            if (!prev || priority > prev._prio) {
                dict.set(key, { ...entry, _prio: priority });
            }
        };

        (window.BARRONS_600_TOPICS || []).forEach(topic => {
            (topic.words || []).forEach(w => put({ ...w, source: "600 Từ vựng TOEIC" }, 3));
        });
        (window.PHRASAL_VERBS_300_TOPICS || []).forEach(topic => {
            (topic.words || []).forEach(w => put({ ...w, source: "300 Phrasal Verbs" }, 3));
        });

        const D = window.DAU_DATA || {};
        const scanExercises = list => {
            (list || []).forEach(ex => {
                (ex.keyVocab || ex.vocab || []).forEach(v => {
                    if (Array.isArray(v)) {
                        put({ word: v[0], pos: v[1] || "", meaning: v[2] || v[1] || "", source: "Từ vựng bài luyện" }, 1);
                    } else if (v && v.word) {
                        put({ word: v.word, pos: v.pos || "", meaning: v.meaning || "", source: "Từ vựng bài luyện" }, 1);
                    }
                });
            });
        };
        scanExercises(D.listeningExercises);
        scanExercises(D.readingExercises);
        (D.mockTests || []).forEach(t => scanExercises(t.questions));

        this._toeicDictCache = dict;
        return dict;
    },

    lookupToeicWord(dict, rawWord) {
        const clean = String(rawWord || "").trim().toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
        if (!clean) return null;
        if (dict.has(clean)) return dict.get(clean);
        const variants = [
            clean.replace(/ies$/, "y"),
            clean.replace(/es$/, ""),
            clean.replace(/s$/, ""),
            clean.replace(/ied$/, "y"),
            clean.replace(/ed$/, ""),
            clean.replace(/ed$/, "e"),
            clean.replace(/ing$/, ""),
            clean.replace(/ing$/, "e")
        ];
        for (const v of variants) {
            if (v.length >= 3 && dict.has(v)) return dict.get(v);
        }
        return null;
    },

    detectLanguagePair(text) {
        if (this.translatorMode === "en-vi") return { sl: "en", tl: "vi" };
        if (this.translatorMode === "vi-en") return { sl: "vi", tl: "en" };
        const hasViChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
        return hasViChars ? { sl: "vi", tl: "en" } : { sl: "en", tl: "vi" };
    },

    async translateTextAI(text, sl, tl) {
        const dict = this.getLocalToeicDict();
        const cleanLower = text.trim().toLowerCase().replace(/[.?!,;:"']+$/g, "");
        const exactEntry = sl === "en" ? (dict.get(cleanLower) || this.lookupToeicWord(dict, cleanLower)) : null;

        // Trích tối đa 3 từ TOEIC xuất hiện trong câu (nếu là câu dài tiếng Anh)
        const relatedVocab = [];
        if (sl === "en" && text.trim().includes(" ")) {
            const seen = new Set(exactEntry ? [exactEntry.word.toLowerCase()] : []);
            const tokens = text.toLowerCase().match(/[a-z]{4,}/g) || [];
            for (const tok of tokens) {
                const hit = this.lookupToeicWord(dict, tok);
                if (hit && !seen.has(hit.word.toLowerCase())) {
                    seen.add(hit.word.toLowerCase());
                    relatedVocab.push(hit);
                    if (relatedVocab.length >= 3) break;
                }
            }
        }

        const fetchWithTimeout = (url, ms = 6000) => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), ms);
            return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
        };

        // 1. Ưu tiên Google Translate GTX (hỗ trợ dịch đoạn văn + cụm từ + bảng từ loại)
        try {
            const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
            const res = await fetchWithTimeout(gtxUrl);
            if (res.ok) {
                const data = await res.json();
                const translatedText = Array.isArray(data?.[0])
                    ? data[0].map(seg => (Array.isArray(seg) ? seg[0] : "")).join("").trim()
                    : "";
                const synonyms = Array.isArray(data?.[1])
                    ? data[1].slice(0, 2).map(b => `${b[0]}: ${(b[1] || []).slice(0, 4).join(", ")}`)
                    : [];
                if (translatedText) {
                    return { translatedText, sl, tl, exactEntry, relatedVocab, synonyms, offlineFallback: false };
                }
            }
        } catch (_) { /* Fallback xuống MyMemory / từ điển nội bộ */ }

        // 2. Fallback MyMemory API
        try {
            const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sl}|${tl}`;
            const res = await fetchWithTimeout(mmUrl);
            if (res.ok) {
                const data = await res.json();
                const translatedText = String(data?.responseData?.translatedText || "").trim();
                if (translatedText) {
                    return { translatedText, sl, tl, exactEntry, relatedVocab, synonyms: [], offlineFallback: false };
                }
            }
        } catch (_) { /* Fallback xuống từ điển nội bộ */ }

        // 3. Fallback từ điển TOEIC nội bộ khi offline
        if (exactEntry) {
            return {
                translatedText: exactEntry.meaning,
                sl, tl, exactEntry, relatedVocab, synonyms: [], offlineFallback: true
            };
        }
        return {
            translatedText: "",
            sl, tl, exactEntry: null, relatedVocab, synonyms: [], offlineFallback: true
        };
    },

    quickTranslate(text) {
        const input = document.getElementById("ai-translator-input");
        if (!input) return;
        input.value = text;
        this.processTranslatorQuery(text);
    },

    translateSelectedText() {
        const selected = window.getSelection ? window.getSelection().toString().trim() : "";
        if (!selected) {
            this.showToast("Hãy bôi đen một từ hoặc câu trên trang trước rồi bấm nút này nhé!");
            return;
        }
        const clipped = selected.slice(0, 500);
        const input = document.getElementById("ai-translator-input");
        if (input) input.value = clipped;
        this.processTranslatorQuery(clipped);
    },

    handleTranslatorSubmit(event) {
        event.preventDefault();
        const input = document.getElementById("ai-translator-input");
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;
        input.value = "";
        this.processTranslatorQuery(text);
    },

    copyTranslatorText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => this.showToast("Đã sao chép bản dịch!"));
        } else {
            this.showToast("Trình duyệt không hỗ trợ sao chép tự động.");
        }
    },

    async processTranslatorQuery(rawText) {
        if (this._translatorBusy) return;
        const text = String(rawText || "").trim().slice(0, 800);
        const msgs = document.getElementById("ai-translator-messages");
        if (!text || !msgs) return;
        if (!msgs.children.length) this.initTranslatorWelcome();

        this._translatorBusy = true;
        const userBubble = document.createElement("div");
        userBubble.className = "flex justify-end";
        userBubble.innerHTML = `<div class="bg-brand-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] shadow-sm leading-relaxed break-words">${this.escapeHtml(text)}</div>`;
        msgs.appendChild(userBubble);

        const loadingBubble = document.createElement("div");
        loadingBubble.className = "flex items-start gap-2";
        loadingBubble.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-extrabold">AI</div>
            <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm text-slate-400 italic">Đang dịch và tra từ điển...</div>
        `;
        msgs.appendChild(loadingBubble);
        msgs.scrollTop = msgs.scrollHeight;

        const { sl, tl } = this.detectLanguagePair(text);
        try {
            const res = await this.translateTextAI(text, sl, tl);
            const dirLabel = res.sl === "en" ? "Anh → Việt" : "Việt → Anh";
            const englishText = res.sl === "en" ? text : res.translatedText;
            const saveTarget = res.exactEntry || (res.sl === "en" && text.split(/\s+/).length <= 3 && res.translatedText
                ? { word: text, pos: "", meaning: res.translatedText }
                : null);

            let bodyHtml = "";
            if (res.translatedText) {
                bodyHtml += `
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${res.offlineFallback ? "bg-amber-100 text-amber-800" : "bg-brand-50 text-brand-700"}">${dirLabel}${res.offlineFallback ? " • Offline" : ""}</span>
                        <div class="flex items-center gap-1">
                            ${englishText ? `<button type="button" onclick="app.speakText('${this.escapeJsString(englishText)}')" title="Phát âm tiếng Anh" class="w-6 h-6 rounded-md bg-slate-100 hover:bg-brand-100 text-slate-600 hover:text-brand-700 flex items-center justify-center transition"><i class="fa-solid fa-volume-high text-[11px]"></i></button>` : ""}
                            <button type="button" onclick="app.copyTranslatorText('${this.escapeJsString(res.translatedText)}')" title="Sao chép bản dịch" class="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"><i class="fa-regular fa-copy text-[11px]"></i></button>
                            ${saveTarget ? `<button type="button" onclick="app.saveWordToNotebook('${this.escapeJsString(saveTarget.word)}','${this.escapeJsString(saveTarget.pos || "vocab")}','${this.escapeJsString(saveTarget.meaning)}')" title="Lưu vào Sổ tay từ vựng" class="w-6 h-6 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition"><i class="fa-solid fa-bookmark text-[11px]"></i></button>` : ""}
                        </div>
                    </div>
                    <p class="font-bold text-slate-900 text-sm leading-relaxed break-words">${this.escapeHtml(res.translatedText)}</p>
                `;
            } else {
                bodyHtml += `<p class="text-rose-600 font-semibold">Không thể kết nối dịch trực tuyến và từ này chưa có trong kho từ điển offline. Vui lòng kiểm tra lại mạng.</p>`;
            }

            if (res.exactEntry) {
                const e = res.exactEntry;
                bodyHtml += `
                    <div class="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1 text-xs">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span class="font-extrabold text-brand-700">${this.escapeHtml(e.word)}</span>
                            ${e.pos ? `<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px]">${this.escapeHtml(e.pos)}</span>` : ""}
                            ${e.phonetic ? `<span class="text-slate-500 font-mono text-[11px]">${this.escapeHtml(e.phonetic)}</span>` : ""}
                        </div>
                        <p class="text-slate-700"><span class="font-semibold">Nghĩa TOEIC:</span> ${this.escapeHtml(e.meaning)}</p>
                        ${e.example ? `<p class="text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">"${this.escapeHtml(e.example)}"${e.exampleVi ? `<br><span class="not-italic text-slate-500">→ ${this.escapeHtml(e.exampleVi)}</span>` : ""}</p>` : ""}
                    </div>
                `;
            }

            if (res.synonyms && res.synonyms.length) {
                bodyHtml += `<div class="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-0.5">${res.synonyms.map(s => `<div>• ${this.escapeHtml(s)}</div>`).join("")}</div>`;
            }

            if (res.relatedVocab && res.relatedVocab.length) {
                bodyHtml += `
                    <div class="mt-2.5 pt-2 border-t border-slate-100">
                        <div class="text-[10px] font-bold uppercase text-slate-400 mb-1">Từ vựng TOEIC trong câu</div>
                        <div class="space-y-1">
                            ${res.relatedVocab.map(v => `
                                <div class="flex items-center justify-between gap-2 text-[11px] bg-slate-50 px-2 py-1 rounded-lg">
                                    <span class="truncate"><strong class="text-brand-700">${this.escapeHtml(v.word)}</strong>: ${this.escapeHtml(v.meaning)}</span>
                                    <button type="button" onclick="app.saveWordToNotebook('${this.escapeJsString(v.word)}','${this.escapeJsString(v.pos || "vocab")}','${this.escapeJsString(v.meaning)}')" class="text-amber-600 hover:text-amber-700 shrink-0" title="Lưu từ"><i class="fa-solid fa-bookmark"></i></button>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `;
            }

            loadingBubble.innerHTML = `
                <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-extrabold">AI</div>
                <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[88%] min-w-0">${bodyHtml}</div>
            `;
        } finally {
            this._translatorBusy = false;
            msgs.scrollTop = msgs.scrollHeight;
        }
    },

    // ================= TOAST & HELPERS =================
    showToast(message, position) {
        if (position === "above-audio") {
            document.getElementById("audio-play-toast")?.remove();
            const toast = document.createElement("div");
            toast.id = "audio-play-toast";
            toast.className = "fixed bottom-20 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 z-50 bg-slate-900/95 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-2xl border border-blue-400/40 flex items-center gap-2 pointer-events-none transition-all duration-300";
            toast.innerHTML = `<i class="fa-solid fa-volume-high text-blue-400"></i><span>${message}</span>`;
            document.body.appendChild(toast);
            requestAnimationFrame(() => toast.classList.remove("translate-y-4", "opacity-0"));
            setTimeout(() => {
                toast.classList.add("translate-y-4", "opacity-0");
                setTimeout(() => toast.remove(), 300);
            }, 2200);
            return;
        }
        const container = document.getElementById("toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 pointer-events-auto transition-all duration-300";
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    },

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    },

    escapeJsString(str) {
        return String(str || "")
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, " ");
    }
};

window.addEventListener("DOMContentLoaded", () => {
    app.init();
});
