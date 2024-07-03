<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { dateToUnix, unixToDate, convertNumberToMultiples } from '$lib/utils.js';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	let padding = 5;
	let width = 400 + padding * 2;
	let height = 400 + padding * 2;
	let margin = { top: 20, right: 0, bottom: 20, left: 40 };

	let diamondDataMinTime = 0;
	let diamondDataMaxTime = 0;
	let diamondDataMinDiamonds = 0;
	let diamondDataMaxDiamonds = 0;

	let xScale = scaleLinear().domain([diamondDataMinTime, diamondDataMaxTime]).range([0, width]);
	let yScale = scaleLinear()
		.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
		.range([height, 0]);

	let numberOfTicks = 5;
	let xticks = xScale.ticks(numberOfTicks);
	let yticks = yScale.ticks(numberOfTicks);

	$: {
		diamondDataMinTime = Math.min(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMaxTime = Math.max(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMinDiamonds = Math.min(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;
		diamondDataMaxDiamonds = Math.max(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;

		xScale = scaleLinear()
			.domain([diamondDataMinTime, diamondDataMaxTime])
			.range([0, width - margin.left - margin.right]);
		yScale = scaleLinear()
			.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
			.range([height - margin.top - margin.bottom, 0]);
		xticks = xScale.ticks(numberOfTicks + 2);
		yticks = yScale.ticks(numberOfTicks);
	}
</script>

<div class="flex flex-col items-center justify-center w-[{width}px] h-full svg">
	<div class="flex flex-row justify-start items-center mt-3 w-full">
		<button type="button" on:click={() => goto($page.url.toString().replace('/visualize', ''))}
			><FontAwesomeIcon icon={faArrowLeft} /> Back</button
		>
	</div>
	{#if data.dbClanData.length === 0}
		<p>No data</p>
	{:else}
		<div class="card flex flex-col justify-center items-center p-4 mt-5">
			<header class="card-header text-xl">Diamonds over Time</header>
			<section>
				<svg
					width={width + margin.right + margin.left}
					height={height + margin.bottom + margin.top}
				>
					<!--Y-Axis-->
					<g transform="translate({0} {margin.top})">
						{#each yticks as tick}
							<line x1={0} y1={yScale(tick)} x2={width} y2={yScale(tick)} stroke="#495a8f" />
							<text x={0} y={yScale(tick)} dy="-6" fill="#D41976"
								>{convertNumberToMultiples(tick, 0)}</text
							>
						{/each}
					</g>
					<!--X-Axis-->
					<g>
						{#each xticks as tick}
							<line
								x1={xScale(tick) + margin.left + margin.right}
								y1={height}
								x2={xScale(tick) + margin.left + margin.right}
								y2={height - 10}
								stroke="#D41976"
							/>
							<text
								fill="#D41976"
								transform="rotate(-45, {xScale(tick) + margin.left + margin.right}, {height})"
								text-anchor="end"
								x={xScale(tick) + margin.left + margin.right}
								y={height}
								dominant-baseline="hanging"
								>{unixToDate(tick).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric'
								})}</text
							>
						{/each}
					</g>
					<g class="circles" transform="translate({margin.left} {margin.top})">
						{#each data.dbClanData as clan}
							<circle
								cx={xScale(dateToUnix(new Date(clan._id.toString().split('||')[1])))}
								cy={yScale(clan.DepositedDiamonds)}
								r="3"
								fill="#0EA5E9"
							/>
						{/each}
					</g>
				</svg>
			</section>
		</div>
	{/if}
</div>

<style>
	.circles circle {
		transition: 0.3s;
	}
	.circles circle:hover {
		fill: red;
	}
	text {
		font-size: 14px;
		font-weight: bolder;
	}
</style>
