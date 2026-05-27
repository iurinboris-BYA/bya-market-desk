import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT || 5188);
const ROOT = process.cwd();
const INVESTING_RSS = "https://ru.investing.com/rss/news_301.rss";
const BYACADEMY_PUBLIC_CHANNEL = "https://t.me/s/BYAcadem";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const COINPAPRIKA_BASE = "https://api.coinpaprika.com/v1";
const NEWS_CACHE_SECONDS = 12 * 60 * 60;
const DATA_DIR = process.env.DATA_DIR || join(ROOT, ".data");
const USERS_FILE = join(DATA_DIR, "registrations.json");
const RESET_TOKENS_FILE = join(DATA_DIR, "password-reset-tokens.json");
const PUBLIC_BASE_URL = String(process.env.PUBLIC_BASE_URL || `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;
const PASSWORD_MIN_LENGTH = 8;
const PRIVATE_STATIC_PATHS = new Set(["/server.mjs", "/package.json", "/render.yaml", "/.gitignore"]);
const EMAIL_FROM = process.env.EMAIL_FROM || "";
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_BOT_USERNAME = normalizeTelegramBotUsername(process.env.TELEGRAM_BOT_USERNAME || "");
const TELEGRAM_LINK_TTL_MS = 1000 * 60 * 30;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  try {
    if (url.pathname === "/api/health") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true, service: "bya-market-desk" }));
      return;
    }

    if (url.pathname === "/api/email/status") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(
        JSON.stringify({
          ok: true,
          configured: isEmailConfigured(),
          provider: "resend",
          fromConfigured: Boolean(EMAIL_FROM),
          publicBaseUrl: getRequestBaseUrl(request),
        }),
      );
      return;
    }

    if (url.pathname === "/api/telegram/status") {
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(
        JSON.stringify({
          ok: true,
          configured: isTelegramConfigured(),
          botUsername: TELEGRAM_BOT_USERNAME,
        }),
      );
      return;
    }

    if (url.pathname === "/api/telegram/webhook") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      await handleTelegramWebhook(payload).catch((error) => {
        console.warn("Telegram webhook failed:", error.message || error);
      });
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    if (url.pathname === "/api/admin/users") {
      if (request.method !== "GET") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const users = await readUsers();
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ total: users.length, users }));
      return;
    }

    if (url.pathname === "/api/register") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      const user = normalizeUser(payload);
      const password = String(payload.password || "");
      if (!user.name || !user.email) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Name and email are required" }));
        return;
      }

      if (!isStrongEnoughPassword(password)) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` }));
        return;
      }

      let users;
      try {
        users = await upsertUser({ ...user, passwordHash: hashPassword(password) }, { rejectExistingPassword: true });
      } catch (error) {
        response.writeHead(error.statusCode || 500, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: error.message || "Registration failed" }));
        return;
      }
      const registeredUser = users.find((item) => item.email === user.email) || user;
      const authToken = await createSessionToken(user.email);
      await sendWelcomeEmail(registeredUser, getRequestBaseUrl(request)).catch((error) => {
        console.warn("Welcome email fallback:", error.message || error);
      });
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true, total: users.length, user: toPublicUser(registeredUser), authToken }));
      return;
    }

    if (url.pathname === "/api/login") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      const email = normalizeEmail(payload.email);
      const password = String(payload.password || "");
      if (!email) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Email is required" }));
        return;
      }

      if (!password) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Password is required" }));
        return;
      }

      const user = (await readUsers()).find((item) => item.email === email);
      if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        response.writeHead(404, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        });
        response.end(JSON.stringify({ ok: false, error: "Invalid email or password" }));
        return;
      }

      const authToken = await createSessionToken(email);
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true, user: toPublicUser(user), authToken, portfolioData: user.portfolioData || null }));
      return;
    }

    if (url.pathname === "/api/telegram/link/start") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      const email = normalizeEmail(payload.email);
      const authToken = String(payload.token || "");
      if (!email || !(await verifySessionToken(email, authToken))) {
        response.writeHead(401, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Unauthorized" }));
        return;
      }

      const code = await createTelegramLinkCode(email);
      const linkUrl = TELEGRAM_BOT_USERNAME ? `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${encodeURIComponent(code)}` : "";
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true, configured: isTelegramConfigured(), botUsername: TELEGRAM_BOT_USERNAME, linkUrl, code }));
      return;
    }

    if (url.pathname === "/api/password-reset/request") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      const email = normalizeEmail(payload.email);
      if (email) {
        const user = (await readUsers()).find((item) => item.email === email);
        if (user) {
          const token = await createPasswordResetToken(email);
          const resetLink = `${getRequestBaseUrl(request)}/?resetToken=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
          if (user.telegramChatId) {
            await sendPasswordResetTelegram(user, resetLink).catch(async (error) => {
              console.warn("Password reset telegram fallback:", error.message || error);
              await sendPasswordResetEmail(email, resetLink).catch((emailError) => {
                console.warn("Password reset email fallback:", emailError.message || emailError);
                console.log(`Password reset link for ${email}: ${resetLink}`);
              });
            });
          } else {
            await sendPasswordResetEmail(email, resetLink).catch((error) => {
              console.warn("Password reset email fallback:", error.message || error);
              console.log(`Password reset link for ${email}: ${resetLink}`);
            });
          }
        }
      }

      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    if (url.pathname === "/api/password-reset/confirm") {
      if (request.method !== "POST") {
        response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const payload = await readJsonBody(request);
      const email = normalizeEmail(payload.email);
      const token = String(payload.token || "");
      const password = String(payload.password || "");
      if (!email || !token || !isStrongEnoughPassword(password)) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Email, reset token and a new password are required" }));
        return;
      }

      const isValidToken = await consumePasswordResetToken(email, token);
      if (!isValidToken) {
        response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Reset link is invalid or expired" }));
        return;
      }

      const user = await updateUserPassword(email, password);
      if (!user) {
        response.writeHead(404, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      const authToken = await createSessionToken(email);
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(JSON.stringify({ ok: true, user: toPublicUser(user), authToken }));
      return;
    }

    if (url.pathname === "/api/user/portfolio") {
      if (request.method === "GET") {
        const email = normalizeEmail(url.searchParams.get("email"));
        const authToken = String(url.searchParams.get("token") || "");
        if (!email) {
          response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
          response.end(JSON.stringify({ error: "Email is required" }));
          return;
        }

        if (!(await verifySessionToken(email, authToken))) {
          response.writeHead(401, { "content-type": "application/json; charset=utf-8" });
          response.end(JSON.stringify({ error: "Unauthorized" }));
          return;
        }

        const user = (await readUsers()).find((item) => item.email === email);
        response.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        });
        response.end(JSON.stringify({ ok: true, portfolioData: user?.portfolioData || null, updatedAt: user?.portfolioDataUpdatedAt || null }));
        return;
      }

      if (request.method === "POST") {
        const payload = await readJsonBody(request);
        const email = normalizeEmail(payload.email);
        const authToken = String(payload.token || "");
        if (!email) {
          response.writeHead(400, { "content-type": "application/json; charset=utf-8" });
          response.end(JSON.stringify({ error: "Email is required" }));
          return;
        }

        if (!(await verifySessionToken(email, authToken))) {
          response.writeHead(401, { "content-type": "application/json; charset=utf-8" });
          response.end(JSON.stringify({ error: "Unauthorized" }));
          return;
        }

        const result = await upsertUserPortfolio(email, payload.portfolioData || {});
        response.writeHead(200, {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        });
        response.end(JSON.stringify({ ok: true, updatedAt: result.portfolioDataUpdatedAt }));
        return;
      }

      response.writeHead(405, { "content-type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    if (url.pathname === "/api/investing-news") {
      const rssResponse = await fetch(INVESTING_RSS, {
        headers: {
          "User-Agent": "BYA MarketDesk RSS Reader",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });

      if (!rssResponse.ok) {
        throw new Error(`Investing RSS ${rssResponse.status}`);
      }

      response.writeHead(200, {
        "content-type": "application/xml; charset=utf-8",
        "cache-control": `public, max-age=${NEWS_CACHE_SECONDS}`,
        "access-control-allow-origin": "*",
      });
      response.end(await rssResponse.text());
      return;
    }

    if (url.pathname === "/api/bya-news") {
      const channelResponse = await fetch(BYACADEMY_PUBLIC_CHANNEL, {
        headers: {
          "User-Agent": "BYA MarketDesk Channel Reader",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      if (!channelResponse.ok) {
        throw new Error(`BYAcademy channel ${channelResponse.status}`);
      }

      const posts = parseTelegramChannelPosts(await channelResponse.text());
      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${NEWS_CACHE_SECONDS}`,
        "access-control-allow-origin": "*",
      });
      response.end(JSON.stringify({ source: "BYAcademy", updatedAt: new Date().toISOString(), items: posts }));
      return;
    }

    if (url.pathname === "/api/coingecko/markets") {
      const apiUrl = new URL(`${COINGECKO_BASE}/coins/markets`);
      apiUrl.search = url.searchParams;

      const apiResponse = await fetch(apiUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BYA MarketDesk",
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`CoinGecko markets ${apiResponse.status}`);
      }

      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=20",
        "access-control-allow-origin": "*",
      });
      response.end(await apiResponse.text());
      return;
    }

    if (url.pathname === "/api/coinpaprika/tickers") {
      const apiUrl = new URL(`${COINPAPRIKA_BASE}/tickers`);
      apiUrl.search = url.searchParams;

      const apiResponse = await fetch(apiUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BYA MarketDesk",
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`CoinPaprika tickers ${apiResponse.status}`);
      }

      response.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=60",
        "access-control-allow-origin": "*",
      });
      response.end(await apiResponse.text());
      return;
    }

    const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const filePath = normalize(join(ROOT, requestedPath));

    if (!filePath.startsWith(ROOT) || PRIVATE_STATIC_PATHS.has(requestedPath) || requestedPath.startsWith("/.data/")) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const file = await readFile(filePath);
    response.writeHead(200, { "content-type": contentTypes[extname(filePath)] || "application/octet-stream" });
    response.end(file);
  } catch (error) {
    response.writeHead(url.pathname.startsWith("/api/") ? 502 : 404, {
      "content-type": "text/plain; charset=utf-8",
    });
    response.end(String(error.message || error));
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`BYA MarketDesk running on http://127.0.0.1:${PORT}/`);
});

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody.trim()) return {};
  return JSON.parse(rawBody);
}

