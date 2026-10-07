let navigatingFrom = '';

export function setNavigatingFrom(path: string) {
	navigatingFrom = path;
}

export function getNavigatingFrom() {
	return navigatingFrom;
}
