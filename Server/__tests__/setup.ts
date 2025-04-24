// __tests__/setup.ts
import { MongoConn } from '../src/utilities/mongo-connect';
import * as server from '../src/server';

beforeAll(async () => {
	await server.init(true);
  //await MongoConn.getInstance(); // Ensure the DB is connected before any test runs
});

describe('dummy', () => {
	test('dummy test', () => {
		expect(true).toBe(true);
	});
});
