<script lang="ts">
	import { convertNumberToMultiples } from '$lib/utils';
	import { faGem, faStar } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { clanMember } from '$lib/types';
	import { onMount } from 'svelte';

	export let clanMembers: clanMember[];

	let memberSearch = '';
	let sortByStar = 'desc';
	let sortByDiamond = 'desc';
	let filteredClanMembers: clanMember[] = [];
	export let tableHeight = 'auto';

	const onStarClick = (): void => {
		sortByDiamond = 'desc';
		sortByStar = sortByStar === 'desc' ? 'asc' : 'desc';
		filteredClanMembers = filteredClanMembers.sort((a, b) => {
			if (sortByStar === 'desc') {
				return b.Points - a.Points || b.Diamonds - a.Diamonds;
			} else {
				return a.Points - b.Points || b.Diamonds - a.Diamonds;
			}
		});
	};
	const onDiamondClick = (): void => {
		sortByStar = 'desc';
		sortByDiamond = sortByDiamond === 'desc' ? 'asc' : 'desc';
		filteredClanMembers = filteredClanMembers.sort((a, b) => {
			if (sortByDiamond === 'desc') {
				return b.Diamonds - a.Diamonds || b.Points - a.Points;
			} else {
				return a.Diamonds - b.Diamonds || b.Points - a.Points;
			}
		});
	};

	$: if (memberSearch.length > 0) {
		filteredClanMembers = clanMembers.filter((clanMember) =>
			clanMember.Name.toString().toLowerCase().includes(memberSearch.toLowerCase())
		);
	} else {
		filteredClanMembers = clanMembers;
	}

	onMount(() => {
		filteredClanMembers = clanMembers;
	});
</script>

{#if filteredClanMembers.length === 0}
	<div class="flex justify-center items-center h-full">
		<p class="text-lg">No data available</p>
	</div>
{:else}
	<div class="flex flex-col items-center justify-center gap-3 w-full overflow-hidden">
		<div class="sticky top-0 w-full">
			<input
				class="input variant-glass-tertiary"
				type="search"
				name="member-search"
				bind:value={memberSearch}
				placeholder="Member Search..."
			/>
		</div>
		<div class="flex flex-col overflow-auto w-full">
			<table class="w-full h-full">
				<thead>
					<tr class="text-sm">
						<th class="custom-header variant-glass-primary text-left"></th>
						<th class="custom-header variant-glass-primary" on:click={onDiamondClick}
							><FontAwesomeIcon icon={faGem} /></th
						>
						<th class="custom-header variant-glass-primary" on:click={onStarClick}
							><FontAwesomeIcon icon={faStar} /></th
						>
					</tr>
				</thead>

				<tbody>
					{#each filteredClanMembers as clanMember, i}
						<tr class="text-sm">
							<td class="custom-cell pl-5"
								><span class="flex flex-row">
									<p class="text-left">{i + 1}.</p>
									{#if clanMember.Avatar}
										<img
											src={clanMember.Avatar}
											alt="Clan Member Avatar"
											class="h-[20px] w-[20px] ml-3"
										/>
									{/if}
									<p class="text-left ml-3">
										{clanMember.Name}
									</p></span
								></td
							>
							<td class="custom-cell">{convertNumberToMultiples(clanMember.Diamonds)}</td>
							<td class="custom-cell">{convertNumberToMultiples(clanMember.Points)}</td>
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
		padding-left: 1rem;
		padding-right: 1rem;
		top: 0;
		z-index: 10;
	}
	thead {
		height: 35px;
	}
	.custom-cell {
		text-align: center;
	}
</style>
