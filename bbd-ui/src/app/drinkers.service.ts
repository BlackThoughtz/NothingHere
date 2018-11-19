import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bar} from "./bars.service";

export interface Drinker {
  dname: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  userid: string;
  
}
export interface Likes {
  beer: string;
}

export interface Transactions {
  barname: string;
  ename: string;
  gross: number;
  tip: number;
  tim: number;
  dat: string;
}


@Injectable({
  providedIn: 'root'
})
export class DrinkersService {

  constructor(
    public http: HttpClient
  ) { }
  
  getDrinkers() {
    return this.http.get<Drinker[]>('/api/drinker');
  }

  getDrinker(drinker: string){
    return this.http.get<Drinker>('/api/drinker/' + drinker);
  }

  getLikes(drinker: string){
    return this.http.get<Likes[]>('/api/likes/' + drinker);
  }

  getTransactions(drinker: string){
    return this.http.get<Transactions[]>('/api/drinker/' + drinker + '/drinkertrans')
  }

  getMostOrdered(drinker: string){
    return this.http.get<any[]>('/api/drinker/' + drinker + '/orders')
  }
  getSpendingByBar(drinker: string){
    return this.http.get<any[]>('/api/drinker/' + drinker + '/bydates')
  }
}
