import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ModifierOperationPage } from '../modifier-operation/modifier-operation';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the DetailOperation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-operation',
  templateUrl: 'detail-operation.html'
})
export class DetailOperationPage {

  operation:any;
  boutique_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public gestionService: GestionBoutique) {
    this.operation = this.navParams.get('operation');
    this.boutique_id = this.navParams.data.boutique_id;
  }

  ionViewDidEnter(){
    this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      //let v = res.ventes;
      let op = res.operations;
      //v.forEach((vent, index) => {
      op.forEach((operation, index) => {
        if(operation.id === this.operation.id){
          this.operation = operation;
        }
      });
    });
  }
  
  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetailVentePage');
  }

  editer(operation){
    this.navCtrl.push(ModifierOperationPage, {'operation': operation, 'boutique_id': this.boutique_id});
  } 

  supprimer(operation){
    let alert = this.alertCtl.create({
      title: 'Suppression operation',
      message: 'Etes vous sûr de vouloir supprimer cette operation ?',
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
              let operations = result.operations;
              operations.forEach((op, index) => {
                if(op.id === operation.id){
                  operations.splice(index, 1);
                }
              });
              boutique.operations = operations;
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
