require('../config/db').connect();
const express = require('express')
const amqp = require('amqplib');

const router = express.Router();
const {generateUuid} = require('../utils/helper');
const { closeOtherActiveChannels } = require('../services/channel.service');
const channelService = require('../services/channel.service');

let channel;
async function connect() {
    const amqpServer = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('CHANNEL');
}
connect();

router.post('/channel', async (req, res) => {
    try {
        const {travelerId, channelName} = req.body;
        const correlationId = generateUuid();
        channel.sendToQueue("AGENT", Buffer.from(JSON.stringify({
            correlationId,
            topic: "GET_ALL_AGENTS",
            replyTo: "CHANNEL",
            data: null
        })));
        channel.consume("CHANNEL", async (message)  => {
            const parsedMessage = JSON.parse(message.content.toString());
            if(parsedMessage.correlationId == correlationId) {
                console.log("Correlates........", parsedMessage.correlationId, correlationId)
                const agents = parsedMessage.agents;
                // channel.ack(message);
                closeOtherActiveChannels(travelerId);
                channelService.createChannel({travelerId, channelName, agents});
            }
        },{
            noAck: true
        })
        return res.status(201).json("New Channel created successfully");
    } catch (error) {
        console.log(error);
        return res.status(201).json("An error occured!");
    }
})

module.exports = router;