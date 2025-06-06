import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class AdvisorService {
    private http = inject(HttpClient)

    getAnswer(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/advisor", data, {
            headers: headers,
        });
    }


    getTeamAnswer(data: any) {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/askTeam", data, {
            headers: headers,
        });
    }

    getChatHistory() {
        const headers = new HttpHeaders().set("Accept", "application/json");
        return this.http.post<any>(environment.ApiUrl + "/chatHistory", {
            headers: headers,
        });
    }
}
