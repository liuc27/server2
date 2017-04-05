/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, Platform} from 'ionic-angular';
import { getSelectedProductDetails } from '../../../../providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ProductService } from '../../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { CheckLogin } from '../../../../../providers/check-login'
import { GetServiceProviderCalendar } from '../../../../../providers/getServiceProviderCalendar'
import { Http } from '@angular/http';
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
  selector: 'page-reservationDetails',
  templateUrl: 'reservationDetails.html',
  providers: [getSelectedProductDetails, ProductService, CheckLogin, GetServiceProviderCalendar]
})
export class ReservationDetails {
  product;
  payOrRefund;
  chargeFlag = false;
  chatroomId;
  productOrServiceProvider;
  productDetails;
  alreadyLoggedIn = false;
  validation: any = {};
  url: SafeResourceUrl;
  eventList = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString()
  }
  guidePrice = 1000;
  chatPrice = 100;
  totalPrice = 0;
  changedEventSourceISO: any;
  serviceType;
  reservationPayment: any = {}

  constructor(private params: NavParams,
    private http: Http,
    private nav: NavController,
    private actionSheet: ActionSheetController,
    public getServiceProviderCalendar: GetServiceProviderCalendar,
    public platform:Platform,
    private events: Events,
    private sanitizer: DomSanitizer,
    public checkLogin: CheckLogin,
    public productDetailsService: getSelectedProductDetails,
    public chatroomService: ProductService) {
    this.changedEventSourceISO = params.data.changedEventSource;
    this.changedEventSourceISO.forEach((element, index) => {
      element.startTime = moment(element.startTime).format()
      element.endTime = moment(element.endTime).format()
    });
    this.checkLogin.load()
      .then(data => {
      console.log(data)
        this.validation = data
        this.alreadyLoggedIn = true;
        if(this.validation.contact)
        this.reservationPayment.contact = this.validation.contact

        if (this.changedEventSourceISO) {
          this.reservationPayment.contact = this.validation.contact

          if (this.changedEventSourceISO[0].action == "put")
            this.payOrRefund = 'pay'
          else if (this.changedEventSourceISO[0].action == "delete")
            this.payOrRefund = 'refund'
          for (var i = 0; i < this.changedEventSourceISO.length; i++) {
            console.log(this.changedEventSourceISO.length)
            console.log(this.changedEventSourceISO)
            if (this.changedEventSourceISO[i]) {
              if (this.changedEventSourceISO[i].serviceType && this.changedEventSourceISO[i].startTime && this.changedEventSourceISO[i].endTime) {
                console.log(this.validation.contact)
                console.log(this.validation)
                console.log(this.changedEventSourceISO[i].serviceType)
                if (this.changedEventSourceISO[i].serviceType === "guide") {
                  console.log("this is guide")
                  var duration = moment.duration(moment(this.changedEventSourceISO[i].endTime).diff(moment(this.changedEventSourceISO[i].startTime)));
                  var hours = duration.asHours();
                  var price = this.guidePrice * hours;
                  this.changedEventSourceISO[i].price = price;
                  this.totalPrice += price;
                  this.serviceType = "guide"
                } else if (this.changedEventSourceISO[i].serviceType === "chat") {
                  console.log("this is chat")
                  var price = this.chatPrice * 10;
                  this.changedEventSourceISO[i].price = price;
                  this.totalPrice += price;
                  this.serviceType = "chat"
                }
              }
            }
          }
        }
      });



    console.log(this.changedEventSourceISO);



    this.productOrServiceProvider = "product";
    console.log(params.data);
    this.loadSelectedproductDetails();
    this.actionSheet = actionSheet;
    this.url = sanitizer.bypassSecurityTrustResourceUrl('https://appear.in/charlie123456789');

  }

  addReservation(x) {
    console.log(x)
    for (var i = 0; i < this.changedEventSourceISO.length; i++) {
      if (i === x) {
        this.changedEventSourceISO.push({
          title: this.changedEventSourceISO[i].title,
          serviceType: this.changedEventSourceISO[i].serviceType,
          startTime: this.changedEventSourceISO[i].endTime,
          endTime: this.changedEventSourceISO[i].endTime,
          allDay: this.changedEventSourceISO[i].allDay,
          serviceProviderName: this.changedEventSourceISO[i].serviceProviderName,
          username: this.changedEventSourceISO[i].username
        }
        );
      }
    }
    console.log(this.changedEventSourceISO)
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

  recaculateTotal() {
    this.totalPrice = 0;
    if (this.changedEventSourceISO) {
      for (var i = 0; i < this.changedEventSourceISO.length; i++) {
        console.log(this.changedEventSourceISO.length)
        if (this.changedEventSourceISO[i].serviceType && this.changedEventSourceISO[i].startTime && this.changedEventSourceISO[i].endTime) {
          console.log(this.changedEventSourceISO[i].serviceType)
          var duration = moment.duration(moment(this.changedEventSourceISO[i].endTime).diff(moment(this.changedEventSourceISO[i].startTime)));
          var hours = duration.asHours();
          var price = this.changedEventSourceISO[i].pricePerHour * hours;
          this.changedEventSourceISO[i].price = price;
          //  if (this.changedEventSourceISO[i].action == "put")
          this.totalPrice += price;
          //  else this.totalPrice -= price;
        }
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

  loadSelectedproductDetails() {
    /*  this.productDetailsService.load()
          .then(data => {
              this.productDetails = data;
              console.log(this.productDetails);
          }); */
  }


  pay(x) {
    console.log(x)
    if(!this.reservationPayment.note){
      this.reservationPayment.note=" "
    }
    if (this.reservationPayment.contact ){
      if (x == "wechatPay") {
      if(this.platform.is('ios')||this.platform.is('android')) {
          console.log(this.platform.is('ios'))

        var reservationData = JSON.parse(JSON.stringify(this.changedEventSourceISO))
        reservationData.forEach((element, index) => {
          delete element.action
        });

        this.reservationPayment.reservation = reservationData
        this.reservationPayment.totalPrice = this.totalPrice

        this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/charge/wechatPay', this.reservationPayment)
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

          })
          }else{
            alert("Please install wechat app.")
          }
      }else {
        console.log(this.reservationPayment)
      }
    } else{
      alert("please input contact information in case the servie provider needs to contact you.")
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


  ionViewWillLeave() {
    console.log("ionicView leave")
    if (this.chargeFlag == false)
      this.events.publish('guide', this.changedEventSourceISO);

  }

}
