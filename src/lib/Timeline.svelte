<script>
	import { median, rollups, scaleLinear } from 'd3';
	import { axis } from '#lib/axis.js';
	import { yearBrush } from '#lib/yearBrush.js';

	let { data, yearRange = null, onYearRangeChange = () => {} } = $props();
	let width = $state(600);
	const height = 280;
	const margin = { top: 18, right: 22, bottom: 46, left: 56 };
	let annual = $derived(rollups(
		data.filter((song) => song.loudness !== null),
		(songs) => median(songs, (song) => song.loudness),
		(song) => song.year
	).map(([year, loudness]) => ({ year, loudness })).sort((a, b) => a.year - b.year));
	let x = $derived(scaleLinear().domain([1958, 2025]).range([margin.left, width - margin.right]));
	let y = $derived(scaleLinear().domain([-24, 0]).range([height - margin.bottom, margin.top]));
	let points = $derived(annual.map((point) => `${x(point.year)},${y(point.loudness)}`).join(' '));
</script>

<section class="panel timeline-panel" aria-labelledby="timeline-title">
	<header class="panel-header">
		<div><p class="eyebrow">01 / Over time</p><h2 id="timeline-title">The volume of a hit</h2></div>
		<div class="brush-controls">
			<span class="tag">{yearRange === null ? '1958–2025' : `${yearRange[0]}–${yearRange[1]}`}</span>
			<button type="button" onclick={() => onYearRangeChange(null)} disabled={yearRange === null}>Clear brush</button>
		</div>
	</header>
	<p class="panel-description">Median loudness of #1 songs in each year. Closer to 0 means louder.</p>
	<div class="chart" bind:clientWidth={width}>
		<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart of annual median loudness in decibels from 1958 to 2025">
			{#each y.ticks(4) as tick}
				<line class="gridline" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
			{/each}
			<g class="axis" transform={`translate(0,${height - margin.bottom})`} use:axis={{ scale: x, values: width < 450 ? [1958, 1980, 2000, 2025] : [1958, 1970, 1980, 1990, 2000, 2010, 2025], format: (year) => String(year) }} />
			<g class="axis" transform={`translate(${margin.left},0)`} use:axis={{ scale: y, orientation: 'left', ticks: 4 }} />
			<polyline class="loudness-line" {points} />
			{#each annual as point (point.year)}
				<circle cx={x(point.year)} cy={y(point.loudness)} r="3" fill="var(--teal)">
					<title>{point.year}: {point.loudness.toFixed(1)} dB median loudness</title>
				</circle>
			{/each}
			<g class="year-brush" use:yearBrush={{ scale: x, extent: [[margin.left, margin.top], [width - margin.right, height - margin.bottom]], range: yearRange, onChange: onYearRangeChange }} />
			<text class="axis-label" x={(margin.left + width - margin.right) / 2} y={height - 6} text-anchor="middle">Year reached #1</text>
			<text class="axis-label" transform={`translate(14,${(margin.top + height - margin.bottom) / 2}) rotate(-90)`} text-anchor="middle">Median loudness (dB)</text>
		</svg>
	</div>
	<p class="chart-note">Drag across the plot to filter KPIs, genres, and scatterplot to an inclusive year range (endpoints round to the nearest year). Click outside the selection or clear the brush to restore all songs. The timeline always shows every year; songs with missing loudness are excluded from its medians.</p>
</section>

<style>
	.loudness-line { fill: none; stroke: var(--teal); stroke-width: 2.5; stroke-linejoin: round; }
	.brush-controls { display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 6px; }
	button { border: 1px solid var(--border); border-radius: 5px; background: transparent; color: var(--teal); font: inherit; font-size: 10px; padding: 5px 8px; cursor: pointer; }
	button:disabled { color: var(--muted); opacity: 0.5; cursor: default; }
	.year-brush :global(.selection) { fill: var(--teal); fill-opacity: 0.15; stroke: var(--teal); }
</style>
