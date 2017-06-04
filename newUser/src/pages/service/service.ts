import { Component, ViewChild } from '@angular/core';
import { Platform, Events, ActionSheetController, NavController, Content,ToastController, AlertController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/serviceProvider';
import { ServiceLists } from './serviceLists/serviceLists';
import { ServiceDetails } from './serviceLists/serviceDetails/serviceDetails';
import { ServiceProviderDetails } from '../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { FavoriteProvider } from '../../providers/favoriteProvider'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { defaultURL } from '../../providers/i18n-demo.constants';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../providers/userProvider'
import { Storage } from '@ionic/storage'


@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
  providers: [ServiceProvider, UserProvider, FavoriteProvider]
})
export class ServicePage {
@ViewChild(Content) content: Content;

  public services: any = [];
  //public service: any;
  public menu1: any = [];
  public menu2: any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  start = 0
  point;
  category = null;
  infiniteScrollEnd = false
  alreadyLoggedIn = false;
  validation: any = {};
  BC;
  constructor(private nav: NavController,
    private actionSheet: ActionSheetController,
    public serviceProvider: ServiceProvider,
    private events: Events,
    public platform: Platform,
    public storage: Storage,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private http: Http) {
    this.actionSheet = actionSheet;
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
    this.getMenu();

    setTimeout(() => {
          this.loadServices();
    }, 50);


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

  loadServices() {

    return new Promise(resolve => {

      this.serviceProvider.get(this.start, this.category, null, null)
        .then(data => {
          console.log("data")
          console.log(data)
          if (Object.keys(data).length == 0) {
            this.start -= 20
          }
          this.services = this.services.concat(data);


          resolve(data);

        });

    });


  }


  translateMenu(menuItemName){
    let returnData = menuItemName ;
    this.translate.get(menuItemName).subscribe(response => {
      returnData = response
    })
    return returnData
  }

  getMenu() {

      this.userProvider.getMenu().then(data => {
        console.log("menu is")
        console.log(data)
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

  openMenu() {
    let actionSheet = this.actionSheet.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            alert("we will soon add this function")
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
            alert("we will soon add this function")
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            console.log('Play clicked');
            alert("we will soon add this function")
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
            alert("we will soon add this function")
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
            alert("we will soon add this function")
          }
        }
      ]
    });

    actionSheet.present();

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
      this.presentAlert()

    }
  }

  openServiceListsPage(menuItem) {
    console.log(menuItem)
    this.nav.push(ServiceLists, menuItem);
  }

  openServiceDetailsPage(service) {
    this.nav.push(ServiceDetails, service);
  }

  openServiceProviderDetailsPage(service) {
    service.from = "servicePage"
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
      this.grid=[]
      this.menu1 = [];
      this.menu2 = [];
      this. menu3 = [];
      this. menu4 = [];
      this.getMenu()
      refresher.complete();
    }, 2000);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  goTop() {

      this.scrollToTop()
/*      this.presentToast()

      setTimeout(() => {
          this.services = []
          this.start = 0
          this.loadServices();
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
