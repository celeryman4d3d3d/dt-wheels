# Design Wheel

A smartboard-optimized React app for tracking student teams through the Stanford design thinking process: **ASK > IMAGINE > PLAN > CREATE > IMPROVE**.

## Features

- Interactive SVG wheels with spring-animated phase transitions
- 1-9 teams with responsive grid layout (optimized for 16:9 displays)
- Phase heatmap strip showing class-wide distribution
- Iteration tracking with cycle completion counter
- Stuck detection with configurable threshold
- Teacher sidebar for managing teams and settings
- Full localStorage persistence
- Designed for 1920x1080 smartboards, scales to any 16:9 resolution

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Netlify

Push to a Git repository and connect it to Netlify — the `netlify.toml` handles the build configuration automatically.

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- localStorage for persistence
