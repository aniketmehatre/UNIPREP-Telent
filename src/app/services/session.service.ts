import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStartKey = 'sessionStartTime';
  private sessionEndKey = 'sessionEndTime';


  constructor(private http: HttpClient, private storage: StorageService) { }

  startSession() {
    const startTime = new Date().toISOString();
    this.storage.set(this.sessionStartKey, startTime);
  }

  endSession() {
    const endTime = new Date().toISOString();
    this.storage.set(this.sessionEndKey, endTime);
  }

  getSessionStartTime(): Date | null {
    const startTime = this.storage.get(this.sessionStartKey);
    return startTime ? new Date(startTime) : null;
  }

  getSessionEndTime(): Date | null {
    const endTime = this.storage.get(this.sessionEndKey);
    return endTime ? new Date(endTime) : null;
  }

  clearSession() {
    this.storage.remove(this.sessionStartKey);
    this.storage.remove(this.sessionEndKey);
  }
}