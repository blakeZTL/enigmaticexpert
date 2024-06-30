<script lang="ts">
	import { onMount } from 'svelte';

	// Props
	export let targetDateTime: Date = new Date();

	interface TimeLeft {
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
	}

	// Local state
	let timeLeft: Partial<TimeLeft> = calculateTimeLeft(targetDateTime);

	// Calculate time left function
	function calculateTimeLeft(target: Date): Partial<TimeLeft> {
		const difference: number = +new Date(target) - +new Date();
		let timeLeft: Partial<TimeLeft> = {};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60)
			};
		}

		return timeLeft;
	}

	// Update countdown every second
	onMount(() => {
		const interval = setInterval(() => {
			timeLeft = calculateTimeLeft(targetDateTime);
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<main>
	{#if Object.keys(timeLeft).length > 0}
		<p>
			{timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
			left
		</p>
	{:else}
		<p>Time's up!</p>
	{/if}
</main>
