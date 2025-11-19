export function emailVerificationTemplate(fullname, code) {
  return `
      <div style="
    font-family: Arial, sans-serif;
    max-width: 480px;
    margin: auto;
    padding: 24px;
    border-radius: 12px;
    background: #ffffff;
    border: 1px solid #e6e8ec;
  ">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 26px; color: #4b7bec;">Spendora</h1>
      <p style="margin: 4px 0 0; font-size: 14px; color: #636e72;">
        Financial Control Made Simple
      </p>
    </div>

    <h2 style="color:#2d3436; font-size: 20px; text-align: center;">
      Welcome, ${fullname}!
    </h2>

    <p style="font-size: 16px; color:#2d3436; text-align: center;">
      Please verify your email address using the code below:
    </p>

    <div style="
      margin: 24px auto;
      text-align: center;
      padding: 16px;
      border-radius: 10px;
      background: #f1f2f6;
      border: 1px dashed #b2bec3;
      width: fit-content;
    ">
      <span style="
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 8px;
        color: #2d3436;
      ">
        ${code}
      </span>
    </div>

    <p style="font-size: 14px; color:#636e72; text-align:center;">
      This code will expire in <b>15 minutes</b>.
    </p>

    <hr style="margin: 28px 0; border: none; border-top: 1px solid #dfe6e9;" />

    <p style="
      font-size: 12px;
      color:#b2bec3;
      text-align:center;
      margin-top: 16px;
    ">
      © ${new Date().getFullYear()} Spendora — All rights reserved.
    </p>
  </div>
    `;
}
