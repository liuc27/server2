import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

/*
  Generated class for the Video page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class Video {

  private serviceDetails = {
    imageURL:"",
    videoURL:""
  };
  private url;

  constructor(public navCtrl: NavController,private params: NavParams,  sanitizer: DomSanitizer) {
      if(params.data.service)
      this.serviceDetails = params.data.service;
      console.log(this.serviceDetails)
          console.log("params.data.videoDetails");
          console.log(params.data.service);
          this.url = sanitizer.bypassSecurityTrustResourceUrl(this.serviceDetails.videoURL);
  }

  ionViewDidLoad() {
    console.log('Hello VideoPage Page');
  }

}
