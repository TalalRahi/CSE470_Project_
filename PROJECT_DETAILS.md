# Project Details

## Overview

This is a football talent tracking system for Bangladesh grassroots football.

**Problem:** Manual record-keeping loses player data.  
**Solution:** Digital system with player profiles, match tracking, analytics.

## Requirements

### ✅ Requirement 0 — User & Role Management
**Developer:** Talal Rahi

Features:
- User registration
- Login/logout
- Password change
- Role-based access (Admin, Coach, Player)
- JWT authentication
- Password encryption with bcryptjs

Files:
- `backend/models/userModel.js`
- `backend/controllers/authController.js`
- `backend/middleware/authMiddleware.js`
- `frontend/src/pages/Login.js`
- `frontend/src/pages/Register.js`

---

### ✅ Requirement 1 — Player Profile Management
**Developer:** Talal Rahi

Features:
- Add player profile
- Edit player information
- Assign playing position
- Record dominant foot
- Rate skills (1-100)
- Track performance history

Files:
- `backend/models/playerModel.js`
- `backend/controllers/playerController.js`
- `frontend/src/pages/AddPlayer.js`
- `frontend/src/pages/Players.js`
- `frontend/src/pages/EditPlayerSkills.js`

---

### ✅ Requirement 2 — Match & Tournament Tracking
**Developer:** Nusrat

Features:
- Create matches
- Register teams & squads
- Enter player stats
- Update match results
- View match history

---

### ✅ Requirement 3 — Football Analytics
**Developer:** Maliha

Features:
- Player rankings
- Performance trends
- Player comparison
- Talent search
- Leaderboards

---

### ✅ Requirement 4 — Scouting & Trials
**Developer:** Shawfin

Features:
- Create trials/camps
- Player applications
- Scout requests
- Achievements & media
- Visibility settings

---

## Database Collections

### Users
```json
{
  "name": "String",
  "email": "String",
  "password": "Encrypted",
  "role": "Admin | Coach | Player"
}
```

### Players
```json
{
  "name": "String",
  "age": "Number",
  "position": "String",
  "dominantFoot": "String",
  "skills": {
    "pace": 95,
    "shooting": 94,
    "passing": 91,
    "dribbling": 96,
    "tackling": 38,
    "stamina": 90
  },
  "performanceHistory": [
    {
      "matchName": "String",
      "goals": 2,
      "assists": 1,
      "rating": 9
    }
  ]
}
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `POST /api/auth/logout` — Logout
- `POST /api/auth/change-password` — Change password

### Players
- `GET /api/players` — Get all players
- `POST /api/players` — Add player
- `GET /api/players/:id` — Get player
- `PUT /api/players/:id/skills` — Update skills
- `POST /api/players/:id/performance` — Add performance

### Matches
- `GET /api/matches` — Get all matches
- `POST /api/matches` — Create match
- `PUT /api/matches/:id/result` — Update result

### Analytics
- `GET /api/analytics/rankings` — Player rankings
- `GET /api/analytics/trends/:id` — Performance trends
- `GET /api/analytics/compare` — Compare players
- `GET /api/analytics/search` — Search talent
- `GET /api/analytics/leaderboards` — Leaderboards

## Security

- Passwords encrypted with bcryptjs
- JWT tokens (30-day expiry)
- Role-based access control
- Protected routes with middleware

## Testing

All 26 tests pass:
- ✅ 6 tests for Requirement 0
- ✅ 4 tests for Requirement 1
- ✅ 3 tests for Requirement 2
- ✅ 5 tests for Requirement 3
- ✅ 8 tests for Requirement 4
