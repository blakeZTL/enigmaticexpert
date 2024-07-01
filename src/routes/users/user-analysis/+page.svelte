<script lang="ts">
	import type { apiClan, apiRobloxUser } from '$lib/types';
	import { InputChip } from '@skeletonlabs/skeleton';

	import UserAnalysisCard from '$lib/components/UserAnalysisCard.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSearch, faShield } from '@fortawesome/free-solid-svg-icons';

	let inputClans: string[] = [];
	let userSearch: string = '';
	let clanData: apiClan[] = [];
	let userData: apiRobloxUser | undefined = undefined;

	const getUser = async (): Promise<apiRobloxUser | undefined> => {
		let url = '/api/users/username';
		let usernames = [userSearch];
		let res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ usernames })
		});
		let data = (await res.json()) as apiRobloxUser[];
		if (data.length === 0) {
			alert('No user found');
			return;
		} else if (data.length > 1) {
			//TODO: Implement a way to select a user from multiple users
			alert('Multiple users found, please refine your search');
			return;
		}
		let user = data[0];
		return user;
	};

	const getClans = async (): Promise<apiClan[]> => {
		const fetchPromises = inputClans.map(async (clan) => {
			let url = '../api/clan/' + clan;
			let res = await fetch(url);
			if (!res.ok) {
				return null;
			}
			let data = (await res.json()) as apiClan;
			if (!data) {
				alert('Clan not found');
				return null;
			}
			return data;
		});
		const clans = (await Promise.all(fetchPromises)).filter(Boolean) as apiClan[];
		return clans;
	};

	const handleSearch = async () => {
		const fetchedUserData = getUser();
		const fetchedClanData = getClans();
		[userData, clanData] = await Promise.all([fetchedUserData, fetchedClanData]);
	};
	const resetForm = () => {
		userSearch = '';
		inputClans = [];
		userData = undefined;
		clanData = [];
	};

	$: console.debug('clanData', clanData, 'userData', userData);
</script>

{#if clanData.length < 1 || !userData}
	<div class="flex flex-col justify-center items-center gap-3 p-5 max-w-[80%]">
		<div class="card flex flex-col justify-center items-center gap-3 p-3">
			<header class="cared-header text-xl font-semibold">
				<div class="flex flex-col justify-start items-start w-full">
					<span>
						<FontAwesomeIcon icon={faSearch} />
						Search by username
					</span>
					<p class="text-center w-full font-light text-base">(not display name)</p>
				</div>
			</header>
			<section class="w-full">
				<input type="search" placeholder="Search users..." class="input" bind:value={userSearch} />
			</section>
			<section class="text-xl font-semibold">
				<div class="flex flex-col justify-start items-start w-full">
					<span class="flex flex-row gap-2 items-center">
						<FontAwesomeIcon icon={faShield} />
						<p>Enter clan names</p>
					</span>
					<p class="text-center w-full font-light text-base">Press <i>ENTER/RETURN</i> to select</p>

					<InputChip bind:value={inputClans} name="clan-chips" placeholder="Input clan name"
					></InputChip>
				</div>
			</section>
			<footer class="card-footer">
				<button
					type="button"
					class="btn variant-ringed-success text-white"
					disabled={userSearch.length === 0 || inputClans.length === 0}
					on:click={handleSearch}>Search</button
				>
			</footer>
		</div>
	</div>
{/if}
{#if clanData.length > 0 && userData}
	<button class="btn variant-ringed-warning my-4" on:click={resetForm}>Reset</button>
	<div class="flex flex-col items-center justify-center gap-4">
		{#each clanData as clan}
			<UserAnalysisCard clanData={clan} {userData} />
		{/each}
	</div>
{:else if userData}
	<div class="card flex flex-col justify-center items-center gap-3 p-3 variant-ringed-warning">
		<header class="card-header text-xl font-semibold">No clans found</header>
		<section>
			<p class="text-xl">The provided clan names offered no results</p>
		</section>
		<footer class="card-footer">Please review your selections and try again</footer>
	</div>
{/if}
