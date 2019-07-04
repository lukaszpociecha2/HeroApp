import { Injectable } from '@angular/core';
import { timingSafeEqual } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages : string[] = [];

  addMessage(message : string){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }


}
