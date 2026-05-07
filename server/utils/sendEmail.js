const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"Learn Language App" <${process.env.EMAIL_USER}>`,
        to, subject, html,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;