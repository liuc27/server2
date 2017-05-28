/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController, Content } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-serviceProviderCertificate',
  templateUrl: 'serviceProviderCertificate.html'
  })
export class ServiceProviderCertificate {
@ViewChild(Content) content: Content;

  certificate;

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    private params: NavParams,
    private http: Http) {
    console.log(params)
    this.certificate = params.data

  }


  scrollToTop() {
    this.content.scrollToTop();
  }

  goTop() {
      this.scrollToTop()
      //this.presentToast()
  }

/*
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Refreshing...',
      duration: 1000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }
  */
}
