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
		Tooltip
	} from 'chart.js';
	import { chartTooltip, formatChartDate, readChartTheme } from './chart-theme';

	let {
		labels,
		values,
		valueLabel
	}: {
		labels: string[];
		values: number[];
		valueLabel: string;
	} = $props();

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

	let canvas: HTMLCanvasElement | undefined = $state();
	let chart: Chart<'line'> | undefined;

	onMount(() => {
		return () => {
			chart?.destroy();
			chart = undefined;
		};
	});

	$effect(() => {
		void labels;
		void values;
		void valueLabel;

		if (!canvas) return;

		const theme = readChartTheme();
		const numberFormat = new Intl.NumberFormat(theme.locale, { maximumFractionDigits: 0 });

		if (!chart) {
			chart = new Chart(canvas, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: valueLabel,
							data: values,
							borderColor: theme.accent,
							backgroundColor: theme.lineFill,
							fill: true,
							tension: 0.35,
							borderWidth: 2,
							pointRadius: 2,
							pointHoverRadius: 4,
							pointBackgroundColor: theme.accent
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					interaction: { mode: 'index', intersect: false },
					plugins: {
						legend: { display: false },
						tooltip: {
							...chartTooltip(theme),
							callbacks: {
								title(items) {
									return formatChartDate(String(items[0]?.label ?? ''), theme.locale, {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									});
								},
								label(item) {
									const value =
										typeof item.parsed.y === 'number'
											? numberFormat.format(item.parsed.y)
											: item.formattedValue;
									return ` ${item.dataset.label}: ${value}`;
								}
							}
						}
					},
					scales: {
						x: {
							border: { display: false },
							ticks: {
								color: theme.muted,
								maxRotation: 0,
								autoSkip: true,
								autoSkipPadding: 16,
								font: { family: 'Rajdhani, sans-serif', size: 11 },
								callback(value) {
									return formatChartDate(this.getLabelForValue(Number(value)), theme.locale, {
										month: 'short',
										day: 'numeric'
									});
								}
							},
							grid: { display: false }
						},
						y: {
							beginAtZero: true,
							border: { display: false },
							ticks: { display: false },
							grid: { color: theme.grid }
						}
					}
				}
			});
			return;
		}

		chart.data.labels = labels;
		chart.data.datasets[0].label = valueLabel;
		chart.data.datasets[0].data = values;
		chart.update();
	});
</script>

<div class="h-full min-h-0 w-full">
	<canvas bind:this={canvas} aria-label={valueLabel}></canvas>
</div>
