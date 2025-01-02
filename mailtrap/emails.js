import { transporter, sender } from './mailtrap.js'; // Import the transporter
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';

export const sendVerificationEmail = async (email, verificationToken) => {
    console.log("Send Verification Email", email)
    try {
        const mailOptions = {
            from: sender, // Sender address
            to: email,                                // Recipient address
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