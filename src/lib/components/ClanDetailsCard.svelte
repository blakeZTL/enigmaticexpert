<script lang="ts">
	import { convertNumberToMultiples, stripHtml, dynamicPlace } from '$lib/utils.js';
	import { faGem, faMedal, faPeopleGroup, faStar } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { apiClan, activeClanBattle, clanRank } from '$lib/types';
	import { onMount } from 'svelte';

	export let clan: apiClan;
	export let activeClanBattle: Promise<activeClanBattle>;
	export let points: number;
	export let clanRank: clanRank;

	let activeClanBattleName = '';
	let medals = {
		total: 0,
		gold: 0,
		silver: 0,
		bronze: 0
	};
	let status = '';

	$: medals = {
		total:
			(clan.GoldMedals ? clan.GoldMedals : 0) +
			(clan.SilverMedals ? clan.SilverMedals : 0) +
			(clan.BronzeMedals ? clan.BronzeMedals : 0),
		gold: clan.GoldMedals ? clan.GoldMedals : 0,
		silver: clan.SilverMedals ? clan.SilverMedals : 0,
		bronze: clan.BronzeMedals ? clan.BronzeMedals : 0
	};
	$: status = stripHtml(clan.Status);

	const medalsPopup: PopupSettings = {
		event: 'hover',
		target: 'medalsClick',
		placement: 'top'
	};

	onMount(async () => {
		activeClanBattleName = (await activeClanBattle).configName;
	});
</script>

<div class="card flex flex-col justify-center items-center mx-8 mt-3">
	<header class="card-header text-3xl font-bold">
		<span class="flex flex-col items-center justify-center gap-3"
			>{clan.Name}
			{#if clanRank.Points || clanRank.Diamonds}
				<span class="flex flex-row items-center gap-3 text-sm font-normal">
					<span>Current Rank(s): </span>
					{#if clanRank.Diamonds}
						<span class="flex flex-row items-center gap-1"
							><FontAwesomeIcon icon={faGem} class="text-sm" />
							{dynamicPlace(clanRank.Diamonds)}</span
						>
					{/if}
					{#if clanRank.Points}
						<span class="flex flex-row items-center gap-1"
							><FontAwesomeIcon icon={faStar} class="text-sm" />{dynamicPlace(
								clanRank.Points
							)}</span
						>
					{/if}
				</span>
			{/if}
		</span>
	</header>
	<div class="flex flex-row items-center justify-start gap-8 my-3">
		<img class="h-[92px] w-[92px]" src={clan.Icon} alt="Clan Icon" />
		<div class="flex flex-col">
			<section class="flex flex-row justify-start items-center gap-3">
				<FontAwesomeIcon icon={faPeopleGroup} />
				<p>
					{clan.Members.length + 1}
				</p>
			</section>
			<section class="flex items-center gap-3">
				<FontAwesomeIcon icon={faGem} />
				<p>
					{convertNumberToMultiples(clan.DepositedDiamonds)}
				</p>
			</section>
			<section class="flex items-center gap-3" use:popup={medalsPopup}>
				<FontAwesomeIcon icon={faMedal} />
				<p>
					<u>{medals.total}</u>
				</p>
			</section>
			<section class="flex items-center gap-3">
				<FontAwesomeIcon icon={faStar} />
				<p>
					{points}
				</p>
			</section>
		</div>
	</div>
	{#if clan.Status}
		<footer class="card-footer flex items-center justify-center text-lg">
			<p>{status}</p>
		</footer>
	{/if}
</div>
<div data-popup="medalsClick" class="bg-primary">
	<div class="card flex flex-row justify-center gap-3 p-2">
		<p>Gold: {convertNumberToMultiples(clan.GoldMedals ? clan.GoldMedals : 0)}</p>
		<p>
			Silver: {convertNumberToMultiples(clan.SilverMedals ? clan.SilverMedals : 0)}
		</p>
		<p>
			Bronze: {convertNumberToMultiples(clan.BronzeMedals ? clan.BronzeMedals : 0)}
		</p>
	</div>
	<span class="flex flex-row gap-3"> </span>
</div>
