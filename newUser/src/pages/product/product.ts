import { Component } from '@angular/core';
import { Platform, Events, ActionSheetController, NavController } from 'ionic-angular';
import { ProductService } from '../providers/product-getAllProducts-service/product-getAllProducts-service';
import { ProductLists } from './productLists/productLists';
import { ProductDetails } from './productLists/productDetails/productDetails';
import { ServiceProviderDetails } from '../serviceProvider/serviceProviderDetails/serviceProviderDetails';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CheckLogin } from '../../providers/check-login'
import { Storage } from '@ionic/storage'


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
  providers: [ProductService, CheckLogin]
})
export class ProductPage {
  public products: any = [];
  public product: any;
  public menu1: any = [];
  public menu2: any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  start = 0
  point;
  category = "all";
  infiniteScrollEnd = false
  alreadyLoggedIn = false;
  validation: any = {};
  BC;
  constructor(private nav: NavController,
    private actionSheet: ActionSheetController,
    public productService: ProductService,
    private events: Events,
    public platform: Platform,
    public storage: Storage,
    public checkLogin: CheckLogin,
    private http: Http) {

    this.loadProducts();
    this.actionSheet = actionSheet;
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
    this.getMenu();
  }

  ionViewWillEnter() {
  this.checkLogin.load()
    .then(data => {
      this.validation = data
      this.alreadyLoggedIn = true;
    });
    console.log("send showTabs event")
    this.events.publish('showTabs');
  }

  loadProducts() {

    return new Promise(resolve => {

      this.productService.load(this.start, this.category, null)
        .then(data => {
          console.log("data")
          console.log(data)
          if (Object.keys(data).length == 0) {
            this.start -= 20
          }
          this.products = this.products.concat(data);


          resolve(data);

        });

    });


  }

  getMenu() {
    this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product/getMenu')
      .map(res => res.json())
      .subscribe(data => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        // alert(data);
        console.log("menu is")
        console.log(data)
        //var flag = data[_body]

        if (data.length > 9) {
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
        }
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

  openProductListsPage(menuItem) {
    console.log(menuItem)
    this.nav.push(ProductLists, menuItem);
  }

  openProductDetailsPage(product) {
    this.nav.push(ProductDetails, { product: product });
  }

  openServiceProviderDetailsPage(product) {
    product.from = "productPage"
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
      this.grid=[]
      this.menu1 = [];
      this.menu2 = [];
      this. menu3 = [];
      this. menu4 = [];
      this.getMenu()
      refresher.complete();
    }, 1000);
  }

}
