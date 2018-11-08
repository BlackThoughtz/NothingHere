import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface Bar {
  name: string;
  license: string;
  city: string;
  phone: string;
  addr: string;

}
@Injectable({
  providedIn: 'root'
})
export class BarsService {

  constructor(
    public http: HttpClient
  ) { }

  getBars(){
  return this.http.get<Bar[]>('/api/bar');
}

  getBar(bar:String){
    return this.http.get<Bar>('/api/bar/' + bar);
  }

}

