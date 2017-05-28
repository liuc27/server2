import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'

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

  myOffer(data1) {
    console.log("myOffer start")
    return new Promise(resolve => {
            this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer/getMyCalendar', data1)
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

  serviceProviderOffer(serviceProviderId) {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
          console.log("offerProvider start")
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer?serviceProviderId='+serviceProviderId)
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

  myReservation(id) {
    return new Promise(resolve => {
          console.log("offerProvider start")
          console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/offer/getMyReservations?id='+id)
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
