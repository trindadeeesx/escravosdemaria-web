import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface DiscordServerData {
	name: string;
	memberCount: number;
	onlineCount: number;
	iconUrl: string;
	bannerUrl: string;
	inviteUrl: string;
	description: string;
	ownerName: string;
	channelCount: number;
}

export interface DiscordWidgetData {
	id: string;
	name: string;
	instant_invite: string;
	channels: Array<{ id: string; name: string; position: number }>;
	members: Array<{
		id: string;
		username: string;
		avatar: string;
		status: string;
	}>;
	presence_count: number;
}

@Injectable({ providedIn: "root" })
export class DiscordService {
	private readonly DISCORD_SERVER_ID = "SEU_SERVER_ID_AQUI"; // Substitua pelo ID do seu servidor
	private readonly DISCORD_WIDGET_URL = `https://discord.com/api/guilds/${this.DISCORD_SERVER_ID}/widget.json`;

	constructor(private http: HttpClient) {}

	getServerInfo(): Observable<DiscordServerData> {
		// Tenta pegar dados reais do widget do Discord
		return this.http.get<DiscordWidgetData>(this.DISCORD_WIDGET_URL).pipe(
			map((data) => ({
				name: data.name,
				memberCount: data.members?.length || 0,
				onlineCount: data.presence_count || 0,
				iconUrl: `https://cdn.discordapp.com/icons/${this.DISCORD_SERVER_ID}/${data.id}.png`,
				bannerUrl: `https://cdn.discordapp.com/banners/${this.DISCORD_SERVER_ID}/${data.id}.png`,
				inviteUrl: data.instant_invite || "https://discord.gg/9uMhvKqCA",
				description: "Comunidade de fiéis católicos tradicionais",
				ownerName: "Escravos de Maria",
				channelCount: data.channels?.length || 0,
			})),
			catchError((error) => {
				console.error("Erro ao buscar widget do Discord:", error);
				// Fallback com dados mockados
				return of({
					name: "Escravos de Maria",
					memberCount: 1247,
					onlineCount: 38,
					iconUrl: "",
					bannerUrl: "",
					inviteUrl: "https://discord.gg/9uMhvKqCA",
					description: "Comunidade de fiéis católicos tradicionais",
					ownerName: "Comunidade Católica",
					channelCount: 12,
				});
			}),
		);
	}

	// Método alternativo usando API do Discord com bot token (requer backend)
	getServerInfoWithToken(): Observable<DiscordServerData> {
		// Isso deve ser feito no backend para segurança
		return this.http.get<DiscordServerData>(`${environment.apiUrl}/discord/server-info`);
	}
}
