import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ProductProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductProvider {
  data: any;
  perpage:number = 20;
  queryString;

  constructor(private http: Http) {
    this.data = [];
  }

  get(start:number,category,subCategory:String,serviceProviderId) {
    if(!category && !serviceProviderId){
     this.queryString = this.perpage+'&skip='+start
     } else if(!category && serviceProviderId) {
      this.queryString = this.perpage+'&skip='+start+'&serviceProviderId='+serviceProviderId+'&subCategory='+subCategory
     }else if(!serviceProviderId && category) {
     this.queryString = this.perpage+'&skip='+start+'&category='+category+'&subCategory='+subCategory
     } else {
     this.queryString = this.perpage+'&skip='+start+'&category='+category+'&serviceProviderId='+serviceProviderId+'&subCategory='+subCategory
     }

    return new Promise(resolve => {
      this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product?limit='+this.queryString)
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

  getProductDetails(id) {
    // don't have the data yet
    return new Promise(resolve => {
      this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product/productDetails?_id='+id)
        .map(res => res.json())
        .subscribe(data => {
          console.log("productDetails")
          console.log(data)
          if(!data.likedBy) data.likedBy=[]
          this.data = data;
          //resolve(this.data._body);
          resolve(this.data);
        });
    });
  }
}
