<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		type Plugin
	} from 'chart.js';
	import { colorWithAlpha } from './chart-colors';

	let {
		labels,
		values,
		valueLabel
	}: {
		labels: string[];
		values: number[];
		valueLabel: string;
	} = $props();

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

	let canvas: HTMLCanvasElement | undefined = $state();
	let chart: Chart<'bar'> | undefined;

	const hoverColumn: Plugin<'bar'> = {
		id: 'hoverColumn',
		beforeDatasetsDraw(instance) {
			const active = instance.getActiveElements()[0];
			if (!active) return;

			const element = instance.getDatasetMeta(active.datasetIndex).data[active.index];
			if (!element || !('width' in element)) return;

			const muted =
				getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#a3a3a3';
			const width = Number(element.width) + 8;
			const { chartArea, ctx } = instance;

			ctx.save();
			ctx.fillStyle = colorWithAlpha(muted, 0.12);
			ctx.fillRect(element.x - width / 2, chartArea.top, width, chartArea.bottom - chartArea.top);
			ctx.restore();
		}
	};

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

		const accent =
			getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#3b82f6';
		const muted =
			getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#a3a3a3';
		const foreground =
			getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fafafa';
		const card =
			getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#171717';
		const locale = document.documentElement.lang || undefined;
		const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

		if (!chart) {
			chart = new Chart(canvas, {
				type: 'bar',
				plugins: [hoverColumn],
				data: {
					labels,
					datasets: [
						{
							label: valueLabel,
							data: values,
							backgroundColor: accent,
							hoverBackgroundColor: accent,
							borderSkipped: false,
							borderRadius: 3,
							maxBarThickness: 28
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
							backgroundColor: card,
							titleColor: foreground,
							bodyColor: muted,
							borderColor: colorWithAlpha(muted, 0.25),
							borderWidth: 1,
							cornerRadius: 8,
							displayColors: true,
							boxWidth: 8,
							boxHeight: 8,
							boxPadding: 4,
							padding: 10,
							titleFont: { family: 'Rajdhani, sans-serif', size: 13, weight: 'bold' },
							bodyFont: { family: 'Rajdhani, sans-serif', size: 13 },
							callbacks: {
								title(items) {
									return formatChartDate(String(items[0]?.label ?? ''), locale, {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									});
								},
								label(item) {
									const value =
										typeof item.parsed.y === 'number' ? numberFormat.format(item.parsed.y) : item.formattedValue;
									return ` ${item.dataset.label}: ${value}`;
								}
							}
						}
					},
					scales: {
						x: {
							border: { display: false },
							ticks: {
								color: muted,
								maxRotation: 0,
								autoSkip: true,
								autoSkipPadding: 16,
								font: { family: 'Rajdhani, sans-serif', size: 11 },
								callback(value) {
									return formatChartDate(this.getLabelForValue(Number(value)), locale, {
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
							grid: { color: colorWithAlpha(muted, 0.12) }
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

	function formatChartDate(
		isoDay: string,
		locale: string | undefined,
		options: Intl.DateTimeFormatOptions
	): string {
		const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
		if (!match) return isoDay;

		const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
		return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(date);
	}
</script>

<div class="h-full min-h-0 w-full">
	<canvas bind:this={canvas} aria-label={valueLabel}></canvas>
</div>
