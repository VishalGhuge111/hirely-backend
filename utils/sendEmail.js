const axios = require("axios");

const sendEmail = async ({ to, otp, type }) => {
  // ---- CONTENT BASED ON TYPE ----
  let title = "";
  let description = "";
  let footerNote = "";

  if (type === "VERIFY_EMAIL") {
    title = "Verify your email";
    description = "Use the OTP below to complete your Hirely signup";
    footerNote =
      "If you didn’t create a Hirely account, you can safely ignore this email.";
  }

  if (type === "RESET_PASSWORD") {
    title = "Reset your password";
    description = "Use the OTP below to reset your Hirely password";
    footerNote =
      "If you didn’t request a password reset, you can safely ignore this email.";
  }

  const htmlContent = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#eaf6ff;padding:24px 12px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:3px solid #000000;box-shadow:8px 8px 0 #000000;">

      <!-- LOGO -->
      <div style="padding:20px;border-bottom:3px solid #000000;text-align:center;background:#ffffff;">
        <div style="display:inline-block;padding:10px 16px;border:3px solid #000000;background:#ffffff;box-shadow:4px 4px 0 #000000;">
          <img
            src="https://raw.githubusercontent.com/VishalGhuge111/hirely-frontend/main/src/assets/logo.png"
            alt="Hirely"
            width="120"
            style="display:block;"
          />
        </div>
        <p style="margin-top:12px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#000000;">
          APPLY SMARTER. GET HIRED FASTER.
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:28px 22px;text-align:center;">
        <h2 style="margin:0 0 12px 0;font-size:22px;color:#000000;">
          ${title}
        </h2>

        <p style="font-size:14px;color:#333333;margin-bottom:20px;">
          ${description}
        </p>

        <div style="display:inline-block;padding:14px 28px;border:3px dashed #00a8cc;font-size:26px;font-weight:800;letter-spacing:6px;color:#000000;background:#f0faff;">
          ${otp}
        </div>

        <p style="margin-top:16px;font-size:13px;color:#555555;">
          This OTP is valid for <b>10 minutes</b>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="padding:16px 20px;border-top:3px solid #000000;background:#f9fafb;text-align:center;">
        <p style="font-size:12px;color:#555555;line-height:1.6;margin:0;">
          ${footerNote}
        </p>
        <p style="font-size:11px;color:#888888;margin-top:8px;">
          © ${new Date().getFullYear()} Hirely Platform
        </p>
      </div>

    </div>
  </div>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "HIRELY Platform",
        email: "skyplus049@gmail.com",
      },
      to: [{ email: to }],
      subject:
        type === "RESET_PASSWORD"
          ? "RESET YOUR HIRELY PASSWORD"
          : "VERIFY YOUR HIRELY EMAIL",
      htmlContent,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = sendEmail;