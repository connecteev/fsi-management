const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'md.arif.ask@gmail.com',
    pass: 'uH;[j(Y[*+.925i'
  }
});
const sentRestPassMail = (email, link, message) => {
  const mailOptions = {
    from: 'support@mdashikar.com', // sender address
    to: email, // list of receivers
    subject: 'Reset password link', // Subject line
    html: `<p>Please click the link below to ${message}</p><br> <a href="${link}">Click me.</a>`
  }
  return mailOptions
}


module.exports = {
  transporter,
  sentRestPassMail
};
