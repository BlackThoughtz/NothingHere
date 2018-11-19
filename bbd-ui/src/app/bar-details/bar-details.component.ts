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


          this.renderTopTen(thedrinker,spent);

        }
      );



      this.barService.getTopBeers(this.barName).subscribe(
      data => {
            const item = [];
            const sold = [];

            data.forEach(obj =>{
              item.push(obj.item);
              sold.push(obj.sold);
              });

            this.renderTopBeers(item,sold);
          }
        );

       this.barService.getTopManf(this.barName).subscribe(
      data => {
            const manf = [];
            const sold = [];

            data.forEach(obj =>{
              manf.push(obj.manufacturer);
              sold.push(obj.sold);
              });

            this.renderTopManf(manf,sold);
          }
        );


             this.barService.getSalesByTime(this.barName).subscribe(
      data => {
            const early = [];
            const mid = [];
            const late = [];

            data.forEach(obj =>{
              early.push(obj.SoldEarly);
              mid.push(obj.SoldMid);
              late.push(obj.SoldLate)
              });


            this.renderByTime(early[0], mid[0], late[0]);

          }
        );

       this.barService.getSalesByDay(this.barName).subscribe(
      data => {
        const days = [];
        const tots = [];

        console.log(data);

        data.forEach(obj =>{
        days.push(obj.aday);
        tots.push(obj.DailyTotal);
              });

        this.renderBusiestDay(days,tots);


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
        categories: drinker,
        title: {
          text: 'Customers'
        }
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
  
  renderTopBeers(item: string[], sold: number[]) {
    Highcharts.chart('topBeers', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Beers Sold at ' + this.barName
      },
      xAxis: {
        categories: item,
        title: {
          text: 'Beers'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Top Beers Sold in the last week'
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
        data: sold
      }]
    });
  }
  
  renderTopManf(manf: string[], sold: number[]) {
    Highcharts.chart('topManf', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Manufacturers at ' + this.barName
      },
      xAxis: {
        categories: manf,
        title: {
          text: 'Manufacturers'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Top Manufacturers by Sales In The Last Week'
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
        data: sold
      }]
    });
  }

  renderByTime(early: number, mid: number, late: number) {
    Highcharts.chart('byTime', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Sales by Time Grouped at ' + this.barName
      },
      xAxis: {
        categories: ['Before 4PM', '4 to 8PM', 'After 8 PM']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Sold During Block'
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
        data: [early,mid,late]
      }]
    });
  }

  renderBusiestDay(day: string[], tot: number[]) {
    Highcharts.chart('byDay', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Busiest Days at ' + this.barName
      },
      xAxis: {
        categories: day,
        title: {
          text: 'Days w/ Sales'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Spent On A Given Day'
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
        data: tot
      }]
    });
  }
}
