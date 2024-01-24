/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Get current date and time in human readable format
	const date = new Date().toLocaleString();

	return {
		date: date
	};
}
