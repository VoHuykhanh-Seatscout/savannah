import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
  
  const verificationLink = `${BASE_URL}/verify?token=${encodeURIComponent(token)}`;

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
    subject: "Welcome to Savannah - Please verify your email",
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
            background: linear-gradient(135deg, #EA580C, #F97316);
            color: white;
            text-decoration: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-weight: 600;
            margin: 24px 0;
          }
          .button:hover {
            background: linear-gradient(135deg, #C2410C, #EA580C);
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
          .info {
            background: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 16px;
            margin: 24px 0;
            border-radius: 8px;
          }
          .info p {
            margin: 0;
            font-size: 14px;
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
            <h1>Welcome to Savannah, ${email.split('@')[0]}! 👋</h1>
            
            <p>Thank you for registering for the Savannah Job Readiness Program. We're excited to help you build the skills you need for a successful career.</p>
            
            <p>Please verify your email address to get started with your training journey.</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <div class="info">
              <p>🔗 <strong>Verification link expires in 30 minutes</strong></p>
              <p style="margin-top: 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="link-box">${verificationLink}</div>
            </div>
            
            <p>If you didn't create an account with Savannah, you can safely ignore this email.</p>
            
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
Welcome to Savannah!

Thank you for registering for the Savannah Job Readiness Program.

Please verify your email by clicking this link:
${verificationLink}

This link will expire in 30 minutes.

If you didn't create an account with Savannah, please ignore this email.

Best regards,
The Savannah Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${email}:`, error);
    throw error;
  }
}