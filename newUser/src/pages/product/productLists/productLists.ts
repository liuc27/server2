/**
 * Created by liuchao on 6/25/16.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, ModalController, Content,ToastController, AlertController } from 'ionic-angular';
import { ProductListsPop1 } from "./popoverPages/productListsPop1";
import { ProductListsPop2 } from "./popoverPages/productListsPop2";
import { ProductListsPop3 } from "./popoverPages/productListsPop3";
import { ProductSublists } from './productSublists/productSublists';
import { ProductDetails } from './productDetails/productDetails';
import { ServiceProviderDetails } from '../../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { ModalContentPage } from "./modalPages/modalContent";
import { ProductProvider } from '../../../providers/productProvider';
import { UserProvider } from '../../../providers/userProvider'
import { FavoriteProvider } from '../../../providers/favoriteProvider'
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-productLists',
  templateUrl: 'productLists.html',
  providers: [ProductProvider, UserProvider,FavoriteProvider]
})
export class ProductLists {
  @ViewChild('popoverContent', { read: ElementRef }) popContent: ElementRef;
  @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;
  @ViewChild(Content) content: Content;

  serviceProvider;
  category;
  title
  productOrServiceProvider;
  products:any = [];
  public menu1: any = [];
  public menu2: any = [];
  public menu3 = [];
  public menu4 = [];
  public grid = [];
  product:any;
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
    public productProvider: ProductProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    public favoriteProvider: FavoriteProvider) {
    this.category = params.data.category;
    this.productOrServiceProvider = "product";
    console.log("params.data");
        console.log(params.data);
        console.log(this.category)
    this.title = params.data.name

    if(this.params.data.sub){
      if(this.params.data.sub.length>0)
      this.getMenu(this.params.data.sub)
    }
    console.log(this.grid)
    this.loadProducts();
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
                  for (var i = 0; i < 5; i++) {
                      this.menu1.push(data[i])
                  }
                  this.grid.push(this.menu1);
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
      this.productProvider.get(this.start,this.category,"all",null)
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
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover1");
    productListsPop1.present({
      ev: ev
    });
  }

  presentProductListsPop2Popover(ev) {
    let productListsPop2 = this.popover.create(ProductListsPop2, {
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover2");
    productListsPop2.present({
      ev: ev
    });
  }

  presentProductListsPop3Popover(ev) {
    let productListsPop3 = this.popover.create(ProductListsPop3, {
      popContentEle: this.popContent.nativeElement,
      textEle: this.text.nativeElement
    });

    console.log("presentPopover3");
    productListsPop3.present({
      ev: ev
    });
  }

  openProductSublistsPage(menuItem){
  console.log("menuItem")

   console.log(menuItem)
   this.nav.push(ProductSublists, {name:this.params.data.category,sub:menuItem.category});
  }

  openProductDetailsPage(product) {
    console.log("detail open");
    this.nav.push(ProductDetails, product);
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
      this.presentAlert()

    }
  }

  openServiceProviderDetailsPage(product) {
            product.from = "productListPage"
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

   scrollToTop() {
     this.content.scrollToTop();
   }

   goTop() {
       this.scrollToTop()
       this.presentToast()

       setTimeout(() => {
           this.products = []
           this.start = 0
           this.loadProducts()
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
