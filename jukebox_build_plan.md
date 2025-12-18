# Jukebox App — Full End-to-End Build Plan

## 0. Core Product Idea
A real-time collaborative jukebox where multiple users join a party, add songs, and see updates instantly.

## 1. Architecture
- Backend: NestJS, PostgreSQL, Raw SQL, Socket.IO
- Frontend: Next.js App Router, React, Socket.IO client
- Communication: REST + WebSockets

## 2. Database Schema
### parties
- party_id (UUID, PK)
- host_name (TEXT)
- created_at (TIMESTAMPTZ)

### users
- user_id (UUID, PK)
- display_name (TEXT)
- created_at (TIMESTAMPTZ)

### songs
- song_id (UUID, PK)
- party_id (UUID, FK → parties)
- req_by_uid (UUID, FK → users)
- title (TEXT)
- artist (TEXT)
- requested_at (TIMESTAMPTZ)

## 3. Backend Modules
- database
- parties
- users
- songs
- gateway (WebSockets)

## 4. WebSockets
- One room per party
- Events: song_added, song_deleted
- Emitted only after DB commit

## 5. Frontend Structure
app/party/[partyId] with server + client components.

## 6. Optimistic UI
- UI updates immediately
- WebSocket reconciles truth
- DB remains source of truth

## 7. Authorization
- Users can only delete their own songs
- Enforced in SQL

## 8. Error Semantics
- 400 invalid input
- 403 forbidden
- 404 not found

## 9. Scaling Principles
- Stateless backend
- DB-enforced invariants
- WebSockets for fan-out

## 10. Guiding Principle
The database is the source of truth. The UI is a prediction. WebSockets reconcile reality.
