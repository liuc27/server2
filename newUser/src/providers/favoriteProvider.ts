import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { defaultURL } from './i18n-demo.constants';

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

    getServices(id) {
        //if (this.data) {
        //  // already loaded data
        //  return Promise.resolve(this.data);
        //}

        // don't have the data yet
        return new Promise(resolve => {
            console.log("offerProvider start")
            console.log(name)
            this.http.get(defaultURL+':3000/favorite/favoriteServices?id=' + id)
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

    postService(service) {
        return new Promise(resolve => {
            console.log("post favorite service start")
            this.http.post(defaultURL+':3000/favorite/favoriteService', service)
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
            console.log("post favorite service start")
            this.http.post(defaultURL+':3000/favorite/favoriteServiceProvider', serviceProvider)
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
            this.http.get(defaultURL+':3000/favorite/favoriteServiceProviders?id=' + id)
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
