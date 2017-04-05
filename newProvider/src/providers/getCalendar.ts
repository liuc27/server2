import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'

/*
  Generated class for the CheckLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GetCalendar {

  data: any;

  constructor(public http: Http, public storage:Storage) {
    this.data = null;
  }

  load(data1) {

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
            this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer/getMyCalendar', data1)
              .map(res => res.json())
              .subscribe(data2 => {
                // we've got back the raw data, now generate the core schedule data
                // and save the data for later reference
                if (data2 ) {
                  console.log(data2)
                  this.data = data2
                  resolve(this.data)
                }else{
                  resolve(this.data)
                }
              });
    })
  }
}
