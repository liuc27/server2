/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { CheckLogin } from '../../../providers/check-login'
import { GetMyReservation } from '../../../providers/getMyReservation'
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
  providers: [CheckLogin, GetMyReservation]
})
export class MyReservations {
  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  validation : any = {};
  myReservation;

  constructor(private navController: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public getMyReservation: GetMyReservation,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');



    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
        this.getMyReservation.load(this.validation.username,this.validation.password).then(data2 => {
        this.myReservation = data2

          this.myReservation.forEach((element, index) => {
            element.title = element.username.length.toString() + "/" + element.userNumberLimit.toString()
          })

        })
      });

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }


}
