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

    this.getChannelsPerAgent = async () => {
        return await Channel.aggregate([
            {
                $match : { isActive: true }
            },
            {
                $group : { _id : "$agentId", channels: { $push: "$$ROOT" }, count: { $sum: 1 } }
            }, 
            {
                $sort : { count: 1 }
            }
        ])
    }

    this.updateChannelsByTraveler = async (travelerId) => {
        return await Channel.updateMany({_id: travelerId }, {isActive: false});
    }
}

module.exports = ChannelRepository;