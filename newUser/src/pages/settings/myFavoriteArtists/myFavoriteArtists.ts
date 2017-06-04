/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ServiceDetails } from '../../service/serviceLists/serviceDetails/serviceDetails';
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { UserProvider } from '../../../providers/userProvider'
import { FavoriteProvider } from '../../../providers/favoriteProvider'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment from 'moment';
import { Storage } from '@ionic/storage'

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
    public storage: Storage,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private alertCtrl:AlertController,
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
        var likedService: any = {};

        console.log(data)
        likedService = data;
        console.log(likedService)
        likedService.skip = this.start;
        likedService.limit = this.limit

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
  alreadyLikedServiceProvider(serviceProvider) {
    if (this.validation  ) {
    if(serviceProvider.id && this.validation.likedServiceProvider){
      if (this.validation.likedServiceProvider.indexOf(serviceProvider.id) >= 0) {
        console.log(this.validation.likedServiceProvider.indexOf(serviceProvider.id))
        return true
      }
      }
    }
    return false
  }

  favoriteServiceProvider(serviceProvider) {
      if (this.validation.id == undefined) {
          this.presentAlert()
          this.storage.ready().then(() => {

              this.storage.remove('validation').then((data1) => {
                  console.log(data1)
                  console.log("removed")
              })

          })
      } else {
          var likedServiceProvider = {
              serviceProviderId: serviceProvider.id,
              id: this.validation.id,
              password: this.validation.password
          }
          console.log(serviceProvider.likedBy);

          this.favoriteProvider.postServiceProvider(likedServiceProvider).then(data => {

          var flag = data
          if(!this.validation.likedServiceProvider) this.validation.likedServiceProvider = []
          if (flag == "push") {
              this.validation.likedServiceProvider.push(serviceProvider.id);
          } else if (flag == "pull") {
              var index = this.validation.likedServiceProvider.indexOf(serviceProvider.id);
              if (index > -1) {
                  this.validation.likedServiceProvider.splice(index, 1);
              }
          }

          this.userProvider.saveLocalStorage(this.validation)
          console.log(this.validation.likedServiceProvider);
          })
      }
  }

  presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Please login first!',
    subTitle: '',
    buttons: ['OK']
  });
  setTimeout(() => {
    this.alreadyLoggedIn = true;
  }, 50);
  alert.present();
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
