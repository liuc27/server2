/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController, Content,ToastController } from 'ionic-angular';
import { serviceProviderDetailsPop1 } from "./popoverPages/serviceProviderDetailsPop1";
import { serviceProviderDetailsPop2 } from "./popoverPages/serviceProviderDetailsPop2";
import { serviceProviderDetailsPop3 } from "./popoverPages/serviceProviderDetailsPop3";
import { ServiceProviderReview } from "./serviceProviderReview/serviceProviderReview";
import { ServiceProviderCertificate } from "./serviceProviderCertificate/serviceProviderCertificate";
import { ServiceDetails } from '../../service/serviceLists/serviceDetails/serviceDetails';
import { UserProvider } from '../../../providers/userProvider'
import { FavoriteProvider } from '../../../providers/favoriteProvider'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ServiceProvider } from '../../../providers/serviceProvider';
import { Reservation } from './reservation/reservation';
import moment from 'moment';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';
import { defaultURL } from '../../../providers/i18n-demo.constants';

@Component({
  selector: 'page-serviceProviderDetails',
  templateUrl: 'serviceProviderDetails.html',
  providers: [ServiceProvider, UserProvider, FavoriteProvider]
})
export class ServiceProviderDetails {
  @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Content) content: Content;

  theServiceProvider : any = {
    review:[],
    likedBy:[]
  };
  serviceProviderDetails : any = [];
  alreadyLoggedIn = false;
  validation : any = {};

  eventSource = [];
  chatEventSource = [];
  guideEventSource = [];
  eventSourceISO = [];
  chatEventSourceISO = [];
  guideEventSourceISO = [];
  viewTitle;

  isToday: boolean;


  serviceType;
  start = 0;
  serviceProviderId;
  certificates

  //    reservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    private http: Http,
    public userProvider: UserProvider,
    public serviceProvider: ServiceProvider,
    public favoriteProvider: FavoriteProvider,
    public reservationService: ServiceProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    console.log("params.data is")
    console.log(params.data)

      this.serviceProviderId = params.data.id
      console.log(params.data.id)

    this.events = events;
    if(!params.data.likedBy){
      params.data.likedBy = []
    }
    this.theServiceProvider = params.data


    this.http.get(defaultURL+':3000/user/'+this.serviceProviderId)
    .map(res => res.json())
    .subscribe(serviceProviderData => {
        this.theServiceProvider = serviceProviderData
        if(serviceProviderData.certificates){
          this.certificates = serviceProviderData.certificates
        }
        console.log(this.theServiceProvider)
    })

    this.loadSelectedServiceProviderDetails()

    this.popover = popover;

    this.userProvider.loadLocalStorage()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
        console.log(this.theServiceProvider.id)
      });

    this.serviceType = "guide"

    events.subscribe('guide', (data) => {
      console.log('Welcome');
      console.log(data)
      this.guideEventSource = []

      data.forEach((element, index) => {
        this.guideEventSource.push({
          title: 'guideReservation',
          serviceType: 'guide',
          startTime: new Date(element.startTime),
          endTime: new Date(element.endTime),
          allDay: false,
          serviceProviderId: this.theServiceProvider.id,
          id: this.validation.id
        })
      });
      this.eventSource = this.guideEventSource
    });

    events.subscribe('chat', (data) => {
      console.log('chat');
      this.chatEventSource = []

      data.forEach((element, index) => {
        this.chatEventSource.push({
          title: 'chatReservation',
          serviceType: 'chat',
          startTime: new Date(element.startTime),
          endTime: new Date(element.endTime),
          allDay: false,
          serviceProviderId: this.theServiceProvider.id,
          id: this.validation.id
        })
      });
      this.eventSource = this.chatEventSource
    });

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
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

  changeISOtoDate(data2){
  var data3 = [];
  data2.forEach((element, index) => {
    data3.push({
      _id: element._id,
      title: element.title,
      serviceType: element.serviceType,
      startTime: moment(element.startTime).toDate(),
      endTime: moment(element.endTime).toDate(),
      allDay: element.allDay,
      creator: element.creator,
      serviceProvider: element.serviceProvider,
      id: element.id,
      serviceProviderNumberLimit: element.serviceProviderNumberLimit,
      userNumberLimit: element.userNumberLimit,
      repeat: element.repeat,
      pricePerHour: element.pricePerHour,
      action: element.action,
      price: element.price
    });
    })
    return data3;
  }

  loadSelectedServiceProviderDetails() {

  return new Promise(resolve => {
      this.serviceProvider.get(this.start,null,null,this.serviceProviderId)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
        this.serviceProviderDetails = this.serviceProviderDetails.concat(data);

        resolve(data);

      });

    });


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
          this.presentAlert("Please login first!")
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
          service.likedBy.push(this.validation.id);
          this.validation.likedService.push(service._id)
        } else if (flag == "pull") {

          var index = service.likedBy.indexOf(this.validation.id);
          if (index > -1) {
            service.likedBy.splice(index, 1);
          }

          var index2 = this.validation.likedService.indexOf(service._id);
          if (index2 > -1) {
            this.validation.likedService.splice(index2, 1);
          }
          console.log(this.validation)
        }
        this.userProvider.saveLocalStorage(this.validation)
        console.log(service.likedBy);
        })
      } else {
        this.presentAlert("Please login first!")
      }
    }

  presentServiceProviderDetailsPop1Popover(ev) {
    let serviceProviderDetailsPop1Page = this.popover.create(serviceProviderDetailsPop1, {
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop1Page.present({
      ev: ev
    });
  }

  presentServiceProviderDetailsPop2Popover(ev) {
    let serviceProviderDetailsPop2Page = this.popover.create(serviceProviderDetailsPop2, {
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop2Page.present({
      ev: ev
    });
  }

  presentServiceProviderDetailsPop3Popover(ev) {
    let serviceProviderDetailsPop3Page = this.popover.create(serviceProviderDetailsPop3, {
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop3Page.present({
      ev: ev
    });
  }

openServiceProviderReviewPage(){
  if(this.validation){
    if(this.validation.id&&this.validation.password&&this.validation.nickname){
      this.nav.push(ServiceProviderReview, {
      nickname: this.theServiceProvider.nickname,
      _id:this.theServiceProvider._id});
    }else{
    this.presentAlert("Please login first!")
    }
  }else{
  this.presentAlert("Please login first!")
  }
}

openServiceProviderCertificate(certificate){
  this.nav.push(ServiceProviderCertificate, certificate);

}

  enterReservation() {
    this.nav.push(Reservation, { serviceProvider: this.theServiceProvider, serviceType: this.serviceType });
  }

  openServiceDetailsPage(service) {
    console.log("detail open");
    this.nav.push(ServiceDetails, service);
  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedServiceProviderDetails()

      refresher.complete();
    }, 1000);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  goTop() {
      this.scrollToTop()
      //this.presentToast()
  }

/*  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Refreshing...',
      duration: 1000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }*/
}
