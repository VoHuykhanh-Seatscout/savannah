// app/lib/mailer.ts
import nodemailer from "nodemailer";

// Add this function for password reset emails
export async function sendPasswordResetEmail(email: string, token: string) {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  const resetLink = `${BASE_URL}/auth/reset-password/confirm?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Savannah Program <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Savannah Account Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1F2937;
            background-color: #FFFBEB;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 560px;
            margin: 40px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #EA580C, #F97316);
            padding: 48px 32px;
            text-align: center;
          }
          .logo {
            font-size: 36px;
            font-weight: 800;
            color: white;
            margin-bottom: 8px;
          }
          .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
          }
          .content {
            padding: 48px 40px;
          }
          h1 {
            color: #1F2937;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 16px;
          }
          p {
            color: #4B5563;
            margin-bottom: 24px;
          }
          .button {
            display: inline-block;
            background: white;
            color: #EA580C !important;
            text-decoration: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
            border: 2px solid #EA580C;
          }
          .link-box {
            background: #FFFBEB;
            border: 1px solid #FED7AA;
            border-radius: 8px;
            padding: 12px;
            margin: 24px 0;
            word-break: break-all;
            font-size: 14px;
            color: #EA580C;
          }
          .footer {
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9CA3AF;
            border-top: 1px solid #E5E7EB;
          }
          .warning {
            background: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 16px;
            margin: 24px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Savannah</div>
            <div class="subtitle">Job Readiness Program</div>
          </div>
          
          <div class="content">
            <h1>Reset Your Password</h1>
            
            <p>We received a request to reset the password for your Savannah account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <p>🔗 <strong>This link expires in 1 hour</strong></p>
              <p style="margin-top: 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="link-box">${resetLink}</div>
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support.</p>
            
            <p>Best regards,<br>
            <strong>The Savannah Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Savannah Program. All rights reserved.</p>
            <p>Empowering youth through job readiness and financial literacy</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Reset Your Savannah Account Password

We received a request to reset your password. Click this link to create a new password:
${resetLink}

This link expires in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
The Savannah Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error);
    throw error;
  }
}