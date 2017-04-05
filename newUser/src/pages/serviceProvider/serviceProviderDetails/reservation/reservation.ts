/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ProductDetails } from '../../../product/productLists/productDetails/productDetails';
import { CheckLogin } from '../../../../providers/check-login'
import {GetServiceProviderCalendar } from '../../../../providers/getServiceProviderCalendar'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductService } from '../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { ReservationDetails } from './reservationDetails/reservationDetails';
import moment from 'moment';

import { NgCalendarModule  } from 'ionic2-calendar';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-reservation',
  templateUrl: 'reservation.html',
  providers: [ProductService, CheckLogin, GetServiceProviderCalendar]
})
export class Reservation {
  serviceProvider: any = {};
  serviceProviderDetails: any = [];
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  validation: any = {};

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


  //    reservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public getServiceProviderCalendar: GetServiceProviderCalendar,
    private http: Http,
    public productService: ProductService,
    public reservationService: ProductService,
    public alertCtrl: AlertController) {
    console.log("params.data is")
    console.log(params.data)
    this.serviceProvider = params.data.serviceProvider
    this.serviceType = params.data.serviceType

    this.events = events;

    if (!this.serviceType) {
      this.serviceType = "guide"
    }

    events.subscribe('guide', (data) => {

      this.checkLogin.load()
        .then(data => {
          this.validation = data
          this.alreadyLoggedIn = true;

      })
    })
}

ionViewWillEnter() {
  // console.log("send hideTabs event")
  // this.events.publish('hideTabs');
  this.validation = {}
  this.alreadyLoggedIn = false;
  this.eventSource = []
  this.guideEventSource = []
  this.chatEventSource = []

  this.checkLogin.load()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
      });

      this.getServiceProviderCalendar.load(this.serviceProvider.serviceProviderName, this.serviceProvider.serviceProviderPassword)
        .then(data2 => {
          var data3 = []
          console.log(data2)
          data3 = this.changeISOtoDate(data2)
          if (data3[0]) {
            data3.forEach((element, index) => {
              element.title = element.username.length.toString() + "/" + element.userNumberLimit.toString()
            })
            if (data3[0].serviceType === "guide") {
              this.eventSource = [].concat(data3)
              this.guideEventSource = this.eventSource
            } else if (data3[0].serviceType === "chat") {
              this.eventSource = [].concat(data3)
              this.chatEventSource = this.eventSource
            }
          }
        })

}

