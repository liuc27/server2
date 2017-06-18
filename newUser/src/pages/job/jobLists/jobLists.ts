/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, ModalController, Content,ToastController, AlertController } from 'ionic-angular';
import { JobSublists } from './jobSublists/jobSublists';
import { JobDetails } from './jobDetails/jobDetails';
import { JobOfferDetails } from '../../jobOffer/jobOfferDetails/jobOfferDetails';
import { ServiceProvider } from '../../../providers/serviceProvider';
import { UserProvider } from '../../../providers/userProvider'
import { FavoriteProvider } from '../../../providers/favoriteProvider'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-jobLists',
  templateUrl: 'jobLists.html',
  providers: [ServiceProvider, UserProvider,FavoriteProvider]
})
export class JobLists {
  @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Content) content: Content;

  serviceType = 'recruitment'
//  serviceProvider;
  category;
  title
  serviceOrServiceProvider;
  services:any = [];
  public menu1: any = [];
  public menu2: any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  service:any;
  start = 0
  mySlideOptions = {
    autoplay: 3500,
    loop: true,
    speed: 450
  };
  alreadyLoggedIn = false;
  validation : any = {};
  searchFilter = {
    pickUp: false,
    callSupport: false,
    student: false,
    male: false,
    female: false,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000 * 3).toISOString()
  }
  infiniteScrollEnd = false

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    public modalCtrl: ModalController,
    private events: Events,
    private http: Http,
    public storage: Storage,
    public userProvider: UserProvider,
    public serviceProvider: ServiceProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public favoriteProvider: FavoriteProvider) {
    this.category = params.data.category;
    this.serviceOrServiceProvider = "service";
    console.log("params.data");
        console.log(params.data);
        console.log(this.category)
    this.title = params.data.name

    if(this.params.data.sub){
      if(this.params.data.sub.length>0)
      this.getMenu(this.params.data.sub)
    }
    console.log(this.grid)
    this.loadServices();
    this.popover = popover;
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }

  translateMenu(menuItemName){
    let returnData = menuItemName ;
    this.translate.get(menuItemName).subscribe(response => {
      returnData = response
    })
    return returnData
  }
  getMenu(data) {
                  for (var i = 0; i < data.length; i++) {
                      this.menu1.push(data[i])
                  }
                  this.grid.push(this.menu1);
  }

  loadServices() {
  return new Promise(resolve => {
      this.serviceProvider.get(this.start,this.category,null,null,this.serviceType)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          this.services = this.services.concat(data);
        resolve(true);
      });
    });
    }


  openJobSublistsPage(menuItem){
  console.log("menuItem")

   console.log(menuItem)
   this.nav.push(JobSublists, {name:this.params.data.category,sub:menuItem.category});
  }

  openJobDetailsPage(service) {
    console.log("detail open");
    this.nav.push(JobDetails, service);
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

  openJobOfferDetailsPage(service) {
            service.from = "serviceListPage"
            this.nav.push(JobOfferDetails, service.serviceProvider);
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

   scrollToTop() {
     this.content.scrollToTop();
   }

   goTop() {
       this.scrollToTop()
       this.presentToast()

       setTimeout(() => {
           this.services = []
           this.start = 0
           this.loadServices()
       }, 500);
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
