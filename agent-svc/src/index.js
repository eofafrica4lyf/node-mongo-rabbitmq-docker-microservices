//Init ENV variables
require('dotenv').config();
require('./config/db').connect();

const express = require('express');
const amqp = require('amqplib');

const agentService = require('./service/agent.service');
const agentRouter = require('./controllers');


async function connect() {
    let channel;
    const amqpServer = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('AGENT');
    return channel;
}

connect().then((MQChannel) => {
    MQChannel.consume("AGENT", async (message) => {
        const parsedMessage = JSON.parse(message.content.toString());
        if (parsedMessage.topic === "GET_ALL_AGENTS") {
            const agents = await agentService.getAll(parsedMessage.data);
            MQChannel.sendToQueue(
                "CHANNEL",
                Buffer.from(JSON.stringify({
                    correlationId: parsedMessage.correlationId, 
                    agents
                }))
            )
        } else if (parsedMessage.topic === "GET_SINGLE_AGENT") {
            const agent = await agentService.getSingleAgent(parsedMessage.data.agentId);
            MQChannel.sendToQueue(
                "CHANNEL",
                Buffer.from(JSON.stringify({
                    correlationId: parsedMessage.correlationId, 
                    agent
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
app.use('/agent', agentRouter)

app.listen(PORT, () => {
    console.log(`Agent app listening at http://localhost:${PORT}`)
})