<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border">
	<div
		class="mx-auto flex md:max-w-4xl max-w-full lg:max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left"
	>
		<p class="text-sm text-muted">{m.footer_copyright({ year })}</p>

		<div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
			<a
				href={site.links.github}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-muted transition-colors hover:text-foreground"
			>
				GitHub
			</a>
			<a
				href={site.links.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-muted transition-colors hover:text-foreground"
			>
				LinkedIn
			</a>
		</div>
	</div>
</footer>
