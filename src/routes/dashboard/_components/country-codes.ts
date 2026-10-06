import { countryLookupKey } from './earth-countries';

const CODES = new Map<string, string>();

function add(code: string, ...names: string[]) {
	CODES.set(code.toLowerCase(), code);
	for (const name of names) CODES.set(countryLookupKey(name), code);
}

add('AF', 'Afghanistan');
add('AL', 'Albania');
add('DZ', 'Algeria');
add('AS', 'American Samoa');
add('AD', 'Andorra');
add('AO', 'Angola');
add('AI', 'Anguilla');
add('AQ', 'Antarctica');
add('AG', 'Antigua and Barbuda');
add('AR', 'Argentina');
add('AM', 'Armenia');
add('AW', 'Aruba');
add('AU', 'Australia');
add('AT', 'Austria');
add('AZ', 'Azerbaijan');
add('BS', 'Bahamas', 'The Bahamas');
add('BH', 'Bahrain');
add('BD', 'Bangladesh');
add('BB', 'Barbados');
add('BY', 'Belarus');
add('BE', 'Belgium');
add('BZ', 'Belize');
add('BJ', 'Benin');
add('BM', 'Bermuda');
add('BT', 'Bhutan');
add('BO', 'Bolivia');
add('BA', 'Bosnia and Herz.', 'Bosnia and Herzegovina');
add('BW', 'Botswana');
add('BR', 'Brazil');
add('BN', 'Brunei');
add('BG', 'Bulgaria');
add('BF', 'Burkina Faso');
add('BI', 'Burundi');
add('KH', 'Cambodia');
add('CM', 'Cameroon');
add('CA', 'Canada');
add('CV', 'Cabo Verde', 'Cape Verde');
add('KY', 'Cayman Islands');
add('CF', 'Central African Rep.', 'Central African Republic');
add('TD', 'Chad');
add('CL', 'Chile');
add('CN', 'China');
add('CO', 'Colombia');
add('KM', 'Comoros');
add('CG', 'Congo', 'Republic of the Congo');
add('CD', 'Dem. Rep. Congo', 'Democratic Republic of the Congo');
add('CR', 'Costa Rica');
add('CI', "Côte d'Ivoire", 'Ivory Coast');
add('HR', 'Croatia');
add('CU', 'Cuba');
add('CW', 'Curaçao', 'Curacao');
add('CY', 'Cyprus');
add('CZ', 'Czechia', 'Czech Republic');
add('DK', 'Denmark');
add('DJ', 'Djibouti');
add('DM', 'Dominica');
add('DO', 'Dominican Rep.', 'Dominican Republic');
add('EC', 'Ecuador');
add('EG', 'Egypt');
add('SV', 'El Salvador');
add('GQ', 'Eq. Guinea', 'Equatorial Guinea');
add('ER', 'Eritrea');
add('EE', 'Estonia');
add('SZ', 'Swaziland', 'Eswatini');
add('ET', 'Ethiopia');
add('FK', 'Falkland Is.', 'Falkland Islands');
add('FO', 'Faroe Islands');
add('FJ', 'Fiji');
add('FI', 'Finland');
add('FR', 'France');
add('PF', 'French Polynesia');
add('TF', 'Fr. S. Antarctic Lands', 'French Southern Territories');
add('GA', 'Gabon');
add('GM', 'Gambia', 'The Gambia');
add('GE', 'Georgia');
add('DE', 'Germany');
add('GH', 'Ghana');
add('GI', 'Gibraltar');
add('GR', 'Greece');
add('GL', 'Greenland');
add('GD', 'Grenada');
add('GP', 'Guadeloupe');
add('GU', 'Guam');
add('GT', 'Guatemala');
add('GG', 'Guernsey');
add('GN', 'Guinea');
add('GW', 'Guinea-Bissau');
add('GY', 'Guyana');
add('HT', 'Haiti');
add('HN', 'Honduras');
add('HK', 'Hong Kong');
add('HU', 'Hungary');
add('IS', 'Iceland');
add('IN', 'India');
add('ID', 'Indonesia');
add('IR', 'Iran');
add('IQ', 'Iraq');
add('IE', 'Ireland');
add('IM', 'Isle of Man');
add('IL', 'Israel');
add('IT', 'Italy');
add('JM', 'Jamaica');
add('JP', 'Japan');
add('JE', 'Jersey');
add('JO', 'Jordan');
add('KZ', 'Kazakhstan');
add('KE', 'Kenya');
add('KI', 'Kiribati');
add('XK', 'Kosovo');
add('KW', 'Kuwait');
add('KG', 'Kyrgyzstan');
add('LA', 'Laos');
add('LV', 'Latvia');
add('LB', 'Lebanon');
add('LS', 'Lesotho');
add('LR', 'Liberia');
add('LY', 'Libya');
add('LI', 'Liechtenstein');
add('LT', 'Lithuania');
add('LU', 'Luxembourg');
add('MO', 'Macao', 'Macau');
add('MG', 'Madagascar');
add('MW', 'Malawi');
add('MY', 'Malaysia');
add('MV', 'Maldives');
add('ML', 'Mali');
add('MT', 'Malta');
add('MH', 'Marshall Islands');
add('MQ', 'Martinique');
add('MR', 'Mauritania');
add('MU', 'Mauritius');
add('MX', 'Mexico');
add('FM', 'Micronesia');
add('MD', 'Moldova');
add('MC', 'Monaco');
add('MN', 'Mongolia');
add('ME', 'Montenegro');
add('MA', 'Morocco');
add('MZ', 'Mozambique');
add('MM', 'Myanmar', 'Burma');
add('NA', 'Namibia');
add('NR', 'Nauru');
add('NP', 'Nepal');
add('NL', 'Netherlands', 'The Netherlands');
add('NC', 'New Caledonia');
add('NZ', 'New Zealand');
add('NI', 'Nicaragua');
add('NE', 'Niger');
add('NG', 'Nigeria');
add('KP', 'North Korea');
add('MK', 'Macedonia', 'North Macedonia');
add('NO', 'Norway');
add('OM', 'Oman');
add('PK', 'Pakistan');
add('PW', 'Palau');
add('PS', 'Palestine');
add('PA', 'Panama');
add('PG', 'Papua New Guinea');
add('PY', 'Paraguay');
add('PE', 'Peru');
add('PH', 'Philippines');
add('PL', 'Poland');
add('PT', 'Portugal');
add('PR', 'Puerto Rico');
add('QA', 'Qatar');
add('RE', 'Réunion', 'Reunion');
add('RO', 'Romania');
add('RU', 'Russia', 'Russian Federation');
add('RW', 'Rwanda');
add('KN', 'Saint Kitts and Nevis');
add('LC', 'Saint Lucia');
add('VC', 'Saint Vincent and the Grenadines');
add('WS', 'Samoa');
add('SM', 'San Marino');
add('ST', 'Sao Tome and Principe');
add('SA', 'Saudi Arabia');
add('SN', 'Senegal');
add('RS', 'Serbia');
add('SC', 'Seychelles');
add('SL', 'Sierra Leone');
add('SG', 'Singapore');
add('SX', 'Sint Maarten');
add('SK', 'Slovakia');
add('SI', 'Slovenia');
add('SB', 'Solomon Is.', 'Solomon Islands');
add('SO', 'Somalia');
add('ZA', 'South Africa');
add('KR', 'South Korea');
add('SS', 'S. Sudan', 'South Sudan');
add('ES', 'Spain');
add('LK', 'Sri Lanka');
add('SD', 'Sudan');
add('SR', 'Suriname');
add('SE', 'Sweden');
add('CH', 'Switzerland');
add('SY', 'Syria');
add('TW', 'Taiwan');
add('TJ', 'Tajikistan');
add('TZ', 'Tanzania');
add('TH', 'Thailand');
add('TL', 'Timor-Leste', 'East Timor');
add('TG', 'Togo');
add('TO', 'Tonga');
add('TT', 'Trinidad and Tobago');
add('TN', 'Tunisia');
add('TR', 'Turkey', 'Türkiye');
add('TM', 'Turkmenistan');
add('TC', 'Turks and Caicos Islands');
add('TV', 'Tuvalu');
add('UG', 'Uganda');
add('UA', 'Ukraine');
add('AE', 'United Arab Emirates');
add('GB', 'United Kingdom');
add('US', 'United States', 'United States of America');
add('UY', 'Uruguay');
add('UZ', 'Uzbekistan');
add('VU', 'Vanuatu');
add('VA', 'Vatican City', 'Holy See');
add('VE', 'Venezuela');
add('VN', 'Vietnam', 'Viet Nam');
add('VG', 'British Virgin Islands', 'Virgin Islands, British');
add('VI', 'U.S. Virgin Islands', 'Virgin Islands, U.S.');
add('EH', 'W. Sahara', 'Western Sahara');
add('YE', 'Yemen');
add('ZM', 'Zambia');
add('ZW', 'Zimbabwe');

