<script lang="ts">
	import type { LayoutServerData } from './$types';
	import type { activeClanBattle, apiClans, pinnedClan } from '$lib/types';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { invalidate } from '$app/navigation';
	import { clansLastUpdated, loading, previouslySelectedClan } from '../../stores';
	import ClansTable from '$lib/components/ClansTable.svelte';
	import ActiveClanBattle from '$lib/components/ActiveClanBattle.svelte';
	import PinnedClanCard from '$lib/components/PinnedClanCard.svelte';

	export let data: LayoutServerData;
	loading.set(false);

	let currentClans: apiClans[] = [];
	let sortedCurrentClans: apiClans[] = [];

	let currentActiveClanBattle: activeClanBattle | null = null;
	let pinnedClan: pinnedClan | null = {
		Clan: undefined,
		Rank: undefined
	};

	onMount(async () => {
		await invalidate((url) => url.href.includes('/clans'));
		[currentClans, currentActiveClanBattle] = await Promise.all([
			data.clans,
			data.activeClanBattle
		]);
		sortedCurrentClans = [...currentClans].sort((a, b) => b.Points - a.Points);
		if (data.savedClan) {
			previouslySelectedClan.set(data.savedClan);
			pinnedClan.Clan = currentClans.find((clan) => clan.Name === data.savedClan) || undefined;
			pinnedClan.Rank = {
				Points: pinnedClan.Clan
					? currentClans.sort((a, b) => b.Points - a.Points).indexOf(pinnedClan.Clan) + 1
					: null,
				Diamonds: pinnedClan.Clan
					? currentClans
							.sort((a, b) => b.DepositedDiamonds - a.DepositedDiamonds)
							.indexOf(pinnedClan.Clan) + 1
					: null
			};
		}
	});
</script>

{#if currentActiveClanBattle}
	<div class="flex mt-2 justify-center">
		<ActiveClanBattle activeClanBattle={currentActiveClanBattle} />
	</div>
{/if}
<div class="card flex flex-col w-[300px] max-h-[600px] px-4 pb-2 gap-3 m-auto mt-2">
	<header class="card-header justify-center flex items-center text-lg font-semibold">
		Current Top 10
	</header>
	{#if sortedCurrentClans.length === 0}
		<Loader />
	{:else}
		<section class="flex justify-center">
			<ClansTable clans={sortedCurrentClans} />
		</section>
	{/if}
	<footer class="card-footer flex justify-center">
		<i class=" text-xs">Last Update: {$clansLastUpdated.toLocaleString()}</i>
	</footer>
</div>
<div class="flex flex-col justify-center items-center mt-3 gap-3">
	<span>Previously selected clan</span>
	<PinnedClanCard {pinnedClan} />
</div>
