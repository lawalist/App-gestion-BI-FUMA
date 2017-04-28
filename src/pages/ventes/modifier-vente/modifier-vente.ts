import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the ModifierVente page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-vente',
  templateUrl: 'modifier-vente.html'
})
export class ModifierVentePage {
  vente: any;
  ancienVent:any;
  produits: any;
  tousProduits: any;
  totalPrix: any;
  quantite: any = 0;
  prixUnitaire: any;
  selectedProduit: any = {} ;
  selectedTypeProduit: any;
  selectedProduitPrixUnitaire: any = '';
  quantiteMax: any = '';
  boutique_id: any;
  textQuantite: string = 'Quantité';
  textQuantiteMax: any = '';
  textQuantiteMaxInitial: any = '';
  typeProduits: any = [];

  constructor(public storage: Storage, public navCtrl: NavController, public alertCtl: AlertController, public navParams: NavParams,public toastCtl: ToastController, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    this.ancienVent = this.navParams.get('vente');
    //this.selectedProduit = this.ancienVent.produit;
    this.boutique_id = this.navParams.data.boutique_id;
    this.prixUnitaire = this.ancienVent.prix_unitaire;
    this.totalPrix = this.ancienVent.montant_total;
    this.quantiteMax = this.ancienVent.quantite;
    this.selectedTypeProduit = this.ancienVent.type_produit;
    this.selectedProduitPrixUnitaire = this.ancienVent.prix_unitaire;

    this.textQuantite = 'Quantité (' + this.ancienVent.unite +')';
    //this.textQuantiteMax = this.ancienVent.quantite + ' (' + this.ancienVent.unite +')';

    //enlever le produit selectionné de la liste
    this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
    this.tousProduits = boutique.produits;
    this.typeProduits = boutique.type_produits;

    this.produits = [];
    this.tousProduits.forEach((tprod, index) => {
      if(tprod.type_produit === this.selectedTypeProduit){
        this.produits.push(tprod);
      }
    });

      this.tousProduits.forEach((tprod, index) => {
          if(tprod.id === this.ancienVent.code_produit){
            //this.produits.splice(index, 1);
            this.selectedProduit = tprod;
            this.textQuantiteMax = tprod.quantite + ' (' + tprod.unite_mesure +')';
            this.textQuantiteMaxInitial = this.textQuantiteMax;
          }
        });
      });

    this.vente = this.formBuilder.group({
      id: [this.ancienVent.id],
      type_operation: [this.ancienVent.type_operation],
      date_vente: [this.ancienVent.date_vente, Validators.required],
      code_produit: [this.ancienVent.code_produit, Validators.required],
      type_produit: [this.ancienVent.type_produit, Validators.required],
      unite: [this.ancienVent.unite],
      quantite: [this.ancienVent.quantite, Validators.compose([Validators.required])],
      prix_unitaire: [this.ancienVent.prix_unitaire, Validators.required],
      montant_total: [this.ancienVent.montant_total, Validators.compose([Validators.required])],
      nom_client: [this.ancienVent.nom_client],
      sex_client: [this.ancienVent.sex_client],
      village_client: [this.ancienVent.village_client],
      op_client: [this.ancienVent.op_client],
      observation: [this.ancienVent.observation],
      matricule_gerant : [this.ancienVent.matricule_gerant],
      nom_gerant: [this.ancienVent.nom_gerant],
      prenom_gerant: [this.ancienVent.prenom_gerant]
    });

    //this.choisiTypeProduit();
  }

  ionViewDidLoad() {
   /* this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.produits = boutique.produits;
    });*/
  }

  choisiTypeProduit(){
    this.produits = [];
    this.tousProduits.forEach((tprod, index) => {
      if(tprod.type_produit === this.selectedTypeProduit){
        this.produits.push(tprod);
      }
    });

    if(this.selectedTypeProduit === this.ancienVent.type_produit){
      //on charge les anciens donnees
      this.tousProduits.forEach((tprod, index) => {
          if(tprod.id === this.ancienVent.code_produit){
            //this.produits.splice(index, 1);
            this.selectedProduit = tprod;
          }
        });

      this.selectedProduitPrixUnitaire = this.ancienVent.prix_unitaire;
      this.textQuantite = 'Quantité (' + this.ancienVent.unite_mesure +')';
      this.textQuantiteMax = this.textQuantiteMaxInitial;// this.ancienVent.quantite + ' (' + this.ancienVent.unite_mesure +') ici';
      this.totalPrix = this.ancienVent.montant_total;
      this.quantiteMax = this.ancienVent.quantite;

    }else{
      this.selectedProduitPrixUnitaire = '';
      this.totalPrix = '';
      this.quantiteMax = '';
      this.textQuantite = 'Quantité';
      this.textQuantiteMax = '';
    }
  }

  ionViewWillEnter(){
    /*this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.produits = boutique.produits;
    });*/
  }

  ionViewDidEnter(){
    /*this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.produits = boutique.produits;
    });*/
  }

  ionChange(){

    if(this.selectedTypeProduit === this.ancienVent.type_produit && this.ancienVent.code_produit === this.selectedProduit.id){
      //on charge les anciens donnees      
      this.selectedProduitPrixUnitaire = this.ancienVent.prix_unitaire;
      this.textQuantite = 'Quantité (' + this.ancienVent.unite_mesure +')';
      this.textQuantiteMax = this.ancienVent.quantite + ' (' + this.ancienVent.unite_mesure +')';
      this.totalPrix = this.ancienVent.montant_total;
      this.quantiteMax = this.ancienVent.quantite;
    }else{
      this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
      this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
      this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
      //Au cas ou la quantite n'est pas null, on calculle nouveau montant total
      if(parseInt(this.quantiteMax)){
        //Au cas ou la quantite n'est pas null, on calculle nouveau montant total
        let v = this.vente.value;
        //let q = v.quantite;
        this.prixUnitaire = this.selectedProduit.prix;
        this.quantite = v.quantite;
        if(parseInt(this.quantite)){
          if((parseInt(this.quantite) - parseInt(this.ancienVent.quantite))<= parseInt(this.selectedProduit.quantite)){
          this.totalPrix = this.prixUnitaire * this.quantite;
        }else{
          //quantite par existante supperieur au sotck
            this.quantiteMax = '';
            this.totalPrix = '';
          }
        }else{
          //le cas oula quanite est null
          this.totalPrix = '';
        }
      }else{
        this.totalPrix = '';
      }
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

  onKeyup(){
    let v = this.vente.value;
    //let q = v.quantite;
    if(this.selectedProduit){
      this.prixUnitaire = this.selectedProduit.prix;
      this.quantite = v.quantite;
      if(parseInt(this.quantite)){
        if((parseInt(this.quantite) - parseInt(this.ancienVent.quantite))<= parseInt(this.selectedProduit.quantite)){
        this.totalPrix = this.prixUnitaire * this.quantite;
        }else{
          let alert = this.alertCtl.create({
          title: 'Erreur!',
          message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
          buttons: [{
            text: 'Ok',
            handler: () => {
              if(this.selectedProduit.id === this.ancienVent.code_produit){
                //On charge lesanciennes donnees
                this.quantiteMax = this.ancienVent.quantite;
                this.totalPrix = this.ancienVent.montant_total;
              }else{
                this.quantiteMax = this.selectedProduit.quantite;
                this.totalPrix = parseInt(this.selectedProduit.quantite) * parseInt(this.selectedProduit.prix) ;
              }
              
            }
          }]
        });

        alert.present();
        }
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

  modifier(){

    let boutique: any = {} ;
    let ventes: any = [] ;
    let operations: any = [] ;
    let nq: any = 0;
    let nm: any = 0;
    let produits: any = [];
    let indexVente: any;

    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         let produits = data.produits;
         //ventes = data.ventes;
         operations = data.operations;
         let nouvelleVente = this.vente.value;

         //mise a jour produit
         nouvelleVente.code_produit = this.selectedProduit.id;
         nouvelleVente.nom_produit = this.selectedProduit.nom_produit;
         nouvelleVente.unite = this.selectedProduit.unite_mesure;

         //ventes.forEach((vente, index) => {
         operations.forEach((operation, index) => {
           if(operation.id === nouvelleVente.id){
             //cas du meme produit
             if(nouvelleVente.code_produit === this.ancienVent.code_produit){
              //cas d'une augmentation de la quantité du produit
                if(parseInt(operation.quantite) < parseInt(nouvelleVente.quantite)){
                  nq = parseInt(nouvelleVente.quantite) - parseInt(operation.quantite);
                  nm = parseInt(nouvelleVente.montant_total) - parseInt(operation.montant_total);
                  //cas d'une duminition de la quantité du produit
                }else if(parseInt(operation.quantite) > parseInt(nouvelleVente.quantite)){
                  nq = parseInt(nouvelleVente.quantite) - parseInt(operation.quantite);
                  nm = parseInt(nouvelleVente.montant_total) - parseInt(operation.montant_total);
                }

                //on met a jour la nouvelle vente
                //ventes[index] = nouvelleVente;
                operations[index] = nouvelleVente;
                indexVente = index;

                //on met a jour la quantite du produit
                produits = data.produits
                //Calculer la nouvelle valeur du produit restant
                produits.forEach((prod, index) => {
                  if(prod.id === nouvelleVente.code_produit){
                      //prod.quantite = prod.quantite 
                      produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                      //metre à jour la valeur du produit de la vente
                      //ventes[indexVente].produit = produits[index];
                    }
                });

                //on met a jour le solde de la caisse
                if(parseInt(boutique.solde_caisse)){
                  boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nm);
                }else{
                  boutique.solde_caisse = parseInt(nm);
                }
         
             }else{

                //on met a jour la quantite du produit
                produits = data.produits
                //Calculer la nouvelle valeur du produit restant
                produits.forEach((prod, index) => {
                  //Restituerl'ancienne quantite du produit
                  if(prod.id === this.ancienVent.code_produit){
                      //prod.quantite = prod.quantite 
                      produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienVent.quantite);
                      //metre à jour la valeur du produit de la vente
                      //ventes[indexVente].produit = produits[index];
                    }
                  
                  //metre a jour la quantite du nouveau produit achete
                  if(prod.id === nouvelleVente.code_produit){
                    //prod.quantite = prod.quantite 
                    produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleVente.quantite);
                    //metre à jour la valeur du produit de la vente
                    //ventes[indexVente].produit = produits[index];
                  }
                });
                
                //ventes[index] = nouvelleVente;
                //indexVente = index;
                //ventes[index] = nouvelleVente;
                //operations[index] = nouvelleVente;
                //indexVente = index;

                //on met a jour le solde de la caisse
                if(parseInt(boutique.solde_caisse)){
                  boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.ancienVent.montant_total);
                  boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleVente.montant_total);
                }else{
                  boutique.solde_caisse = - parseInt(this.ancienVent.montant_total);
                  boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleVente.montant_total);
                }
             }
                
           }
         });

         
        //boutique.ventes = ventes;
        boutique.operations = operations;
        boutique.produits = produits;
        this.gestionService.updateBoutique(boutique);
        //}
       });
    });
    //let vent = this.vente.value;
    //this.gestionService.updateVente(vent);
    
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
