<script lang="ts">
	import TabContent from '$lib/components/tabs/TabContent.svelte';
	import ResumeSection from './ResumeSection.svelte';

	interface Props {
		onenter?: () => void;
		onexit?: () => void;
	}

	let { onenter, onexit }: Props = $props();
</script>

<TabContent id="experience" {onenter} {onexit}>
	<ResumeSection />
</TabContent>
