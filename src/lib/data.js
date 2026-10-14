import { timeParse } from 'd3';

const parseFullDate = timeParse('%d-%b-%Y');

function numberOrNull(value) {
	if (value == null || value.trim() === '') return null;
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
}

export function parseSong(row) {
	const match = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/.exec(row.Date.trim());
	if (!match) throw new Error(`Invalid song date: ${row.Date}`);
	const shortYear = Number(match[3]);
	const fullYear = shortYear >= 58 ? 1900 + shortYear : 2000 + shortYear;
	const date = parseFullDate(`${match[1]}-${match[2]}-${fullYear}`);
	if (!date || fullYear < 1958 || fullYear > 2025) {
		throw new Error(`Song date is outside 1958–2025: ${row.Date}`);
	}

	return {
		song: row.Song,
		artist: row.Artist,
		date,
		year: date.getFullYear(),
		genre: row['CDR Genre'].split(';')[0].trim() || 'Unlabeled',
		weeksAtNumberOne: numberOrNull(row['Weeks at Number One']),
		bpm: numberOrNull(row.BPM),
		energy: numberOrNull(row.Energy),
		danceability: numberOrNull(row.Danceability),
		happiness: numberOrNull(row.Happiness),
		acousticness: numberOrNull(row.Acousticness),
		loudness: numberOrNull(row['Loudness (dB)']),
		lengthSeconds: numberOrNull(row['Length (Sec)'])
	};
}
