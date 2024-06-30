<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { PageData } from './$types';
	import { faShield } from '@fortawesome/free-solid-svg-icons';
	import { selectedClan, previouslySelectedClan } from '../../../stores';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import OrangeCatSpinner from '$lib/assets/OrangeCatSpinner.svg';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	let clanNames: string[] = [];
	let clanSearch = '';
	let clanSeachInputIsFocused = false;
	let gettingDetails = false;

	let clanSearchAutocompleteOptions: AutocompleteOption<string>[] = [];
	const onClanSearchSelect = (option: CustomEvent<AutocompleteOption<string>>): void => {
		selectedClan.set(option.detail.value);
		clanSearch = option.detail.value;
		clanSeachInputIsFocused = false;
	};
	$: if (clanSearch) {
		selectedClan.set(clanSearch);
	}
	const onSeeClanDetailsClick = (): void => {
		gettingDetails = true;
	};
	const setPreviousltySelectedClan = (clanName: string): void => {
		const url: string = '/api/clan/setClan';
		const body = JSON.stringify({ clanName });
		const headers = {
			'Content-Type': 'application/json'
		};
		fetch(url, { method: 'POST', body, headers })
			.then((response) => {
				if (response.ok) {
					console.log('Successfully set previously selected clan');
				} else {
					console.error('Failed to set previously selected clan');
				}
			})
			.catch((error) => {
				console.error('Failed to set previously selected clan', error);
			});
		previouslySelectedClan.set($selectedClan);
	};

	onMount(async () => {
		await invalidate((url) => url.href.includes('/clans'));
		clanNames = (await data.clans)
			.map((clan) => clan.Name)
			.sort((a: string, b: string) => b.localeCompare(a));
		clanSearchAutocompleteOptions = clanNames.map((clanName) => {
			return {
				value: clanName,
				label: clanName
			};
		});
		if (data.savedClan) {
			previouslySelectedClan.set(data.savedClan);
		}
	});
	onDestroy(() => {
		if ($selectedClan) {
			setPreviousltySelectedClan($selectedClan);
		}
		selectedClan.set('');
	});
</script>

{#await data.clans}
	<div class="flex justify-center items-center" style="height: calc(100% - 70px);">
		<img src={OrangeCatSpinner} alt="Orange Cat Loading Spinner" />
	</div>
{:then _}
	{#if gettingDetails}
		<div class="flex justify-center items-center" style="height: calc(100% - 70px);">
			<img src={OrangeCatSpinner} alt="Orange Cat Loading Spinner" />
		</div>
	{:else}
		<div
			class="flex flex-col items-center justify-start mt-[10%] gap-10"
			style="height: calc(100% - 70px);"
		>
			<div class="card flex flex-col justify-center items-center variant-ghost-surface p-8 gap-5">
				<header class="card-header">
					<div class="flex flex-col items center justify-center gap-5">
						<FontAwesomeIcon icon={faShield} class="text-6xl text-center" />
						<h1 class="text-3xl">Select Clan</h1>
					</div>
				</header>
				<section>
					<input
						type="search"
						class="input"
						name="clan-search"
						bind:value={clanSearch}
						placeholder="Search Clans..."
						on:focus={() => (clanSeachInputIsFocused = true)}
					/>
					{#if clanSearch.length > 0 && clanSeachInputIsFocused}
						<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto">
							<Autocomplete
								bind:input={clanSearch}
								options={clanSearchAutocompleteOptions}
								on:selection={onClanSearchSelect}
							/>
						</div>
					{/if}
				</section>

				<footer class="card-footer">
					<div class="flex flex-col items-center justify-center gap-5">
						<a href="/clans/details/{$selectedClan}">
							<button
								type="button"
								class="btn variant-filled-primary"
								on:click={onSeeClanDetailsClick}
								disabled={!$selectedClan}
							>
								See Clan Details
							</button>
						</a>
					</div>
				</footer>
			</div>
			{#if $previouslySelectedClan}
				<a href="/clans/details/{$previouslySelectedClan}">
					<button class="btn variant-glass-success" type="button" on:click={onSeeClanDetailsClick}>
						Go to Previously Selected: {$previouslySelectedClan}</button
					>
				</a>
			{/if}
		</div>
	{/if}
{/await}
