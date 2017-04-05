import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SettingsPage } from '../pages/settings/settings';
import { UploadPage } from '../pages/upload/upload';
import { Reservation } from '../pages/reservation/reservation';
import { ReservationDetails } from '../pages/reservation/reservationDetails/reservationDetails';

import { TabsPage } from '../pages/tabs/tabs';



import { SignUp } from '../pages/settings/signUp/signUp';
import { MyCoupons } from '../pages/settings/myCoupons/myCoupons';
import { MyReservations } from '../pages/settings/myReservations/myReservations';
import { ContactInfo } from '../pages/settings/myReservations/contactInfo/contactInfo';

import { MyInformation } from '../pages/settings/myInformation/myInformation';
import { MyInformationChange } from '../pages/settings/myInformation/myInformationChange/myInformationChange';
import { MyFriends } from '../pages/settings/myFriends/myFriends';
import { MyServices } from '../pages/settings/myServices/myServices';
import {ModifyMyServices} from'../pages/settings/myServices/modifyMyServices/modifyMyServices'
import {UpdateModifySelfPage} from'../pages/settings/myServices/update-modify-self/update-modify-self'

import { IonicStorageModule } from '@ionic/storage';

import {HttpModule,Http} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import { Ionic2RatingModule } from 'ionic2-rating/module';
import { NgCalendarModule } from 'ionic2-calendar';


@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyInformationChange,
    MyReservations,
    ContactInfo,
    MyServices,
    UploadPage,
    Reservation,
    ReservationDetails,
    TabsPage,
    ModifyMyServices,
    UpdateModifySelfPage
  ],
  imports: [
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp, {tabsHideOnSubPages:"true"}),
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
    SettingsPage,
    SignUp,
    MyCoupons,
    MyFriends,
    MyInformation,
    MyInformationChange,
    MyReservations,
    ContactInfo,
    UploadPage,
    Reservation,
    ReservationDetails,
    TabsPage,
    MyServices,
    ModifyMyServices,
    UpdateModifySelfPage
  ],
  providers: [
  ]
})
export class AppModule {}

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
