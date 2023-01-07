const AgentRepository = require("../repository/agent.repository");
const agentService = {
    async getAll (ids) {
        const agentRespository = new AgentRepository();
        if (ids && ids.length > 0) {
            return await agentRespository.getAgentsByIds(ids);
        }
        return await agentRespository.getAllAgents();
    }
}

module.exports = agentService;