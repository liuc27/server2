/**
 * Created by liuchao on 6/25/16.
 */
import {Component, ViewChild, ElementRef} from '@angular/core';
import { ActionSheetController, Events, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage'
import {SafeResourceUrl,} from '@angular/platform-browser';
import {ProductService} from '../../../../providers/product-getAllProducts-service/product-getAllProducts-service';
import { Http } from '@angular/http';
import {CheckLogin} from '../../../../../providers/check-login'

import 'rxjs/add/operator/map';


declare var ImgWarper: any;


@Component({
  selector: 'page-morphingPage',
  templateUrl: 'morphingPage.html',
  providers:[ProductService,CheckLogin]
})
export class MorphingPage {
  @ViewChild('popoverContent', {read: ElementRef}) content: ElementRef;
  @ViewChild('popoverText', {read: ElementRef}) text: ElementRef;
  @ViewChild('result3', {read: ElementRef}) result3: ElementRef;
  @ViewChild('result4', {read: ElementRef}) result4: ElementRef;
  @ViewChild('result5', {read: ElementRef}) result5: ElementRef;
  @ViewChild('result6', {read: ElementRef}) result6: ElementRef;


  uploadedImg = {data:undefined};
  product;
  productOrShop;
  productDetails;
  public Warper: any;
  Point;
  PointDefiner ;
  faceImagePoints;
  Animator;
  f={api_key: undefined, api_id:undefined, api_secret:undefined, img:undefined, face_id:undefined};

  animatorResult;
  pointDefiner3 = {value:undefined};
  pointDefiner4 = {value:undefined};
  imageData;
  ratio;
  inputUserImageSize = {height:300,width:300};
  frames = [];
  data: any;
  // cropperSettings: CropperSettings;
  alreadyLoggedIn = false;
  validation : any = {};

  url: SafeResourceUrl;


  constructor(private params: NavParams,
              private nav:NavController,
              private actionSheet:ActionSheetController,
              private events: Events,
              public morphingPageService:ProductService,
              public storage:Storage,
              public checkLogin:CheckLogin,
              private http: Http) {
    this.data = {};
    // this.cropperSettings = new CropperSettings();
    // this.cropperSettings.width = 100;
    // this.cropperSettings.height = 100;
    // this.cropperSettings.croppedWidth = screen.width;
    // this.cropperSettings.croppedHeight = screen.width;
    // this.cropperSettings.canvasWidth = screen.width;

    this.product = params.data.product;
    this.productOrShop = "product";
    this.actionSheet = actionSheet;
    this.PointDefiner = ImgWarper.PointDefiner;
    this.Warper = ImgWarper.Warper;
    this.Point = ImgWarper.Point;
    this.Animator = ImgWarper.Animator;
    this.f.api_key = "0ef14fa726ce34d820c5a44e57fef470";
    this.f.api_secret = "4Y9YXOMSDvqu1Ompn9NSpNwWQFHs1hYD";
    this.f.img = params.data.product.faceImageURL;
    console.log(params.data.product);
    this.faceImagePoints = params.data.product.faceImagePoints;
    // storage.set('userImagePoints','value');

    // for (var x = 0; x < params.data.product.faceImagePoints.length; x++) {
    //   this.faceImagePoints[x] = new this.Point(params.data.product.faceImagePoints[x].x * 3, params.data.product.faceImagePoints[x].y * params.data.product.faceImageHeight * 3 / params.data.product.faceImageWidth);
    // }
    // this.setImage(this.result3, params.data.product.faceImage);
    // // this.pointDefiner3.value = new this.PointDefiner(this.result3.nativeElement, this.f.img, this.imageData);
    // // this.pointDefiner3.value.oriPoints = this.faceImagePoints;
    // // this.pointDefiner3.value.dstPoints = this.faceImagePoints;
    // // this.pointDefiner3.value.redraw();


    // this.storage.get('userImage').then((data) => {
    //
    // });

    //console.log("start");
    this.checkLogin.load()
      .then(data => {
        this.validation = data
        this.alreadyLoggedIn = true;
      });
  }


  convert2Array(val) {
    return Array.from(val);
  }

  setImage(theCanvas, theImage) {
                    console.log("start setImage")

    var ratio = theCanvas.nativeElement.width / theImage.naturalWidth;      // set canvas1 size big enough for the image
    theCanvas.nativeElement.height = theImage.naturalHeight*ratio;
    // console.log(theImage.naturalWidth);
    //console.log(theCanvas.nativeElement.height);
    var ctx = theCanvas.nativeElement.getContext("2d");
    ctx.drawImage(theImage,0,0, theImage.naturalWidth, theImage.naturalHeight, 0, 0, theCanvas.nativeElement.width, theCanvas.nativeElement.height);
    //console.log("after1");
    theImage.width = theCanvas.nativeElement.width;
    theImage.height = theCanvas.nativeElement.height;
    //console.log("after2");
    var theImageData;
    //console.log("after3");


    theImageData = ctx.getImageData(0, 0, theImage.width, theImage.height);
    this.imageData = theImageData;
    // console.log("115:"+ctx.getImageData(0,0,theImage.width, theImage.height));


  }

  inputModelImage(event) {
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function(e) {
      self.uploadedImg.data = reader.result;
      //console.log(self.uploadedImg);
      self.f.img = atob(reader.result.split(',')[1]);
      self.getFaceLandmarks(self.f, reader.result, self.result3, self.pointDefiner3);
    }
    reader.readAsDataURL(file);
    //console.log(this.uploadedImg );
  }

  inputUserImage(event) {
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function(e) {
      self.uploadedImg.data = reader.result;
      //console.log(self.uploadedImg);
      //var addon ={"img": atob(reader.result.split(',')[1])};
      //Object.assign( self.f,  self.f, addon);
      self.f.img = atob(reader.result.split(',')[1]);
      self.getFaceLandmarks(self.f, reader.result, self.result4, self.pointDefiner4);
    }
    reader.readAsDataURL(file);
  }

  getFaceLandmarks(f,readerResult,result,pointDefiner){

    var self = this;
    var buff = new ArrayBuffer(f.img.length);
    var arr = new Uint8Array(buff);

// blobの生成
    for(var i = 0,  dataLen = f.img.length; i < dataLen; i++){
      arr[i] = f.img.charCodeAt(i);
    }
    var blob = new Blob([arr], {type: 'image/png'});

    var formData = new FormData();
    formData.append('img', blob);

    this.http.post('http://apicn.faceplusplus.com/v2/detection/detect'+'?api_key='+f.api_key+'&api_secret='+f.api_secret, formData)
      .map(res => res.json())
      .subscribe(faceLandmarks => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(faceLandmarks);
        this.product = faceLandmarks;
        // console.log(faceLandmarks1.face[0].position);
        self.f.face_id = faceLandmarks.face[0].face_id;

        this.http.get('http://apicn.faceplusplus.com/v2/detection/landmark'+'?api_key='+f.api_key+'&api_secret='+f.api_secret+'&face_id='+f.face_id+'&type=83p')
          .map(res => res.json())
          .subscribe(landmarkResult => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            console.log(landmarkResult);
            var array = Object.keys(landmarkResult.result[0].landmark).map(key => landmarkResult.result[0].landmark[key]);
            var array1 = Object.keys(landmarkResult.result[0].landmark).map(key => key);

            for (var i = 0; i < array.length; i++) {
              if (typeof array[i] != "object") {
                array.splice(i, 1);
              }
            }

            for (var i = 0; i < array1.length; i++) {
              if (array1[i] == "height" || array1[i] == "width") {
                array1.splice(i, 1);
              }
            }
            var oldKeyArray = [].concat(array1);

            var facePoints = array;
            array1.sort();
            for (var i = 0; i < array1.length; i++) {
              var j = oldKeyArray.indexOf(array1[i]);
              facePoints[i] = array[j];
            }
            this.storage.ready().then(() => {

            this.storage.set('userImagePoints',facePoints);
            this.storage.set('userImage',readerResult);
            })
            this.morphingPrepare(readerResult, facePoints, result, pointDefiner, false )

            // var image = new Image();
            // var self = this;
            //
            // image.onload = function () {
            //   self.setImage(result, image);
            //   console.log(image);
            //   pointDefiner.value = new self.PointDefiner(result.nativeElement, image, self.imageData);
            //
            //   for (var x = 0; x < facePoints.length; x++) {
            //     facePoints[x] = new self.Point(facePoints[x].x * 3, facePoints[x].y * image.naturalHeight * 3 / image.naturalWidth);
            //   }
            //   pointDefiner.value.oriPoints = facePoints;
            //   pointDefiner.value.dstPoints = facePoints;
            //   pointDefiner.value.redraw();
            //
            //   self.inputUserImageSize.height = this.height;
            //   self.inputUserImageSize.width = this.width;
            //
            //
            //   console.log(this.width);
            // }
            //
            // image.src = readerResult;
          });
      });
  }

  makeup(){
    console.log(this.pointDefiner3);
    console.log(this.pointDefiner4);
    this.animatorResult = new this.Animator(this.pointDefiner3.value, this.pointDefiner4.value);
    this.animatorResult.generate(6);
    this.drawResult();
  }

  drawResult() {
    var frames = this.animatorResult.frames;
    var res_ctx = this.result5.nativeElement.getContext('2d');
    console.log(this.inputUserImageSize);
    this.result5.nativeElement.height = this.inputUserImageSize.height;
    res_ctx.putImageData(frames[3],0,0);
    var res_ctx2 = this.result6.nativeElement.getContext('2d');
    this.result6.nativeElement.height = this.inputUserImageSize.height;
    res_ctx2.putImageData(frames[4],0,0);
  }

  onViewWillEnter() {
    this.events.publish('hideTabs');
    console.log("will enter")

    console.log(this.result3);
  }



  morphingPrepare(srcData, imagePoints, canvasResult, pointDefiner, cors) {
                console.log("start prepare")
    var dt = srcData
    //console.log("Local Storage value:", dt)
    var i = new Image();
    var self = this;

    if(cors == true){
      i.crossOrigin = 'Anonymous';
    }
    console.log("before setImage")
    i.onload = function () {
      self.setImage(canvasResult, i);
      //console.log(imagePoints)
      for (var x = 0; x < imagePoints.length; x++) {
        imagePoints[x] = new self.Point(imagePoints[x].x * 3, imagePoints[x].y * i.naturalHeight * 3 / i.naturalWidth);
      }
      pointDefiner.value = new self.PointDefiner(canvasResult.nativeElement, i, self.imageData);
      pointDefiner.value.oriPoints = imagePoints;
      pointDefiner.value.dstPoints = imagePoints;
      //pointDefiner.value.redraw();
    };
    i.src = dt;
  }

  ionViewDidEnter(){

    var image = new Image();
    image.crossOrigin = 'Anonymous';

    var self = this;

    image.onload = function () {
      self.setImage(self.result3, image);
      console.log(image);
      self.pointDefiner3.value = new self.PointDefiner(self.result3.nativeElement, image, self.imageData);
      var facePoints = [];

      self.product.faceImagePoints.forEach((x) => {
        facePoints.push(Object.assign({}, x));
      });

      console.log("self.product.faceImagePoints");
      console.log(facePoints);
      for (var x = 0; x < facePoints.length; x++) {
        facePoints[x] = new self.Point(facePoints[x].x * 3, facePoints[x].y * image.naturalHeight * 3 / image.naturalWidth);
      }
      self.pointDefiner3.value.oriPoints = facePoints;
      self.pointDefiner3.value.dstPoints = facePoints;
      // self.pointDefiner3.value.redraw();
    }


    image.src = this.product.faceImageURL;

    console.log("did enter")

    this.storage.ready().then(() => {

    this.storage.get('userImagePoints').then((pointsData) => {

        this.storage.get('userImage').then((data) => {

          this.morphingPrepare(data, pointsData, this.result4, this.pointDefiner4, false )

        });
      });
})

  }

}