const SMALL_WORDS = new Set(['and', 'of', 'the', 'da', 'de', 'do']);

export function countryCode(name: string): string {
	return CODES.get(countryLookupKey(name)) ?? '';
}

/** True when two labels are the same country, including an ISO code and its globe name. */
export function countriesMatch(left: string, right: string): boolean {
	if (!left || !right) return false;
	if (countryLookupKey(left) === countryLookupKey(right)) return true;

	const code = countryCode(left);
	return code !== '' && code === countryCode(right);
}

export function findGlobeCountry<T extends { name: string }>(
	globeCountries: T[],
	name: string
): T | null {
	const key = countryLookupKey(name);
	const byName = globeCountries.find((entry) => countryLookupKey(entry.name) === key);
	if (byName) return byName;

	const code = countryCode(name);
	if (!code) return null;
	return globeCountries.find((entry) => countryCode(entry.name) === code) ?? null;
}

export function countryFlag(name: string): string {
	const code = countryCode(name);
	if (!/^[a-z]{2}$/i.test(code)) return '';

	return String.fromCodePoint(
		...[...code.toUpperCase()].map((char) => 127397 + char.charCodeAt(0))
	);
}

export function countryAcronym(name: string): string {
	const code = countryCode(name);
	if (code) return code;

	const words = name
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.split(/[^A-Za-z]+/)
		.filter((word) => word && !SMALL_WORDS.has(word.toLowerCase()));

	if (words.length === 0) return '';
	if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
	return words
		.slice(0, 3)
		.map((word) => word[0])
		.join('')
		.toUpperCase();
}
