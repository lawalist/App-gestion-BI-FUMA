import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../global-variables/variable';

import { ConfigBoutiquePage } from '../config-boutique/config-boutique';
import { LoginPage } from '../../login/login';

/*
  Generated class for the ChoixTypeUtilisateur page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-choix-type-utilisateur',
  templateUrl: 'choix-type-utilisateur.html'
})
export class ChoixTypeUtilisateurPage {

  users: any = ["gerant", "admin"];
  selectedUser = 'gerant';
  constructor(public modalCtl: ModalController, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.setDefaultLang(global.langue);
  }

  ionViewWillEnter() {
    this.translate.use(global.langue);
    //console.log('ionViewDidLoad ChoixTypeUtilisateurPage');
  }

  open(){
    if(this.selectedUser === 'admin'){
      //this.navCtrl.push(LoginPage);
      //le paraùetre tache premetra de specifier si on doit laisser uniquement les user de type admin
      let modal = this.modalCtl.create(LoginPage, {'tache': 'admin'});
      modal.present();
      /*modal.onDidDismiss(() => {
        alert('fermer');
      });*/
    }else{
      
      this.navCtrl.push(ConfigBoutiquePage);
    }
    
  }

}
