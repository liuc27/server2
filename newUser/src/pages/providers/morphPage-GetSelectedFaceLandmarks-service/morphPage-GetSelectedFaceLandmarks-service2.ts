import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the productDetailsGetSelectedProductDetails provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class getSelectedFaceLandmarksService2 {
  product: any;

  constructor(private http: Http) {
    this.product = null;
  }

  load(f) {
    console.log(f);
    if (this.product) {
      // already loaded data
      return Promise.resolve(this.product);
    }



    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('http://apicn.faceplusplus.com/v2/detection/landmark'+'?api_key='+f.api_key+'&api_secret='+f.api_secret+'&face_id='+f.face_id+'&type=83p')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          console.log(data);
          this.product = data;
          resolve(this.product);
        });
    });
  }
}
