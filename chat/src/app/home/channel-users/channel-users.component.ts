import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { AngularFire } from 'app/shared';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
	selector: 'app-channel-users',
	templateUrl: './channel-users.component.html',
	styleUrls: ['./channel-users.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelUsersComponent implements OnInit {

	@Input() channelUsers;
	@Input() channelId;
	@Input() channel;
	public chUsers;
	public chuser;
	public users;
	public firebaseData = firebase.database().ref();

	constructor(public afService: AngularFire, public db: AngularFireDatabase, public afAuth: AngularFireAuth) {
		this.users = this.afService.getUsers();
	}

	ngOnInit() {
		this.chUsers = this.afService.getChannelUsers(this.channelId);

	}

	addUser(user, channelId) {
		// tslint:disable-next-line:no-var-keyword
		if (user.email !== undefined) {
			console.log(this.afAuth.auth.currentUser);
			// tslint:disable-next-line:max-line-length
			firebase.database().ref('channelUsers/' + channelId + '/' + user.uid).set({ displayName: user.displayName, email: user.email, uid: user.uid });
		} else {
			console.log(user.uid);
			// tslint:disable-next-line:max-line-length
			firebase.database().ref('channelUsers/' + channelId + '/' + user.uid).set({ displayName: user.displayName, uid: user.uid });
		}
	}

	deleteUser(chuser) {
		this.db.list('channelUsers/' + this.channelId).remove(chuser);
	}

	currentUser(chuser) {
		if (this.afAuth.auth.currentUser !== null) {
			if (chuser.email === this.afAuth.auth.currentUser.email) {
				return true;
			} else {
				return false;
			}
		} else {
			if (chuser.uid === this.afService.vkId) {
				console.log('dfsdf');
				return true;
			} else {
				return false
			}
		}
	}

	isCreator(channel) {
		var useruid;
		if (this.afAuth.auth.currentUser !== null) {
			useruid = this.afAuth.auth.currentUser.uid;
		} else {
			useruid = this.afService.vkId;
		}
		if (channel.creator === useruid) {
			return true;
		} else {
			return false;
		}
	}

	InChannel(user) {
		var useruid;
		if (this.afAuth.auth.currentUser !== null) {
			useruid = this.afAuth.auth.currentUser.uid;
		} else {
			useruid = this.afService.vkId;
		}
		if (user.uid === useruid) {
			return true;
		} else {
			return false;
		}
	}

	getChannel(user) {
		return firebase.database().ref('channelUsers/' + this.channelId).orderByKey().once('value').then(function (snapshot) {
			var inchannel = false;
			snapshot.forEach(function () {
				if (snapshot.val().uid === user.uid) {
					inchannel = true;
				}
			});
			return inchannel;
		});
	}

	async inChannel(user) {
		return await this.getChannel(user);
	}

	async inChannel2(user) {
		console.log(await this.inChannel(user));
		return await this.inChannel(user);
	}

	canDelete(chuser, channel) {
		if (this.isCreator(channel) && !(this.currentUser(chuser))) {
			return true;
		} else {
			return false;
		}
	}
}
