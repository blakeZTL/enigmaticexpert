<script lang="ts">
	import ClanDetailsPointContributions from '$lib/components/ClanDetailsPointContributions.svelte';
	import ClanDetailsCard from '$lib/components/ClanDetailsCard.svelte';
	import OrangeCatSpinner from '$lib/assets/OrangeCatSpinner.svg';
	import type {
		apiBattle,
		apiDiamondContribution,
		apiPointContribution,
		apiRobloxUser,
		apiClanMember,
		apiClans,
		clanMember,
		apiRobloxUserAvatar,
		clanRank
	} from '$lib/types';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faShield, faThumbTack } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

	const activeClanBattle = data.activeClanBattle;

	let activeClanBattleName = '';
	let points = 0;
	let pointContributions: apiPointContribution[] = [];
	let diamondContributions: apiDiamondContribution[] = [];
	let clanUsersInfo: apiRobloxUser[] = [];
	let apiClanMembers: apiClanMember[] = [];
	let clanMembers: clanMember[] = [];
	let userAvatars: apiRobloxUserAvatar[] = [];
	let clans: apiClans[] = [];
	let clanRank: clanRank = {
		Points: null,
		Diamonds: null
	};
	let pinnedClan = '';

	$: clanMembers = apiClanMembers
		.map((apiClanMember) => {
			let diamondContribution = diamondContributions.find(
				(diamondContribution) => diamondContribution.UserID === apiClanMember.UserID
			);
			let user: apiRobloxUser | undefined = undefined;
			if (clanUsersInfo) {
				user = clanUsersInfo.find((user) => user.id === apiClanMember.UserID);
			}
			let avatar: string | undefined = undefined;
			if (userAvatars) {
				let userAvatar = userAvatars.find(
					(userAvatar) => userAvatar.targetId === apiClanMember.UserID
				);
				if (userAvatar) {
					avatar = userAvatar.imageUrl;
				}
			}

			let pointContribution = pointContributions.find(
				(pointContribution) => pointContribution.UserID === apiClanMember.UserID
			);
			const clanMember: clanMember = {
				UserID: apiClanMember.UserID,
				Points: pointContribution?.Points || 0,
				Diamonds: diamondContribution ? diamondContribution.Diamonds : 0,
				Name: user ? user.name : 'Unknown User',
				Avatar: avatar || null
			};
			return clanMember;
		})
		.sort((a, b) => b.Points - a.Points);

	const onPinClanClick = async () => {
		const url = '/api/clan/pinClan';
		if (pinnedClan === data.clan.Name) {
			await fetch(url, {
				method: 'DELETE'
			});
			pinnedClan = '';
		} else {
			const body = {
				clanName: data.clan.Name
			};
			await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			pinnedClan = data.clan.Name;
		}
	};

	onMount(async () => {
		activeClanBattleName = (await data.activeClanBattle).configName;
		let clanBattle = data.clan.Battles[activeClanBattleName] as apiBattle;
		points = clanBattle.Points;
		pointContributions = clanBattle.PointContributions;
		diamondContributions = data.clan.DiamondContributions.AllTime.Data;
		apiClanMembers = data.clan.Members;
		apiClanMembers = [...apiClanMembers, { UserID: data.clan.Owner, JoinTime: 0 }];
		clanUsersInfo = data.users;
		userAvatars = data.avatars;
		pinnedClan = data.pinnedClan;
		clans = await data.clans;
		clanRank = {
			Points:
				clans
					.sort((a, b) => b.Points - a.Points)
					.findIndex((clan) => clan.Name === data.clan.Name) + 1 || null,
			Diamonds:
				clans
					.sort((a, b) => b.DepositedDiamonds - a.DepositedDiamonds)
					.findIndex((clan) => clan.Name === data.clan.Name) + 1 || null
		};
	});
</script>

{#await activeClanBattle}
	<div class="flex flex-col justify-center items-center h-full">
		<img src={OrangeCatSpinner} alt="Orange Cat Loading Spinner" />
	</div>
{:then _}
	<div class="flex flex-col justify-center items-center">
		<div class="flex flex-row gap-3 items-center justify-between mx-5 mt-3 w-full">
			<a href="/clans/details">
				<button type="button">
					<FontAwesomeIcon icon={faShield} />
					<span>Select New Clan</span>
				</button>
			</a>

			<button
				type="button"
				class="btn-primary flex flex-row items-center gap-2"
				on:click={onPinClanClick}
			>
				<span><FontAwesomeIcon icon={faThumbTack} /></span><span
					>{pinnedClan === data.clan.Name ? 'Unpin' : 'Pin'}</span
				></button
			>
		</div>
		<div class="flex flex-col gap-5 justify-center items-center w-full">
			<ClanDetailsCard
				clan={data.clan}
				activeClanBattle={data.activeClanBattle}
				{points}
				{clanRank}
			/>
			{#if clanMembers.length > 0}
				<div
					class="card flex flex-col justify-start items-start p-2 bg-transparent w-full min-h-[20rem]"
				>
					<section class="w-full overflow-auto">
						<ClanDetailsPointContributions {clanMembers} />
					</section>
				</div>
			{/if}
		</div>
	</div>
{/await}
