/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams, AlertController, Platform} from 'ionic-angular';
import { getSelectedProductDetails } from '../../../providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { ServiceProviderDetails } from '../../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { Video } from './video/video';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../../../providers/check-login'
import { Storage } from '@ionic/storage'
import { Ionic2RatingModule } from 'ionic2-rating';
import {MorphingPage} from './morphingPage/morphingPage';

declare var Wechat: any;



@Component({
  selector: 'page-productDetails',
  templateUrl: 'productDetails.html',
  providers: [getSelectedProductDetails, CheckLogin]
})
export class ProductDetails {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  product;
  productOrServiceProvider;
  productDetails: any = {
    comment: [],
    introduction: '',
    videoURL: '',
    likedBy: []
  };


  url: SafeResourceUrl;
  rate = 4;
  comment;
  commentCounts = 0;
  likeCounts = 0;
  showCommentBox = false;
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
    public productDetailsService: getSelectedProductDetails,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http,
    public alertCtrl: AlertController) {
    this.product = params.data.product;
    this.productOrServiceProvider = "product";
    console.log("params.data.product");
    console.log(params.data.product)
    this.loadSelectedproductDetails(this.product._id).then(productDetailData => {

      this.url = sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.videoURL);
      this.likeCounts = this.productDetails.likedBy.length
      this.commentCounts = this.productDetails.comment.length

    });
    //this.actionSheet = actionSheet;
    this.checkLogin.load().then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    //   this.events.publish('hideTabs');
    this.checkLogin.load().then(data => {
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
                alert("Success");
              }, function(reason) {
                alert("Failed: " + reason);
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
      this.productDetailsService.load(id)
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
      if (this.validation && this.validation.username) {
        if (this.validation.likedProduct.indexOf(product._id) >= 0) {
          console.log(product._id)
          console.log("posessed")
          return true
        }
      }
      return false
    }

  likeProduct(product) {
    if (this.validation.username == undefined) {
      alert("login before use,dude")
      this.storage.ready().then(() => {

      this.storage.remove('validation').then((data1) => {
        console.log(data1)
        console.log("data1")
})
      })
    } else {
      var likedProduct = {
        _id: product._id,
        username: this.validation.username,
        password: this.validation.password
      }
      console.log(product.likedBy);

      this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product/likeProduct', likedProduct)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // alert(data);

          console.log(data)
          //var flag = data[_body]

          var flag = data.data
          if (flag == "push") {
            product.likedBy.push(this.validation.username);
            this.validation.likedProduct.push(product._id)
            this.checkLogin.updateLikedProduct(this.validation.likedProduct)
          } else if (flag == "pull") {

            var index = product.likedBy.indexOf(this.validation.username);
            if (index > -1) {
              product.likedBy.splice(index, 1);
            }

            var index2 = this.validation.likedProduct.indexOf(product._id);
            if (index2 > -1) {
              this.validation.likedProduct.splice(index2, 1);
            }
            console.log(this.validation)
            this.checkLogin.updateLikedProduct(this.validation.likedProduct)
          }
          console.log(product.likedBy);

        });
    }
  }

  openServiceProviderDetailsPage(product) {
    product.from = "productDetailsPage"
    this.nav.push(ServiceProviderDetails, product);
  }

  purchaseProduct() {
    console.log(this.productDetails.link)
    window.open("http://" + this.productDetails.link, "_system");
  }


  sendComment() {
    console.log(this.product)
    var commentData: any = {}
    var now = new Date()
    commentData.discussion_id = this.product._id
    commentData.parent_id = null
    commentData.posted = now.toUTCString()
    commentData.username = this.validation.username
    commentData.password = this.validation.password
    commentData.text = this.comment
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product/addProductComment', commentData)
      //.map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(data)
        this.productDetails.comment.unshift(commentData);
        this.comment = null
        this.showCommentBox = !this.showCommentBox
      });
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

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedproductDetails(this.product._id).then(productDetailData => {

        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.productDetails.videoURL);
        this.likeCounts = this.productDetails.likedBy.length
        this.commentCounts = this.productDetails.comment.length

      });

      refresher.complete();
    }, 1000);
  }
}
