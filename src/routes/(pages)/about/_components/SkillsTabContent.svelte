<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import SkillsSection from './SkillsSection.svelte';

	interface Props {
		onenter?: () => void;
		onexit?: () => void;
	}

	let { onenter, onexit }: Props = $props();
</script>

<TabContent id="skills" {onenter} {onexit}>
	<SkillsSection />
</TabContent>
