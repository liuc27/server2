/**
 * Created by liuchao on 6/25/16.
 */

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, Content,ToastController } from 'ionic-angular';
import { ServiceDetails } from '../../../service/serviceLists/serviceDetails/serviceDetails';
import { UserProvider } from '../../../../providers/userProvider'
import { OfferProvider } from '../../../../providers/offerProvider'

import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { JobReservationDetails } from './jobReservationDetails/jobReservationDetails';
import moment from 'moment';

import { NgCalendarModule  } from 'ionic2-calendar';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-jobReservation',
  templateUrl: 'jobReservation.html',
  providers: [UserProvider, OfferProvider]
})
export class JobReservation {
@ViewChild(Content) content: Content;

  user: any = {};
  userDetails: any = [];
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


  //    jobReservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    public offerProvider: OfferProvider,
    private http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    console.log("params.data is")
    console.log(params.data)
    this.user = params.data.user
    this.serviceType = params.data.serviceType

    this.events = events;

    if (!this.serviceType) {
      this.serviceType = "guide"
    }

    events.subscribe('guide', (data) => {

      this.userProvider.loadLocalStorage()
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


  this.userProvider.loadLocalStorage()
    .then(data => {
      console.log("userProvider done")
      this.validation = data
      this.alreadyLoggedIn = true;
      });

      console.log(this.user)
      this.offerProvider.userOffer(this.user.id,["job"])
        .then(data2 => {
          console.log(data2)
          data2.forEach((element, index) => {
            element.startTime = moment(element.startTime).toDate()
            element.endTime = moment(element.endTime).toDate()
            data2[index].title = element.serviceProvider.length+'/'+element.serviceProviderNumberLimit

            if(element.serviceProvider)
            element.serviceProvider.forEach((elementUser,userIndex) =>{
              if(elementUser.id === this.validation.id){
                data2[index].title = this.validation.nickname
              }
              })

          })
          this.eventSource = data2
          //if(serviceType== "guide")
          this.guideEventSource = data2
        })
}

changeISOtoDate(data2){
  var data3 = [];

  data2.forEach((element, index) => {
    element.startTime = moment(element.startTime).toDate()
    element.endTime = moment(element.endTime).toDate()
  })

  return data3;
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

presentAlert(data) {
let alert = this.alertCtrl.create({
  title: data,
  subTitle: '',
  buttons: ['OK']
});
setTimeout(() => {
  this.alreadyLoggedIn = true;
}, 50);
alert.present();
}

onTimeSelected(ev) {
  console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
  console.log(this.calendar.mode)
  console.log(this.serviceType)

  if (this.calendar.mode == "month") {
    let confirm1 = this.alertCtrl.create({
      title: 'Make jobReservation?',
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
    if(this.validation.id)
    confirm1.present();
    else this.presentAlert("Please login!")
  } else if (this.calendar.mode == "week") {
    var alertType = 0;
    var alertType2 = 0;
    var theIndex;
    console.log(this.guideEventSource)

    for (var i = 0; i < this.guideEventSource.length && alertType == 0; i++) {
    console.log(ev.selectedTime.getTime())
    console.log(this.guideEventSource[i].startTime.getTime())
      if (ev.selectedTime.getTime() == this.guideEventSource[i].startTime.getTime()) {
        alertType = 1;
        theIndex = i
      }
    }


    if (alertType === 1) {


    this.guideEventSource[theIndex].user.forEach((elementUser,index) =>{
      if(elementUser.id === this.validation.id){
        alertType =2
      }
      })
      }

    if(alertType == 2) {
      let confirm = this.alertCtrl.create({
        title: 'Make jobReservation?',
        message: 'Cancell jobReservation?',
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
      if(this.validation.id)
      confirm.present();
      else this.presentAlert("Please login")
    } else if(alertType == 1&&this.guideEventSource[theIndex].serviceType == "guide"){

      console.log("ev")
      console.log(ev)
      console.log(this.validation.id)
      console.log(this.guideEventSource)
      if(this.guideEventSource[theIndex].user.length>=this.guideEventSource[theIndex].userNumberLimit){
      }else {
      let confirm2 = this.alertCtrl.create({
        title: 'Make jobReservation?',
        message: 'Make jobReservation?',
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
      if(this.validation.id)
      confirm2.present();
      else this.presentAlert("Please login")
      }
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
        elementEvent.title = "✔";
        elementEvent.user.push({_id:this.validation._id,id:this.validation.id,nickname:this.validation.nickname})
        this.eventSource = [].concat(this.guideEventSource);
        this.addedEventSource.push({
          _id: elementEvent._id,
          creator: elementEvent.creator,
          serviceProvider: elementEvent.serviceProvider,
          user: {
            id:this.validation.id,
            nickname:this.validation.nickname
          },
          serviceType: "guide",
          action: "put",
          startTime: elementEvent.startTime,
          endTime: elementEvent.endTime,
          price: elementEvent.price,
          currency: elementEvent.currency
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
        elementEvent.serviceProvider.forEach((elementUser, idIndex) => {
          if (elementUser.id == this.validation.id) {
            this.guideEventSource[index].serviceProvider.splice(idIndex,1)

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
          creator: elementEvent.creator,
          serviceProvider: elementEvent.serviceProvider,
          user: {
            id:this.validation.id,
            nickname:this.validation.nickname
          },
          action: "delete",
          startTime: elementEvent.startTime,
          endTime: elementEvent.endTime,
          price: elementEvent.price,
          currency: elementEvent.currency
        })
        elementEvent.title = elementEvent.user.length.toString() + "/" + elementEvent.userNumberLimit.toString()
        this.addedEventSource = []
        this.enterReservationDetails()
        }else {
        elementEvent.title = elementEvent.user.length.toString() + "/" + elementEvent.userNumberLimit.toString()
        }
      }
    });

  }

  this.eventSource = [].concat(this.guideEventSource);
  console.log(this.eventSource)

  //  this.guideEventSource = this.eventSource;
  //this.enterReservationDetails()
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

enterReservationDetails() {
  if (this.validation.id && this.validation.password) {
    console.log(this.eventSource)
    console.log(this.addedEventSource)
    console.log(this.deletedEventSource)
    console.log(this.guideEventSource)
    var changedEventSource = this.addedEventSource.concat(this.deletedEventSource)
    if (changedEventSource.length > 0)
      this.nav.push(JobReservationDetails, changedEventSource);
  } else if (!this.validation.id) {
    this.presentAlert("Please login in!")
  }
}

doRefresh(refresher) {
  console.log('Begin load', refresher);

  if(this.alreadyLoggedIn === true){

  setTimeout(() => {
    console.log('Async loading has ended');
    this.offerProvider.userOffer(this.user.id,["job"])
      .then(data2 => {
      console.log(data2)
      data2.forEach((element, index) => {
        element.startTime = moment(element.startTime).toDate()
        element.endTime = moment(element.endTime).toDate()
      })
      this.eventSource = data2
    })
    refresher.complete();
  }, 1000);
  } else {

  setTimeout(() => {
    this.presentAlert("Please login!")
    refresher.complete();
  }, 1000);
  }
}

scrollToTop() {
  this.content.scrollToTop();
}

goTop() {
    this.scrollToTop()
    this.presentToast()
    setTimeout(() => {
        this.ionViewWillEnter();
    }, 500);
}

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
}
