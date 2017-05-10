import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AjouterProduitPage } from './ajouter-produit/ajouter-produit';
import { DetailProduitPage } from './detail-produit/detail-produit';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Produit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-produit',
  templateUrl: 'produit.html'
})
export class ProduitPage {

  produits: any = [];
  typeProduits: any = [];
  last_id = 0;
  boutique_id: any;

  constructor(public gestionService: GestionBoutique, public alertCtl: AlertController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {}

  ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getPlageDocs(id + ':produit', id+ ':produit:\ufff0').then((produits) => {

         if(produits.length > 0){
            this.last_id = produits[produits.length - 1].id;
         }

         this.produits = produits.reverse();
         //this.typeProduits = data.type_produits;
         this.boutique_id = id;

         this.last_id++;

       });
    });
  }

  /* ionViewDidEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getPlageDocs(id + ':produit', id+ ':produit:\ufff0').then((produits) => {

         if(produits.length > 0){
            this.last_id = produits[produits.length - 1].id;
         }
         
         this.produits = produits.reverse();
         //this.typeProduits = data.type_produits;
         this.boutique_id = id;

         this.last_id++;

       });
    });
  }*/

  /*ionViewDidLoad() {
    //let boutiques: any;
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.produits = data.produits;
         this.boutique_id = id;
         if(data.produits.length > 0){
            this.last_id = data.produits[data.produits.length - 1].id;
         }

         this.last_id++;

       });
    });
  }*/

  ajouter(last_id, boutique_id/*, typeProduits*/){
    if(boutique_id /*&& typeProduits.length > 0*/){
      this.navCtrl.push(AjouterProduitPage, {'last_id': last_id, 'boutique_id': boutique_id} );
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'La boutique ou les types de produits non défini ',
        buttons:[
          {
            text: 'Ok',
            role: 'Cancel',
            hendler: () => console.log('Pas de boutique')
          }
        ]
      });
      alert.present();
    }
  }

  detail(produit, boutique_id){
    this.navCtrl.push(DetailProduitPage, {'produit': produit, 'boutique_id': boutique_id});
  }

}
