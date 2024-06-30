import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	let savedClan = '';
	const clan = cookies.get('previouslySelectedClan');
	if (clan) {
		savedClan = clan;
	}
	const pinnedClan = cookies.get('pinnedClan');

	return { savedClan, pinnedClan };
};
