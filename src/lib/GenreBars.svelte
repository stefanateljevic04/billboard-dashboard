<script>
	import { max, rollups, scaleBand, scaleLinear } from 'd3';
	import { axis } from '#lib/axis.js';

	let { data } = $props();
	let width = $state(600);
	const height = 310;
	const margin = { top: 8, right: 40, bottom: 44, left: 122 };
	let genres = $derived(rollups(data, (songs) => songs.length, (song) => song.genre)
		.map(([genre, count]) => ({ genre, count }))
		.sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre)));
	let x = $derived(scaleLinear().domain([0, max(genres, (group) => group.count) || 1]).nice().range([margin.left, width - margin.right]));
	let y = $derived(scaleBand().domain(genres.map((group) => group.genre)).range([margin.top, height - margin.bottom]).padding(0.28));
</script>

<section class="panel genre-panel" aria-labelledby="genre-title">
	<header class="panel-header">
		<div><p class="eyebrow">03 / By genre</p><h2 id="genre-title">What tops the chart?</h2></div>
		<span class="tag">Song counts</span>
	</header>
	<p class="panel-description">Number of #1 songs by primary genre, from most to least.</p>
	<div class="chart" bind:clientWidth={width}>
		<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Horizontal bar chart of number-one songs by primary genre, sorted by count">
			{#each x.ticks(4) as tick}
				<line class="gridline" x1={x(tick)} x2={x(tick)} y1={margin.top} y2={height - margin.bottom} />
			{/each}
			<g class="axis genre-axis" transform={`translate(${margin.left},0)`} use:axis={{ scale: y, orientation: 'left' }} />
			<g class="axis" transform={`translate(0,${height - margin.bottom})`} use:axis={{ scale: x, ticks: width < 450 ? 3 : 5, format: (count) => String(count) }} />
			{#each genres as group (group.genre)}
				<rect x={x(0)} y={y(group.genre)} width={x(group.count) - x(0)} height={y.bandwidth()} rx="2" fill={group.genre === 'Unlabeled' ? 'var(--muted)' : 'var(--teal)'}>
					<title>{group.genre}: {group.count} #1 songs</title>
				</rect>
				<text class="bar-count" x={x(group.count) + 6} y={y(group.genre) + y.bandwidth() / 2} dominant-baseline="middle">{group.count}</text>
			{/each}
			<text class="axis-label" x={(margin.left + width - margin.right) / 2} y={height - 5} text-anchor="middle">Number of #1 songs</text>
		</svg>
	</div>
	<p class="chart-note">Primary genre is the first label before “;”. Blank labels are counted as Unlabeled.</p>
</section>

<style>
	.bar-count { fill: var(--ink); font-size: 10px; font-variant-numeric: tabular-nums; }
</style>
