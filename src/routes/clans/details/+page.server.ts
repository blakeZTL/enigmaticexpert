import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	let savedClan = '';
	const clan = cookies.get('previouslySelectedClan');
	if (clan) {
		savedClan = clan;
	}

	return { savedClan };
};

export async function _setPreviouslySelectedClan(clan: string) {
	console.debug('previouslySelectedClan', clan);
	document.cookie = `previouslySelectedClan=${clan}; path=/; max-age=31536000`;
}
