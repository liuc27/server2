/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/userProvider'
import { OfferProvider } from '../../../providers/offerProvider'
import { JobOfferDetails } from '../../jobOffer/jobOfferDetails/jobOfferDetails';
import { ContactInfo } from '../myCalendarAsServiceProvider/contactInfo/contactInfo'

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
  selector: 'page-myCalendarAsUser',
  templateUrl: 'myCalendarAsUser.html',
  providers: [UserProvider, OfferProvider]
})
export class MyCalendarAsUser {
  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  validation : any = {};
  myCalendarAsUser;

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
        this.offerProvider.myCalendarAsUser(this.validation.id).then(data2 => {
          this.myCalendarAsUser = data2
          this.myCalendarAsUser.forEach((element, index) => {
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
        this.offerProvider.myCalendarAsUser(this.validation.id).then(data2 => {
          this.myCalendarAsUser = data2
          this.myCalendarAsUser.forEach((element, index) => {
            element.title = element.user.length.toString() + "/" + element.userNumberLimit.toString()
          })
        })
      });
  }

  showContactInfo(event, user){
    var data :any = {}
    data.user = user
    data.eventId = event._id
    this.nav.push(ContactInfo, data);
  }

  openJobOfferDetailsPage(user) {
    this.nav.push(JobOfferDetails, user);
  }

}
