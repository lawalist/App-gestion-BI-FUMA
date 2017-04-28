import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { GestionBoutique } from '../../../../providers/gestion-boutique';

import { ModifierGerantPage } from '../modifier-gerant/modifier-gerant';

/*
  Generated class for the Detailgerant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-gerant',
  templateUrl: 'detail-gerant.html'
})
export class DetailGerantPage {

  boutique_id: any;
  gerant: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    this.boutique_id = this.navParams.data.boutique_id;
    this.gerant = this.navParams.data.gerant;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailgerantPage');
  }

  ionViewDidEnter(){
    this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      let v = res.gerants;
      v.forEach((prop, index) => {
        if(prop.id === this.gerant.id){
          this.gerant = prop;
        }
      });
    });
  }

  editer(gerant){
    this.navCtrl.push(ModifierGerantPage, {'gerant': gerant});
  }

  supprimer(gerant){
    let alert = this.alertCtl.create({
      title: 'Suppression propriétaire',
      message: 'Etes vous sûr de vouloir supprimer cet propriétaire ?',
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
              let gerants = result.gerants;
              gerants.forEach((prop, index) =>{
                if(prop.id === gerant.id){
                  gerants.splice(index, 1);
                }
              });

              boutique.gerants = gerants;
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
