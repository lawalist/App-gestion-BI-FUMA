import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { ModifierOperationPage } from '../modifier-operation/modifier-operation';

import { GestionBoutique } from '../../../providers/gestion-boutique';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../global-variables/variable';

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
  idOperation: any = '';
  tacheAdmin: any = global.tacheAdmin;

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    this.operation = this.navParams.get('operation');
    this.idOperation = this.operation._id.substr(this.operation._id.lastIndexOf(':') + 1)
    this.boutique_id = this.navParams.data.boutique_id;
  }
 
  ionViewWillEnter(){
    this.translate.use(global.langue);
    /*this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      //let v = res.ventes;
      let op = res.operations;
      //v.forEach((vent, index) => {
      op.forEach((operation, index) => {
        if(operation.id === this.operation.id){
          this.operation = operation;
        }
      });
    });*/

    this.gestionService.getDocById(this.operation._id).then((operation) => {
      this.operation = operation;
      this.idOperation = this.operation._id.substr(this.operation._id.lastIndexOf(':') + 1)
    })
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

            /*this.gestionService.getBoutiqueById(this.boutique_id).then((result) => {
              let boutique = result;
              let operations = result.operations;
              operations.forEach((op, index) => {
                if(op.id === operation.id){
                  operations.splice(index, 1);
                }
              });
              boutique.operations = operations;
              this.gestionService.updateBoutique(boutique);
            })*/

            this.gestionService.deleteDoc(operation);
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

  annuler(operation){
    let alert = this.alertCtl.create({
      title: 'Annulation operation',
      message: 'Etes vous sûr de vouloir annuler cette operation ?',
      buttons:[
        {
          text: 'Annuler',
          rol: 'Cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            if(operation.type != 'DECAISSEMENT'){
              this.gestionService.getDocById(this.boutique_id).then((boutiq) => {
                boutiq.solde_caisse = parseInt(boutiq.solde_caisse) - parseInt(operation.montant_total);
                this.gestionService.updateBoutique(boutiq);
              });

              this.gestionService.getDocById(this.boutique_id+':produit:'+operation.code_produit).then((prod) => {
                prod.quantite = parseInt(prod.quantite) + parseInt(operation.quantite);
                this.gestionService.updateDoc(prod);
              });
            }else{
              this.gestionService.getDocById(this.boutique_id).then((boutiq) => {
                boutiq.solde_caisse = parseInt(boutiq.solde_caisse) + parseInt(operation.montant_total);
                boutiq.solde_tresor = parseInt(boutiq.solde_caisse) - parseInt(operation.montant_total);
                this.gestionService.updateBoutique(boutiq);
              });
            }
            
            this.gestionService.annulerDoc(operation);
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

}
