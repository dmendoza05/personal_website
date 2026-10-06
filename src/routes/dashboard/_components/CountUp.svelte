<script lang="ts">
	import { formatDashboardNumber } from '$lib/dashboard';
	import { runCountUp } from './panel-motion';

	let { value = 0, active = false }: { value?: number; active?: boolean } = $props();

	let displayed = $state(0);

	$effect(() => {
		if (!active) {
			displayed = 0;
			return;
		}

		return runCountUp(value, (next) => {
			displayed = next;
		});
	});
</script>

{formatDashboardNumber(displayed)}
