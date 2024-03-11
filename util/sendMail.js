const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from a .env file

const transporter = nodemailer.createTransport({
    host: process.env.Email_host,
    port: process.env.Email_port,
    secure: false, // Set to true if your server requires a secure connection
    auth: {
        user: process.env.Email_userName,
        pass: process.env.Email_password,
    },
});

async function sendEmail(mailOptions) {
    try {
        await transporter.sendMail({
            from: 'Your Sender Name <' + process.env.Email_userName + '>',
            to: mailOptions.userEmail,
            subject: mailOptions.subject,
            text: mailOptions.message,
        });
        console.log('Email sent successfully');
    } catch (e) {
        console.error('Error sending email:', e);
    }
}

module.exports = sendEmail;
