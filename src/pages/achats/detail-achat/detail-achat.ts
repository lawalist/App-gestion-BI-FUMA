import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ModifierAchatPage } from '../modifier-achat/modifier-achat';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the DetailAchat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-achat',
  templateUrl: 'detail-achat.html'
})
export class DetailAchatPage {

  achat: any;
  boutique_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public gestionService: GestionBoutique) {
    this.achat = this.navParams.get('achat');
    this.boutique_id = this.navParams.data.boutique_id;
  }

  ionViewDidEnter(){
    this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      let v = res.achats;
      v.forEach((acha, index) => {
        if(acha.id === this.achat.id){
          this.achat = acha;
        }
      });
    });
  }

  ionViewDidLoad() {
    //this.achat = this.navParams.get('achat');
  }


  editer(achat){
    this.navCtrl.push(ModifierAchatPage, {'achat': achat, 'boutique_id': this.boutique_id});
  }

  supprimer(achat){
    let alert = this.alertCtl.create({
      title: 'Suppression achat',
      message: 'Etes vous sûr de vouloir supprimer cet achat ?',
      buttons:[
        {
          text: 'Annuler',
          rol: 'Cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.gestionService.getBoutiqueById(this.boutique_id).then((result) => {
              let boutique = result;
              let achats = result.achats;
              achats.forEach((acha, index) =>{
                if(acha.id === achat.id){
                  achats.splice(index, 1);
                }
              });

              boutique.achats = achats;
              this.gestionService.updateBoutique(boutique);
            })
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

}
