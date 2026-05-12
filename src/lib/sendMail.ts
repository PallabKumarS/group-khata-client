import { config } from "@/server/config";
import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-transport";

// Base email sending function
const sendEmail = async (email: string, html: string, subject: string) => {
  const cfg = await config();
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: cfg.sender_email,
        pass: cfg.sender_app_pass,
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

// Email for Password Reset
export const sendPasswordResetEmail = async (
  email: string,
  resetCode: number,
  userName?: string,
) => {
  const subject = `Password Reset Code - Group Khata`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0; font-size: 28px; font-weight: bold;">Group Khata</h1>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 20px; text-align: center;">Password Reset Code</h2>
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 15px;">Dear ${userName || "User"},</p>
        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">We received a request to reset your password. Use the code below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f8fafc; border: 2px dashed #7c3aed; padding: 20px; border-radius: 10px; display: inline-block;">
            <div style="background-color: #7c3aed; color: white; padding: 15px 25px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
              ${resetCode}
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #7c3aed; margin: 0; font-weight: bold;">Best regards,<br>Group Khata Team</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail(email, html, subject);
};

// Email for Join Request (to Manager)
export const sendJoinRequestEmail = async (
  managerEmail: string,
  memberName: string,
  groupName: string,
) => {
  const subject = `New Join Request - ${groupName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #7c3aed;">New Join Request</h2>
        <p><strong>${memberName}</strong> has requested to join your group <strong>${groupName}</strong>.</p>
        <p>Please log in to your dashboard to accept or reject the request.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #7c3aed; font-weight: bold;">Group Khata Team</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail(managerEmail, html, subject);
};

// Email for Request Status (to Member)
export const sendRequestStatusEmail = async (
  memberEmail: string,
  groupName: string,
  status: "accepted" | "rejected",
) => {
  const subject = `Join Request ${status === "accepted" ? "Accepted" : "Rejected"} - ${groupName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: ${status === "accepted" ? "#10b981" : "#ef4444"};">Request ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        <p>Your request to join <strong>${groupName}</strong> has been <strong>${status}</strong> by the manager.</p>
        ${status === "accepted" ? "<p>You can now view the group details and start making payments.</p>" : ""}
        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #7c3aed; font-weight: bold;">Group Khata Team</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail(memberEmail, html, subject);
};

// Email for Payment Submitted (to Manager)
export const sendPaymentReceivedEmail = async (
  managerEmail: string,
  memberName: string,
  amount: number,
  groupName: string,
) => {
  const subject = `New Payment Received - ${groupName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #7c3aed;">Payment Received</h2>
        <p><strong>${memberName}</strong> has submitted a payment of <strong>৳${amount}</strong> for the group <strong>${groupName}</strong>.</p>
        <p>Please verify the payment from your dashboard.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #7c3aed; font-weight: bold;">Group Khata Team</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail(managerEmail, html, subject);
};

// Email for Payment Reminder (to Member)
export const sendPaymentReminderEmail = async (
  memberEmail: string,
  groupName: string,
  amount: number,
) => {
  const subject = `Payment Due Reminder - ${groupName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px;">
        <h2 style="color: #f59e0b;">Payment Reminder</h2>
        <p>This is a reminder that your payment of <strong>৳${amount}</strong> for <strong>${groupName}</strong> is due.</p>
        <p>Please make the payment as soon as possible to avoid any interruptions.</p>
        <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="color: #7c3aed; font-weight: bold;">Group Khata Team</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail(memberEmail, html, subject);
};
