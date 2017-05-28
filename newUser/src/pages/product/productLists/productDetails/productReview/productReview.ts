/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, Content, ToastController } from 'ionic-angular';
import { UserProvider } from '../../../../../providers/userProvider'
import { Ionic2RatingModule } from 'ionic2-rating';
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
  selector: 'page-productReview',
  templateUrl: 'productReview.html',
  providers: [UserProvider]
})
export class ProductReview {
@ViewChild('Select') selectComp;
@ViewChild(Content) content: Content;


  id: String;
  password: String;
  alreadyLoggedIn = false ;
  validation:any = {};
  reviews:any = []
  reviewText
  productDetails:any = {};
  rate = 4;
  showReviewBox = false;
  page = 0;
infiniteScrollEnd = false

  constructor(private nav: NavController,
    private events: Events,
    private toastCtrl: ToastController,
    public storage: Storage,
    private params: NavParams,
    public userProvider: UserProvider,
    private http: Http) {
    console.log(params)
    this.productDetails = params.data

    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });

    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/review/'+this.productDetails._id+'?page='+this.page)
      .map(res => res.json())
      .subscribe(
      data => {
            this.page = 1 ;
            this.reviews = data
      },
      err => {
            console.log(err._body)
      }
      );

  }

  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/review/'+this.productDetails._id+'?page='+this.page)
      .map(res => res.json())
      .subscribe(
      data => {
      this.page ++ ;
      setTimeout(() => {
      if (Object.keys(data).length == 0) {
        this.infiniteScrollEnd = true
      }
      this.reviews = this.reviews.concat(data)
      infiniteScroll.complete();
      }, 1000);
      },
      err => {
            console.log(err._body)
      }
      );
    } else {
      infiniteScroll.complete();
    }
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

review(){

    var reviewData: any = {}
    var now = new Date()
    if(this.productDetails._id)
    reviewData.discussion_id = this.productDetails._id
    reviewData.parent_id = null
    reviewData.created = now.toUTCString()

    if(this.validation._id)
    var review_id = this.validation._id

    if(this.validation.id)
    var reviewId = this.validation.id

    if(this.validation.nickname)
    var reviewNickname = this.validation.nickname

    if(this.validation.password)
    var reviewPassword = this.validation.password

    reviewData.author = {
      _id: review_id,
      id: reviewId,
      nickname: reviewNickname,
      password: reviewPassword
    }

    if(this.reviewText)
    reviewData.text = this.reviewText
    if(this.rate)
    reviewData.rate = this.rate
    console.log(reviewData)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/review/product', reviewData)
      .map(res => res.json())
      .subscribe(
      data => {
            this.presentToast2()
            this.reviewText = null
            this.showReviewBox = !this.showReviewBox
      },
      err => {
            console.log(err._body)
      }
      );
}

  presentToast2() {
    let toast = this.toastCtrl.create({
      message: 'Reviewed',
      duration: 1000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }


  scrollToTop() {
    this.content.scrollToTop();
  }

  goTop() {
      this.scrollToTop()
//      this.presentToast()
  }

/*  presentToast() {
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
*/
}
