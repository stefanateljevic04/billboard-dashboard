<script>
	import { scaleLinear } from 'd3';
	import { axis } from '#lib/axis.js';

	let { data } = $props();
	let width = $state(600);
	const height = 280;
	const margin = { top: 18, right: 22, bottom: 46, left: 56 };
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
	<p class="panel-description">Each circle is a #1 song. Hover a circle for its title and artist.</p>
	<div class="chart" bind:clientWidth={width}>
		<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Scatterplot of energy and happiness on 0–100 scales for ${available.length} number-one songs`}>
			{#each [0, 20, 40, 60, 80, 100] as tick}
				<line class="gridline" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
				<line class="gridline" x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} />
			{/each}
			<g class="axis" transform={`translate(0,${height - margin.bottom})`} use:axis={{ scale: x, ticks: 5 }} />
			<g class="axis" transform={`translate(${margin.left},0)`} use:axis={{ scale: y, orientation: 'left', ticks: 5 }} />
			{#each available as song}
				<circle class="song-mark" cx={x(song.energy)} cy={y(song.happiness)} r="3.5">
					<title>{song.song} — {song.artist} ({song.year})&#10;Energy: {song.energy}/100 · Happiness: {song.happiness}/100</title>
				</circle>
			{/each}
			<text class="axis-label" x={(margin.left + width - margin.right) / 2} y={height - 6} text-anchor="middle">Energy (0–100)</text>
			<text class="axis-label" transform={`translate(14,${(margin.top + height - margin.bottom) / 2}) rotate(-90)`} text-anchor="middle">Happiness (0–100)</text>
		</svg>
	</div>
	<div class="chart-note missing-note">
		{#if missing.length}
			<svg width={missing.length * 14} height="14" role="img" aria-label={`${missing.length} songs with missing audio values`}>
				{#each missing as song, index}
					<circle cx={7 + index * 14} cy="7" r="3.5" fill="var(--muted)"><title>{song.song} — {song.artist}: audio values unavailable</title></circle>
				{/each}
			</svg>
		{/if}
		<span>{missing.length} songs lack audio values and are shown here, outside the axes.</span>
	</div>
</section>

<style>
	.song-mark { fill: var(--orange); fill-opacity: 0.42; stroke: var(--orange); stroke-width: 0.5; }
	.song-mark:hover { fill-opacity: 1; stroke: var(--ink); stroke-width: 1.5; }
	.legend-dot { width: 7px; height: 7px; background: var(--orange); border-radius: 50%; }
	.missing-note { display: flex; align-items: center; gap: 6px; }
	.missing-note svg { flex-shrink: 0; }
</style>
