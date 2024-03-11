const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from a config.env file

const transporter = nodemailer.createTransport({
    host: process.env.Email_host,
    port: process.env.Email_port,
    secure: false, 
    auth: {
        user: process.env.Email_userName,
        pass: process.env.Email_password,
    },
});

async function sendEmail(mailOptions) {

    await transporter.sendMail({
        from: 'Esor <esor>',//name of sender
        to: mailOptions.userEmail,//email of receiver
        subject: mailOptions.subject,//email subject
        text: mailOptions.message,//actual message
    });
    console.log('Email sent successfully');
}

module.exports = sendEmail;
