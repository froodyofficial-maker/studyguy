# GamerGuy V1

A polished static prototype for GamerGuy, a horror-game discovery and database site.

## Run it
Because the app loads `games.json`, open it through a local web server rather than double-clicking `index.html`.

Easy option:
- Python: `python -m http.server 8000`
- Then visit `http://localhost:8000`

## Included
- GamerGuy landing page
- Smooth dark/red horror UI
- Recommendation tag modal
- Match scoring
- Known-game search
- Game profile modal
- Horror intensity meters
- Similar-game suggestions
- Steam store buttons
- Responsive mobile layout

## Important
This V1 uses a small local demo database. The next production step is replacing that data layer with a backend/Steam-data pipeline and expanding the horror-specific tagging system.
