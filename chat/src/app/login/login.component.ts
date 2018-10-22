import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from '../shared';
import {
	AngularFireDatabase,
	AngularFireDatabaseModule,
	FirebaseListObservable,
	FirebaseObjectObservable
} from 'angularfire2/database';
import * as firebase from 'firebase';

declare var VK: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent {
	public error: any;
	public name: string;
	public id: number;

	constructor(public afService: AngularFire, private router: Router, public db: AngularFireDatabase) { }

	async login() {
		// tslint:disable-next-line:prefer-const
		var that = this;
		// tslint:disable-next-line:prefer-const
		var vk = {
			data: { user: { first_name: '', last_name: '', id: null } },
			appID: 6480684,
			init: new Promise(function (resolve, reject) {

				VK.init({ apiId: 6480684 });
				load();

				function load() {
					VK.Auth.login(authInfo);

					function authInfo(response) {
						if (response.session) { // Авторизация успешна
							vk.data.user = response.session.user;
							resolve();
						} else {
							alert('Авторизоваться не удалось!');
							reject();
						}
					}
				}
			})
		}

		async function data() {
			await vk.init;
			console.log('vk login');
			that.name = vk.data.user.first_name + ' ' + vk.data.user.last_name;
			that.id = vk.data.user.id;
			that.db.object('users/' + vk.data.user.id).set({
				uid: that.id,
				displayName: that.name
			});
		}
		await data();
		this.afService.vkId = this.id;
		this.afService.vkName = this.name;
		console.log(this.name);
		}

	loginWithEmail(event, email, password) {
		event.preventDefault();
		this.afService.loginWithEmail(email, password).then(() => {
			this.router.navigate(['']);
		}).catch((error: any) => {
			if (error) {
				this.error = error;
			}
		});
	}
}
