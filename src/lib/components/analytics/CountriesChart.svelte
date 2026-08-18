<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip
	} from 'chart.js';
	import type { AnalyticsCountry } from '$lib/analytics';
	import { chartTooltip, readChartTheme } from './chart-theme';

	let {
		countries,
		requestsLabel
	}: {
		countries: AnalyticsCountry[];
		requestsLabel: string;
	} = $props();

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

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

		const theme = readChartTheme();
		const numberFormat = new Intl.NumberFormat(theme.locale, { maximumFractionDigits: 0 });

		if (!chart) {
			chart = new Chart(canvas, {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: requestsLabel,
							data: values,
							backgroundColor: theme.countryFill,
							borderColor: theme.accent,
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
							...chartTooltip(theme),
							callbacks: {
								label(item) {
									const value =
										typeof item.parsed.x === 'number'
											? numberFormat.format(item.parsed.x)
											: item.formattedValue;
									return ` ${item.dataset.label}: ${value}`;
								}
							}
						}
					},
					scales: {
						x: {
							beginAtZero: true,
							border: { display: false },
							ticks: { display: false },
							grid: { color: theme.grid }
						},
						y: {
							ticks: {
								color: theme.foreground,
								font: { family: 'Rajdhani, sans-serif', size: 11 }
							},
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

<div class="h-full min-h-0 w-full">
	<canvas bind:this={canvas} aria-label={requestsLabel}></canvas>
</div>
