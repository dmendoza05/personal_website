import { milesFromVisitor } from '$lib/server/visitor-distance';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform }) => {
	return {
		milesFromLa: await milesFromVisitor(platform?.cf)
	};
};
