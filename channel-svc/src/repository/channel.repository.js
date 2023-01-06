const Channel = require("../model/channel");

function ChannelRepository () {
    this.create = async (data) => {
        channelData = await Channel.create(data);
        channelData.save();
        return Promise.resolve(channelData);
    }

    this.closeChannel = async (channelId) => {
        return await Channel.findOneAndUpdate({_id: channelId}, {isActive: false});
    }
}

module.exports = ChannelRepository;