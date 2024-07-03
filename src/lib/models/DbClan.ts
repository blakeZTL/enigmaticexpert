import { ObjectId } from 'mongodb';
import type { apiClanMember, apiDiamondContribution, apiBattle } from '$lib/types';
import { dateToUnix } from '$lib/utils';

export default class DbClan {
	constructor(
		public _id: ObjectId,
		public name: string,
		public owner: number,
		public icon: string,
		public desc: string,
		public depositedDiamonds: number,
		public status: string,
		public members: apiClanMember[],
		public diamondContributions: apiDiamondContribution[],
		public battles: apiBattle[]
	) {
		this.createdOn = DbClan.parseIdToNumber(this._id);
		this.Name = this.name;
		this.Owner = this.owner;
		this.Icon = this.icon;
		this.Desc = this.desc;
		this.DepositedDiamonds = this.depositedDiamonds;
		this.Status = this.status;
		this.Members = this.members;
		this.DiamondContributions = this.diamondContributions;
		this.Battles = this.battles;
	}

	static parseIdToNumber(id: ObjectId): number {
		let time = 0;
		try {
			const dateTimeStamp = id.toString().split('||')[1];
			console.debug('dateTimeStamp: ', dateTimeStamp);
			time = dateToUnix(new Date(dateTimeStamp));
		} catch (error) {
			console.error('Error in parseIdToNumber parsing: ', id);
			console.error(error);
		}
		return time;
	}

	public createdOn: number;
	public Name: string;
	public Owner: number;
	public Icon: string;
	public Desc: string;
	public DepositedDiamonds: number;
	public Status: string;
	public Members: apiClanMember[];
	public DiamondContributions: apiDiamondContribution[];
	public Battles: apiBattle[];
}
