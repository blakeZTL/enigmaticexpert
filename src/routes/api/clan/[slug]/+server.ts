import type { apiClan, ps99ApiResponse } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const clan = event.params.slug;
	if (clan === undefined) {
		return json(
			{
				status: 'error',
				message: 'Clan not found'
			},
			{ status: 404 }
		);
	}
	const url = 'https://biggamesapi.io/api/clan/';
	const res = await fetch(url + clan);
	const data = (await res.json()) as ps99ApiResponse;
	const clanData = data.data as apiClan;

	if (data.status === 'error') {
		return json(data, { status: 404 });
	}

	return new Response(JSON.stringify(clanData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
