/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import {UserProvider} from '../../../../providers/userProvider'
import {OfferProvider} from '../../../../providers/offerProvider'

import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NewOfferDetails } from './newOfferDetails/newOfferDetails';
import { NgCalendarModule  } from 'ionic2-calendar';
import moment from 'moment';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-newOffer',
  templateUrl: 'newOffer.html',
  providers: [UserProvider, OfferProvider]
})
export class NewOffer {

  serviceProviderDetails: any = [];
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  serviceProviderValidation: any = {};

  eventSource = [];
  addedEventSource = []
  deletedEventSource = []
  chatEventSource = [];
  guideEventSource = [];
  viewTitle;

  isToday: boolean;
  calendar = {
    mode: 'week',
    currentDate: new Date()
  };

  serviceType;
  start = 0
  chatPricePerHour = 100;
  guidePricePerHour = 1000;


  //    reservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    private http: Http,
    public alertCtrl: AlertController,
    private offerProvider: OfferProvider
    ) {
    console.log("params.data is")
    console.log(params.data)
    this.events = events;


    var eventDataFromServer = []



    if (!this.serviceType) {
      this.serviceType = "guide"
    }

    events.subscribe('guide', (data) => {
      console.log('Welcome');
      console.log(data)
      console.log(this.guideEventSource)
      if(data.length < 1){
        console.log("empty array")
        this.addedEventSource = []
        this.deletedEventSource = []
      }else{

      var data3 = []
      data.forEach((element, index) => {
        data3.push({
          _id: element._id,
          title: element.user.length+"/"+element.userNumberLimit,
          serviceType: element.serviceType,
          startTime: moment(element.startTime).toDate(),
          endTime: moment(element.endTime).toDate(),
          allDay: element.allDay,
          creator: element.creator,
          serviceProvider: {"id":element.serviceProvider,"nickname":element.nickname},
          user: element.user,
          serviceProviderNumberLimit: element.serviceProviderNumberLimit,
          userNumberLimit: element.userNumberLimit,
          repeat: element.repeat,
          pricePerHour: element.pricePerHour,
          action: element.action,
          price: element.price
        });
      })

      data3.forEach((changedElementEvent, changedIndex) => {
        if (data.action == "delete") {
          this.eventSource.forEach((elementEvent, index) => {
            if (changedElementEvent._id == elementEvent._id) {
              this.eventSource.splice(index, 1);
            }
          })
        } else if (data.action == "put") {
          this.eventSource.forEach((elementEvent, index) => {
            if (changedElementEvent._id == elementEvent._id) {
              console.log(changedElementEvent)
              console.log(elementEvent)
              elementEvent = changedElementEvent;
            }
          })
        }

        console.log(this.eventSource)
        this.guideEventSource = this.eventSource


      })
      console.log("guideBack")
      console.log(this.guideEventSource)

}
    });

  }

  changeISOtoDate(data2) {
    var data3 = [];
    data2.forEach((element, index) => {
      data3.push({
        _id: element._id,
        title: element.user.length+"/"+element.userNumberLimit,
        serviceType: element.serviceType,
        startTime: moment(element.startTime).toDate(),
        endTime: moment(element.endTime).toDate(),
        allDay: element.allDay,
        creator: element.creator,
        serviceProvider: {"id":element.serviceProvider,"nickname":element.nickname},
        user: element.user,
        serviceProviderNumberLimit: element.serviceProviderNumberLimit,
        userNumberLimit: element.userNumberLimit,
        repeat: element.repeat,
        pricePerHour: element.pricePerHour,
        action: element.action,
        price: element.price
      });
    })
    return data3;
  }
  ionViewWillEnter() {
    this.serviceProviderValidation = {};
    this.alreadyLoggedIn = false;
    this.eventSource = []
    this.guideEventSource = []
    this.chatEventSource = []


    this.userProvider.loadLocalStorage()
      .then(data => {
        console.log(data)
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
        console.log("checklogin loaded")
        if(this.serviceProviderValidation.pricePerHour) this.guidePricePerHour = this.serviceProviderValidation.pricePerHour


        this.offerProvider.myCalendarAsServiceProvider(this.serviceProviderValidation)
          .then(data2 => {
            var data3 = []
            console.log(data2)
            data3 = this.changeISOtoDate(data2)

            if (data3) {
                console.log(data3)
                this.eventSource = [].concat(data3)
                this.guideEventSource = this.eventSource
            }
          })
      });

  }
  generateId() {
    const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
      s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
    return ObjectId
  }
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }



  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
    console.log(ev);
    console.log("sesesese")

    if (this.calendar.mode == "month" && this.serviceType == "guide") {
      let confirm1 = this.alertCtrl.create({
        title: 'Make reservation?',
        message: 'How many hours do you need?',
        buttons: [
          {
            text: 'choose specified hours',
            handler: () => {
              this.calendar.mode = "week"
            }
          },
          {
            text: 'cancell',
            handler: () => {

            }
          }
        ]
      });
      if (this.serviceProviderValidation.id)
        confirm1.present();
      else alert("Please login")
    } else if (this.calendar.mode == "month" && this.serviceType == "chat") {
      let confirm2 = this.alertCtrl.create({
        title: 'Make chat reservation?',
        message: '1 hour support for any time in a day',
        buttons: [
          {
            text: '8AM~10PM support',
            handler: () => {
              this.createCallReservation(ev, "dayTime")
            }
          }, {
            text: '10PM~8AM support',
            handler: () => {
              this.createCallReservation(ev, "nightTime")
            }
          }, {
            text: '24hour support',
            handler: () => {
              this.createCallReservation(ev, "fullTime")
            }
          },

          {
            text: 'cancell',
            handler: () => {

            }
          }
        ]
      });
      if (this.serviceProviderValidation.id)
        confirm2.present();
      else alert("Please login")
    } else if (this.calendar.mode == "week" && this.serviceType == "guide") {
      var alertType = 0;
      var theIndex;
      console.log(this.guideEventSource)
      for (var i = 0; i < this.guideEventSource.length && alertType == 0; i++) {
        if (ev.selectedTime.getTime() == this.guideEventSource[i].startTime.getTime()) {
          alertType = 1;
          theIndex = i
        }
      }


      if (alertType === 0) {
        let confirm = this.alertCtrl.create({
          title: 'Make an Offer?',
          message: 'How many hours do you need?',
          inputs: [
            {
              name: 'hours',
              placeholder: 'Input hours here'
            },
          ],
          buttons: [
            {
              text: 'input hours(default 1 hour)',
              handler: data => {
                if (data) {
                  console.log(data)
                  var hours = Number(data.hours);
                  if (!hours) hours = 1
                  console.log(data);
                  this.createEvents(ev, hours)
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
        if (this.serviceProviderValidation.id)
          confirm.present();
        else alert("Please login")
      } else if (this.guideEventSource[theIndex].creator.id === this.serviceProviderValidation.id) {
        let confirm = this.alertCtrl.create({
          title: 'Delete offer?',
          message: 'You can delete only if your offer has not yet accepted',
          buttons: [
            {
              text: 'delete',
              handler: () => {
                this.createEvents(ev, 9999)
              }
            },
            {
              text: 'cancell',
              handler: () => {

              }
            }
          ]
        });
        if (this.serviceProviderValidation.id)
          confirm.present();
        else alert("Please login")
      } else {

/*
        console.log("ev")
        console.log(ev)
        console.log(this.serviceProviderValidation.id)
        console.log(this.guideEventSource)
        console.log(this.guideEventSource[theIndex].id)
        let confirm2 = this.alertCtrl.create({
          title: 'Make reservation?',
          message: 'How many hours do you need?',
          buttons: [
            {
              text: 'time is alaready reservated by other users',
              handler: () => {

              }
            }
          ]
        });
        confirm2.present();
*/
      }
    }

  }

  createEvents(ev, h: Number) {
    if (h == 9999) {
      this.guideEventSource.forEach((elementEvent, index) => {
        console.log(elementEvent.startTime.getTime())
        console.log(ev.selectedTime.getTime())
        if (ev.selectedTime.getTime() == elementEvent.startTime.getTime()) {
          console.log(index)
          elementEvent.action = "delete"
          this.deletedEventSource.push(elementEvent)
          this.guideEventSource.splice(index, 1);
          this.eventSource = [].concat(this.guideEventSource);

          console.log(this.eventSource)
        }
      });
    } else if (h > 168) {

    } else {

      var date = ev.selectedTime;
      var startTime, endTime;
      startTime = new Date(ev.selectedTime);
      startTime.setHours(startTime.getHours());
      endTime = new Date(ev.selectedTime);
      endTime.setHours(endTime.getHours() + h);
      console.log(startTime)
      console.log(moment(startTime).toDate())
      console.log(moment(startTime).toISOString())
      var serviceProviderArray = [];
      serviceProviderArray.push({"id":this.serviceProviderValidation.id, "nickname":this.serviceProviderValidation.nickname})

      this.addedEventSource.push({
        title: '0/1',
        serviceType: 'guide',
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        creator: this.serviceProviderValidation,
        serviceProvider: serviceProviderArray,
        user: [],
        serviceProviderNumberLimit: 1,
        userNumberLimit: 1,
        repeat: 0,
        action: "put",
        pricePerHour: this.guidePricePerHour
      })
      this.guideEventSource.push({
        title: '0/1',
        serviceType: 'guide',
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        creator: this.serviceProviderValidation,
        serviceProvider: serviceProviderArray,
        user: [],
        serviceProviderNumberLimit: 1,
        userNumberLimit: 1,
        repeat: 0,
        action: "put",
        pricePerHour: this.guidePricePerHour
      })
      this.eventSource = [].concat(this.guideEventSource);
      this.guideEventSource = this.eventSource;
    }
  }

  createCallReservation(ev, option: String) {
    var date = ev.selectedTime;
    var startTime, endTime;
    if (option === "dayTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 8);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 20);
    } else if (option === "nightTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 20);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 30);
    } else if (option === "fullTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 0);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 24);
    }

    var serviceProviderArray = [];
    serviceProviderArray.push({"id":this.serviceProviderValidation.id, "nickname":this.serviceProviderValidation.nickname})
    // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
    this.chatEventSource.push({
      title: 'chatReservation',
      serviceType: 'chat',
      startTime: startTime,
      endTime: endTime,
      allDay: false,
      creator: this.serviceProviderValidation,
      serviceProvider: serviceProviderArray,
      user: [],
      serviceProviderNumberLimit: 1,
      userNumberLimit: 1,
      repeat: 0,
      action: "put",
      pricePerHour: this.chatPricePerHour

    })
    this.eventSource = [].concat(this.chatEventSource);
    this.chatEventSource = this.eventSource;
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

  selectedChat() {
    console.log("chat")
    this.eventSource = this.chatEventSource
    this.calendar.mode = "month"
    this.serviceType = "chat"
  }

  selectedGuide() {
    this.eventSource = this.guideEventSource
    this.calendar.mode = "week"
    this.serviceType = "guide"
  }


  setReservationDetails() {

    if (this.serviceProviderValidation.id && this.serviceProviderValidation.password) {
      console.log(this.eventSource)
      console.log(this.addedEventSource)
      console.log(this.deletedEventSource)
      console.log(this.guideEventSource)
      var changedEventSource = [].concat(this.addedEventSource).concat(this.deletedEventSource)
      if (changedEventSource.length > 0)
        this.nav.push(NewOfferDetails, changedEventSource);
    } else if (!this.serviceProviderValidation.id) {
      alert("Please sign in first !")
    }
  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    if (this.alreadyLoggedIn === true) {

      setTimeout(() => {
        console.log('Async loading has ended');
        this.offerProvider.myCalendarAsServiceProvider(this.serviceProviderValidation)
          .then(data2 => {
            var data3 = []
            console.log(data2)
            data3 = this.changeISOtoDate(data2)
            if (data3[0]) {
              if (data3[0].serviceType === "guide") {
                this.eventSource = [].concat(data3)
                this.guideEventSource = this.eventSource
              } else if (data3[0].serviceType === "chat") {
                this.eventSource = [].concat(data3)
                this.chatEventSource = this.eventSource
              }
            }
          })
        refresher.complete();
      }, 1000);
    } else {

      setTimeout(() => {
        alert("Please login")
        refresher.complete();
      }, 1000);
    }
  }

}
