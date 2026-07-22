import { HEADER_HEIGHT, resolveHeaderState, type HeaderState } from './header-state';

export function headerOffsetForState(state: HeaderState, expandedHeight: string = HEADER_HEIGHT.expanded): string {
	if (state === 'expanded') return expandedHeight;
	return HEADER_HEIGHT[state];
}

export function headerOffsetForPath(
	pathname: string,
	isSmViewport = false,
	expandedHeight: string = HEADER_HEIGHT.expanded
): string {
	return headerOffsetForState(resolveHeaderState(pathname, isSmViewport), expandedHeight);
}
