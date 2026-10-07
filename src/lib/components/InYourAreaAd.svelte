<script lang="ts" module>
	let open = $state(false);
	let matched = $state(false);
	let saving = $state(false);
	let booted = false;
</script>

<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { sendAdReaction } from '$lib/ad-reaction';
	import { awayPhrase } from '$lib/distance-from-la';
	import { deLocalizeUrl } from '$lib/paraglide/runtime';

	let {
		milesFromLa = null,
		side = 'center'
	}: { milesFromLa?: number | null; side?: 'left' | 'right' | 'center' } = $props();

	const DISMISS_KEY = 'dee-bugg-dismissed';

	onMount(() => {
		if (booted) return;
		booted = true;
		if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

		const timer = window.setTimeout(() => {
			open = true;
		}, 700);

		return () => window.clearTimeout(timer);
	});

	$effect(() => {
		if (!open || side !== 'center') return;

		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') ignore();
		}

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	const onHome = $derived(deLocalizeUrl(page.url).pathname === '/');
	const away = $derived(awayPhrase(milesFromLa));

	function dismiss() {
		sessionStorage.setItem(DISMISS_KEY, '1');
		open = false;
	}

	async function confirm(event: SubmitEvent) {
		event.preventDefault();
		if (saving || matched) return;

		saving = true;
		await sendAdReaction('up', page.url.pathname);
		matched = true;
		saving = false;
	}

	function ignore() {
		if (matched) {
			dismiss();
			return;
		}

		void sendAdReaction('down', page.url.pathname);
		dismiss();
	}
</script>

{#snippet card(side: 'left' | 'right' | 'center')}
	<form
		class="in-your-area-ad__card in-your-area-ad__card--{side}"
		aria-labelledby="in-your-area-ad-title-{side}"
		onsubmit={confirm}
	>
		<div class="in-your-area-ad__header">
			<p id="in-your-area-ad-title-{side}" class="in-your-area-ad__title">
				(1) New Unemployed Dude In Your Area
			</p>
			<svg class="in-your-area-ad__icon" viewBox="0 0 28 20" aria-hidden="true">
				<circle cx="17.2" cy="5.2" r="2.5" fill="currentColor" />
				<path
					fill="currentColor"
					d="M12.4 16.2v-.8c0-1.9 1.7-3.2 4.8-3.2s4.8 1.3 4.8 3.2v.8z"
				/>
				<circle cx="9.2" cy="6.4" r="3.1" fill="currentColor" />
				<path fill="currentColor" d="M2.2 17.4v-1.1C2.2 13.6 5 11.6 9.2 11.6s7 2 7 4.7v1.1z" />
			</svg>
		</div>

		<div class="in-your-area-ad__body">
			<img
				class="in-your-area-ad__photo"
				src="/ads/danielmendoza.JPG"
				alt="Daniel Mendoza"
				width="1242"
				height="1622"
			/>
			<div class="in-your-area-ad__copy">
				<p class="in-your-area-ad__message" aria-live="polite">
					{#if matched}
						It's a match!<br />Daniel is... 0 miles away!
					{:else}
						Daniel is... {away}<br />away!
					{/if}
				</p>
				<div class="in-your-area-ad__actions">
					{#if matched}
						<button type="button" class="in-your-area-ad__button" onclick={dismiss}>Close</button>
					{:else}
						<button type="submit" class="in-your-area-ad__button" disabled={saving}>Confirm</button>
						<button type="button" class="in-your-area-ad__button" disabled={saving} onclick={ignore}>
							Ignore
						</button>
					{/if}
				</div>
			</div>
		</div>
	</form>
{/snippet}

{#if open && !onHome}
	{#if side === 'center'}
		<div class="in-your-area-ad">
			{@render card('center')}
		</div>
	{:else}
		{@render card(side)}
	{/if}
{/if}

<style>
	.in-your-area-ad {
		position: fixed;
		z-index: 40;
		display: flex;
		align-items: center;
		justify-content: center;
		inset: 0;
		padding: 1rem;
		pointer-events: none;
	}

	.in-your-area-ad__card {
		container-type: inline-size;
		width: min(28rem, 100%);
		pointer-events: auto;
		border: 1px solid #d5d5d5;
		border-radius: 10px;
		background: #fff;
		box-shadow:
			0 1px 2px rgb(0 0 0 / 12%),
			0 12px 28px rgb(0 0 0 / 22%);
		color: #111;
		font-family: Arial, Helvetica, sans-serif;
		overflow: hidden;
		animation: in-your-area-ad-in 220ms ease-out;
	}

	.in-your-area-ad__header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.55rem 0.75rem;
		background: #3b5998;
		color: #fff;
	}

	.in-your-area-ad__title {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 400;
		line-height: 1.2;
	}

	.in-your-area-ad__icon {
		display: block;
		flex-shrink: 0;
		width: 1.65rem;
		height: 1.2rem;
	}

	.in-your-area-ad__body {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 0.85rem 0.95rem 1rem;
	}

	.in-your-area-ad__photo {
		display: block;
		flex-shrink: 0;
		width: 8.15rem;
		max-width: none;
		height: 9.6rem;
		object-fit: cover;
		object-position: center 28%;
		border: 1px solid #c5c5c5;
	}

	.in-your-area-ad__copy {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
	}

	.in-your-area-ad__message {
		margin: 0;
		color: #111;
		font-size: 1.28rem;
		font-weight: 700;
		line-height: 1.25;
		text-align: center;
	}

	.in-your-area-ad__actions {
		display: flex;
		justify-content: center;
		gap: 0.65rem;
		width: 100%;
		margin-top: 0.85rem;
	}

	.in-your-area-ad__button {
		min-width: 6.4rem;
		padding: 0.42rem 0.85rem;
		border: 1px solid #4d63ae;
		border-radius: 4px;
		appearance: none;
		background: #5d73c4;
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 28%);
		color: #fff;
		cursor: pointer;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.in-your-area-ad__button:hover {
		background: #5268b8;
	}

	.in-your-area-ad__button:disabled {
		cursor: default;
		opacity: 0.7;
	}

	.in-your-area-ad__card--left,
	.in-your-area-ad__card--right {
		display: none;
		width: min(28rem, calc(100% - 0.75rem));
		flex-shrink: 0;
	}

	.in-your-area-ad__card--left .in-your-area-ad__header {
		justify-content: flex-end;
	}

	.in-your-area-ad__card--right .in-your-area-ad__header {
		justify-content: flex-start;
	}

	.in-your-area-ad__card--right .in-your-area-ad__body {
		flex-direction: row-reverse;
	}

	.in-your-area-ad__card--left .in-your-area-ad__copy {
		align-items: flex-end;
	}

	.in-your-area-ad__card--right .in-your-area-ad__copy {
		align-items: flex-start;
	}

	.in-your-area-ad__card--left .in-your-area-ad__message {
		text-align: right;
	}

	.in-your-area-ad__card--right .in-your-area-ad__message {
		text-align: left;
	}

	.in-your-area-ad__card--left .in-your-area-ad__actions {
		justify-content: flex-end;
	}

	.in-your-area-ad__card--right .in-your-area-ad__actions {
		justify-content: flex-start;
	}

	@container (min-width: 18rem) {
		.in-your-area-ad__card--left,
		.in-your-area-ad__card--right {
			display: block;
		}
	}

	@keyframes in-your-area-ad-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}

		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 420px) {
		.in-your-area-ad__title {
			font-size: 1rem;
		}

		.in-your-area-ad__photo {
			width: 6.1rem;
			height: 7.4rem;
		}

		.in-your-area-ad__message {
			font-size: 1.05rem;
		}

		.in-your-area-ad__button {
			min-width: 0;
			flex: 1;
			font-size: 0.95rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.in-your-area-ad__card {
			animation: none;
		}
	}

	@media (max-height: 719px) {
		.in-your-area-ad__card--left,
		.in-your-area-ad__card--right {
			display: none;
		}
	}

	@media (min-width: 116rem) and (min-height: 720px) {
		.in-your-area-ad__card--center {
			display: none;
		}
	}

	@container (max-width: 24rem) {
		.in-your-area-ad__title {
			font-size: 0.95rem;
		}

		.in-your-area-ad__photo {
			width: 5.25rem;
			height: 6.4rem;
		}

		.in-your-area-ad__message {
			font-size: 1rem;
		}

		.in-your-area-ad__button {
			min-width: 0;
			padding: 0.35rem 0.55rem;
			font-size: 0.9rem;
		}
	}
</style>
