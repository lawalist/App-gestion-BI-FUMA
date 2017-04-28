import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigBoutiquePage } from './config-boutique/config-boutique'
import { global }  from '../../global-variables/variable'
import { Storage } from '@ionic/storage';
import { GestionBoutique } from '../../providers/gestion-boutique';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public gestionService: GestionBoutique) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilPage');
  }


  open(){
    global.premierLancement = false;
    this.navCtrl.push(ConfigBoutiquePage);
  }
}
