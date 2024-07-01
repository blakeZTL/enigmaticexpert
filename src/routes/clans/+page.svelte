<script lang="ts">
	import type { LayoutServerData } from './$types';
	import type { activeClanBattle, apiClans, pinnedClan } from '$lib/types';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { clansLastUpdated, loading, previouslySelectedClan } from '../../stores';
	import ClansTable from '$lib/components/ClansTable.svelte';
	import ActiveClanBattle from '$lib/components/ActiveClanBattle.svelte';
	import PinnedClanCard from '$lib/components/PinnedClanCard.svelte';
	import Loader from '$lib/components/Loader.svelte';

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
		[currentActiveClanBattle] = await Promise.all([data.activeClanBattle]);

		currentClans = data.clans;
		sortedCurrentClans = [...currentClans].sort((a, b) => b.Points - a.Points);
		if (data.pinnedClan) {
			let pinnedClanName = data.pinnedClan;
			if (!$previouslySelectedClan) {
				previouslySelectedClan.set(data.savedClan);
			}
			pinnedClan.Clan = currentClans.find((clan) => clan.Name === pinnedClanName) || undefined;
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
<div class="flex flex-col justify-center items-center mt-3 gap-3">
	<PinnedClanCard {pinnedClan} />
	<p class="font-light"><i>You can pin/unpin a clan from it's details page</i></p>
</div>
<div class="card flex flex-col w-[300px] px-4 pb-2 gap-3 m-auto mt-2">
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
