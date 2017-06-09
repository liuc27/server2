import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { defaultURL } from './i18n-demo.constants';

/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServiceProvider {
  data: any;
  perpage:number = 20;
  queryString;

  constructor(private http: Http) {
    this.data = [];
  }

  get(start:number,category,subCategory,serviceProviderId,serviceType) {
    if(serviceProviderId){
      this.queryString = this.perpage+'&skip='+start+'&serviceProviderId='+serviceProviderId
    }else if(category && subCategory){
      this.queryString = this.perpage+'&skip='+start+'&category='+category+'&subCategory='+subCategory
    }else if(category){
      this.queryString = this.perpage+'&skip='+start+'&category='+category
    }else{
      this.queryString = this.perpage+'&skip='+start
    }

    if(serviceType){
      this.queryString += '&serviceType='+serviceType
    }
    return new Promise(resolve => {
      this.http.get(defaultURL+':3000/offer/service?limit='+this.queryString)
        .map(res => res.json())
        .subscribe(
        data => {
          console.log(data)
          this.data = data;
          resolve(this.data);
        },
        (err) => {
          console.log(err._body)
        }
        );
    });
  }

  getServiceDetails(_id) {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get(defaultURL+':3000/offer/serviceDetails?_id='+_id)
        .map(res => res.json())
        .subscribe(data => {
          console.log("serviceDetails")
          console.log(data)
          if(!data.likedBy) data.likedBy=[]
          this.data = data;
          //resolve(this.data._body);
          resolve(this.data);
        });
    });
  }
}
