/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, Content,ToastController, AlertController } from 'ionic-angular';

import { ServiceProviderDetails } from '../../serviceProviderDetails/serviceProviderDetails';

import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../../../providers/userProvider'
import { FavoriteProvider } from '../../../../providers/favoriteProvider'
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
    selector: "page-serviceProviderSublists",
    templateUrl: 'serviceProviderSublists.html',
    providers: [UserProvider, FavoriteProvider]
})
export class ServiceProviderSublists {
    @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
    @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
    @ViewChild(Content) content: Content;

    serviceProviders: any = [];
    alreadyLoggedIn = false;
    validation: any = {};
    public menu1: any = [];
    public menu2: any = [];
    public menu3 = [];
    public menu4 = [];
    public grid = [];
    start = 0
    category = "all"
    infiniteScrollEnd = false
    title
    serviceProviderId = undefined
    parameters

    constructor(private params: NavParams,
        private nav: NavController,
        private events: Events,
        public storage: Storage,
        private userProvider: UserProvider,
        private favoriteProvider: FavoriteProvider,
        public popoverCtrl: PopoverController,
        private toastCtrl: ToastController,
        private alertCtrl:AlertController,
        private translate: TranslateService,
        private http: Http) {
        this.parameters = params.data
        this.title = this.params.data.name;
        this.category = this.params.data.category;
        this.events = events;
        this.loadServiceProviders();

        this.userProvider.loadLocalStorage()
            .then(data => {
                this.validation = data
                this.alreadyLoggedIn = true;
            });
    }

    ionViewWillEnter() {
        this.userProvider.loadLocalStorage()
            .then(data => {
                this.validation = data
                this.alreadyLoggedIn = true;
            });
        console.log("send showTabs event")
        this.events.publish('showTabs');
    }

    translateMenu(menuItemName){
      let returnData = menuItemName ;
      this.translate.get(menuItemName).subscribe(response => {
        returnData = response
      })
      return returnData
    }

    getMenu(data) {
                    for (var i = 0; i < 5; i++) {
                        this.menu1.push(data[i])
                    }
                    this.grid.push(this.menu1);
    }

    loadServiceProviders() {
        return new Promise(resolve => {
            console.log(this.start)
            this.userProvider.get(this.start,this.parameters.name,this.parameters.sub,"candidatePro")
                .then(data => {
                    console.log("data")
                    console.log(data)
                    if (Object.keys(data).length == 0) {
                        this.start -= 20
                    }
                    this.serviceProviders = this.serviceProviders.concat(data)
                    this.serviceProviders.forEach((serviceProviderElement,index)=>{
                    if(serviceProviderElement.certificates){
                    if(serviceProviderElement.certificates.length>0){
                    this.serviceProviders[index].certificateArray = []
                    this.serviceProviders[index].certificates.forEach((certificateElement,certificateIndex) => {
                      this.serviceProviders[index].certificateArray.push(certificateElement.id)
                    })
                    }
                    }
                    })

                    resolve(true);
                });
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

    favoriteServiceProvider(serviceProvider) {
        if (this.validation.id == undefined) {
            this.presentAlert()
            this.storage.ready().then(() => {

                this.storage.remove('validation').then((data1) => {
                    console.log(data1)
                    console.log("data1")
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

    scrollToTop() {
      this.content.scrollToTop();
    }

    goTop() {
        this.scrollToTop()
        this.presentToast()
        setTimeout(() => {
            this.serviceProviders = []
            this.start = 0
            this.loadServiceProviders();
        }, 500);
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

    presentToast() {
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
}
