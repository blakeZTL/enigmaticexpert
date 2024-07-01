<script>
	import { faPeopleGroup, faShield } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { loading } from '../../stores';
	import { onMount } from 'svelte';

	const clansButtonClicked = () => {
		loading.set(true);
	};

	const usersButtonClicked = () => {
		loading.set(true);
	};

	onMount(() => {
		// TODO: Implement a way to get the user's avatar
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center my-1">
	<div
		class="card flex flex-col gap-8 max-w-[350px] min-w-[250px] h-[510px] variant-glass-tertiary"
	>
		<header class="card-header text-4xl text-center"><h1>Welcome</h1></header>
		<section class="flex justify-center">
			<span>
				<img
					src={import.meta.env.VITE_AVATAR_ENDPOINT}
					alt="EnigmaticExpert's Avatar"
					class="w-64 h-64"
				/>
			</span>
		</section>
		<section><p class="text-lg text-center font-light">Get started below</p></section>
		<footer class="card-footer flex justify-center">
			<div class="flex gap-5">
				<button type="button" class="btn variant-ringed-primary" on:click={clansButtonClicked}>
					<span><FontAwesomeIcon icon={faShield} /></span>
					<span><a href="/clans">Clans</a></span>
				</button>
				<button type="button" class="btn variant-ringed-primary" on:click={usersButtonClicked}>
					<span><FontAwesomeIcon icon={faPeopleGroup} /></span>
					<span><a href="/users/user-analysis">Users</a> </span>
				</button>
			</div>
		</footer>
	</div>
</div>
