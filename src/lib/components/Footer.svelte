<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-border">
	<div class="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
		<p class="text-sm text-muted">{m.footer_copyright({ year })}</p>

		<div class="flex items-center gap-4">
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
			<a
				href={site.links.email}
				class="text-sm text-muted transition-colors hover:text-foreground"
			>
				Email
			</a>
		</div>
	</div>
</footer>
