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

  private videoDetails = {
    imageURL:"",
    videoURL:""
  };
  private url;

  constructor(public navCtrl: NavController,private params: NavParams,  sanitizer: DomSanitizer) {
      this.videoDetails = params.data.videoDetails;
          console.log("params.data.videoDetails");
          console.log(params.data.videoDetails);
          this.url = sanitizer.bypassSecurityTrustResourceUrl(this.videoDetails.videoURL);
  }

  ionViewDidLoad() {
    console.log('Hello VideoPage Page');
  }

}
