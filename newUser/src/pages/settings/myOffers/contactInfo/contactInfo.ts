/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../../providers/userProvider'
import { OfferProvider } from '../../../../providers/offerProvider'
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

import { defaultURL } from '../../../../providers/i18n-demo.constants';


@Component({
  selector: 'page-contactInfo',
  templateUrl: 'contactInfo.html',
  providers: [UserProvider]
})
export class ContactInfo {
  serviceProviderId: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};
  myReservation;
  contactInfo : any = {};
  user : any = {};
  eventId;


  constructor(private nav: NavController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    public params: NavParams,
    private http: Http) {
    this.user = this.params.data.user
    this.eventId = this.params.data.eventId
    this.http.post(defaultURL+':3000/charge/showReservationUserInfo', {'eventId':this.eventId,'id':this.user.id})
      .map(res => res.json())
      .subscribe(data2 => {
        if (data2 ) {
          console.log(data2)
          this.contactInfo = data2
        }else{
          console.log("err")
        }
      });
  }

  ionViewWillEnter() {
  this.http.post(defaultURL+':3000/charge/showReservationUserInfo', {'eventId':this.eventId,'id':this.user.id})
    .map(res => res.json())
    .subscribe(data2 => {
      if (data2 ) {
        console.log(data2)
        this.contactInfo = data2
      }else{
        console.log("err")
      }
    });
  }
}
