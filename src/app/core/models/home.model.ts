import { BlogPost } from "./blog-post.model";

export interface HomeData {
	liturgyToday?: any;
	prayerOfTheDay?: any;
	saintToday?: any;
	lastPopes?: any[];
	recentBlogPosts: BlogPost[];
	trendingForumPosts: any[];
	lastAnsweredQuestion?: any;
	supporters?: any[];
	discordMemberCount?: number;
	discordInviteLink?: string;
}
