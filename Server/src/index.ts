import * as express	from 'express';
import * as server from './server';

const PORT = "3000";

(async () => {
	try {
		await server.init();
		server.app.listen(PORT, () => console.log(`NotAirBnb listening on port ${PORT}!`));
	}
	catch (error) {
		console.error("Error starting server:", error);
	}
})()