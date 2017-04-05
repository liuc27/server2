/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ProductDetails } from '../../product/productLists/productDetails/productDetails';
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { CheckLogin } from '../../../providers/check-login'
import { GetMyFavorites } from '../../../providers/getMyFavorites'
import { TranslateService } from 'ng2-translate/ng2-translate';
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
  providers: [CheckLogin, GetMyFavorites]
})
export class MyFavorites {
  username: String;
  password: String;
  alreadyLoggedIn = false;
  products: any = [];
  validation: any = {};
  start = 0;
  limit = 20;
  infiniteScrollEnd = false

  constructor(private nav: NavController,
    private events: Events,
    translate: TranslateService,
    public checkLogin: CheckLogin,
    public getMyFavorites: GetMyFavorites,
    private http: Http) {
    translate.setDefaultLang('en');
    translate.use('en');


    this.loadProducts()
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails, { product: product });
  }

  alreadyLiked(product) {
    if (this.validation && this.validation.username) {
      if (this.validation.likedProduct.indexOf(product._id) >= 0) {
        console.log(product._id)
        console.log("posessed")
        return true
      }
    }
    return false
  }

  likeProduct(product) {
    if (this.validation.username == undefined) {
      alert("login before use,dude")
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

  loadProducts() {

    return new Promise(resolve => {


      this.checkLogin.load()
        .then(data => {
          this.validation = data
          this.alreadyLoggedIn = true;
          var likedProduct: any = {};

          console.log(data)
          likedProduct = data;
          console.log(likedProduct)
          likedProduct.skip = this.start;
          likedProduct.limit = this.limit

          this.getMyFavorites.load(this.validation.username, this.validation.password).then(data => {
            this.products = data;
          })
          console.log(this.products)

        })

    });
  }

}
