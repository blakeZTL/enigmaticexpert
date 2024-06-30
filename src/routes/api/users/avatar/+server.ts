import type { apiRobloxUserAvatar, apiRobloxUserAvatars } from '$lib/types';
import { type RequestHandler } from '@sveltejs/kit';

interface PostData {
	userIds: string[];
	size?: string;
	format?: string;
	isCircular?: boolean;
}
interface RequestBody {
	endpoint?: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const endpoints = ['avatar', 'avatar-3d', 'avatar-bust', 'avatar-headshot'];
	let url = 'https://thumbnails.roblox.com/v1/users';
	const body: RequestBody = await request.json();
	const endpoint = body.endpoint;
	if (!endpoint) {
		return new Response('Missing endpoint', { status: 400 });
	} else if (!endpoints.includes(endpoint)) {
		return new Response('Invalid endpoint', { status: 400 });
	} else {
		const { endpoint, ...postData } = body;
		url = `${url}/${endpoint}`;

		const params = postData as PostData;
		const formattedParams = `userIds=${params.userIds.join(',')}&size=${params.size}&format=${params.format}&isCircular=${params.isCircular}`;
		url = `${url}?${formattedParams}`;

		const res = await fetch(url, { method: 'GET' });
		const data = (await res.json()) as apiRobloxUserAvatars;
		const userData = data.data as apiRobloxUserAvatar[];
		return new Response(JSON.stringify(userData), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
