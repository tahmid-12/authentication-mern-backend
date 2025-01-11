import { transporter, sender } from './mailtrap.js'; // Import the transporter
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    console.log("Send Verification Email", email)
    try {
        const mailOptions = {
            from: sender, // Sender address
            to: email,   // Recipient address
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    console.log("Send Password Reset Email", email);

    try {
        const mailOptions = {
            from: sender, // Sender address
            to: email,    // Recipient address
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        const response = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};
