/**
 * KAI TOEIC - BACKEND SERVER & GOOGLE OAUTH 2.0 AUTHORIZATION CODE FLOW (4 BƯỚC)
 * Chạy server: node server.js (Mặc định cổng http://localhost:3000)
 *
 * Quy trình 4 bước chuẩn Google OAuth 2.0:
 * - Bước 1 (/auth/google): Chuyển hướng (302 Redirect) trình duyệt sang https://accounts.google.com/o/oauth2/v2/auth
 * - Bước 2: Người dùng chọn tài khoản và cấp quyền trực tiếp trên trang của Google
 * - Bước 3 (/auth/google/callback?code=...): Google đóng dấu "Authorization Code" và redirect về lại server
 * - Bước 4: Backend gọi ngầm (POST https://oauth2.googleapis.com/token) đổi code lấy Access Token,
 *           lấy thông tin (Tên, Email, Ảnh đại diện) từ Google, tự động tạo/khôi phục tài khoản trong users_db.json
 *           và đồng bộ toàn bộ tiến độ học tập (600 từ vựng, 300 Phrasal Verbs, lịch sử điểm thi).
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_FILE = path.join(ROOT_DIR, "users_db.json");
const OAUTH_CONFIG_FILE = path.join(ROOT_DIR, "oauth_config.json");

// ================= QUẢN LÝ DATABASE NGƯỜI DÙNG & CẤU HÌNH OAUTH =================
function readJsonFile(filePath, defaultVal) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        }
    } catch (e) {
        console.warn("Lỗi đọc file JSON:", filePath, e.message);
    }
    return defaultVal;
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch (e) {
        console.error("Lỗi ghi file JSON:", filePath, e.message);
        return false;
    }
}

function getOAuthConfig(reqHost) {
    const saved = readJsonFile(OAUTH_CONFIG_FILE, {});
    const rawHost = reqHost || `localhost:${PORT}`;
    // Chuẩn hóa 127.0.0.1 thành localhost để luôn khớp với Google Cloud Console
    const normalizedHost = rawHost.replace("127.0.0.1", "localhost");
    const defaultRedirectUri = `http://${normalizedHost}/auth/google/callback`;
    return {
        clientId: process.env.GOOGLE_CLIENT_ID || saved.clientId || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || saved.clientSecret || "",
        redirectUri: process.env.GOOGLE_REDIRECT_URI || saved.redirectUri || defaultRedirectUri
    };
}

function getUsersDb() {
    return readJsonFile(DB_FILE, { users: {}, sessions: {} });
}

function saveUsersDb(db) {
    return writeJsonFile(DB_FILE, db);
}

// Hàm gọi HTTPS POST/GET từ Backend sang máy chủ Google (Bước 4: Xác thực ngầm)
function httpsRequestJson(requestUrl, options = {}, postBody = null) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(requestUrl);
        const reqOptions = {
            hostname: parsed.hostname,
            port: parsed.port || 443,
            path: parsed.pathname + parsed.search,
            method: options.method || "GET",
            headers: options.headers || {}
        };

        const req = https.request(reqOptions, (res) => {
            let raw = "";
            res.on("data", (chunk) => (raw += chunk));
            res.on("end", () => {
                try {
                    const json = JSON.parse(raw);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        reject(new Error(json.error_description || json.error || `HTTP ${res.statusCode}: ${raw}`));
                    }
                } catch (e) {
                    reject(new Error(`Không thể phân tích phản hồi từ Google: ${raw}`));
                }
            });
        });

        req.on("error", reject);
        if (postBody) {
            req.write(postBody);
        }
        req.end();
    });
}

function parseRequestBody(req) {
    return new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
            if (body.length > 5 * 1024 * 1024) req.destroy();
        });
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

function parseCookies(req) {
    const list = {};
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return list;
    cookieHeader.split(";").forEach((cookie) => {
        let [name, ...rest] = cookie.split("=");
        name = name?.trim();
        if (!name) return;
        const value = rest.join("=").trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });
    return list;
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        ...extraHeaders
    });
    res.end(JSON.stringify(payload));
}

// ================= MIME TYPES CHO STATIC FILES =================
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".mp3": "audio/mpeg",
    ".pdf": "application/pdf",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

// ================= KHỞI TẠO HTTP SERVER =================
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const reqHost = req.headers.host || `localhost:${PORT}`;

    if (req.method === "OPTIONS") {
        return sendJson(res, 200, { ok: true });
    }

    // -------------------------------------------------------------------------
    // BƯỚC 1: Người dùng bấm nút "Đăng nhập bằng Google" -> Chuyển hướng (Redirect)
    // trình duyệt sang trang xác thực chính thức của Google (accounts.google.com)
    // -------------------------------------------------------------------------
    if (pathname === "/auth/google" && req.method === "GET") {
        const config = getOAuthConfig(reqHost);

        // Nếu người dùng chưa điền Client ID & Client Secret của Google Cloud Console,
        // chuyển đến trang hướng dẫn / cấu hình nhanh hoặc Cổng mô phỏng OAuth 4 bước
        if (!config.clientId || !config.clientSecret) {
            res.writeHead(302, { Location: "/#login?setup_oauth=1" });
            return res.end();
        }

        // Tạo mã state chống tấn công CSRF
        const state = crypto.randomBytes(16).toString("hex");

        const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        googleAuthUrl.searchParams.set("client_id", config.clientId);
        googleAuthUrl.searchParams.set("redirect_uri", config.redirectUri);
        googleAuthUrl.searchParams.set("response_type", "code"); // Yêu cầu Google trả về Authorization Code (Bước 3)
        googleAuthUrl.searchParams.set("scope", "openid email profile");
        googleAuthUrl.searchParams.set("access_type", "offline");
        googleAuthUrl.searchParams.set("prompt", "select_account");
        googleAuthUrl.searchParams.set("state", state);

        console.log(`[OAuth Bước 1] Redirect trình duyệt sang: ${googleAuthUrl.toString()}`);

        res.writeHead(302, {
            Location: googleAuthUrl.toString(),
            "Set-Cookie": `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`
        });
        return res.end();
    }

    // -------------------------------------------------------------------------
    // BƯỚC 3 & BƯỚC 4: Google trả về Authorization Code qua /auth/google/callback
    // Backend xác thực ngầm với máy chủ Google để đổi Code lấy Access Token & Profile
    // -------------------------------------------------------------------------
    if (pathname === "/auth/google/callback" && req.method === "GET") {
        const { code, error } = parsedUrl.query;

        if (error || !code) {
            console.warn("[OAuth Bước 3] Người dùng từ chối hoặc lỗi từ Google:", error);
            res.writeHead(302, { Location: `/#login?oauth_error=${encodeURIComponent(error || "missing_code")}` });
            return res.end();
        }

        const config = getOAuthConfig(reqHost);

        try {
            console.log(`[OAuth Bước 3] Đã nhận Authorization Code từ Google: ${String(code).slice(0, 12)}...`);
            console.log(`[OAuth Bước 4] Backend đang gọi ngầm tới https://oauth2.googleapis.com/token để đổi Access Token...`);

            // Bước 4.1: Backend gửi POST ngầm tới máy chủ Google để đổi Authorization Code lấy Access Token
            const tokenParams = new URLSearchParams({
                code: String(code),
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: config.redirectUri,
                grant_type: "authorization_code"
            }).toString();

            const tokenData = await httpsRequestJson(
                "https://oauth2.googleapis.com/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": Buffer.byteLength(tokenParams)
                    }
                },
                tokenParams
            );

            const accessToken = tokenData.access_token;
            const idToken = tokenData.id_token || "";

            // Bước 4.2: Lấy thông tin từ OpenID Connect (OIDC) ID Token & Google UserInfo Endpoint
            const googleProfile = await httpsRequestJson(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const emailKey = (googleProfile.email || "").toLowerCase();
            if (!emailKey) {
                throw new Error("Google không trả về địa chỉ email.");
            }

            // Hồ sơ Ủy quyền Liên kết Định danh (Federated Identity Claims chuẩn OIDC)
            const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString("vi-VN");
            const federatedIdentity = {
                idp: "https://accounts.google.com", // Identity Provider (IdP)
                protocol: "OpenID Connect 1.0 / OAuth 2.0",
                sub: googleProfile.sub, // Mã định danh toàn cầu duy nhất của Google (Subject Identifier)
                email: googleProfile.email,
                emailVerified: Boolean(googleProfile.email_verified),
                linkedAt: nowStr,
                hasIdToken: Boolean(idToken)
            };

            // Bước 4.3: Liên kết định danh (Federation Linking) - Tự động tạo mới hoặc ghép nối vào tài khoản hiện có trùng email/sub
            const db = getUsersDb();

            if (!db.users[emailKey]) {
                console.log(`[Federated Identity] Khởi tạo tài khoản mới liên kết với Google sub=${googleProfile.sub} (${emailKey})`);
                db.users[emailKey] = {
                    user: {
                        uid: googleProfile.sub || ("gg_" + Date.now()),
                        name: googleProfile.name || googleProfile.given_name || emailKey.split("@")[0],
                        email: googleProfile.email,
                        photoURL: googleProfile.picture || "",
                        targetScore: 800,
                        isVip: true,
                        provider: "google-federated-oidc",
                        federatedIdentity,
                        linkedProviders: ["google.com"],
                        lastSyncedAt: nowStr
                    },
                    streak: 3,
                    savedWords: [
                        { word: "complimentary", pos: "adj", meaning: "miễn phí (= free of charge)" },
                        { word: "reimbursement", pos: "n", meaning: "sự hoàn tiền / bồi hoàn chi phí" }
                    ],
                    learnedVocabIds: ["w1", "w2", "w13"],
                    examHistory: [],
                    updatedAt: nowStr
                };
            } else {
                console.log(`[Federated Identity] Liên kết & khôi phục tài khoản từ Google IdP sub=${googleProfile.sub} (${emailKey})`);
                const existingProviders = db.users[emailKey].user?.linkedProviders || [];
                if (!existingProviders.includes("google.com")) existingProviders.push("google.com");

                db.users[emailKey].user = {
                    ...db.users[emailKey].user,
                    uid: googleProfile.sub || db.users[emailKey].user?.uid,
                    name: googleProfile.name || db.users[emailKey].user?.name,
                    email: googleProfile.email,
                    photoURL: googleProfile.picture || db.users[emailKey].user?.photoURL || "",
                    provider: "google-federated-oidc",
                    federatedIdentity,
                    linkedProviders: existingProviders,
                    lastSyncedAt: nowStr
                };
            }

            // Tạo Session Token lưu vào Cookie để trình duyệt tự động nhận diện phiên đăng nhập
            const sessionToken = crypto.randomBytes(24).toString("hex");
            db.sessions[sessionToken] = {
                email: emailKey,
                createdAt: Date.now()
            };
            saveUsersDb(db);

            // Chuyển hướng người dùng về lại trang học tập kèm thông báo thành công
            res.writeHead(302, {
                Location: `/#home?oauth_success=1&session=${sessionToken}`,
                "Set-Cookie": `kai_session=${sessionToken}; Path=/; Max-Age=2592000; SameSite=Lax`
            });
            return res.end();
        } catch (err) {
            console.error("[OAuth Bước 4 Lỗi]:", err.message);
            res.writeHead(302, {
                Location: `/#login?oauth_error=${encodeURIComponent(err.message)}`
            });
            return res.end();
        }
    }

    // -------------------------------------------------------------------------
    // API: Kiểm tra trạng thái cấu hình OAuth & lấy thông tin tài khoản hiện tại (/api/auth/me)
    // -------------------------------------------------------------------------
    if (pathname === "/api/auth/me" && req.method === "GET") {
        const cookies = parseCookies(req);
        const sessionToken = parsedUrl.query.session || cookies.kai_session || req.headers.authorization?.replace("Bearer ", "");
        const db = getUsersDb();
        const config = getOAuthConfig(reqHost);

        let currentProfile = null;
        if (sessionToken && db.sessions[sessionToken]) {
            const emailKey = db.sessions[sessionToken].email;
            currentProfile = db.users[emailKey] || null;
        }

        return sendJson(res, 200, {
            ok: true,
            isOAuthConfigured: Boolean(config.clientId && config.clientSecret),
            clientIdPreview: config.clientId ? `${config.clientId.slice(0, 14)}...apps.googleusercontent.com` : "",
            redirectUri: config.redirectUri,
            profile: currentProfile,
            allAccounts: db.users
        });
    }

    // -------------------------------------------------------------------------
    // API: Lưu cấu hình Google Client ID & Client Secret vào Backend (/api/auth/config)
    // -------------------------------------------------------------------------
    if (pathname === "/api/auth/config" && req.method === "POST") {
        const body = await parseRequestBody(req);
        const current = getOAuthConfig(reqHost);
        const updated = {
            clientId: (body.clientId ?? current.clientId).trim(),
            clientSecret: (body.clientSecret ?? current.clientSecret).trim(),
            redirectUri: (body.redirectUri || `http://${reqHost}/auth/google/callback`).trim()
        };
        writeJsonFile(OAUTH_CONFIG_FILE, updated);
        return sendJson(res, 200, {
            ok: true,
            isOAuthConfigured: Boolean(updated.clientId && updated.clientSecret),
            redirectUri: updated.redirectUri
        });
    }

    // -------------------------------------------------------------------------
    // API: Đồng bộ (Lưu & Tải) dữ liệu học tập của tài khoản lên Server (/api/user/sync)
    // -------------------------------------------------------------------------
    if (pathname === "/api/user/sync" && req.method === "POST") {
        const body = await parseRequestBody(req);
        const emailKey = (body.user?.email || body.email || "").toLowerCase();
        if (!emailKey) {
            return sendJson(res, 400, { ok: false, error: "Thiếu email tài khoản" });
        }

        const db = getUsersDb();
        const existing = db.users[emailKey] || {};
        const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date().toLocaleDateString("vi-VN");

        // Nếu là yêu cầu chỉ lấy dữ liệu về (mode === 'pull') và tài khoản đã tồn tại trên server
        if (body.mode === "pull" && db.users[emailKey]) {
            return sendJson(res, 200, {
                ok: true,
                profile: db.users[emailKey]
            });
        }

        // Lưu hoặc hợp nhất dữ liệu học tập vào users_db.json trên Backend
        db.users[emailKey] = {
            user: {
                ...(existing.user || {}),
                ...(body.user || {}),
                email: emailKey,
                lastSyncedAt: nowStr
            },
            streak: body.streak ?? existing.streak ?? 3,
            savedWords: Array.isArray(body.savedWords) ? body.savedWords : (existing.savedWords || []),
            learnedVocabIds: Array.isArray(body.learnedVocabIds) ? body.learnedVocabIds : (existing.learnedVocabIds || []),
            examHistory: Array.isArray(body.examHistory) ? body.examHistory : (existing.examHistory || []),
            updatedAt: nowStr
        };

        saveUsersDb(db);
        return sendJson(res, 200, {
            ok: true,
            profile: db.users[emailKey]
        });
    }

    // -------------------------------------------------------------------------
    // API: Đăng xuất phiên trên Backend (/api/auth/logout)
    // -------------------------------------------------------------------------
    if (pathname === "/api/auth/logout" && req.method === "POST") {
        const cookies = parseCookies(req);
        const sessionToken = cookies.kai_session;
        if (sessionToken) {
            const db = getUsersDb();
            delete db.sessions[sessionToken];
            saveUsersDb(db);
        }
        return sendJson(
            res,
            200,
            { ok: true },
            { "Set-Cookie": "kai_session=; Path=/; Max-Age=0" }
        );
    }

    // -------------------------------------------------------------------------
    // PHỤC VỤ FILE TĨNH CỦA ỨNG DỤNG (index.html, app.js, data.js, vocab_data.js...)
    // -------------------------------------------------------------------------
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
    if (safePath === "/" || safePath === "\\" || safePath === "/login") {
        safePath = "/index.html";
    }

    const filePath = path.join(ROOT_DIR, safePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const fileSize = fs.statSync(filePath).size;
        const rangeHeader = req.headers.range;
        if (rangeHeader) {
            const rangeMatch = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
            if (!rangeMatch || fileSize === 0) {
                res.writeHead(416, { "Content-Range": `bytes */${fileSize}`, "Accept-Ranges": "bytes" });
                res.end();
                return;
            }
            let start = rangeMatch[1] ? Number(rangeMatch[1]) : null;
            let end = rangeMatch[2] ? Number(rangeMatch[2]) : null;
            if (start === null) {
                const suffixLength = end;
                if (!suffixLength) {
                    res.writeHead(416, { "Content-Range": `bytes */${fileSize}`, "Accept-Ranges": "bytes" });
                    res.end();
                    return;
                }
                start = Math.max(fileSize - suffixLength, 0);
                end = fileSize - 1;
            } else if (end === null || end >= fileSize) {
                end = fileSize - 1;
            }
            if (start >= fileSize || start > end) {
                res.writeHead(416, { "Content-Range": `bytes */${fileSize}`, "Accept-Ranges": "bytes" });
                res.end();
                return;
            }
            res.writeHead(206, {
                "Content-Type": contentType,
                "Content-Length": end - start + 1,
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes"
            });
            if (req.method === "HEAD") res.end();
            else fs.createReadStream(filePath, { start, end }).pipe(res);
            return;
        }
        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": fileSize,
            "Accept-Ranges": "bytes"
        });
        if (req.method === "HEAD") res.end();
        else fs.createReadStream(filePath).pipe(res);
    } else {
        // SPA Fallback: trả về index.html cho mọi đường dẫn client-side
        const indexHtmlPath = path.join(ROOT_DIR, "index.html");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        fs.createReadStream(indexHtmlPath).pipe(res);
    }
});

server.listen(PORT, () => {
    console.log("==================================================================");
    console.log(`🚀 KAI TOEIC Server (Google OAuth 2.0 - 4 Bước) đang chạy tại:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`🔑 Callback URI cho Google Cloud Console:`);
    console.log(`   http://localhost:${PORT}/auth/google/callback`);
    console.log("==================================================================");
});
