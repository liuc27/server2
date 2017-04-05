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
  private serviceProviderValidation:any = {};
  informationName;
  informationValue;
  uploadedImg = {data: undefined};

  constructor(private navController: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    private _elementRef: ElementRef,
    translate: TranslateService,
    public storage: Storage,
    private params: NavParams,
    public checkLogin: CheckLogin,
    private http: Http) {
    console.log(params)

    this.informationName = params.data.name;
    this.informationValue = params.data.value;
    console.log(params.data)


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
            console.log(this.serviceProviderValidation)
          });
  }

  changeInformationValue() {
  //    Object.keys(this.serviceProviderValidation).forEach((element,index) => {
    //    console.log(element)
      //  if(this.informationName === element){
        //  console.log("key")
          if(this.informationName && this.informationValue)
          this.serviceProviderValidation[this.informationName] = this.informationValue
          console.log(this.serviceProviderValidation)
        //}
      //})

      this.register()
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
          self.serviceProviderValidation.imageURL = reader.result;
          console.log(self.serviceProviderValidation.imageURL)
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
    console.log(this.serviceProviderValidation)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/serviceProviderRegister', this.serviceProviderValidation)
      .map(res => res.json())
      .subscribe(data => {
        if (data) {
          if (data.data == "OK") {
          console.log(data)
          this.storage.set('serviceProviderValidation', this.serviceProviderValidation).then((data3) => {
            alert("changed")
          });
          } else if (data.data == "NO") {
            alert("account already exists,please choose another account name")
          }
        }
      });
  }
}
