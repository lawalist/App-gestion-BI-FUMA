import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { AjouterBoutiquePage } from './ajouter-boutique/ajouter-boutique';
import { Storage } from '@ionic/storage';
import { ModifierBoutiquePage } from './modifier-boutique/modifier-boutique';
import { ProduitPage } from '../boutique/produit/produit';
import { GerantPage } from '../boutique/gerant/gerant';

/*
  Generated class for the Boutique page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-boutique',
  templateUrl: 'boutique.html'
})
export class BoutiquePage {
  boutiques: any;
  boutique_id = '';
  boutique: any = {};
  gerant: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public gestionService: GestionBoutique, public storage: Storage) {
    
  }

  ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
      this.boutique_id = id;
      if(id){
        this.gestionService.getBoutiqueById(id).then((res) => {
         this.boutique = res;
         res.gerants.forEach((gerant, index) => {
           if(gerant.status == 'En fonction'){
             this.gerant = gerant;
           }
         });
         this.boutique_id = id;
       }, error => console.log(error));
      }
    });
    
  }

  /*ionViewDidLoad() {
    //console.log('ionViewDidLoad BoutiquePage');
    this.storage.get('boutique_id').then((id) => {
      this.boutique_id = id;
      if(id){
        this.gestionService.getBoutiqueById(id).then((res) => {
         this.boutique = res;
         res.gerants.forEach((gerant, index) => {
           if(gerant.status == 'En fonction'){
             this.gerant = gerant;
           }
         });
         this.boutique_id = id;
       });
      }
    });
    
  }*/

  ajouter(){
    this.navCtrl.push(AjouterBoutiquePage);
  }

  modifier(boutique){
    this.navCtrl.push(ModifierBoutiquePage, {'boutique': boutique})
  }

  gestionGerants(){
    this.navCtrl.push(GerantPage);
  } 

  gestionProduits(){
    this.navCtrl.push(ProduitPage);
  } 
}
