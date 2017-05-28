/**
 * Created by liuchao on 6/25/16.
 */
 import { Component, ViewChild, ElementRef } from '@angular/core';
 import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
 import { UserProvider } from '../../../providers/userProvider'
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
  providers: [UserProvider]
})
export class SignUp {
  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = false;
  validation : any = {};

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    public storage: Storage,
    public userProvider: UserProvider,
    private http: Http) {
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
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

  register() {
    if(!this.validation){
      console.log(this.validation)
    }else if(!this.validation.id||!this.validation.nickname||!this.validation.password||!this.validation.imageURL){
    alert("id, password, nickname, imageURL are needed")
    }else if(this.validation.id.length<6||this.validation.password<6){
      alert("id and password need more than 6 characters!")
    } else{
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/user/', this.validation)
      .map(res => res.json())
      .subscribe(
            data => {

            this.storage.ready().then(() => {
            this.storage.set('validation', data).then((data2) => {
              if (data2 == null) console.log("error");
              else {
              console.log("3")
              this.alreadyLoggedIn = true;
              this.validation = data
                alert("successfully registered")
                this.nav.pop()
              }
            });
            })

            },
            (err) => {
                alert(err._body)
            })
            }
  }
}
