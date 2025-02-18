import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(
        private localStorage: LocalStorageService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    set(key: string, value: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.set(key, value);
        }
    }

    get(key: string): any {
        if (isPlatformBrowser(this.platformId)) {
            return this.localStorage.get(key);
        }
        return null;
    }

    remove(key: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.localStorage.remove(key);
        }
    }
}
