
import { Component, AfterViewChecked, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFire } from '../../shared';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked, OnChanges {
  @ViewChild('scroller') private myScrollContainer: ElementRef;
	@Input() channelId;
	@Input() channel;

  public messages: FirebaseListObservable<any>;
  public imageSrc: string;
  public newMessage: string;
  public newImage: any;

  constructor(public afService: AngularFire, public afAuth: AngularFireAuth) {}

  ngOnChanges() {
    this.messages = this.afService.getMessages(this.channelId);
  }

		async sendMessage() {
			var name;
			var uid;
			if (this.afAuth.auth.currentUser !== null) {
				name = await this.afService.getDisplayName();
				uid = this.afAuth.auth.currentUser.uid;
			} else {
				name =  this.afService.vkName;
				uid = this.afService.vkId;
				console.log(name);
			}
		this.afService.sendMessage(this.channelId, this.newMessage, name, uid);
    this.newMessage = '';
  }

  onSelectFile(event) {
    if (event.target && event.target.files && event.target.files.length) {
      const file = event.target.files[0] as File;
      console.log(file);
      this.afService.sendFile(this.channelId, file)
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log('Scroll to bottom failed');
    }
  }

  isMe(uid) {
		if (this.afAuth.auth.currentUser !== null) {
			if (uid === this.afAuth.auth.currentUser.uid) {
				return true;
			} else {
				return false;
			}
		} else {
      if (uid === this.afService.vkId) {
				return true;
			} else {
				return false;
			}
		}
  }
  isYou(uid) {
    if (this.afAuth.auth.currentUser !== null) {
			if (uid !== this.afAuth.auth.currentUser.uid) {
				return true;
			} else {
				return false;
			}
		} else {
      if (uid !== this.afService.vkId) {
				return true;
			} else {
				return false;
			}
		}
	}
}
