<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	const text = $derived(m.home_news_banner());
	const copies = $derived(Array.from({ length: 8 }, () => text));
</script>

<aside
	class="news-banner fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/30 text-white backdrop-blur-sm"
	aria-label={text}
>
	<div class="flex items-stretch">
		<span
			class="news-banner__label flex shrink-0 items-center justify-center px-3 py-2 sm:px-4"
			aria-hidden="true"
		>
			<svg
				class="h-5 w-5 sm:h-6 sm:w-6"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<!-- antenna -->
				<path
					d="M12 3v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<circle cx="12" cy="2.25" r="1.25" fill="currentColor" />
				<!-- head -->
				<rect
					x="5.5"
					y="6"
					width="13"
					height="9"
					rx="2"
					stroke="currentColor"
					stroke-width="1.75"
				/>
				<!-- eyes -->
				<circle cx="9.25" cy="10.25" r="1.35" fill="currentColor" />
				<circle cx="14.75" cy="10.25" r="1.35" fill="currentColor" />
				<!-- mouth -->
				<path
					d="M9 13.25h6"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<!-- body -->
				<path
					d="M8.5 15v2.5c0 .55.45 1 1 1h5c.55 0 1-.45 1-1V15"
					stroke="currentColor"
					stroke-width="1.75"
				/>
				<!-- arms -->
				<path
					d="M5.5 10.5H3.75c-.55 0-1 .45-1 1v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<path
					d="M18.5 10.5h1.75c.55 0 1 .45 1 1v3"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<!-- feet -->
				<path
					d="M9.5 18.5v2.25M14.5 18.5v2.25"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
			</svg>
		</span>

		<a
			href={resolve('/dashboard')}
			class="news-banner__track relative min-w-0 flex-1 cursor-pointer overflow-hidden flex"
			aria-label={m.dashboard_title()}
		>
			<div class="news-banner__marquee flex w-max" aria-hidden="true">
				{#each [0, 1] as set (set)}
					<div class="flex shrink-0 items-center">
						{#each copies as copy, i (`${set}-${i}`)}
							<span
								class="whitespace-nowrap px-6 text-sm font-semibold uppercase tracking-[0.35em] rajdhani sm:text-base"
							>
								{copy}
							</span>
							<span class="text-white/40">◆</span>
						{/each}
					</div>
				{/each}
			</div>
		</a>
	</div>
</aside>

<style>
	.news-banner__label {
		background: var(--accent);
		color: var(--accent-fg);
	}

	.news-banner__track::before,
	.news-banner__track::after {
		content: '';
		pointer-events: none;
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 1;
		width: 2.5rem;
	}

	.news-banner__track::before {
		left: 0;
		background: linear-gradient(to right, rgb(0 0 0 / 0.6), transparent);
	}

	.news-banner__track::after {
		right: 0;
		background: linear-gradient(to left, rgb(0 0 0 / 0.6), transparent);
	}

	.news-banner__marquee {
		animation: news-banner-ltr 28s linear infinite;
	}

	@keyframes news-banner-ltr {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.news-banner__marquee {
			animation: none;
			transform: none;
		}
	}
</style>
