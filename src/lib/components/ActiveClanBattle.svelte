<script lang="ts">
	import type { activeClanBattle } from '$lib/types';
	import { unixToDate } from '$lib/utils';
	import { derived, readable } from 'svelte/store';
	import Countdown from './Countdown.svelte';

	export let activeClanBattle: activeClanBattle | null = null;

	const currentTime = readable(new Date(), function start(set) {
		const interval = setInterval(() => {
			set(new Date());
		}, 1000);

		return function stop() {
			clearInterval(interval);
		};
	});

	const isCurrent = derived(currentTime, ($currentTime) => {
		if (!activeClanBattle) return false;
		const startTime = unixToDate(activeClanBattle.configData.StartTime);
		const finishTime = unixToDate(activeClanBattle.configData.FinishTime);
		return $currentTime >= startTime && $currentTime <= finishTime;
	});
	// const isCurrent = false; // Uncomment this line to test the "No active battle" message
</script>

<div
	class="card flex flex-col w-[{$isCurrent ? '375px' : '200px'}] {$isCurrent
		? 'variant-ghost-primary'
		: 'variant-ghost-success'}"
>
	{#if $isCurrent && activeClanBattle}
		<header class="card-header justify-center flex items-center text-lg font-semibold p-2">
			{activeClanBattle.configData.Title}
		</header>
		<footer class="card-footer flex justify-center">
			<Countdown targetDateTime={unixToDate(activeClanBattle.configData.FinishTime)} />
		</footer>
	{:else}
		<p class="text-lg text-center m-1">No active battle</p>
	{/if}
</div>
