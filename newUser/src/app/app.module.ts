import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, PopoverController } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';

import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { ProductPage } from '../pages/product/product';
import { ServiceProviderPage } from '../pages/serviceProvider/serviceProvider';
import { SettingsPage } from '../pages/settings/settings';
import { SignUp } from '../pages/settings/signUp/signUp';
import { MyCoupons } from '../pages/settings/myCoupons/myCoupons';
import { MyFavorites } from '../pages/settings/myFavorites/myFavorites';
import { MyFavoriteArtists } from '../pages/settings/myFavoriteArtists/myFavoriteArtists';
import { MyReservations } from '../pages/settings/myReservations/myReservations';
import { MyInformation } from '../pages/settings/myInformation/myInformation';
import { MyInformationChange } from '../pages/settings/myInformation/myInformationChange/myInformationChange';
import { MyFriends } from '../pages/settings/myFriends/myFriends';

import { ProductLists } from '../pages/product/productLists/productLists';
import { ProductDetails } from '../pages/product/productLists/productDetails/productDetails';
import { Video } from '../pages/product/productLists/productDetails/video/video';
import { MorphingPage } from '../pages/product/productLists/productDetails/morphingPage/morphingPage';
import { ServiceProviderLists } from '../pages/serviceProvider/serviceProviderLists/serviceProviderLists';
import { ServiceProviderDetails } from '../pages/serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { Reservation } from '../pages/serviceProvider/serviceProviderDetails/reservation/reservation';
import { ReservationDetails } from '../pages/serviceProvider/serviceProviderDetails/reservation/reservationDetails/reservationDetails';


import { serviceProviderPop1 } from "../pages/serviceProvider/popoverPages/serviceProviderPop1";
import { serviceProviderPop2 } from "../pages/serviceProvider/popoverPages/serviceProviderPop2";
import { serviceProviderPop3 } from "../pages/serviceProvider/popoverPages/serviceProviderPop3";

import { serviceProviderDetailsPop1 } from "../pages/serviceProvider/serviceProviderDetails/popoverPages/serviceProviderDetailsPop1";
import { serviceProviderDetailsPop2 } from "../pages/serviceProvider/serviceProviderDetails/popoverPages/serviceProviderDetailsPop2";
import { serviceProviderDetailsPop3 } from "../pages/serviceProvider/serviceProviderDetails/popoverPages/serviceProviderDetailsPop3";

import { ProductListsPop1 } from "../pages/product/productLists/popoverPages/productListsPop1";
import { ProductListsPop2 } from "../pages/product/productLists/popoverPages/productListsPop2";
import { ProductListsPop3 } from "../pages/product/productLists/popoverPages/productListsPop3";
import { ModalContentPage } from "../pages/product/productLists/modalPages/modalContent";


import { ProductService } from '../pages/providers/product-getAllProducts-service/product-getAllProducts-service';
import { ServiceProviderGetAllServiceProvidersService } from '../pages/providers/serviceProvider-get-all-serviceProviders-service/serviceProvider-get-all-serviceProviders-service';
import { getSelectedProductDetails } from '../pages/providers/productDetails-GetSelectedProductDetails-service/productDetails-GetSelectedProductDetails-service';
import { CheckLogin } from '../providers/check-login'

import { Ionic2RatingModule } from 'ionic2-rating/module';
import { NgCalendarModule } from 'ionic2-calendar';


@NgModule({
  declarations: [
    MyApp,
    ProductPage,
    ServiceProviderPage,
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyInformationChange,
    MyFavorites,
    MyFavoriteArtists,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductDetails,
    Video,
    MorphingPage,
    ServiceProviderLists,
    ServiceProviderDetails,
    Reservation,
    ReservationDetails,
    serviceProviderPop1,
    serviceProviderPop2,
    serviceProviderPop3,
    serviceProviderDetailsPop1,
    serviceProviderDetailsPop2,
    serviceProviderDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  imports: [
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp, { tabsHideOnSubPages: "true" }),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: translateLoaderFactory,
      deps: [Http]
    }),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProductPage,
    ServiceProviderPage,
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyInformationChange,
    MyFavorites,
    MyFavoriteArtists,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductDetails,
    Video,
    MorphingPage,
    ServiceProviderLists,
    ServiceProviderDetails,
    Reservation,
    ReservationDetails,
    serviceProviderPop1,
    serviceProviderPop2,
    serviceProviderPop3,
    serviceProviderDetailsPop1,
    serviceProviderDetailsPop2,
    serviceProviderDetailsPop3,
    ProductListsPop1,
    ProductListsPop2,
    ProductListsPop3,
    ModalContentPage
  ],
  providers: [
    PopoverController,
    ProductService,
    ServiceProviderGetAllServiceProvidersService,
    getSelectedProductDetails,
    CheckLogin
  ]
})
export class AppModule { }

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
