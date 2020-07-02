const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
    auth : {
      api_key :'9d72a3ccf3fe5d894d71ece1b55f9e1c-913a5827-a73ed355',
      domain : 'sandbox30f1134aec9249aea9678fa0b8f12234.mailgun.org'
    }
  }
  
const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email,subject,text,cb) => {
    const mailOptions = {
        from : email,
        to : '17bit223@ietdavv.edu.in',
        subject,
        text
      }
      transporter.sendMail(mailOptions,function(err,data){
        if(err)
          cb(err,null);
        else
          cb(null,data);
      });
}

module.exports = sendMail;