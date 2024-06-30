import type { apiRobloxUser, apiRobloxUsers } from '$lib/types';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const url = 'https://users.roblox.com/v1/users';
	const body = await request.json();
	const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
	const data = (await res.json()) as apiRobloxUsers;
	const userData = data.data as apiRobloxUser[];
	return new Response(JSON.stringify(userData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
