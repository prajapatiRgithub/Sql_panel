const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false, //true
    port: 25, //465
    auth: {
        user: 'jaini.shivinfotech@gmail.com',
        pass: 'jaini.shivinfotech_16@'
    }
});

const OTPsend = (email, otp) => {
    let mailDetail = {
        to: email,
        subject: "OTP for new Password",
        html: "<h3>Please click on given link to reset yout password </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    }

    transporter.sendMail(mailDetail, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = {OTPsend};