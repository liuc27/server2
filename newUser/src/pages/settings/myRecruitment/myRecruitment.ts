/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import {UserProvider} from '../../../providers/userProvider'
import {Storage} from '@ionic/storage'
import {ServiceProvider} from '../../../providers/serviceProvider'
import { NewRecruitment } from './newRecruitment/newRecruitment';
import {ModifyMyRecruitment} from'./modifyMyRecruitment/modifyMyRecruitment'

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { defaultURL } from '../../../providers/i18n-demo.constants';


@Component({
  selector: 'page-myRecruitment',
  templateUrl: 'myRecruitment.html',
  providers: [UserProvider, ServiceProvider]
})
export class MyRecruitment {

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
    public userProvider: UserProvider,
    private http: Http,
    public serviceProvider:ServiceProvider,
    public alertCtrl: AlertController
) {

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.serviceProviderValidation = data
        this.alreadyLoggedIn = true;
        this.loadSelectedServiceProviderDetails()
      });
  }


  loadSelectedServiceProviderDetails() {
      this.serviceProvider.get(this.start,null,null,this.serviceProviderValidation.id,'recruitment')
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          if(this.serviceProviderDetails.service){
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
    commentData.created = now.toUTCString()
    if(this.validation.id)
    commentData.id = this.validation.id
    if(this.validation.password)
    commentData.password = this.validation.password
    if(this.comment)
    commentData.text = this.comment
    if(this.rate)
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post(defaultURL+':3000/user/addServiceProviderComment', commentData)
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

  openServiceDetailsPage(service) {
    console.log("detail open");
    console.log(service)
    this.nav.push(ModifyMyRecruitment, service);
  }

  newService(){
    this.nav.push(NewRecruitment);
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
