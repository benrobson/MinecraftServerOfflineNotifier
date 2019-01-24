const config = require('./config.json');
const nodemailer = require('nodemailer');
const chalk = require('chalk');

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.log(chalk.red('Failed to create a testing account.'))
    console.log(err.message);
    return process.exit(1);
  }
  console.log(chalk.yellow('Credentials obtained, sending message...'));

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.authuser,
    pass: config.authpass
  }
});

// Message Object
let message = {
  from: `${config.authusername} <${config.email}>`,
  to: `${config.otheremail}`,
  subject: '[MinecraftServerOfflineNotifier] Your server is offline.',
  html: '<p>Hello,<br>You are recieving this email because your Minecraft Server ${config.serveraddress} is offline.<br><br>This is an automated email that has been triggered by no ping to your server.<br>If this is a false email, please report this to the <a href="https://github.com/shadowolfyt/MinecraftServerOfflineNotifier/issues">GitHub page</a>.<br><br>Glowing Regards,<br>${auth.username}</p>'
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    console.log(chalk.red('An error has occurred.'));
    console.log(err.message);
    return process.exit(1);
  }

  console.log(chalk.green(`Message Sent to ${config.otheremail}`));
})});
