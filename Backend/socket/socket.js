import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
// 1. IMPORT THE USER MODEL
// Make sure the path to your user model is correct. It might be '../models/User.js'
// or something similar depending on your folder structure.
import User from '../models/User.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  }
});

// This map is still useful for direct messaging and quickly checking if a user is online.
const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
  // This function allows you to get the socket ID of a user by their userId.
  // It can be used in other parts of your application to send messages directly.
  return userSocketMap[userId];
}

io.on('connection', async (socket) => {
  try {
    const userId = socket.handshake.query.userId;
    // Gracefully handle cases where a user connects without a valid ID
    if (!userId || userId === 'undefined') {
      console.warn("A client connected without a userId.");
      return;
    }

    // --- (A) MAP THE USER & ANNOUNCE THEIR OWN STATUS ---
    userSocketMap[userId] = socket.id;

    // Announce to YOUR followers that YOU are now online.
    // We emit to a room named after your own userId. Anyone following you will be in this room.
    io.to(`presence-${userId}`).emit('statusUpdate', { userId, status: 'online' });
    console.log(`User ${userId} connected. Announced 'online' to room: presence-${userId}`);


    // --- (B) SUBSCRIBE TO THE PEOPLE YOU FOLLOW ---
    // Find the current user in the database to see who they are following.
    // .lean() is a performance optimization that returns a plain JS object instead of a full Mongoose document.
    const currentUser = await User.findById(userId).select('following').lean();

    if (currentUser && currentUser.following) {
      // Create a list of room names from the user IDs you follow.
      const roomsToJoin = currentUser.following.map(followedUserId => `presence-${followedUserId.toString()}`);
      if (roomsToJoin.length > 0) {
        socket.join(roomsToJoin);
        // console.log(`User ${userId} subscribed to presence rooms for users they follow.`);
      }
    }


    // --- (C) GET INITIAL STATUS OF THE PEOPLE YOU FOLLOW ---
    // Now that you've subscribed, you need to know who is already online among those you follow.
    if (currentUser && currentUser.following) {
      // Get an array of the string IDs of people the user follows.
      const followedIds = currentUser.following.map(id => id.toString());

      // Filter the global online user map to find which of the followed users are currently online.
      const onlineFollowedUsers = Object.keys(userSocketMap).filter(id => followedIds.includes(id));

      // Send this initial list of online friends *only* to the newly connected user.
      socket.emit('initialOnlineFriends', onlineFollowedUsers);
    }


    // --- (D) HANDLE DISCONNECTION ---
    socket.on('disconnect', () => {
      // Remove the user from our online map
      delete userSocketMap[userId];

      // Announce to YOUR followers that YOU are now offline.
      // We again emit to your personal presence room.
      io.to(`presence-${userId}`).emit('statusUpdate', { userId, status: 'offline' });
      console.log(`User ${userId} disconnected. Announced 'offline' to room: presence-${userId}`);
    });

  } catch (error) {
    // It's good practice to catch potential errors, e.g., if a database query fails.
    console.error("An error occurred in the socket connection handler:", error);
    // You might want to disconnect the socket if a critical error occurs
    socket.disconnect();
  }
});

export { app, server, io };