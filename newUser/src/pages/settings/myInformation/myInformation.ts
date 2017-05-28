/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { UserProvider } from '../../../providers/userProvider'
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
  providers: [UserProvider]
})
export class MyInformation {

  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  private validation:any = {};
  certificates = []
  categoryName = []

  uploadedImg = {data: undefined};

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    public storage: Storage,
    public userProvider: UserProvider,
    private http: Http) {
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
        if(this.validation.category){
          this.validation.category.forEach((element)=>{
            console.log(element.name)
            if(this.categoryName.indexOf(element.name)<0) this.categoryName.push(element.name)
          })
        }
      });
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
        if(this.validation.certificates){
        if(this.validation.certificates.length>0){
        this.certificates = []
        this.validation.certificates.forEach((element,index) => {
          this.certificates.push(element.id)
        })
        }
        }
      })
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

  changeInformation(x) {

    var pushData : any = {};
    console.log(x)
    Object.keys(this.validation).forEach((element,index) => {
      console.log(element)
      if(x === element){
        console.log("key")
        console.log(this.validation[x])
        pushData.name = x;
        pushData.value = this.validation[x]
        this.nav.push(MyInformationChange, pushData)
      }
    })
    console.log(Object.keys(pushData).length)
    if(Object.keys(pushData).length<=0) this.nav.push(MyInformationChange, {
      name:x,
      value:undefined
    })
  }

}
