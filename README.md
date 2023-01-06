Overview:

System that implement support-chat - agent queuing. 

Entities:
1. Agent - people who communicate with end-customer to provide support
2. Channel - place of communication between end-customer and agent
3. End-customer - people who have some question to resolve.

Task:
1. Implement 2 micro-services. "Channel-Svc" and "Agent-Svc". `Channel-Svc` maintain the channels and assign/unassigning participants to it. `Agent-Svc` maintaining agents
2. Agent (part of `Agent-Svc`) schema:
   ```
   {
      id: String,
      firstName: String,
      lastName: String,
      workingHours: {start: String, end: String} 
   }
   ```
3. `Agent-Svc` Api: 
   - Create Agent: HTTP(POST)
   - Update Agent: HTTP(PUT)
   - Get list of Agents: HTTP(GET)/RabbitMQ 
   - Get agent by ID: HTTP(GET)/RabbitMQ 
4. Channel schema (part of `channel-Svc`):
   ```
   {
      id: String,
      channelName: String,
      travelerId: ?String,
      agentId: ?String,
      isActive: Boolean
   }
   ```
5. Channel-SVC API:
   - Create new channel
      params: `travelerId`
      api: HTTP(POST)
      description: Creates new channel and assigning an agent to this channel. Agent with minimum number of active channels and appropriate working hours should be used. If there are some active channels with same travelerId they should be closed (`isActive` -> `false`)
   - Close Channel. HTTP(POST).
6. Each hour channel service should check agents that assigned to active channels and if they out of office should try to assign another agent
7. If there is no agent for channel because of working hours agentId should be null (but still each hour channel-svc should try to find someone)
8. All communications between `channel-svc` and `agent-svc` should be done through rabbitMQ

Technologies:
1. Express
2. Mongo db
3. RabbitMQ
4. Docker/Docker-compose