<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { NAV_ICON_PATHS } from '$lib/components/header/constants';

	let { children } = $props();

	const hudControl =
		'inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition-colors rajdhani';

	const dashboardActive = $derived(page.url.pathname.startsWith('/dashboard'));
</script>

<div class="h-dvh min-h-0 overflow-x-hidden overflow-y-auto">
	<div class="mx-auto min-h-dvh w-full max-w-[1440px] p-4">
		<header class="relative z-20">
			<div class="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6">
				<div
					class="pointer-events-none absolute top-0 h-full w-full max-w-full border-0 border-b border-white"
				></div>
				<div class="justify-self-start">
					<a
						href={resolve('/')}
						class="{hudControl} border-border bg-card/50 text-muted hover:border-accent hover:text-accent"
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
							? 'border-accent bg-accent/15 text-accent'
							: 'border-border bg-card/50 text-muted hover:border-accent hover:text-accent'}"
						aria-current={dashboardActive ? 'page' : undefined}
					>
						<span class="orbitron text-[11px] tracking-[0.35em]">{m.dashboard_title()}</span>
					</a>
				</nav>

				<div class="justify-self-end">
					<a
						href="/resume.pdf"
						download="Daniel_Mendoza_Resume.pdf"
						class="{hudControl} border-accent bg-accent text-accent-foreground hover:bg-accent/90"
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
						<span class="hidden sm:inline">{m.resume_download_pdf()}</span>
					</a>
				</div>
			</div>
		</header>

		<main class="relative z-10">
			{@render children()}
		</main>
	</div>
</div>
