export interface Role {
	id: string;
	name: string;
	color: string | null;
	gradient: string | null;
	iconUrl: string | null;
}

export interface User {
	discordId: string;
	username: string;
	globalName?: string;
	avatar?: string;
	email?: string;
	displayColor?: string | null;
	gender?: string | null;
	religion?: string | null;
	roles?: Role[];
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

export const ADMIN_ROLE_IDS = new Set([
	"1461556222766354483", // REI
	"1458280546684768397", // AUTORIDADE_REAL
	"1456875359860424775", // DUQUE
	"1456875744209797131", // MARQUES
	"1456875804204990637", // CONDE
	"1457183789607293010", // ADM_ORACOES
	"1457159160574775576", // SENHOR_FEUDAL
	"1470857348556914899", // ROLE_SECRETA
]);

export const ORIENTADOR_ROLE_ID = "1463258112118100020";

// Ordem decrescente de prestígio — índice menor = maior hierarquia
export const ROLE_PRIORITY: string[] = [
	"1461556222766354483", // REI
	"1458280546684768397", // AUTORIDADE_REAL
	"1456875359860424775", // DUQUE
	"1456875744209797131", // MARQUES
	"1456875804204990637", // CONDE
	"1457183789607293010", // ADM_ORACOES
	"1457159160574775576", // SENHOR_FEUDAL
	"1470857348556914899", // ROLE_SECRETA
	"1463258112118100020", // ORIENTADOR
];
