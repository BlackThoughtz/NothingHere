import { Component, OnInit } from '@angular/core';
import { BeersService, BeerLocation } from '../beers.service';
import { ActivatedRoute } from '@angular/router';

import { SelectItem } from 'primeng/components/common/selectitem';

declare const Highcharts: any;

@Component({
  selector: 'app-beer-details',
  templateUrl: './beer-details.component.html',
  styleUrls: ['./beer-details.component.css']
})
export class BeerDetailsComponent implements OnInit {

  beerName: string;
  beerLocations: BeerLocation[];
  manf: string;

  filterOptions: SelectItem[];
  sortField: string;
  sortOrder: number;

  constructor(
    private beerService: BeersService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      this.beerName = paramMap.get('beer');

      this.beerService.getBarsSelling(this.beerName).subscribe(
        data => {
          this.beerLocations = data;
        }
      );

      this.beerService.getBeerManufacturers(this.beerName)
        .subscribe(
          data => {
            this.manf = data;
          }
        );

      this.beerService.getBeerByTime(this.beerName).subscribe(
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

      this.beerService.getTopTenBars(this.beerName).subscribe(
        data => {

          const bars =[];
          const sold = [];


          data.forEach(obj =>{
            bars.push(obj.barname);
            sold.push(obj.sold);

            });

          this.renderTopBars(bars,sold);


          }
        );


          this.beerService.getTopTenDrinkers(this.beerName).subscribe(
        data => {

          const drinkers =[];
          const bought = [];


          data.forEach(obj =>{
            drinkers.push(obj.Dname);
            bought.push(obj.bought);

            });

          this.renderTopDrinkers(drinkers,bought);
          }
        );





      this.filterOptions = [
        {
          'label': 'Low price first',
          'value': 'low price'
        },
        {
          'label': 'High price first',
          'value': 'high price'
        },
        {
          'label': 'Most frequented first',
          'value': 'high customer'
        },
        {
          'label': 'Least frequented first',
          'value': 'low customer'
        }
      ];
    });
  }

  ngOnInit() {
  }

  renderByTime(early: number, mid: number, late: number) {
    Highcharts.chart('byTime', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Sales by Time of ' + this.beerName
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

  renderTopBars(bar: string[], sold: number[]) {
    Highcharts.chart('topBars', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Bars Selling at ' + this.beerName
      },
      xAxis: {
        categories: bar,
        title: {
          text: 'Bars'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Amount Sold in the last week'
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

  renderTopDrinkers(drinker: string[], bought: number[]) {
    Highcharts.chart('topDrinkers', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Top Consumers of ' + this.beerName
      },
      xAxis: {
        categories: drinker,
        title: {
          text: 'Drinker'
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
        data: bought
      }]
    });
  }

  sortBy(selectedOption: string) {
    if (selectedOption === 'low price') {
      this.beerLocations.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (selectedOption === 'high price') {
      this.beerLocations.sort((a, b) => {
        return b.price - a.price;
      });
    } else if (selectedOption === 'low customer') {
      this.beerLocations.sort((a, b) => {
        return a.customers - b.customers;
      });
    } else if (selectedOption === 'high customer') {
      this.beerLocations.sort((a, b) => {
        return b.customers - a.customers;
      });
    }
  }



}
