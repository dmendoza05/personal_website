<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import ResumeSection from './ResumeSection.svelte';
	import type { SceneHandler, ScenePreset } from '$lib/scene';

	interface Props {
		preset?: ScenePreset;
		onenter?: SceneHandler;
		onexit?: SceneHandler;
	}

	let { preset, onenter, onexit }: Props = $props();
</script>

<TabContent id="experience" {preset} {onenter} {onexit}>
	<ResumeSection />
</TabContent>
