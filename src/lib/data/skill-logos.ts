import { skillLogos, type SkillLogo } from './skill-logo-data';
import type { SkillId } from './skills';

export type { SkillLogo };

/** Returns SVG parts for a skill logo, or `null` when no brand mark exists. */
export function getSkillLogo(id: SkillId): SkillLogo | null {
	return skillLogos[id as keyof typeof skillLogos] ?? null;
}

export function hasSkillLogo(id: SkillId): boolean {
	return getSkillLogo(id) !== null;
}
