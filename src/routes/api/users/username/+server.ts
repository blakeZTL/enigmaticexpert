import { type RequestHandler } from '@sveltejs/kit';
import type { apiRobloxUser } from '$lib/types';

type RequestBody = {
	usernames: string[];
};
type UserNameResponse = {
	data: apiRobloxUser[];
};

export const POST: RequestHandler = async ({ request }) => {
	const url = 'https://users.roblox.com/v1/usernames/users';
	const body = (await request.json()) as RequestBody;
	if (!body.usernames) {
		return new Response('Missing usernames', { status: 400 });
	}
	const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
	const { data } = (await res.json()) as UserNameResponse;
	const userData = data as apiRobloxUser[];
	return new Response(JSON.stringify(userData), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
