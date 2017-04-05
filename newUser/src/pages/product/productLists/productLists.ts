/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { ProductListsPop1 } from "./popoverPages/productListsPop1";
import { ProductListsPop2 } from "./popoverPages/productListsPop2";
import { ProductListsPop3 } from "./popoverPages/productListsPop3";
import { ProductDetails } from './productDetails/productDetails';
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { ModalContentPage } from "./modalPages/modalContent";
import { ProductService } from '../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { CheckLogin } from '../../../providers/check-login'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-productLists',
  templateUrl: 'productLists.html',
  providers: [ProductService, CheckLogin]
})
export class ProductLists {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  serviceProvider;
  category;
  title
  productOrServiceProvider;
  products:any = [];
  product:any;
  start = 0
  grid = [
    {},
    {},
  ];
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
    public checkLogin: CheckLogin,
    public productService: ProductService) {
    this.category = params.data.category;
    this.productOrServiceProvider = "product";
    console.log("params.data");
        console.log(params.data);
        console.log(this.category)
    this.title = params.data.name
    this.loadProducts();
    this.popover = popover;
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }

  ionViewWillEnter() {
    // console.log("send hideTabs event")
    // this.events.publish('hideTabs');
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalContentPage, this.searchFilter);

    modal.onDidDismiss(data => {
      console.log(data);
      this.searchFilter = data;
    });
    modal.present();
  }

  loadProducts() {
  return new Promise(resolve => {
      this.productService.load(this.start,this.category,null)
      .then(data => {
        console.log("data")
        console.log(data)
        if(Object.keys(data).length==0){
          this.start-=20
        }
          this.products = this.products.concat(data);
        resolve(true);
      });
    });
    }

  presentProductListsPop1Popover(ev) {
    let productListsPop1 = this.popover.create(ProductListsPop1, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover1");
    productListsPop1.present({
      ev: ev
    });
  }

  presentProductListsPop2Popover(ev) {
    let productListsPop2 = this.popover.create(ProductListsPop2, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover2");
    productListsPop2.present({
      ev: ev
    });
  }

  presentProductListsPop3Popover(ev) {
    let productListsPop3 = this.popover.create(ProductListsPop3, {
      contentEle: this.content.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover3");
    productListsPop3.present({
      ev: ev
    });
  }

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails, { product: product });
  }


  alreadyLiked(product) {
        if(this.validation == undefined){
      return false;
    }else {
    if (this.validation.username == undefined) {
      return false
    } else if (product.likedBy.indexOf(this.validation.username) >= 0) {
       console.log("posessed")
      // console.log(product.likedBy.indexOf(validation.username))
      return true
    } else {
      //console.log("not exist")
      return false
    }
    }
  }

  likeProduct(product) {
    if (this.validation.username == undefined) {
      alert("login before use,dude")
      this.storage.remove('validation').then((data1) => {
        console.log(data1)
        console.log("data1")

      })
    } else {
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
    }
  }

  openServiceProviderDetailsPage(product) {
            product.from = "productListPage"
            this.nav.push(ServiceProviderDetails, product);
  }

  doInfinite(infiniteScroll: any) {
    if (this.infiniteScrollEnd === false) {
      console.log('doInfinite, start is currently ' + this.start);
      this.start += 20;

      this.loadProducts().then(data => {
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
       this.products = []
       this.start = 0
       this.loadProducts();

       refresher.complete();
     }, 1000);
   }
}
