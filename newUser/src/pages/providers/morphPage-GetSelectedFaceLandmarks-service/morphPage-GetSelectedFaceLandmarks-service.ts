import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the productDetailsGetSelectedProductDetails provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class getSelectedFaceLandmarksService {
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

    var buff = new ArrayBuffer(f.img.length);
    var arr = new Uint8Array(buff);

// blobの生成
    for(var i = 0,  dataLen = f.img.length; i < dataLen; i++){
      arr[i] = f.img.charCodeAt(i);
    }
    var blob = new Blob([arr], {type: 'image/png'});

    var formData = new FormData();
    formData.append('img', blob);

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.post('http://apicn.faceplusplus.com/v2/detection/detect'+'?api_key='+f.api_key+'&api_secret='+f.api_secret, formData)
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
