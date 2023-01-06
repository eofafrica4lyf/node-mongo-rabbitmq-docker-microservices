const Channel = require("../model/channel");

function ChannelRepository () {
    this.createChannel = async (data) => {
        channelData = await Channel.create(data);
        channelData.save();
        return Promise.resolve(channelData);
    }

    this.closeChannel = async (channelId) => {
        return await Channel.findOneAndUpdate({_id: channelId}, {isActive: false});
    }

    this.updateChannelsByTraveler = async (travelerId) => {
        return await Channel.updateMany({_id: travelerId }, {isActive: false});
    }
}

module.exports = ChannelRepository;