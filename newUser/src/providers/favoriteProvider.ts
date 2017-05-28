import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FavoriteProvider {

    data: any;

    constructor(public http: Http) {
        this.data = null;
    }

    getProducts(id) {
        //if (this.data) {
        //  // already loaded data
        //  return Promise.resolve(this.data);
        //}

        // don't have the data yet
        return new Promise(resolve => {
            console.log("offerProvider start")
            console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/favorite/favoriteProducts?id=' + id)
                .map(res => res.json())
                .subscribe(
                data => {
                        resolve(data)
                },
                (err) => {
                    console.log(err._body)
                });
        })
    }

    postProduct(product) {
        return new Promise(resolve => {
            console.log("post favorite product start")
            this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/favorite/favoriteProduct', product)
              .map(res => res.json())
              .subscribe(
              data => {
                      resolve(data.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
    }

    postServiceProvider(serviceProvider) {
        return new Promise(resolve => {
            console.log("post favorite product start")
            this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/favorite/favoriteServiceProvider', serviceProvider)
              .map(res => res.json())
              .subscribe(
              data => {
                resolve(data.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
    }

    getServiceProviders(id) {
        return new Promise(resolve => {
            console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/favorite/favoriteServiceProviders?id=' + id)
                .map(res => res.json())
                .subscribe(
                data => {
                        resolve(data)
                },
                (err) => {
                  console.log(err._body)
                }
              );

    })
}
}
