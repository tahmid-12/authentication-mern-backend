import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io", // Mailtrap's SMTP server
    port: 2525,              // Default Mailtrap port
    auth: {
        user: process.env.MAILTRAP_USER, // Replace with your Mailtrap username
        pass: process.env.MAILTRAP_PASSWORD, // Replace with your Mailtrap password
    },
});

export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Tahmid",
};

// Optional: A test function to verify the transporter
// export const sendTestEmail = async () => {
//     try {
//         const mailOptions = {
//             from: '"Test Sender" <test@example.com>', // Sender address
//             to: "mdtahmidchowdhury12@gmail.com",     // Recipient address
//             subject: "Test Email from Mailtrap",     // Subject line
//             text: "This is a test email!",          // Plain text body
//             html: "<b>This is a test email!</b>",   // HTML body
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("Message sent:", info.messageId);
//     } catch (error) {
//         console.error("Error sending email:", error);
//     }
// };
