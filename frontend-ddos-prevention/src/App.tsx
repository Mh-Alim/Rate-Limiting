import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import axios from "axios";
import "./App.css";

function App() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    await axios.post("http://localhost:3000/verify-otp", {
      email,
      otp,
      newPassword,
      token,
    });
  };
  return (
    <div>
      <div>token: {token}</div>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />{" "}
      <br />
      <input
        type="text"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />{" "}
      <br />
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
        }}
      />{" "}
      <br />
      <Turnstile
        siteKey="0x4AAAAAAA1vuO-jMniG99F0"
        onSuccess={(token) => setToken(token)}
      />
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
}

export default App;
