export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const date = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

	return {
		date: date
	};
}
