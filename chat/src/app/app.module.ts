import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NewChannelComponent } from './home/new-channel/new-channel.component';
import { ProfileComponent } from './home/profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './home/chat/chat.component';
import { AngularFire } from './shared';
import { ChannelUsersComponent } from './home/channel-users/channel-users.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', redirectTo: '' }
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		RegisterComponent,
		ChatComponent,
		NewChannelComponent,
		ProfileComponent,
		ChannelUsersComponent,
	],
	imports: [
		NgbModule.forRoot(),
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		RouterModule.forRoot(routes),
		FormsModule,
		HttpClientModule
	],
	providers: [AngularFire],
	bootstrap: [AppComponent]
})
export class AppModule { }
