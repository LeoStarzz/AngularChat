import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFire } from 'app/shared';
import { AngularFireAuth } from 'angularfire2/auth';
import {
	AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase';


@Component({
	selector: 'app-new-channel',
	templateUrl: './new-channel.component.html',
	styleUrls: ['./new-channel.component.css']
})
export class NewChannelComponent {

	@ViewChild('focus') private elementRef: ElementRef;
	@ViewChild('open') open: ElementRef;
	@Input() newChannel;
	public channelStatus: String;
	public currentUser;
	public firebaseData = firebase.database().ref();
	
	// tslint:disable-next-line:use-life-cycle-interface
	ngOnInit() {
	}

	constructor(private afService: AngularFire, public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
		this.currentUser = this.afAuth.auth.currentUser;
	}

	// tslint:disable-next-line:use-life-cycle-interface
	public ngAfterViewInit(): void {
		this.elementRef.nativeElement.focus();
	}

	getChannelStatus(): String {
		if (this.open.nativeElement.checked) {
			this.channelStatus = 'open';
		} else {
			this.channelStatus = 'private';
		}
		return this.channelStatus;
	}

	async createChannel(event, channelName) {
		event.preventDefault();
		var currentUserName = undefined;
		var currentUserEmail = undefined;
		var currentUserUid = undefined;

		if (channelName !== '') {

			if (this.afAuth.auth.currentUser !== null) {
				currentUserName = await this.afService.getDisplayName();
				currentUserEmail = this.afAuth.auth.currentUser.email;
				currentUserUid = this.afAuth.auth.currentUser.uid;
			} else {
				currentUserName = this.afService.vkName;
				currentUserEmail = null;
				currentUserUid = this.afService.vkId;
			}

			this.afService.createChannel(channelName, this.getChannelStatus(), currentUserUid);
			firebase.database().ref('channels/').orderByKey().limitToLast(1).once('value').then(function (snapshot) {
				snapshot.forEach(function (childSnapshot) {
					const channel = childSnapshot.key;
					createUserChannel(channel, currentUserUid, currentUserName, currentUserEmail);
				});
			});
			this.newChannel = false;
		} else {
			alert('Введите название канала!');
		}

		function createUserChannel(channel, currentUserUid, currentUserName, currentUserEmail) {
			// tslint:disable-next-line:max-line-length
			firebase.database().ref('channelUsers/' + channel + '/' + currentUserUid).set({ displayName: currentUserName, email: currentUserEmail, uid: currentUserUid });
		}
	}
}

