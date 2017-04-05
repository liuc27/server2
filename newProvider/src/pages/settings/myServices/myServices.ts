/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import {MyProducts} from '../../../providers/myProducts';
import {CheckLogin} from '../../../providers/check-login'
import {Storage} from '@ionic/storage'
import {ModifyMyServices} from'./modifyMyServices/modifyMyServices'
import {UpdateModifySelfPage} from'./update-modify-self/update-modify-self'
import {ProductService} from '../../../providers/product-getAllProducts-service'

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-myServices',
  templateUrl: 'myServices.html',
  providers: [MyProducts, CheckLogin, ProductService]
})
export class MyServices {

  serviceProviderValidation : any = {};
  serviceProviderDetails : any = [];
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  validation : any = {};
  isToday: boolean;
  start = 0


  //    reservationId;

  constructor(private nav: NavController,
    private events: Events,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http,
    public myProducts: MyProducts,
    public productService:ProductService,
    public alertCtrl: AlertController) {
    //this.loadSelectedServiceProviderDetails()
  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
    this.checkLogin.load()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
        this.loadSelectedServiceProviderDetails()
      });
  }


  loadSelectedServiceProviderDetails() {
      this.productService.load(this.start,null,this.serviceProviderValidation.serviceProviderName)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          if(this.serviceProviderDetails.product){
          this.serviceProviderDetails = this.serviceProviderDetails.concat(data);
          }else {
          this.serviceProviderDetails = [].concat(data);
          }
        return (data);

      });

  }

/*
  sendComment() {
    var commentData: any = {}
    var now = new Date()
    if(this.serviceProviderValidation._id)
    commentData.discussion_id = this.serviceProviderValidation._id
    commentData.parent_id = null
    commentData.posted = now.toUTCString()
    if(this.validation.username)
    commentData.username = this.validation.username
    if(this.validation.password)
    commentData.password = this.validation.password
    if(this.comment)
    commentData.text = this.comment
    if(this.rate)
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/addServiceProviderComment', commentData)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(data)
        if(data.data){
            if(data.data == "OK") this.serviceProviderValidation.comment.unshift(commentData);
            else if(data.data == "NO") alert("Please sign in first !")
            this.comment = null
            this.showCommentBox = !this.showCommentBox
        }
      });
  }
*/

  openProductDetailsPage(product) {
    console.log("detail open");
    console.log(product)
    this.nav.push(ModifyMyServices, product);
  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedServiceProviderDetails()

      refresher.complete();
    }, 1000);
  }
}
