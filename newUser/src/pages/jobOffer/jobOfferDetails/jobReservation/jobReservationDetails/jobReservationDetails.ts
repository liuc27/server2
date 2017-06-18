/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, Platform, Content, ToastController, AlertController} from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { JobOfferDetails } from '../../jobOfferDetails';
import { ServiceProvider } from '../../../../../providers/serviceProvider';
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
import { defaultURL } from '../../../../../providers/i18n-demo.constants';


@Component({
    selector: 'page-jobReservationDetails',
    templateUrl: 'jobReservationDetails.html',
    providers: [ServiceProvider, UserProvider, OfferProvider]
})
export class JobReservationDetails {
    @ViewChild(Content) content: Content;

    service;
  //  payOrRefund;
    chargeFlag = false;
    chatroomId;
    serviceOrServiceProvider;
    serviceDetails;
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
    jobReservationPayment: any = {}

    constructor(private params: NavParams,
        private http: Http,
        private nav: NavController,
        private actionSheet: ActionSheetController,
        public offerProvider: OfferProvider,
        public platform: Platform,
        private events: Events,
        private sanitizer: DomSanitizer,
        public userProvider: UserProvider,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public chatroomService: ServiceProvider) {
        if (params.data) {
            this.changedEventSourceISO = params.data;
            this.changedEventSourceISO.forEach((element, index) => {
                element.startTime = moment(element.startTime).format()
                element.endTime = moment(element.endTime).format()
            });
        }
        this.userProvider.loadLocalStorage()
            .then(data => {
                console.log(data)
                this.validation = data
                this.alreadyLoggedIn = true;
                if (this.validation.contact)
                    this.jobReservationPayment.contact = this.validation.contact

                if (this.changedEventSourceISO.length > 0) {
                    this.jobReservationPayment.contact = this.validation.contact

                    for (var i = 0; i < this.changedEventSourceISO.length; i++) {
                        console.log(this.changedEventSourceISO.length)
                        console.log(this.changedEventSourceISO)
                        if (this.changedEventSourceISO[i]) {
                            if (this.changedEventSourceISO[i].serviceType && this.changedEventSourceISO[i].startTime && this.changedEventSourceISO[i].endTime) {
                                console.log(this.validation.contact)
                                console.log(this.validation)
                                console.log(this.changedEventSourceISO[i].serviceType)
                                console.log("this is guide")
                                //var duration = moment.duration(moment(this.changedEventSourceISO[i].endTime).diff(moment(this.changedEventSourceISO[i].startTime)));
                                //var hours = duration.asHours();
                                //var price = this.guidePrice * hours;
                                //this.changedEventSourceISO[i].price = price;
                                if (this.changedEventSourceISO[i].price) {
                                    var price = Number(this.changedEventSourceISO[i].price);
                                    this.totalPrice += price;
                                    this.serviceType = this.changedEventSourceISO[i].serviceType
                                }
                            }
                        }
                    }
                }
            });

        console.log(this.changedEventSourceISO);
        this.serviceOrServiceProvider = "service";
        console.log(params.data);
        this.loadSelectedserviceDetails();
        this.actionSheet = actionSheet;
        this.url = sanitizer.bypassSecurityTrustResourceUrl('https://appear.in/charlie123456789');

    }

    ionViewWillEnter() {
        if (this.chargeFlag == false)
            this.userProvider.loadLocalStorage()
                .then(data => {
                    this.validation = data
                    this.jobReservationPayment.contact = this.validation.contact
                    this.alreadyLoggedIn = true;
                })
    }
    /*  addReservation(x) {
        console.log(x)
        for (var i = 0; i < this.changedEventSourceISO.length; i++) {
          if (i === x) {
            this.changedEventSourceISO.push({
              title: this.changedEventSourceISO[i].title,
              serviceType: this.changedEventSourceISO[i].serviceType,
              startTime: this.changedEventSourceISO[i].endTime,
              endTime: this.changedEventSourceISO[i].endTime,
              allDay: this.changedEventSourceISO[i].allDay,
              serviceProvider: this.changedEventSourceISO[i].serviceProvider,
              user: this.changedEventSourceISO[i].user
            }
            );
          }
        }
        console.log(this.changedEventSourceISO)
      }
      */

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

    openJobOfferDetailsPage(user) {
      this.nav.push(JobOfferDetails, user);
    }



    loadSelectedserviceDetails() {
        /*  this.serviceDetailsService.load()
              .then(data => {
                  this.serviceDetails = data;
                  console.log(this.serviceDetails);
              }); */
    }

    presentAlert(data) {
        let alert = this.alertCtrl.create({
            title: data,
            subTitle: '',
            buttons: ['OK']
        });
        setTimeout(() => {
            this.alreadyLoggedIn = true;
        }, 50);
        alert.present();
    }

    pay(x) {
        console.log(x)
        if (!this.jobReservationPayment.note) {
            this.jobReservationPayment.note = " "
        }
        if (this.jobReservationPayment.contact) {
            if (x == "wechatPay") {

                if ((<any>window).cordova) {
                    var jobReservationData = JSON.parse(JSON.stringify(this.changedEventSourceISO))
                    jobReservationData.forEach((element, index) => {
                        delete element.action
                    });

                    this.jobReservationPayment.reservation = jobReservationData
                    this.jobReservationPayment.totalPrice = this.totalPrice
                    this.jobReservationPayment.chargeType = 'deposit'

                    this.http.post(defaultURL+':3000/charge/wechatPay', this.jobReservationPayment)
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
                                that.presentAlert("Success");
                                that.jobReservationPayment = {}
                                that.chargeFlag = true;
                                that.nav.pop()
                            }, function(reason) {
                                that.presentAlert("Failed: " + reason);
                            });

                        }, err => {
                            console.log(err)
                            console.log("err")

                            this.presentAlert(err._body)
                        }
                        )
                } else {
                    this.presentAlert("Please install wechat app.")
                }
            } else {
                console.log(this.jobReservationPayment)
            }
        } else {
            this.presentAlert("please input contact information in case the servie provider needs to contact you.")
            this.nav.push(MyInformationChange, {
                name: "contact",
                value: ""
            })
        }
    }

    refund() {
        var jobReservationRefund: any = {}
        var jobReservationData = JSON.parse(JSON.stringify(this.changedEventSourceISO))
        jobReservationData.forEach((element, index) => {
            delete element.action
        });
        jobReservationRefund.jobReservation = jobReservationData
        jobReservationRefund.totalPrice = this.totalPrice

        this.http.post(defaultURL+':3000/charge/refund', jobReservationRefund)
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
                        this.presentAlert("Error")
                    } else if (data) {
                        if (data.data == "OK") {
                            this.presentAlert("Success");
                            this.chargeFlag = true;
                            this.nav.pop()
                        } else {
                            this.presentAlert("Sorry, Someone Else already made the jobReservation before you.")

                        }
                    } else {
                        this.presentAlert("Error")
                    }
                }, function(reason) {
                    this.presentAlert("Failed: " + reason);
                });

            })

    }


    ionViewWillLeave() {
        console.log("ionicView leave")
        if (this.chargeFlag == false)
            this.events.publish('guide', this.changedEventSourceISO);

    }

    scrollToTop() {
        this.content.scrollToTop();
    }

    goTop() {
        this.scrollToTop()
        //this.presentToast()
    }

    /*presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Refreshing...',
        duration: 1000,
        position: 'middle'
      });

      toast.onDidDismiss(() => {
        console.log(' ');
      });

      toast.present();
    }*/

}
