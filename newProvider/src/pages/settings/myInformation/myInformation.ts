/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { CheckLogin } from '../../../providers/check-login'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MyInformationChange } from './myInformationChange/myInformationChange'
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
  selector: 'page-myInformation',
  templateUrl: 'myInformation.html',
  providers: [CheckLogin]
})
export class MyInformation {

  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  private serviceProviderValidation: any = {};

  uploadedImg = { data: undefined };

  constructor(private navController: NavController,
    private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');

  }

  ionViewWillEnter() {
    this.checkLogin.load()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn.data = true;
      });
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  uploadImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function(e) {
      self.serviceProviderValidation.imageURL = reader.result;
      self.presentToast()

    }
    reader.readAsDataURL(file);

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '添加成功',
      duration: 1000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }

  changeInformation(x) {

    var pushData: any = {};
    var pushData2: any = {};

    console.log(x)
    Object.keys(this.serviceProviderValidation).forEach((element, index) => {
      console.log(element)
      if (x === element) {
        console.log("key")
        console.log(this.serviceProviderValidation[x])
        pushData.name = x;
        pushData.value = this.serviceProviderValidation[x]
        this.nav.push(MyInformationChange, pushData)
      }
    })
    if(Object.keys(pushData).length<=0) this.nav.push(MyInformationChange, {
      name:x,
      value:undefined
    })
  }

  login() {
    console.log(this.serviceProviderValidation)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/serviceProviderLogin', this.serviceProviderValidation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if (data != null) {
          if (data.data == "OK") {
            console.log(data)
            this.storage.set('serviceProviderValidation', this.serviceProviderValidation).then((data) => {

              if (data == null) console.log("error");
              else {
                this.alreadyLoggedIn.data = true;
                location.reload();
              }
            });
          } else if (data.data == "NO") {
            alert("account already exists and the password was wrong")
          } else {
            alert("registered")
            this.storage.set('serviceProviderValidation', this.serviceProviderValidation).then((data) => {
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
