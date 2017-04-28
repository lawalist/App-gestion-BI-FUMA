import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Validators, FormBuilder } from '@angular/forms';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the ModifierAchat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-achat',
  templateUrl: 'modifier-achat.html'
})
export class ModifierAchatPage {

  achat: any;
  ancienAchat: any;
  produits: any;
  totalPrix: any = 0;
  quantite: any = 0;
  prixUnitaire: any;
  selectedProduit: any;
  quantiteMax: any = '';
  boutique_id: any;

  constructor(public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public toastCtl: ToastController, public formbuilder: FormBuilder, public gestionService: GestionBoutique) {
    this.ancienAchat = this.navParams.get('achat');
    this.boutique_id = this.navParams.data.boutique_id;

    this.selectedProduit = this.ancienAchat.produit;
    this.prixUnitaire = this.ancienAchat.produit.prix;
    this.totalPrix = this.ancienAchat.prix;
    this.quantiteMax = this.ancienAchat.quantite;


    this.achat = this.formbuilder.group({
      id: [this.ancienAchat.id],
      nom_vendeur: [this.ancienAchat.nom_vendeur, Validators.required],
      prenom_vendeur: [this.ancienAchat.prenom_vendeur, Validators.required],
      produit: [this.ancienAchat.produit, Validators.required],
      quantite: [this.ancienAchat.quantite, Validators.required],
      prix: [this.ancienAchat.prix, Validators.required],
      date_vente: [this.ancienAchat.date_vente, Validators.required],
    });

    //enlever le produit selectionné de la liste
    this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.produits = boutique.produits;
      this.produits.forEach((prod, index) => {
        if(prod.id === this.ancienAchat.produit.id){
          this.produits.splice(index, 1);
        }
      })
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModifierAchatPage');
  }

  modifier(){

    let boutique: any = {} ;
    let achats: any = [] ;
    let nq: any = 0;
    let produits: any = [];
    let indexAchat: any;

    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         achats = data.achats;
         let nouveauAchat = this.achat.value;
         let produits = data.produits;

         achats.forEach((achat, index) => {
           if(achat.id === nouveauAchat.id){

             //cas d'une augmentation de la quantité du produit
             if(parseInt(achat.quantite) < parseInt(nouveauAchat.quantite)){
               nq = parseInt(nouveauAchat.quantite) - parseInt(achat.quantite);
               //cas d'une duminition de la quantité du produit
             }else if(parseInt(achat.quantite) > parseInt(nouveauAchat.quantite)){
              nq = parseInt(nouveauAchat.quantite) - parseInt(achat.quantite);
             }

            achats[index] = nouveauAchat;
            indexAchat = index;
           }
         });
         
         produits = data.produits
         //Calculer la nouvelle valeur du produit restant
         produits.forEach((prod, index) => {
          if(prod.id === nouveauAchat.produit.id){
              //prod.quantite = prod.quantite 
              produits[index].quantite = parseInt(produits[index].quantite) + parseInt(nq);
              //metre à jour la valeur du produit de la vente
              //ventes[indexAchat].produit = produits[index];
            }
         });

          boutique.achats = achats;
          boutique.produits = produits;
          this.gestionService.updateBoutique(boutique);
        //}
       });
    });


    //let achat = this.achat.value;
    //this.gestionService.updateAchat(achat);
   
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
