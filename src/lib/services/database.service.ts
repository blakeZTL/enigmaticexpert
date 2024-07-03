import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

export let client: mongoDB.MongoClient;
export const collections: { clans?: mongoDB.Collection } = {};

export async function connectToDatabase() {
	dotenv.config();

	client = new mongoDB.MongoClient(import.meta.env.VITE_ATLAS_URI);

	await client.connect();

	const db: mongoDB.Db = client.db(import.meta.env.VITE_CLAN_BATTLE_DB_NAME);

	const clansCollection: mongoDB.Collection = db.collection(import.meta.env.VITE_CLANS_DB_NAME);

	collections.clans = clansCollection;
}
