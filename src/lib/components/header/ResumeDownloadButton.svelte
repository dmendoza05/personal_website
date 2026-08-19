<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { NAV_ICON_PATHS } from './constants';
</script>

<a
	href="/resume.pdf"
	download="Daniel_Mendoza_Resume.pdf"
	class="inline-flex items-center gap-2 rounded-sm border border-accent bg-accent px-3 py-1.5 text-accent-foreground transition-colors hover:bg-accent/90"
	aria-label={m.resume_download_pdf()}
>
	<svg
		class="h-4 w-4 shrink-0"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d={NAV_ICON_PATHS.resume} />
	</svg>
	<span class="flex flex-col items-start gap-0.5 leading-none">
		<span class="text-[10px] font-semibold uppercase tracking-[0.2em] rajdhani -mb-1.25">{m.resume_download_verb()}</span>
		<span class="text-sm font-medium bartle">{m.resume_title()}</span>
	</span>
</a>
