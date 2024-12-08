import express from "express";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const generateOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // Limit each IP to 10 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const verifyOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5, // Limit each IP to 10 requests per `window` (here, per 5 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// store is simulating the db here
const store: Record<string, string> = {};
app.get("/health", (req: any, res: any) => {
  return res.json({
    message: "server is health",
  });
});

app.post("/generate-otp", generateOtpLimiter, (req: any, res: any) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  store[email] = otp;
  console.log("generated otp: ", otp);
  return res.json({
    message: "otp is sent to your email",
  });
});

app.post("/verify-otp", verifyOtpLimiter, async (req: any, res: any) => {
  const { email, otp, newPassword, token } = req.body;
  console.log("comming here");
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "fill all the fields" });


  // this code is for captcha to prevent script to access this endpoint. ( to prevent ddos )
  const formData = new FormData();
  formData.append("secret", process.env.CLOUDFLARE_SECRET || "");
  formData.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });
  const challengeSucceeded = (await result.json()).success;
  console.log(challengeSucceeded);

  if (!challengeSucceeded) {
    return res.status(403).json({ message: "Invalid reCAPTCHA token" });
  }
  if (store[email] === otp) {
    // verified otp
    console.log(`Password is updated to ${newPassword}`);
    return res.status(200).json({
      message: "Password updated",
    });
  }

  return res.status(400).json({ message: "Invalid otp" });
});

app.listen(3000, () => {
  console.log(`server is running on http://localhost:3000`);
});
