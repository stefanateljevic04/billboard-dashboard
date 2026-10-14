<script>
	import { format, mean } from 'd3';

	let { data } = $props();
	let averageWeeks = $derived(mean(data.filter((song) => song.weeksAtNumberOne !== null), (song) => song.weeksAtNumberOne));
	let metrics = $derived([
		{ label: 'Total #1 songs', value: format(',')(data.length), unit: 'songs', description: 'One row per song that reached the top spot.' },
		{ label: 'Average weeks at #1', value: averageWeeks == null ? '—' : averageWeeks.toFixed(2), unit: 'weeks per song', description: 'Mean total time at #1, including non-consecutive weeks.' }
	]);
</script>

<section class="panel kpi-panel" aria-labelledby="kpi-title">
	<header class="panel-header">
		<div><p class="eyebrow">04 / The big picture</p><h2 id="kpi-title">A snapshot of the top spot</h2></div>
		<span class="tag">Full dataset</span>
	</header>
	<p class="panel-description">Two ways to summarize more than six decades of chart-toppers.</p>
	<div class="metrics">
		{#each metrics as metric (metric.label)}
			<div class="metric">
				<h3>{metric.label}</h3>
				<p class="metric-value">{metric.value}</p>
				<p class="metric-unit">{metric.unit}</p>
				<p class="metric-description">{metric.description}</p>
			</div>
		{/each}
	</div>
	<div class="scope-note"><strong>Only the #1s.</strong> These summaries describe songs that reached #1, not every song on the Billboard Hot 100.</div>
</section>

<style>
	.metrics { display: grid; grid-template-columns: 1fr 1fr; flex: 1; align-items: center; gap: 24px; padding: 30px 0; }
	.metric + .metric { border-left: 1px solid var(--border); padding-left: 24px; }
	h3 { font-size: 13px; font-weight: 600; margin: 0 0 18px; }
	.metric-value { font-size: clamp(36px, 4.5vw, 70px); line-height: 1; letter-spacing: -3px; font-weight: 650; margin: 0 0 8px; color: var(--teal); font-variant-numeric: tabular-nums; }
	.metric-unit { font-size: 12px; color: var(--muted); margin: 0; }
	.metric-description { font-size: 12px; line-height: 1.6; color: var(--muted); margin: 20px 0 0; max-width: 220px; }
	.scope-note { border-top: 1px solid var(--border); padding-top: 18px; font-size: 12px; line-height: 1.6; color: var(--muted); }
	.scope-note strong { color: var(--ink); }
	@media (max-width: 400px) { .metrics { gap: 12px; } .metric + .metric { padding-left: 12px; } }
</style>
