// services/emailConsumer.js
const { getChannel } = require('../utils/rabbitMQ');
const nodemailer = require('nodemailer');

async function consumeEmailQueue() {
  try {
    const channel = await getChannel();
    const queue = 'email_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for messages in", queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());
        console.log("Received email data:", emailData);

        // Send email using Nodemailer
        await sendEmail(emailData);

        // Acknowledge the message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Failed to consume message:", error);
  }
}

async function sendEmail({ to, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Atur sesuai penyedia email
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const info = await transporter.sendMail({
      from: '"Your App" <your-email@gmail.com>',
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

consumeEmailQueue();