<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import ResumeDownloadButton from '$lib/components/header/ResumeDownloadButton.svelte';

	let { children } = $props();

	const hudControl =
		'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors bartle';

	const dashboardActive = $derived(page.url.pathname.startsWith('/dashboard'));
</script>

<div class="h-dvh min-h-0 overflow-x-hidden overflow-y-auto">
	<div class="mx-auto min-h-dvh w-full max-w-[1440px] p-4">
		<header class="relative z-20">
			<div class="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 pb-6">
				<div
					class="pointer-events-none absolute top-0 h-full w-full max-w-full"
				></div>
				<div class="justify-self-start">
					<a
						href={resolve('/')}
						class="{hudControl} text-muted hover:border-accent hover:text-accent hover:bg-accent/25"
						aria-label={m.nav_home()}
					>
						<svg
							class="h-4 w-4 shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						<span class="hidden sm:inline">{m.nav_home()}</span>
					</a>
				</div>

				<nav class="justify-self-center" aria-label={m.dashboard_title()}>
					<a
						href={resolve('/dashboard')}
						class="{hudControl} {dashboardActive
							? 'text-accent'
							: 'text-muted hover:border-accent hover:text-accent'}"
						aria-current={dashboardActive ? 'page' : undefined}
					>
						{m.dashboard_title()}
					</a>
				</nav>

				<div class="justify-self-end">
					<ResumeDownloadButton />
				</div>
			</div>
		</header>

		<main class="relative z-10">
			{@render children()}
		</main>
	</div>
</div>
