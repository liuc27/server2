import { Injectable, Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage'
import { TranslateService } from 'ng2-translate/ng2-translate';
import { defaultURL } from './i18n-demo.constants';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserProvider {

    validation: any = {};
    data: any;
    perpage = 20
    queryString

    constructor(
    public http: Http,
    public storage: Storage,
    private translate: TranslateService) {
        this.data = null
    }

    saveLocalStorage(validation) {
        if (validation) {
            this.storage.ready().then(() => {
                this.storage.set('validation', validation)
            })
        }
    }

    post(validaiton) {
        return new Promise(resolve => {
            if (!validaiton) {
                this.storage.remove('validation')
                resolve(null)
            }
            else if (!validaiton.id || !validaiton.password) {
                this.storage.remove('validation')
                resolve(null)
            }
            else {
                this.http.post(defaultURL+':3000/user/login', validaiton)
                    .map(res => res.json())
                    .subscribe(
                    data2 => {
                        this.data = data2
                        this.storage.ready().then(() => {
                            this.storage.set('validation', data2).then((data3) => {
                                console.log("resoleved data")
                                console.log(this.data)
                                resolve(this.data);
                            });
                        })
                    },
                    (err) => {
                        console.log(err._body)
                        resolve(null)
                    })
            }

        })
    }

    loadLocalStorage() {
        return new Promise(resolve => {
            this.storage.ready().then(() => {
                this.storage.get('validation').then((validaiton) => {
                    if (!validaiton) {
                        this.storage.remove('validation')
                    }
                    else if (!validaiton.id || !validaiton.password) {
                        this.storage.remove('validation')
                    }
                    else {
                        this.data = validaiton
                        resolve(this.data);
                    }
                })
            })
        })
    }

    get(start:number,category,subCategory,userType) {

    if(!category){
     this.queryString = this.perpage+'&skip='+start+'&userType='+userType
     } else if(category && !subCategory) {
     this.queryString = this.perpage+'&skip='+start+'&category='+category+'&userType='+userType
     }else {
     this.queryString = this.perpage+'&skip='+start+'&category='+category+'&subCategory='+subCategory+'&userType='+userType
     }

      return new Promise(resolve => {
        this.http.get(defaultURL+':3000/user?limit='+this.queryString)
          .map(res => res.json())
          .subscribe(
          data => {
            console.log(data)
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            console.log(err._body)
          });
      });
    }

    getMenu() {
    return new Promise(resolve => {

        this.http.get(defaultURL+':3000/offer/getMenu')
            .map(res => res.json())
            .subscribe(
            data => {
/*              data.forEach((element, index) => {
                this.translate.get(element.name).subscribe(response => {
                  data[index].name = response
                  console.log(data)
                  if(index = data.length -1) resolve(data)
                 });
              });
              */
              resolve(data)

              },
              (err) => {
                console.log(err._body)
              });
    })
    }
}
