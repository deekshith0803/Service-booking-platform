import nodemailer from "nodemailer";

const sendResetPasswordEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;

    const mailOptions = {
        from: `"Service Booking Platform" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You requested a password reset. Please click the button below to reset your password. This link will expire in 1 hour.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If the button doesn't work, copy and paste the following link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">Service Booking Platform &copy; 2026</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
