import { Injectable } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import {environment} from "@env/environment.prod";

@Injectable({
    providedIn: 'root',
})
export class FacebookInitService {
    constructor(private fb: FacebookService) {}

    init(): Promise<any> {
        const initParams: InitParams = {
            appId: environment.facebookAppId,
            xfbml: true,
            version: 'v12.0', // Replace with the desired version
        };

        return this.fb.init(initParams);
    }
}