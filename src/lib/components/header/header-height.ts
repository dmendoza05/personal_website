import { HEADER_HEIGHT, resolveHeaderState, type HeaderState } from './header-state';

export function headerOffsetForState(state: HeaderState): string {
	return HEADER_HEIGHT[state];
}

export function headerOffsetForPath(pathname: string, isSmViewport = false): string {
	return headerOffsetForState(resolveHeaderState(pathname, isSmViewport));
}
