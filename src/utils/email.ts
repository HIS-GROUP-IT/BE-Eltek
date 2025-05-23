import { SEND_GRID_API_KEY } from "@/config";
import sgMail from "@sendgrid/mail";
const apiKey ="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" 
sgMail.setApiKey(apiKey);

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const msg = {
      to: to,
      from: "kwanele.ndaba@hisgroup-it.co.za",
      subject: subject,
      text: text,
      html: html,
    };
    console.log("PPPPP", msg);
    const res = await sgMail.send(msg);
  } catch (e) {
    console.log("RESS", e.response.body.errors);
  }
}

export const resetPasswordTemplate = function (
  userName: string,
  email: string,
  otp: string
) {
  return `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #333333;
        }

        p {
            margin-bottom: 20px;
        }

        .link-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .link-button:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Dear ${userName},</h1>

        <p>We have received a request to reset the password. If you did not initiate this request, please ignore this email.</p>

        <p>To reset your password, please use the following OTP:<strong>${otp}</strong></p>

        <!-- Additional email content here -->

    </div>
</body>

</html>
`;
};

export const welcomeEmployeeTemplate = function (
  employeeName: string,
  companyName: string,
  resetLink: string,
  supportEmail: string = "support@company.com",
  expiryHours: number = 72
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Open+Sans:wght@400;600&display=swap');
            
            body {
                font-family: 'Open Sans', sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #334155;
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
            }
            
            .header {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
                position: relative;
            }
            
            .welcome-badge {
                background: white;
                color: #1d4ed8;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 36px;
                font-weight: 600;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .company-name {
                font-family: 'Poppins', sans-serif;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
            }
            
            .content {
                padding: 40px;
            }
            
            h1 {
                color: #1e293b;
                margin-top: 0;
                font-weight: 600;
                font-size: 24px;
                font-family: 'Poppins', sans-serif;
            }
            
            .text {
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .highlight-box {
                background: #f1f5f9;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
                text-align: center;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
                font-family: 'Poppins', sans-serif;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
            }
            
            .footer {
                text-align: center;
                padding: 30px;
                background: #f1f5f9;
                color: #64748b;
                font-size: 14px;
            }
            
            .steps {
                margin: 30px 0;
            }
            
            .step {
                display: flex;
                margin-bottom: 20px;
                align-items: flex-start;
            }
            
            .step-number {
                background: #3b82f6;
                color: white;
                min-width: 26px;
                height: 26px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 14px;
                font-weight: 600;
                margin-top: 2px;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-title {
                font-weight: 600;
                margin-bottom: 5px;
                color: #1e293b;
            }
            
            .support-note {
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
                margin-top: 30px;
                font-size: 15px;
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <div class="welcome-badge">👋</div>
                <div class="company-name">${companyName}</div>
                <h1>Welcome to the Team!</h1>
            </div>
            
            <div class="content">
                <p class="text">Dear ${employeeName},</p>
                
                <p class="text">We're thrilled to welcome you to ${companyName}! To get you started, we've created your account and prepared everything you'll need for your first day.</p>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <div class="step-title">Set Up Your Password</div>
                            <p>Click the button below to create your secure password and access your account.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <div class="step-title">Complete Your Profile</div>
                            <p>After logging in, please complete your employee profile and upload any required documents.</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <div class="step-title">Explore Your Dashboard</div>
                            <p>Familiarize yourself with our platform and check your onboarding schedule.</p>
                        </div>
                    </div>
                </div>
                
                <div class="highlight-box">
                    <p style="margin-bottom: 20px;"><strong>Ready to get started?</strong></p>
                    <a href="${resetLink}" class="cta-button">Set Up Your Account</a>
                    <p style="margin-top: 20px; font-size: 14px; color: #64748b;">This link expires in ${expiryHours} hours</p>
                </div>
                
                <p class="text">We've prepared resources to help you get acquainted with our company culture, values, and processes. You'll find these in your dashboard after login.</p>
                
                <div class="support-note">
                    <p>If you encounter any issues or have questions, our support team is here to help at <a href="mailto:${supportEmail}" style="color: #3b82f6; text-decoration: none;">${supportEmail}</a>.</p>
                </div>
                
                <p class="text">We're excited to have you on board and look forward to working together!</p>
                
                <p class="text">Warm regards,<br>The ${companyName} Team</p>
            </div>
            
            <div class="footer">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                <p style="margin-top: 10px; font-size: 13px;">This email was sent to you as part of your onboarding process.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const otpEmailTemplate = function (
  recipientName: string,
  otpCode: string,
  companyName: string,
  purpose: string = "Reset Password",
  expiryMinutes: number = 5
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            :root {
                --primary: #7c3aed;
                --primary-light: #8b5cf6;
                --dark: #1e293b;
                --light: #f8fafc;
                --gray: #64748b;
            }
            
            body {
                font-family: 'Poppins', sans-serif;
                background-color: #f1f5f9;
                margin: 0;
                padding: 0;
                color: var(--dark);
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            }
            
            .header {
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
                position: relative;
                   color:rgb(13, 0, 0); 
    text-shadow: 0 1px 3px rgba(112, 80, 240, 0.2); 
            }
            
            .otp-display {
                background: white;
                color: var(--primary);
                width: 220px;
                margin: 20px auto;
                padding: 20px;
                border-radius: 12px;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 8px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                position: relative;
                overflow: hidden;
            }
            
            .otp-display::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
            }
            
            .content {
                padding: 40px;
            }
            
            h1 {
                color: var(--dark);
                margin-top: 0;
                font-weight: 600;
                font-size: 26px;
                text-align: center;
            }
            
            .text {
                font-size: 16px;
                margin-bottom: 20px;
                color: var(--gray);
            }
            
            .highlight-box {
                background: #f8fafc;
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
                border: 1px solid #e2e8f0;
            }
            
            .footer {
                text-align: center;
                padding: 30px;
                background: #f8fafc;
                color: var(--gray);
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
            }
            
            .steps {
                margin: 30px 0;
            }
            
            .step {
                display: flex;
                margin-bottom: 20px;
                align-items: flex-start;
            }
            
            .step-icon {
                background: var(--primary);
                color: white;
                min-width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 14px;
                font-weight: 600;
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-title {
                font-weight: 600;
                margin-bottom: 5px;
                color: var(--dark);
            }
            
            .security-note {
                background: #fff5f5;
                border-left: 4px solid #ef4444;
                padding: 15px;
                margin: 25px 0;
                font-size: 14px;
                color: #7f1d1d;
                border-radius: 0 8px 8px 0;
            }
            
            .expiry-notice {
                color: var(--primary);
                font-weight: 500;
                text-align: center;
                margin: 15px 0;
                font-size: 14px;
            }
            
            .pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <h1>Your Secure Access Code</h1>
                <p>For ${purpose} at ${companyName}</p>
            </div>
            
            <div class="content">
                <p class="text">Hello ${recipientName},</p>
                
                <p class="text">We're sending you this one-time verification code to reset your password.</p>
                
                <div class="highlight-box pulse">
                    <div class="otp-display">${otpCode}</div>
                    <p class="expiry-notice">⏳ Expires in ${expiryMinutes} minutes</p>
                </div>
                
                <div class="steps">
                    <div class="step">
                        <div class="step-icon">1</div>
                        <div class="step-content">
                            <div class="step-title">Enter this code</div>
                            <p>Copy or type the code above in the reset password page</p>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-icon">2</div>
                        <div class="step-content">
                            <div class="step-title">Complete reset password process</div>
                            <p>Submit the code before it expires to proceed</p>
                        </div>
                    </div>
                </div>
                
                <div class="security-note">
                    <p><strong>Security Alert:</strong> Never share this code with anyone. ${companyName} will never ask you for this code via phone, email, or text.</p>
                </div>
                
                <p class="text">If you didn't request this code, please secure your account by changing your password immediately and contact our support team.</p>
                
                <p class="text">Stay secure,<br>The ${companyName} Team</p>
            </div>
            
            <div class="footer">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
                <p style="margin-top: 10px;">This is an automated message - please do not reply directly to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
