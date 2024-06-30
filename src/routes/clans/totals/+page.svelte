<script lang="ts">
	import type { PageData } from './$types';
	import ClansTable from '$lib/components/ClansTable.svelte';
	import { onMount } from 'svelte';
	import type { apiClans } from '$lib/types';

	export let data: PageData;

	let searchClanInput = '';
	let clans: apiClans[] = [];

	onMount(() => {
		clans = data.clans.sort((a, b) => b.Points - a.Points);
	});

	$: clans = data.clans.filter((clan) =>
		clan.Name.toLowerCase().includes(searchClanInput.toLowerCase())
	);
</script>

<div class="flex flex-col mx-3 my-2 items-center justify-center gap-2 max-w-[60%]">
	<input
		type="search"
		name="clan-search"
		class="input"
		placeholder="Search clans..."
		bind:value={searchClanInput}
	/>
	<div
		class="card flex flex-col justify-center items-center p-2 bg-transparent w-full"
		style="height: calc(100vh - 15rem);"
	>
		<section class="w-full overflow-auto">
			<ClansTable {clans} showNumberOfClans={0} />
		</section>
	</div>
	<p class="text-sm">
		**Showing top 1000 by points. Need a clan not in the list? Head over to details.
	</p>
</div>
