const mongoose = require('mongoose');
const channelEntity = require('../entity/channel.entity');

const channelSchema = new mongoose.Schema(channelEntity);

module.exports = mongoose.model('channel', channelSchema);
