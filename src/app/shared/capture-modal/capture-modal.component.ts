import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-capture-modal',
  templateUrl: './capture-modal.component.html',
  styleUrls: ['./capture-modal.component.scss'],
})
export class CaptureModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

}
