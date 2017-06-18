/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../../../providers/userProvider'
import { OfferProvider } from '../../../../../providers/offerProvider'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';
import { defaultURL } from '../../../../../providers/i18n-demo.constants';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-recruitmentTimeDetails',
  templateUrl: 'recruitmentTimeDetails.html',
  providers: [UserProvider, OfferProvider]
})
export class RecruitmentTimeDetails {
  serviceProviderId: String;
  password: String;
  service:any = {
      creator:{},
      currency:'jpy',
      service:{
        category:{

        }
      },
      reservationDetails:[]
  };
  param: string = "world";
  alreadyLoggedIn = { data: false };
  reservations : any = [];
  newReservation : any = {}

  buttonDisabled = true

  constructor(private nav: NavController,
    private events: Events,
    private params: NavParams,
    public storage: Storage,
    public userProvider: UserProvider,
    public offerProvider: OfferProvider,
    private alertCtrl:AlertController,
    private http: Http) {
      if(this.params.data)
      this.service = this.params.data
      if(this.service.reservationDetails){
        this.reservations = this.service.reservationDetails
      }

      let startTime = new Date()
      let endTime = new Date()
      startTime.setMinutes(0)
      endTime.setMinutes(0)
      this.newReservation.startTime = moment(startTime).format() ;
      this.newReservation.endTime = moment(endTime).format();
      console.log(this.params.data)

  }

  ionViewWillEnter() {
  }

  addReservation() {

  var userArray = [];
  userArray.push({"_id":this.service.creator._id,"id":this.service.creator.id, "nickname":this.service.creator.nickname, "imageURL":this.service.creator.imageURL})
    if(this.newReservation.startTime&&this.newReservation.endTime&&this.newReservation.userNumberLimit&&this.service.creator){
      this.reservations.push({
        startTime: this.newReservation.startTime,
        endTime: this.newReservation.endTime,
        serviceProvider: [],
        serviceProviderNumberLimit:this.newReservation.userNumberLimit,
        userNumberLimit: 1,
        user: userArray,
        action:'add'
      })
      this.buttonDisabled = false
    }else{
      this.presentAlert("Login and input all the blanks please.")
    }
  }



  deleteReservation(i) {


    if(this.reservations[i]._id){
      this.reservations[i].action = "delete"
    }else{
      this.reservations.splice(i,1)
    }
    console.log(this.reservations)

    this.buttonDisabled = false
  }

newOfferSubmit() {
  this.buttonDisabled = true;
  this.service.reservationDetails = this.reservations
  this.service.serviceType = 'service'
  this.service.action = 'put'
  console.log(this.service)



  if (this.service.creator.id && this.service.service.serviceName&& this.service.reservationDetails) {
    console.log(this.service)

    this.http.post(defaultURL+':3000/offer/service', this.service)
    .map(res => res.json())
      .subscribe(data => {
          console.log(data);
          this.presentAlert("OK")
          this.service.reservationDetails = data.reservationDetails
          this.buttonDisabled = false;
          this.nav.pop();
        },
        (err) => {
          console.log(err);
          this.buttonDisabled = false;
        }
      )
  }else{
  this.presentAlert("Please login first, then input service name, start time, end time and userNumberLimit!")
    this.buttonDisabled = false;

  }
}



presentAlert(message) {
let alert = this.alertCtrl.create({
  title: message,
  subTitle: '',
  buttons: ['OK']
});
setTimeout(() => {
}, 50);
alert.present();
}

}
