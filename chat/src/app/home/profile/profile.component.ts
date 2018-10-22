import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import {
	AngularFireDatabase,
	AngularFireDatabaseModule,
	FirebaseListObservable,
	FirebaseObjectObservable
} from 'angularfire2/database';
import { AngularFire } from 'app/shared';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	@ViewChild('focus') private elementRef: ElementRef;
	@Input() profile;
	public firebaseData = firebase.database().ref();
	public userName;
	public fromFirebase = false;
	public email;

	constructor(public afAuth: AngularFireAuth, private afService: AngularFire) {
		this.getName();
		if (this.afAuth.auth.currentUser !== null) {
			this.fromFirebase = true;
			this.email = this.afAuth.auth.currentUser.email;
		}
	}

	ngOnInit() {
	}

	async getName() {
		if (this.afAuth.auth.currentUser !== null) {
			this.userName = await this.afService.getDisplayName();
		} else {
			this.userName = this.afService.vkName;
		}
	}

	// tslint:disable-next-line:use-life-cycle-interface
	public ngAfterViewInit(): void {
		this.elementRef.nativeElement.focus();
	}

	changeName(event, name) {
		var uid;
		if (this.afAuth.auth.currentUser !== null) {
			uid = this.afAuth.auth.currentUser.uid;
		} else {
			uid = this.afService.vkId;
		}
		event.preventDefault();
		const firebaseData = firebase.database().ref();
		firebaseData.child('users').child(uid).child('displayName').set(name);
		if (this.afAuth.auth.currentUser === null) {
			this.afService.vkName = name;
		}
		alert('Ваше имя было изменено!');
	}

}
