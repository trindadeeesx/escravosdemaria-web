export interface Author {
	discordId: string;
	username: string;
	globalName: string;
	email: string;
	avatar: string;
	displayColor: string;
	gender: string;
	religion: string;
}

export interface BlogPost {
	id: string;
	title: string;
	content: string;
	type: string;
	coverImageUrl?: string | null;
	imageUrls: string[];
	category: {
		id: string;
		name: string;
		slug: string;
	};
	upvotes: number;
	downvotes: number;
	userVote: number | null;
	tags?: string[];
	status: string;
	author: Author;
	createdAt: string;
	updatedAt: string;
	publishToSite: boolean;
	publishToDiscord: boolean;
	publishToInstagram: boolean;
}
