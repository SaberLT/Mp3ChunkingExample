import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  public file : ArrayBuffer;
  public text : string;

  public test = () => {
    let params = {
      data: "parameter"
    };

    this.http.get(this.baseUrl+'api/audio/test', {
       responseType: 'text',
       params
    }).subscribe((result : string) => {
      this.text = result;
      console.log(result);
    }, error => console.error(error));
  }

  public audioContext: any;
  public source : any;

  public loadStream = () => {
    let params = {
      file: "djip.mp3",
      from: "60",
      to: "65"
    }

    this.http.get(this.baseUrl+"api/audio/loadFile", {
      responseType: 'arraybuffer',
      params
    }).subscribe((result : ArrayBuffer) => {
      this.file = result;
      console.log(result);
      var promise = this.audioContext.decodeAudioData(result, (buff) => {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = buff;
        this.source.connect(this.audioContext.destination);
        this.source.start();
      }, error => console.log(error))

      // this.file = result;
      // console.log(result);

      // var promise = this.audioContext.decodeAudioData(this.file, (buff)=>{
      //   this.source.buffer = buff;
      //   this.source.connect(this.audioContext.destination);
      //   this.source.loop = true;
      // }, (error) => {
      //   console.error(error);
      // });
      // if(promise)
      //   promise.catch((error) => {
      //     console.log(error);
      //   })

    }, error => console.error(error));
  }

  gesture = () => {
    // this.audioContext = new AudioContext();
    // this.source = this.audioContext.createBufferSource();

    this.audioContext = new (window['AudioContext'] || window['webkitAudioContext']);

    console.log('Gesture complete!');
  }

  ngOnInit() {
    
  }
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
    ) {
      

    //http.get<string>()
  }
}
