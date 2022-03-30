const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendmail=async(to,subject,text)=>{
    const msg = {
  to: to, // Change to your recipient
  from: 'aryanstorm6@gmail.com', // Change to your verified sender
  subject: subject,
  text: text
}
try{
await sgMail.send(msg)

}catch(e){
    console.log('Could not send the mail')
}
}

module.exports=sendmail