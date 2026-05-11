import nodemailer from "nodemailer";
import config from "../config";
import { MailOptions } from "nodemailer/lib/smtp-transport";

// Base email sending function
const sendEmail = async (email: string, html: string, subject: string) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: config.sender_email,
				pass: config.sender_app_pass,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		// Email configuration
		const mailOptions: MailOptions = {
			from: "krishantraders1992@gmail.com",
			to: email,
			subject,
			html,
		};

		// Sending the email
		const info = await transporter.sendMail(mailOptions);
		// console.log('Email sent:', info.messageId);
		return info;
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send email");
	}
};

// Email for Code
export const sendPasswordResetEmail = async (
	email: string,
	resetCode: number,
	userName?: string,
) => {
	const subject = `Password Reset Code - Krishan Traders`;

	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-flex; align-items: center; justify-content: center;">
            <div style="width: 32px; height: 32px; background-color: #16a34a; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">
              <span style="color: white; font-size: 18px;">🌱</span>
            </div>
            <h1 style="color: #16a34a; margin: 0; font-size: 28px; font-weight: bold;">Krishan Traders</h1>
          </div>
        </div>

        <!-- Main Content -->
        <h2 style="color: #1f2937; margin-bottom: 20px; text-align: center;">Password Reset Code</h2>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 15px;">
          Dear ${userName || "User"},
        </p>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
          We received a request to reset your password for your Krishan Traders account. If you didn't make this request, you can safely ignore this email.
        </p>
        
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
          Use the verification code below to reset your password:
        </p>

        <!-- Reset Code Display -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8fafc; border: 2px dashed #16a34a; padding: 20px; border-radius: 10px; display: inline-block;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
              Your Reset Code
            </p>
            <div style="background-color: #16a34a; color: white; padding: 15px 25px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
              ${resetCode}
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 25px 0; border-radius: 5px;">
          <p style="color: #1e40af; font-size: 14px; margin: 0; font-weight: 500;">
            📋 Instructions: Enter this code on the password reset page to create your new password.
          </p>
        </div>

        <!-- Security Notice -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 5px;">
          <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
            🔒 Security Notice: This verification code will expire in 15 minutes for your security.
          </p>
        </div>

        <!-- Support Info -->
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If you're having trouble resetting your password or didn't request this reset, please contact our support team immediately.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 5px;">
            <strong>Email:</strong> krishantraders1992@gmail.com
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            <strong>Phone:</strong>  +8801787844888
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #16a34a; margin: 0; font-weight: bold;">
            Best regards,<br>
            Krishan Traders Team
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 15px;">
            © 2024 Krishan Traders. All rights reserved.<br>
            Quality Agricultural Products & Services
          </p>
        </div>
      </div>
      
      <!-- Footer Disclaimer -->
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px; line-height: 1.4;">
          This email was sent to ${email}. If you did not request this password reset, please ignore this email.
        </p>
      </div>
    </div>
  `;

	return sendEmail(email, html, subject);
};
