import { Injectable, Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'

/*
  Generated class for the CheckLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CheckLogin {

  validation : any = {};
  data: any;

  constructor(public http: Http, public storage:Storage,) {
    this.data = null
  }

  updateLikedProduct(newLikedProduct){
    if(this.data){
      this.data.likedProduct = newLikedProduct
      this.storage.ready().then(() => {

      this.storage.set('validation', this.data)
      console.log(this.data)
      })
    }
  }

  login(data1) {
    return new Promise(resolve => {
        if (data1) {
          if (data1.username&&data1.password) {
            this.http.post('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/user/login', data1)
              .map(res => res.json())
              .subscribe(data2 => {
                if (data2) {
                  if (data2.data == "OK") {
                  this.storage.ready().then(() => {

                  this.storage.set('validation', data2).then((data3) => {
                  this.data = data2
                  console.log("resoleved data")
                  console.log(this.data)
                  resolve(this.data);
                  });
                  })
                  } else if (data2.data == "NO") {
                    this.storage.remove('validation')
                    console.log("wrong password")
                  }
                }
              });
          } else {
            console.log("notSignIn")
          }
        } else {
          console.log("empty")
        }
    })
    }

  load() {

    return new Promise(resolve => {
    this.storage.ready().then(() => {

      this.storage.get('validation').then((data1) => {
        if (data1) {
          if (data1.username&&data1.password) {
            this.data = data1
            resolve(this.data);
            }
        } else {
          console.log("err")
        }
      })
      })
    })
  }
}
