const nodemailer = require('nodemailer')

async function sendEmail(mailOptions) {
    // console.log(mailOptions.userEmail);
    // console.log(mailOptions.message);
    // console.log(mailOptions.subject);
    console.log("before transporter");
    const transporter = nodemailer.createTransport({
        host:process.env.Email_host,
        port:process.env.Email_port,
        auth: {
            user:process.env.Email_userName,
            pass:process.env.Email_password
        }
    });
    console.log("after transporter");
    // send mail with defined transport object
    try {

        await transporter.sendMail({
            from: "Esor Travel and Tour <esortravel@gmail.com>", // sender address
            to: mailOptions.userEmail, // list of receivers
            subject: mailOptions.subject, // Subject line
            text: mailOptions.message, // text body
        });
        console.log("aftr mail");
    } catch (e) {
        console.log(e)
    }
}
module.exports=sendEmail