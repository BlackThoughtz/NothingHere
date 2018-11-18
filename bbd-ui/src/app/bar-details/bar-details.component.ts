import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BarsService, Bar, BarMenuItem, TopTen} from '../bars.service';
import { HttpResponse } from '@angular/common/http';
declare const Highcharts: any;

@Component({
  selector: 'app-bar-details',
  templateUrl: './bar-details.component.html',
  styleUrls: ['./bar-details.component.css']
})
export class BarDetailsComponent implements OnInit {

  barName: string;
  barDetails: Bar;
  menu: BarMenuItem[];
  topTen: TopTen[];


  constructor(
    private barService: BarsService,
    private route: ActivatedRoute
  ) {
    route.paramMap.subscribe((paramMap) => {
      this.barName = paramMap.get('bar');

      barService.getBar(this.barName).subscribe(
        data => {
          this.barDetails = data;
        },
        (error: HttpResponse<any>) => {
          if (error.status === 404) {
            alert('Bar not found');
          } else {
            console.error(error.status + ' - ' + error.body);
            alert('An error occurred on the server. Please check the browser console.');
          }
        }
      );

      barService.getMenu(this.barName).subscribe(
        data => {
          this.menu = data;
        }
      );

      barService.getTopTen(this.barName).subscribe(
        data => {

          this.topTen = data;
          const thedrinker = [];
          const spent = [];


          data.forEach( obj => {

            thedrinker.push(obj.drinker);
            spent.push(obj.spent);
          });

          console.log(thedrinker);

          this.renderTopTen(thedrinker,spent);

        }


      );
    });
  }

  ngOnInit() {
  }


  renderTopTen(drinker: string[], spent: number[]) {
    Highcharts.chart('topTen', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Ten Spenders at ' + this.barName
      },
      xAxis: {
        categories: drinker
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Spent in the last Week'
        },
        labels: {
          overflow: 'justify'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: true
      },
      series: [{
        data: spent
      }]
    });
  }

}
