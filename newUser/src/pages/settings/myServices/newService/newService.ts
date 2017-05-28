import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate/ng2-translate';

declare var ImgWarper: any;

import {UserProvider} from '../../../../providers/userProvider'
import {Storage} from '@ionic/storage'

import moment from 'moment';
//Japan locale
import 'moment/src/locale/ja';

//China locale
import 'moment/src/locale/zh-cn';


//timezone
import 'moment-timezone';

@Component({
selector: 'page-newService',
templateUrl: 'newService.html',
providers: [UserProvider]
})
export class NewServicePage {
@ViewChild('imageButton') selectImage;
@ViewChild('faceImageButton') selectFaceImage;

  PointDefiner: any;
  Warper: any;
  Point: any;
  Animator: any;
  password: String;
  validation: any = {}
  alreadyLoggedIn = {data:false};

  product:any = {
  serviceProvider:{},
  imageURL: null,
  faceImageURL: null
  };

  uploadedImg = {data: undefined};
  f = {api_key: undefined, api_id: undefined, api_secret: undefined, img: undefined, face_id: undefined,category:undefined};
  year : number;
  month :number;
  day :number;
  buttonDisabled : boolean;
  selected1

  options: any = [
  {'name':'Guide','val':'{"name":"guide"}'},
  {'name':'Teach','val':'{"name":"teach"}'},
  {'name':'Housework','val':'{"name":"Housework"}'},
  {'name':'Fix','val':'{"name":"fix"}'},
  {'name':'BeautySkinCare','val': '{"name":"beauty","sub":"skinCare"}'},
  {'name':'BeautyMakeup','val': '{"name":"beauty","sub":"makeup"}'},
  {'name':'BeautyDiet','val': '{"name":"beauty","sub":"diet"}'},
  {'name':'BeautySurgery','val': '{"name":"beauty","sub":"surgery"}'},
  {'name':'BeautyOthers','val': '{"name":"beauty","sub":"others"}'},
  {'name':'Job Hunt','val':'{"name":"jobHunt"}'},
  {'name':'School Find','val':'{"name":"schoolFind"}'},
  {'name':'Biz Advise','val':'{"name":"bizAdvise"}'},
  {'name':'Law','val':'{"name":"law"}'},
  {'name':'Others','val':'{"name":"others"}'}
  ]

  constructor(public navCtrl: NavController,
              private events: Events,
              private http: Http,
              public storage:Storage,
              private toastCtrl: ToastController,
              private translate: TranslateService,
              private userProvider: UserProvider) {

    this.buttonDisabled = false;


    this.f.api_key = "0ef14fa726ce34d820c5a44e57fef470";
    this.f.api_secret = "4Y9YXOMSDvqu1Ompn9NSpNwWQFHs1hYD";

    // this.PointDefiner = ImgWarper.PointDefiner;
    // this.Warper = ImgWarper.Warper;
    // this.Animator = ImgWarper.Animator;
    let startTime = new Date()
    let endTime = new Date()
    startTime.setMinutes(0)
    endTime.setMinutes(0)
    this.product.startTime = startTime.toISOString();
    this.product.endTime = endTime.toISOString();

  }
  ionViewWillEnter() {
  this.userProvider.loadLocalStorage()
  .then(data => {
    this.validation = data
    this.product.serviceProvider._id = this.validation._id;
    this.product.serviceProvider.id = this.validation.id;
    this.product.serviceProvider.password = this.validation.password;
    this.product.serviceProvider.nickname = this.validation.nickname;
    this.product.serviceProvider.imageURL = this.validation.imageURL;
    this.alreadyLoggedIn.data = true;
  });
  }

  category1Selected(){
    if(this.selected1){
    this.product.category=JSON.parse(this.selected1)
    }
  }

  uploadImageTrigger(){
    console.log("imgtrigger")
    this.selectImage.nativeElement.click()
  }

  uploadFaceImageTrigger(){
  console.log("faceimgtrigger")

    this.selectFaceImage.nativeElement.click()
  }

  uploadImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
     console.log("1")
      self.product.imageURL = reader.result;
      console.log("2")
      self.presentToast()

    }
    reader.readAsDataURL(file);

  }

  uploadFaceImage(event) {
    console.log("upla")
    var eventTarget = event.srcElement || event.target;
    //console.log( eventTarget.files);
    //console.log( eventTarget.files[0].name);

    var file = eventTarget.files[0];
    var reader = new FileReader();
    var self = this;

    reader.onload = function (e) {
      self.uploadedImg.data = reader.result;
      //console.log(self.uploadedImg);
      //var addon ={"img": atob(reader.result.split(',')[1])};
      //Object.assign( self.f,  self.f, addon);
      self.product.faceImageURL = reader.result;

      self.f.img = atob(reader.result.split(',')[1]);

      self.getFaceLandmarks(self.f, reader.result);

    }
    reader.readAsDataURL(file);
  }

  getFaceLandmarks(f, readerResult) {

    var self = this;
    var buff = new ArrayBuffer(f.img.length);
    var arr = new Uint8Array(buff);

// blobの生成
    for (var i = 0, dataLen = f.img.length; i < dataLen; i++) {
      arr[i] = f.img.charCodeAt(i);
    }
    var blob = new Blob([arr], {type: 'image/png'});

    var formData = new FormData();
    formData.append('img', blob);

    this.http.post('http://apicn.faceplusplus.com/v2/detection/detect' + '?api_key=' + f.api_key + '&api_secret=' + f.api_secret, formData)
      .map(res => res.json())
      .subscribe(faceLandmarks => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        console.log(faceLandmarks);

        if(faceLandmarks.face.length<1){
          alert("无法监测到人脸！")
        }else {
          // console.log(faceLandmarks1.face[0].position);
          self.f.face_id = faceLandmarks.face[0].face_id;

          this.http.get('http://apicn.faceplusplus.com/v2/detection/landmark' + '?api_key=' + f.api_key + '&api_secret=' + f.api_secret + '&face_id=' + f.face_id + '&type=83p')
            .map(res => res.json())
            .subscribe(landmarkResult => {


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


              var image = new Image();
              var self = this;

              image.onload = function () {
                console.log(facePoints)
                self.product.faceImagePoints = facePoints;
                self.product.faceImageHeight = image.naturalHeight;
                self.product.faceImageWidth = image.naturalWidth;


                if (facePoints != undefined) {
                  //alert("添加成功!");
                  self.presentToast()
                } else {
                  alert("添加失败!");
                }
              }

              image.src = readerResult;
            });
        }
      },
        error =>  {
          alert("添加失败")
        });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '添加成功',
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log(' ');
    });

    toast.present();
  }

  start(){
   console.log(this.product.startTime)
  }

  replaceProduct() {
    this.buttonDisabled = true;
    console.log(this.product)
    if (this.product.serviceProvider.id && this.product.productName&& this.product.startTime&& this.product.endTime&&this.product.userNumberLimit) {
      console.log(this.product)
    //  var pricePerHour = this.validation.pricePerHour || 1000
    //  var duration = moment.duration(moment(this.product.endTime).diff(moment(this.product.startTime)));
    //  var hours = duration.asHours();

      var serviceProviderArray = [];
      serviceProviderArray.push({"id":this.validation.id, "nickname":this.validation.nickname})

      this.product.event = {
        title: this.product.productName,
        serviceType: 'event',
        startTime: this.product.startTime,
        endTime: this.product.endTime,
        allDay: false,
        creatorId: this.validation.id,
        serviceProvider: serviceProviderArray,
        user: [],
        serviceProviderNumberLimit: 1,
        userNumberLimit: this.product.userNumberLimit,
        repeat: 0,
        action: "put",
        price: this.product.retail
      }

      this.http.post("http://ec2-54-238-200-97.ap-northeast-1.compute.amazonaws.com:3000/product", this.product)
        .subscribe(data => {
            console.log(data);
            alert(data.statusText)
            this.buttonDisabled = false;
          },
          (err) => {
            console.log(err._body);
            this.buttonDisabled = false;
          }
        )
    }else{
    alert("Please login first, then input product name, start time, end time and userNumberLimit!")
      this.buttonDisabled = false;

    }
  }
}