function normalizeUser(payload = {}) {
  const now = new Date().toISOString();
  return {
    name: String(payload.name || "").trim().slice(0, 120),
    email: String(payload.email || "").trim().toLowerCase().slice(0, 160),
    telegram: normalizeTelegramHandle(payload.telegram),
    role: String(payload.role || "Инвестор").trim().slice(0, 80),
    createdAt: payload.createdAt || now,
    updatedAt: now,
  };
}

function normalizeEmail(value = "") {
  return String(value || "").trim().toLowerCase().slice(0, 160);
}

function getRequestBaseUrl(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = forwardedProto || (request.socket?.encrypted ? "https" : "http");
  const host = String(request.headers["x-forwarded-host"] || request.headers.host || "").split(",")[0].trim();
  return host ? `${proto}://${host}`.replace(/\/$/, "") : PUBLIC_BASE_URL;
}

function isStrongEnoughPassword(password = "") {
  return String(password || "").length >= PASSWORD_MIN_LENGTH;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(String(password), salt, 210000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$210000$${salt}$${hash}`;
}

function verifyPassword(password, storedHash = "") {
  const [algorithm, iterations, salt, expectedHash] = String(storedHash).split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterations || !salt || !expectedHash) return false;

  const actualHash = crypto.pbkdf2Sync(String(password), salt, Number(iterations), 32, "sha256");
  const expected = Buffer.from(expectedHash, "hex");
  return expected.length === actualHash.length && crypto.timingSafeEqual(expected, actualHash);
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function toPublicUser(user = {}) {
  const { passwordHash, sessions, passwordReset, portfolioData, telegramChatId, telegramLink, ...publicUser } = user;
  return {
    ...publicUser,
    telegramLinked: Boolean(telegramChatId),
  };
}

function normalizeTelegramHandle(value = "") {
  const handle = String(value || "")
    .trim()
    .replace(/^https?:\/\/t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@+/, "")
    .replace(/[^\w]/g, "")
    .slice(0, 64);
  return handle ? `@${handle}` : "";
}

function normalizeTelegramBotUsername(value = "") {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\/t\.me\//i, "")
    .replace(/^t\.me\//i, "")
    .replace(/^@+/, "")
    .replace(/[^\w]/g, "")
    .slice(0, 64);
}

function normalizePortfolioData(payload = {}) {
  const normalizeArray = (value, limit) => (Array.isArray(value) ? value.slice(-limit) : []);
  return {
    portfolio: normalizeArray(payload.portfolio, 1000),
    closedPositions: normalizeArray(payload.closedPositions, 2000),
    portfolioChartHistory: normalizeArray(payload.portfolioChartHistory, 1000),
    portfolioValueHistory: normalizeArray(payload.portfolioValueHistory, 3000),
    portfolioBooks: normalizeArray(payload.portfolioBooks, 50),
    activePortfolioBookId: String(payload.activePortfolioBookId || "").slice(0, 120),
    savedAt: new Date().toISOString(),
  };
}

function parseTelegramChannelPosts(html = "") {
  const posts = [];
  const messagePattern = /<div class="tgme_widget_message[^"]*"[^>]*data-post="([^"]+)"[\s\S]*?(?=<div class="tgme_widget_message[^"]*"[^>]*data-post=|<\/section>)/g;
  let match;

  while ((match = messagePattern.exec(html)) && posts.length < 12) {
    const block = match[0];
    const textMatch = block.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (!textMatch) continue;

    const text = normalizeTelegramText(textMatch[1]);
    if (!text || text.length < 12) continue;

    const lines = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const title = lines[0].slice(0, 130);
    const description = lines.slice(1).join(" ").slice(0, 180) || text.slice(0, 180);
    const postPath = match[1].replace(/^@/, "");
    const dateMatch = block.match(/datetime="([^"]+)"/);

    posts.push({
      title,
      description,
      link: `https://t.me/${postPath}`,
      time: dateMatch ? formatTelegramPostTime(dateMatch[1]) : "канал",
    });
  }

  return posts;
}

