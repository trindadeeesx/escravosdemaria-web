export interface User {
	id: string;
	username: string;
	globalName?: string;
	avatar?: string;
	email?: string;
	displayColor?: string;
}

export interface Permissions {
	blog: { canPost: boolean; canComment: boolean };
	forum: { canPost: boolean; canComment: boolean };
	duvidas: { canPost: boolean; canAnswer: boolean };
}

export interface MeResponse {
	user: User;
	permissions: Permissions;
}
