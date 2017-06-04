import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { defaultURL } from './i18n-demo.constants';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OfferProvider {

  data: any;

  constructor(public http: Http) {
    this.data = null;
  }

  load(serviceProviderId) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
          console.log("offerProvider start")
            this.http.get(defaultURL+':3000/offer?serviceProviderId='+serviceProviderId)
              .map(res => res.json())
              .subscribe(
              data2 => {
                      this.data = data2
                      resolve(this.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
  }
}