function normalizeTelegramText(html = "") {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim(),
  );
}

function decodeHtmlEntities(value = "") {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (_, entity) => entities[entity.toLowerCase()] || `&${entity};`);
}

function formatTelegramPostTime(value = "") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "канал";
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function readUsers() {
  try {
    const rawUsers = await readFile(USERS_FILE, "utf8");
    const users = JSON.parse(rawUsers);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeUsers(users) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function upsertUser(user, options = {}) {
  const users = await readUsers();
  const existingIndex = users.findIndex((item) => item.email === user.email);

  if (existingIndex >= 0) {
    if (options.rejectExistingPassword && users[existingIndex].passwordHash) {
      const error = new Error("Account already exists");
      error.statusCode = 409;
      throw error;
    }

    users[existingIndex] = {
      ...users[existingIndex],
      ...user,
      createdAt: users[existingIndex].createdAt || user.createdAt,
      updatedAt: user.updatedAt,
    };
  } else {
    users.unshift(user);
  }

  await writeUsers(users);
  return users;
}

async function createSessionToken(email) {
  const users = await readUsers();
  const index = users.findIndex((item) => item.email === email);
  if (index < 0) return "";

  const token = createToken();
  const now = new Date().toISOString();
  const sessions = Array.isArray(users[index].sessions) ? users[index].sessions.slice(-8) : [];
  sessions.push({
    tokenHash: hashToken(token),
    createdAt: now,
    lastUsedAt: now,
  });
  users[index] = {
    ...users[index],
    sessions,
    updatedAt: now,
  };
  await writeUsers(users);
  return token;
}

async function verifySessionToken(email, token) {
  if (!email || !token) return false;
  const users = await readUsers();
  const index = users.findIndex((item) => item.email === email);
  if (index < 0) return false;

  const tokenHash = hashToken(token);
  const sessions = Array.isArray(users[index].sessions) ? users[index].sessions : [];
  const sessionIndex = sessions.findIndex((session) => session.tokenHash === tokenHash);
  if (sessionIndex < 0) return false;

  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    lastUsedAt: new Date().toISOString(),
  };
  users[index] = {
    ...users[index],
    sessions,
  };
  await writeUsers(users);
  return true;
}

async function createPasswordResetToken(email) {
  const tokens = await readPasswordResetTokens();
  const token = createToken();
  const now = Date.now();
  tokens.push({
    email,
    tokenHash: hashToken(token),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + RESET_TOKEN_TTL_MS).toISOString(),
  });
  await writePasswordResetTokens(tokens.filter((item) => new Date(item.expiresAt).getTime() > now));
  return token;
}

