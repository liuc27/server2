import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MyProducts {
  data: any;
  perpage:number = 20;

  constructor(private http: Http) {
    this.data = null;
  }

  load(start:number,category:String,serviceProviderName:String) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
      return new Promise(resolve => {
        this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product?limit='+this.perpage+'&skip='+start+'&category='+category+'&serviceProviderName='+serviceProviderName)
          .map(res => res.json())
          .subscribe(data => {
            console.log(data)
            this.data = data;
            resolve(this.data);
          });
      });
  }
}
