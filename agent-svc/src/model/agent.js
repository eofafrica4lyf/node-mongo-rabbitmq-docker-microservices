const mongoose = require('mongoose');
const agentEntity = require('../entity/agent.entity');

const agentSchema = new mongoose.Schema(agentEntity);

module.exports = mongoose.model('agent', agentSchema);