async function consumePasswordResetToken(email, token) {
  const tokens = await readPasswordResetTokens();
  const now = Date.now();
  const tokenHash = hashToken(token);
  const index = tokens.findIndex((item) => item.email === email && item.tokenHash === tokenHash && new Date(item.expiresAt).getTime() > now);
  if (index < 0) {
    await writePasswordResetTokens(tokens.filter((item) => new Date(item.expiresAt).getTime() > now));
    return false;
  }

  tokens.splice(index, 1);
  await writePasswordResetTokens(tokens.filter((item) => new Date(item.expiresAt).getTime() > now));
  return true;
}

async function readPasswordResetTokens() {
  try {
    const rawTokens = await readFile(RESET_TOKENS_FILE, "utf8");
    const tokens = JSON.parse(rawTokens);
    return Array.isArray(tokens) ? tokens : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writePasswordResetTokens(tokens) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
}

async function updateUserPassword(email, password) {
  const users = await readUsers();
  const index = users.findIndex((item) => item.email === email);
  if (index < 0) return null;

  users[index] = {
    ...users[index],
    passwordHash: hashPassword(password),
    sessions: [],
    updatedAt: new Date().toISOString(),
  };
  await writeUsers(users);
  return users[index];
}

async function createTelegramLinkCode(email) {
  const users = await readUsers();
  const index = users.findIndex((item) => item.email === email);
  if (index < 0) return "";

  const code = crypto.randomBytes(12).toString("hex");
  const now = Date.now();
  users[index] = {
    ...users[index],
    telegramLink: {
      codeHash: hashToken(code),
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + TELEGRAM_LINK_TTL_MS).toISOString(),
    },
    updatedAt: new Date(now).toISOString(),
  };
  await writeUsers(users);
  return code;
}

