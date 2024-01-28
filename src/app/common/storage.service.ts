import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

const STORAGE_KEY = 'imageData'
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // private _storage: Storage | null = null;
  constructor(public storage: Storage) {
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    // this._storage = storage;
  }
  getData() {
    return this.storage.get(STORAGE_KEY) || []
  }
  async addData(key:any,item: any) {
    const storedData = await this.storage.get(key) || []
    storedData.push(item)
    return this.storage.set(STORAGE_KEY, storedData)
  }
  async removeData(index: any) {
    const storedData = await this.storage.get(STORAGE_KEY) || []
    storedData.splice(index,1)
    return this.storage.set(STORAGE_KEY, storedData)
  }
  
}
