export function load() {
	// Get current date and time in human readable format
	const date = new Date().toLocaleString();

	return {
		message: date
	};
}
