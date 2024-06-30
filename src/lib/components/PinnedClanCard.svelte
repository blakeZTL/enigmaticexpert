<script lang="ts">
	import type { pinnedClan } from '$lib/types';
	import { faPeopleGroup, faStar, faGem } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { dynamicPlace } from '$lib/utils';

	export let pinnedClan: pinnedClan = {
		Clan: undefined,
		Rank: undefined
	};
</script>

{#if pinnedClan.Clan}
	<a
		class="block card card-hover flex flex-col justify-center items-center w-[250px] py-1"
		href="/clans/details/{pinnedClan.Clan.Name}"
	>
		<clan-header><p class="text-xl font-semibold">{pinnedClan.Clan?.Name}</p></clan-header>
		<section>
			<div class="flex flex-row items-center gap-2">
				<span class="flex flex-row items-center gap-2">
					<FontAwesomeIcon icon={faPeopleGroup} />
					<p>{pinnedClan.Clan.Members + 1 || 'Unkown'}</p>
				</span>
				{#if pinnedClan.Rank}
					<span class="flex flex-row items-center gap-2">
						<FontAwesomeIcon icon={faStar} />
						<p>{dynamicPlace(pinnedClan.Rank.Points || 0)}</p>
						<FontAwesomeIcon icon={faGem} />
						<p>{dynamicPlace(pinnedClan.Rank.Diamonds || 0)}</p>
					</span>
				{/if}
			</div>
		</section>
	</a>
{/if}
