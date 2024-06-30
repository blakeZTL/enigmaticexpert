export interface apiClans {
	Created: number;
	Name: string;
	MemberCapacity: number;
	DepositedDiamonds: number;
	CountryCode: string;
	Members: number;
	Points: number;
}
export interface clanBattleConifgData {
	Title: string;
	_id: string;
	StartTime: number;
	FinishTime: number;
}
export interface activeClanBattle {
	configName: string;
	configData: clanBattleConifgData;
}
export interface apiClanMember {
	UserID: number;
	JoinTime: number;
}
export interface apiPointContribution {
	UserID: number;
	Points: number;
}
export interface apiBattle {
	ProcessedAwards: boolean;
	AwardUserIDs: number[];
	BattleID: string;
	Points: number;
	PointContributions: apiPointContribution[];
	EarnedMedal?: string;
}
export interface apiBattles {
	[key: string]: apiBattle;
}
export interface apiDiamondContribution {
	UserID: number;
	Diamonds: number;
}
export interface apiClan {
	Owner: number;
	Name: string;
	Icon: string;
	Desc: string;
	Members: apiClanMember[];
	DepositedDiamonds: number;
	DiamondContributions: {
		AllTime: {
			Sum: number;
			Data: [apiDiamondContribution];
		};
	};
	Status: string;
	Battles: apiBattles;
	CountryCode: string;
	BronzeMedals: number;
	SilverMedals: number;
	GoldMedals: number;
	LastKickTimestamp: number;
}
export interface ps99ApiResponse {
	status: string;
	data: apiClans[] | activeClanBattle | apiClan;
}
export interface apiRobloxUser {
	id: number;
	name: string;
	displayName: string;
}
export interface apiRobloxUsers {
	data: apiRobloxUser[];
}
export interface apiRobloxUserAvatar {
	targetId: number;
	state: string;
	imageUrl: string;
	version: string;
}
export interface apiRobloxUserAvatars {
	data: apiRobloxUserAvatar[];
}

export type clanMember = {
	UserID: number;
	Points: number;
	Diamonds: number;
	Name: string | number;
	Avatar: string | null;
};

export type clanRank = {
	Points: number | null;
	Diamonds: number | null;
};

export type pinnedClan = {
	Clan?: apiClans;
	Rank?: clanRank;
};
