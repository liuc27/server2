/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ContactInfo } from './contactInfo/contactInfo'
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { NewOffer } from './newOffer/newOffer';
import { UserProvider } from '../../../providers/userProvider'
import { OfferProvider } from '../../../providers/offerProvider'
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
  selector: 'page-myCalendarAsServiceProvider',
  templateUrl: 'myCalendarAsServiceProvider.html',
  providers: [UserProvider, OfferProvider]
})
export class MyCalendarAsServiceProvider {
  serviceProviderId: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};
  myCalendarAsUser;


  constructor(private nav: NavController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    public offerProvider: OfferProvider,
    private http: Http) {

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn.data = true;
        this.offerProvider.myCalendarAsServiceProvider(this.serviceProviderValidation).then(
        data2 => {
        this.myCalendarAsUser = data2

        this.myCalendarAsUser.forEach((element, index) => {
          element.title = element.user.length.toString() + "/" + element.userNumberLimit.toString()
          element.startTime = moment(element.startTime).format()
          element.endTime = moment(element.endTime).format()
        })
        }

        )
      });
  }



/*
  addReservation(x) {
    console.log(x)
    for (var i = 0; i < this.myCalendarAsUser.length; i++) {
      if (i === x) {
        this.myCalendarAsUser.push({
          title: this.myCalendarAsUser[i].title,
          serviceType: this.myCalendarAsUser[i].serviceType,
          startTime: this.myCalendarAsUser[i].endTime,
          endTime: this.myCalendarAsUser[i].endTime,
          allDay: this.myCalendarAsUser[i].allDay,
          serviceProviderId: this.myCalendarAsUser[i].serviceProviderId,
          id: this.myCalendarAsUser[i].id
        }
        );
      }
    }
    console.log(this.myCalendarAsUser)
  }

  cancellReservation(x) {
    console.log(x)
    for (var i = 0; i < this.myCalendarAsUser.length; i++) {
      if (i === x) {
        if (this.myCalendarAsUser[i].price) {
          this.totalPrice -= this.myCalendarAsUser[i].price
        }
        this.myCalendarAsUser.splice(i, 1);

      }
    }
    console.log(this.myCalendarAsUser)
  }
*/

newOffer(){
  this.nav.push(NewOffer);
}

  showContactInfo(event, user){
    var data :any = {}
    data.user = user
    data.eventId = event._id
    this.nav.push(ContactInfo, data);
  }


  openServiceProviderDetailsPage(user) {
    this.nav.push(ServiceProviderDetails, user);
  }
}
