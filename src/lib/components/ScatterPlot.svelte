<script lang="ts">
	import { type ScaleLinear } from 'd3-scale';

	export let margin: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	export let width: number;
	export let height: number;
	export let xticks: number[] = [];
	export let yticks: number[] = [];

	export let dataItems: any[];
	export let dateField: string;
	export let valueField: string;
	export let formatDate: (date: any) => string;
	export let formatValue: (value: any) => string;
	export let formatCx: (value: any) => typeof value;
	export let formatCy: (value: any) => typeof value;

	export let xScale: ScaleLinear<number, number>;
	export let yScale: ScaleLinear<number, number>;

	let hoverData: any;
	let tooltipX: number;
	let tooltipY: number;
	let r = 3;

	function handleTooltip(event: MouseEvent, item: any) {
		hoverData = item;
		tooltipX = event.clientX;
		tooltipY = event.clientY - 75;
	}

	$: console.log(hoverData);
</script>

{#if margin && width && height}
	<svg {width} height={height + margin.top + margin.bottom}>
		<!--Y-Axis-->
		<g transform="translate({0} {margin.top})">
			{#each yticks as tick}
				<line x1={0} y1={yScale(tick)} x2={width} y2={yScale(tick)} stroke="#495a8f" />
				<text x={0} y={yScale(tick)} dy="-6" fill="#D41976">{formatValue(tick)}</text>
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
					dominant-baseline="hanging">{formatDate(tick)}</text
				>
			{/each}
		</g>
		<g class="circles" transform="translate({margin.left} {margin.top})">
			{#each dataItems as item}
				<a
					href="#"
					on:mouseover={(event) => handleTooltip(event, item)}
					on:focus={() => (hoverData = item)}
					on:mouseleave={() => (hoverData = null)}
					on:click={(event) => handleTooltip(event, item)}
					role="button"
					aria-label="Data Point"
				>
					<circle
						cx={xScale(formatCx ? formatCx(item[dateField]) : item[dateField])}
						cy={yScale(formatCy ? formatCy(item[valueField]) : item[valueField])}
						{r}
						fill="#0EA5E9"
					/></a
				>
			{/each}
		</g>
	</svg>
	{#if hoverData}
		<div
			class="absolute bg-white p-2 rounded-lg shadow-md"
			style="position: absolute; top: {tooltipY}px; left: {tooltipX}px;"
		>
			<p>{formatDate(formatCx(hoverData[dateField]))}</p>
			<p>{formatValue(formatCy(hoverData[valueField]))}</p>
		</div>
	{/if}
{/if}
