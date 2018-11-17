import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Bar,BarsService, BarMenuItem} from "./bars.service";
import {BeersService} from "./beers.service";
import {BeerDetailsComponent} from "./beer-details/beer-details.component";

export interface Drinker {
  DName: string;
  phone: string;
  Address: string;
  City: string;
  State: string;
  User_ID: string;
}

export interface Beer {
  Likes: string;

}

export interface Bar {
  Bar: string;
}

@Injectable({
  providedIn: 'root'
})
export class DrinkersService {

  constructor(public http: HttpClient) { }

  getDrinkers(){
    return this.http.get<Drinker[]>('/api/drinker');
  }

  getDrinker(drinker: string) {
    return this.http.get<Drinker>('/api/drinker' + drinker);
  }

  getFrequentBar(drinker: string){
    return this.http.get<Bar[]>('/api/frequent' + drinker);
  }

  getLikes(drinker: string){
    return this.http.get<Beer[]>('/api/likes' + drinker);
  }
}
