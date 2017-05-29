import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { ModifierProfilePage } from './modifier-profile/modifier-profile';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../global-variables/variable';

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
  estAdmin: any = false;
 
  constructor(public translate: TranslateService, public storage:Storage, public navCtrl: NavController, public navParams: NavParams, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewDidEnter() {
    this.translate.use(global.langue);
    this.gestionService.remote.getSession((err, response) => {
      if (err) {
        // network error
        alert('Erreur du réseau');
        this.storage.get('gerant').then((gerant) => {
          if(gerant){
            this.user = gerant;
            alert('Information de l\'anciènne connexion chargées');
          }
        });
      } else if (!response.userCtx.name) {
        // nobody's logged in
        alert('Personne n\'est connecté');
        this.storage.get('gerant').then((gerant) => {
          if(gerant){
            this.user = gerant;
            alert('Information de l\'anciènne connexion chargées');
          }
        });
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
            this.storage.set('gerant', us);
          }
        });
      }
    });
  }
 
 editer(user){
  this.navCtrl.push(ModifierProfilePage, {'user': user})
 }
}
