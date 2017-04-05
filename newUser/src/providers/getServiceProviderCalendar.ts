import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CheckLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GetServiceProviderCalendar {

  data: any;

  constructor(public http: Http) {
    this.data = null;
  }

  load(name,password) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
          console.log("getCalendar start")
          console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider/getServiceProviderCalendar?serviceProviderName='+name+'&password='+password)
              .map(res => res.json())
              .subscribe(data2 => {
              console.log(data2)

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
