<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fakeAds } from '$lib/data/fake-ads';

	const LOAD_MS = 750;
	const banner = fakeAds.find((ad) => ad.type === 'thumbnail');

	let imageEl = $state<HTMLImageElement>();
	let ready = $state(false);

	onMount(() => {
		let cancelled = false;
		let timeout = 0;
		let removeAssetListeners = () => {};
		const img = imageEl;

		const minDelay = new Promise<void>((resolveDelay) => {
			timeout = window.setTimeout(resolveDelay, LOAD_MS);
		});

		const assetReady = new Promise<void>((resolveAsset) => {
			if (!img) {
				resolveAsset();
				return;
			}

			const settle = () => {
				removeAssetListeners();
				resolveAsset();
			};

			removeAssetListeners = () => {
				img.removeEventListener('load', settle);
				img.removeEventListener('error', settle);
			};

			if (img.complete) {
				resolveAsset();
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

	function onAdClick(event: MouseEvent) {
		if (!ready) event.preventDefault();
	}
</script>

<div class="rail-link">
	<a
		class="rail-link__hit"
		class:rail-link__hit--pending={!ready}
		href={resolve('/dashboard')}
		aria-label={ready ? (banner?.name ?? 'Dashboard') : 'Loading'}
		aria-busy={!ready}
		aria-disabled={!ready}
		tabindex={ready ? undefined : -1}
		onclick={onAdClick}
	>
		<img
			bind:this={imageEl}
			class="rail-link__image"
			class:rail-link__image--pending={!ready}
			src={banner?.asset}
			alt=""
			width="426"
			height="462"
		/>
		{#if ready}
			<span class="rail-link__mark">DM</span>
		{:else}
			<span class="rail-link__spinner" aria-hidden="true"></span>
		{/if}
	</a>
</div>

<style>
	.rail-link {
		display: none;
		width: min(100%, calc(min(42rem, (100dvh - 9rem) * 1079 / 1541) * 426 / 1079));
		max-width: calc(100% - 0.75rem);
		pointer-events: none;
	}

	.rail-link__hit {
		position: relative;
		display: block;
		width: 100%;
		max-width: 100%;
		padding: 0;
		border: 0;
		background: none;
		line-height: 0;
		cursor: pointer;
		pointer-events: auto;
	}

	.rail-link__hit--pending {
		cursor: default;
		pointer-events: none;
	}

	.rail-link__image {
		display: block;
		width: 100%;
		min-width: 0;
		max-width: 100%;
		height: auto;
		aspect-ratio: 426 / 462;
		border: 1px solid var(--border);
	}

	.rail-link__image--pending {
		visibility: hidden;
	}

	.rail-link__spinner {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		background: var(--card);
	}

	.rail-link__spinner::after {
		display: block;
		width: 1.75rem;
		height: 1.75rem;
		border: 2px solid color-mix(in srgb, var(--fg) 22%, transparent);
		border-top-color: var(--accent);
		border-radius: 50%;
		content: '';
		animation: rail-link-spin 0.7s linear infinite;
	}

	.rail-link__mark {
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

	@keyframes rail-link-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rail-link__spinner::after {
			border-color: var(--accent);
			animation: none;
		}
	}

	@container (min-width: 8rem) {
		.rail-link {
			display: block;
		}
	}
</style>
