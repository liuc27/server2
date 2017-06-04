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

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-myFavorites',
  templateUrl: 'myFavorites.html',
  providers: [UserProvider, FavoriteProvider]
})
export class MyFavorites {
  id: String;
  password: String;
  alreadyLoggedIn = false;
  services: any = [];
  validation: any = {};
  start = 0;
  limit = 20;
  infiniteScrollEnd = false

  constructor(private nav: NavController,
    private events: Events,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private alertCtrl: AlertController,
    private http: Http) {
    this.loadServices()
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  openServiceDetailsPage(service) {
    console.log("detail open");
    this.nav.push(ServiceDetails,  service );
  }




    alreadyLiked(service) {
      if (this.validation  ) {
      if(service._id && this.validation.likedService){
        if (this.validation.likedService.indexOf(service._id) >= 0) {
          return true
        }
        }
      }
      return false
    }


    favoriteService(service) {
      if (this.validation.id) {
        console.log(service)
        var theService = {
          _id: service._id,
          id: this.validation.id,
          password: this.validation.password
        }
        console.log(service.likedBy);

        this.favoriteProvider.postService(theService).then(data => {
        var flag = data
        if (flag == "push") {
        if(!service.likedBy) service.likedBy=[]
         service.likedBy.push(this.validation.id);
        if(!this.validation.likedService) this.validation.likedService=[]
        this.validation.likedService.push(service._id)
        } else if (flag == "pull") {
          if(service.likedBy){
            var index = service.likedBy.indexOf(this.validation.id);
            if (index > -1) {
              service.likedBy.splice(index, 1);
            }
        }

        if(this.validation.likedService){
          var index2 = this.validation.likedService.indexOf(service._id);
          if (index2 > -1) {
            this.validation.likedService.splice(index2, 1);
          }
          console.log(this.validation)
          }
        }
        this.userProvider.saveLocalStorage(this.validation)
        console.log(service.likedBy);
        })
      } else {
      this.presentAlert("Login first please!")

      }
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

  openServiceProviderDetailsPage(service) {
    service.from = "myFavoriteServicePage"
    this.nav.push(ServiceProviderDetails, service.serviceProvider);
  }

  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
      console.log('doInfinite, start is currently ' + this.start);
      this.start += 20;

      this.loadServices().then(data => {
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
      this.services = []
      this.start = 0
      this.loadServices();

      refresher.complete();
    }, 1000);
  }

  loadServices() {

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

          this.favoriteProvider.getServices(this.validation.id).then(data => {
             this.services = data;
          })
          console.log(this.services)

        })

    });
  }

}
