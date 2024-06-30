import type { RequestHandler } from '@sveltejs/kit';

type PostOutput = {
	clanName: string;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json()) as PostOutput;
	const clanName = body.clanName;
	if (clanName) {
		cookies.set('previouslySelectedClan', clanName.toUpperCase(), {
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
