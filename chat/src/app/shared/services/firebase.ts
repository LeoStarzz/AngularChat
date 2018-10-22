import { Injectable } from '@angular/core';
import {
	AngularFireDatabase,
	FirebaseListObservable,
	FirebaseObjectObservable
} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { ReplaySubject } from 'rxjs/Rx';

@Injectable()
export class AngularFire {
	public auth: any;
	public channels: FirebaseListObservable<any>;
	public users: FirebaseListObservable<any>;
	public email: string;
	public id: string;
	public imageUrl: string;
	public user: FirebaseObjectObservable<any>;
	public defaultChannelId: ReplaySubject<any> = new ReplaySubject(1);
	public channelId;
	public currentUserEmail;
	public displayName: string;
	public vkName: string;
	public vkId: number;

	constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
		this.afAuth.authState.subscribe(
			(auth) => {
				if (auth != null) {
					this.user = this.db.object('users/' + auth.uid);
				}
			});

		this.channels = this.db.list('channels');
		this.users = this.db.list('users');
		this.db.list('channels', {
			query: {
				limitToFirst: 1
			}
		}).subscribe(items => {
			this.defaultChannelId.next(items[0].$key);
		});
	}

	getMessages(channel): FirebaseListObservable<any> {
		return this.db.list('channelMessages/' + channel);
	}

	// Register
	registerUser(email, password) {
		console.log(email);
		return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
	}

	// Save information to display on chat screen
	saveUserInfo(id, name, email) {
		return this.db.object('users/' + id).set({
			email: email,
			displayName: name,
			uid: id
		});
	}

	// Login
	loginWithEmail(email, password) {
		return this.afAuth.auth.signInWithEmailAndPassword(email, password);
	}

	// Logout the current user
	logout() {
		return this.afAuth.auth.signOut();
	}

	currentUserName() {
		const firebaseData = firebase.database().ref('users');
		const userid = this.afAuth.auth.currentUser.uid;

		return firebaseData.orderByKey().once('value').then(function (snapshot) {
			var name = undefined;
			snapshot.forEach(function (childSnapshot) {
				if (childSnapshot.key === userid) {
					name = childSnapshot.val().displayName;
				}
			});
			return name;
		});
	}

	async getDisplayName() {
		const result = await this.currentUserName();
		return result;
	}

	sendMessage(channel, text, name, uid) {
		var email;
		if (this.afAuth.auth.currentUser !== null) {
			email = this.email;
		} else {
			email = null;
		}
		const message = {
			message: text,
			displayName: name,
			email: email,
			uid: uid,
			timestamp: Date.now(),
		};
		this.db.list('channelMessages/' + channel).push(message);
	}

	async sendFile(channel, file: File) {
		var name;
		var uid;
		var email;

		if (this.afAuth.auth.currentUser !== null) {
			name = await this.getDisplayName();
			uid = this.afAuth.auth.currentUser.uid;
			email = this.email;
		} else {
			name = this.vkName;
			uid = this.vkId;
			email = null;
		}

		let propName: String;
		const storageRef = firebase.storage().ref();
		let uploadTask: firebase.storage.UploadTask;
		if (file.type.match('image.*')) {
			propName = 'images/';
		} else {
			propName = 'files/';
		}
		uploadTask = storageRef.child(propName + uid + '/' + Date.now() + '/' + file.name).put(file);
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, null, (error) => {
			console.error('Ошибка: ', error);
		}, async () => {
			const url = uploadTask.snapshot.downloadURL;
			if (file.type.match('image.*')) {
				this.saveFile(channel, {
					displayName: name,
					email: email,
					imageUrl: url,
					timestamp: Date.now(),
					uid: uid
				});
			} else {
				this.saveFile(channel, {
					displayName: name,
					email: email,
					fileName: file.name,
					fileUrl: url,
					timestamp: Date.now(),
					uid: uid
				});
			}
		});
	}

	saveFile(channel, file: any) {
		this.db.list('channelMessages/' + channel).push(file);
	}

	createChannel(channelName, channelStatus, Creator) {
		this.channels.push({
			name: channelName,
			status: channelStatus,
			creator: Creator
		}).then((snap) => {
		});
		return this.channelId;
	}

	getChannelUsers(channelId) {
		return this.db.list('channelUsers/' + channelId);
	}

	getUsers() {
		return this.db.list('users');
	}
}
