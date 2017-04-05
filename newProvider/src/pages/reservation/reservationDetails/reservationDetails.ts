/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CheckLogin } from '../../../providers/check-login'

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
  selector: 'page-reservationDetails',
  templateUrl: 'reservationDetails.html',
  providers: [CheckLogin]
})
export class ReservationDetails {
  product;
  chatroomId;
  productOrServiceProvider;
  productDetails;
  alreadyLoggedIn = false;
  serviceProviderValidation: any = {};
  url: SafeResourceUrl;
  eventList: any = {}
  guidePrice = 1000;
  chatPrice = 100;
  totalPrice = 0;
  changedEventSourceISO: any;
  serviceType;
  addedEventSourceISO = []
  deletedEventSourceISO = []
  eventTrigger = true

  constructor(private params: NavParams,
    private nav: NavController,
    private actionSheet: ActionSheetController,
    private events: Events,
    private sanitizer: DomSanitizer,
    public checkLogin: CheckLogin,
    public alertCtrl: AlertController,
    private http: Http) {
    this.changedEventSourceISO = params.data.changedEventSource;

    this.changedEventSourceISO.forEach((element, index) => {
      element.startTime = moment(element.startTime).format()
      element.endTime = moment(element.endTime).format()
    });

    this.checkLogin.load()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
      });

    this.recaculateTotalDefaultPrice()
    console.log(this.changedEventSourceISO);

    this.productOrServiceProvider = "product";
    console.log(params.data);
    this.actionSheet = actionSheet;
    this.url = sanitizer.bypassSecurityTrustResourceUrl('https://appear.in/charlie123456789');

  }

  addReservation(x) {
    console.log(x)
    for (var i = 0; i < this.changedEventSourceISO.length; i++) {
      if (i === x) {
        this.changedEventSourceISO.push({
          _id: this.changedEventSourceISO[i]._id,
          title: this.changedEventSourceISO[i].title,
          serviceType: this.changedEventSourceISO[i].serviceType,
          startTime: this.changedEventSourceISO[i].endTime,
          endTime: this.changedEventSourceISO[i].endTime,
          allDay: this.changedEventSourceISO[i].allDay,
          serviceProviderName: this.changedEventSourceISO[i].serviceProviderNameArray,
          username: this.changedEventSourceISO[i].usernameArray,
          serviceProviderNumberLimit: 1,
          userNumberLimit: 1,
          repeat: 0,
          pricePerHour: this.changedEventSourceISO[i].pricePerHour,
          action: this.changedEventSourceISO[i].action,
          price: 0
        }
        );
      }
    }
    console.log(this.changedEventSourceISO)
  }

  cancellReservation(x) {
    console.log(x)
    for (var i = 0; i < this.changedEventSourceISO.length; i++) {
      if (i === x) {
        if (this.changedEventSourceISO[i].price) {
          this.totalPrice -= this.changedEventSourceISO[i].price
        }
        this.changedEventSourceISO.splice(i, 1);
      }
    }
    console.log(this.changedEventSourceISO)
  }

  changeReservationPrice(event) {
    let confirm1 = this.alertCtrl.create({
      title: 'Change Price',
      message: 'How many hours do you need?',
      inputs: [
        {
          name: 'pricePerHour',
          placeholder: 'Input Price here'
        },
      ],
      buttons: [
        {
          text: 'input price',
          handler: data => {
            if (data) {
              event.pricePerHour = Number(data.pricePerHour);;
              console.log(data);
              this.recaculateTotalDefaultPrice()
            }
          }
        },
        {
          text: 'cancell',
          handler: () => {
          }
        }
      ]
    });
    confirm1.present();
  }

  changeCustomerNumber(event) {
    let confirm2 = this.alertCtrl.create({
      title: 'Change customer number',
      message: 'How many customers do you need?',
      inputs: [
        {
          name: 'userNumberLimit',
          placeholder: 'Input customer number here'
        },
      ],
      buttons: [
        {
          text: 'input number',
          handler: data => {
            if (data) {
              event.userNumberLimit = Number(data.userNumberLimit);;
              console.log(data);
              this.recaculateTotalDefaultPrice()

            }
          }
        },
        {
          text: 'cancell',
          handler: () => {

          }
        }
      ]
    });
    confirm2.present();
  }

  changeServiceProviderNumber(event) {
    let confirm3 = this.alertCtrl.create({
      title: 'Change service Provider number',
      message: 'How many service Providers do you need?',
      inputs: [
        {
          name: 'serviceProviderNumberLimit',
          placeholder: 'Input service provider number here'
        },
      ],
      buttons: [
        {
          text: 'input a number',
          handler: data => {
            if (data) {
              event.serviceProviderNumberLimit = Number(data.serviceProviderNumberLimit);;
              console.log(data);
              this.recaculateTotalDefaultPrice()

            }
          }
        },
        {
          text: 'cancell',
          handler: () => {

          }
        }
      ]
    });
    confirm3.present();
  }

  recaculateTotalDefaultPrice() {
    this.totalPrice = 0;
    if (this.changedEventSourceISO) {
      for (var i = 0; i < this.changedEventSourceISO.length; i++) {
        console.log(this.changedEventSourceISO.length)
        if (this.changedEventSourceISO[i].serviceType && this.changedEventSourceISO[i].startTime && this.changedEventSourceISO[i].endTime) {
          console.log(this.changedEventSourceISO[i].serviceType)
          var duration = moment.duration(moment(this.changedEventSourceISO[i].endTime).diff(moment(this.changedEventSourceISO[i].startTime)));
          var hours = duration.asHours();
          var price = this.changedEventSourceISO[i].pricePerHour * hours * this.changedEventSourceISO[i].userNumberLimit / this.changedEventSourceISO[i].serviceProviderNumberLimit;
          this.changedEventSourceISO[i].price = price;
          if (this.changedEventSourceISO[i].action == "put")
            this.totalPrice += price;
          else this.totalPrice -= price;
        }
      }
    }
  }

  shareActionSheet() {
    let actionSheet = this.actionSheet.create({
      title: 'SHARE',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'email',
          icon: 'ios-mail',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Wechat',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Google',
          icon: 'logo-google',
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }



  openOauth(x) {
    console.log(x)
    alert("will soon add this function")
  }

  makeOffer() {
    console.log(this.changedEventSourceISO)
    console.log(this.serviceProviderValidation)
    var offer: any = {};

    offer.serviceProviderName = this.serviceProviderValidation.serviceProviderName
    offer.password = this.serviceProviderValidation.password

    var changedEventSource = []
    this.changedEventSourceISO.forEach((element, index) => {

      changedEventSource.push({
        _id: element._id,
        title: element.title,
        serviceType: element.serviceType,
        startTime: moment(element.startTime).toDate(),
        endTime: moment(element.endTime).toDate(),
        allDay: element.allDay,
        serviceProviderName: element.serviceProviderName,
        creatorName: element.creatorName,
        username: element.username,
        serviceProviderNumberLimit: element.serviceProviderNumberLimit,
        userNumberLimit: element.userNumberLimit,
        repeat: element.repeat,
        pricePerHour: element.pricePerHour,
        action: element.action,
        price: element.price
      });
    });

    offer.event = changedEventSource
    console.log(offer)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer', offer)
      .map(res => res.json())
      .subscribe(data => {
        if (data.data == "OK"){
          alert("Offer is successfully made and you can view it in your calendar.")
          this.eventTrigger = false
          this.changedEventSourceISO = []
        this.nav.pop();
        }
      })

  }
  ionViewWillLeave() {
    console.log("leave")
    if(this.eventTrigger == true)
    this.events.publish('guide', this.changedEventSourceISO);
    else  this.events.publish('guide', []);
  }

}
