// utils/rabbitMQ.js
const amqp = require('amqplib');

let connection, channel;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

async function getChannel() {
  if (!channel) {
    await connectRabbitMQ();
  }
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
