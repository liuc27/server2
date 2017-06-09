import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'
import { defaultURL } from './i18n-demo.constants';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OfferProvider {

  data: any;

  constructor(public http: Http, public storage:Storage) {
    this.data = null;
  }

  myCalendarAsServiceProvider(data1) {
    console.log("myCalendarAsServiceProvider start")
    return new Promise(resolve => {
            this.http.post(defaultURL+':3000/offer/getMyCalendarAsServiceProvider', data1)
              .map(res => res.json())
              .subscribe(
              data2 => {
                      this.data = data2
                      resolve(this.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
  }

  serviceProviderOffer(serviceProviderId,serviceType) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    var queryString;
    if(serviceProviderId&&serviceType){
      queryString = "serviceProviderId="+serviceProviderId +'&serviceType='+serviceType
    } else if(serviceProviderId){
      queryString = "serviceProviderId="+serviceProviderId
    }
    return new Promise(resolve => {
          console.log("offerProvider start")
            this.http.get(defaultURL+':3000/offer/serviceProviderOffer?'+queryString)
              .map(res => res.json())
              .subscribe(
              data2 => {
                      this.data = data2
                      resolve(this.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
  }

  userOffer(userId,serviceType) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    var queryString;
    if(userId&&serviceType){
      queryString = "userId="+userId +'&serviceType='+serviceType
    } else if(userId){
      queryString = "userId="+userId
    }
    return new Promise(resolve => {
          console.log("userOffer start")
            this.http.get(defaultURL+':3000/offer/userOffer?'+queryString)
              .map(res => res.json())
              .subscribe(
              data2 => {
                      this.data = data2
                      resolve(this.data)
              },
              (err) => {
                  console.log(err._body)
              })
    })
  }

  myCalendarAsUser(id) {
    return new Promise(resolve => {
          console.log("myCalendarAsUser start")
          console.log(name)
            this.http.get(defaultURL+':3000/offer/getMyCalendarAsUser?id='+id)
              .map(res => res.json())
              .subscribe(
              data2 => {
              console.log(data2)
                      this.data = data2
                      resolve(this.data)
              },
              (err) => {
                  console.log(err._body)
              })
      })
  }

}
