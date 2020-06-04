import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-capture-receipts',
  templateUrl: './capture-receipts.component.html',
  styleUrls: ['./capture-receipts.component.scss'],
})
export class CaptureReceiptsComponent implements OnInit {
  @Input() selectedImage;

  @ViewChild('filePicker', {static: false}) filePickeRef: ElementRef<HTMLInputElement>;

  imagePick;
  theSelectedImage: string;
  usePicker = false;


  constructor(private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private platform: Platform ) { }

  ngOnInit() {
    this.theSelectedImage = this.selectedImage;
  }

  onCancel() {
    this.modalCtrl.dismiss();
    this.theSelectedImage = null;
  }

  ionViewWillEnter(){
    this.theSelectedImage = this.selectedImage;
  }

}
