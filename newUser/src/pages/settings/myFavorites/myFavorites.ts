/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ProductDetails } from '../../product/productLists/productDetails/productDetails';
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
  products: any = [];
  validation: any = {};
  start = 0;
  limit = 20;
  infiniteScrollEnd = false

  constructor(private nav: NavController,
    private events: Events,
    public userProvider: UserProvider,
    public favoriteProvider: FavoriteProvider,
    private http: Http) {
    this.loadProducts()
  }

  ionViewWillEnter() {
    // console.log("send showTabs event")
    // this.events.publish('showTabs');
  }

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails,  product );
  }




    alreadyLiked(product) {
      if (this.validation  ) {
      if(product._id && this.validation.likedProduct){
        if (this.validation.likedProduct.indexOf(product._id) >= 0) {
          return true
        }
        }
      }
      return false
    }

    favoriteProduct(product) {
      if (this.validation.id) {
        console.log(product)
        var theProduct = {
          _id: product._id,
          id: this.validation.id,
          password: this.validation.password
        }
        console.log(product.likedBy);

        this.favoriteProvider.postProduct(theProduct).then(data => {
        var flag = data
        if (flag == "push") {
          product.likedBy.push(this.validation.id);
          this.validation.likedProduct.push(product._id)
        } else if (flag == "pull") {

          var index = product.likedBy.indexOf(this.validation.id);
          if (index > -1) {
            product.likedBy.splice(index, 1);
          }

          var index2 = this.validation.likedProduct.indexOf(product._id);
          if (index2 > -1) {
            this.validation.likedProduct.splice(index2, 1);
          }
          console.log(this.validation)
        }
        this.userProvider.saveLocalStorage(this.validation)
        console.log(product.likedBy);
        })
      } else {
        alert("login before use,dude")

      }
    }


  openServiceProviderDetailsPage(product) {
    product.from = "myFavoriteProductPage"
    this.nav.push(ServiceProviderDetails, product.serviceProvider);
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


      this.userProvider.loadLocalStorage()
        .then(data => {
          this.validation = data
          this.alreadyLoggedIn = true;
          var likedProduct: any = {};

          console.log(data)
          likedProduct = data;
          console.log(likedProduct)
          likedProduct.skip = this.start;
          likedProduct.limit = this.limit

          this.favoriteProvider.getProducts(this.validation.id).then(data => {
             this.products = data;
          })
          console.log(this.products)

        })

    });
  }

}
