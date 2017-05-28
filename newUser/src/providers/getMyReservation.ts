import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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

  load(id) {
    //if (this.data) {
    //  // already loaded data
    //  return Promise.resolve(this.data);
    //}

    // don't have the data yet
    return new Promise(resolve => {
          console.log("offerProvider start")
          console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer/offerProviders?id='+id)
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
