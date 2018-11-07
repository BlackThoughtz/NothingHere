import { Component, OnInit } from '@angular/core';

import {BarsService, Bar} from "../bars.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  bars: Bar[];
  constructor(
    public barService: BarsService

  ) { }

  ngOnInit() {
    this.getBars();
  }

  getBars(){
    this.barService.getBars().subscribe(
      data => {
        this.bars = data;
      },
      error1 => {
        alert('Could not retrieve bars');
      }
    );
  }

}
