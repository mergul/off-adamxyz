import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  OnDestroy,
  HostListener,
  NgZone,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, zip } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { SignalingConnection } from '../core/signaling.connection';
import { SpeechService, RecognitionResult } from '../core/speech-service';
import { map, takeUntil } from 'rxjs/operators';
import { ReactiveStreamsService } from '../core/reactive-streams.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScriptLoaderService } from '../core/script-loader.service';
import { DOCUMENT } from '@angular/common';
declare var VideoStreamMerger: any;

declare interface Window {
  VideoStreamMerger: any;
}
interface CameraEvent {
  peer?: string;
  fakeStream?: MediaStream;
  realStream?: MediaStream;
  user?: string;
}

@Component({
  selector: 'app-camerad',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, OnDestroy, AfterViewInit {
  currentLanguage = 'en';
  finalTranscript!: string;
  targetLanguage = 'tr';
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef;
  @ViewChild('soundCanvas', { static: true })
  soundCanvas!: ElementRef;
  foods!: Observable<MediaDeviceInfo[]>;
  videoWidth = 0;
  videoHeight = 0;

  private constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 760 },
      height: { ideal: 480 },
      frameRate: { ideal: 20, max: 30 },
    },
    audio: {
      sampleSize: 16,
      channelCount: 2,
      echoCancellation: false,
    },
  };
  animalControl = new FormControl('', [Validators.required]);
  chunks = [];
  audioCtx: any;
  canvasCtx: any;
  isRecording = false;

  @ViewChild('startButton', { static: true })
  startButton!: ElementRef;
  @ViewChild('localVideo', { static: true })
  localVideo!: ElementRef;
  @ViewChild('remoteVideo', { static: true })
  remoteVideo!: ElementRef;
  @ViewChild('publicChatBox', { static: true })
  publicChatBox!: ElementRef;
  @ViewChild('textBox', { static: true })
  textBox!: ElementRef;
  @ViewChild('privateChatBox', { static: true })
  privateChatBox!: ElementRef;
  @ViewChild('speechTextBox', { static: true })
  speechTextBox!: ElementRef;

  clones: any[] = [];
  startButtonDisabled = false;
  callButtonDisabled = true;
  hangupButtonDisabled = true;
  chatBoxDisabled = true;
  startTime!: number;
  private localStream!: MediaStream;
  private remoteStreamMap: Map<string, MediaStream> = new Map<
    string,
    MediaStream
  >();
  private peerLStream: Map<string, string[]> = new Map<string, string[]>();
  private peerRStream: Map<string, string[]> = new Map<string, string[]>();
  private mediaMap: Map<string, string> = new Map<string, string>();
  private hangedUps: string[] = [];
  private offerOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };
  private refreshOfferOptions: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
    iceRestart: true,
  };
  clientID!: string;
  private peerConnection!: RTCPeerConnection;
  private signalingConnection!: SignalingConnection;
  userList!: [];
  username!: string;
  targetUsername!: string;
  private caSubject = new BehaviorSubject<CameraEvent>({});
  peerList: Map<string, RTCPeerConnection> = new Map<
    string,
    RTCPeerConnection
  >();
  bandwidth = 30;
  private dataChannel!: RTCDataChannel;
  private receiveChannel!: RTCDataChannel;
  private dataChannelList: Map<string, RTCDataChannel> = new Map<
    string,
    RTCDataChannel
  >();
  private makingOffer = false;
  recognizing = false;
  speechMessages!: Observable<RecognitionResult>;
  languages: string[] = ['en', 'es', 'de', 'fr', 'tr'];
  private readonly onDestroy = new Subject<void>();
  joinedUser = '';
  loggedUser = '';
  isNew = '';
  private yostream = false;
  merger: typeof VideoStreamMerger;
  sender!: RTCRtpSender;
  transceiver!: RTCRtpTransceiver;

  constructor(
    private reactive: ReactiveStreamsService,
    private renderer: Renderer2,
    private scriptService: ScriptLoaderService,
    private speechService: SpeechService,
    private zone: NgZone,
    private _snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document
  ) {
    if (!this.scriptService.checkExists('2')) {
      this.scriptService
        .injectScript(
          this.renderer,
          this._document,
          'https://webrtc.github.io/adapter/adapter-latest.js',
          'script',
          '2',
          '',
          'anonymous'
        )
        .then((val) => val);
    }
    if (!this.scriptService.checkExists('3')) {
      this.scriptService
        .injectScript(
          this.renderer,
          this._document,
          'https://cdn.jsdelivr.net/npm/video-stream-merger@3.6.1/dist/video-stream-merger.min.js',
          'script',
          '3',
          '',
          'anonymous'
        )
        .then((val) => {
          this.merger = new VideoStreamMerger();
          this.merger.start();
        });
    }
  }

  gotDevices(mediaDevices: MediaDeviceInfo[]) {
    return mediaDevices.filter((value) => value.kind === 'videoinput');
  }
  @HostListener('window:pagehide', ['$event'])
  async doSomething() {
    await this.closeAllVideoCall();
    this.signalingConnection.connection.close();
  }
  vidOff(stream: MediaStream) {
    let tracks: any;
    if (stream != null) {
      tracks = stream.getTracks();
    }
    if (tracks) {
      tracks.forEach(function (track) {
        track.stop();
      });
    }
  }
  ngAfterViewInit(): void {
    if (!this.speechService._supportRecognition) {
      this._snackBar.open(
        'Your Browser has no support for Speech!',
        'Try Chrome for Speech!',
        {
          duration: 3000,
        }
      );
    }
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      this.trace('Requesting local stream');
      this.startButtonDisabled = true;
      this.foods = from(
        navigator.mediaDevices.enumerateDevices().then(this.gotDevices)
      );
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then(this.attachVideo.bind(this))
        .catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  stopSample = async (user) => {
    this.startButtonDisabled = false;
  };

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechService.setLanguage(this.currentLanguage);
  }
  onSelectTargetLanguage(language: string) {
    this.targetLanguage = language;
  }
  // public record() {
  //     this.isRecording = true;
  //     this.mediaRecorder.start();
  // }
  // public stop() {
  //     this.isRecording = false;
  //     this.mediaRecorder.stop();
  // }
  capture() {
    this.renderer.setProperty(
      this.canvas.nativeElement,
      'width',
      this.videoWidth
    );
    this.renderer.setProperty(
      this.canvas.nativeElement,
      'height',
      this.videoHeight
    );
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.localVideo.nativeElement, 0, 0);
  }
  handleError(error) {
    console.log('Error: ', error);
  }
  onBookChange($event: MatSelectChange) {
    this.constraints.video.facingMode =
      this.constraints.video.facingMode === 'user' ? 'environment' : 'user';
    console.log($event.value);
  }
  onSignalingMessage = async (msg) => {
    let text = '';
    const time = new Date(msg.date);
    const timeStr = time.toLocaleTimeString();
    switch (msg.event) {
      case 'id':
        if (!this.clientID) {
          this.clientID = msg.id;
        }
        this.userList = msg.users;
        this.setUsername();
        break;
      case 'message':
        text =
          '<div style="background: #e1ffc7; margin-bottom: 10px; padding: 10px">' +
          '<strong>' +
          msg.id +
          '</strong> <br>' +
          msg.text +
          '<span>' +
          '<span style="padding: 10px; float: right;">' +
          timeStr +
          '</span>' +
          '</span></div>';
        break;
      case 'rejectusername':
        this.username = msg.name;
        console.log(
          `Your username has been set to <${msg.name}> because the name you chose is in use`
        );
        break;

      case 'userlist': // Received an updated user list
        this.userList = msg.users;
        break;

      case 'offer': // our offer
        console.log(
          'Calling handleConnectionOffer from PeerConnection.onSignalingMessage'
        );
        await this.handleConnectionOffer(msg);
        break;

      case 'answer': // Callee has answered our offer
        console.log(
          'Calling handleConnectionAnswer from PeerConnection.onSignalingMessage'
        );
        await this.handleConnectionAnswer(msg);
        break;

      case 'candidate': // A new ICE candidate has been received
        await this.newICECandidate(msg);
        break;

      case 'hang-up': // The other peer has hung up the call
        // await this.handleHangUpMsg(msg);
        break;
    }
    if (text.length) {
      this.renderer.setProperty(
        this.publicChatBox.nativeElement,
        'innerHTML',
        this.publicChatBox.nativeElement.innerHTML + text
      );
      this.publicChatBox.nativeElement.scrollTop =
        this.publicChatBox.nativeElement.scrollHeight -
        this.publicChatBox.nativeElement.clientHeight;
    }
  };
  handleSendButton = (message) => {
    const msg = {
      text: message,
      event: 'message',
      id: this.clientID,
      room: this.loggedUser,
      date: Date.now(),
    };
    this.signalingConnection.sendToServer(msg);
    this.textBox.nativeElement.value = '';
  };
  handleKey = (evt) => {
    if (evt.keyCode === 13 || evt.keyCode === 14) {
      if (!this.chatBoxDisabled) {
        this.handleSendButton(this.textBox.nativeElement.value);
      }
    }
  };
  setUsername = () => {
    if (!this.username) {
      this.username = this.clientID;
    }
  };
  newICECandidate = async (msg) => {
    try {
      const candidate = new RTCIceCandidate(msg.candidate);
      await this.peerList.get(msg.source)?.addIceCandidate(candidate);
    } catch (error) {}
  };

  ngOnInit() {
    this.joinedUser = window.history.state ? window.history.state.userID : '';
    this.loggedUser = window.history.state ? window.history.state.loggedID : '';
    this.reactive.closeSources();
    this.signalingConnection = new SignalingConnection(
      'busra.nur:65080/ws',
      () => (this.startButtonDisabled = false),
      this.onSignalingMessage,
      this.joinedUser,
      this.loggedUser
    );
    this.speechService.init();
    if (this.speechService._supportRecognition) {
      this.speechService.initializeSettings(this.currentLanguage);
      this.speechMessages = this.speechService.getMessage().pipe(
        map((text) => {
          this.finalTranscript = text.transcript ? text.transcript : '';
          if (text.transcript && text.info === 'final_transcript') {
            this.chatBoxDisabled = false;
            this.speechService
              .translate({
                q: this.finalTranscript,
                target: this.targetLanguage,
                source: this.currentLanguage,
              })
              .pipe(takeUntil(this.onDestroy))
              .subscribe((value) => {
                this.handleSendButton(value);
              });
            this.handleSendButton(this.finalTranscript);
          }
          return text;
        })
      );
    }
  }

  handleNegotiationNeededEvent = async (
    event,
    mypeer,
    isnew,
    streamf: boolean
  ) => {
    try {
      this.makingOffer = true;
      console.log(
        'offer is created by caller: ' +
          this.username +
          ' to callee ---> ' +
          mypeer +
          ' state is --> ' +
          this.peerList.get(mypeer)?.signalingState +
          ' isnew -->' +
          isnew +
          ' streamf --> ' +
          streamf
      );
      const offer = await this.peerList.get(mypeer)?.createOffer(event);
      if (
        this.peerList.get(mypeer)?.signalingState !== 'stable' ||
        (streamf && mypeer === this.targetUsername)
      ) {
        console.log(
          'not stable! offer could not be created by : ' +
            this.username +
            ' to ---> ' +
            mypeer +
            ' state is --> ' +
            this.peerList.get(mypeer)?.signalingState +
            ' isnew -->' +
            isnew +
            ' streamf --> ' +
            streamf
        );
        return;
      }
      if (offer) {
        offer.sdp = offer?.sdp?.replace(
          /(m=video.*\r\n)/g,
          `$1b=AS:${this.bandwidth}\r\n`
        );
        await this.peerList.get(mypeer)?.setLocalDescription(offer);
        let mystreams = '';
        if (isnew !== '') {
          const malis: any[] = [];
          if (this.peerLStream.get(mypeer)) {
            this.peerLStream.get(mypeer)?.forEach((h) => malis.push(h));
          }
          if (this.peerRStream.get(this.targetUsername)) {
            this.peerRStream.get(this.targetUsername)?.forEach((hd) => {
              if (!malis.includes(hd)) {
                malis.push(hd);
              }
            });
          }
          mystreams = malis.join(',');
        } else {
          mystreams = this.clones[0].id;
          if (this.peerLStream.get(mypeer)) {
            this.peerLStream
              .get(mypeer)
              ?.forEach((h) => (mystreams += ',' + h));
          }
          this.remoteStreamMap.forEach((yul) => {
            if (
              !this.peerRStream.get(mypeer) ||
              !this.peerRStream.get(mypeer)?.includes(yul.id)
            ) {
              mystreams += ',' + yul.id;
            }
          });
          if (this.targetUsername === mypeer && streamf) {
            console.log(
              event +
                ' offer could not be created by : ' +
                this.username +
                ' to ---> ' +
                mypeer +
                ' with streams --> ' +
                mystreams
            );
            return;
          }
          this.peerLStream.set(mypeer, mystreams.split(','));
        }
        console.log(
          event +
            ' ---> Creating offer by : ' +
            this.username +
            ' to ---> ' +
            mypeer +
            ' with streams --> ' +
            mystreams +
            'merger: ' +
            this.merger._streams.length
        );
        if (this.merger._streams.length > 1) {
          mystreams = '';
          this.merger._streams.forEach((dd) => (mystreams += dd.id + ','));
        }
        console.log('sendToServer an offer: ', mystreams);
        this.signalingConnection.sendToServer({
          name: this.username,
          target: mypeer,
          streams: mystreams,
          polite: isnew !== '',
          event: 'offer',
          sdp: this.peerList.get(mypeer)?.localDescription,
        });
      }
    } catch (err) {
      console.error('offer creation error', err);
    } finally {
      console.log('offer creation finaled', mypeer);
      this.makingOffer = false;
    }
  };
  attachVideo(stream) {
    console.log('attachVideo merger: ' + this.merger.width, this.merger.height);
    this.localStream = stream;
    this.clones.push(this.localStream.clone());
    this.merger.addStream(this.clones[this.clones.length - 1], {
      x: 0,
      y: 0,
      width: this.merger.width / (this.clones.length + 1),
      height: this.merger.height / (this.clones.length + 1),
      // index: 0,
      mute: false,
    });
    this.renderer.setProperty(
      this.localVideo.nativeElement,
      'srcObject',
      this.merger.result
    );
    this.renderer.listen(this.localVideo.nativeElement, 'play', () => {
      this.videoHeight = this.localVideo.nativeElement.videoHeight;
      this.videoWidth = this.localVideo.nativeElement.videoWidth;
    });

    this.trace('Received local stream: ' + this.clones[0].id);
    this.callButtonDisabled = false;
    if (this.speechService._supportRecognition) {
      if (this.recognizing) {
        this.speechService.stop();
        return;
      }
      this.speechService.startSpeech(stream.startTime);
    }
  }
  createPeerConnection = () => {
    if (this.peerList.has(this.targetUsername)) {
      const yo = this.peerList.get(this.targetUsername);
      this.peerConnection = yo ? yo : this.peerConnection;
      return;
    }
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });
    this.peerList.set(this.targetUsername, this.peerConnection);
    this.peerConnection.onicecandidate = (event) =>
      this.handleICECandidateEvent(event);
    this.peerConnection.oniceconnectionstatechange =
      this.handleICEConnectionStateChangeEvent;
    this.peerConnection.onicegatheringstatechange =
      this.handleICEGatheringStateChangeEvent;
    this.peerConnection.onsignalingstatechange =
      this.handleSignalingStateChangeEvent;
    this.peerConnection.onnegotiationneeded = () =>
      this.handleNegotiationNeededEvent(
        this.offerOptions,
        this.targetUsername,
        this.isNew,
        this.yostream
      );
    this.peerConnection.ontrack = this.gotRemoteStream.bind(this);
    // this.localStream
    //   .getTracks()
    //   .forEach((track) =>
    //     this.peerConnection.addTrack(track, this.localStream)
    //   );
  };
  setLocalStreams = async (isAnswerer) => {
    // if (!isAnswerer) {
    //   this.merger.addStream(this.localVideo.nativeElement.srcObject, {
    //     x: 0,
    //     y: 0,
    //     width: this.merger.width / 2,
    //     height: this.merger.height / 2,
    //     mute: false,
    //   });
    // }
    // this.localStream = this.merger.result;
    for (const track of this.merger.result.getTracks()) {
      if (!isAnswerer) {
        console.log('setLocalStreams at senders: ' + isAnswerer);
        // this.peerConnection.addTrack(track, this.merger.result);
        this.peerList
          .get(this.targetUsername)
          ?.addTrack(track, this.merger.result);
      } else {
        console.log('setLocalStreams at receivers: ' + isAnswerer);
        // this.peerConnection.addTransceiver(track, {
        //   streams: [this.merger.result],
        // });
        this.peerList
          .get(this.targetUsername)
          ?.addTransceiver(track, { streams: [this.merger.result] });
      }
    }
  };
  gotRemoteStream = (e) => {
    console.log(
      'set RemoteStream by: ' +
        this.username +
        ' clones length: ' +
        this.clones.length +
        'estreams length: ' +
        e.streams.length
    );
    if (!this.clones.some((value) => value.id === e.streams[0].id)) {
      console.log(
        'gotRemoteStream merger.x: ' +
          this.merger.width / (this.clones.length + 1)
      );
      this.clones.push(e.streams[0]);
    }
    const rew = this.merger._streams.at(this.clones.length - 1);
    if (!rew || rew.id !== this.clones[this.clones.length - 1].id) {
      this.merger.addStream(this.clones[this.clones.length - 1], {
        x: this.merger.width / this.clones.length,
        y: this.merger.height / this.clones.length,
        width: this.merger.width,
        height: this.merger.height,
        // index: 0,
        mute: false,
      });
      this.renderer.setProperty(
        this.remoteVideo.nativeElement,
        'srcObject',
        this.merger.result
      );
    }
  };
  callUser = async (user) => {
    this.yostream = false;
    this.targetUsername = user;
    console.log('peer list size --> ' + this.peerList.size);
    this.createPeerConnection();
    this.createDataChannel();
    await this.setLocalStreams(false);
    // if (this.clones.length > 0) {
    // this.merger.addStream(this.localStream, {
    //   x: this.merger.width / 2,
    //   y: this.merger.height / 2,
    //   width: this.merger.width / 2,
    //   height: this.merger.height / 2,
    //   mute: false,
    // });
    // }
    // this.peerLStream.set(this.targetUsername, []);
  };

  handleConnectionOffer = async (msg) => {
    console.log(
      ' --Received video chat offer from caller: ' +
        msg.name +
        ' by callee --> ' +
        msg.target +
        ' with streams --> ' +
        msg.streams
    );
    this.targetUsername = msg.name;
    let hut = false;
    let mystreams = '';
    const hhj = this.peerList.get(this.targetUsername);
    if (!hhj) {
      hut = true;
      this.createPeerConnection();
      this.peerList.set(this.targetUsername, this.peerConnection);
      mystreams = this.clones[0].id;
      this.remoteStreamMap.forEach((yul) => {
        mystreams += ',' + yul.id;
      });
      this.setDataChannel();
    } else if (this.peerLStream.has(this.targetUsername)) {
      const jjk = this.peerLStream.get(this.targetUsername);
      if (jjk) {
        mystreams = jjk.join(',');
      }
    }
    console.log(
      'signaling state at the start of offer response --> ' +
        this.peerList.get(this.targetUsername)?.signalingState
    );
    this.peerRStream.set(this.targetUsername, msg.streams.split(','));
    if (this.peerConnection) {
      if (this.peerConnection.signalingState !== 'stable') {
        if (msg.polite || this.makingOffer) {
          console.log(
            ' ---> Answering offer by : ' +
              this.username +
              ' to ---> ' +
              this.targetUsername +
              'rejected by not polite'
          );
          return;
        }
        console.log(
          ' ---> Answering offer by : ' +
            this.username +
            ' to ---> ' +
            this.targetUsername +
            'offer called off by polite'
        );
        if (this.peerConnection)
          zip(
            this.peerConnection.setLocalDescription({ type: 'rollback' }),
            this.peerConnection.setRemoteDescription(
              new RTCSessionDescription(msg.sdp)
            )
          );
      } else {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(msg.sdp)
        );
      }
      if (hut) {
        console.log(
          'handleConnectionOffer set streams: ' +
            this.merger.width / (this.clones.length + 1)
        );
        await this.setLocalStreams(true);
        const rew = this.merger._streams.at(this.clones.length - 1);
        if (rew && rew.id !== this.clones[this.clones.length - 1].id)
          this.merger.addStream(this.clones[this.clones.length - 1], {
            x: this.merger.width / this.clones.length,
            y: this.merger.height / this.clones.length,
            width: this.merger.width,
            height: this.merger.height,
            // index: 0,
            mute: false,
          });
      }
      if (!hut && this.checkMyPeers(this.targetUsername)) {
        // answerer has his own peers to feed
        this.peerLStream.set(this.targetUsername, mystreams.split(','));
        if (this.peerList.size > 1) {
          console.log(
            'While Answering to attempt feeding old friends with any of --> ' +
              msg.streams
          );
          this.yostream = false;
        }
      }
      await this.peerConnection.setLocalDescription(
        await this.peerConnection
          .createAnswer(this.offerOptions)
          .then((answer) => {
            answer.sdp = answer?.sdp?.replace(
              /(m=video.*\r\n)/g,
              `$1b=AS:${this.bandwidth}\r\n`
            );
            return answer;
          })
      );
      if (this.merger._streams.length > 1) {
        mystreams = '';
        this.merger._streams.forEach((dd) => (mystreams += dd.id + ','));
      }
      console.log(
        'sendToServer an answer by --> ' +
          this.username +
          ' to the offer from --> ' +
          this.targetUsername +
          ' with streams --> ' +
          mystreams
      );
      this.signalingConnection.sendToServer({
        name: this.username,
        target: this.targetUsername,
        streams: mystreams,
        event: 'answer',
        sdp: this.peerConnection.localDescription,
      });

      // this.localVideo.nativeElement.srcObject = this.merger.result;
      console.log(
        'signaling state at the end of offer response --> ' +
          this.peerConnection.signalingState
      );
    }
  };
  handleConnectionAnswer = async (msg) => {
    try {
      const uuk = this.peerList.get(msg.name);
      if (uuk) {
        await uuk
          .setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .catch((err) => {
            console.log('Error in handleConnectionAnswer');
            console.error(err);
          });
        console.log(
          'Answer from callee --> ' +
            msg.name +
            ' to the original caller --> ' +
            msg.target +
            ' entered with streams --> ' +
            msg.streams
        );
        console.log(
          'signaling state at the start of answer response --> ' +
            uuk.signalingState
        );
      }
      this.chatBoxDisabled = false;
      if (msg.name === this.targetUsername) {
        // const rew = this.merger._streams.at(this.clones.length - 1);
        // if (rew && rew.id !== this.clones[this.clones.length - 1].id)
        //   this.merger.addStream(this.clones[this.clones.length - 1], {
        //     x: this.merger.width / 2,
        //     y: this.merger.height / 2,
        //     width: this.merger.width,
        //     height: this.merger.height,
        //     // index: 1,
        //     mute: false,
        //   });
        //  this.localVideo.nativeElement.srcObject = this.merger.result;
        let list: string[];
        const pist = this.peerRStream.get(msg.name);
        if (!pist) {
          list = [];
        } else list = pist;
        msg.streams.split(',').forEach((d) => {
          if (!list.includes(d)) {
            list.push(d);
          }
        });
        if (!this.peerRStream.get(msg.name)) {
          this.peerRStream.set(msg.name, list);
        }
        const malis: string[] = [];
        if (this.peerLStream.get(msg.name)) {
          this.peerLStream.get(msg.name)?.forEach((h) => malis.push(h));
        }
        if (this.peerRStream.get(this.targetUsername)) {
          this.peerRStream.get(this.targetUsername)?.forEach((hd) => {
            if (!malis.includes(hd)) {
              malis.push(hd);
            }
          });
        }
        this.peerLStream.set(msg.name, malis);
      }
    } catch (e) {
      console.error('::peer --> ' + msg.name, e);
    } finally {
      console.log(
        'caller/offerer has his own peers to feed --> ' +
          msg.streams +
          ' offerer --> ' +
          msg.target +
          ' answerer --> ' +
          msg.name
      );
    }
  };
  checkThyPeers = async (target, isOther) => {
    if (target === this.targetUsername && this.checkMyPeers(target)) {
      this.yostream = true;
    }
  };
  checkMyPeers = (target) => {
    if (this.peerList.size > 1) {
      return [...this.peerList.keys()]
        .filter((peer) => peer !== target)
        .some((mypeer) => {
          return (
            !this.peerLStream.get(mypeer) ||
            !this.peerRStream.get(target) ||
            !this.peerRStream
              .get(target)
              ?.every((value) => this.peerLStream.get(mypeer)?.includes(value))
          );
        });
    }
    return true;
  };
  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
    // if (this.remoteVideo1.nativeElement.srcObject) {
    //     this.closeAllVideoCall().then(value => value);
    // }
    this.signalingConnection.connection.close();
    if (this.localVideo.nativeElement.srcObject != null) {
      this.vidOff(this.localVideo.nativeElement.srcObject);
      this.localVideo.nativeElement.srcObject = null;
    }
  }

  handleRemoteStreams = async (value, user, mosenders) => {
    const bbl = this.remoteStreamMap.get(value);
    if (bbl) {
      this.vidOff(bbl);
      this.remoteStreamMap.delete(value);
    }
    if (user !== '') {
      // this.removeTracksSender(mosenders);
    }
    this.peerLStream.forEach((val, key) => {
      const index = val.indexOf(value);
      if (index !== -1) {
        val.splice(index);
        this.signalingConnection.sendToServer({
          name: this.username,
          streams: value,
          target: key,
          senders: mosenders.join(','),
          event: 'hang-up',
        });
      }
    });
    if (user !== '') {
      const index = this.peerRStream.get(user)?.indexOf(value);
      if (index && index !== -1) {
        this.peerRStream.get(user)?.splice(index);
      }
    }
  };
  // handleHangUpMsg = async (msg) => {
  //     this.hangedUps.push(msg.name);
  //     console.log('*** Reporting hang up notification from other peer: ' + msg.name);
  //     this.peerReceivers.get(msg.name).map(receive => {
  //         console.log('--> Reporting the peer receivers --> ' + receive.receiver.track.id + ' peer is --> '
  //  + msg.name + ' direction --> '
  //             + receive.currentDirection + '::mid::' + receive.mid);
  //         if (receive.direction === 'sendrecv') {
  //             console.log('Reporting sender track id --> ', receive.sender.track.id);
  //         }
  //     });
  //     const list = msg.senders.split(',');
  //     if (msg.streams !== '') {
  //         for (const value of msg.streams.split(',')) {
  //             await this.handleRemoteStreams(value, msg.name, list);
  //         }
  //} else if (this.peerRStream.get(msg.name)) {
  //         const mlist = [];
  //         this.peerReceivers.get(msg.name).map(value => {
  //             if (list.includes(value.mid)) {
  //                 mlist.push(value.receiver.track.id);
  //             }
  //         });
  //         for (const value of this.peerRStream.get(msg.name)) {
  //             await this.handleRemoteStreams(value, '', mlist);
  //         }
  //         this.peerLStream.delete(msg.name);
  //         this.peerRStream.delete(msg.name);
  //         await this.closePeerCall(this.peerList.get(msg.name), msg.senders, mlist);
  //         this.peerList.get(msg.name).close();
  //         this.peerList.delete(msg.name);
  //         this.removeTracksSender(mlist);
  //         this.peerSenders.set(msg.name, null);
  //         this.peerReceivers.set(msg.name, null);
  //     }
  // }
  // removeTracksSender = (list) => {
  //     this.peerConnection.getSenders().forEach((value, index, senders) => {
  //         [...value].map(sender => {
  //             if (list.includes(sender.track.id)) {
  //                 console.log('--> removing the peer track by remote peer --> ' + sender.track.id + ' peer is --> ' + index);
  //                 this.peerList.get(index).removeTrack(sender);
  //             }
  //         });
  //     });
  // }
  // hangUpCall = async (user) => {
  //     this.peerLStream.get(user).filter(value => this.localStream.id !== value).forEach(value => {
  //         this.vidOff(this.remoteStreamMap.get(value));
  //         this.remoteStreamMap.delete(value);
  //     });
  //     this.peerRStream.get(user).forEach(value => {
  //         this.vidOff(this.remoteStreamMap.get(value));
  //         this.remoteStreamMap.delete(value);
  //     });
  //     this.peerLStream.delete(user);
  //     this.peerRStream.delete(user);
  //     let mysenders = '';
  //     for (const transceiver of this.peerList.get(user).getTransceivers()) {
  //         if (this.peerSenders.get(user).includes(transceiver.sender)) {
  //             mysenders += ',' + transceiver.mid;
  //         }
  //     }
  //     await this.closePeerCall(this.peerList.get(user), '', '');
  //     this.peerSenders.get(user).map(sender => {
  //         console.log('--> removing the peer track by closer --> ' + sender.track.id + ' peer is --> ' + user);
  //         this.peerList.get(user).removeTrack(sender);
  //     });
  //     this.peerReceivers.get(user).map(receive => {
  //         console.log('--> removing the peer receivers --> ' + receive.receiver.track.id + ' peer is --> ' + user + ' direction --> '
  //             + receive.currentDirection + '::mid::' + receive.mid);
  //         if (receive.direction === 'sendrecv') {
  //             console.log('sender track id --> ', receive.sender.track.id);
  //         }
  //         this.peerList.get(user).removeTrack(receive.sender);
  //     });
  //     this.peerList.get(user).close();
  //     this.peerList.delete(user);
  //     this.peerSenders.set(user, null);
  //     this.peerReceivers.set(user, null);

  //     this.signalingConnection.sendToServer({
  //         name: this.username,
  //         streams: '',
  //         target: user,
  //         senders: mysenders.substring(1),
  //         event: 'hang-up'
  //     });
  // }
  closePeerCall = async (peer, transceivers, trackids) => {
    console.log('--> Closing the peer connection');
    let mikey = '';
    if (peer !== null) {
      this.peerList.forEach((element, key) => {
        if (element === peer && this.dataChannelList.get(key)) {
          this.dataChannelList.get(key)?.close();
          this.dataChannelList.delete(key);
          mikey = key;
        }
      });
      peer.ontrack = null;
      peer.onicecandidate = null;
      peer.oniceconnectionstatechange = null;
      peer.onsignalingstatechange = null;
      peer.onicegatheringstatechange = null;
      peer.onnegotiationneeded = null;
    }
  };
  closeAllVideoCall = async () => {
    console.log('Closing the call');
    for (const mapeer of this.peerList) {
      await this.closePeerCall(mapeer, '', '');
    }
    this.targetUsername = '';
    this.vidOff(this.localVideo.nativeElement.srcObject);
    this.localVideo.nativeElement.srcObject = null;
  };
  handleICECandidateEvent = (event) => {
    if (event.candidate) {
      this.signalingConnection.sendToServer({
        event: 'candidate',
        target: this.targetUsername,
        source: this.username,
        candidate: event.candidate,
      });
    }
  };
  handleICEConnectionStateChangeEvent = async (event) => {
    console.log(
      'ICEConnectionStateChange --> ' + this.peerConnection.iceConnectionState
    );
    switch (this.peerConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        await this.closePeerCall(this.peerConnection, '', '');
    }
  };
  handleSignalingStateChangeEvent = async (event) => {
    for (const value of this.peerList.values()) {
      console.log(
        'SignalingStateChange --> ' +
          value.signalingState +
          ' target --> ' +
          this.targetUsername +
          ' senders count' +
          value.getSenders().length
      );
    }
    switch (this.peerConnection.signalingState) {
      case 'closed':
        await this.closePeerCall(this.peerConnection, '', '');
    }
  };
  handleICEGatheringStateChangeEvent = async (event) => {
    console.log(
      '*** ICE gathering state changed to: ' +
        this.peerConnection.iceGatheringState +
        event
    );
  };
  sendData = (user) => {
    try {
      const date = new Date(Date.now());
      const dateString = date.toLocaleTimeString();
      const msg =
        '<div style="background: #e1ffc7; margin-bottom: 10px; padding: 10px">' +
        '<strong>' +
        this.username +
        '</strong> <br>' +
        'PRIVATE: ' +
        this.textBox.nativeElement.value +
        '<span>' +
        '<span style="padding: 10px; float: right;">' +
        dateString +
        '</span>' +
        '</span></div>';
      const msgMe =
        '<div style="background: #e1ffc7; margin-bottom: 10px; padding: 10px">' +
        '<strong>' +
        user +
        '</strong> <br>' +
        'PRIVATE-ME: ' +
        this.textBox.nativeElement.value +
        '<span>' +
        '<span style="padding: 10px; float: right;">' +
        dateString +
        '</span>' +
        '</span></div>';
      this.renderer.setProperty(
        this.privateChatBox.nativeElement,
        'innerHTML',
        this.privateChatBox.nativeElement.innerHTML + msgMe
      );
      this.dataChannelList.get(user)?.send(msg);
    } catch (e) {
      console.log('Error sending');
    }
    this.textBox.nativeElement.value = '';
  };
  onDataChannelMessage = (event: MessageEvent) => {
    if (!event.data.toString().startsWith('<div')) {
      // const list = event.data.toString().split(',');
      // if (list[0] !== this.username) {
      //     this.fakelist.get(list[0]).splice(this.fakelist.get(list[0]).indexOf(list[1]));
      // }
    }
    this.renderer.setProperty(
      this.privateChatBox.nativeElement,
      'innerHTML',
      this.privateChatBox.nativeElement.innerHTML + event.data
    );
    this.privateChatBox.nativeElement.scrollTop =
      this.privateChatBox.nativeElement.scrollHeight -
      this.privateChatBox.nativeElement.clientHeight;
  };
  createDataChannel = () => {
    this.dataChannel = this.peerConnection.createDataChannel(
      this.targetUsername,
      {
        ordered: true,
        maxPacketLifeTime: 5000,
      }
    );
    this.dataChannel.onclose = () => {
      console.log(
        'The Data Channel is Closed: ',
        this.dataChannel.label + '--' + this.dataChannel.id
      );
    };
    this.dataChannel.onerror = (error) => {
      console.log('Data Channel Error:', error);
    };
    this.dataChannel.onmessage = this.onDataChannelMessage;
    this.dataChannelList.set(this.targetUsername, this.dataChannel);
  };

  private setDataChannel() {
    const ffd = this.peerList.get(this.targetUsername);
    if (ffd)
      ffd.ondatachannel = (event) => {
        this.receiveChannel = event.channel;
        this.dataChannelList.set(this.targetUsername, this.receiveChannel);
        this.receiveChannel.onerror = (error) =>
          console.error('Data channel error', error);
        this.receiveChannel.onmessage = this.onDataChannelMessage;
        this.receiveChannel.onopen = () => {
          console.log('Data channel open');
          this.receiveChannel.send(
            '<div style="color: chartreuse">Hello world!</div>'
          );
        };
        this.receiveChannel.onclose = () =>
          console.log(
            'Data channel closed: ',
            this.receiveChannel.label + '--' + this.receiveChannel.id
          );
      };
  }
  visualize(stream) {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    const source = this.audioCtx.createMediaStreamSource(stream);
    const analyser = this.audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    source.connect(analyser);
    const draw = () => {
      const WIDTH = this.soundCanvas.nativeElement.width;
      const HEIGHT = this.soundCanvas.nativeElement.height;
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      this.canvasCtx.beginPath();
      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;
        if (i === 0) {
          this.canvasCtx.moveTo(x, y);
        } else {
          this.canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      this.canvasCtx.lineTo(
        this.soundCanvas.nativeElement.width,
        this.soundCanvas.nativeElement.height / 2
      );
      this.canvasCtx.stroke();
    };
    draw();
  }
  trace(arg) {
    const now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ', arg);
  }

  private shiftPlace(s: string) {
    // switch (s) {
    //     case this.remoteVideo1.nativeElement.srcObject && this.remoteVideo1.nativeElement.srcObject.id:
    //         this.remoteVideo2.nativeElement.srcObject = this.remoteVideo1.nativeElement.srcObject;
    //         this.remoteVideo1.nativeElement.srcObject = null;
    //         break;
    //     case this.remoteVideo2.nativeElement.srcObject && this.remoteVideo2.nativeElement.srcObject.id:
    //         this.remoteVideo3.nativeElement.srcObject = this.remoteVideo2.nativeElement.srcObject;
    //         this.remoteVideo2.nativeElement.srcObject = null;
    //         break;
    //     case this.remoteVideo3.nativeElement.srcObject && this.remoteVideo3.nativeElement.srcObject.id:
    //         this.remoteVideo4.nativeElement.srcObject = this.remoteVideo3.nativeElement.srcObject;
    //         this.remoteVideo3.nativeElement.srcObject = null;
    //         break;
    //     case this.remoteVideo4.nativeElement.srcObject && this.remoteVideo4.nativeElement.srcObject.id:
    //         this.remoteVideo5.nativeElement.srcObject = this.remoteVideo4.nativeElement.srcObject;
    //         this.remoteVideo4.nativeElement.srcObject = null;
    //         break;
    // }
  }
}
