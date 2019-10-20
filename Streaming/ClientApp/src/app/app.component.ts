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

  base = 60;

  from = this.base;
  to = 65;



  public audioContext: any;
  public source : any;

  public loadMOAR = () => {
    this.loadStream(this.from, this.to);
  }

  bp = 0;

  public loadStream = (f: Number, t: Number ) => {

    let params = {
      file: "sanya.mp3",
      from: String(this.from),
      to: String(this.to)
    }
    // 00:00:00.0261224
    // 00:00:00.0522448
    //
    //


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
        let offs = this.to - this.base - 0.261224 * 15
        this.bp+=this.source.buffer.duration+  0.00001;
        console.log(this.bp);
        this.source.start(this.bp);
        this.from+=5;
        this.to+=5;
        // this.source.onended = e => {
        //   this.loadStream(this.from, this.to);
        // }
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
