import http from 'node:http';
import path from 'node:path';

import express from 'express';
import { Server } from 'socket.io';

import { kafkaClient } from './kafka-client.js';
import jwt from "jsonwebtoken";
const SECRET = "dev_secret_key_change_later";

async function main() {
  const PORT = process.env.PORT ?? 8000;

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  const kafkaProducer = kafkaClient.producer();
  await kafkaProducer.connect();

  const kafkaConsumer = kafkaClient.consumer({
    groupId: `socket-server-${PORT}`,
  });
  await kafkaConsumer.connect();

  await kafkaConsumer.subscribe({
    topics: ['location-updates'],
    fromBeginning: true,
  });

  kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`KafkaConsumer Data Received`, { data });
      io.emit('server:location:update', {
        id: data.id,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      await heartbeat();
    },
  });


  io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    socket.userId = decoded.userId;
    socket.userName = decoded.name;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

  io.on('connection', (socket) => {
  console.log(`[Socket:${socket.id}] Connected Success...`);
  console.log("USER AUTHENTICATED:", socket.userId, socket.userName);

  socket.on('client:location:update', async (locationData) => {
    const { latitude, longitude } = locationData;

    console.log(`[Socket:${socket.id}] location:`, locationData);

    await kafkaProducer.send({
      topic: 'location-updates',
      messages: [
        {
          key: socket.userId,
          value: JSON.stringify({
            id: socket.userId,
            name: socket.userName,
            latitude,
            longitude
          }),
        },
      ],
    });
  });
});

  app.use(express.static(path.resolve('./public')));

  app.get('/health', (req, res) => {
    return res.json({ healthy: true });
  });
  app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
}

main();
