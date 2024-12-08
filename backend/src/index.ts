import express from "express";

const app = express();

app.use(express.json());

// store is simulating the db here
const store: Record<string, string> = {};
app.get("/health", (req: any, res: any) => {
  return res.json({
    message: "server is health",
  });
});

app.post("/generate-otp", (req: any, res: any) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  store[email] = otp;
  console.log("generated otp: ", otp);
  return res.json({
    message: "otp is sent to your email",
  });
});

app.post("/verify-otp", (req: any, res: any) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "fill all the fields" });

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
