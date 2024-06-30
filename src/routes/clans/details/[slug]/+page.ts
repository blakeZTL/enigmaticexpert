import type { apiClan, apiRobloxUser, apiRobloxUserAvatar } from '$lib/types';
import type { PageLoad } from './$types';

type RobloxBody = {
	userIds: number[];
	size?: string;
	format?: string;
	isCircular?: boolean;
};

export const load: PageLoad = async ({ fetch, params }) => {
	const { slug } = params;
	const getClanData = async (slug: string) => {
		let res = await fetch(`/api/clan/${slug}`);
		const clan = (await res.json()) as apiClan;
		const icon = clan.Icon.replace('rbxassetid://', '');
		res = await fetch(`https://biggamesapi.io/image/${icon}`);
		const iconData = await res.blob();
		const iconUrl = URL.createObjectURL(iconData);
		clan.Icon = iconUrl;
		return clan;
	};
	const clan = await getClanData(slug);
	const getUserData = async (userIds: number[]) => {
		userIds.push(clan.Owner);
		const body: RobloxBody = { userIds: userIds };
		let res = await fetch('/api/users/id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const users = (await res.json()) as apiRobloxUser[];

		body.size = '100x100';
		body.format = 'Png';
		body.isCircular = true;

		const avatarBody = {
			...body,
			endpoint: 'avatar-headshot'
		};

		res = await fetch('/api/users/avatar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(avatarBody)
		});
		const avatars = (await res.json()) as apiRobloxUserAvatar[];

		return { users, avatars };
	};
	const userIds = clan.Members.map((member) => member.UserID);
	const { users, avatars } = await getUserData(userIds);

	return {
		clan,
		users,
		avatars
	};
};
