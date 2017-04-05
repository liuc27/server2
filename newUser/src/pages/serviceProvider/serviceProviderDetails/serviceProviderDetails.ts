/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { serviceProviderDetailsPop1 } from "./popoverPages/serviceProviderDetailsPop1";
import { serviceProviderDetailsPop2 } from "./popoverPages/serviceProviderDetailsPop2";
import { serviceProviderDetailsPop3 } from "./popoverPages/serviceProviderDetailsPop3";
import { ProductDetails } from '../../product/productLists/productDetails/productDetails';
import { CheckLogin } from '../../../providers/check-login'
import { GetServiceProviderCalendar } from '../../../providers/getServiceProviderCalendar'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ProductService } from '../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { Reservation } from './reservation/reservation';
import moment from 'moment';
import { NgCalendarModule  } from 'ionic2-calendar';

//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
  selector: 'page-serviceProviderDetails',
  templateUrl: 'serviceProviderDetails.html',
  providers: [ProductService, CheckLogin, GetServiceProviderCalendar]
})
export class ServiceProviderDetails {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  serviceProvider : any = {
    comment:[],
    likedBy:[]
  };
  serviceProviderDetails : any = [];
  alreadyLoggedIn = false;
  showCommentBox;
  comment;
  rate;
  validation : any = {};

  eventSource = [];
  chatEventSource = [];
  guideEventSource = [];
  eventSourceISO = [];
  chatEventSourceISO = [];
  guideEventSourceISO = [];
  viewTitle;

  isToday: boolean;
  calendar = {
    mode: 'week',
    currentDate: new Date()
  };

  serviceType;
  start = 0


  //    reservationId;

