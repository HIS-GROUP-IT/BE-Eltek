const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const msg = {
  to: 'kwanelendaba69@gmail.com', // Change to your recipient
  from: 'kwanele.ndaba@hisgroup-it.co.za', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })