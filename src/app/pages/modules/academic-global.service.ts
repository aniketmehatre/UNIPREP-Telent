import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AcademicGlobalService {

  public globalArray: any[] = []; // Global array accessible across the module

  constructor() {}

  // Optional: Methods to interact with the array
  addItem(item: any): void {
    this.globalArray.push(item);
  }

  getItems(): any[] {
    return this.globalArray;
  }

  removeItem(index: number): void {
    this.globalArray.splice(index, 1);
  }

  clearAll(): void {
    this.globalArray = [];
  }
}
