<script lang="ts" module>
	import type { AdVote } from '$lib/ad-reaction';

	let vote = $state<AdVote | null>(null);
	let saving = $state(false);
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		readStoredAdVote,
		sendAdReaction,
		writeStoredAdVote,
		type AdVote
	} from '$lib/ad-reaction';
	import { fakeAds } from '$lib/data/fake-ads';

	interface ConfettiPiece {
		id: number;
		left: number;
		delay: number;
		duration: number;
		size: number;
		drift: number;
		emoji: string;
	}

	let { side }: { side: 'left' | 'right' } = $props();

	const LOAD_MS = 750;
	const CONFETTI_COUNT = 32;
	const LAUGH_EMOJIS = ['😂', '🤣', '😆'];
	const SAD_EMOJIS = ['😢', '😞', '😭', '😔'];
	const verticalBanner = fakeAds.find((ad) => ad.type === 'vertical-banner');

	let dialogEl = $state<HTMLDialogElement>();
	let imageEl = $state<HTMLImageElement>();
	let ready = $state(false);
	let editing = $state(false);
	let confetti = $state<ConfettiPiece[] | null>(null);
	let confettiTimer = 0;

	onMount(() => {
		if (vote === null && verticalBanner) {
			vote = readStoredAdVote(verticalBanner.id) ?? readStoredAdVote(verticalBanner.type);
		}

		let cancelled = false;
		let timeout = 0;
		let removeAssetListeners = () => {};
		const img = imageEl;

		const minDelay = new Promise<void>((resolve) => {
			timeout = window.setTimeout(resolve, LOAD_MS);
		});

		const assetReady = new Promise<void>((resolve) => {
			if (!img) {
				resolve();
				return;
			}

			const settle = () => {
				removeAssetListeners();
				resolve();
			};

			removeAssetListeners = () => {
				img.removeEventListener('load', settle);
				img.removeEventListener('error', settle);
			};

			if (img.complete) {
				resolve();
				return;
			}

			img.addEventListener('load', settle);
			img.addEventListener('error', settle);

			if (img.complete) settle();
		});

		void Promise.all([minDelay, assetReady]).then(() => {
			if (!cancelled) ready = true;
		});

		return () => {
			cancelled = true;
			clearTimeout(timeout);
			removeAssetListeners();
		};
	});

	onDestroy(() => {
		clearTimeout(confettiTimer);
	});

	function rain(next: AdVote) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		clearTimeout(confettiTimer);
		confetti = Array.from({ length: CONFETTI_COUNT }, (_, id) => ({
			id,
			left: 4 + Math.random() * 92,
			delay: Math.random() * 180,
			duration: 1800 + Math.random() * 500,
			size: 1.45 + Math.random() * 0.9,
			drift: (Math.random() - 0.5) * 24,
			emoji:
				next === 'up' ? LAUGH_EMOJIS[id % LAUGH_EMOJIS.length] : SAD_EMOJIS[id % SAD_EMOJIS.length]
		}));
		confettiTimer = window.setTimeout(() => {
			confetti = null;
		}, 2600);
	}

	async function react(next: AdVote) {
		if (saving || !verticalBanner) return;
		if (vote === next) {
			editing = false;
			return;
		}

		const previous = vote;
		vote = next;
		saving = true;

		const ok = await sendAdReaction(next, page.url.pathname, verticalBanner.id);
		saving = false;
		if (!ok) {
			vote = previous;
			return;
		}

		writeStoredAdVote(verticalBanner.id, next);
		editing = false;
		rain(next);
	}

	function openJobPopup() {
		if (!dialogEl || dialogEl.open) return;
		dialogEl.showModal();
	}

	function onDialogClick(event: MouseEvent) {
		if (event.target === dialogEl) dialogEl?.close();
	}
</script>

