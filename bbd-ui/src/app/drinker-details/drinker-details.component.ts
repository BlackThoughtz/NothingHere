import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DrinkersService, Drinker, Likes, Transactions} from "../drinkers.service";
import {HttpResponse} from "@angular/common/http";
declare const Highcharts: any;

@Component({
  selector: 'app-drinker-details',
  templateUrl: './drinker-details.component.html',
  styleUrls: ['./drinker-details.component.css']
})
export class DrinkerDetailsComponent implements OnInit {

  dName: string;
  id: string;
  drinkerDetails: Drinker;
  likes: Likes[];
  trans: Transactions[];

  constructor(
    private drinkerService: DrinkersService,
    private route: ActivatedRoute
  ) {
    route.paramMap.subscribe((paramMap) =>{
      this.dName = paramMap.get('drinker');

      drinkerService.getDrinker(this.dName).subscribe(
        data => {
          this.drinkerDetails = data;
          this.id = this.drinkerDetails.userid;
        },
        (error: HttpResponse<any>) =>{
          if(error.status === 404){
            alert('Drinker not found');
          }else {
            console.error(error.status + ' - ' + error.body);
            alert('An error occured on the server. Please check the browser console.');
          }
        }
      );

      drinkerService.getLikes(this.dName).subscribe(
        data => {
          this.likes = data;
        }
      );

      this.drinkerService.getTransactions(this.dName).subscribe(
        data => {
          this.trans = data;
        }
      );

      this.drinkerService.getMostOrdered(this.dName).subscribe(
        data => {
          const beer = [];
          const order = [];

          data.forEach(obj =>{
            beer.push(obj.Item);
            order.push(obj.ordered);
            });

          this.renderMostOrdered(beer,order);



        }
      );

      this.drinkerService.getSpendingByBar(this.dName).subscribe(
        data =>{
          console.log(data);
          const bar = [];
          const date =[];
          const spent = [];

          data.forEach(obj =>{
            bar.push(obj.barname);
            date.push(obj.dat);
            spent.push(obj.spent);
          });

          this.renderByBar(bar, spent);

        }
      );






    })


  }

  ngOnInit() {
  }

  renderMostOrdered(beer: string[], ordered: number[]) {
    Highcharts.chart('mostOrdered', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Beers Ordered By ' + this.dName
      },
      xAxis: {
        categories: beer,
        title: {
          text: 'Beer'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Bought In The Last Week'
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
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        data: ordered
      }]
    });
  }

  renderByBar(bar: string[],  spent: number[]) {
    Highcharts.chart('byBar', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Daily Orders Grouped By Bar For ' + this.dName
      },
      xAxis: {
        categories: bar,
        title: {
          text: 'Bar'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Spent on Day'
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
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        data: spent
      }]
    });
  }

}
