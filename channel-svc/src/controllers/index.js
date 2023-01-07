require('../config/db').connect();
const express = require('express')
const amqp = require('amqplib');

const router = express.Router();
const { v4: uuidv4 } = require('uuid')
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
        const channelsPerAgent = await channelService.getChannelsPerAgent();

        if(channelsPerAgent.length > 0) {
            const correlationId = uuidv4();
            channel.sendToQueue("AGENT", Buffer.from(JSON.stringify({
                correlationId,
                topic: "GET_ALL_AGENTS",
                replyTo: "CHANNEL",
                data: channelsPerAgent.map(group => group._id)
            })));
            channel.consume("CHANNEL", async (message)  => {
                const parsedMessage = JSON.parse(message.content.toString());
                if(parsedMessage.correlationId == correlationId) {
                    console.log("Correlates........")
                    const agents = parsedMessage.agents;
                    closeOtherActiveChannels(travelerId);
                    channelService.createChannel({travelerId, channelName, channelsPerAgent, agents});
                }
            },{
                noAck: true
            })
        } else {
            closeOtherActiveChannels(travelerId);
            channelService.createChannel({travelerId, channelName, channelsPerAgent: [], agents: []});
        }
        
        return res.status(201).json("New Channel created successfully");
    } catch (error) {
        console.log(error);
        return res.status(201).json("An error occured!");
    }
})

module.exports = router;