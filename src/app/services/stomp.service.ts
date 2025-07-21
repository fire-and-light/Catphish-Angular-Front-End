import { Injectable } from '@angular/core';
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

@Injectable({
  providedIn: 'root'
})
export class StompService {
  socket : any;
  client : any;

  constructor() {
    
  }

  subscribe(topic : string, callback? : any, headers? : any) : void {
    if (this.client == null) {
      this.socket = new SockJS("https://catphish-back-end.azurewebsites.net/ws");
      this.client = Stomp.over(this.socket);
    }

    if (this.client.connected) {
      this.client.subscribe(topic, (frame : any): any => {
        callback(frame);
      }, headers);

    } else {
      this.client.connect({}, () : void => {
        this.client.subscribe(topic, (frame : any): any => {
          callback(frame);
        }, headers);
      });
    }
  }

  send(topic : string, headers? : any, json? : string) {
    if (this.client == null) {
      this.socket = new SockJS("https://catphish-back-end.azurewebsites.net/ws");
      this.client = Stomp.over(this.socket);
    }

    if (this.client.connected) {
      this.client.send(topic, headers, json);

    } else {
      this.client.connect({}, () : void => {
        this.client.send(topic, headers, json);
      });
    }
  }

  unsubscribe(id : string) : void {
    if (this.client != null) {
      this.client.unsubscribe(id);
    }
  }

  disconnect() : void {
    if (this.client != null && this.client.connected) {
      this.client.disconnect();
      this.socket = null;
      this.client = null;
    }
  }
}