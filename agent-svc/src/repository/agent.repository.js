const Agent = require("../model/agent");

function AgentRepository () {
    this.create = async (data) => {
        const agentData = await Agent.create(data);
        agentData.save();
        return Promise.resolve(agentData);
    }

    this.updateSingleAgent = async (agentId, data) => {
        return await Agent.findOneAndUpdate({_id: agentId}, data);
    }

    this.getAllAgents = async () => {
        const allAgents = await Agent.find({})
        return Promise.resolve(allAgents);
    }

    this.getSingleAgentByID = async (agentId) => {
        const agent = await Agent.findOne({_id: agentId});
        return Promise.resolve(agent);
    }

    this.deleteSingleAgent = async (agentId) => {
        return await Agent.deleteOne({_id: agentId});
    }
}

module.exports = AgentRepository;