import { NgModule, ErrorHandler, LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { IonicStorageModule } from '@ionic/storage';

import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { ServicePage } from '../pages/service/service';
import { ServiceProviderPage } from '../pages/serviceProvider/serviceProvider';
import { SettingsPage } from '../pages/settings/settings';
import { SignUp } from '../pages/settings/signUp/signUp';
import { MyCalendarAsUser } from '../pages/settings/myCalendarAsUser/myCalendarAsUser';
import { MyFavorites } from '../pages/settings/myFavorites/myFavorites';
import { Recruit } from '../pages/settings/recruit/recruit';
import { MyInformation } from '../pages/settings/myInformation/myInformation';
import { MyInformationChange } from '../pages/settings/myInformation/myInformationChange/myInformationChange';
import { MyCalendarAsServiceProvider } from '../pages/settings/myCalendarAsServiceProvider/myCalendarAsServiceProvider';
import { ContactInfo } from '../pages/settings/myCalendarAsServiceProvider/contactInfo/contactInfo';
import { NewServicePage } from '../pages/settings/myServices/newService/newService';
import { NewOffer } from '../pages/settings/myCalendarAsServiceProvider/newOffer/newOffer';
import { NewOfferDetails } from '../pages/settings/myCalendarAsServiceProvider/newOffer/newOfferDetails/newOfferDetails';
import { MyServices } from '../pages/settings/myServices/myServices';
import { ModifyMyServices } from'../pages/settings/myServices/modifyMyServices/modifyMyServices'

import { ServiceLists } from '../pages/service/serviceLists/serviceLists';
import { ServiceSublists } from '../pages/service/serviceLists/serviceSublists/serviceSublists';
import { ServiceDetails } from '../pages/service/serviceLists/serviceDetails/serviceDetails';
import { ServicePayment } from '../pages/service/serviceLists/serviceDetails/servicePayment/servicePayment';
import { Video } from '../pages/service/serviceLists/serviceDetails/video/video';
import { MorphingPage } from '../pages/service/serviceLists/serviceDetails/morphingPage/morphingPage';
import { ServiceReview } from '../pages/service/serviceLists/serviceDetails/serviceReview/serviceReview';
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

import { ServiceListsPop1 } from "../pages/service/serviceLists/popoverPages/serviceListsPop1";
import { ServiceListsPop2 } from "../pages/service/serviceLists/popoverPages/serviceListsPop2";
import { ServiceListsPop3 } from "../pages/service/serviceLists/popoverPages/serviceListsPop3";
import { ModalContentPage } from "../pages/service/serviceLists/modalPages/modalContent";


//import { ServiceProvider } from '../providers/serviceProvider';
//import { UserProvider } from '../providers/userProvider'


import { JobPage } from '../pages/job/job';
import { JobLists } from '../pages/job/jobLists/jobLists';
import { JobSublists } from '../pages/job/jobLists/jobSublists/jobSublists';
import { JobDetails } from '../pages/job/jobLists/jobDetails/jobDetails';
import { JobOfferDetails } from '../pages/jobOffer/jobOfferDetails/jobOfferDetails';

import { JobReservation } from '../pages/jobOffer/jobOfferDetails/jobReservation/jobReservation';
import { JobReservationDetails } from '../pages/jobOffer/jobOfferDetails/jobReservation/jobReservationDetails/jobReservationDetails';

/*
import { JobPayment } from '../pages/job/jobLists/jobDetails/jobPayment/jobPayment';
import { JobReview } from '../pages/job/jobLists/jobDetails/jobReview/jobReview';
import { JobListsPop1 } from "../pages/job/jobLists/popoverPages/jobListsPop1";
import { JobListsPop2 } from "../pages/job/jobLists/popoverPages/jobListsPop2";
import { JobListsPop3 } from "../pages/job/jobLists/popoverPages/jobListsPop3";
*/


import { Ionic2RatingModule } from 'ionic2-rating';
import { NgCalendarModule } from 'ionic2-calendar';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
//import { Globalization } from '@ionic-native/globalization';


@NgModule({
  declarations: [
    MyApp,
    ServicePage,
    ServiceProviderPage,
    SettingsPage,
    SignUp,
    MyInformation,
    MyInformationChange,
    MyFavorites,
    Recruit,
    MyCalendarAsUser,
    TabsPage,
    ServiceLists,
    ServiceSublists,
    ServiceDetails,
    ServicePayment,
    Video,
    MorphingPage,
    ServiceReview,
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
    ServiceListsPop1,
    ServiceListsPop2,
    ServiceListsPop3,
    ModalContentPage,
    MyCalendarAsServiceProvider,
    ContactInfo,
    NewServicePage,
    NewOffer,
    NewOfferDetails,
    MyServices,
    ModifyMyServices,
    TextAvatarDirective,

    JobPage,
    JobLists,
    JobSublists,
    JobDetails,
    JobOfferDetails,
    JobReservation,
    JobReservationDetails
    /*,
    JobPayment,
    JobReview,
    JobListsPop1,
    JobListsPop2,
    JobListsPop3
    */
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
    ServicePage,
    ServiceProviderPage,
    SettingsPage,
    SignUp,
    MyInformation,
    MyInformationChange,
    MyFavorites,
    Recruit,
    MyCalendarAsUser,
    TabsPage,
    ServiceLists,
    ServiceSublists,
    ServiceDetails,
    ServicePayment,
    Video,
    MorphingPage,
    ServiceReview,
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
    ServiceListsPop1,
    ServiceListsPop2,
    ServiceListsPop3,
    ModalContentPage,
    MyCalendarAsServiceProvider,
    ContactInfo,
    NewServicePage,
    NewOffer,
    NewOfferDetails,
    MyServices,
    ModifyMyServices,

    JobPage,
    JobLists,
    JobSublists,
    JobDetails,
    JobOfferDetails,
    JobReservation,
    JobReservationDetails
    /*,
    JobPayment,
    JobReview,
    JobListsPop1,
    JobListsPop2,
    JobListsPop3
    */
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: 'ja'}
  ]
})
export class AppModule { }

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
