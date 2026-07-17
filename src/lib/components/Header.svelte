<script lang="ts">
	import type { Pathname } from '$app/types';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	const navItems: { href: Pathname; label: () => string }[] = [
		{ href: '/works', label: () => m.nav_works() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/blog', label: () => m.nav_blog() }
	];

	const COLLAPSED_HEIGHT = 150;

	let menuOpen = $state(false);

	afterNavigate(() => {
		menuOpen = false;
	});

	const isHome = $derived(page.url.pathname === '/');

	function isActive(href: Pathname) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMenu() {
		menuOpen = !menuOpen;
	}
</script>

<header id="header" class="sticky top-0 z-50 w-dvw border-b border-border backdrop-blur-sm">
	<div
		class="relative flex w-dvw flex-col items-center justify-center px-4 transition-[height] duration-500 ease-in-out motion-reduce:transition-none sm:px-6"
		style="height: {isHome
			? '100dvh'
			: `${COLLAPSED_HEIGHT}px`}; padding-top: 2rem; padding-bottom: 2rem; gap: 1.5rem;"
	>
		<a href={resolve('/')} aria-label="Home" class="inline-block">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="284"
				height="42"
				viewBox="0 0 284 42"
				fill="none"
				aria-hidden="true"
			>
				<path
					id="svg-name-1"
					xmlns="http://www.w3.org/2000/svg"
					d="M72.5352 41V13.0498H71.1445V34.1582C71.1444 34.7651 70.7787 35.312 70.2178 35.5439C69.6568 35.7758 69.0117 35.6466 68.583 35.2168L57.75 24.3545H0V21.3545H54.7578L46.0361 12.6094C45.608 12.1801 45.4805 11.5356 45.7129 10.9756C45.9453 10.4156 46.4914 10.0499 47.0977 10.0498H68.1445V0.999982H71.1445V10.0498H82.4336C83.2617 10.05 83.9334 10.7217 83.9336 11.5498V32.6582H85.1328V4.68455C85.1328 3.92361 85.7022 3.28282 86.458 3.19432C87.2138 3.10583 87.916 3.59753 88.0918 4.33787L93.0059 25.0303V11.5498C93.0061 10.7216 93.6776 10.0498 94.5059 10.0498H99.2305C100.059 10.05 100.73 10.7217 100.73 11.5498V31.581H102.287V11.5498C102.287 10.7216 102.959 10.0498 103.787 10.0498H115.5C116.109 10.0498 116.657 10.4182 116.888 10.9814C117.118 11.5447 116.986 12.192 116.553 12.6191L105.287 23.7099V29.3779L117.677 16.5937V4.23729H120.677V29.0947L125.5 23.5928V11.5498C125.5 10.7216 126.172 10.0498 127 10.0498C127.828 10.0498 128.5 10.7216 128.5 11.5498V22.2275L132.172 8.5908C132.367 7.86436 133.071 7.39463 133.816 7.49315C134.562 7.5918 135.12 8.22813 135.12 8.98045V22.2265L139.586 5.64061C139.781 4.91424 140.485 4.44456 141.23 4.54295C141.976 4.64161 142.534 5.27785 142.534 6.03026V31.581H144.111V11.5498C144.112 10.7216 144.783 10.0498 145.611 10.0498H157.323C157.932 10.0498 158.481 10.4181 158.712 10.9814C158.943 11.5448 158.81 12.192 158.376 12.6191L147.111 23.709V29.3769L159.5 16.5937V5.99998H162.5V22.4512L170.09 1.48924C170.338 0.804603 171.042 0.396824 171.759 0.522443C172.476 0.648325 173 1.27159 173 1.99998V10.0498L186 10.0508V0.999982H189V10.0508H200.5C201.328 10.0508 202 10.7223 202 11.5508V19.6709L213.644 8.99998H200.5V5.99998H217.5C218.119 5.99998 218.674 6.37957 218.898 6.95604C219.123 7.53244 218.969 8.18747 218.514 8.60545L204.357 21.581H217V11.5498C217 10.7214 217.672 10.0498 218.5 10.0498H226.835C227.663 10.0498 228.335 10.7214 228.335 11.5498V21.5078L238.006 21.5644L283.833 21.5L283.838 24.5L238.002 24.5654H237.991L228.335 24.5088V41H225.335V18.5498H220V34.1582H217V24.581H202V26.5C202 27.3284 201.328 28 200.5 28H191.5C190.672 28 190 27.3284 190 26.5V13.0508H189V31.5C189 32.1639 188.563 32.7484 187.927 32.9375C187.29 33.1264 186.606 32.8753 186.243 32.3193L173.687 13.0498H173V37.8418H170V10.5478L162.41 31.5107C162.162 32.1954 161.458 32.6032 160.741 32.4775C160.024 32.3516 159.5 31.7284 159.5 31V20.9053L146.688 34.125C146.406 34.4164 146.017 34.5809 145.611 34.581H141.034C140.206 34.581 139.534 33.9094 139.534 33.081V17.3701L135.068 33.957C134.873 34.6835 134.169 35.1533 133.423 35.0547C132.677 34.9559 132.12 34.3196 132.12 33.5674V20.3203L128.448 33.957C128.253 34.6834 127.549 35.1531 126.804 35.0547C126.058 34.956 125.5 34.3198 125.5 33.5674V28.1435L120.304 34.0703C119.892 34.5396 119.233 34.705 118.648 34.4853C118.064 34.2653 117.677 33.7057 117.677 33.081V20.9043L104.864 34.125C104.582 34.4165 104.193 34.581 103.787 34.581H99.2305C98.402 34.581 97.7305 33.9095 97.7305 33.081V13.0498H96.0059V37.8418C96.0059 38.6026 95.4363 39.2434 94.6807 39.332C93.9249 39.4205 93.2227 38.9288 93.0469 38.1885L88.1328 17.4941V34.1582C88.1327 34.5559 87.9746 34.9375 87.6934 35.2187C87.4121 35.4999 87.0305 35.6581 86.6328 35.6582H82.4336C81.6053 35.6582 80.9338 34.9865 80.9336 34.1582V18.7021H75.5352V41C75.5352 41.8283 74.8634 42.4998 74.0352 42.5C73.2067 42.5 72.5352 41.8284 72.5352 41ZM68.1445 30.5283V13.0498H50.7119L68.1445 30.5283ZM186 26.4492V13.0508H177.269L186 26.4492ZM193 25H199V13.0508H193V25ZM105.287 19.499L111.839 13.0498H105.287V19.499ZM147.111 19.499L153.663 13.0498H147.111V19.499ZM75.5352 15.7021H80.9336V13.0498H75.5352V15.7021ZM220 15.5498H225.335V13.0498H220V15.5498ZM97.7305 6.26268V5.73729C97.7305 4.90886 98.402 4.23729 99.2305 4.23729C100.059 4.23751 100.73 4.90899 100.73 5.73729V6.26268C100.73 7.09097 100.059 7.76246 99.2305 7.76268C98.402 7.76268 97.7305 7.0911 97.7305 6.26268Z"
					fill="white"
				/>
			</svg>
		</a>

		<button
			type="button"
			class="absolute top-3 right-4 inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-card sm:right-6 md:hidden"
			aria-expanded={menuOpen}
			aria-controls="site-nav"
			onclick={toggleMenu}
		>
			<span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
			{#if menuOpen}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			{:else}
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
				</svg>
			{/if}
		</button>

		<nav id="site-nav" class="w-full {menuOpen ? 'block' : 'hidden md:block'}">
			<ul
				class="flex flex-col items-center gap-1 md:flex-row md:justify-center md:gap-1 lg:gap-2 bartle"
			>
				{#each navItems as item (item.href)}
					<li>
						<a
							href={resolve(item.href)}
							class="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors md:py-1.5 {isActive(
								item.href
							)
								? 'bg-accent/10 text-accent'
								: 'text-muted hover:bg-card hover:text-foreground md:hover:bg-transparent'}"
						>
							{item.label()}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>
