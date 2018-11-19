import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TopTen} from "./bars.service";

export interface BeerLocation {
  bar: string;
  price: number;
  customers: number;
}

@Injectable({
  providedIn: 'root'
})
export class BeersService {

  constructor(private http: HttpClient) { }

  getBeers() {
    return this.http.get<any[]>('/api/beer');
  }

  getBarsSelling(beer: string) {
    return this.http.get<BeerLocation[]>(`/api/bars-selling/${beer}`);
  }

  getBeerManufacturers(beer?: string): any {
    if (beer) {
      return this.http.get<string>(`/api/beer-manufacturer/${beer}`);
    } 
    return this.http.get<string[]>('/api/beer-manufacturer');
  }

   getTopTenBars(beer: string) {
    return this.http.get<any[]>('/api/beerq/' + beer + '/topbars');
  }

  getTopTenDrinkers(beer: string) {
    return this.http.get<any[]>('/api/beerq/' + beer + '/consumers');
  }

  getBeerByTime(beer: string) {
    return this.http.get<any[]>('/api/beerq/' + beer + '/bytime');
  }
}
