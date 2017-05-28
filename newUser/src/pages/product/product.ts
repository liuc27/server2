import { Component, ViewChild } from '@angular/core';
import { Platform, Events, ActionSheetController, NavController, Content,ToastController, AlertController } from 'ionic-angular';
import { ProductProvider } from '../../providers/productProvider';
import { ProductLists } from './productLists/productLists';
import { ProductDetails } from './productLists/productDetails/productDetails';
import { ServiceProviderDetails } from '../serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { FavoriteProvider } from '../../providers/favoriteProvider'
import { TranslateService } from 'ng2-translate/ng2-translate';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../providers/userProvider'
import { Storage } from '@ionic/storage'


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
  providers: [ProductProvider, UserProvider, FavoriteProvider]
})
export class ProductPage {
@ViewChild(Content) content: Content;

  public products: any = [];
  //public product: any;
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
    public productProvider: ProductProvider,
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
          this.loadProducts();
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

  loadProducts() {

    return new Promise(resolve => {

      this.productProvider.get(this.start, this.category, "all", null)
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

  translateMenu(menuItemName){
    let returnData = menuItemName ;
    this.translate.get(menuItemName).subscribe(response => {
      returnData = response
    })
    return returnData
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



        data.forEach((element, index) => {
          this.translate.get(element.name).subscribe(response => {
            data[index].name = response
           });
          console.log(data[index].name)
        });
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

  openProductListsPage(menuItem) {
    console.log(menuItem)
    this.nav.push(ProductLists, menuItem);
  }

  openProductDetailsPage(product) {
    this.nav.push(ProductDetails, product);
  }

  openServiceProviderDetailsPage(product) {
    product.from = "productPage"
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
          this.products = []
          this.start = 0
          this.loadProducts();
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
