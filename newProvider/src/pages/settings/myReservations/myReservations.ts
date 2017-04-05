/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ContactInfo } from './contactInfo/contactInfo'
import { CheckLogin } from '../../../providers/check-login'
import { GetCalendar } from '../../../providers/getCalendar'
import { TranslateService } from 'ng2-translate/ng2-translate';
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
  providers: [CheckLogin, GetCalendar]
})
export class MyReservations {
  serviceProviderName: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};
  myReservation;


  constructor(private nav: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public getCalendar: GetCalendar,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.checkLogin.load()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn.data = true;
        this.getCalendar.load(this.serviceProviderValidation).then(data2 => {
        this.myReservation = data2

        this.myReservation.forEach((element, index) => {
          element.title = element.username.length.toString() + "/" + element.userNumberLimit.toString()
          element.startTime = moment(element.startTime).format()
          element.endTime = moment(element.endTime).format()
        })
        })
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
          serviceProviderName: this.myReservation[i].serviceProviderName,
          username: this.myReservation[i].username
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

  showUsernameInfo(event, username){
    console.log(event._id)
    console.log(username)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/charge/showReservationUserInfo', {'eventId':event._id,'username':username})
      .map(res => res.json())
      .subscribe(data2 => {
        if (data2 ) {
          console.log(data2)
          data2.username = username
          this.nav.push(ContactInfo, data2);

        }else{
          console.log("err")
        }
      });
  }
}
