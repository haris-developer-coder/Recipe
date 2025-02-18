const nodemailer = require('nodemailer');
require('dotenv').config();

exports.SendEmail = async (from, to, subject, text, html) => {

                const tranporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth:{
                        user: process.env.APP_EMAIL,
                        pass: process.env.APP_PASSWORD
                    },
                    tls: {
                        rejectUnauthorized: false,
                    }
                })

                await tranporter.sendMail({
                    from,
                    to,
                    subject,
                    text,
                    html
                });

                return true;
            }