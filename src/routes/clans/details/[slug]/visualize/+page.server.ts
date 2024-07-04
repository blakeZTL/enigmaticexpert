import { collections, connectToDatabase, client } from '$lib/services/database.service';
import DbClan from '$lib/models/DbClan';

export async function load({ params }) {
	const { slug } = params;
	await connectToDatabase();
	const dbClanData = (await collections.clans?.find({ Name: slug }).toArray()) as DbClan[];

	if (!dbClanData) {
		console.log('No clan data found');
	}
	client.close();
	dbClanData.map((clan) => ({
		...clan,
		createdOn: DbClan.parseIdToNumber(clan._id)
	}));

	return {
		dbClanData
	};
}
