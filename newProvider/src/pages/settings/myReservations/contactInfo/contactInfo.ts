/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { CheckLogin } from '../../../../providers/check-login'
import { GetCalendar } from '../../../../providers/getCalendar'
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
  selector: 'page-contactInfo',
  templateUrl: 'contactInfo.html',
  providers: [CheckLogin]
})
export class ContactInfo {
  serviceProviderName: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};
  myReservation;
  contactInfo:any={};


  constructor(private navController: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public params: NavParams,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.contactInfo = this.params.data
  }

  ionViewWillEnter() {
  }
}
