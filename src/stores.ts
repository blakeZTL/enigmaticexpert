import { writable } from 'svelte/store';

export const loading = writable<boolean>(false);
export const clansLastUpdated = writable<Date>(new Date());
export const selectedClan = writable<string>('');
export const previouslySelectedClan = writable<string>('');

previouslySelectedClan.subscribe((value) => {
	if (value) {
		console.debug('previouslySelectedClan set to', value);
	}
});
