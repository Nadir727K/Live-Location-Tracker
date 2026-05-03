# 📍 Real-Time Live Location Tracking System

## 📌 Project Overview

This project is a real-time live location tracking system where authenticated users can share their current location and view other users moving dynamically on a map. The system is designed using an event-driven architecture with Kafka acting as the central data pipeline between ingestion and processing layers.

The core goal of this project is to simulate how high-throughput systems (such as ride-sharing or delivery platforms) handle continuous streams of location updates in a scalable and decoupled manner.

---

##  System Architecture

```
Client (Browser)
   ↓
Socket.IO (Authenticated via JWT)
   ↓
Backend Socket Server
   ↓
Kafka Producer → location-updates topic
   ↓
 ┌──────────────────────────────┐
 │ Consumer Group               │
 │                              │
 │ 1. Realtime Broadcaster      │ → emits updates to clients
 │ 2. Database Processor        │ → logs/simulates persistence
 └──────────────────────────────┘
```

---

## ⚙️ Tech Stack

* **Frontend**: HTML, JavaScript, Leaflet.js
* **Backend**: Node.js, Express.js, Socket.IO
* **Authentication**: JWT (simulated OAuth/OIDC flow)
* **Messaging System**: Kafka (via KafkaJS)
* **Containerization**: Docker (Kafka setup)

---

##  Authentication Flow

* User logs in via `/auth/login` endpoint.
* Server validates user from a mock user store.
* A JWT token is issued containing user identity.
* Token is stored in browser `localStorage`.
* Socket.IO connection includes this token for authentication.
* Backend verifies token during socket handshake and binds user identity to the connection.

---

##  Socket Event Flow

1. Client sends location updates periodically via:

   ```
   client:location:update
   ```

2. Backend:

   * Verifies authenticated user
   * Sends location data to Kafka (producer)

3. Kafka Consumer:

   * Reads location events
   * Emits:

     ```
     server:location:update
     ```
   * All connected clients receive updates

---

##  Kafka Event Flow

* Topic used: `location-updates`
* Producer: Socket server
* Consumers:

  * Realtime broadcaster (inside socket server)
  * Database processor (separate service)

This ensures:

* Decoupling of ingestion and processing
* Independent scalability
* Fault tolerance via event replay capability

---

## 🗺️ Frontend Behavior

* Uses Leaflet map to render user positions
* Each user is represented by a marker
* Marker updates in real time when new location events arrive
* Current user and other users are tracked separately

---

##  Setup Instructions

### 1. Start Kafka (Docker)

```
docker-compose up -d
```

### 2. Create Kafka Topic

```
node kafka-admin.js
```

### 3. Start Services

```
node database-processor.js
node index.js
node server.js
```

### 4. Open Application

```
http://localhost:8000
```

### 5. Login (via browser console)

```
fetch("http://localhost:9000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user1" })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem("token", data.token);
  location.reload();
});
```

---

##  Demo Video

<img width="770" height="652" alt="Screenshot 2026-05-03 232539" src="https://github.com/user-attachments/assets/a005c9fc-7ff2-44d1-9062-61c8b074a210" />


https://youtu.be/uw-0Cc9jCpM

## ⚠️ Assumptions & Limitations

### ✔️ Implemented

* JWT-based authentication
* Socket.IO authenticated connection
* Kafka producer and consumer flow
* Real-time map updates
* Multi-user tracking
* Separation of realtime and persistence consumers
* Event-driven architecture

---

### ❗ Not Fully Implemented / Improvements Needed

* Full OAuth 2.0 / OIDC integration (currently simulated using JWT)
* Persistent database storage (currently logs instead of actual DB writes)
* Advanced error handling and validation across all layers
* Rate limiting on socket events
* Proper handling of stale/disconnected users on frontend
* Deduplication logic for Kafka events
* Production-grade environment configuration (secrets, scaling, deployment)
* UI/UX improvements for better clarity between users

---

## 🧠 System Design Understanding

### Why Kafka is Used

Directly writing every location update to a database is inefficient at scale. Kafka acts as a buffer and event streaming system that:

* Handles high-throughput data ingestion
* Decouples producers from consumers
* Enables multiple consumers to process the same data independently
* Improves system scalability and reliability

---

### Consumer Groups

Kafka consumer groups allow multiple services to consume the same topic independently:

* Realtime consumer → broadcasts updates
* DB processor → handles persistence

This separation ensures:

* No blocking between services
* Independent scaling

---

## 🧾 Personal Note

This project was developed while I was still in the process of learning full-stack development. I joined the web development cohort by Chai Code at a later stage and had limited time to fully cover all advanced concepts before attempting this system.

As a result, while I have implemented the core architecture and demonstrated the intended flow, there are areas where the implementation is simplified or incomplete compared to production-grade standards.

I am actively working to strengthen my understanding of these systems and intend to revisit and improve this project with a more robust and professional implementation in the near future.

---

## 🚀 Future Improvements

* Integrate real OAuth/OIDC providers (e.g., Auth0)
* Add real database (PostgreSQL / MongoDB)
* Implement batching for DB writes
* Add monitoring and logging (Kafka metrics)
* Deploy system using cloud infrastructure
* Improve frontend UI and user experience

---

## 📎 Repository

https://github.com/Nadir727K/Live-Location-Tracker.git
---
