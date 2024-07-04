<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { dateToUnix, unixToDate, convertNumberToMultiples } from '$lib/utils.js';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faArrowLeft, faGem, faStar } from '@fortawesome/free-solid-svg-icons';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ScatterPlot from '$lib/components/ScatterPlot.svelte';
	import { onDestroy, onMount, tick } from 'svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	export let data;

	let tabSet = 0;

	$: width = 400;
	let height = 400;
	$: margin = { top: 20, right: 0, bottom: 20, left: 40 };

	let diamondDataMinTime = 0;
	let diamondDataMaxTime = 0;
	let diamondDataMinDiamonds = 0;
	let diamondDataMaxDiamonds = 0;
	let pointsDataMinTime = 0;
	let pointsDataMaxTime = 0;
	let pointsDataMinPoints = 0;
	let pointsDataMaxPoints = 0;
	let numberOfTicks = 5;

	$: xDiamondScale = scaleLinear()
		.domain([diamondDataMinTime, diamondDataMaxTime])
		.range([0, width]);
	$: xDiamondTicks = xDiamondScale.ticks(numberOfTicks);
	let yDiamondScale = scaleLinear()
		.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
		.range([height, 0]);
	$: yDiamondTicks = yDiamondScale.ticks(numberOfTicks + 2);

	$: xPointsScale = scaleLinear().domain([pointsDataMinTime, pointsDataMaxTime]).range([0, width]);
	$: xPointsTicks = xPointsScale.ticks(numberOfTicks);
	let yPointsScale = scaleLinear()
		.domain([pointsDataMinPoints, pointsDataMaxPoints])
		.range([height, 0]);
	$: yPointsTicks = yPointsScale.ticks(numberOfTicks);

	let activeClanBattleName = '';

	let battleData: { _id: string; points: number }[] = [];
	$: {
		diamondDataMinTime = Math.min(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMaxTime = Math.max(
			...data.dbClanData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		diamondDataMinDiamonds = Math.min(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;
		diamondDataMaxDiamonds = Math.max(...data.dbClanData.map((d) => d.DepositedDiamonds)) || 0;

		xDiamondScale = scaleLinear()
			.domain([diamondDataMinTime, diamondDataMaxTime])
			.range([0, width - margin.left - margin.right]);
		yDiamondScale = scaleLinear()
			.domain([diamondDataMinDiamonds, diamondDataMaxDiamonds])
			.range([height - margin.top - margin.bottom, 0]);
		xDiamondTicks = xDiamondScale.ticks(numberOfTicks + 2);
		yDiamondTicks = yDiamondScale.ticks(numberOfTicks);
	}
	$: {
		pointsDataMinTime = Math.min(
			...battleData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		pointsDataMaxTime = Math.max(
			...battleData.map((d) => dateToUnix(new Date(d._id.toString().split('||')[1])))
		);
		pointsDataMinPoints = Math.min(...battleData.map((d) => d.points)) || 0;
		pointsDataMaxPoints = Math.max(...battleData.map((d) => d.points)) || 0;

		xPointsScale = scaleLinear()
			.domain([pointsDataMinTime, pointsDataMaxTime])
			.range([0, width - margin.left - margin.right]);
		yPointsScale = scaleLinear()
			.domain([pointsDataMinPoints, pointsDataMaxPoints])
			.range([height - margin.top - margin.bottom, 0]);
		xPointsTicks = xPointsScale.ticks(numberOfTicks + 2);
		yPointsTicks = yPointsScale.ticks(numberOfTicks + 4);
	}

	$: {
		battleData = data.dbClanData.map((d) => {
			const battle = d.Battles?.find((battle) => battle.BattleID === activeClanBattleName);
			return {
				_id: d._id.toString(),
				points: battle?.Points || 0
			};
		});
	}

	const updateWidth = () => {
		if (typeof window !== 'undefined') {
			console.debug('widthofScreen', window.innerWidth);
			if (window.innerWidth > 400) {
				//width = window.innerWidth - margin.left - margin.right;
				width = window.innerWidth * 0.9;
			} else {
				width = 350;
				margin.left = -5;
			}
			console.debug('widthFromComponent', width);
		}
	};

	onMount(async () => {
		await tick();
		activeClanBattleName = (await data.activeClanBattle).configName;

		updateWidth();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', updateWidth);
		}
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', updateWidth);
		}
	});
</script>

<div class="flex flex-row justify-start items-center mt-3 w-[90%]">
	<button
		type="button"
		on:click={() => goto($page.url.toString().replace('/visualize', '').replace('#', ''))}
		><FontAwesomeIcon icon={faArrowLeft} /> Back</button
	>
</div>
{#if data.dbClanData.length === 0}
	<p>No data</p>
{:else}
	<div class="flex flex-col justify-center items-center my-2 w-[80%] text-2xl font-semibold">
		<span>Metrics Over Time</span>
	</div>

	<TabGroup justify="justify-center">
		<Tab bind:group={tabSet} name="Points" value={0}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faStar} /></svelte:fragment>
			<span>Points</span>
		</Tab>
		<Tab bind:group={tabSet} name="Diamonds" value={1}
			><svelte:fragment slot="lead"><FontAwesomeIcon icon={faGem} /></svelte:fragment><span
				>Diamonds</span
			></Tab
		>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<ScatterPlot
					{width}
					{height}
					{margin}
					xScale={xPointsScale}
					yScale={yPointsScale}
					xticks={xPointsTicks}
					yticks={yPointsTicks}
					dataItems={battleData}
					dateField={'_id'}
					valueField={'points'}
					formatDate={(date) =>
						unixToDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
					formatValue={(value) => convertNumberToMultiples(value, 0)}
					formatCx={(date) => dateToUnix(new Date(date.split('||')[1]))}
					formatCy={(value) => {
						return value;
					}}
				/>
			{:else if tabSet === 1}
				<ScatterPlot
					{width}
					{height}
					{margin}
					xScale={xDiamondScale}
					yScale={yDiamondScale}
					xticks={xDiamondTicks}
					yticks={yDiamondTicks}
					dataItems={data.dbClanData}
					dateField={'_id'}
					valueField={'DepositedDiamonds'}
					formatDate={(date) =>
						unixToDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
					formatValue={(value) => convertNumberToMultiples(value, 2)}
					formatCx={(date) => dateToUnix(new Date(date.toString().split('||')[1]))}
					formatCy={(value) => value}
				/>
			{:else}
				<p>Nothing to see here</p>
			{/if}
		</svelte:fragment>
	</TabGroup>
{/if}
