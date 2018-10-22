import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/filter';
import { Router } from '@angular/router';
import {
	AngularFireDatabase} from 'angularfire2/database';

import { AngularFire } from '../shared';
import * as firebase from 'firebase';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	public isLoggedIn: boolean;
	public newChannel = false;
	public toggleSidebar = false;
	public channel;
	public channels: FirebaseListObservable<any>;
	public channelId: string;
	public users: FirebaseListObservable<any>;
	public channelUsers = false;
	public profile = false;
	public channelMessages: FirebaseListObservable<any>;
	public chUsers: FirebaseListObservable<any>;
	public firebaseData = firebase.database().ref();

	constructor(private afService: AngularFire, public afAuth: AngularFireAuth, private router: Router) {
		this.afService.afAuth.authState.subscribe(
			(auth) => {
				if (auth == null) {
					this.isLoggedIn = false;
				} else {
					this.isLoggedIn = true;
				}
			}
		);

		this.channels = afService.channels;
		this.channelMessages = afService.db.list('channelMessages');
		this.chUsers = afService.db.list('channelUsers');
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnInit() {
	}

	logout() {
		this.afService.logout();
		this.router.navigate(['/login']);
	}

	selectNewChannel() {
		this.channelId = '';
		this.newChannel = true;
	}

	selectProfile() {
		this.channelId = '';
		this.newChannel = false;
		this.profile = true;
	}

	getChannelUsers(channel) {
		this.channelId = channel.$key;
		this.channelUsers = true;
	}

	selectChannel(channel) {
		this.newChannel = false;
		this.profile = false;
		this.channelUsers = false;
		this.channelId = channel.$key;
		this.channel = channel;
	}

	deleteChannel(channel) {
		this.channelId = channel.$key;
		this.channels.remove(this.channelId);
		this.channelMessages.remove(this.channelId);
		this.chUsers.remove(this.channelId);
	}

	isPrivate(channel) {
		if (channel.status === 'private') {
			return true;
		} else {
			return false;
		}
	}

	isCreator(channel) {
		if (this.afAuth.auth.currentUser !== null) {
			if (channel.creator === this.afAuth.auth.currentUser.uid) {
				return true;
			} else {
				return false;
			}
		} else {
			if (channel.creator === this.afService.vkId) {
				return true;
			} else {
				return false;
			}
		}
	}

	isUserInChannel(channelId) {
		// tslint:disable-next-line:prefer-const
		var inchannel = false;
		if (channelId !== undefined) {
			if (this.afAuth.auth.currentUser !== null) {
				var useremail = this.afAuth.auth.currentUser.email;
				return firebase.database().ref('channelUsers/' + this.channelId).orderByKey().once('value').then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
						if (childSnapshot.val().email === useremail) {
							inchannel = true;
						}
					});
					return inchannel;
				});
			} else {
				var userid = this.afService.vkId;
				return firebase.database().ref('channelUsers/' + this.channelId).orderByKey().once('value').then(function (snapshot) {
					snapshot.forEach(function (childSnapshot) {
						if (childSnapshot.val().uid === userid) {
							inchannel = true;
						}
					});
					return inchannel;
				});
			}
		} else {
			return false;
		}
	}

	async inChannel(channelId) {
		return await this.isUserInChannel(channelId);
	}

	async userPermission(channel, channelId) {
		if (channel === undefined) {
			return false;
		} else if (channelId && channel.status === 'open') {
			console.log('true');
			return true;
		} else if (channelId && channel.status === 'private' && await this.inChannel(channelId)) {
			console.log('true');
			return true;
		} else {
			console.log('false');
			return false;
		}
	}
}
