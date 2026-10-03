# DRY and Simplicity

- Prefer the simplest solution that meets the requirement. Avoid premature abstraction.
- Do not duplicate logic, markup patterns, or data lookups that already exist in the project. Reuse shared helpers, components, and data modules.
- Extract a shared helper or component only when the same logic appears (or will clearly appear) in more than one place.
- Prefer extending existing patterns over introducing parallel approaches.
- Keep changes focused: no drive-by refactors unrelated to the task.

# End-to-End Tests

Do not run end-to-end tests (`pnpm test:e2e`, `playwright test`, or `pnpm test` which includes e2e) unless the user explicitly asks for them in the prompt.

- Pre-commit and routine verification use unit tests only (`pnpm test:unit -- --run`).
- Prefer `pnpm test:unit` / Vitest for local checks after changes.
- Run Playwright / e2e only on an explicit user request (e.g. "run e2e", "run playwright", "run end-to-end tests").

# Svelte `<script>` Order

When writing or editing code inside `<script>` (or `<script lang="ts">`), keep declarations in this order, separated by blank lines between groups when helpful:

1. **Imports**
2. **Component / class declarations** (e.g. typed interfaces used only here, if any)
3. **Parameters / arguments** (`$props()`, exported props)
4. **Constants**
5. **Local variables / state** (`let`, `$state`)
6. **Lifecycles** (`onMount`, `onDestroy`, `beforeUpdate`, `afterUpdate`, etc.)
7. **Svelte derived / reactive** (`$derived`, `$effect`, reactive statements)
8. **Custom methods** (functions / event handlers)
9. **Misc** (anything that does not fit above)

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';

	interface Item {
		id: string;
	}

	let { items = [] }: { items: Item[] } = $props();

	const MAX = 10;

	let count = $state(0);

	onMount(() => {
		/* ... */
	});

	const visible = $derived(items.slice(0, MAX));

	function increment() {
		count += 1;
	}
</script>
```

Do not reorder unrelated code in a file unless you are already editing that `<script>` block for the task.

# CSS Property Order

When writing or editing CSS (`.css` files or `<style>` blocks), order properties in each rule as follows when applicable:

1. **Position** — `position`, `z-index`, `display`, `flex`/`grid` shorthand and related layout props as needed for positioning context
2. **Offsets** — `top`, `right`, `bottom`, `left`, `inset`
3. **Width** — `width`, `min-width`, `max-width`
4. **Height** — `height`, `min-height`, `max-height`
5. **Padding** — `padding`, and longhands
6. **Margin** — `margin`, and longhands
7. **Misc** — border, background, typography, color, opacity, transform, transition, etc.

```css
.card {
	position: relative;
	top: 0;
	width: 100%;
	max-width: 40rem;
	height: auto;
	padding: 1rem;
	margin: 0 auto;
	border: 1px solid var(--border);
	background: var(--card);
	color: var(--foreground);
}
```

Skip groups that do not apply. Prefer this order for new or touched declarations; do not mass-reorder untouched rules unless asked.
