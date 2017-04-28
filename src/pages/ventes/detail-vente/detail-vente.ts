import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ModifierVentePage } from '../modifier-vente/modifier-vente';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the DetailVente page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-vente',
  templateUrl: 'detail-vente.html'
})
export class DetailVentePage {

  vente:any;
  boutique_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public gestionService: GestionBoutique) {
    this.vente = this.navParams.get('vente');
    this.boutique_id = this.navParams.data.boutique_id;
  }

  ionViewDidEnter(){
    this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      //let v = res.ventes;
      let op = res.operations;
      //v.forEach((vent, index) => {
      op.forEach((operation, index) => {
        if(operation.id === this.vente.id){
          this.vente = operation;
        }
      });
    });
  }
  
  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetailVentePage');
  }

  editer(vente){
    this.navCtrl.push(ModifierVentePage, {'vente': vente, 'boutique_id': this.boutique_id});
  } 

  supprimer(vente){
    let alert = this.alertCtl.create({
      title: 'Suppression vente',
      message: 'Etes vous sûr de vouloir supprimer cette vente ?',
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
              let ventes = result.ventes;
              ventes.forEach((vent, index) => {
                if(vent.id === vente.id){
                  ventes.splice(index, 1);
                }
              });
              boutique.ventes = ventes;
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
