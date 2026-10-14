<script>
	import { scaleLinear, scaleSqrt } from 'd3';
	import { axis } from '#lib/axis.js';

	let { data, hoveredGenre = null } = $props();
	let width = $state(600);
	const height = 280;
	const margin = { top: 18, right: 22, bottom: 46, left: 56 };
	// Keep sizes comparable when brushing; 19 weeks is the full dataset maximum.
	const radius = scaleSqrt().domain([0, 19]).range([0, 10]);
	const legendWeeks = [1, 5, 10, 19];
	let available = $derived(data.filter((song) => song.energy !== null && song.happiness !== null));
	let missing = $derived(data.filter((song) => song.energy === null || song.happiness === null));
	let x = $derived(scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]));
	let y = $derived(scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]));
</script>

<section class="panel scatter-panel" aria-labelledby="scatter-title">
	<header class="panel-header">
		<div><p class="eyebrow">02 / Song by song</p><h2 id="scatter-title">Energy meets happiness</h2></div>
		<span class="tag"><span class="legend-dot"></span> One song</span>
	</header>
	<p class="panel-description">Each circle is a #1 song. Circle area is proportional to weeks at #1. Hover for details.</p>
	<div class="size-legend" aria-label="Circle size legend: weeks at number one">
		<span>Weeks at #1</span>
		{#each legendWeeks as weeks}
			<span class="size-legend-item">
				<svg width="22" height="22" aria-hidden="true">
					<circle class="song-mark" cx="11" cy="11" r={radius(weeks)} />
				</svg>
				<span>{weeks}</span>
			</span>
		{/each}
	</div>
	<div class="chart" bind:clientWidth={width}>
		<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Scatterplot of energy and happiness on 0–100 scales for ${available.length} number-one songs, with circle area proportional to weeks at number one`}>
			{#each [0, 20, 40, 60, 80, 100] as tick}
				<line class="gridline" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
				<line class="gridline" x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} />
			{/each}
			<g class="axis" transform={`translate(0,${height - margin.bottom})`} use:axis={{ scale: x, ticks: 5 }} />
			<g class="axis" transform={`translate(${margin.left},0)`} use:axis={{ scale: y, orientation: 'left', ticks: 5 }} />
			{#each available as song}
				<circle class="song-mark" cx={x(song.energy)} cy={y(song.happiness)} r={radius(song.weeksAtNumberOne ?? 0)} opacity={hoveredGenre === null || song.genre === hoveredGenre ? 1 : 0.12}>
					<title>{song.song} — {song.artist} ({song.year})&#10;Energy: {song.energy}/100 · Happiness: {song.happiness}/100&#10;Weeks at #1: {song.weeksAtNumberOne ?? 'unavailable'}</title>
				</circle>
			{/each}
			<text class="axis-label" x={(margin.left + width - margin.right) / 2} y={height - 6} text-anchor="middle">Energy (0–100)</text>
			<text class="axis-label" transform={`translate(14,${(margin.top + height - margin.bottom) / 2}) rotate(-90)`} text-anchor="middle">Happiness (0–100)</text>
		</svg>
	</div>
	<div class="chart-note missing-note">
		{#if missing.length}
			<svg width={missing.length * 24} height="22" role="img" aria-label={`${missing.length} songs with missing audio values, sized by weeks at number one`}>
				{#each missing as song, index}
					<circle cx={12 + index * 24} cy="11" r={radius(song.weeksAtNumberOne ?? 0)} fill="var(--muted)" opacity={hoveredGenre === null || song.genre === hoveredGenre ? 1 : 0.12}><title>{song.song} — {song.artist}: audio values unavailable&#10;Weeks at #1: {song.weeksAtNumberOne ?? 'unavailable'}</title></circle>
				{/each}
			</svg>
		{/if}
		<span>{missing.length} songs lack audio values and are shown here, outside the axes.</span>
	</div>
</section>

<style>
	.song-mark { fill: var(--orange); stroke: var(--orange); stroke-width: 0.5; }
	.song-mark:hover { stroke: var(--ink); stroke-width: 1.5; }
	.legend-dot { width: 7px; height: 7px; background: var(--orange); border-radius: 50%; }
	.size-legend { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; color: var(--muted); font-size: 10px; margin-bottom: 12px; }
	.size-legend-item { display: inline-flex; align-items: center; gap: 5px; }
	.size-legend-item svg { display: block; flex-shrink: 0; }
	.missing-note { display: flex; align-items: center; gap: 6px; }
	.missing-note svg { flex-shrink: 0; }
</style>
