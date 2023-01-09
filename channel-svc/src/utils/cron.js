const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid')

const connect = require('../rabbitmq/connect');
const channelService = require('../services/channel.service');

const CRON_INTERVAL = process.env.CRON_INTERVAL || "*/30 * * * * *";
const initCron = async () => {
    cron.schedule(CRON_INTERVAL, () => {
        console.log('Starting Job....');
        runJob();
    });
}

const runJob = async () => {
    let MQChannel = await connect();
    const activeChannels = await channelService.getActiveChannels();
    activeChannels.forEach(async (channel) => {
        if (channel.agentId) {
            const correlationId = uuidv4();
            await MQChannel.sendToQueue("AGENT", Buffer.from(JSON.stringify({
                correlationId,
                topic: "GET_SINGLE_AGENT",
                replyTo: "CHANNEL",
                data: {agentId: channel.agentId}
            })));
            await MQChannel.consume("CHANNEL", async (message) => {
                const parsedMessage = JSON.parse(message.content.toString());
                if(parsedMessage.correlationId == correlationId) {
                    const agent = parsedMessage.agent;
                    const currentHour = new Date().getHours();
                    if (Number(agent.workingHours.start.split(":")[0]) > currentHour ||
                        Number(agent.workingHours.end.split(":")[0]) < currentHour) {
                        await channelService.assignActiveAgentToChannel(channel, MQChannel)
                    }
                }
            },{
                noAck: true
            })
        } else {
            await channelService.assignActiveAgentToChannel(channel, MQChannel)
        }
    })
}

module.exports = initCron;