import { Component } from '@angular/core';
import { NavController, Events, Platform,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import {SignUp} from './signUp/signUp'
import { MyInformation } from './myInformation/myInformation'
import { MyFavorites } from './myFavorites/myFavorites';
import { Recruit } from './recruit/recruit';
import { MyCalendarAsUser } from './myCalendarAsUser/myCalendarAsUser';

import { MyCalendarAsServiceProvider } from './myCalendarAsServiceProvider/myCalendarAsServiceProvider';
import { MyServices } from './myServices/myServices';

import { UserProvider } from '../../providers/userProvider'
import { JobPage } from '../job/job';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { defaultURL } from '../../providers/i18n-demo.constants';


declare var Wechat:any;

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [UserProvider]
})
export class SettingsPage {

  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = false;
  nicknameOrUsername: String;
  validation : any = {};

  constructor(private nav: NavController,
    private events: Events,
    public storage: Storage,
    public userProvider: UserProvider,
    public platform: Platform,
    private alertCtrl: AlertController,
    private http: Http) {

    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.login()
      });
  }

  ionViewWillEnter() {
  this.userProvider.loadLocalStorage()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true
    });
  }

  login() {
    console.log(this.validation)
    console.log("start login")
    this.userProvider.post(this.validation)
      .then(data => {
      if(!data){
        this.validation = {}
        this.alreadyLoggedIn = false
      }else{
        console.log(data)
        this.validation = data
        this.alreadyLoggedIn = true;
        }
      });
  }

  register() {
    this.nav.push(SignUp);
  }

  myInformation(){
    this.nav.push(MyInformation);
  }
  myCalendarAsUser(){
    this.nav.push(MyCalendarAsUser);
  }
  MyFavorites(){
    this.nav.push(MyFavorites);
  }
  recruit(){
    this.nav.push(Recruit);
  }
  myCalendarAsServiceProvider(){
    this.nav.push(MyCalendarAsServiceProvider);
  }

  myServices(){
    this.nav.push(MyServices);
  }

applyForJob(){
this.nav.push(JobPage);

}
  applyForPro(){
    if(this.validation){
      if(this.validation.id&&this.validation.password){
        this.http.post(defaultURL+':3000/user/applyForPro', this.validation)
        .map(res => res.json())
          .subscribe(data => {
            this.storage.ready().then(() => {
              if (data) {
                  this.storage.ready().then(() => {
                      this.storage.set('validation', data)
                      this.validation = data
                      this.presentAlert("Successfully applied!")
                  })
              }
            })
          },err => {
            console.log(err)
          })
      }
    }
  }



  logout() {
    this.validation = {}
    this.alreadyLoggedIn = false
    console.log(this.alreadyLoggedIn)
    this.storage.ready().then(() => {

    this.storage.remove('validation').then((data1) => {
      console.log(data1)
      console.log("data1")
    })
    })
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

  openOauth(oauthName) {
    if(oauthName == "wechat"){
      if(this.platform.is('ios')||this.platform.is('android')) {
      var scope = "snsapi_userinfo",
          state = "_" + (+new Date());
          var that = this;
      Wechat.auth(scope, state, function (response) {
          // you may use response.code to get the access token.
          console.log((response));
          that.http.post(defaultURL+':3000/user/wechatLogin', response)
            .map(res => res.json())
            .subscribe(data => {
              if(data.id && data.nickname){
              that.storage.ready().then(() => {
              console.log("1")

              that.storage.set('validation', data).then((data2) => {
              console.log("2")

                if (data2 == null) console.log("error");
                else {
                console.log("3")

                //that.alreadyLoggedIn = true;
                that.validation = data
                that.presentAlert("successfully login!")

                //that.nav.parent.select(0);
                  //window.location.reload()
                }
              });
              })
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