changeISOtoDate(data2){
  var data3 = [];
  data2.forEach((element, index) => {
    data3.push({
      _id: element._id,
      title: element.title,
      serviceType: element.serviceType,
      startTime: moment(element.startTime).toDate(),
      endTime: moment(element.endTime).toDate(),
      allDay: element.allDay,
      creatorName: element.creatorName,
      serviceProviderName: element.serviceProviderName,
      username: element.username,
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

loadSelectedServiceProviderDetails(paramsData) {


  return new Promise(resolve => {
    this.productService.load(this.start, null, paramsData.serviceProviderName)
      .then(data => {
        console.log("data")
        console.log(data)
        if (Object.keys(data).length == 0) {
          this.start -= 20
        }
        if (this.serviceProviderDetails.product) {
          this.serviceProviderDetails = this.serviceProviderDetails.concat(data);
        } else {
          this.serviceProviderDetails = [].concat(data);
        }
        resolve(data);
      });
  });
}

changeMode(mode) {
  this.calendar.mode = mode;
}

today() {
  this.calendar.currentDate = new Date();
}

loadEvents() {
  this.eventSource = this.createRandomEvents();
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
    if(this.validation.username)
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
    if(this.validation.username)
    confirm2.present();
    else alert("Please login")
  } else if (this.calendar.mode == "week" && this.serviceType == "guide") {
    var alertType = 0;
    var theIndex;

    for (var i = 0; i < this.guideEventSource.length && alertType == 0; i++) {
      if (ev.selectedTime.getTime() == this.guideEventSource[i].startTime.getTime()) {
        alertType = 1;
        theIndex = i
      }
    }


    if (alertType === 0) {

    } else if (this.guideEventSource[theIndex].username.indexOf(this.validation.username) > -1) {
      let confirm = this.alertCtrl.create({
        title: 'Make reservation?',
        message: 'How many hours do you need?',
        buttons: [
          {
            text: 'delete',
            handler: () => {
              this.createEvents(ev, 99999)
            }
          },
          {
            text: 'cancell',
            handler: () => {

            }
          }
        ]
      });
      if(this.validation.username)
      confirm.present();
      else alert("Please login")
    } else {

      console.log("ev")
      console.log(ev)
      console.log(this.validation.username)
      console.log(this.guideEventSource)
      console.log(this.guideEventSource[theIndex].username)
      let confirm2 = this.alertCtrl.create({
        title: 'Make reservation?',
        message: 'Make reservation?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.createEvents(ev, 1)
            }
          },
          {
            text: 'Cancell',
            handler: () => {
            }
          }
        ]
      });
      if(this.validation.username)
      confirm2.present();
      else alert("Please login")
    }
  }

}

createEvents(ev, h: Number) {
  if (h == 1) {


    this.guideEventSource.forEach((elementEvent, index) => {
      console.log(elementEvent.startTime.getTime())
      console.log(ev.selectedTime.getTime())
      if (ev.selectedTime.getTime() == elementEvent.startTime.getTime()) {
        console.log(index)
        elementEvent.title = this.validation.username;
        elementEvent.username.push(this.validation.username)
        this.eventSource = [].concat(this.guideEventSource);
        this.addedEventSource.push({
          _id: elementEvent._id,
          creatorName: elementEvent.creatorName,
          serviceProviderName: elementEvent.serviceProviderName,
          username: this.validation.username,
          serviceType: "guide",
          action: "put",
          startTime: elementEvent.startTime,
          endTime: elementEvent.endTime,
          pricePerHour: elementEvent.pricePerHour
        })
        console.log(this.addedEventSource)
        console.log(this.eventSource)
      }
    });
  } else if (h == 99999) {
    this.guideEventSource.forEach((elementEvent, index) => {
      console.log(elementEvent.startTime.getTime())
      console.log(ev.selectedTime.getTime())
      if (ev.selectedTime.getTime() == elementEvent.startTime.getTime()) {
        console.log(index)
;
        elementEvent.username.forEach((elementUsername, usernameIndex) => {
          if (elementUsername == this.validation.username) {
            elementEvent.username.splice(usernameIndex,1)

          }
        })

        var flag = 1;
        this.addedEventSource.forEach((addedElementEvent, addedIndex) => {
          if(addedElementEvent._id == elementEvent._id){
           this.addedEventSource.splice(addedIndex,1)
           flag = 0
          }
          })

        if(flag == 1){
        this.deletedEventSource.push({
          _id: elementEvent._id,
          serviceType: "guide",
          creatorName: elementEvent.creatorName,
          serviceProviderName: elementEvent.serviceProviderName,
          username: this.validation.username,
          action: "delete",
          startTime: elementEvent.startTime,
          endTime: elementEvent.endTime,
          pricePerHour: elementEvent.pricePerHour
        })
        elementEvent.title = elementEvent.username.length.toString() + "/" + elementEvent.userNumberLimit.toString()
        this.addedEventSource = []
        this.enterReservationDetails()
        }else {
        elementEvent.title = elementEvent.username.length.toString() + "/" + elementEvent.userNumberLimit.toString()
        }
      }
    });

  }

  this.eventSource = [].concat(this.guideEventSource);
  console.log(this.eventSource)

  //  this.guideEventSource = this.eventSource;
  //this.enterReservationDetails()
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


  // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
  this.chatEventSource.push({
    title: 'chatReservation',
    serviceType: 'chat',
    startTime: startTime,
    endTime: endTime,
    allDay: false,
    serviceProviderName: this.serviceProvider.serviceProviderName,
    username: this.validation.username
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

createRandomEvents() {
  var events = [];
  for (var i = 0; i < 50; i += 1) {
    var date = new Date();
    var eventType = Math.floor(Math.random() * 2);
    var startDay = Math.floor(Math.random() * 90) - 45;
    var endDay = Math.floor(Math.random() * 2) + startDay;
    var startTime;
    var endTime;
    if (eventType === 0) {
      startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      if (endDay === startDay) {
        endDay += 1;
      }
      endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
      events.push({
        title: 'All Day - ' + i,
        startTime: startTime,
        endTime: endTime,
        allDay: true,
        serviceProviderName: this.serviceProvider.serviceProviderName,
        username: this.validation.username
      });
    } else {
      var startMinute = Math.floor(Math.random() * 24 * 60);
      var endMinute = Math.floor(Math.random() * 180) + startMinute;
      startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
      endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
      events.push({
        title: 'Event - ' + i,
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        serviceProviderName: this.serviceProvider.serviceProviderName,
        username: this.validation.username
      });
    }
  }
  console.log(events)
  return events;
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

enterReservationDetails() {
  if (this.validation.username && this.validation.password) {
    console.log(this.eventSource)
    console.log(this.addedEventSource)
    console.log(this.deletedEventSource)
    console.log(this.guideEventSource)
    var changedEventSource = this.addedEventSource.concat(this.deletedEventSource)
    if (changedEventSource.length > 0)
      this.nav.push(ReservationDetails, { changedEventSource: changedEventSource });
  } else if (!this.validation.username) {
    alert("Please sign in first !")
  }
}

doRefresh(refresher) {
  console.log('Begin load', refresher);

  if(this.alreadyLoggedIn === true){

  setTimeout(() => {
    console.log('Async loading has ended');
    this.getServiceProviderCalendar.load(this.serviceProvider.serviceProviderName, this.serviceProvider.serviceProviderPassword)
      .then(data2 => {
        var data3 = []
        console.log(data2)
        data3 = this.changeISOtoDate(data2)
        if (data3[0]) {
          data3.forEach((element, index) => {
            element.title = element.username.length.toString() + "/" + element.userNumberLimit.toString()
          })
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
