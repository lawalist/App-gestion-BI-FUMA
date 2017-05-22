import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { ModifierProfilePage } from './modifier-profile/modifier-profile';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user: any = {} ;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public gestionService: GestionBoutique) {}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewDidEnter() {
    this.gestionService.remote.getSession((err, response) => {
      if (err) {
        // network error
        alert('Erreur du réseau');
      } else if (!response.userCtx.name) {
        // nobody's logged in
        alert('Personne n\'est connecté');
      } else {
        // response.userCtx.name is the current user
        this.gestionService.remote.getUser(response.userCtx.name, (err, us) => {
          if (err) {
            if (err.name === 'not_found') {
              // typo, or you don't have the privileges to see this user
              alert('Privilèges insuffiasants');
            } else {
              // some other error
              alert('Erreur');
            }
          } else {
            // response is the user object
            this.user = us;
          }
        });
      }
    });
  }
 
 editer(user){
  this.navCtrl.push(ModifierProfilePage, {'user': user})
 }
}
