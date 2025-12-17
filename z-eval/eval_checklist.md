# ft_transcendence Project Evaluation Checklist

### 0. Mandatory Requirements
[ ] **[General] Git Integrity:** Ensure the repository is clean and no malicious aliases are used to fool the evaluator.
[ ] **[Backend] Language:** Vanilla PHP or Node.js backend module.
[ ] **[Backend] Database:** Database module constraints followed (SQLite is mandatory for consistency).
[ ] **[Frontend] Base Code:** Developed in TypeScript.
[ ] **[Frontend] Single-Page Application (SPA):** - Functional browser navigation (Back/Forward buttons).
    - No full page reloads when navigating between sections.
[ ] **[Compatibility] Browser:** Works flawlessly on the latest stable version of Firefox.
[ ] **[Compatibility] Error Handling:** No unhandled errors or warnings in the console during browsing.
[ ] **[DevOps] Docker:** Project runs in Docker, launched with `docker-compose up --build`.
[ ] **[DevOps] Rootless Mode:** - Handles constraints (e.g., storage in `/goinfre` or `/sgoinfre`).
    - No "bind-mount volumes" used if non-root UIDs are required.
[ ] **[Game] Local 1v1:** Two users can play using the same keyboard.
[ ] **[Game] Rules & Fairness:** All players, including AI, must adhere to the same rules (paddle size and speed).
[ ] **[Game] Aesthetics:** Captures the essence of the original 1972 Atari Pong.
[ ] **[Game] Tournament System:** - Available for multiple players taking turns in 1v1 matches.
    - Matchmaking system: organizes participants and order of play.
    - Next match announcement display.
    - Player alias registration/management.
[ ] **[Game] Tournament Flexibility:** The system must work correctly with or without user registration (using aliases for guests).
[ ] **[Security] Password Security:** Passwords MUST be hashed (e.g., bcrypt). No plain text in DB.
[ ] **[Security] Data Protection:** - Protected against SQL injections.
    - Protected against XSS attacks (Cross-site scripting).
[ ] **[Security] API Protection:** All API routes protected (e.g., server-side validation/authentication).
[ ] **[Security] Credentials:** All API keys and environment variables in a `.env` file and ignored by Git. 
[ ] **[Protocol] HTTPS/WSS:** Mandatory for all features. All WebSocket connections must use `wss://`.
[ ] **[Protocol] Validation:** Strict server-side validation for all user inputs.

---

### 1. Web Modules
[ ] **Major: Backend Framework (Fastify + Node.js)**
    - Replace pure Node.js/PHP with Fastify.
    - Proper porting of all existing backend logic.
    - Adherence to Fastify best practices for routing and plugin architecture.
[ ] **Minor: Frontend Framework (Tailwind CSS + TypeScript)**
    - Use Tailwind CSS for all styling (no custom CSS files unless strictly necessary).
    - Ensure a consistent UI/UX design across the whole platform.
[ ] **Minor: Database (SQLite)**
    - Use SQLite for all data storage.
    - Proper schema design for users, matches, and chats.

---

### 2. User Management Modules
[ ] **Major: Standard User Management**
    - **Registration/Login:** Secure email and password system.
    - **Profiles:** Users can customize their unique display names.
    - **Avatars:** Upload system with a default image fallback.
    - **Social:** Friends list with real-time "Online/Offline" status.
    - **History:** Individual match history (wins, losses, dates, opponents).
[ ] **Major: Remote Authentication (Google OAuth)**
    - Functional "Login with Google" button.
    - Secure token exchange and session management.
    - Data synchronization between Google account and local profile.

---

### 3. Gameplay & UX Modules
[ ] **Major: Remote Players**
    - Two players can play the same game from different browsers/tabs.
    - Infrastructure to handle network lag and synchronization.
    - Graceful handling of disconnections (e.g., forfeit or pause).
[ ] **Major: Additional Game + Matchmaking**
    - Implementation of a completely different second game (e.g., Tetris, Snake).
    - Specific matchmaking system for the second game.
    - History and stats tracking for the second game.
[ ] **Major: Live Chat**
    - **Direct Messaging:** Real-time private chat between users.
    - **Blocking:** Ability to block/unblock users (messages from blocked users are hidden).
    - **Integration:** Link chat usernames to player profiles.
    - **Game Invites:** Ability to invite a friend to a game directly via the chat interface.

---

### 4. AI-Algo Modules
[ ] **Major: AI Opponent**
    - **Logic:** AI simulates human keyboard input (no direct paddle manipulation).
    - **Performance:** Limited to 1 logic update per second.
    - **Anticipation:** AI must calculate/anticipate ball bounces to position itself.
    - **Fairness:** Paddle speed/size must be identical to human players.
[ ] **Minor: Stats Dashboards**
    - Detailed statistics for each user (win rate, average scores).
    - Visual analytics (e.g., graphs/charts showing performance over time).
    - Interactive match history board.

---

### 5. Accessibility Modules
[ ] **Minor: Multi-device Support**
    - Responsive design: Site is usable on Desktop, Tablet, and Mobile.
    - UI components adjust automatically to different screen resolutions.
[ ] **Minor: Browser Compatibility**
    - Site must work perfectly on a second stable browser (e.g., Google Chrome or Microsoft Edge) in addition to Firefox.

---

### 6. Server-Side Pong Modules
[ ] **Major: Server-Side Pong + API**
    - Game engine runs entirely on the server (the client is just a "viewer").
    - WebSockets or long-polling used for state synchronization.
    - **API Integration:** Expose endpoints for game actions (e.g., `POST /move`).
[ ] **Major: CLI for Pong**
    - Build a Command Line Interface tool (Python, Node, or C++).
    - CLI users can play against web users in real-time.
    - CLI must handle authentication and game state updates via API.