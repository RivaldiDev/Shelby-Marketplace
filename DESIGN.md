---
version: "alpha"
name: "Instance.io - Identity Protocol"
description: "Instance Identity Button Component is designed for building reusable UI components in modern web projects. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for component libraries and responsive product interfaces."
colors:
  primary: "#E4573D"
  secondary: "#34D399"
  tertiary: "#ECD340"
  neutral: "#EAE8E1"
  background: "#EAE8E1"
  surface: "#F4F3EF"
  text-primary: "#8E8B82"
  text-secondary: "#1A1918"
  border: "#A39F96"
  accent: "#E4573D"
typography:
  display-lg:
    fontFamily: "System Font"
    fontSize: "48px"
    fontWeight: 400
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "System Font"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label-md:
    fontFamily: "System Font"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  full: "9999px"
spacing:
  base: "8px"
  sm: "1px"
  md: "2px"
  lg: "8px"
  xl: "10px"
  gap: "6px"
  card-padding: "10px"
  section-padding: "24px"
components:
  button-primary:
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "1px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Minimal

## Colors

The color system uses dark mode with #E4573D as the main accent and #EAE8E1 as the neutral foundation.

- **Primary (#E4573D):** Main accent and emphasis color.
- **Secondary (#34D399):** Supporting accent for secondary emphasis.
- **Tertiary (#ECD340):** Reserved accent for supporting contrast moments.
- **Neutral (#EAE8E1):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #EAE8E1; Surface: #F4F3EF; Text Primary: #8E8B82; Text Secondary: #1A1918; Border: #A39F96; Accent: #E4573D

- **Gradients:** bg-gradient-to-b from-[#2D2C2A] to-transparent, bg-gradient-to-b from-[#5c5a58] to-[#1A1918]

## Typography

Typography relies on System Font across display, body, and utility text.

- **Display (`display-lg`):** System Font, 48px, weight 400, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** System Font, 14px, weight 400, line-height 20px.
- **Labels (`label-md`):** System Font, 16px, weight 400, line-height 24px.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, full bleed structural frame before changing ornament or component styling. Use 8px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Full Bleed
- **Base unit:** 8px
- **Scale:** 1px, 2px, 8px, 10px, 16px, 24px, 32px, 96px
- **Section padding:** 24px, 137.7px
- **Card padding:** 10px
- **Gaps:** 6px, 8px, 12px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #A39F96; 1px #D1CFC7; 2px #F4F3EF; 1px #E0DED6
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 2px 3px -1px, rgba(25, 28, 33, 0.02) 0px 1px 0px 0px, rgba(25, 28, 33, 0.08) 0px 0px 0px 1px; rgb(255, 255, 255) 0px 0px 0px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.4) 0px 20px 60px 0px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.035) 0px 2.8px 2.2px 0px, rgba(0, 0, 0, 0.047) 0px 6.7px 5.3px 0px, rgba(0, 0, 0, 0.06) 0px 12.5px 10px 0px, rgba(0, 0, 0, 0.07) 0px 22.3px 17.9px 0px, rgba(0, 0, 0, 0.086) 0px 41.8px 33.4px 0px, rgba(0, 0, 0, 0.12) 0px 100px 80px 0px
- **Blur:** 4px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0.5px padding and a 0px radius. Drive the shell with none so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 2px, 6px, 20px, 32px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** text #1A1918, radius 9999px, padding 1px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 8px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 2px, 6px, 20px, 32px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected minimal motion intensity without a deliberate reason.

## Motion

Motion stays restrained and interface-led across text, layout, and scroll transitions. Timing clusters around 150ms and 100ms. Easing favors ease and cubic-bezier(0.4. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** minimal

**Durations:** 150ms, 100ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1), ease-out

**Scroll Patterns:** gsap-scrolltrigger

## WebGL

Reconstruct the graphics as a inset canvas accent using canvas-backed effect. The effect should read as technical and atmospheric: dot-matrix particle field with gray on soft amber and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow orbital drift. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Inset canvas accent
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow orbital drift
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** Canvas-backed effect

**Techniques:** Dot matrix, Pointer parallax, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL / Canvas Animation Area -->
      <canvas id="digital-canvas" class="absolute inset-0 w-full h-full z-10 mix-blend-multiply opacity-85"></canvas>

      <!-- Bottom Technical Rules -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- 1. Canvas Animation ---
      const canvas = document.getElementById('digital-canvas');
      const ctx = canvas.getContext('2d');

      let width, height;
      let particles = [];
      const particleCount = 150;
      …
      ```
