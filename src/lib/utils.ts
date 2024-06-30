export const convertNumberToMultiples = (diamonds: number): string => {
	if (diamonds >= 1000000000000) {
		return `${(diamonds / 1000000000000).toFixed(2)}T`;
	} else if (diamonds >= 1000000000) {
		return `${(diamonds / 1000000000).toFixed(2)}B`;
	} else if (diamonds >= 1000000) {
		return `${(diamonds / 1000000).toFixed(2)}M`;
	} else if (diamonds >= 1000) {
		return `${(diamonds / 1000).toFixed(2)}K`;
	} else {
		return `${diamonds}`;
	}
};

export const unixToDate = (unix: number): Date => {
	const date = new Date(unix * 1000);
	return date;
};

export const nowIsCurrent = (startTime: number, finishTime: number): boolean => {
	return Date.now() >= startTime * 1000 && Date.now() <= finishTime * 1000;
};

export const stripHtml = (html: string): string => {
	let text = '';
	if (!html) return text;
	try {
		text = html.replace(/<[^>]*>?/gm, '');
	} catch (error) {
		console.debug('Error in stripHtml parsing: ', html);
		console.error(error);
	}
	return text;
};

export const dynamicPlace = (place: number): string => {
	const lastDigit = place % 10;
	const secondLastDigit = Math.floor(place / 10) % 10;

	if (secondLastDigit === 1) {
		return `${place}th`;
	}

	switch (lastDigit) {
		case 1:
			return `${place}st`;
		case 2:
			return `${place}nd`;
		case 3:
			return `${place}rd`;
		default:
			return `${place}th`;
	}
};
