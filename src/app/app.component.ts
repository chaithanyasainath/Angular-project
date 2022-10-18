import { Component, VERSION,  ViewChild, ElementRef, OnInit } from '@angular/core';
import '@tensorflow/tfjs-backend-webgl';
import * as blazeface from '@tensorflow-models/blazeface';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  video!: any;
  state = 0;
  can!: any;
  ctx!: any;

  async ngOnInit() {
    // navigator.permissions
    //   .query({ name: 'camera' })
    //   .then(function (permissionStatus) {
    //     if (permissionStatus.state == 'denied') {
    //       alert('Please give camera permission');
    //       console.log(permissionStatus.state);
    //     } else if (permissionStatus.state == 'granted') {
    //       console.log('Granted');
    //     }
    //     permissionStatus.onchange = function () {
    //       if (permissionStatus.state == 'denied') {
    //         console.log(permissionStatus.state);
    //         alert('Please refresh and give camera permission');
    //       }
    //     };
    //   });
    this.can = document.getElementById('canv');
    this.can.width = 500;
    this.ctx = this.can.getContext("2d");
    this.ctx.ellipse(150, 60, 65, 50, 0, 0, angularMath.getPi()*2);
    this.ctx.stroke();
    this.setupCamera();
    this.predictFace();
  }
  setupCamera() {
    
    this.video = document.getElementById('video');
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
        },
      })
      .then((stream) => {
        this.video.srcObject = stream;
        // this.predictFace();
      })
      .catch((err) => {
        if (err.name == 'NotAllowedError') {
          console.log('Permission denied');
          alert('Please give camera permission');
          // this.setupCamera();
        }
      });
  }
  async predictFace() {
    const model = await blazeface.load();
    console.log('Model Loaded');
    setInterval(async () => {
      const predictions = model.estimateFaces(this.video);
      if ((await predictions).length > 0) {
        for (let i = 0; i < (await predictions).length; i++) {
          console.log((await predictions));
        }
      }
    }, 1000);
  }
}
