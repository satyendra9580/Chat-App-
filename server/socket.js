import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModels.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  // Handle user disconnection
  const disconnect = (socket) => {
    console.log(`Client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} removed from socket map`);
        break;
      }
    }
  };

  // Handle direct messages
  const sendMessage = async (message) => {
    try {
      const { sender, recipient, messageType, content, fileUrl } = message;
      console.log("New direct message received:", message);

      const createdMessage = await Message.create({
        sender,
        recipient,
        messageType,
        content,
        fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      // Emit message to recipient & sender
      const recipientSocketId = userSocketMap.get(recipient);
      const senderSocketId = userSocketMap.get(sender);

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Notify users when a new channel is added
  const addChannelNotify = async (channel) => {
    try {
      console.log(`Notifying users about new channel: ${channel._id}`);
      if (channel?.members?.length > 0) {
        channel.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("new-channel-added", channel);
          }
        });
      }
    } catch (error) {
      console.error("Error notifying channel members:", error);
    }
  };

  // Handle channel messages
  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;
      console.log(`New channel message in channel ${channelId}`);
  
      // Fetch channel members before saving the message
      const channel = await Channel.findById(channelId).populate("members", "_id");
      if (!channel) {
        console.error("Channel not found:", channelId);
        return;
      }
  
      // Create & save message
      const createdMessage = await Message.create({
        sender,
        chatId: channelId,
        recipient: null, // Channel messages don't have a direct recipient
        content,
        messageType,
        fileUrl,
      });
  
      // Populate sender details
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .lean();
  
      if (!messageData) {
        console.error("Message not found after creation.");
        return;
      }
  
      // Add message to the channel
      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });
  
      const finalData = { ...messageData, channelId: channel._id };
  
      // Get all members' socket IDs
      let socketIds = channel.members
        .map((member) => userSocketMap.get(member._id.toString()))
        .filter(Boolean); // Remove undefined values
  
      // Add admin socket ID if not already in list
      const adminSocketId = userSocketMap.get(channel.admin?._id?.toString());
      if (adminSocketId) socketIds.push(adminSocketId);
  
      // Remove duplicate socket IDs
      socketIds = [...new Set(socketIds)];
  
      if (socketIds.length > 0) {
        console.log(`📤 Emitting Message to ${socketIds.length} sockets:`, socketIds);
        io.to(socketIds).emit("receive-channel-message", finalData);
      }
    } catch (error) {
      console.error("Error sending channel message:", error);
    }
  };
  

  // Handle socket connections
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided in handshake.");
    }

    // Handle events
    socket.on("add-channel-notify", addChannelNotify);
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });

  console.log("✅ Socket.io server is running...");
};

export default setupSocket;
