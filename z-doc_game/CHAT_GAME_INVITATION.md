# Chat Game Invitation Feature

## Overview
This feature allows users to invite other online users to a game directly from the chat interface. It leverages the existing WebSocket connections for chat and game management to create a seamless experience without needing a separate "lobby" for 1v1 challenges.

## Architecture & Logic

The implementation follows a 4-step logic flow:

1.  **Pre-instantiation**: When a user enters the Chat, a `Game` instance is silently created in the background. This ensures the game logic (socket connection, state management) is ready immediately when an invitation is sent or accepted.
2.  **Invitation**: When User A invites User B, a unique `gameId` is generated. User A joins this game room immediately. A private message containing a special token (`$$INVITE$$:gameId`) is sent to User B.
3.  **Rendering**: The chat interface detects the `$$INVITE$$` token and renders an interactive "Game Invitation" card with "Accept" and "Ignore" buttons instead of raw text.
4.  **Acceptance**: If User B clicks "Accept", their client also joins the specific `gameId` room. The backend detects two players in the room and starts the game, triggering the transition to the Match screen for both users.

## Step-by-Step Implementation Guide

### 1. SPA Initialization (`frontend/src/ts/spa/spa.ts`)
We modified the `loadStep` method to initialize the `Game` class when loading the `chat` route.

-   **Goal**: Ensure `this.currentGame` is available while in the chat.
-   **Change**:
    ```typescript
    if (step === 'chat') {
        try { clearSearchFilter(); } catch (e) { /* ignore */ }
        // Create Game instance and establish connection silently
        this.currentGame = new Game('app-container');
        await this.currentGame.getGameConnection().establishConnection();
    }
    ```

### 2. Game Class Update (`frontend/src/ts/game/Game.ts`)
Added a flag to distinguish chat-initiated games from standard lobby games.

-   **Change**: Added `public isChatGame: boolean = false;` property.

### 3. Sending the Invitation (`frontend/src/ts/chat/handleUserOptionsMenu.ts`)
The `handlePlayGame` function was updated to handle the invitation logic instead of just sending a generic challenge.

-   **Logic**:
    1.  Get the current `SPA` instance and `currentGame`.
    2.  Set `isChatGame = true` and mode to `remote`.
    3.  Generate a deterministic `gameId`: `inviterId + invitedId + 'chatGame'`.
    4.  Call `joinGame(gameId)` for the inviter.
    5.  Send a private message via the chat socket with the content `$$INVITE$$:${gameId}`.

### 4. Rendering the Invitation (`frontend/src/ts/chat/formatContent.ts`)
The `formatMsgTemplate` function intercepts the invitation message to render a UI card.

-   **Logic**:
    -   Check if message starts with `$$INVITE$$:`.
    -   If yes, extract `gameId`.
    -   Return HTML for a card with:
        -   **Accept Button**: `data-action="accept-invite" data-game-id="..."`
        -   **Ignore Button**: `data-action="ignore-invite"`

### 5. Handling User Actions (`frontend/src/ts/chat/chatRender.ts`)
Event listeners were added to the chat message container to handle the button clicks.

-   **Accept Flow**:
    1.  Retrieve `gameId` from the button.
    2.  Access `SPA.currentGame`.
    3.  Set `isChatGame = true` and mode `remote`.
    4.  Call `joinGame(gameId)`.
    5.  *Result*: The backend sees the second player join, starts the game, and sends `GAME_INIT`, causing the SPA to navigate to `game-match`.
-   **Ignore Flow**:
    1.  Simply remove the invitation card from the DOM.

## User Flow Diagram

1.  **User A** (in Chat) -> Clicks **User B** -> Selects **"Play Game"**.
2.  **System**:
    -   User A joins room `A_B_chatGame`.
    -   User A sends private msg `$$INVITE$$:A_B_chatGame` to User B.
3.  **User B** (in Chat) -> Receives message.
    -   Sees "Game Invitation" card.
4.  **User B** -> Clicks **"Accept"**.
5.  **System**:
    -   User B joins room `A_B_chatGame`.
    -   Backend detects 2 players -> Starts Game.
    -   Both clients receive `GAME_START` / `GAME_INIT`.
    -   SPA redirects both to `game-match`.
