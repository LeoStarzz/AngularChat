import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFire } from './shared';
import * as firebase from 'firebase/app';
import {
	AngularFireDatabase,
	AngularFireDatabaseModule,
	FirebaseListObservable,
	FirebaseObjectObservable
} from 'angularfire2/database';

declare var VK: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	public isLoggedIn: boolean;
	public name;

	constructor(public afService: AngularFire, private router: Router) {
		// console.log(afService);
		// Asynchronously check if user is logged in
		this.afService.afAuth.authState.subscribe(
			(auth) => {
				if (auth == null) {
					console.log('Not logged in');
					this.isLoggedIn = false;
					this.router.navigate(['login']);
				} else {
					console.log('Logged in');
					if (auth.displayName) {
						this.afService.displayName = auth.displayName;
						this.afService.email = auth.email;
					} else {
						this.afService.displayName = auth.email;
						this.afService.email = auth.email;
					}
					this.isLoggedIn = true;
					this.router.navigate(['']);
				}
			}
		);

		VK.Observer.subscribe('auth.login', response => {
			this.isLoggedIn = true;
			this.router.navigate(['']);
			console.log(this.afService.vkName);
			this.afService.displayName = this.afService.vkName;
		});

		VK.Observer.subscribe('auth.sessionChange', response => {
			this.isLoggedIn = true;
			this.router.navigate(['']);
			console.log(this.afService.vkName);
			this.afService.displayName =  this.afService.vkName;
		});
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnInit() {
		VK.init({
			apiId: 6480684
		});
	}
}

