import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigBoutiquePage } from './config-boutique/config-boutique'
import { ChoixTypeUtilisateurPage } from './choix-type-utilisateur/choix-type-utilisateur';
import { global }  from '../../global-variables/variable'
import { Storage } from '@ionic/storage';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';

/*
  Generated class for the Accueil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})
export class AccueilPage {

  langue: string;

  constructor(public modalCtl: ModalController, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public gestionService: GestionBoutique) {
    this.langue = global.langue;
    this.translate.setDefaultLang(this.langue);
    //this.translate.use(this.langue);
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
  } 
 
  choixLangue(){
    this.translate.use(this.langue);
  }

 
  open(){
    global.premierLancement = false;
    this.storage.set('langue', this.langue);
    global.langue = this.langue;
    //this.navCtrl.push(ConfigBoutiquePage);
    let modal = this.modalCtl.create(LoginPage, {'tache': 'admin'});
    modal.present();
    //this.navCtrl.push(ChoixTypeUtilisateurPage);
  }
}
