# Repository Guidelines

## Billboard Dashboard: Project Context

This repository is a JavaScript Svelte 5/SvelteKit dashboard scaffold using Vite and D3.

- SvelteKit runs on Vite. Start development with `npm run dev` at `http://localhost:5173`.
- Use Svelte 5 runes (`$state`, `$derived`, `$props`), not legacy `$:` declarations.
- Use D3 for scales, axes, CSV loading, and brush behavior. Svelte renders data marks with `{#each}`. D3 may manage axis and brush elements inside dedicated `<g>` elements.

## Project Structure & Module Organization

- `src/routes/+page.svelte`: main dashboard page; currently contains starter content.
- `src/routes/+layout.svelte`: shared layout and favicon setup.
- `src/lib/`: reusable components, data helpers, and imported assets. Use the configured `#lib` alias for imports.
- `src/app.html`: HTML document shell.
- `static/`: publicly served assets, including `billboard_hot_100_no1.csv` and its documentation, `billboard_README.md`.
- `vite.config.js`: SvelteKit plugin, runes mode, and automatic deployment adapter configuration.

Keep reusable chart and data logic in `src/lib/`; keep route components focused on page composition. Do not commit generated `.svelte-kit/`, build output, or `node_modules/`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local development server.
- `npm run dev -- --open`: start the server and open the application.
- `npm run build`: create the production build.
- `npm run preview`: serve the production build locally after building.
- `npm run prepare`: synchronize SvelteKit-generated configuration; also runs during installation.

## Coding Style & Naming Conventions

Follow existing files: tab indentation, single-quoted JavaScript strings, semicolons, and ES module imports. Runes mode is enabled in `vite.config.js`. Preserve SvelteKit route names such as `+page.svelte`. Prefer PascalCase for reusable components and camelCase for functions and variables. No formatter or linting tool is currently configured.

## Coordination Rules

- Keep `yearRange` and `hoveredGenre` in shared state in the page; each has one owner.
- Declare filtering state as `let yearRange = $state(null)` and the subset as `let filtered = $derived(...)`. `KpiRow`, `GenreBars`, and `Scatter` receive `filtered` through data props. All filtered result views must read this same derived subset.
- `Timeline` receives the full dataset and retains its full year domain for brushing.
- Linking means highlighting: dim non-matches and remove nothing. Filtering means removing non-matches and recomputing aggregates. State which behavior each feature implements.

## Testing Guidelines

No automated testing framework, test script, or coverage threshold is configured. Run `npm run build` before submitting changes and manually verify affected behavior with the development server or production preview. For dashboard changes, check chart rendering, interactions, and narrow-screen layouts. If adding tests, document the runner and commands in `package.json`.

## Dataset Handling

Read `static/billboard_README.md` before implementing charts. Load `static/billboard_hot_100_no1.csv` with `d3.csv` in `onMount`, using its public URL `/billboard_hot_100_no1.csv`.

- The CSV has 105 columns; use only `Date`, `Song`, `Artist`, `Weeks at Number One`, `CDR Genre`, `BPM`, `Energy`, `Danceability`, `Happiness`, `Acousticness`, `Loudness (dB)`, and `Length (Sec)`.
- Every value loads as a string. Convert numeric columns and parse `Date`; preserve missing numeric values.
- Dates such as `4-Aug-58` contain two-digit years. `%y` maps 00–68 to 2000–2068, so explicitly ensure 1958 is not parsed as 2058. The time axis must span 1958–2025 and end at 2025.
- Each row represents one song and the week it reached #1. “#1 songs per year” counts rows; “weeks at #1” uses `Weeks at Number One`. State which measure each view shows.
- `CDR Genre` is multi-valued (for example, `Pop;Rock`) and blank for 88 rows. Use the text before the first `;` as the primary genre; map blanks to `Unlabeled` and include these rows in counts.
- `Energy`, `Danceability`, `Happiness`, and `Acousticness` use 0–100 scales. `BPM`, `Loudness (dB)`, and `Length (Sec)` have their own units. Never share one scale across different units.

## Definition of Done

- `npm run dev` runs without console errors, including during interaction.
- The dashboard has four views: `Timeline`, `GenreBars`, `Scatter`, and `KpiRow`, with one brush filter and one hover link.
- Filtered views recompute over the shared subset; clearing the brush restores all songs.

## Commit & Pull Request Guidelines

The sole existing commit uses `scaffold: empty SvelteKit project + data.` Follow this concise, prefix-based style, for example `feat: add genre chart`. Pull requests should explain the change, list validation performed, link related issues when applicable, and include screenshots for visible dashboard changes.

- Prefer small, single-purpose commits with clear messages.
- After checking each working feature, remind the user to run `git add -A && git commit`.
- If a change breaks an interaction, inspect `git diff`. Before restoring a version, explain what will be discarded and let the user save any work they want to keep.
