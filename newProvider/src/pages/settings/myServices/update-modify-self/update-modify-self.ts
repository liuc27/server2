import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {CheckLogin} from '../../../../providers/check-login'
import {Storage} from '@ionic/storage'

/*
  Generated class for the UpdateModifySelf page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-update-modify-self',
  templateUrl: 'update-modify-self.html',
        providers:[CheckLogin]
})
export class UpdateModifySelfPage {

 PointDefiner: any;
  Warper: any;
  Point: any;
  Animator: any;
  serviceProviderName: String;
  password: String;
  serviceProviderValidation : any = {};

  alreadyLoggedIn = {data:false};


  public serviceProvider = {
    serviceProviderName: undefined,
    password: undefined,
    serviceProviderImageURL: "",
    serviceProviderIntroduction: undefined,
    serviceProviderTitle: undefined,
    serviceProviderLevel: undefined
  };

  uploadedImg = {data: undefined};
  year : number;
  month :number;
  day :number;
  buttonDisabled : boolean;

  categories = [
    '一级',
    '二级',
    '经验',
    '网络',
  ]



  constructor(private params: NavParams,
              public navCtrl: NavController,
              private http: Http,
                       public storage:Storage,
                public checkLogin:CheckLogin,
              private toastCtrl: ToastController
              ) {

    this.serviceProvider = params.data.serviceProviderInformation;

    this.buttonDisabled = false;
    this.checkLogin.load()
        .then(data => {
          this.serviceProviderValidation = data
          this.alreadyLoggedIn.data = true;
        });
              }

   uploadServiceProviderImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      self.serviceProvider.serviceProviderImageURL = reader.result;
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

  replaceServiceProvider() {
    this.buttonDisabled = true;
    if (this.serviceProvider.serviceProviderName) {

      var request: any = {};



      if (this.serviceProvider.serviceProviderName) {
        request.serviceProviderName = this.serviceProvider.serviceProviderName;
      }

      if (this.serviceProvider.password) {
        request.password = this.serviceProvider.password;
      }

      if (this.serviceProvider.serviceProviderImageURL) {
        request.serviceProviderImageURL = this.serviceProvider.serviceProviderImageURL;
      }

      if (this.serviceProvider.serviceProviderIntroduction) {
        request.serviceProviderIntroduction = this.serviceProvider.serviceProviderIntroduction;
      }

      if (this.serviceProvider.serviceProviderLevel) {
        request.serviceProviderLevel = this.serviceProvider.serviceProviderLevel;
      }

      if (this.serviceProvider.serviceProviderTitle) {
        request.serviceProviderTitle = this.serviceProvider.serviceProviderTitle;
      }

      console.log(request);

      this.http.post("http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/serviceProviderRegister", request)
              .map(res => res.json())
        .subscribe(data => {
            console.log(data.data);
            alert(data.data)
            this.buttonDisabled = false;
          },

          (err) => {
            console.log("error");
            this.buttonDisabled = false;
          }
        )
    }else{
      alert("请填写化妆师名和密码!")
      this.buttonDisabled = false;

    }
  }
}
