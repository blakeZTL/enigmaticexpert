<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col justify-center items-center h-full mt-[20%] gap-8">
	<h1 class="text-4xl text-center">Under Construction</h1>

	<Loader />
</div>
