import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import crypto from "crypto";

const PORT = 3000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// リダイレクトURL生成処理
const createRedirectUrl = () => {
  const bytes = crypto.randomBytes(32);
  const state = bytes.toString("base64url");

  const redirectUrl =
    "https://access.line.me/oauth2/v2.1/authorize?" +
    "response_type=code" +
    `&client_id=${process.env.CHANNEL_ID}` +
    `&redirect_uri=${process.env.CALLBACK_URL}` +
    `&state=${state}` +
    "&scope=profile%20openid";
  return redirectUrl;
};

// ルートパスへのリクエスト
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// ログイン要求のリクエスト
app.get("/login", (req, res) => {
  const redirect = createRedirectUrl(state);
  res.redirect(redirect);
});

// ログイン後のリクエスト
app.get("/success", (req, res) => {
  res.status(200).send("success");
});

// リッスンするポートの設定
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
