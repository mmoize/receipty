import { AuthServiceService } from './../../../../authentication/auth-service.service';
import { ReceiptsServiceService } from './../../../explore/receipts/receipts-service.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-totals-detail',
  templateUrl: './totals-detail.page.html',
  styleUrls: ['./totals-detail.page.scss'],
})
export class TotalsDetailPage implements OnInit {

  @ViewChild('barCanvas') barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') lineCanvas: ElementRef;

  barChart: Chart;
  doughnutChart: Chart;
  lineChart: Chart;
  receiptsSub;
  userReceipts;
  barGraphData;
  barGraphDataPoint;
  receiptsData;
  datefields = [];
  donutGraphDataPoint;

  constructor(private receiptService: ReceiptsServiceService,
              private authService: AuthServiceService,
              private modalCtrl: ModalController,
              private datePipe: DatePipe,
            ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    setTimeout(() => {
      Chart.defaults.global.defaultFontColor = '#d3cae9';
      Chart.defaults.global.defaultFontSize = 15;
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.datefields,
          datasets: [
            {
              label: 'Amount Spent',
              data: this.barGraphData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgb(182, 107, 5, 0.5)',
                'rgb(72, 0, 126, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
                'rgb(109, 14, 185, 0.5)',
                'rgb(95, 211, 74, 0.5)',
                'rgb(182, 107, 5, 0.5)',
                'rgb(72, 0, 126, 0.5)'
              ],
              borderColor: [
                'rgba(255,99,132,50)',
                'rgba(54, 162, 235, 50)',
                'rgb(177, 72, 38, 50)',
                'rgb(37, 8, 136, 50)',
                'rgba(255, 206, 86, 50)',
                'rgba(75, 192, 192, 50)',
                'rgba(153, 102, 255, 50)',
                'rgba(255, 159, 64, 50)',
                'rgb(123, 0, 97, 50)',
                'rgb(21, 227, 108, 50)',
                'rgb(177, 72, 38, 50)',
                'rgb(37, 8, 136, 50)'

              ],
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          legend: {
            labels: {
              fontColor: '#d3cae9'
            }
          }
        }
      });
      Chart.defaults.doughnut.circumference = 4 * Math.PI;
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.donutGraphDataPoint,
          datasets: [
            {
              label: 'Categories',
              data: this.barGraphData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        }
      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: this.donutGraphDataPoint,
          datasets: [
            {
              label: 'spending over time coming soon',
              fill: false,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.barGraphData,
              spanGaps: false
            }
          ]
        }
      });

    }, 3000);
  }
  ionViewWillLeave() {
    this.barGraphDataPoint = [];
    this.donutGraphDataPoint = [];
   }

  receiptGrap() {
    // #barCanvas
    const receiptsData = [];
    for (const key in this.userReceipts) {
      if (this.userReceipts.hasOwnProperty(key)) {
        receiptsData.push(
          this.userReceipts[key].total_spending,
        );
      }
    }
    this.barGraphData = receiptsData;
    const receiptsDataPoints = [];
    for (const key in this.userReceipts) {
      if (this.userReceipts.hasOwnProperty(key)) {
        receiptsDataPoints.push(
             this.userReceipts[key].created_at,
        );
      }
    }
    this.barGraphDataPoint = receiptsDataPoints;
    for (const dates of this.barGraphDataPoint) {
      console.log('datees', dates);
      this.datefields.push(this.transFormDate(dates));
    }
    console.log('ano ano', this.datefields);

   // doughnutCanvas
    const donutReceiptsData = [];
    for (const key in this.userReceipts) {
     if (this.userReceipts.hasOwnProperty(key)) {
      donutReceiptsData.push(
         this.userReceipts[key].category,
       );
     }
   }
    this.donutGraphDataPoint = donutReceiptsData;

  }

  transFormDate(date) {
        return this.datePipe.transform(date, 'shortTime' );
  }


  ionViewWillEnter() {

    setTimeout(() => {
      this.receiptGrap();
    }, 3000);

    this.authService.userToken.subscribe(token => {
      const tokens = token;
    });

    this.receiptService.loadUserReceipts().subscribe(() => {
      // something here
    });
    this.receiptsSub = this.receiptService.Receipts.subscribe(resData => {
      this.userReceipts = resData;
    });

  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }


}
