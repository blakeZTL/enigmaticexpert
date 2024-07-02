<script lang="ts">
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faChartSimple, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';
</script>

<div class="flex flex-col justify-center items-center mb-[150px]">
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
		<TabAnchor href="/users/user-analysis" selected={$page.url.pathname === '/users/user-analysis'}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faChartSimple} /></svelte:fragment>
			<span>User Analysis</span>
		</TabAnchor>
		<TabAnchor href="/users/find-user" selected={$page.url.pathname.startsWith('/users/find-user')}>
			<svelte:fragment slot="lead"><FontAwesomeIcon icon={faMagnifyingGlass} /></svelte:fragment>
			<span>Find User</span>
		</TabAnchor>
	</TabGroup>
</div>
