/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ProductDetails } from '../../product/productLists/productDetails/productDetails';
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { UserProvider } from '../../../providers/userProvider'
import { FavoriteProvider } from '../../../providers/favoriteProvider'
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
  selector: 'page-myFavoriteArtists',
  templateUrl: 'myFavoriteArtists.html',
  providers: [UserProvider, FavoriteProvider]
})
export class MyFavoriteArtists {
  id: String;
  password: String;
  alreadyLoggedIn = false;
  serviceProviders: any = [];
  validation: any = {};
  start = 0;
  limit = 20;
  infiniteScrollEnd = false

  constructor(private nav: NavController,
    private events: Events,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private http: Http) {
    this.loadServiceProviders()
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }


  loadServiceProviders() {
  return new Promise(resolve => {


    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
        var likedProduct: any = {};

        console.log(data)
        likedProduct = data;
        console.log(likedProduct)
        likedProduct.skip = this.start;
        likedProduct.limit = this.limit

        this.favoriteProvider.getServiceProviders(this.validation.id).then(data => {
         this.serviceProviders = data;
        })
        console.log(this.serviceProviders)

      })

  });
  }

  openServiceProviderDetailsPage(serviceProvider) {
    console.log(serviceProvider);
    serviceProvider.from = "serviceProviderPage"
    this.nav.push(ServiceProviderDetails, serviceProvider);
  }


  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
      console.log('doInfinite, start is currently ' + this.start);
      this.start += 20;

      this.loadServiceProviders().then((data) => {
        setTimeout(() => {
          console.log('Async operation has ended');
          infiniteScroll.complete();
          if (Object.keys(data).length == 0) {
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
