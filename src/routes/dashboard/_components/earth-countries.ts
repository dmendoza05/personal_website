import type { DashboardCountry } from '$lib/dashboard';

/** Globe names and Cloudflare country names that should resolve to one key. */
const COUNTRY_ALIASES: Record<string, string> = {
	'united states of america': 'united states',
	'russian federation': 'russia',
	'czech republic': 'czechia',
	'bosnia and herz.': 'bosnia and herzegovina',
	'central african rep.': 'central african republic',
	'dem. rep. congo': 'democratic republic of the congo',
	'congo, the democratic republic of the': 'democratic republic of the congo',
	'republic of the congo': 'congo',
	'dominican rep.': 'dominican republic',
	'eq. guinea': 'equatorial guinea',
	'falkland is.': 'falkland islands',
	'falkland islands (malvinas)': 'falkland islands',
	'solomon is.': 'solomon islands',
	's. sudan': 'south sudan',
	macedonia: 'north macedonia',
	swaziland: 'eswatini',
	'w. sahara': 'western sahara',
	"lao people's democratic republic": 'laos',
	'viet nam': 'vietnam',
	'korea, republic of': 'south korea',
	'republic of korea': 'south korea',
	"korea, democratic people's republic of": 'north korea',
	"democratic people's republic of korea": 'north korea',
	burma: 'myanmar',
	'syrian arab republic': 'syria',
	'iran, islamic republic of': 'iran',
	'united republic of tanzania': 'tanzania',
	'republic of moldova': 'moldova',
	'moldova, republic of': 'moldova',
	'venezuela, bolivarian republic of': 'venezuela',
	'bolivia, plurinational state of': 'bolivia',
	'taiwan, province of china': 'taiwan',
	'palestine, state of': 'palestine',
	'state of palestine': 'palestine',
	'cape verde': 'cabo verde',
	'brunei darussalam': 'brunei',
	'east timor': 'timor-leste',
	'ivory coast': "cote d'ivoire",
	turkiye: 'turkey'
};

export function countryLookupKey(name: string): string {
	const folded = name.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
	return COUNTRY_ALIASES[folded] ?? folded;
}

export function findCountryStats(
	countries: DashboardCountry[],
	name: string
): DashboardCountry | null {
	const key = countryLookupKey(name);
	if (!key) return null;
	return countries.find((entry) => countryLookupKey(entry.country) === key) ?? null;
}
