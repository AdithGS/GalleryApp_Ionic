import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
interface imageData {
  author: string,
  height: string,
  width: string,
  download_url: string,
}
@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  constructor(private http: HttpClient, private storage: Storage) { }
  fetchImageData(pageIndex: number, limitValue: number) {
    return this.http.get<imageData>(`https://picsum.photos/v2/list?page=${pageIndex}&limit=${limitValue}`)
  }

  getAllData(key: string) {
    return this.storage.get(key);
  }
  //delete from local
  deleteData(key: string, index: number) {
    this.getAllData(key).then((data: any[]) => {
      if (data && data.length > index) {
        // console.log("dat",data.length)
        data.splice(index, 1);
        // console.log("dat2",data.length)
        this.storage.set(key, data);
      }
    });
  }
  // add to  local storage
  addData(key: string, newData: any) {
    this.getAllData(key).then((data: any[]) => {
      if (data) {
        data.push(newData);
        this.storage.set(key, data);
      } else {
        this.storage.set(key, [newData]);
      }
    });
  }
}
export default imageData
