# UNIPREP Web Application

An Angular 20, standalone-based web application for the Uniprep platform. The app uses PrimeNG/Material UI components, NgRx for state management, and is configured for SSR and optional PWA capabilities.

Current date/time: 2025-10-07 18:53

## Overview
- Framework: Angular 20 (standalone APIs)
- Language: TypeScript
- UI: PrimeNG, Angular Material
- State: NgRx (store, effects, devtools)
- HTTP: Angular HttpClient with interceptors
- Testing: Karma + Jasmine
- Package manager: npm (package-lock.json present)
- Build tool: @angular/build (Angular CLI)
- Optional tooling present: Vite config (chunk size warnings only) – not used by Angular build
- SSR configuration present via @angular/ssr
- PWA config present via @angular/service-worker (ngsw-config.json)

## Requirements
- Node.js >= 18 (LTS recommended). Angular 20 supports Node 18/20.
- npm >= 9 (bundled with Node LTS)
- Modern browser (Chrome, Edge, Firefox, Safari)

Optional (global):
- Angular CLI (if you prefer running ng directly):
  - npm i -g @angular/cli

## Getting Started
1) Install dependencies
- npm install

2) Run the dev server
- npm start
  - Opens on http://localhost:4200 by default
  - Equivalent to ng serve

3) Build for production
- npm run build
  - Output path: dist/UNIPREP (see angular.json)

4) Watch build (development)
- npm run watch

## Scripts (from package.json)
- start: ng serve
- build: ng build
- watch: ng build --watch --configuration development
- test: ng test

Note: There are no e2e or lint scripts configured in package.json in this repository.

## Entry Points
- Browser main: src/main.ts
- Root application configuration (providers, router, NgRx, etc.): src/app/app.config.ts
- Server-side configuration for SSR: src/app/app.config.server.ts
- Routing: src/app/app.routes (referenced in app.config.ts)
- Angular CLI build configuration: angular.json
- Service Worker config (PWA): ngsw-config.json
- Vite config (not used by Angular build): vite.config.ts

## Environments and Configuration
Angular environment files are located in src/environments/:
- environment.ts (production: false)
- environment.prod.ts (production: true)

Common keys exposed in environment files:
- domain
- production
- ApiUrl
- ApiUrlEmployer
- employerDomain
- tokenKey
- secretKeySalt
- facebookAppId
- linkedinId
- whatsappSupportNumber
- partnerDomain
- instituteDomain
- talentDomain
- studentDomain
- jobDomain
- googleCloud.apiKey
- uniApplyUrl
- uniapplyAPI
- imagePath

How to select environment:
- Development (default): ng serve uses environment.ts
- Production: ng build --configuration production replaces environment.ts with environment.prod.ts (see angular.json fileReplacements)

Important:
- Do not commit real secrets/keys to version control. If secrets are needed, replace them with placeholders and load securely at runtime/build time.
- TODO: Review and externalize any sensitive keys currently present in environment files.

## Running Tests
- Unit tests (Karma + Jasmine):
  - npm test
  - Configuration: karma.conf.js

Coverage output is configured under coverage/ (note: current karma.conf.js uses coverage/my-pet — this path name looks leftover/stale; adjust if needed).

No e2e tests are configured in this repo.

## Project Structure (high-level)
- src/
  - main.ts (bootstrap)
  - index.html
  - styles.scss
  - app/
    - app.component.*
    - app.config.ts (providers, router, NgRx)
    - app.config.server.ts (SSR)
    - app.routes (routes)
    - pages/ (feature modules and components; e.g., landing, dashboard, talent-connect)
    - Auth/ (auth services, NgRx, interceptors)
    - theme/, components/, services/, @Models/, @shared/ ...
  - environments/
    - environment.ts
    - environment.prod.ts
  - assets/, uniprep-assets/
- angular.json (CLI build/serve options)
- ngsw-config.json (PWA)
- karma.conf.js (unit test runner)
- tsconfig*.json (TypeScript configs)
- package.json, package-lock.json
- vite.config.ts (not used by ng build)

## PWA (Service Worker)
- ngsw-config.json is present and @angular/service-worker is a dependency.
- provideServiceWorker is imported in app.config.ts, but not currently registered in providers.
- TODO: If PWA is required, register the Service Worker in app.config.ts, e.g.:
  - provideServiceWorker('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerWhenStable:30000' })
  - And ensure serviceWorker is enabled for production builds.

## SSR (Server-Side Rendering)
- @angular/ssr is present; src/app/app.config.server.ts configures provideServerRendering and merges with appConfig.
- TODO: Document how to build and run SSR in this repo if/when server entry points and scripts are added (e.g., ng run UNIPREP:serve-ssr). No SSR scripts are currently defined in package.json.

## Development Notes
- Allowed CommonJS deps (angular.json): pusher-js, quill-delta, google-libphonenumber, speak-tts, transliteration, file-saver
- Global styles and scripts are configured in angular.json (e.g., Quill, Bootstrap, Slick Carousel)
- Third-party UI: PrimeNG and Angular Material are both listed; PrimeNG theming configured in app.config.ts via providePrimeNG
- State management via NgRx is set up with store, effects, and devtools

## Deployment
- Build: npm run build
- Serve the contents of dist/UNIPREP with a static web server or your hosting provider.
- If using PWA, ensure HTTPS and proper headers for service workers.
- TODO: Provide deployment steps for the target hosting environment(s) (e.g., Nginx, Firebase Hosting, Vercel, etc.).

## Troubleshooting
- If ng is not found, run via npx:
  - npx ng serve
- Node version issues: ensure Node 18 or 20 LTS.
- Port conflicts on 4200: ng serve --port 4300

