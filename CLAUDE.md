# Fitness App - Repository Documentation

## Overview
A vanilla JavaScript workout timer application that runs entirely as a static site. No build process or frameworks required.

## File Structure

### HTML
- `index.html` - Main page with workout table, controls, and UI elements

### JavaScript Files (loaded in order)
1. `runFitness.js` - Core workout timer logic
   - Manages exercise progression and countdown
   - Handles play/pause/reset functionality
   - Implements text-to-speech announcements
   - Supports multiple rounds and rest periods
   - Uses wake lock API to keep screen awake during workouts

2. `fitnessGridCrud.js` - Table/UI management
   - Edit mode toggle for contenteditable cells
   - Add/remove workout rows
   - Bulk edit mode (textarea <-> table conversion)
   - Row removal functionality

3. `saveProgram.js` - Persistence layer
   - Saves workout to URL parameters
   - Loads workout from URL parameters on page load
   - Stores exercise names, durations, rest periods, and rounds

### CSS
- `fitness.css` - Styling with responsive 4vw font sizing

## Key Features

### Workout Management
- Table-based UI with contenteditable cells
- Exercise name and duration (in seconds)
- Add/remove rows dynamically
- Edit mode toggle (shows/hides X buttons and +Add Row button)

### Bulk Edit Mode
- Toggle between table view and text-based bulk edit
- Format: `exercise name duration` (one per line)
- Last space separates name from duration
- Invalid/missing durations default to 0
- When in bulk edit: Edit, +Add Row, and Save buttons are hidden

### Timer Functionality
- Countdown timer with visual display
- Text-to-speech announcements at 30s intervals and final countdown (2, 1)
- Optional rest periods between exercises
- Multi-round support with round counter display
- Play/Pause toggle functionality
- Reset button to restart workout

### Persistence
- URL-based storage using search parameters
- Workout data encoded as `~` separated values
- Includes exercise names, durations, rest value, and rounds
- Loads automatically on page load from URL

## Data Flow
1. User creates/edits workout in table (or bulk edit mode)
2. Click Save → workout encoded to URL parameters
3. On page reload → URL parameters decoded and table populated
4. Click Play → timer progresses through exercises with announcements
5. Optional rest periods and multiple rounds supported

## UI States
- **Normal View**: Table visible, Edit button shown, +Add Row hidden, Save shown
- **Edit Mode**: Table editable, +Add Row visible, X buttons visible
- **Bulk Edit Mode**: Textarea replaces table, Edit/+Add Row/Save hidden
- **Playing**: Timer active, current exercise and time displayed

## Technical Notes
- No external dependencies
- Uses modern browser APIs (wake lock, speech synthesis)
- Responsive design with viewport-based font sizing (4vw)
- Script execution order matters (functions called across files)
