import { Component } from '@angular/core';
import { NavController, Events, Platform } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Storage } from '@ionic/storage'
import {SignUp} from './signUp/signUp'
import { MyInformation } from './myInformation/myInformation'
import { MyReservations } from './myReservations/myReservations';
import { MyCoupons } from './myCoupons/myCoupons';
import { MyFriends } from './myFriends/myFriends';
import { MyServices } from './myServices/myServices';

import { CheckLogin } from '../../providers/check-login'


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var Wechat:any;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [CheckLogin]
})
export class SettingsPage {

  serviceProviderName: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = false;
  serviceProviderValidation : any = {};

  constructor(private nav: NavController,
    private events: Events,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public platform: Platform,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.checkLogin.load()
      .then(data => {
        console.log(data)
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
      });
  }

  login() {
    console.log(this.serviceProviderValidation)
    console.log("start login")
    this.checkLogin.login(this.serviceProviderValidation)
      .then(data => {
        console.log(data)
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
      });
  }

  register() {
    this.nav.push(SignUp);
  }

  myInformation(){
    this.nav.push(MyInformation);
  }
  myReservations(){
    this.nav.push(MyReservations);
  }
  myCoupons(){
    this.nav.push(MyCoupons);
  }
  myFriends(){
    this.nav.push(MyFriends);
  }
  myServices(){
    this.nav.push(MyServices);
  }


  logout() {
    this.serviceProviderValidation.serviceProviderName = null
    this.serviceProviderValidation.serviceProviderNickname = null
    this.serviceProviderValidation.password = null


    this.alreadyLoggedIn = false
    console.log(this.alreadyLoggedIn)
    this.storage.remove('serviceProviderValidation').then(data1 => {
      console.log(data1)
      console.log("data1")
    //  this.nav.setRoot(SettingsPage)

    })
  }

  openOauth(oauthName) {
    if(oauthName == "wechat"){
      if(this.platform.is('ios')||this.platform.is('android')) {
      var scope = "snsapi_userinfo",
          state = "_" + (+new Date());
          var that = this;
      Wechat.auth(scope, state, function (response) {
          // you may use response.code to get the access token.
          console.log((response));
          that.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/serviceProviderWechatLogin', response)
            .map(res => res.json())
            .subscribe(data => {
              if(data.serviceProviderName && data.serviceProviderNickname){
              console.log(data)

              that.storage.set('serviceProviderValidation', data).then((data2) => {
                if (data2 == null) console.log("error");
                else {
                alert("successfully login with wechat")
                that.alreadyLoggedIn = true;
                that.serviceProviderValidation = data
                that.nav.parent.select(0);
                  //window.location.reload()
                }
              });
              }
            })

      }, function (reason) {
          alert("Failed: " + reason);
      });
      }
    }else{
    console.log("we will soon add this function")
  }
  }
}
