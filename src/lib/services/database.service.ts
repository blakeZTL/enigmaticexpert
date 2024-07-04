import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

export let client: mongoDB.MongoClient;
export const collections: { clans?: mongoDB.Collection } = {};

export async function connectToDatabase() {
	dotenv.config();
	client = new mongoDB.MongoClient(process.env.ATLAS_URI || '');

	await client.connect();

	const db: mongoDB.Db = client.db(process.env.CLAN_BATTLE_DB_NAME);

	const clansCollection: mongoDB.Collection = db.collection(process.env.CLANS_DB_NAME || '');

	collections.clans = clansCollection;
}
