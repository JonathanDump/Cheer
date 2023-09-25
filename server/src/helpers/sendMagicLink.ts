import envReader from "./envReader";

const nodemailer = require("nodemailer");

export default async function sendMagicLink({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const link = `${envReader("SERVER_URL")}/log-in/verify?token=${token}`;

  const message = `<a href="${link}">Log In</a>`;

  const transporter = nodemailer.createTransport({
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
      user: "jonathan_dump@ukr.net",
      pass: envReader("UKR_NET_PASSWORD"),
    },
  });

  const mailOptions = {
    from: "jonathan_dump@ukr.net",
    to: email,
    subject: "2FA",
    html: message,
  };

  return new Promise<boolean>((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error: Error, info: any) {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
