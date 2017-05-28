/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, AlertController, Platform, Content,ToastController} from 'ionic-angular';
import { ProductProvider } from '../../../../providers/productProvider';
import { ServiceProviderDetails } from '../../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { Video } from './video/video';
import { ProductReview } from './productReview/productReview';

import { ReservationDetails } from '../../../serviceProvider/serviceProviderDetails/reservation/reservationDetails/reservationDetails';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../../../providers/userProvider'
import { FavoriteProvider } from '../../../../providers/favoriteProvider'

import { Storage } from '@ionic/storage'
import { Ionic2RatingModule } from 'ionic2-rating';
import {MorphingPage} from './morphingPage/morphingPage';
import {ProductPayment} from './productPayment/productPayment';

declare var Wechat: any;



@Component({
  selector: 'page-productDetails',
  templateUrl: 'productDetails.html',
  providers: [ProductProvider, UserProvider, FavoriteProvider]
})
export class ProductDetails {
  @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Content) content: Content;

  product;
  productOrServiceProvider;
  productDetails: any = {
    review: [],
    introduction: '',
    videoURL: '',
    likedBy: []
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
    public productProvider: ProductProvider,
    public storage: Storage,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private http: Http,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
    this.product = params.data;
    this.productOrServiceProvider = "product";
    console.log("params.data");
    console.log(params.data)
    this.loadSelectedproductDetails(this.product._id).then(productDetailData => {

      this.url = sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.videoURL);
      if(!this.productDetails.likedBy) this.productDetails.likedBy=[]
      if(this.productDetails.review)
      this.reviewCounts = this.productDetails.review.length

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
                  title: "Hi, I watched " + that.product.productName + " from App",
                  description: that.product.introduction,
                  thumb: that.product.imageURL,
                  mediaTagName: that.product.productName,
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

  loadSelectedproductDetails(id) {

    return new Promise(resolve => {
      this.productProvider.getProductDetails(id)
        .then(data => {
          this.productDetails = data;
          console.log("this.productDetails");
          console.log(data)
          /*
          var cookies = document.cookie.split(";");

           for (var i = 0; i < cookies.length; i++) {
               var cookie = cookies[i];
               var eqPos = cookie.indexOf("=");
               var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
               document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
           }

          document.cookie = 'CloudFront-Policy' + '=' + this.productDetails["CloudFront-Policy"] + ';';
          document.cookie = 'CloudFront-Signature' + '=' + this.productDetails["CloudFront-Signature"] + ';';
          document.cookie = 'CloudFront-Key-Pair-Id' + '=' + this.productDetails["CloudFront-Key-Pair-Id"];

          this.signedCookiesData = 'Policy' + '=' + this.productDetails["CloudFront-Policy"] + '&' + 'Signature' + '=' + this.productDetails["CloudFront-Signature"] + '&' + 'Key-Pair-Id' + '=' + this.productDetails["CloudFront-Key-Pair-Id"];


          //alert(this.signedCookiesData);
          console.log("data")
          console.log(data)jjjf¥¥¥¥¥¥
          */

          resolve(data)


        });
    })
  }


  alreadyLiked(product) {
    if (this.validation  ) {
    if(product._id && this.validation.likedProduct){
      if (this.validation.likedProduct.indexOf(product._id) >= 0) {
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


  favoriteProduct(product) {
    if (this.validation.id) {
      console.log(product)
      var theProduct = {
        _id: product._id,
        id: this.validation.id,
        password: this.validation.password
      }
      console.log(product.likedBy);

      this.favoriteProvider.postProduct(theProduct).then(data => {
      var flag = data
      if (flag == "push") {
        product.likedBy.push(this.validation.id);
        this.validation.likedProduct.push(product._id)
      } else if (flag == "pull") {

        var index = product.likedBy.indexOf(this.validation.id);
        if (index > -1) {
          product.likedBy.splice(index, 1);
        }

        var index2 = this.validation.likedProduct.indexOf(product._id);
        if (index2 > -1) {
          this.validation.likedProduct.splice(index2, 1);
        }
        console.log(this.validation)
      }
      this.userProvider.saveLocalStorage(this.validation)
      console.log(product.likedBy);
      })
    } else {
      this.presentAlert("Please login first!")

    }
  }

  openServiceProviderDetailsPage(product) {
    product.from = "productDetailsPage"
    this.nav.push(ServiceProviderDetails, product.serviceProvider);
  }

  purchaseProduct() {
    console.log(this.productDetails.link)
    window.open("http://" + this.productDetails.link, "_system");
  }


  openProductReviewPage() {
  if(this.validation){
    if(this.validation.id&&this.validation.password&&this.validation.nickname){
      this.nav.push(ProductReview, {
      _id:this.productDetails._id,
      productName:this.productDetails.productName,
      serviceProvider:this.productDetails.serviceProvider,
      updated:this.productDetails.updated});
    }else{
      this.presentAlert("Login first please!")
    }
  }else{
  this.presentAlert("Login first please!")
  }
    }


  learn(productDetails) {
    this.payActionSheet();
  }

  advertise() {
    this.shareActionSheet()
  }

  enterMorphingPage() {
    console.log("enterMorphingPage");
    this.nav.push(MorphingPage, { product: this.productDetails });
  }

  openVideoPage() {
    console.log("video open");
    this.nav.push(Video, { videoDetails: this.productDetails });
  }

  joinEvent(){

  if(this.validation){
    if(this.validation.id&&this.validation.password&&this.validation.nickname){
    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer/productId?productId='+this.productDetails._id)
      .map(res => res.json())
      .subscribe(
      data2 => {
              console.log(data2)
              if(data2[0])
              data2[0].action = "put"
              this.nav.push(ReservationDetails, data2);
      },
      (err) => {
          console.log(err._body)
      })

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
      this.loadSelectedproductDetails(this.product._id).then(productDetailData => {

        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.videoURL);
        if(!this.productDetails.likedBy) this.productDetails.likedBy = []
        if(this.productDetails.reviewCounts)
        this.reviewCounts = this.productDetails.review.length

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
      this.loadSelectedproductDetails(this.product._id).then(productDetailData => {

        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.videoURL);
        if(!this.productDetails.likedBy) this.productDetails.likedBy=[]
        if(this.productDetails.reviewCounts)
        this.reviewCounts = this.productDetails.review.length

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
