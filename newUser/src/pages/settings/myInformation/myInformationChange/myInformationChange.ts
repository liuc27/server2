/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import { UserProvider } from '../../../../providers/userProvider'
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

import { defaultURL } from '../../../../providers/i18n-demo.constants';

@Component({
  selector: 'page-myInformationChange',
  templateUrl: 'myInformationChange.html',
  providers: [UserProvider]
})
export class MyInformationChange {
@ViewChild('Select') selectComp;
@ViewChild('Select2') selectComp2;
@ViewChild('Select3') selectComp3;

  id: String;
  password: String;
  param: string = "world";
  alreadyLoggedIn = { data: false };
  validation:any = {};
  newCertificate:any = {}
  certificates:any = []
  informationName;
  informationValue:any;
  uploadedImg = {data: undefined};
  selected1
  trueOrFalse
  selected : any = []

  options: any = [
  {'main':'guide'},
  {'main':'teach'},
  {'main':'housework'},
  {'main':'art'},
  {'main':'beauty','sub':'skinCare'},
  {'main':'beauty','sub':'makeup'},
  {'main':'beauty','sub':'diet'},
  {'main':'beauty','sub':'surgery'},
  {'main':'beauty','sub':'others'},
  {'main':'jobHunt'},
  {'main':'schoolFind'},
  {'main':'bizAdvise'},
  {'main':'law'},
  {'main':'others'}
  ]

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    public storage: Storage,
    private params: NavParams,
    public userProvider: UserProvider,
    private http: Http) {

    console.log(params)

    this.informationName = params.data.name;
    this.informationValue = params.data.value;
    if(this.informationValue&&this.informationName=="certificate"){
      if(this.informationValue[0]){
        this.certificates = this.informationValue
        console.log(this.certificates)
      }
    }

  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn.data = true;
      });
  }

  category1Selected(){
    if(this.selected1){
    this.informationValue=this.selected1
    }
  }


  changeInformationValue() {
        if(this.informationName && this.informationValue){
          this.validation[this.informationName] = this.informationValue
          console.log(this.validation)
          this.http.put(defaultURL+':3000/user/'+this.validation._id, this.validation)
            .map(res => res.json())
            .subscribe(
            data => {
              this.storage.ready().then(() => {
                this.storage.set('validation', this.validation).then((data3) => {
                  alert("changed")
                  this.nav.pop();
                });
                })
              },
              (err) => {
                  alert(err._body)
              })
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

  uploadCertificateImageTrigger(){
         this.selectComp2.nativeElement.click()
  }

  uploadCertificateImage(event,certificate) {
    var eventTarget = event.srcElement || event.target;

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      certificate.certificateImageURL = reader.result;
      self.informationValue = self.certificates
    //  self.validation.certificate[self.informationName] = reader.result
      self.presentToast()
    }
    reader.readAsDataURL(file);
  }

  uploadNewCertificateImageTrigger(){
         this.selectComp3.nativeElement.click()
  }

  uploadNewCertificateImage(event) {
    console.log("new")
    var eventTarget = event.srcElement || event.target;

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      self.newCertificate.imageURL = reader.result
      if(!self.validation.certificates) self.validation.certificates = [].concat(self.newCertificate)
      else self.validation.certificates = self.validation.certificates.concat(self.newCertificate)
      self.informationValue = self.validation.certificates

      console.log(self.informationValue)
      self.presentToast()
      self.certificates = self.validation.certificates
      self.newCertificate = {}


    }
    reader.readAsDataURL(file);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '添加成功,请点保存',
      duration: 1000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });
    toast.present();
  }

}
