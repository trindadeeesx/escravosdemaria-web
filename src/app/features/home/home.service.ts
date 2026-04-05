import { Injectable, signal } from "@angular/core";
import { ApiService } from "../../core/services/api.service";
import { HomeData } from "../../core/models/home.model";

@Injectable({ providedIn: "root" })
export class HomeService {
	private _homeData = signal<HomeData | null>(null);
	private _loading = signal(false);
	private _error = signal<string | null>(null);

	// Exposição pública como readonly (melhor prática com signals)
	homeData = this._homeData.asReadonly();
	loading = this._loading.asReadonly();
	error = this._error.asReadonly();

	constructor(private api: ApiService) {}

	loadHome() {
		this._loading.set(true);
		this._error.set(null);

		this.api.get<HomeData>("/bff/home").subscribe({
			next: (data) => {
				this._homeData.set(data);
			},
			error: (err) => {
				console.error("Erro ao carregar Home:", err);
				this._error.set("Não foi possível carregar a página inicial. Tente novamente.");
			},
			complete: () => {
				this._loading.set(false);
			},
		});
	}
}
