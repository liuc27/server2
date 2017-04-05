import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ServiceProviderGetAllServiceProvidersService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ServiceProviderGetAllServiceProvidersService {
  data: any ;
  perpage:number = 20;

  constructor(private http: Http) {
    this.data = [];
  }

  load(start:number,category:String,serviceProviderName:String) {
    return new Promise(resolve => {
      this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/serviceProvider?limit='+this.perpage+'&skip='+start+'&category='+category+'&serviceProviderName='+serviceProviderName)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