{#snippet thumb(direction: AdVote)}
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
		{#if direction === 'up'}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
			/>
		{:else}
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"
			/>
		{/if}
	</svg>
{/snippet}

{#snippet banner(side: 'left' | 'right')}
	<div class="vertical-banner-ads__banner vertical-banner-ads__banner--{side}">
		<button
			type="button"
			class="vertical-banner-ads__hit"
			aria-label={ready ? (verticalBanner?.name ?? 'Advertisement') : 'Loading advertisement'}
			aria-busy={!ready}
			disabled={!ready}
			onclick={openJobPopup}
		>
			<img
				bind:this={imageEl}
				class="vertical-banner-ads__image"
				class:vertical-banner-ads__image--pending={!ready}
				src={verticalBanner?.asset}
				alt=""
				width="426"
				height="1079"
			/>
			{#if ready}
				<span class="vertical-banner-ads__label">Fake Ad</span>
				<span class="vertical-banner-ads__mark">DM</span>
			{:else}
				<span class="vertical-banner-ads__spinner" aria-hidden="true"></span>
			{/if}
		</button>
		{#if ready}
			<div class="vertical-banner-ads__footer">
				{#if vote && !editing}
					<p class="vertical-banner-ads__prompt">
						You {vote === 'up' ? 'liked' : 'disliked'} this fake ad.
						<button
							type="button"
							class="vertical-banner-ads__change"
							onclick={() => (editing = true)}
						>
							Changed your mind?
						</button>
					</p>
				{:else}
					<p class="vertical-banner-ads__prompt">did you like this?</p>
					<div class="vertical-banner-ads__votes">
						<button
							type="button"
							class="vertical-banner-ads__vote vertical-banner-ads__vote--up"
							aria-label="Thumbs up"
							aria-pressed={vote === 'up'}
							disabled={saving}
							onclick={() => react('up')}
						>
							{@render thumb('up')}
						</button>
						<button
							type="button"
							class="vertical-banner-ads__vote vertical-banner-ads__vote--down"
							aria-label="Thumbs down"
							aria-pressed={vote === 'down'}
							disabled={saving}
							onclick={() => react('down')}
						>
							{@render thumb('down')}
						</button>
					</div>
				{/if}
			</div>
		{/if}
		{#if confetti}
			<div class="vertical-banner-ads__confetti" aria-hidden="true">
				{#each confetti as piece (piece.id)}
					<span
						style:left="{piece.left}%"
						style:animation-delay="{piece.delay}ms"
						style:animation-duration="{piece.duration}ms"
						style:font-size="{piece.size}rem"
						style:--drift="{piece.drift}px">{piece.emoji}</span
					>
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

<div class="vertical-banner-ads">
	{@render banner(side)}
	<dialog
		bind:this={dialogEl}
		class="vertical-banner-ads__popup"
		aria-label="404: No Job Found"
		onclick={onDialogClick}
	>
		<p class="vertical-banner-ads__popup-message">404: No Job Found</p>
		<form method="dialog">
			<button type="submit" class="vertical-banner-ads__popup-close">Close</button>
		</form>
	</dialog>
</div>

<style>
	.vertical-banner-ads {
		display: none;
		width: fit-content;
		min-width: 0;
		max-width: calc(100% - 0.75rem);
		pointer-events: none;
	}

	.vertical-banner-ads__banner {
		position: relative;
		width: fit-content;
		min-width: 0;
		max-width: 100%;
		height: fit-content;
	}

	.vertical-banner-ads__hit {
		position: relative;
		display: block;
		width: fit-content;
		max-width: 100%;
		padding: 0;
		border: 0;
		background: none;
		line-height: 0;
		cursor: pointer;
		pointer-events: auto;
	}

	.vertical-banner-ads__image {
		display: block;
		width: auto;
		min-width: 0;
		max-width: 100%;
		height: auto;
		/* Leave room above this image for the dashboard banner on the left. */
		max-height: min(42rem, calc((100dvh - 9rem) * 1079 / 1541));
		border: 1px solid var(--border);
	}

	.vertical-banner-ads__image--pending {
		visibility: hidden;
	}

	.vertical-banner-ads__spinner {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--card);
	}

	.vertical-banner-ads__spinner::after {
		display: block;
		width: 1.75rem;
		height: 1.75rem;
		border: 2px solid color-mix(in srgb, var(--fg) 22%, transparent);
		border-top-color: var(--accent);
		border-radius: 50%;
		content: '';
		animation: vertical-banner-ads-spin 0.7s linear infinite;
	}

	.vertical-banner-ads__hit:disabled {
		cursor: default;
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

	.vertical-banner-ads__vote--up[aria-pressed='true'] {
		border-color: #4ade80;
		background: rgb(34 197 94 / 55%);
		color: #ecfdf5;
	}

	.vertical-banner-ads__vote--down[aria-pressed='true'] {
		border-color: #f87171;
		background: rgb(239 68 68 / 55%);
		color: #fef2f2;
	}

	.vertical-banner-ads__vote:disabled {
		cursor: default;
	}

	.vertical-banner-ads__change {
		display: inline;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font: inherit;
		text-decoration: underline;
		text-underline-offset: 0.12em;
		cursor: pointer;
	}

	.vertical-banner-ads__confetti {
		position: absolute;
		z-index: 2;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.vertical-banner-ads__confetti span {
		position: absolute;
		top: -15%;
		line-height: 1;
		animation-name: vertical-banner-ads-rain;
		animation-timing-function: ease-in;
		animation-fill-mode: forwards;
	}

	.vertical-banner-ads__popup {
		width: min(20rem, calc(100vw - 2rem));
		padding: 1.5rem 1.25rem 1.15rem;
		margin: auto;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--fg);
		pointer-events: auto;
	}

	.vertical-banner-ads__popup::backdrop {
		background: rgb(0 0 0 / 60%);
	}

	.vertical-banner-ads__popup-message {
		margin: 0;
		font-family: 'Orbitron', ui-sans-serif, system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-align: center;
	}

	.vertical-banner-ads__popup-close {
		display: block;
		width: 100%;
		margin-top: 1.15rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--fg);
		font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	@keyframes vertical-banner-ads-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes vertical-banner-ads-rain {
		to {
			top: 110%;
			opacity: 0;
			transform: translateX(var(--drift, 0px)) rotate(18deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.vertical-banner-ads__spinner::after {
			border-color: var(--accent);
			animation: none;
		}

		.vertical-banner-ads__confetti span {
			animation: none;
		}
	}

	@container (min-width: 8rem) {
		.vertical-banner-ads {
			display: block;
		}
	}
</style>
