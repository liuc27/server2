/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, AlertController, Platform, Content,ToastController} from 'ionic-angular';
import { ServiceProvider } from '../../../../providers/serviceProvider';
import { ServiceProviderDetails } from '../../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { Video } from './video/video';
import { ServiceReview } from './serviceReview/serviceReview';

import { ReservationDetails } from '../../../serviceProvider/serviceProviderDetails/reservation/reservationDetails/reservationDetails';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../../../providers/userProvider'
import { FavoriteProvider } from '../../../../providers/favoriteProvider'
import { defaultURL } from '../../../../providers/i18n-demo.constants';

import { Storage } from '@ionic/storage'
import { Ionic2RatingModule } from 'ionic2-rating';
import {MorphingPage} from './morphingPage/morphingPage';
import {ServicePayment} from './servicePayment/servicePayment';

declare var Wechat: any;



@Component({
  selector: 'page-serviceDetails',
  templateUrl: 'serviceDetails.html',
  providers: [ServiceProvider, UserProvider, FavoriteProvider]
})
export class ServiceDetails {
  @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Content) content: Content;

  service;
  serviceOrServiceProvider;
  serviceDetails: any = {
    review: [],
    introduction: '',
    videoURL: '',
    likedBy: [],
    creator:{},
    service:{
    category:{
    main:''
    }
    }
  };


  url: SafeResourceUrl;
  rate = 4;
  review;
  reviewCounts = 0;
  showReviewBox = false;
  alreadyLoggedIn = false;
  validation: any = {};

  prePaid = false
  signedCookiesData;

  constructor(private params: NavParams,
    private nav: NavController,
    private sanitizer: DomSanitizer,
    private actionSheet: ActionSheetController,
    private events: Events,
    private platform: Platform,
    public serviceProvider: ServiceProvider,
    public storage: Storage,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    this.service = params.data;
    this.serviceOrServiceProvider = "service";
    console.log("params.data");
    console.log(params.data)
    this.loadSelectedserviceDetails(this.service._id).then(serviceDetails => {
      this.serviceDetails = serviceDetails
      console.log(serviceDetails)
      this.url = sanitizer.bypassSecurityTrustResourceUrl(this.serviceDetails.videoURL);
      if(!this.serviceDetails.likedBy) this.serviceDetails.likedBy=[]
      if(this.serviceDetails.review)
      this.reviewCounts = this.serviceDetails.review.length

    });
    //this.actionSheet = actionSheet;
    this.userProvider.loadLocalStorage().then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    //   this.events.publish('hideTabs');
    this.userProvider.loadLocalStorage().then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });

  }

  shareActionSheet() {
    let actionSheet = this.actionSheet.create({
      title: 'SHARE',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Wechat',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('wechat clicked');
            var that = this;
            if (this.platform.is('ios') || this.platform.is('android')) {

              Wechat.share({
                message: {
                  title: "Hi, I watched " + that.service.serviceName + " from App",
                  description: that.service.introduction,
                  thumb: that.service.creator.imageURL,
                  mediaTagName: that.service.serviceName,
                  messageExt: "这是第三方带的测试字段",
                  messageAction: "<action>dotalist</action>",
                  media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: "https://itunes.apple.com/us/app/zhi-hui-dao/id1187823731?mt=8"
                  }
                },
                scene: Wechat.Scene.TIMELINE
              }, function() {
                this.presentAlert("Success")
              }, function(reason) {
                this.presentAlert("Failed"+ reason)

              });

            }
          }
        },
        {
          text: 'Weibo',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Alipay',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'QQ zone',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Email',
          icon: 'ios-mail',
          handler: () => {
            console.log('Share clicked');
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

  payActionSheet() {
    let actionSheet = this.actionSheet.create({
      title: 'PAY',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Wechat',
          icon: 'arrow-dropright-circle',
          handler: () => {
            console.log('Wechat clicked');
            this.openVideoPage();
          }
        },
        {
          text: 'Alipay',
          icon: 'logo-twitter',
          handler: () => {
            console.log('Alipay clicked');
            this.openVideoPage();
          }
        },
        {
          text: 'ApplePay',
          icon: 'logo-apple',
          handler: () => {
            console.log('Applepay clicked');
            this.openVideoPage();
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

  loadSelectedserviceDetails(_id) {

    return new Promise(resolve => {
      this.serviceProvider.getServiceDetails(_id)
        .then(data => {
          console.log("this.serviceDetails");
          console.log(data)
          /*
          var cookies = document.cookie.split(";");

           for (var i = 0; i < cookies.length; i++) {
               var cookie = cookies[i];
               var eqPos = cookie.indexOf("=");
               var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
               document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
           }

          document.cookie = 'CloudFront-Policy' + '=' + this.serviceDetails["CloudFront-Policy"] + ';';
          document.cookie = 'CloudFront-Signature' + '=' + this.serviceDetails["CloudFront-Signature"] + ';';
          document.cookie = 'CloudFront-Key-Pair-Id' + '=' + this.serviceDetails["CloudFront-Key-Pair-Id"];

          this.signedCookiesData = 'Policy' + '=' + this.serviceDetails["CloudFront-Policy"] + '&' + 'Signature' + '=' + this.serviceDetails["CloudFront-Signature"] + '&' + 'Key-Pair-Id' + '=' + this.serviceDetails["CloudFront-Key-Pair-Id"];


          //alert(this.signedCookiesData);
          console.log("data")
          console.log(data)jjjf¥¥¥¥¥¥
          */

          resolve(data)


        });
    })
  }


  alreadyLiked(service) {
    if (this.validation  ) {
    if(service._id && this.validation.likedService){
      if (this.validation.likedService.indexOf(service._id) >= 0) {
        return true
      }
      }
    }
    return false
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


favoriteService(service) {
  if (this.validation.id) {
    console.log(service)
    var theService = {
      _id: service._id,
      id: this.validation.id,
      password: this.validation.password
    }
    console.log(service.likedBy);

    this.favoriteProvider.postService(theService).then(data => {
    var flag = data
    if (flag == "push") {
    if(!service.likedBy) service.likedBy=[]
     service.likedBy.push(this.validation.id);
    if(!this.validation.likedService) this.validation.likedService=[]
    this.validation.likedService.push(service._id)
    } else if (flag == "pull") {
      if(service.likedBy){
        var index = service.likedBy.indexOf(this.validation.id);
        if (index > -1) {
          service.likedBy.splice(index, 1);
        }
    }

    if(this.validation.likedService){
      var index2 = this.validation.likedService.indexOf(service._id);
      if (index2 > -1) {
        this.validation.likedService.splice(index2, 1);
      }
      console.log(this.validation)
      }
    }
    this.userProvider.saveLocalStorage(this.validation)
    console.log(service.likedBy);
    })
  } else {
  this.presentAlert("Login first please!")

  }
}

  openServiceProviderDetailsPage(service) {
    service.from = "serviceDetailsPage"
    this.nav.push(ServiceProviderDetails, service.creator);
  }

  purchaseService() {
    console.log(this.serviceDetails.link)
    window.open("http://" + this.serviceDetails.link, "_system");
  }


  openServiceReviewPage() {
  if(this.validation){
    if(this.validation.id&&this.validation.password&&this.validation.nickname){
      this.nav.push(ServiceReview, {
      _id:this.serviceDetails._id,
      serviceName:this.serviceDetails.serviceName,
      serviceProvider:this.serviceDetails.creator,
      updated:this.serviceDetails.updated});
    }else{
      this.presentAlert("Login first please!")
    }
  }else{
  this.presentAlert("Login first please!")
  }
    }


  learn(serviceDetails) {
    this.payActionSheet();
  }

  advertise() {
    this.shareActionSheet()
  }

  enterMorphingPage() {
    console.log("enterMorphingPage");
    this.nav.push(MorphingPage, { service: this.serviceDetails });
  }

  openVideoPage() {
    console.log("video open");
    this.nav.push(Video, { videoDetails: this.serviceDetails });
  }

  joinEvent(){

  if(this.validation){
    if(this.validation.id&&this.validation.password&&this.validation.nickname){
      this.serviceDetails.action = "put"
      let reservationArray = []
      reservationArray[0] = this.serviceDetails
      console.log(this.serviceDetails)
      console.log(reservationArray)
      this.nav.push(ReservationDetails, reservationArray);
    }else{
      this.presentAlert("Login first please!")
    }
  }else{
      this.presentAlert("Login first please!")
  }


  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedserviceDetails(this.service._id).then(serviceDetails => {
        this.serviceDetails = serviceDetails
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.serviceDetails.videoURL);
        if(!this.serviceDetails.likedBy) this.serviceDetails.likedBy = []
        if(this.serviceDetails.reviewCounts)
        this.reviewCounts = this.serviceDetails.review.length

      });

      refresher.complete();
    }, 1000);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  goTop() {
      this.scrollToTop()
      this.presentToast()

      setTimeout(() => {
      this.loadSelectedserviceDetails(this.service._id).then(serviceDetailData => {

        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.serviceDetails.videoURL);
        if(!this.serviceDetails.likedBy) this.serviceDetails.likedBy=[]
        if(this.serviceDetails.reviewCounts)
        this.reviewCounts = this.serviceDetails.review.length

      });
      }, 500);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Refreshing...',
      duration: 1000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }

}
