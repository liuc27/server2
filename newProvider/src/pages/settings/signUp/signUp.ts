/**
 * Created by liuchao on 6/25/16.
 */
 import { Component, ViewChild, ElementRef } from '@angular/core';
 import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
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
  selector: 'page-signUp',
  templateUrl: 'signUp.html',
  providers: [CheckLogin]
})
export class SignUp {
  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  serviceProviderValidation : any = {};

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    translate: TranslateService,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');


    this.checkLogin.load()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn.data = true;
      });

  }

  ionViewWillEnter() {
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
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }

  register() {
    console.log(this.serviceProviderValidation)
    if(this.serviceProviderValidation.serviceProviderName&&this.serviceProviderValidation.serviceProviderNickname&&this.serviceProviderValidation.password){
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/serviceProviderRegister', this.serviceProviderValidation)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        if (data != null) {
          if (data.data == "OK") {
          alert("registered")

          this.checkLogin.load()
            .then(data => {
              this.serviceProviderValidation = data
              this.alreadyLoggedIn.data = true;
              this.nav.pop();
            });
          } else if (data.data == "NO") {
            alert("account already exists,please choose another account name")
          }
        }
      });
      }else{
      alert("Name, password, and nickname are needed.")
      }
  }
}
