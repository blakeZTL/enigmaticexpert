<script lang="ts">
	import type { pinnedClan } from '$lib/types';
	import { faPeopleGroup, faStar, faGem, faThumbtack } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { dynamicPlace } from '$lib/utils';
	import { swipe, type SwipeCustomEvent } from 'svelte-gestures';

	export let pinnedClan: pinnedClan = {
		Clan: undefined,
		Rank: undefined
	};

	let pinnedClanOptionsVisible = false;

	function handleSwipe(event: SwipeCustomEvent) {
		console.debug(event.detail);
		const { direction, target } = event.detail;
		if (direction === 'left') {
			pinnedClanOptionsVisible = true;
		} else {
			pinnedClanOptionsVisible = false;
		}
	}
	const handleUnPinClanClick = () => {
		const url = '/api/clan/pinClan';
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		pinnedClan = {
			Clan: undefined,
			Rank: undefined
		};
		pinnedClanOptionsVisible = false;
	};
</script>

{#if pinnedClan.Clan}
	<div class="flex flex-row">
		<a
			class="block card card-hover flex flex-col justify-center items-center w-[250px] h-[60px] py-1"
			href="/clans/details/{pinnedClan.Clan.Name}"
			use:swipe={{ timeframe: 300, minSwipeDistance: 60 }}
			on:swipe={handleSwipe}
		>
			<clan-header class="flex flex-row items-center gap-2"
				><FontAwesomeIcon icon={faThumbtack} class="text-xs" />
				<p class="text-xl font-semibold">
					{pinnedClan.Clan?.Name}
				</p></clan-header
			>
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
		<div
			class="aflex flex-col justify-center m-auto items-center h-[60px] {`options ${pinnedClanOptionsVisible ? 'visible' : ''}`}"
		>
			<button class="btn text-xl variant-filled-error h-[60px]" on:click={handleUnPinClanClick}>
				<FontAwesomeIcon icon={faThumbtack} />
			</button>
		</div>
	</div>
{/if}

<style>
	.options {
		display: none;
	}
	.options.visible {
		display: block;
	}
</style>
