/**
 * Created by liuchao on 6/26/16.
 */
import {Component} from '@angular/core';
import {NavController, ViewController, Platform, NavParams, Events, AlertController} from 'ionic-angular';

@Component({
  selector: 'page-modalContent',
  templateUrl: 'modalContent.html',
})

export class ModalContentPage {
   character;
    eventSource;
    viewTitle;
    pickUp;

    searchFilter = {
      pickUp: false,
      callSupport: false,
      student: false,
      male: false,
      female: false,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    }

    theSavedFilter;

    isToday: boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    serviceProviderEvents = [];

    public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {


    this.searchFilter = params.data;
    this.theSavedFilter = Object.assign({}, params.data);
    console.log(params)
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
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

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
    console.log(ev);
      let confirm = this.alertCtrl.create({
            title: 'Make reservation?',
            message: 'How many hours do you need?',
            buttons: [
              {
                text: 'set as start date',
                handler: () => {
                  this.createEvents(ev,3)

                }
              },
              {
                text: 'set as end date',
                handler: () => {
                  this.createEvents(ev,5)
                }
              }
            ]
          });
          confirm.present();

    }

    createEvents(ev,h: Number){
                  var date = ev.selectedTime;
                  var startTime, endTime;
                  startTime = new Date(ev.selectedTime.getTime());

                   startTime.setHours(startTime.getHours());

                  // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                  endTime = new Date(ev.selectedTime.getTime());

                  endTime.setHours(endTime.getHours()+h);

                  // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                  this.serviceProviderEvents.push({
                      title: 'Reservation - ' + 1,
                      startTime: startTime,
                      endTime: endTime,
                      allDay: false
                  })
                  this.eventSource = [].concat(this.serviceProviderEvents);
                  console.log(this.eventSource)
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
                    allDay: true
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
                    allDay: false
                });
            }
        }
        console.log(events)
        return events;
    }

    saveFilter(){
      console.log(this.searchFilter)
      this.viewCtrl.dismiss(this.searchFilter);

    }

    dismiss(){
              console.log(this.theSavedFilter)


              this.viewCtrl.dismiss(this.theSavedFilter);
    }
    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
}
