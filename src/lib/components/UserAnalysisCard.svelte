<script lang="ts">
	import type { apiClan, apiRobloxUser } from '$lib/types';
	import { faGem, faStar } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { convertNumberToMultiples, dynamicPlace } from '$lib/utils';
	import { onMount } from 'svelte';

	export let clanData: apiClan;
	export let userData: apiRobloxUser;

	type UserPointContribution = {
		Points: number;
		UserID: number;
		Rank: number;
		Battle: string;
	};
	type UserDiamondContribution = {
		Diamonds: number;
		UserID: number;
		Rank: number;
	};

	let userDonatedDiamonds: UserDiamondContribution | undefined = undefined;
	let userPointContributions: UserPointContribution[] = [];
	let battles: string[] = [];
	let clanIcon: string = '';

	const getUserDonatedDiamonds = (userId: number): void => {
		let rankedDiamondContributions: UserDiamondContribution[] = [];
		if (!clanData?.DiamondContributions.AllTime.Data) return;
		clanData.DiamondContributions.AllTime.Data.sort((a, b) => b.Diamonds - a.Diamonds).forEach(
			(diamondContribution, index) => {
				rankedDiamondContributions.push({
					Diamonds: diamondContribution.Diamonds,
					UserID: diamondContribution.UserID,
					Rank: index + 1
				});
			}
		);
		userDonatedDiamonds = rankedDiamondContributions.find(
			(diamondContribution) => diamondContribution.UserID === userId
		);
	};
	const getUserPointContributions = (userId: number): void => {
		let rankedPointContributions: UserPointContribution[] = [];
		Object.keys(clanData.Battles).forEach((key) => {
			let battle = clanData.Battles[key];
			if (battle.PointContributions) {
				battle.PointContributions.sort((a, b) => b.Points - a.Points).forEach(
					(pointContribution, index) => {
						rankedPointContributions.push({
							Points: pointContribution.Points,
							UserID: pointContribution.UserID,
							Rank: index + 1,
							Battle: battle.BattleID
						});
					}
				);
			}
		});
		userPointContributions = rankedPointContributions.filter(
			(pointContribution) => pointContribution.UserID === userId
		);
	};
	const setClanIcon = async (clan: apiClan): Promise<void> => {
		const icon = clan.Icon.replace('rbxassetid://', '');
		const res = await fetch(`https://biggamesapi.io/image/${icon}`);
		const iconData = await res.blob();
		const iconUrl = URL.createObjectURL(iconData);
		clanIcon = iconUrl;
	};
	$: {
		getUserDonatedDiamonds(userData?.id || 0);
		getUserPointContributions(userData?.id || 0);
		setClanIcon(clanData);
	}
	$: battles = userPointContributions.map((pointContribution) => pointContribution.Battle);

	onMount(async () => {});
</script>

{#if userDonatedDiamonds || userPointContributions.length > 0}
	<div class="card flex flex-col justify-center items-center px-8">
		<header class="card-header text-2xl font-semibold flex flex-row items-center gap-4">
			{#if clanIcon}
				<img src={clanIcon} alt="Clan Icon" class="w-12 h-12" />
			{/if}

			{clanData.Name}
		</header>
		<section class="flex flex-col justify-start gap-2 my-4">
			{#each battles as battle}
				<section>
					<i>{battle}</i>: <FontAwesomeIcon icon={faStar} class="text-sm" />
					{convertNumberToMultiples(
						userPointContributions.find((pointContribution) => pointContribution.Battle === battle)
							?.Points || 0
					)}, {dynamicPlace(
						userPointContributions.find((pointContribution) => pointContribution.Battle === battle)
							?.Rank || 0
					)}
				</section>
			{/each}
		</section>
		<footer class="card-footer">
			<FontAwesomeIcon icon={faGem} />
			{convertNumberToMultiples(userDonatedDiamonds?.Diamonds || 0)}, {dynamicPlace(
				userDonatedDiamonds?.Rank || 0
			)}
		</footer>
	</div>
{/if}
