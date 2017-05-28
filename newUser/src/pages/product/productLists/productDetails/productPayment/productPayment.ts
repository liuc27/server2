/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, Platform} from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductProvider } from '../../../../../providers/productProvider';
import { UserProvider } from '../../../../../providers/userProvider'
import { OfferProvider } from '../../../../../providers/offerProvider'
import { Http } from '@angular/http';
import { MyInformationChange } from '../../../../settings/myInformation/myInformationChange/myInformationChange'
import 'rxjs/add/operator/map';

import moment from 'moment';
//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';


declare var Wechat: any;


@Component({
  selector: 'page-productPayment',
  templateUrl: 'productPayment.html',
  providers: [ProductProvider, UserProvider, OfferProvider]
})
export class ProductPayment {
  product;
  chargeFlag = false;
  chatroomId;
  productOrServiceProvider;
  productDetails;
  alreadyLoggedIn = false;
  validation: any = {};
  url: SafeResourceUrl;
  payOrRefund = "pay"
  eventList = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString()
  }
  guidePrice = 1000;
  chatPrice = 100;
  totalPrice = 0;
  changedEventSourceISO: any = [];
  serviceType;
  reservationPayment: any = {}

  constructor(private params: NavParams,
    private http: Http,
    private nav: NavController,
    private actionSheet: ActionSheetController,
    public offerProvider: OfferProvider,
    public platform:Platform,
    private events: Events,
    private sanitizer: DomSanitizer,
    public userProvider: UserProvider,
    public chatroomService: ProductProvider) {
    console.log(params.data)
    if(params.data) this.reservationPayment = params.data

    //element.startTime = moment(element.startTime).format()
    //element.endTime = moment(element.endTime).format()


    this.userProvider.loadLocalStorage()
      .then(data => {
      console.log(data)
        this.validation = data
        this.alreadyLoggedIn = true;
        if(this.validation.contact)
        this.reservationPayment.contact = this.validation.contact
      });
  }

  ionViewWillEnter() {
    if (this.chargeFlag == false)
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
        })
  }

  cancellReservation(x) {
    console.log(x)
    for (var i = 0; i < this.changedEventSourceISO.length; i++) {
      if (i === x) {
        if (this.changedEventSourceISO[i].price) {
          this.totalPrice -= this.changedEventSourceISO[i].price
        }
        this.changedEventSourceISO.splice(i, 1);

      }
    }
    console.log(this.changedEventSourceISO)
  }

  shareActionSheet() {
    let actionSheet = this.actionSheet.create({
      title: 'SHARE',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'email',
          icon: 'ios-mail',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Wechat',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Twitter',
          icon: 'logo-twitter',
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Google',
          icon: 'logo-google',
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'md-close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }



  pay(x) {
    console.log(x)
    if(!this.reservationPayment.note){
      this.reservationPayment.note=" "
    }
    if (this.reservationPayment.contact ){
      if (x == "wechatPay") {
      if(this.platform.is('ios')||this.platform.is('android')) {

        this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/charge/wechatPay', this.reservationPayment)
          .map(res => res.json())
          .subscribe(
          data => {
            console.log(data)
            var params = {
              partnerid: data.partnerId, // merchant id
              prepayid: data.prepayId, // prepay id
              noncestr: data.nonceStr, // nonce
              timestamp: data.timeStamp, // timestamp
              sign: data.sign // signed string
            };
            var that = this
            Wechat.sendPaymentRequest(params, function() {
              //needs to save the result in a backup database
              alert("Success");
              that.reservationPayment = {}
              that.chargeFlag = true;
              that.nav.pop()
            }, function(reason) {
              alert("Failed: " + reason);
            });

          },err =>{
              console.log(err)
              console.log("err")

               alert(err._body)
          }
          )
          }else{
            alert("Please install wechat app.")
          }
      }else {
        console.log(this.reservationPayment)
      }
    } else{
      alert("please input contact information in case the servie provider needs to contact you.")
      this.nav.push(MyInformationChange,{
        name:"contact",
        value:""
      })
    }
  }

  refund() {
    var reservationRefund: any = {}
    var reservationData = JSON.parse(JSON.stringify(this.changedEventSourceISO))
    reservationData.forEach((element, index) => {
      delete element.action
    });
    reservationRefund.reservation = reservationData
    reservationRefund.totalPrice = this.totalPrice

    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/charge/refund', reservationRefund)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data)
        var params = {
          partnerid: data.partnerId, // merchant id
          prepayid: data.prepayId, // prepay id
          noncestr: data.nonceStr, // nonce
          timestamp: data.timeStamp, // timestamp
          sign: data.sign // signed string
        };
        Wechat.sendPaymentRequest(params, function(err, data) {
          if (err) {
            alert("Error")
          } else if (data) {
            if (data.data == "OK") {
              alert("Success");
              this.chargeFlag = true;
              this.nav.pop()
            } else {
              alert("Sorry, Someone Else already made the reservation before you.")

            }
          } else {
            alert("Error")
          }
        }, function(reason) {
          alert("Failed: " + reason);
        });
      })
  }

}
