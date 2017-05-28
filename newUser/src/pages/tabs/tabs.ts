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
    this.tab1Root = ServiceProviderPage;
    this.tab2Root = ProductPage;
    this.tab3Root = SettingsPage;
  }

}
