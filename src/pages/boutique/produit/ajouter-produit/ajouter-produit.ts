import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AjouterProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-produit',
  templateUrl: 'ajouter-produit.html'
})
export class AjouterProduitPage {

  produit: any;
  selectedUnite: any = '';
  prix_total = 0;
  unites: any = [];
  typeProduits = [];
  selectedTypeProduits: any;
  constructor(public toastCtl: ToastController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    let last_id = this.navParams.data.last_id;
    let boutique_id = this.navParams.data.boutique_id;

    this.gestionService.getBoutiqueById(boutique_id).then((boutique) => {
      this.typeProduits = boutique.type_produits;
      });

    
    this.unites = ['kg' , 'g', 'sachet de 100 grammes', 'sachet de 25 grammes', 'bloc de 100 grammes', 'tia', 'litre', 
    'comprimé', 'autre'];

    this.produit = this.formBuilder.group({
      _id: [boutique_id + ':produit:' + last_id, Validators.required],
      type_produit: ['', Validators.required],
      nom_produit: ['', Validators.required],
      quantite: [0, Validators.required],
      prix: [0, Validators.required],
      unite_mesure: ['', Validators.required],
      prix_total: [0, Validators.required]
    });
  }

  ionViewDidLoad() {
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

  ajouter(){
    let boutique: any = {} ;
    let produits: any = [] ;
    /*this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         if(data.produits){
          produits = data.produits;
         }
         
         //for(let boutique of boutiques){
          produits.push(this.produit.value);
          boutique.produits = produits;

          this.gestionService.updateBoutique(boutique);
        //}
       });
    });*/

    this.gestionService.createDoc(this.produit.value);
    let toast = this.toastCtl.create({
      message: 'Produit sauvegardée...',
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
