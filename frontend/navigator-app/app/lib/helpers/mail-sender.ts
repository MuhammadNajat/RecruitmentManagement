var nodemailer = require("nodemailer");

export async function sendMail(subject: string, toEmail: string, body: string) {
    /*var transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SMTP_SERVICE,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
        ignoreTLS: true
    });*/

    var transporter = nodemailer.createTransport({
        //logger: true,
        //debug: true,
        //host: 'smtp.mail.yahoo.com',
        //port: 465,
        //secure: true, // true if using port 465 and then we want to STARTTLS, should be false if using port 587
        service: process.env.NODEMAILER_SMTP_SERVICE,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        },
        //ignoreTLS: true
    });

    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: toEmail,
        subject: subject,
        text: body,
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err : any, response : any) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
}