<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Filler,
		Legend,
		Tooltip
	} from 'chart.js';
	import type { AnalyticsTimeseriesPoint } from '$lib/analytics';
	import { colorWithAlpha } from './chart-colors';

	let {
		points,
		pageViewsLabel,
		requestsLabel
	}: {
		points: AnalyticsTimeseriesPoint[];
		pageViewsLabel: string;
		requestsLabel: string;
	} = $props();

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Filler,
		Legend,
		Tooltip
	);

	let canvas: HTMLCanvasElement | undefined = $state();
	let chart: Chart<'line'> | undefined;

	onMount(() => {
		return () => {
			chart?.destroy();
			chart = undefined;
		};
	});

	$effect(() => {
		const labels = points.map((point) => point.date);
		const pageViews = points.map((point) => point.pageViews);
		const requests = points.map((point) => point.requests);

		if (!canvas) return;

		const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
		const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#a3a3a3';
		const foreground = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fafafa';

		if (!chart) {
			chart = new Chart(canvas, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: pageViewsLabel,
							data: pageViews,
							borderColor: accent,
							backgroundColor: colorWithAlpha(accent, 0.15),
							fill: true,
							tension: 0.35,
							pointRadius: 2,
							pointHoverRadius: 4
						},
						{
							label: requestsLabel,
							data: requests,
							borderColor: muted,
							backgroundColor: 'transparent',
							fill: false,
							tension: 0.35,
							pointRadius: 2,
							pointHoverRadius: 4,
							borderDash: [4, 4]
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					interaction: { mode: 'index', intersect: false },
					plugins: {
						legend: {
							labels: { color: foreground, boxWidth: 12, font: { family: 'Rajdhani, sans-serif' } }
						},
						tooltip: {
							titleFont: { family: 'Rajdhani, sans-serif' },
							bodyFont: { family: 'Rajdhani, sans-serif' }
						}
					},
					scales: {
						x: {
							ticks: { color: muted, maxRotation: 0, autoSkipPadding: 12 },
							grid: { color: colorWithAlpha(muted, 0.15) }
						},
						y: {
							beginAtZero: true,
							ticks: { color: muted, precision: 0 },
							grid: { color: colorWithAlpha(muted, 0.15) }
						}
					}
				}
			});
			return;
		}

		chart.data.labels = labels;
		chart.data.datasets[0].label = pageViewsLabel;
		chart.data.datasets[0].data = pageViews;
		chart.data.datasets[1].label = requestsLabel;
		chart.data.datasets[1].data = requests;
		chart.update();
	});
</script>

<div class="h-64 w-full sm:h-80">
	<canvas bind:this={canvas} aria-label={pageViewsLabel}></canvas>
</div>
