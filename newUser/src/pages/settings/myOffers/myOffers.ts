/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ContactInfo } from './contactInfo/contactInfo'
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
  selector: 'page-myOffers',
  templateUrl: 'myOffers.html',
  providers: [UserProvider, OfferProvider]
})
export class MyOffers {
  serviceProviderId: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};
  myReservation;


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
        this.offerProvider.myOffer(this.serviceProviderValidation).then(
        data2 => {
        this.myReservation = data2

        this.myReservation.forEach((element, index) => {
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
    for (var i = 0; i < this.myReservation.length; i++) {
      if (i === x) {
        this.myReservation.push({
          title: this.myReservation[i].title,
          serviceType: this.myReservation[i].serviceType,
          startTime: this.myReservation[i].endTime,
          endTime: this.myReservation[i].endTime,
          allDay: this.myReservation[i].allDay,
          serviceProviderId: this.myReservation[i].serviceProviderId,
          id: this.myReservation[i].id
        }
        );
      }
    }
    console.log(this.myReservation)
  }

  cancellReservation(x) {
    console.log(x)
    for (var i = 0; i < this.myReservation.length; i++) {
      if (i === x) {
        if (this.myReservation[i].price) {
          this.totalPrice -= this.myReservation[i].price
        }
        this.myReservation.splice(i, 1);

      }
    }
    console.log(this.myReservation)
  }
*/

newOffer(){
  this.nav.push(NewOffer);
}

  showUsernameInfo(event, user){
    var data :any = {}
    data.user = user
    data.eventId = event._id
    this.nav.push(ContactInfo, data);
  }
}
