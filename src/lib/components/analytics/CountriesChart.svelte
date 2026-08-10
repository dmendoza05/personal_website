<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Legend,
		Tooltip
	} from 'chart.js';
	import type { AnalyticsCountry } from '$lib/analytics';
	import { colorWithAlpha } from './chart-colors';

	let {
		countries,
		requestsLabel
	}: {
		countries: AnalyticsCountry[];
		requestsLabel: string;
	} = $props();

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

	let canvas: HTMLCanvasElement | undefined = $state();
	let chart: Chart<'bar'> | undefined;

	onMount(() => {
		return () => {
			chart?.destroy();
			chart = undefined;
		};
	});

	$effect(() => {
		const labels = countries.map((entry) => entry.country);
		const values = countries.map((entry) => entry.requests);

		if (!canvas) return;

		const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
		const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#a3a3a3';
		const foreground = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fafafa';

		if (!chart) {
			chart = new Chart(canvas, {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: requestsLabel,
							data: values,
							backgroundColor: colorWithAlpha(accent, 0.7),
							borderColor: accent,
							borderWidth: 1,
							borderRadius: 2
						}
					]
				},
				options: {
					indexAxis: 'y',
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							titleFont: { family: 'Rajdhani, sans-serif' },
							bodyFont: { family: 'Rajdhani, sans-serif' }
						}
					},
					scales: {
						x: {
							beginAtZero: true,
							ticks: { color: muted, precision: 0 },
							grid: { color: colorWithAlpha(muted, 0.15) }
						},
						y: {
							ticks: { color: foreground },
							grid: { display: false }
						}
					}
				}
			});
			return;
		}

		chart.data.labels = labels;
		chart.data.datasets[0].label = requestsLabel;
		chart.data.datasets[0].data = values;
		chart.update();
	});
</script>

<div class="h-72 w-full sm:h-80">
	<canvas bind:this={canvas} aria-label={requestsLabel}></canvas>
</div>
