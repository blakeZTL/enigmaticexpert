<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faChartSimple, faMagnifyingGlass, faShield } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	$: data = $page.data;

	onMount(() => {
		const interval = setInterval(async () => {
			await invalidate((url) => url.href.includes('/clans'));
		}, 600000);

		return () => clearInterval(interval);
	});
</script>

<div class="flex flex-col w-full justify-center items-center overflow-auto mb-[100px]">
	<slot />
</div>

<div class="fixed inset-x-0 bottom-0 flex flex-col bg-surface-100-800-token w-full">
	<TabGroup
		justify="justify-center"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		flex="flex-1 lg:flex-none"
		rounded=""
		border=""
		class="bg-surface-100-800-token w-full text-sm"
	>
		<TabAnchor href="/clans" selected={$page.url.pathname === '/clans'}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faShield} /></svelte:fragment>
			<span>Clans Home</span>
		</TabAnchor>
		<TabAnchor href="/clans/totals" selected={$page.url.pathname === '/clans/totals'}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faChartSimple} /></svelte:fragment>
			<span>Totals</span>
		</TabAnchor>
		<TabAnchor href="/clans/details" selected={$page.url.pathname.startsWith('/clans/details')}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faMagnifyingGlass} /></svelte:fragment>
			<span>Details</span>
		</TabAnchor>
	</TabGroup>
</div>
