import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique'
import { Storage } from '@ionic/storage';

/*
  Generated class for the ModifierProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-produit',
  templateUrl: 'modifier-produit.html'
})
export class ModifierProduitPage {

  produit: any;
  ancienProduit: any;
  selectedUnite: any = '';
  prix_total: any = 0;
  unites: any = [];
  typeProduits: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public storage: Storage, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    this.ancienProduit = this.navParams.get('produit');
    let boutique_id = this.navParams.data.boutique_id;
    //this.typeProduits = this.navParams.data.typeProduits;
    this.selectedUnite = this.ancienProduit.unite_mesure;
    this.prix_total = this.ancienProduit.prix_total;
    this.unites = ['kg', 'g', 'sachet de 100 grammes', 'sachet de 25 grammes', 'bloc de 100 grammes', 
    'tia', 'litre', 'comprimé', 'autre'];

    /*this.unites.forEach((index, val) => {
      if(val === this.ancienProduit.unite_mesure){
        this.unites.splice(index, 1);
      }
    });*/

    this.gestionService.getBoutiqueById(boutique_id).then((boutique) => {
      this.typeProduits = boutique.type_produits;
      });


    this.produit = this.formBuilder.group({
      _id: [this.ancienProduit._id],
      _rev: [this.ancienProduit._rev],
      type_produit: [this.ancienProduit.type_produit, Validators.required],
      nom_produit: [this.ancienProduit.nom_produit, Validators.required],
      quantite: [this.ancienProduit.quantite, Validators.required],
      unite_mesure: [this.ancienProduit.unite_mesure, Validators.required],
      prix: [this.ancienProduit.prix, Validators.required],
      prix_total: [this.ancienProduit.prix_total, Validators.required]
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModifierProduitPage');
  }

  onKeyupQuantite(){
   let p = this.produit.value;
   if(p.prix){
     this.prix_total = parseInt(p.quantite) * parseInt(p.prix);
   }
  }

  onKeyupPrixUnitaire(){
    let p = this.produit.value;
   if(p.quantite){
     this.prix_total = parseInt(p.quantite) * parseInt(p.prix);
   }
  }


  modifier(produit){

    let boutique: any = {} ;
    let produits: any = [] ;
    /*this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         produits = data.produits;
         let nouveauProduit = this.produit.value;
         produits.forEach((prod, index) => {
           if(prod.id === nouveauProduit.id){
            produits[index] = nouveauProduit;
           }
         });
         
          boutique.produits = produits;
          this.gestionService.updateBoutique(boutique);
        //}
       });
    });*/


    //let achat = this.achat.value;
    //this.gestionService.updateAchat(achat);
    this.gestionService.updateDoc(this.produit.value);
    let toast = this.toastCtl.create({
      message: 'Modification sauvegardée...',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    this.navCtrl.pop();
  }

  annuler(){
    this.navCtrl.pop();
  }

}
