const AgentRepository = require("../repository/agent.repository");
const agentRepository = new AgentRepository();

const agentService = {
    async getAll (ids) {
        if (ids && ids.length > 0) {
            return await agentRepository.getAgentsByIds(ids);
        }
        return await agentRepository.getAllAgents();
    },

    async getSingleAgent(id) {
        return await agentRepository.getSingleAgentByID(id);
    },

    async create(data) {
        return await agentRepository.create(data);
    },

    async update(data) {
        return await agentRepository.update(data);
    }
}

module.exports = agentService;