<script lang="ts">
	import type { apiClans } from '$lib/types';
	import { convertNumberToMultiples, setPreviousltySelectedClan } from '$lib/utils';
	import { faGem, faStar, faUsers, faArrowDown } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { goto } from '$app/navigation';
	import { previouslySelectedClan } from '../../stores';
	import Loader from './Loader.svelte';

	export let clans: apiClans[] = [];
	export let showNumberOfClans = 10;

	let showLoader = false;
	let sortOrder = 'points';
	let hoveredRowIndex: number | null = null;

	const onClanSelect = (clanName: string) => {
		showLoader = true;
		setPreviousltySelectedClan(previouslySelectedClan, clanName);
		goto(`/clans/details/${clanName}`);
	};

	const sortClans = (category: string) => {
		sortOrder = category;
		if (category === 'points') {
			clans = [...clans].sort((a, b) => b.Points - a.Points);
		} else if (category === 'diamonds') {
			clans = [...clans].sort((a, b) => b.DepositedDiamonds - a.DepositedDiamonds);
		}
	};
</script>

{#if showLoader}
	<Loader />
{:else}
	<div class="flex flex-col w-full h-full">
		<div class="flex-grow overflow-auto">
			<table class="relative w-full">
				<thead>
					<tr class="text-sm">
						<th class="custom-header variant-glass-primary"></th>
						<th class="custom-header variant-glass-primary"></th>
						<th class="custom-header variant-glass-primary"><FontAwesomeIcon icon={faUsers} /></th>
						<th
							class="custom-header variant-glass-primary cursor-pointer"
							on:click={() => sortClans('diamonds')}
							><FontAwesomeIcon icon={faGem} />
							{#if sortOrder === 'diamonds'}
								<FontAwesomeIcon icon={faArrowDown} class="text-xs " />
							{/if}
						</th>
						<th
							class="custom-header variant-glass-primary cursor-pointer"
							on:click={() => sortClans('points')}
							><FontAwesomeIcon icon={faStar} />
							{#if sortOrder === 'points'}
								<FontAwesomeIcon icon={faArrowDown} class="text-xs " />
							{/if}
						</th>
					</tr>
				</thead>
				<tbody>
					{#each showNumberOfClans === 0 ? clans : clans.slice(0, showNumberOfClans) as clan, i}
						<tr
							on:mouseover={() => (hoveredRowIndex = i)}
							on:mouseleave={() => (hoveredRowIndex = null)}
							on:focus={() => (hoveredRowIndex = i)}
							on:click={() => onClanSelect(clan.Name)}
							class="cursor-pointer {hoveredRowIndex === i ? 'bg-secondary-500 text-white' : ''}"
						>
							<td class="custom-cell">{i + 1}.</td>
							<td class="text-left">{clan.Name}</td>
							<td class="custom-cell">{clan.Members + 1}</td>
							<td class="custom-cell">{convertNumberToMultiples(clan.DepositedDiamonds)}</td>
							<td class="custom-cell">{convertNumberToMultiples(clan.Points)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	tr {
		height: 35px;
	}
	.custom-header {
		position: sticky;
		top: 0;
		padding: 0.5rem;
	}
	thead {
		height: 35px;
	}
	.custom-cell {
		text-align: center;
	}
</style>