async function consumeTelegramLinkCode(code, telegramUser = {}) {
  if (!code) return null;

  const users = await readUsers();
  const now = Date.now();
  const codeHash = hashToken(code);
  const index = users.findIndex((user) => {
    const link = user.telegramLink || {};
    return link.codeHash === codeHash && new Date(link.expiresAt || 0).getTime() > now;
  });
  if (index < 0) return null;

  const telegramUsername = normalizeTelegramHandle(telegramUser.username || "");
  users[index] = {
    ...users[index],
    telegram: telegramUsername || users[index].telegram || "",
    telegramChatId: String(telegramUser.id || ""),
    telegramFirstName: String(telegramUser.first_name || "").slice(0, 80),
    telegramLinkedAt: new Date(now).toISOString(),
    telegramLink: null,
    updatedAt: new Date(now).toISOString(),
  };
  await writeUsers(users);
  return users[index];
}

async function handleTelegramWebhook(update = {}) {
  const message = update.message || update.edited_message;
  const text = String(message?.text || "").trim();
  const from = message?.from || {};
  const chatId = message?.chat?.id || from.id;
  if (!chatId || !text) return;

  const [, command = "", payload = ""] = text.match(/^\/(\w+)(?:\s+(.+))?/) || [];
  if (command.toLowerCase() === "start" && payload) {
    const user = await consumeTelegramLinkCode(String(payload).trim(), from);
    if (user) {
      await sendTelegramMessage(chatId, [
        "Telegram привязан к BYA MarketDesk.",
        "",
        "Теперь ссылки восстановления пароля будут приходить сюда бесплатно.",
      ].join("\n"));
      return;
    }

    await sendTelegramMessage(chatId, "Код привязки не найден или уже истек. Вернитесь в BYA MarketDesk и запросите новую ссылку Telegram.");
    return;
  }

  await sendTelegramMessage(chatId, "Откройте BYA MarketDesk и нажмите привязку Telegram в аккаунте. Бот нужен для восстановления пароля.");
}

async function sendPasswordResetTelegram(user = {}, resetLink) {
  if (!user.telegramChatId) return { sent: false, reason: "telegram_not_linked" };

  return sendTelegramMessage(user.telegramChatId, [
    "BYA MarketDesk: восстановление пароля",
    "",
    "Вы запросили сброс пароля. Ссылка действует 30 минут:",
    resetLink,
    "",
    "Если это были не вы, просто проигнорируйте сообщение.",
  ].join("\n"));
}

function isTelegramConfigured() {
  return Boolean(TELEGRAM_BOT_TOKEN);
}

async function sendTelegramMessage(chatId, text) {
  if (!isTelegramConfigured()) {
    console.log(`Telegram fallback for ${chatId}: ${text}`);
    return { sent: false, reason: "telegram_not_configured" };
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Telegram failed: ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
  }

  return { sent: true };
}

