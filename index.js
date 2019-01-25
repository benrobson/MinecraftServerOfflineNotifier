const config = require('./config.json');
const nodemailer = require('nodemailer');
const chalk = require('chalk');
const superagent = require('superagent');

console.log(chalk.yellow(`[PING INTERVAL] This application will ping the server address of ${config.minecraftaddress} every ${config.pinginginterval}.`));
checkServerStatus(); setInterval(checkServerStatus, config.pinginginterval);

async function checkServerStatus() {
  let {body} = await superagent.get('http://mcapi.us/server/status?ip=' + config.minecraftaddress)
  let status = body.online ? true : false;

  if (status === true) {
    console.log(chalk.green(`[STATUS ONLINE] ${config.minecraftaddress} is online and has been pinged successfully.`));
  }

  if (status === false) {
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
      to: `${config.recipientemail}`,
      subject: `[MinecraftServerOfflineNotifier] The server ${config.minecraftaddress} is offline.`,
      html: `<p>Hello,<br>You are recieving this email because the Minecraft Server ${config.minecraftaddress} is offline.<br><br>This is an automated email that has been triggered by no ping to your server.<br>If this is a false email, please report this to the <a href="https://github.com/shadowolfyt/MinecraftServerOfflineNotifier/issues">GitHub page</a>.<br><br>Glowing Regards,<br>${config.authusername}</p>`
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(chalk.red('An error has occurred.'));
        console.log(err.message);
        return process.exit(1);
      }

    console.log(chalk.red(`[STATUS OFFLINE] ${config.minecraftaddress} is offline and could not revieve a ping, sending offline email notice.`));
    console.log(chalk.green(`Offline email notice sent to ${config.recipientemail}`));
  });
}};
