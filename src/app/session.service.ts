import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStartKey = 'sessionStartTime';
  private sessionEndKey = 'sessionEndTime';


  constructor(private http: HttpClient) { }

  startSession() {
    const startTime = new Date().toISOString();
    localStorage.setItem(this.sessionStartKey, startTime);
  }

  endSession() {
    const endTime = new Date().toISOString();
    localStorage.setItem(this.sessionEndKey, endTime);
  }

  getSessionStartTime(): Date | null {
    const startTime = localStorage.getItem(this.sessionStartKey);
    return startTime ? new Date(startTime) : null;
  }

  getSessionEndTime(): Date | null {
    const endTime = localStorage.getItem(this.sessionEndKey);
    return endTime ? new Date(endTime) : null;
  }

  clearSession() {
    localStorage.removeItem(this.sessionStartKey);
    localStorage.removeItem(this.sessionEndKey);
  }
}