<script lang="ts">
	import { page } from '$app/state';
	import { sendAdReaction, type AdVote } from '$lib/ad-reaction';
	import { fakeAds } from '$lib/data/fake-ads';

	type Side = 'left' | 'right';

	const verticalBanner = fakeAds.find((ad) => ad.type === 'vertical-banner');

	let vote = $state<AdVote | null>(null);
	let saving = $state(false);

	async function react(next: AdVote) {
		if (saving || vote === next) return;

		const previous = vote;
		vote = next;
		saving = true;

		const ok = await sendAdReaction(next, page.url.pathname);
		if (!ok) vote = previous;
		saving = false;
	}
</script>

{#snippet thumb(direction: Vote)}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		{#if direction === 'up'}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"
			/>
			<path stroke-linecap="round" stroke-linejoin="round" d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
		{:else}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"
			/>
			<path stroke-linecap="round" stroke-linejoin="round" d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
		{/if}
	</svg>
{/snippet}

{#snippet banner(side: Side)}
	<div class="vertical-banner-ads__banner vertical-banner-ads__banner--{side}">
		<img
			class="vertical-banner-ads__image"
			src={verticalBanner?.asset}
			alt=""
			width="426"
			height="1079"
		/>
		<span class="vertical-banner-ads__label">Fake Ad</span>
		<span class="vertical-banner-ads__mark">DM</span>
		<div class="vertical-banner-ads__footer">
			<p class="vertical-banner-ads__prompt">did you like this?</p>
			<div class="vertical-banner-ads__votes">
				<button
					type="button"
					class="vertical-banner-ads__vote"
					aria-label="Thumbs up"
					aria-pressed={vote === 'up'}
					disabled={saving}
					onclick={() => react('up')}
				>
					{@render thumb('up')}
				</button>
				<button
					type="button"
					class="vertical-banner-ads__vote"
					aria-label="Thumbs down"
					aria-pressed={vote === 'down'}
					disabled={saving}
					onclick={() => react('down')}
				>
					{@render thumb('down')}
				</button>
			</div>
		</div>
	</div>
{/snippet}

<div class="vertical-banner-ads">
	{@render banner('left')}
	{@render banner('right')}
</div>

<style>
	.vertical-banner-ads {
		display: none;
	}

	@media (min-width: 1680px) and (min-height: 720px) {
		.vertical-banner-ads {
			display: block;
			--content-half: 720px;
		}

		.vertical-banner-ads__banner {
			position: fixed;
			z-index: 20;
			top: 50%;
			width: fit-content;
			height: fit-content;
			pointer-events: none;
			transform: translateY(-50%);
		}

		.vertical-banner-ads__banner--left {
			right: calc(50vw + var(--content-half) + 1rem);
		}

		.vertical-banner-ads__banner--right {
			left: calc(50vw + var(--content-half) + 1rem);
		}

		.vertical-banner-ads__image {
			display: block;
			width: auto;
			max-width: calc(50vw - var(--content-half) - 2rem);
			height: auto;
			max-height: min(70dvh, 42rem);
			border: 1px solid var(--border);
		}

		.vertical-banner-ads__label {
			position: absolute;
			top: 0.35rem;
			left: 0.35rem;
			padding: 0.12rem 0.35rem;
			background: #6e6e6e;
			color: #f4f4f4;
			font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
			font-size: 0.7rem;
			font-weight: 600;
			line-height: 1.2;
		}

		.vertical-banner-ads__mark {
			position: absolute;
			top: 0.28rem;
			right: 0.4rem;
			color: #fff;
			font-family: 'BBH Bartle', ui-sans-serif, system-ui, sans-serif;
			font-size: 0.95rem;
			line-height: 1;
			letter-spacing: 0.04em;
			text-shadow: 0 1px 2px rgb(0 0 0 / 75%);
		}

		.vertical-banner-ads__footer {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.3rem;
			padding: 0.4rem 0.35rem 0.45rem;
			background: rgb(0 0 0 / 62%);
			pointer-events: auto;
		}

		.vertical-banner-ads__prompt {
			margin: 0;
			color: #f4f4f4;
			font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
			font-size: 0.75rem;
			line-height: 1.1;
			text-align: center;
		}

		.vertical-banner-ads__votes {
			display: flex;
			gap: 0.35rem;
		}

		.vertical-banner-ads__vote {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1.75rem;
			height: 1.75rem;
			padding: 0;
			border: 1px solid rgb(255 255 255 / 35%);
			background: rgb(255 255 255 / 10%);
			color: #fff;
			cursor: pointer;
		}

		.vertical-banner-ads__vote svg {
			width: 1rem;
			height: 1rem;
		}

		.vertical-banner-ads__vote[aria-pressed='true'] {
			border-color: var(--accent);
			background: color-mix(in srgb, var(--accent) 40%, transparent);
		}

		.vertical-banner-ads__vote:disabled {
			cursor: default;
		}
	}
</style>
