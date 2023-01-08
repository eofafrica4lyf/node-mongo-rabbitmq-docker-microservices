const AgentRepository = require("../repository/agent.repository");
const agentRespository = new AgentRepository();

const agentService = {
    async getAll (ids) {
        if (ids && ids.length > 0) {
            return await agentRespository.getAgentsByIds(ids);
        }
        return await agentRespository.getAllAgents();
    },

    async create(data) {
        return await agentRespository.create(data);
    }
}

module.exports = agentService;