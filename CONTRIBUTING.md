# Contributing Guidelines

## Team Members

| Member | Requirement | Branch |
|--------|-------------|--------|
| Talal Rahi | 0 & 1 | requirement-0-auth, requirement-1-player |
| Nusrat | 2 | requirement-2-matches |
| Maliha | 3 | requirement-3-analytics |
| Shawfin | 4 | requirement-4-scouting |

## How to Push Your Work

### Step 1 — Create Your Branch
```bash
git checkout -b requirement-X-name
```

### Step 2 — Make Your Changes
Edit your requirement files.

### Step 3 — Commit
```bash
git add .
git commit -m "Requirement X: Description of changes"
```

### Step 4 — Push
```bash
git push origin requirement-X-name
```

### Step 5 — Create Pull Request
Go to GitHub → Click "Create Pull Request"

### Step 6 — Team Lead Merges
Team lead reviews and merges to main.

## Commit Message Format

✅ Good:

Requirement 0: Added user authentication with JWT

❌ Bad:
fixed stuff
update
changes

## Before Pushing

- [ ] Test your code locally
- [ ] No console errors
- [ ] API endpoints work
- [ ] Database queries work
Save this file.