  constructor(private params: NavParams,
    private nav: NavController,
    private popover: PopoverController,
    private events: Events,
    public storage: Storage,
    public checkLogin: CheckLogin,
    public getServiceProviderCalendar: GetServiceProviderCalendar,
    private http: Http,
    public productService: ProductService,
    public reservationService: ProductService,
    public alertCtrl: AlertController) {
    console.log("params.data is")
    console.log(params.data)
    this.events = events;
    this.serviceProvider = params.data
    if (!this.serviceProvider.comment) this.serviceProvider.comment = []


    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider?serviceProviderName='+params.data.serviceProviderName)
    .map(res => res.json())
    .subscribe(serviceProviderData => {
        this.serviceProvider = serviceProviderData
    })

    this.loadSelectedServiceProviderDetails(params.data)

    this.popover = popover;

    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
        console.log(this.serviceProvider.serviceProviderName)
        console.log(this.serviceProvider.serviceProviderPassword)
        this.getServiceProviderCalendar.load(this.serviceProvider.serviceProviderName,this.serviceProvider.serviceProviderPassword)
          .then(data2 => {
          var data3 = []
          console.log(data2)
          data3 = this.changeISOtoDate(data2)

            if (data3[0]) {
            data3.forEach((element, index) => {
              element.title = element.username.length.toString() + "/" +element.userNumberLimit.toString()
            })
              if (data3[0].serviceType === "guide") {
                this.eventSource = [].concat(data3)
                this.guideEventSource = this.eventSource
              } else if (data3[0].serviceType === "chat") {
                this.eventSource = [].concat(data3)
                this.chatEventSource = this.eventSource
              }
            }
          })
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
          serviceProviderName: this.serviceProvider.serviceProviderName,
          username: this.validation.username
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
          serviceProviderName: this.serviceProvider.serviceProviderName,
          username: this.validation.username
        })
      });
      this.eventSource = this.chatEventSource
    });

  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
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
      creatorName: element.creatorName,
      serviceProviderName: element.serviceProviderName,
      username: element.username,
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

  loadSelectedServiceProviderDetails(paramsData) {

  return new Promise(resolve => {
      this.productService.load(this.start,null,paramsData.serviceProviderName)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          if(this.serviceProviderDetails.product){
          this.serviceProviderDetails = this.serviceProviderDetails.concat(data);
          }else {
          this.serviceProviderDetails = [].concat(data);
          }
        resolve(data);

      });

    });


  }



  alreadyLikedServiceProvider(serviceProvider) {
    if(this.validation == undefined){
      return false;
    }else {
    if (this.validation.username == undefined) {
      return false
    } else if (serviceProvider.likedBy.indexOf(this.validation.username) >= 0) {
      // console.log("posessed")
      // console.log(serviceProvider.likedBy.indexOf(validation.username))
      return true
    } else {
      //console.log("not exist")
      return false
    }
    }
  }


  likeServiceProvider(serviceProvider) {
    if (this.validation.username == undefined) {
      alert("login before use,dude")
      this.storage.ready().then(() => {

      this.storage.remove('validation').then((data1) => {
        console.log(data1)
        console.log("data1")
})

      })
    } else {
      var likedServiceProvider = {
        serviceProviderName: serviceProvider.serviceProviderName,
        username: this.validation.username,
        password: this.validation.password
      }
      console.log(serviceProvider.likedBy);

      this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/likeServiceProvider', likedServiceProvider)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          // alert(data);

          console.log(data)
          //var flag = data[_body]

          var flag = data.data
          if (flag == "push") {
            serviceProvider.likedBy.push(this.validation.username);
          } else if (flag == "pull") {

            var index = serviceProvider.likedBy.indexOf(this.validation.username);
            if (index > -1) {
              serviceProvider.likedBy.splice(index, 1);
            }
          }
          console.log(serviceProvider.likedBy);

        });
    }
  }

   alreadyLiked(product) {
         if(this.validation == undefined){
      return false;
    }else {
        if (this.validation.username == undefined) {
            return false
        } else if (product.likedBy.indexOf(this.validation.username) >= 0) {
            // console.log("posessed")
            // console.log(product.likedBy.indexOf(validation.username))
            return true
        } else {
            //console.log("not exist")
            return false
        }
    }
    }


    likeProduct(product) {
      if (this.validation.username) {
        console.log(product)
        var likedProduct = {
          _id: product._id,
          username: this.validation.username,
          password: this.validation.password
        }
        console.log(product.likedBy);

        this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product/likeProduct', likedProduct)
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            // alert(data);

            console.log(data)
            //var flag = data[_body]

            var flag = data.data
            if (flag == "push") {
              product.likedBy.push(this.validation.username);
              this.validation.likedProduct.push(product._id)
              this.checkLogin.updateLikedProduct(this.validation.likedProduct)
            } else if (flag == "pull") {

              var index = product.likedBy.indexOf(this.validation.username);
              if (index > -1) {
                product.likedBy.splice(index, 1);
              }

              var index2 = this.validation.likedProduct.indexOf(product._id);
              if (index2 > -1) {
                this.validation.likedProduct.splice(index2, 1);
              }
              console.log(this.validation)
              this.checkLogin.updateLikedProduct(this.validation.likedProduct)
            }
            console.log(product.likedBy);
          });
      } else {
        alert("login before use,dude")

      }
    }

  presentServiceProviderDetailsPop1Popover(ev) {
    let serviceProviderDetailsPop1Page = this.popover.create(serviceProviderDetailsPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop1Page.present({
      ev: ev
    });
  }

  presentServiceProviderDetailsPop2Popover(ev) {
    let serviceProviderDetailsPop2Page = this.popover.create(serviceProviderDetailsPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop2Page.present({
      ev: ev
    });
  }

  presentServiceProviderDetailsPop3Popover(ev) {
    let serviceProviderDetailsPop3Page = this.popover.create(serviceProviderDetailsPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover");
    serviceProviderDetailsPop3Page.present({
      ev: ev
    });
  }



  sendComment() {
    console.log(this.serviceProvider)
    var commentData: any = {}
    var now = new Date()
    if(this.serviceProvider._id)
    commentData.discussion_id = this.serviceProvider._id
    commentData.parent_id = null
    commentData.posted = now.toUTCString()
    if(this.validation.username)
    commentData.username = this.validation.username
    if(this.validation.password)
    commentData.password = this.validation.password
    if(this.comment)
    commentData.text = this.comment
    if(this.rate)
    commentData.rate = this.rate
    console.log(commentData)
    this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/addServiceProviderComment', commentData)
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(data)
        if(data.data){
            if(data.data == "OK") this.serviceProvider.comment.unshift(commentData);
            else if(data.data == "NO") alert("Please sign in first !")
            this.comment = null
            this.showCommentBox = !this.showCommentBox
        }
      });
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    //console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }

/*
loadEvents() {
  this.eventSource = this.createRandomEvents();
}





  onTimeSelected(ev) {


  }

  createEvents(ev, h: Number) {
    if (h == 999) {
      this.guideEventSource.forEach((elementEvent, index) => {
        console.log(elementEvent.startTime.getTime())
        console.log(ev.selectedTime.getTime())
        if (ev.selectedTime.getTime() == elementEvent.startTime.getTime()) {
          console.log(index)
          this.guideEventSourceISO.splice(index, 1);
          this.guideEventSource.splice(index, 1);
          this.eventSource = [].concat(this.guideEventSource);

          console.log(this.eventSource)
        }
      });
    } else if (h > 24) {
      o.log(daa)
    } else {
      var date = ev.selectedTime;
      var startTime, endTime;
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours());
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + h);
      this.guideEventSource.push({
        title: 'guideReservation',
        serviceType: 'guide',
        startTime: startTime,
        endTime: endTime,
        allDay: false,
        serviceProviderName: this.serviceProvider.serviceProviderName,
        username: this.validation.username
      })
      this.eventSource = [].concat(this.guideEventSource);

      this.guideEventSourceISO.push({
        title: 'guideReservation',
        serviceType: 'guide',
        startTime: moment(startTime).format(),
        endTime: moment(endTime).format(),
        allDay: false,
        serviceProviderName: this.serviceProvider.serviceProviderName,
        username: this.validation.username
      })
      this.eventSourceISO = [].concat(this.guideEventSourceISO);

      this.guideEventSource = this.eventSource;
      this.guideEventSourceISO = this.eventSourceISO
    }
  }

  createCallReservation(ev, option: String) {
    var date = ev.selectedTime;
    var startTime, endTime;
    if (option === "dayTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() - 4);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 10);
    } else if (option === "nightTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() + 10);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 20);
    } else if (option === "fullTime") {
      startTime = new Date(ev.selectedTime.getTime());
      startTime.setHours(startTime.getHours() - 4);
      // startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
      endTime = new Date(ev.selectedTime.getTime());
      endTime.setHours(endTime.getHours() + 20);
    }


    // endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
    this.chatEventSource.push({
      title: 'chatReservation',
      serviceType: 'guide',
      startTime: startTime,
      endTime: endTime,
      allDay: false,
      serviceProviderName: this.serviceProvider.serviceProviderName,
      username: this.validation.username
    })
    this.eventSource = [].concat(this.chatEventSource);

    this.chatEventSourceISO.push({
      title: 'chatReservation',
      serviceType: 'guide',
      startTime: moment(startTime).format(),
      endTime: moment(endTime).format(),
      allDay: false,
      serviceProviderName: this.serviceProvider.serviceProviderName,
      username: this.validation.username
    })



    this.eventSourceISO = [].concat(this.chatEventSourceISO);

    this.chatEventSource = this.eventSource;
    this.chatEventSourceISO = this.eventSourceISO
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
  }


  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }

*/


  selectedChat() {
    this.eventSource = this.chatEventSource
    this.eventSourceISO = this.chatEventSourceISO
    this.calendar.mode = "month"
    this.serviceType = "chat"
  }

  selectedGuide() {
    this.eventSource = this.guideEventSource
    this.eventSourceISO = this.guideEventSourceISO
    this.calendar.mode = "week"
    this.serviceType = "guide"
  }

  enterReservation() {
    this.nav.push(Reservation, { serviceProvider: this.serviceProvider, serviceType: this.serviceType });
  }

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails, { product: product });
  }

  doRefresh(refresher) {
    console.log('Begin load', refresher);

    setTimeout(() => {
      console.log('Async loading has ended');
      this.loadSelectedServiceProviderDetails(this.serviceProvider)

      refresher.complete();
    }, 1000);
  }
}
