# Resume / Rejoin Feature Notes

Implemented:
- QUERY_ACTIVE_GAME & REJOIN_GAME websocket messages
- GAME_SNAPSHOT response with phase, metadata, state
- Phase transitions (waiting -> countdown -> playing / paused / ended)
- Frontend auto-query on entering #game-match and conditional GameMatch init skipping ready modal

Next improvements:
1. Persist phase='ended' on server and set gameSession.phase='ended' in endGame flow (not yet wired).
2. Add stateVersion to GAME_STATE & snapshot for ordering.
3. Implement disconnect grace timers and auto-forfeit/AI substitution.
4. Distinguish resume vs fresh join UI more explicitly (pass flag instead of heuristic on gameState values).
5. Include countdownRemaining in snapshot when phase==='countdown'.
6. When paused, include remaining ms (already partial via pauseRemaining but client not using yet).
7. Add explicit LEAVE_GAME flow to clear mapping sooner without waiting for socket close.
8. Spectator mode extension: allow non-participant REJOIN_GAME with read-only state.
9. Security: validate tournament permissions on rejoin.

Testing checklist (manual):
- Start remote game, move paddles, hash to another view, back to #game-match => should resume existing state without ready modal.
- Hard reload on playing phase => snapshot arrives, canvas updates.
- Pause then reload => pause modal displays.
- End game then try rejoin => results show (requires phase='ended' update in endGame).
