import { HEADER_HEIGHT, resolveHeaderState, type HeaderState } from './header-state';

/** Reserved layout space above main content (expanded uses max so content never sits under the header). */
export function headerOffsetForState(state: HeaderState): string {
	if (state === 'expanded') return HEADER_HEIGHT.expanded.max;
	return HEADER_HEIGHT[state];
}

export function headerOffsetForPath(pathname: string, isSmViewport = false): string {
	return headerOffsetForState(resolveHeaderState(pathname, isSmViewport));
}
