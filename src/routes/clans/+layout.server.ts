import type { ps99ApiResponse, apiClans, activeClanBattle } from '$lib/types.js';
import type { LayoutServerLoad } from './$types';
import { clansLastUpdated } from '../../stores';
import { invalidate } from '$app/navigation';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	let savedClan = '';
	const getClans = async () => {
		const res = await fetch(
			'https://biggamesapi.io/api/clans?page=1&pageSize=1000&sort=Points&sortOrder=desc'
		);
		const data: ps99ApiResponse = await res.json();
		clansLastUpdated.set(new Date());
		return data.data as apiClans[];
	};
	const getActiveClanBattle = async () => {
		const res = await fetch('https://biggamesapi.io/api/activeClanBattle');
		const data: ps99ApiResponse = await res.json();
		return data.data as activeClanBattle;
	};
	const setClan = () => {
		const clan = cookies.get('previouslySelectedClan');
		console.debug('previouslySelectedClan', clan);
		if (clan) {
			savedClan = clan;
		}
	};
	setClan();

	return {
		clans: getClans(),
		activeClanBattle: getActiveClanBattle(),
		savedClan
	};
};

export async function _refreshClans() {
	await invalidate((url) => url.href.includes('/clans'));
}
