# Lumina Fashion

A production-ready men's fashion e-commerce platform featuring a modern minimalist luxury UI (inspired by the Apple Store and Zara layouts).

## Features
* **Editorial UI**: Outfit + Inter typography, high-res image parallax zoom on card hover, and clean margins.
* **Responsive Layouts**: Fully responsive Zara-style multi-column grids (adaptive from mobile to desktop).
* **Interactive Cart**: Translucent slide-out sidebar drawer with line items quantity editing and responsive animations.
* **Integrated Routing**: Direct history-based URL routing for product categories, detailed product view, secure multi-step checkouts, client dashboard profiles, and auth forms.
* **JWT Authentication**: Password hashing (bcrypt) and JWT verification for profile and order histories.
* **Local Database**: Persistent SQLite database pre-seeded with custom luxury men's apparel.

---

## Getting Started

### 1. Install Dependencies
You can install dependencies for both frontend and backend using the root helper script:
```bash
npm run install:all
```

### 2. Start Dev Servers
Start both the Express backend API (Port 5000) and the Vite React app (Port 5173) in parallel:
```bash
npm run dev
```

---

## Project Structure
```text
├── backend/
│   ├── db.js          # SQLite connection and database seeding
│   ├── middleware.js  # JWT and error catching middleware
│   ├── routes/        # Router endpoints (auth, products, orders)
│   ├── server.js      # Main Express configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/   # CartContext & AuthContext
│   │   ├── components/# Header, Footer, Hero
│   │   ├── pages/     # Home, Catalog, ProductDetail, Auth, Profile, Checkout
│   │   └── App.jsx    # Client state history router
│   ├── index.html     # Custom Outfit/Inter fonts
│   └── package.json
└── package.json       # Monorepo concurrent execution scripts
```

## Project Prompt / README-Style Description

### Lumina Fashion Storefront

Lumina Fashion is a premium fashion storefront web application designed to showcase curated collections, brand storytelling, and interactive shopping experiences. The project combines a React + Vite frontend with an Express backend to deliver a polished, luxury-focused e-commerce presentation.

---

## Project Overview

This project builds a modern fashion retail website with:

- A premium landing page with hero content, editorial sections, and featured products  
- Product catalog browsing with filtering and shopping navigation  
- Dedicated brand and support pages such as About, FAQ, Size Guide, Careers, and legal pages  
- Footer navigation and location-based brand storytelling  
- Interactive UI behavior such as hover effects and CTA transitions  

The goal is to create a refined storefront that feels premium, minimal, and easy to navigate.

---

## Key Features

### Frontend
- React + Vite setup for fast development and optimized production builds  
- Custom page routing for homepage, catalog, product detail, profile, checkout, and informational pages  
- Reusable premium UI components like hero, header, and footer  
- Interactive hero button hover styling and polished visual transitions  
- Responsive layout for modern storefront presentation  

### Backend
- Express-based API server  
- Product route handling for catalog/product data  
- Filtering support for product categories, sizes, colors, and related attributes  

### Content & Navigation
- Brand storytelling page  
- FAQ page with help categories  
- Size guide and careers pages  
- Terms, refund, and privacy policy pages  
- Footer links connected to internal store sections  

---

## Tech Stack

### Frontend
- React  
- Vite  
- CSS / inline styling for custom brand presentation  

### Backend
- Node.js  
- Express  

### Development
- npm for package management  
- Vite build for production verification  

---

## Project Structure

### Frontend
- `src/App.jsx` – main routing and page rendering  
- `src/components/` – reusable UI components such as header, footer, and hero  
- `src/pages/` – homepage, catalog, product detail, auth, profile, legal, and informational pages  
- `src/context/` – cart/auth state providers  

### Backend
- `server.js` – API entry point  
- `routes/` – product, auth, order, and related route handling  

---

## Functional Summary

- Users can browse featured products and collections  
- Product filtering works through the catalog experience  
- Support and legal content is available through dedicated pages  
- Brand location and studio messaging are integrated into the homepage  
- Navigation routes are linked from header and footer  
- Visual interactions support a luxury brand feel  

---

## Development Notes

- Run the frontend locally with Vite  
- Run the backend API with Express  
- Verify changes by rebuilding the frontend  

---

## Expected Result

A polished fashion storefront that presents products, brand values, support information, and premium UI interactions in one integrated experience.

---

## Short Project Description for Promotion

Lumina Fashion is a luxury-inspired storefront web application crafted to showcase fashion products, brand identity, and curated lifestyle content through a refined, interactive user interface.

---

## Example README Intro

**Lumina Fashion** is a premium React-based fashion storefront built to present curated collections, brand storytelling, and storefront navigation in a polished luxury style.  
The application includes interactive hero CTA behavior, product-driven catalog browsing, informational pages, and brand location content, delivering a complete fashion retail presentation.

---

