# Whisp Frontend

This is the **React 19 + Vite** frontend for the real-time chat application.  
It communicates with the Laravel backend via a REST API and **Laravel Echo** for real-time events.

**Backend Repository:** [Whisp Backend](https://github.com/den47k/blog-backend)

---

## Features

- **Private conversations** with other users.
- **File attachment uploads**.
- **Real-time message updates** using Laravel Echo + WebSockets.
- **Read/Unread indicators** for conversations.
- **Routing** with React router.
- **State management** using Zustand.
- **Data fetching & caching** with SWR.
- **Form validation** with React Hook Form + Zod.

---

## Requirements

- **Docker & Docker Compose**
- **Node.js 20+**
- **npm** or **yarn**
- Running backend API (see backend [README](https://github.com/den47k/blog-backend/blob/master/README.md))

---

## Installation

1. **Clone the repository**

  ```bash
  git clone https://github.com/den47k/blog-frontend
  cd blog-frontend
  ```  

2. **Install dependencies**
    
  ```bash
  npm install
  ```
    
3. **Configure environment**  
    Create a `.env` file:
    
  ```env
  VITE_API_BASE_URL=http://localhost/api
  ```
    
4. **Run in Docker**
    
  ```bash
  docker compose up
  ```

---

## API Integration

- Uses `axios` for HTTP requests.
    
- Uses `Laravel Echo + pusher-js` for WebSocket connections.
    
- Authenticated via **Laravel Sanctum**.
