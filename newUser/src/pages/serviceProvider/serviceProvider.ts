/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, } from 'ionic-angular';
import { serviceProviderPop1 } from "./popoverPages/serviceProviderPop1";
import { serviceProviderPop2 } from "./popoverPages/serviceProviderPop2";
import { serviceProviderPop3 } from "./popoverPages/serviceProviderPop3";
import { ServiceProviderGetAllServiceProvidersService } from '../providers/serviceProvider-get-all-serviceProviders-service/serviceProvider-get-all-serviceProviders-service';
import { ServiceProviderDetails } from './serviceProviderDetails/serviceProviderDetails';
import { ServiceProviderLists } from './serviceProviderLists/serviceProviderLists';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../providers/check-login'

@Component({
  selector: "page-ServiceProvider",
  templateUrl: 'serviceProvider.html',
  providers: [ServiceProviderGetAllServiceProvidersService, CheckLogin]
})
export class ServiceProviderPage {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  serviceProviders: any = [];
  alreadyLoggedIn = false;
  validation : any = {};
  public menu1: any = [];
  public menu2: any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  start = 0
  category = "all"
  infiniteScrollEnd = false
  serviceProviderName = undefined

  constructor(private params: NavParams,
    private nav: NavController,
    private events: Events,
    private serviceProviderGetAllServiceProvidersService: ServiceProviderGetAllServiceProvidersService,
    public checkLogin: CheckLogin,
    public popoverCtrl: PopoverController,
    private http: Http) {
    this.events = events;
    this.loadServiceProviders();
    this.checkLogin.load()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });
    this.getMenu();

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

  getMenu() {
    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/getMenu')
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        // alert(data);
        console.log("menu is")
        console.log(data)
        //var flag = data[_body]

        if (data.length > 9) {
          for (var i = 0; i < 5; i++) {
            this.menu1.push(data[i])
            this.menu3.push(data[i])
          }
          for (var i = 5; i < 10; i++) {
            this.menu2.push(data[i])
            this.menu4.push(data[i])
          }

          this.grid.push(this.menu1);
          this.grid.push(this.menu2);
        }
      })
  }

  openServiceProviderListsPage(menuItem){
    this.nav.push(ServiceProviderLists, menuItem);
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
          this.grid=[]
          this.menu1 = [];
          this.menu2 = [];
          this. menu3 = [];
          this. menu4 = [];
          this.getMenu();

          refresher.complete();
        }, 1000);
      }
}
