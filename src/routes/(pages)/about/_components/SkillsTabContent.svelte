<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import SkillsSection from './SkillsSection.svelte';
	import type { SceneHandler, ScenePreset } from '$lib/scene';

	interface Props {
		preset?: ScenePreset;
		onenter?: SceneHandler;
		onexit?: SceneHandler;
	}

	let { preset, onenter, onexit }: Props = $props();
</script>

<TabContent id="skills" {preset} {onenter} {onexit}>
	<SkillsSection />
</TabContent>
