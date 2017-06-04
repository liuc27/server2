import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Globalization } from '@ionic-native/globalization';
import { defaultLanguage, availableLanguages, sysOptions } from '../providers/i18n-demo.constants';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers:[Globalization]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, translate: TranslateService, private globalization:Globalization) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      translate.setDefaultLang(defaultLanguage);

				if ((<any>window).cordova) {
					globalization.getPreferredLanguage().then(result => {
						var language = this.getSuitableLanguage(result.value);
						translate.use(language);
						sysOptions.systemLanguage = language;
					});
				} else {
					let browserLanguage = translate.getBrowserLang() || defaultLanguage;
					var language = this.getSuitableLanguage(browserLanguage);
					translate.use(language);
					sysOptions.systemLanguage = language;
				}
    });
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    console.log(language)
    console.log(language)

    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }
}
