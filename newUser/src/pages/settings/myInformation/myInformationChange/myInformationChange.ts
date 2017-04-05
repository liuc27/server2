/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { CheckLogin } from '../../../../providers/check-login'
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
  selector: 'page-myInformationChange',
  templateUrl: 'myInformationChange.html',
  providers: [CheckLogin]
})
export class MyInformationChange {
@ViewChild('Select') selectComp;

  username: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  private validation:any = {};
  informationName;
  informationValue;
  uploadedImg = {data: undefined};

  constructor(private navController: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    translate: TranslateService,
    public storage: Storage,
    private params: NavParams,
    public checkLogin: CheckLogin,
    private http: Http) {
    console.log(params)

    this.informationName = params.data.name;
    this.informationValue = params.data.value;


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

  changeInformationValue() {
        if(this.informationName && this.informationValue){
          this.validation[this.informationName] = this.informationValue
          this.register()
        }
  }

  uploadImageTrigger(){
         this.selectComp.nativeElement.click()
  }

  uploadImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      self.validation.imageURL = reader.result;
      self.informationValue = reader.result
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



    register() {
      console.log(this.validation)
      this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/user/register', this.validation)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          if (data) {
            if (data.data == "OK") {
            console.log(data)

          //  if(this.informationName == "headimgurl"){
          //  location.reload();
          //  }
          this.storage.ready().then(() => {

            this.storage.set('validation', this.validation).then((data3) => {

              alert("changed")
            });
            })

            } else if (data.data == "NO") {
              alert("account already exists,please choose another account name")
            }
          }
        });
    }
}
