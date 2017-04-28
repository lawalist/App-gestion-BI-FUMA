import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GestionBoutique } from '../../../providers/gestion-boutique';
import { testQuantite, testQuantitePositive } from '../../../monValidator/monValidator';

/*
  Generated class for the AjouterVente page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-vente',
  templateUrl: 'ajouter-vente.html'
})

export class AjouterVentePage {
  vente: any;
  produits: any;
  tousProduits: any;
  totalPrix: any;
  quantite: any = 0;
  prixUnitaire: any = 1;
  selectedProduit: any;
  selectedTypeProduit: any;
  selectedProduitPrixUnitaire: any = '';
  quantiteMax: any = '';
  textQuantite: string = 'Quantité';
  textQuantiteMax: any = '';
  typeProduits: any = [];

  constructor(public storage: Storage, public navCtrl: NavController, public viewCtl: ViewController, public alertCtl: AlertController, public navParams: NavParams, public toastCtl: ToastController, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    let last_id = this.navParams.data.last_id;
    this.tousProduits = this.navParams.data.produits;

    let boutique_id = this.navParams.data.boutique_id;

    this.gestionService.getBoutiqueById(boutique_id).then((boutique) => {
      this.typeProduits = boutique.type_produits;
      });

    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    if(this.selectedProduit){
      this.quantite = this.selectedProduit.quantite;
      this.vente = this.formBuilder.group({
        id: [last_id, Validators.required],
        type_operation: ['vente'],
        date_vente: [s, Validators.required],
        //type_produit: ['', Validators.required],
        type_produit: ['', Validators.required],
        code_produit: ['', Validators.required],
        unite: [''],
        quantite: [this.quantiteMax, Validators.compose([Validators.required])],
        prix_unitaire: [this.selectedProduit.prix, Validators.required],
        montant_total: [this.totalPrix, Validators.compose([Validators.required])],
        nom_client: [''],
        sex_client: [''],
        village_client: [''],
        op_client: [''],
        observation: [''],
      });

    }else{
      this.vente = this.formBuilder.group({
      //quantite: ['', Validators.compose([Validators.required, testQuantite(this.quantite + 1)])],
        id: [last_id, Validators.required],
        type_operation: ['vente'],
        //type_produit: ['', Validators.required],
        type_produit: ['', Validators.required],
        code_produit: ['', Validators.required],
        unite: [''],
        quantite: [this.quantiteMax, Validators.compose([Validators.required])],
        prix_unitaire: [this.prixUnitaire, Validators.required],
        montant_total: [this.totalPrix, Validators.compose([Validators.required])],
        date_vente: [s, Validators.required],
        nom_client: [''],
        sex_client: [''],
        village_client: [''],
        op_client: [''],
        observation: [''],
    });
    }
  }

  ionViewDidLoad() {
  }

  ionChange(){
    this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
    this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
    this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
  }

  choisiTypeProduit(){
    this.produits = [];
    this.tousProduits.forEach((tprod, index) => {
      if(tprod.type_produit === this.selectedTypeProduit){
        this.produits.push(tprod);
      }
    });
  }
  
  /*onSelect(prod){
    this.prixUnitaire = 500;// = prod.prix;
    //testQuantite(1);
  }*/

  onClick(){
    //let q = v.quantite;
    if(!this.selectedProduit){
      let alert = this.alertCtl.create({
        title: 'Erreur!',
        message: 'Vous devez choisir un produit',
        buttons: ['Ok']
      });

      alert.present();
    }
  }

  onClickChampsCalculAuto(){
    //let q = v.quantite;
    if(!this.selectedProduit){
      let alert = this.alertCtl.create({
        title: 'Erreur!',
        message: 'Vous devez choisir un produit',
        buttons: ['Ok']
      });

      alert.present();
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur!',
        message: 'Ce champs sera calculé automatiquement',
        buttons: ['Ok']
      });

      alert.present();
    }
  }

  onKeyup(){
    let v = this.vente.value;
    //let q = v.quantite;
    if(this.selectedProduit){
      this.prixUnitaire = this.selectedProduit.prix;
      this.quantite = v.quantite;

      if(parseInt(this.quantite)){
        if(parseInt(this.quantite) <= parseInt(this.selectedProduit.quantite)){
          this.totalPrix = this.prixUnitaire * this.quantite;
      }else{
        let alert = this.alertCtl.create({
        title: 'Erreur!',
        message: 'La quantité choisi est supérieur à la quantité disponible: '+this.selectedProduit.quantite,
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.quantiteMax = this.selectedProduit.quantite;
            this.totalPrix = this.prixUnitaire * this.quantiteMax;
          }
        }]
      });

      alert.present();
      }
   }else{
        this.totalPrix = 0;
      }
      
      
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur!',
        message: 'Vous devez choisir un produit',
        buttons: ['Ok']
      });

      alert.present();
    }
  }

  createDate(jour: any, moi: any, annee: any){
    let s = annee+'-';
    moi += 1;
    if(moi < 10){
      s += '0'+moi+'-';
    }else{
      s += moi+'-';
    }

    if(jour < 10){
      s += '0'+jour;
    }else{
      s += jour;
    }
    return s;
  }

  ajouter(){

    let boutique: any = {} ;
    let ventes: any = [] ;
    let operations: any = []
    let produits: any = [];
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         /*if(data.ventes){
          ventes = data.ventes;
         }*/

         if(data.operations){
          operations = data.operations;
         }

         let v = this.vente.value;

         //charger les informations concernant le produit
         //v.type_opration = 'vente';
         v.code_produit = this.selectedProduit.id;
         v.nom_produit = this.selectedProduit.nom_produit;
         v.unite = this.selectedProduit.unite_mesure;

         //chercher les information concernant le gérant et les mettre dans le detail de la vente
         data.gerants.forEach((gerant, index) => {
           if(gerant.status == 'En fonction'){
             v.matricule_gerant = gerant.id;
             v.nom_gerant = gerant.nom;
             v.prenom_gerant = gerant.prenom;
           }
         });
 
          //ventes.push(v);
          operations.push(v);

          //Mise a jour de la quantité du produit vendu
          produits = data.produits;
          produits.forEach((prod, index) => {
            if(prod.id === this.selectedProduit.id){
              //prod.quantite = prod.quantite 
              produits[index].quantite = parseInt(produits[index].quantite) - parseInt(v.quantite);
            }
          });

          //Mise à jour du montant de la caisse
          if(parseInt(boutique.solde_caisse)){
            boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(this.totalPrix);
          }else{
            boutique.solde_caisse = parseInt(this.totalPrix);
          }
          
          //boutique.ventes = ventes;
          boutique.operations = operations;
          boutique.produits = produits;

          this.gestionService.updateBoutique(boutique);
       });
    });

    let toast = this.toastCtl.create({
      message: 'Vente sauvegardée...',
      duration: 3000,
      position: 'top'
    });
    toast.present();
    //this.viewCtl.dismiss();
    this.navCtrl.pop();
  }

  annuler(){
    //this.viewCtl.dismiss();
    this.navCtrl.pop();
  }
}
