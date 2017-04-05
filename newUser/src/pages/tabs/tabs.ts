import {Component} from '@angular/core'
import {ProductPage} from '../product/product';
import {ServiceProviderPage} from '../serviceProvider/serviceProvider';
import {SettingsPage} from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

   tab1Root: any;
   tab2Root: any;
   tab3Root: any;


  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = ProductPage;
    this.tab2Root = ServiceProviderPage;
    this.tab3Root = SettingsPage;
  }
}
