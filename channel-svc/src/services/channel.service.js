const ChannelRepository = require("../repository/channel.repository");
const channelRepository = new ChannelRepository();

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
    }
}

module.exports = channelService;