import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CheckLogin provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GetMyFavoriteArtists {

  data: any;

  constructor(public http: Http) {
    this.data = null;
  }

  load(name,password) {
    //if (this.data) {
    //  // already loaded data
    //  return Promise.resolve(this.data);
    //}

    // don't have the data yet
    return new Promise(resolve => {
          console.log("getMyReservation start")
          console.log(name)
            this.http.get('http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/user/getMyFavoriteArtists?username='+name+'&password='+password)
              .map(res => res.json())
              .subscribe(data2 => {
              console.log(data2)

                if (data2 ) {
                  console.log(data2)
                  this.data = data2
                  resolve(this.data)
                }else{
                  resolve(this.data)
                }
              });

    })
  }
}