async function sendPasswordResetEmail(email, resetLink) {
  const subject = "BYA MarketDesk: восстановление пароля";
  const text = [
    "Вы запросили восстановление пароля в BYA MarketDesk.",
    "",
    `Ссылка действует 30 минут: ${resetLink}`,
    "",
    "Если это были не вы, просто проигнорируйте письмо.",
  ].join("\n");

  const html = renderEmailLayout({
    title: "Восстановление пароля",
    intro: "Вы запросили восстановление пароля в BYA MarketDesk.",
    actionLabel: "Сбросить пароль",
    actionUrl: resetLink,
    note: "Ссылка действует 30 минут. Если это были не вы, просто проигнорируйте письмо.",
  });

  await sendEmail({
    to: email,
    subject,
    text,
    html,
    fallbackLog: `Password reset link for ${email}: ${resetLink}`,
  });
}

async function sendWelcomeEmail(user = {}, baseUrl = PUBLIC_BASE_URL) {
  const email = normalizeEmail(user.email);
  if (!email) return;

  const dashboardUrl = `${String(baseUrl || PUBLIC_BASE_URL).replace(/\/$/, "")}/#portfolio-page`;
  const subject = "BYA MarketDesk: аккаунт создан";
  const text = [
    `Здравствуйте, ${user.name || "BYA user"}!`,
    "",
    "Ваш аккаунт BYA MarketDesk создан и привязан к этой почте.",
    "Теперь на этот email будут приходить письма восстановления доступа.",
    "",
    `Открыть кабинет: ${dashboardUrl}`,
  ].join("\n");
  const html = renderEmailLayout({
    title: "Аккаунт BYA MarketDesk создан",
    intro: `Здравствуйте, ${escapeHtml(user.name || "BYA user")}! Ваш аккаунт привязан к этой почте.`,
    actionLabel: "Открыть кабинет",
    actionUrl: dashboardUrl,
    note: "На этот email будут приходить письма восстановления доступа и важные уведомления аккаунта.",
  });

  await sendEmail({
    to: email,
    subject,
    text,
    html,
    fallbackLog: `Welcome email for ${email}: ${dashboardUrl}`,
  });
}

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && EMAIL_FROM);
}

async function sendEmail({ to, subject, text, html, fallbackLog }) {
  if (!isEmailConfigured()) {
    console.log(fallbackLog || `Email fallback for ${to}: ${subject}`);
    return { sent: false, reason: "email_not_configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Email failed: ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
  }

  return { sent: true };
}

function renderEmailLayout({ title, intro, actionLabel, actionUrl, note }) {
  return `<!doctype html>
<html lang="ru">
  <body style="margin:0;background:#f3f7f6;font-family:Arial,Helvetica,sans-serif;color:#101820;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7f6;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #d9e8e4;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:22px 24px;background:#101820;color:#ffffff;">
                <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#55d6be;">BYA MarketDesk</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.55;">${intro}</p>
                <a href="${escapeAttribute(actionUrl)}" style="display:inline-block;padding:12px 18px;border-radius:8px;background:#159986;color:#ffffff;text-decoration:none;font-weight:700;">${escapeHtml(actionLabel)}</a>
                <p style="margin:20px 0 0;font-size:13px;line-height:1.55;color:#456;">${escapeHtml(note)}</p>
                <p style="margin:16px 0 0;font-size:12px;line-height:1.45;color:#789;">Если кнопка не открывается, скопируйте ссылку: <br><a href="${escapeAttribute(actionUrl)}" style="color:#159986;">${escapeHtml(actionUrl)}</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

async function upsertUserPortfolio(email, portfolioData) {
  const users = await readUsers();
  const now = new Date().toISOString();
  const existingIndex = users.findIndex((item) => item.email === email);
  const normalized = normalizePortfolioData(portfolioData);

  if (existingIndex >= 0) {
    users[existingIndex] = {
      ...users[existingIndex],
      portfolioData: normalized,
      portfolioDataUpdatedAt: now,
      updatedAt: now,
    };
  } else {
    users.unshift({
      name: email.split("@")[0] || "BYA user",
      email,
      role: "Investor",
      createdAt: now,
      updatedAt: now,
      portfolioData: normalized,
      portfolioDataUpdatedAt: now,
    });
  }

  await writeUsers(users);
  return users[existingIndex >= 0 ? existingIndex : 0];
}
