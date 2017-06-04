/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, Content,ToastController, AlertController} from 'ionic-angular';
import { serviceProviderPop1 } from "./popoverPages/serviceProviderPop1";
import { serviceProviderPop2 } from "./popoverPages/serviceProviderPop2";
import { serviceProviderPop3 } from "./popoverPages/serviceProviderPop3";
import { ServiceProviderDetails } from './serviceProviderDetails/serviceProviderDetails';
import { ServiceProviderLists } from './serviceProviderLists/serviceProviderLists';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../providers/userProvider'
import { FavoriteProvider } from '../../providers/favoriteProvider'

@Component({
    selector: "page-ServiceProvider",
    templateUrl: 'serviceProvider.html',
    providers: [UserProvider, FavoriteProvider]
})
export class ServiceProviderPage {
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
    category = null
    infiniteScrollEnd = false
    id = undefined
    certificates = []
    menu

    constructor(private params: NavParams,
        private nav: NavController,
        private events: Events,
        public storage: Storage,
        private userProvider: UserProvider,
        public favoriteProvider: FavoriteProvider,
        public popoverCtrl: PopoverController,
        private toastCtrl: ToastController,
        private alertCtrl:AlertController,
        private translate: TranslateService,
        private http: Http) {
        this.userProvider.loadLocalStorage()
            .then(data => {
                this.validation = data
                this.alreadyLoggedIn = true;
            });
        this.loadServiceProviders();

        this.getMenu();

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

    loadServiceProviders() {
        return new Promise(resolve => {
            console.log(this.start)
            this.userProvider.get(this.start, this.category, null, "candidatePro")
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


    presentServiceProviderPop1Popover(ev) {
        let serviceProviderPop1Page = this.popoverCtrl.create(serviceProviderPop1, {
            popContentEle: this.popContent.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentthis.popoverCtrl");
        serviceProviderPop1Page.present({
            ev: ev
        });
    }

    presentServiceProviderPop2Popover(ev) {
        let serviceProviderPop2Page = this.popoverCtrl.create(serviceProviderPop2, {
            popContentEle: this.popContent.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentthis.popoverCtrl");
        serviceProviderPop2Page.present({
            ev: ev
        });
    }

    presentServiceProviderPop3Popover(ev) {
        let serviceProviderPop3Page = this.popoverCtrl.create(serviceProviderPop3, {
            popContentEle: this.popContent.nativeElement,
            textEle: this.text.nativeElement
        });

        console.log("presentthis.popoverCtrl");
        serviceProviderPop3Page.present({
            ev: ev
        });
    }

    getMenu() {

        this.userProvider.getMenu().then(data => {

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

            })
    }

    translateMenu(menuItemName){
      let returnData = menuItemName ;
      this.translate.get(menuItemName).subscribe(response => {
        returnData = response
      })
      return returnData
    }

    openServiceProviderListsPage(menuItem) {
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
        setTimeout(() => {
            console.log('Async operation wont trigger');
            infiniteScroll.complete();
        }, 1000);
        }
    }

    doRefresh(refresher) {
        console.log('Begin load', refresher);

        setTimeout(() => {
            console.log('Async loading has ended');
            this.serviceProviders = []
            this.start = 0
            this.loadServiceProviders();
            this.grid = []
            this.menu1 = [];
            this.menu2 = [];
            this.menu3 = [];
            this.menu4 = [];
            this.getMenu();

            refresher.complete();
        }, 2000);
    }

    scrollToTop() {
      this.content.scrollToTop();
    }

    goTop() {
        this.scrollToTop()
        /*

        this.presentToast()
        setTimeout(() => {
            this.serviceProviders = []
            this.start = 0
            this.loadServiceProviders();
            this.grid = []
            this.menu1 = [];
            this.menu2 = [];
            this.menu3 = [];
            this.menu4 = [];
            this.getMenu();
        }, 500);
        */
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
