const ChannelRepository = require("../repository/channel.repository");
const channelRepository = new ChannelRepository();

const channelService = {
    async createChannel ({travelerId, channelName, agents}) {
		console.log("TCL: createChannel -> agents", agents)
        const selectedAgent = this.pickAgentToAssign(agents);
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

    pickAgentToAssign (agents) {
        if (agents.length) {
            let count = -Infinity;
            let agent = null;
            agents.forEach((currentAgent) => {
                if (agent.channels < count) {
                    agent = currentAgent;
                    count = currentAgent.channels;
                }
            })
            return agent;
        }
        return null;
    },
}

module.exports = channelService;