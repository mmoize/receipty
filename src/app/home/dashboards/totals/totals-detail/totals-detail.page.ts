import { AuthServiceService } from './../../../../authentication/auth-service.service';
import { ReceiptsServiceService } from './../../../explore/receipts/receipts-service.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';

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

  constructor(private receiptService: ReceiptsServiceService,
              private authService: AuthServiceService,
              private modalCtrl: ModalController,
    ) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: this.barGraphDataPoint,
          datasets: [
            {
              label: 'Amount Spent',
              data: this.barGraphData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
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
          }
        }
      });
  
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        }
      });
  
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
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
              data: [65, 59, 80, 81, 56, 55, 40],
              spanGaps: false
            }
          ]
        }
      });
      
    }, 3000);
  }

  receiptGrap(){
    const receiptsData = [];
    for (const key in this.userReceipts) {
      if (this.userReceipts.hasOwnProperty(key)) {
        receiptsData.push(
          this.userReceipts[key].total_spending,
        );
      }
    }
    this.barGraphData = receiptsData;
    console.log('ano ano', receiptsData);
    const receiptsDataPoints = [];
    for (const key in this.userReceipts) {
      if (this.userReceipts.hasOwnProperty(key)) {
        receiptsDataPoints.push(
             this.userReceipts[key].created_at,
        );
      }
    }
    this.barGraphDataPoint = receiptsDataPoints;
    console.log('ano ano', receiptsDataPoints);
  }


  ionViewWillEnter(){

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
