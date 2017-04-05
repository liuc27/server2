/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { CheckLogin } from '../../../providers/check-login'
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
  selector: 'page-myCoupons',
  templateUrl: 'myCoupons.html',
  providers: [CheckLogin]
})
export class MyCoupons {
  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  validation : any = {};

  constructor(private navController: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');


    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
      });

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  login() {
    console.log(this.validation)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/api/login', this.validation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if (data != null) {
          if (data.data == "OK") {
            console.log(data)
            this.storage.ready().then(() => {

            this.storage.set('validation', this.validation).then((data) => {

              if (data == null) console.log("error");
              else {
                this.alreadyLoggedIn.data = true;
                location.reload();
              }
            });
            })
          } else if (data.data == "NO") {
            alert("account already exists and the password was wrong")
          } else {
            alert("registered")
            this.storage.set('validation', this.validation).then((data) => {
              console.log(data)
              if (data == null) console.log("error");
              else {
                this.alreadyLoggedIn.data = true;
                location.reload();
              }
            });
          }
        }
      });
  }
}
