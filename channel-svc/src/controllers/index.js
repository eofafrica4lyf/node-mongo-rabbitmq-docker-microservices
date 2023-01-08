require('../config/db').connect();
const express = require('express')

const router = express.Router();
const { v4: uuidv4 } = require('uuid')
const { closeOtherActiveChannels } = require('../services/channel.service');
const channelService = require('../services/channel.service');
const { validationResult } = require('express-validator');
const { checkStringField } = require('../validations/validations');
const connect = require('../rabbitmq/connect');


router.post(
    '/create', 
    [
        checkStringField('travelerId', "Traveler Id is required"),
        checkStringField('channelName', "Channel Name is required"),
    ],
    async (req, res) => {
        try {
        let channel = await connect();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        const validationErrors = errors.array().filter((v) => v);
        return res.status(400).send({ errors: validationErrors });
        }

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
        return res.status(400).json("An error occured!");
    }
})

router.post(
    '/close', 
    [
        checkStringField('travelerId', "Traveler Id is required"),
    ],
    async (req, res) => {
    try {
        const {travelerId} = req.body;

        await channelService.closeOtherActiveChannels(travelerId);
        return res.status(200).send('Channel closed successfully');
    } catch (error) {
        console.log(error);
        return res.status(400).json("An error occured!");
    }
})

module.exports = router;