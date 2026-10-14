<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { parseSong } from '#lib/data.js';
	import Timeline from '#lib/Timeline.svelte';
	import GenreBars from '#lib/GenreBars.svelte';
	import Scatter from '#lib/Scatter.svelte';
	import KpiRow from '#lib/KpiRow.svelte';

	let data = $state([]);
	let loading = $state(true);
	let error = $state('');
	let hoveredGenre = $state(null);
	let yearRange = $state(null);
	let filtered = $derived(yearRange === null
		? data
		: data.filter((song) => song.year >= yearRange[0] && song.year <= yearRange[1]));

	onMount(() => {
		const controller = new AbortController();
		d3.csv('/billboard_hot_100_no1.csv', { signal: controller.signal }, parseSong)
			.then((songs) => { data = songs; loading = false; })
			.catch((reason) => {
				if (reason.name === 'AbortError') return;
				error = 'The song data could not be loaded. Please refresh to try again.';
				loading = false;
			});
		return () => controller.abort();
	});
</script>

<svelte:head>
	<title>The #1s — Billboard Dashboard</title>
	<meta name="description" content="Explore the loudness, genres, energy, and happiness of songs that reached #1 on the Billboard Hot 100 from 1958 to early 2025." />
</svelte:head>

<main>
	<header class="page-header">
		<div>
			<p class="eyebrow masthead">Billboard Hot 100 / A data portrait</p>
			<h1>The <span>#1s.</span></h1>
			<p class="intro">The sounds that made it to the top. Explore #1 songs from 1958 to early 2025.</p>
		</div>
		<div class="edition"><span class="edition-dot"></span> {yearRange === null ? 'Full collection' : 'Selected years'} <span class="edition-years">{yearRange === null ? '1958 — 2025' : `${yearRange[0]} — ${yearRange[1]}`}</span></div>
	</header>
	{#if loading}
		<div class="status" role="status">Loading the chart-toppers…</div>
	{:else if error}
		<div class="status" role="alert">{error}</div>
	{:else}
		<div class="dashboard">
			<Timeline {data} {yearRange} onYearRangeChange={(range) => yearRange = range} />
			<Scatter data={filtered} {hoveredGenre} />
			<GenreBars data={filtered} onGenreHover={(genre) => hoveredGenre = genre} />
			<KpiRow data={filtered} scopeLabel={yearRange === null ? 'Full dataset' : `${yearRange[0]}–${yearRange[1]}`} />
		</div>
	{/if}
	<footer class="page-footer"><span>Source: Chris Dalla Riva · Uncharted Territory</span><span>Each row is a song that reached #1 · Brush filters result views; genre hover highlights songs</span></footer>
</main>

<style>
	:global(body) { margin: 0; background: #f4f3ed; font-family: 'Helvetica Neue', Arial, sans-serif; color: #202b29; }
	:global(*) { box-sizing: border-box; }
	:global(:root) { --ink: #202b29; --muted: #68746f; --teal: #287c72; --orange: #c7764d; --border: #e1e5dc; }
	main { max-width: 1600px; margin: 0 auto; padding: 28px 40px 18px; }
	.page-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-bottom: 24px; }
	:global(.eyebrow) { font-size: 10px; font-weight: 650; letter-spacing: 1.8px; text-transform: uppercase; color: var(--muted); margin: 0 0 8px; }
	.masthead { letter-spacing: 2.2px; }
	h1 { font-size: 48px; letter-spacing: -2.5px; line-height: 1; margin: 0 0 12px; font-weight: 650; }
	h1 span { color: var(--teal); }
	.intro { font-size: 13px; color: var(--muted); margin: 0; line-height: 1.6; }
	.edition { font-size: 11px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
	.edition-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); }
	.edition-years { display: block; width: 100%; text-align: right; font-size: 18px; letter-spacing: 1px; margin-top: 5px; }
	.dashboard { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; }
	:global(.panel) { background: #fcfcf8; border: 1px solid var(--border); border-radius: 10px; padding: 22px 24px 16px; min-width: 0; display: flex; flex-direction: column; }
	:global(.panel-header) { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
	:global(.panel h2) { font-size: 20px; letter-spacing: -0.5px; margin: 0; font-weight: 600; }
	:global(.tag) { display: inline-flex; gap: 6px; align-items: center; border: 1px solid var(--border); padding: 5px 8px; border-radius: 5px; color: var(--muted); font-size: 10px; white-space: nowrap; }
	:global(.panel-description) { font-size: 12px; color: var(--muted); line-height: 1.6; margin: 12px 0 16px; }
	:global(.chart) { width: 100%; min-width: 0; }
	:global(.chart > svg) { display: block; width: 100%; overflow: visible; }
	:global(.axis) { color: #98a39c; }
	:global(.axis text) { fill: var(--muted); font-family: inherit; font-size: 10px; }
	:global(.axis-label) { fill: var(--muted); font-size: 11px; }
	:global(.gridline) { stroke: var(--border); stroke-dasharray: 2 4; }
	:global(.genre-axis .domain), :global(.genre-axis .tick line) { display: none; }
	:global(.chart-note) { font-size: 10px; line-height: 1.5; margin: 10px 0 0; color: var(--muted); }
	.page-footer { display: flex; justify-content: space-between; gap: 12px; font-size: 10px; line-height: 1.6; color: var(--muted); padding-top: 14px; }
	.status { border: 1px solid var(--border); border-radius: 10px; padding: 80px 24px; text-align: center; color: var(--muted); }
	@media (max-width: 850px) {
		main { padding: 24px 18px; }
		.dashboard { grid-template-columns: 1fr; }
		:global(.timeline-panel) { order: 1; }
		:global(.genre-panel) { order: 2; }
		:global(.scatter-panel) { order: 3; }
		:global(.kpi-panel) { order: 4; }
		.page-footer { flex-direction: column; }
	}
	@media (max-width: 480px) {
		main { padding: 20px 12px; }
		.page-header { align-items: flex-start; }
		h1 { font-size: 40px; }
		.edition { display: none; }
		:global(.panel) { padding: 18px 14px 14px; }
		:global(.panel h2) { font-size: 17px; }
		:global(.tag) { font-size: 9px; padding: 4px 5px; }
	}
</style>
