const AgentRepository = require("../repository/agent.repository");
const agentService = {
    async getAll () {
        const agentRespository = new AgentRepository();
        return await agentRespository.getAllAgents();
    }
}

module.exports = agentService;