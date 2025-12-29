# MVP 6 - UI/UX Overhaul & Asset Polish

> **Status:** Planning
> **Estimated Time:** 3-5 days
> **Prerequisites:** MVP 5 (Core Mechanics)

This MVP shifts focus from narrative/polish (moved to MVP 7) to a complete UI/UX overhaul, establishing the game's visual identity, responsiveness, and "juice" (animations/sounds).

## Objectives

1.  **Visual Redesign:** Recreate the design from scratch using a focused art direction ("Nanobanana").
2.  **Mobile-First:** Ensure fully responsive and touch-friendly interface for both Mobile and Web.
3.  **Asset Generation:** Create high-quality assets using the defined AI workflow.
4.  **Juice:** Polish the experience with animations, visual effects, and sound.

## Features & User Stories

### 1. Visual Identity
*   [ ] Define color palette (Stone Age themes: Earthy tones + Vibrant accents).
*   [ ] Establish typography (Readable + Thematic).
*   [ ] Create UI Component System (Buttons, Panels, Modals, Inputs).

### 2. Assets (Nanobanana Workflow)
*   [ ] Generate specific assets for resources (Food, Wood, Stone, Gold).
*   [ ] Generate building sprites (Houses, Storage, Barracks).
*   [ ] Generate unit icons/sprites.
*   [ ] Generate UI elements (Frames, Icons, Backgrounds).

### 3. Responsive UI (Mobile First)
*   [ ] **Main Dashboard:** Stacked layout on mobile, grid on desktop.
*   [ ] **Game Board:** Pinch/zoom or optimized touch controls for map.
*   [ ] **Combat/Rival Screen:** Clear visualization of stats on small screens.
*   [ ] **Navigation:** Bottom tab bar for mobile, sidebar/top bar for desktop.

### 4. Audio & Visual FX
*   [ ] **Sound Effects (SFX):** Click, Build, Collect, Battle, Error/Success.
*   [ ] **Background Music:** Ambient loop.
*   [ ] **Animations:**
    *   Button hover/press states.
    *   Panel slide-ins/modals.
    *   Resource number counting (ticking up).
    *   Combat impact effects (shakes, flashes).

## Tech Stack & Tools

*   **Styling:** Tailwind CSS (for rapid, responsive styling).
*   **Animations:** Framer Motion (for React UI animations).
*   **Icons:** Lucide React (for functional icons), AI-generated for game icons.
*   **Audio:** Howler.js.
*   **Assets:** "Nanobanana" (AI Generation workflow).

## Tasks

### Phase 1: Setup & Assets
1.  Install Tailwind CSS, Framer Motion, Howler.js.
2.  Configure Tailwind theme (colors, fonts).
3.  **Asset Generation:** (Run `generate_image` based on prompts).

### Phase 2: Design System & Components
4.  Create `GameButton`, `GamePanel`, `ResourceBadge` components.
5.  Create `Layout` components (MobileMainLayout).

### Phase 3: Screen Redesign
6.  **Login/Register:** Simple, thematic entry.
7.  **Dashboard/Home:** Show Civ overview + Start Game.
8.  **Match/Game Loop:** The main active gameplay screen.
    *   Map View.
    *   Build Menu (Bottom sheet on mobile?).
    *   Resources Bar.
9.  **Rival/Combat View.**

### Phase 4: Juice
10. Add SFX to interactions.
11. Add transitions between screens.
12. Add "crunch" to combat (visual feedback).

## Verification
*   **Mobile Test:** Verify playability on phone viewport (Chrome DevTools).
*   **Desktop Test:** Verify layout scaling.
*   **Asset Consistency:** Ensure all generated assets match style guide.
