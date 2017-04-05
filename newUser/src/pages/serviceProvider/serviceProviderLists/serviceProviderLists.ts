/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, } from 'ionic-angular';
import { serviceProviderPop1 } from "../popoverPages/serviceProviderPop1";
import { serviceProviderPop2 } from "../popoverPages/serviceProviderPop2";
import { serviceProviderPop3 } from "../popoverPages/serviceProviderPop3";
import { ServiceProviderGetAllServiceProvidersService } from '../../providers/serviceProvider-get-all-serviceProviders-service/serviceProvider-get-all-serviceProviders-service';
import { ServiceProviderDetails } from '../serviceProviderDetails/serviceProviderDetails';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../../providers/check-login'

@Component({
  selector: "page-serviceProviderLists",
  templateUrl: 'serviceProviderLists.html',
  providers: [ServiceProviderGetAllServiceProvidersService, CheckLogin]
})
export class ServiceProviderLists {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  serviceProviders: any = [];
  alreadyLoggedIn = false;
  validation : any = {};
  start = 0
  category = "all"
  infiniteScrollEnd = false
  title
  serviceProviderName = undefined

  constructor(private params: NavParams,
    private nav: NavController,
    private events: Events,
    private serviceProviderGetAllServiceProvidersService: ServiceProviderGetAllServiceProvidersService,
    public checkLogin: CheckLogin,
    public popoverCtrl: PopoverController,
    private http: Http) {
    this.title = this.params.data.name;
    this.category = this.params.data.category;
    this.events = events;
    this.loadServiceProviders();
    this.checkLogin.load()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });
  }

  ionViewWillEnter() {
    this.checkLogin.load()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });
    console.log("send showTabs event")
    this.events.publish('showTabs');
  }

  loadServiceProviders() {
      return new Promise(resolve => {
      console.log(this.start)
          this.serviceProviderGetAllServiceProvidersService.load(this.start,this.category,null)
          .then(data => {
            console.log("data")
            console.log(data)
            if(Object.keys(data).length==0){
            this.start-=20
            }
            this.serviceProviders = this.serviceProviders.concat(data)
            resolve(true);
          });
        });
  }

  openServiceProviderDetailsPage(serviceProvider) {
    console.log(serviceProvider);
    serviceProvider.from = "serviceProviderPage"
    this.nav.push(ServiceProviderDetails, serviceProvider);
  }
  presentServiceProviderPop1Popover(ev) {
    let serviceProviderPop1Page = this.popoverCtrl.create(serviceProviderPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(serviceProviderPop1Page, {
      ev: ev
    });
  }

  presentServiceProviderPop2Popover(ev) {
    let serviceProviderPop2Page = this.popoverCtrl.create(serviceProviderPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(serviceProviderPop2Page, {
      ev: ev
    });
  }

  presentServiceProviderPop3Popover(ev) {
    let serviceProviderPop3Page = this.popoverCtrl.create(serviceProviderPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentthis.popoverCtrl");
    this.nav.push(serviceProviderPop3Page, {
      ev: ev
    });
  }

  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
      console.log('doInfinite, start is currently ' + this.start);
      this.start += 20;

      this.loadServiceProviders().then(data => {
        setTimeout(() => {
          console.log('Async operation has ended');
          infiniteScroll.complete();
          if (Object.keys(data).length == 0) {
            console.log("true")
            this.infiniteScrollEnd = true
          }
        }, 1000);
      });
    } else {
      infiniteScroll.complete();
    }
  }

      doRefresh(refresher) {
        console.log('Begin load', refresher);

        setTimeout(() => {
          console.log('Async loading has ended');
          this.serviceProviders = []
          this.start = 0
          this.loadServiceProviders();

          refresher.complete();
        }, 1000);
      }
}
