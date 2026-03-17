// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let confirmationResult;
let isVerified = false;

// OTP
function sendOTP() {
  const phone = document.getElementById("phone").value;

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP Sent ✅");
    })
    .catch(() => alert("Error sending OTP ❌"));
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  confirmationResult.confirm(otp)
    .then(() => {
      alert("Verified ✅");
      isVerified = true;
    })
    .catch(() => alert("Invalid OTP ❌"));
}

// Submit
async function sendRequest() {

    // if (!isVerified) {
    //  document.getElementById("response").innerText = "Verify OTP first ⚠️";
    // return;
    // }

  const requestType = document.getElementById("requestType").value;
  let dateValue = document.getElementById("date").value;

  // If instant → set today's date
  if (requestType === "instant") {
    dateValue = new Date().toISOString().split("T")[0];
  }

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    upi: document.getElementById("upi").value,
    account: document.getElementById("account").value,
    exchangeType: document.getElementById("exchangeType").value,
    requestType: requestType,
    amount: document.getElementById("amount").value,
    date: dateValue
  };

  // Validation
  if (!data.name || !data.phone || !data.upi || !data.exchangeType || !data.requestType || !data.amount) {
    document.getElementById("response").innerText = "Fill all required (*) fields ⚠️";
    return;
  }

  if (data.requestType === "scheduled" && !data.date) {
    document.getElementById("response").innerText = "Select a date for scheduled request ⚠️";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    document.getElementById("response").innerText = result.message;

  } catch {
    document.getElementById("response").innerText = "Server error ❌";
  }
}