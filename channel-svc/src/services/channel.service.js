const ChannelRepository = require("../repository/channel.repository");
const channelRepository = new ChannelRepository();
const { v4: uuidv4 } = require('uuid')

const channelService = {
    async createChannel ({travelerId, channelName, channelsPerAgent, agents}) {
        const selectedAgent = this.pickAgentToAssign(channelsPerAgent, agents);
        return await channelRepository.createChannel({
            travelerId,
            channelName,
            agentId: selectedAgent ? selectedAgent._id : selectedAgent,
            isActive: true
        });
    },

    async closeOtherActiveChannels(travelerId) {
        return await channelRepository.updateChannelsByTraveler(travelerId);
    },

    async getActiveChannels () {
        return await channelRepository.getActiveChannels();
    },

    async getChannelsPerAgent () {
        return await channelRepository.getChannelsPerAgent();
    },

    pickAgentToAssign (channelsPerAgent, agents) {
        let selectedAgent;
        const agentsHash = this.transformArrayToHash(agents, '_id');

        if (agents.length) {
            for(let i = 0; i < channelsPerAgent.length; i++) {
                const _id = channelsPerAgent[i]._id;
                const agentData = agentsHash[_id];
                const currentHour = new Date().getHours();
                
                if (Number(agentData.workingHours.start.split(":")[0]) < currentHour &&
                    Number(agentData.workingHours.end.split(":")[0]) > currentHour) {
                    selectedAgent = agentData;
                    break;
                }
            }

            return selectedAgent;
        }
        return null;
    },

    transformArrayToHash (array, hashProperty) {
        const hash = {};
        array.forEach(item => {
            if(hash[item[hashProperty]] === undefined) {
                hash[item[hashProperty]] = item;
            }
        })
        return hash;
    },

    async assignActiveAgentToChannel (channel, MQChannel) {
        const correlationId = uuidv4();
        MQChannel.sendToQueue("AGENT", Buffer.from(JSON.stringify({
            correlationId,
            topic: "GET_ALL_AGENTS",
            replyTo: "CHANNEL",
            data: null
        })));
        MQChannel.consume("CHANNEL", async (message)  => {
            let selectedAgent;
            const parsedMessage = JSON.parse(message.content.toString());
            if(parsedMessage.correlationId == correlationId) {
                const agents = parsedMessage.agents;
                for(let i = 0; i < agents.length; i++) {
                    const agent = agents[i];
                    const currentHour = new Date().getHours();
                    if (Number(agent.workingHours.start.split(":")[0]) <= currentHour &&
                        Number(agent.workingHours.end.split(":")[0]) >= currentHour) {
                        selectedAgent = agent;
                        break;
                    }
                }
                await channelRepository.updateChannelAgent(channel._id, selectedAgent ? selectedAgent._id : null);
            }
        },{
            noAck: true
        })
    }
}

module.exports = channelService;