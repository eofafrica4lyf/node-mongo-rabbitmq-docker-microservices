const amqp = require('amqplib');

let channel;
async function connect() {
    const amqpServer = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('CHANNEL');
    return channel;
}

module.exports = connect;