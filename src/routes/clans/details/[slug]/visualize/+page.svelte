<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { dateToUnix } from '$lib/utils.js';

	export let data;

	let padding = 50;
	let width = 500 + padding * 2;
	let height = 500 + padding * 2;

	let diamondDataMinTime = 0;
	let diamondDataMaxTime = 0;
	let diamondDataMinDiamonds = 0;
	let diamondDataMaxDiamonds = 0;

	let xScale = scaleLinear().domain([diamondDataMinTime, diamondDataMaxTime]).range([0, width]);
	let yScale = scaleLinear()
		.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
		.range([height, 0]);

	console.log(data.dbClanData);

	$: {
		diamondDataMinTime = Math.min(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMaxTime = Math.max(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMinDiamonds = Math.min(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;
		diamondDataMaxDiamonds = Math.max(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;

		xScale = scaleLinear().domain([diamondDataMinTime, diamondDataMaxTime]).range([0, width]);
		yScale = scaleLinear()
			.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
			.range([height, 0]);

		console.log(
			diamondDataMinTime,
			diamondDataMaxTime,
			diamondDataMinDiamonds,
			diamondDataMaxDiamonds
		);
	}
</script>

<div class="flex flex-auto items-center justify-center w-full h-full p-4">
	{#if data.dbClanData.length === 0}
		<p>No data</p>
	{:else}
		<svg {width} {height}>
			{#each data.dbClanData as clan}
				<circle
					cx={xScale(dateToUnix(new Date(clan._id.toString().split('||')[1])))}
					cy={yScale(clan.DepositedDiamonds)}
					r="3"
					fill="cyan"
				/>
			{/each}
		</svg>
	{/if}
</div>
