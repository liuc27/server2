/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, ToastController, Content } from 'ionic-angular';
import { UserProvider } from '../../../../providers/userProvider'
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

import { defaultURL } from '../../../../providers/i18n-demo.constants';

@Component({
  selector: 'page-serviceProviderReview',
  templateUrl: 'serviceProviderReview.html',
  providers: [UserProvider]
})
export class ServiceProviderReview {
@ViewChild('Select') selectComp;
@ViewChild(Content) content: Content;


  id: String;
  password: String;
  alreadyLoggedIn = false ;
  validation:any = {};
  reviews:any = []
  reviewText
  serviceProvider:any = {};
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
    this.serviceProvider = params.data


  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });

    this.http.get(defaultURL+':3000/review/'+this.serviceProvider._id+'?page='+this.page)
      .map(res => res.json())
      .subscribe(
      data => {
            this.page++
            this.reviews = data
      },
      err => {
            console.log(err._body)
      }
      );
  }
  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
    this.http.get(defaultURL+':3000/review/'+this.serviceProvider._id+'?page='+this.page)
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
review(){

    var reviewData: any = {}
    var now = new Date()
    if(this.serviceProvider._id)
    reviewData.discussion_id = this.serviceProvider._id
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
    this.http.post(defaultURL+':3000/review/user', reviewData)
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
