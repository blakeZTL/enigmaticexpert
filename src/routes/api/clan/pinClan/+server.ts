import type { RequestHandler } from '@sveltejs/kit';

type PostOutput = {
	clanName: string;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json()) as PostOutput;
	const clanName = body.clanName;
	if (clanName) {
		cookies.set('pinnedClan', clanName.toUpperCase(), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});
	} else {
		return new Response('Body requires clanName of type string', {
			status: 400
		});
	}

	return new Response('Successfully set clan', {
		status: 200
	});
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('pinnedClan', { path: '/' });

	return new Response('Successfully deleted pinned clan', {
		status: 200
	});
};

export const GET: RequestHandler = async ({ cookies }) => {
	const pinnedClan = cookies.get('pinnedClan');

	return new Response(JSON.stringify({ pinnedClan }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
