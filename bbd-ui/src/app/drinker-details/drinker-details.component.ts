import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BarsService, Bar} from "../bars.service";
import {SelectItem} from "primeng/components/common/selectitem";
import {bar, Beer, DrinkersService} from "../drinkers.service";

@Component({
  selector: 'app-drinker-details',
  templateUrl: './drinker-details.component.html',
  styleUrls: ['./drinker-details.component.css']
})
export class DrinkerDetailsComponent implements OnInit {

  drinkerName: string;
  bars: bar[];
  likes: Beer[];

  constructor(private drinkerService: DrinkersService, private route: ActivatedRoute) {
    route.paramMap.subscribe((paramMap) => {
      this.drinkerName = paramMap.get('drinker');

      this.drinkerService.getFrequentBar(this.drinkerName).subscribe(
        data => {
          this.bars = data;
        }
      );

      this.drinkerService.getLikes(this.drinkerName).subscribe(
        data => {
          this.likes = data;
        }
      );
    });
  }

  ngOnInit() {

  }

}
