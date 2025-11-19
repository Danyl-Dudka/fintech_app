export default function forgotPasswordTemplate(code) {
  return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color:#4b7bec;">Password Reset Request</h2>
          <p>Use the following code to reset your password:</p>
          <div style="font-size:24px; font-weight:700; letter-spacing:4px; color:#2d3436; margin: 20px auto; text-align: center">
            ${code}
          </div>
          <p>This code will expire in <b>15 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this message.</p>
          <hr/>
          <p style="font-size:12px; color:#888;">© ${new Date().getFullYear()} Spendora</p>
        </div>
    `;
}
