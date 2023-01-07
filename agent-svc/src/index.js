//Init ENV variables
require('dotenv').config();
require('./config/db').connect();

const express = require('express');
const amqp = require('amqplib');

const agentService = require('./service/agent.service');

let channel;

async function connect() {
    const amqpServer = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('AGENT'); 
}

connect().then(() => {
    channel.consume("AGENT", async (message) => {
        const parsedMessage = JSON.parse(message.content.toString());
        if (parsedMessage.topic === "GET_ALL_AGENTS") {
            const agents = await agentService.getAll(parsedMessage.data);
            channel.sendToQueue(
                "CHANNEL",
                Buffer.from(JSON.stringify({
                    correlationId: parsedMessage.correlationId, 
                    agents: agents
                }))
            )
        }
    },{
        noAck: true
    })
})

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Hello, world!'));

app.listen(PORT, () => {
    console.log(`Agent app listening at http://localhost:${PORT}`)
})