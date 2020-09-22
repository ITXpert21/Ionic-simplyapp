import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../services/data.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth,
    public platform: Platform,
    private DataService: DataService,
    private storage: Storage

  ) {}

  doRegister(value) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  doLogin(value) {
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err));
   });
  }

  doRestPass(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(value.email)
      .then(
        res => resolve(res),
        err => reject(err));
    });
   }

  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.signOut()
      //this.afAuth.auth.signOut()
      .then(() => {
        // this.firebaseService.unsubscribeOnLogOut();
        resolve();
      }).catch((error) => {
        console.log(error);
        reject();
      });
    });
  }



}
