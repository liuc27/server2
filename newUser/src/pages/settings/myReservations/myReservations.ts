/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/userProvider'
import { OfferProvider } from '../../../providers/offerProvider'
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';

import { Storage } from '@ionic/storage'
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
  selector: 'page-myReservations',
  templateUrl: 'myReservations.html',
  providers: [UserProvider, OfferProvider]
})
export class MyReservations {
  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  validation : any = {};
  myReservation;

  constructor(private nav: NavController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    public offerProvider: OfferProvider,
    private http: Http) {
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
        this.offerProvider.myReservation(this.validation.id).then(data2 => {
          this.myReservation = data2
          this.myReservation.forEach((element, index) => {
            element.title = element.user.length.toString() + "/" + element.userNumberLimit.toString()
          })
        })
      });
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
        this.offerProvider.myReservation(this.validation.id).then(data2 => {
          this.myReservation = data2
          this.myReservation.forEach((element, index) => {
            element.title = element.user.length.toString() + "/" + element.userNumberLimit.toString()
          })
        })
      });
  }

  openServiceProviderDetailsPage(serviceProvider) {
    console.log(serviceProvider);
    serviceProvider.from = "myReservationPage"
    this.nav.push(ServiceProviderDetails, serviceProvider);
  }

}
