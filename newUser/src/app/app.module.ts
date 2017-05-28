import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';

import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { ProductPage } from '../pages/product/product';
import { ServiceProviderPage } from '../pages/serviceProvider/serviceProvider';
import { SettingsPage } from '../pages/settings/settings';
import { SignUp } from '../pages/settings/signUp/signUp';
import { MyReservations } from '../pages/settings/myReservations/myReservations';
import { MyFavorites } from '../pages/settings/myFavorites/myFavorites';
import { MyFavoriteArtists } from '../pages/settings/myFavoriteArtists/myFavoriteArtists';
import { MyInformation } from '../pages/settings/myInformation/myInformation';
import { MyInformationChange } from '../pages/settings/myInformation/myInformationChange/myInformationChange';
import { MyOffers } from '../pages/settings/myOffers/myOffers';
import { ContactInfo } from '../pages/settings/myOffers/contactInfo/contactInfo';
import { NewServicePage } from '../pages/settings/myServices/newService/newService';
import { NewOffer } from '../pages/settings/myOffers/newOffer/newOffer';
import { NewOfferDetails } from '../pages/settings/myOffers/newOffer/newOfferDetails/newOfferDetails';
import { MyServices } from '../pages/settings/myServices/myServices';
import { ModifyMyServices } from'../pages/settings/myServices/modifyMyServices/modifyMyServices'

import { ProductLists } from '../pages/product/productLists/productLists';
import { ProductSublists } from '../pages/product/productLists/productSublists/productSublists';
import { ProductDetails } from '../pages/product/productLists/productDetails/productDetails';
import { ProductPayment } from '../pages/product/productLists/productDetails/productPayment/productPayment';
import { Video } from '../pages/product/productLists/productDetails/video/video';
import { MorphingPage } from '../pages/product/productLists/productDetails/morphingPage/morphingPage';
import { ProductReview } from '../pages/product/productLists/productDetails/productReview/productReview';
import { ServiceProviderLists } from '../pages/serviceProvider/serviceProviderLists/serviceProviderLists';
import { ServiceProviderSublists } from '../pages/serviceProvider/serviceProviderLists/serviceProviderSublists/serviceProviderSublists';
import { ServiceProviderDetails } from '../pages/serviceProvider/serviceProviderDetails/serviceProviderDetails';
import { ServiceProviderReview } from '../pages/serviceProvider/serviceProviderDetails/serviceProviderReview/serviceProviderReview';
import { ServiceProviderCertificate } from '../pages/serviceProvider/serviceProviderDetails/serviceProviderCertificate/serviceProviderCertificate';
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


//import { ProductProvider } from '../providers/productProvider';
//import { UserProvider } from '../providers/userProvider'

import { Ionic2RatingModule } from 'ionic2-rating/module';
import { NgCalendarModule } from 'ionic2-calendar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
//import { Globalization } from '@ionic-native/globalization';


@NgModule({
  declarations: [
    MyApp,
    ProductPage,
    ServiceProviderPage,
    SettingsPage,
    SignUp,
    MyInformation,
    MyInformationChange,
    MyFavorites,
    MyFavoriteArtists,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductSublists,
    ProductDetails,
    ProductPayment,
    Video,
    MorphingPage,
    ProductReview,
    ServiceProviderReview,
    ServiceProviderCertificate,
    ServiceProviderLists,
    ServiceProviderSublists,
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
    ModalContentPage,
    MyOffers,
    ContactInfo,
    NewServicePage,
    NewOffer,
    NewOfferDetails,
    MyServices,
    ModifyMyServices,
    TextAvatarDirective
  ],
  imports: [
  BrowserModule,
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
    MyInformation,
    MyInformationChange,
    MyFavorites,
    MyFavoriteArtists,
    MyReservations,
    TabsPage,
    ProductLists,
    ProductSublists,
    ProductDetails,
    ProductPayment,
    Video,
    MorphingPage,
    ProductReview,
    ServiceProviderReview,
    ServiceProviderCertificate,
    ServiceProviderLists,
    ServiceProviderSublists,
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
    ModalContentPage,
    MyOffers,
    ContactInfo,
    NewServicePage,
    NewOffer,
    NewOfferDetails,
    MyServices,
    ModifyMyServices
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule { }

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
