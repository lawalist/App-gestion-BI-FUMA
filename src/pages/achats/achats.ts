import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AjouterAchatPage } from './ajouter-achat/ajouter-achat';
import { DetailAchatPage } from './detail-achat/detail-achat';

import { GestionBoutique } from '../../providers/gestion-boutique';

/*
  Generated class for the Achates page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-achats',
  templateUrl: 'achats.html'
})
export class AchatsPage {

  listAchats: any = [];
  last_id = 0;
  boutique_id: any;
  produits: any = [];
  operations: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public storage: Storage, public gestionService: GestionBoutique) {
  }

  /*ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.listAchats = data.achats;
         this.boutique_id = id;

         this.produits = data.produits;

         if(data.achats.length > 0){
            this.last_id = data.achats[data.achats.length - 1].id;
         }

         this.last_id++;
       });
    });
  }*/

  ionViewDidEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.listAchats = data.achats;
         this.operations = data.operations;
         this.boutique_id = id;

         this.produits = data.produits;
         if(data.achats.length > 0){
            this.last_id = data.achats[data.achats.length - 1].id;
         }

         this.last_id++;
       });
    });
  }

  /*ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.listAchats = data.achats;
         this.boutique_id = id;

         if(data.achats.length > 0){
            this.last_id = data.achats[data.achats.length - 1].id;
         }

         this.last_id++;
       });
    });

    //this.gestionService.getListeAchats().then((data) => this.listAchats = data);
  }*/

  ajouter(last_id, produits){

    if(produits.length > 0){
      this.navCtrl.push(AjouterAchatPage, {'last_id': last_id, 'produits': produits} );
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'La liste des produits n\'est pas défini',
        buttons:[
          {
            text: 'Ok',
            role: 'Cancel',
            hendler: () => console.log('Pas de produits')
          }
        ]
      });
      alert.present();
    }

  }

  detail(achat, boutique_id){
    this.navCtrl.push(DetailAchatPage, {'achat': achat, 'boutique_id':boutique_id});
  }
}
