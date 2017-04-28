import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the ModifierOperation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-operation',
  templateUrl: 'modifier-operation.html'
})
export class ModifierOperationPage {
  operation: any;
  ancienOperation:any;
  produits: any;
  tousProduits: any;
  totalPrix: any;
  quantite: any = 0;
  prixUnitaire: any;
  selectedProduit: any = {} ;
  selectedTypeOperation: any = '';
  selectedTypeProduit: any;
  selectedProduitPrixUnitaire: any = '';
  quantiteMax: any = '';
  boutique_id: any;
  textQuantite: string = 'Quantité';
  textQuantiteMax: any = '';
  textQuantiteMaxInitial: any = '';
  typeProduits: any = [];
  typeOperation: any = [];
  boutique: any;

  constructor(public storage: Storage, public navCtrl: NavController, public alertCtl: AlertController, public navParams: NavParams,public toastCtl: ToastController, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    this.ancienOperation = this.navParams.get('operation');
    //this.selectedProduit = this.ancienVent.produit;
    this.boutique_id = this.navParams.data.boutique_id;
    this.prixUnitaire = this.ancienOperation.prix_unitaire;
    this.totalPrix = this.ancienOperation.montant_total;
    this.quantiteMax = this.ancienOperation.quantite;
    this.selectedTypeProduit = this.ancienOperation.type_produit;
    this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
    this.selectedTypeOperation = this.ancienOperation.type;
    this.typeOperation = ['VENTE' , 'DEPENSE', 'DECAISSEMENT', 'LOCATION', 'RETOUR LOCATION', 'SUBVENTION'];


    this.textQuantite = 'Quantité (' + this.ancienOperation.unite +')';
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
          if(tprod.id === this.ancienOperation.code_produit){
            //this.produits.splice(index, 1);
            this.selectedProduit = tprod;
            //this.textQuantiteMax = 'Stock disponigle: ' + tprod.quantite + ' (' + tprod.unite_mesure +')';
            this.textQuantiteMaxInitial = this.textQuantiteMax;
            switch (this.ancienOperation.type){
              case 'VENTE':
                this.textQuantiteMax = 'Stock disponigle: ' + tprod.quantite + ' (' + tprod.unite_mesure +')';
                break;
              case 'DEPENSE':
                this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
                break;
                case 'DECAISSEMENT':
                  this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
                break;
              case 'LOCATION':
                this.textQuantiteMax = 'Stock disponigle: ' + tprod.quantite + ' (' + tprod.unite_mesure +')';
                break;
                case 'RETOUR LOCATION':
                  this.textQuantiteMax = '';
                break;
              case 'SUBVENTION':
                this.textQuantiteMax = '';
                break;
            }
          }
        });
      });

    this.operation = this.formBuilder.group({
      id: [this.ancienOperation.id],
      type: [this.ancienOperation.type],
      date: [this.ancienOperation.date, Validators.required],
      code_produit: [this.ancienOperation.code_produit, Validators.required],
      type_produit: [this.ancienOperation.type_produit, Validators.required],
      unite: [this.ancienOperation.unite],
      quantite: [this.ancienOperation.quantite, Validators.compose([Validators.required])],
      prix_unitaire: [this.ancienOperation.prix_unitaire, Validators.required],
      montant_total: [this.ancienOperation.montant_total, Validators.compose([Validators.required])],
      nom_client: [this.ancienOperation.nom_client],
      sex_client: [this.ancienOperation.sex_client],
      village_client: [this.ancienOperation.village_client],
      op_client: [this.ancienOperation.op_client],
      observation: [this.ancienOperation.observation],
      matricule_gerant : [this.ancienOperation.matricule_gerant],
      nom_gerant: [this.ancienOperation.nom_gerant],
      //prenom_gerant: [this.ancienOperation.prenom_gerant],
      solde_caisse: [this.ancienOperation.solde_caisse],
      solde_tresor: [this.ancienOperation.solde_tresor]
    });

    //this.choisiTypeProduit();
  }

  ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.boutique = data;
       });
      });
  
  }

   choixTypeOperation(){
    let op = this.operation.value;
    switch (op.type){
      case 'DEPENSE':
        this.selectedProduitPrixUnitaire = '';
        this.selectedProduit = '';
        this.selectedTypeProduit = '';
        this.textQuantite = 'Quantité';
        this.totalPrix = '';
        this.quantiteMax = '';
        this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
        break;
      case 'DECAISSEMENT':
        this.selectedProduitPrixUnitaire = '';
        this.textQuantite = 'Quantité';
        this.selectedProduit = '';
        this.selectedTypeProduit = '';
        this.totalPrix = '';
        this.quantiteMax = '';
        this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
        break;
      default:
        this.selectedProduitPrixUnitaire = '';
        this.textQuantite = 'Quantité';
        this.selectedProduit = '';
        this.selectedTypeProduit = '';
        this.totalPrix = '';
        this.quantiteMax = '';
        this.textQuantiteMax = '';
        break;
    }
  }

  choisiTypeProduit(){
    this.produits = [];
    this.tousProduits.forEach((tprod, index) => {
      if(tprod.type_produit === this.selectedTypeProduit){
        this.produits.push(tprod);
      }
    });

    if(this.selectedTypeProduit === this.ancienOperation.type_produit){
      //on charge les anciens donnees
      this.tousProduits.forEach((tprod, index) => {
          if(tprod.id === this.ancienOperation.code_produit){
            //this.produits.splice(index, 1);
            this.selectedProduit = tprod;
          }
        });

      this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
      this.textQuantite = 'Quantité (' + this.ancienOperation.unite_mesure +')';
      this.textQuantiteMax = this.textQuantiteMaxInitial;// this.ancienVent.quantite + ' (' + this.ancienVent.unite_mesure +') ici';
      this.totalPrix = this.ancienOperation.montant_total;
      this.quantiteMax = this.ancienOperation.quantite;

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

 /* ionChange(){

    if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
      //on charge les anciens donnees      
      this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
      this.textQuantite = 'Quantité (' + this.ancienOperation.unite_mesure +')';
      this.textQuantiteMax = this.ancienOperation.quantite + ' (' + this.ancienOperation.unite_mesure +')';
      this.totalPrix = this.ancienOperation.montant_total;
      this.quantiteMax = this.ancienOperation.quantite;
    }else{
      this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
      this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
      this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
      //Au cas ou la quantite n'est pas null, on calculle nouveau montant total
      if(parseInt(this.quantiteMax)){
        //Au cas ou la quantite n'est pas null, on calculle nouveau montant total
        let v = this.operation.value;
        //let q = v.quantite;
        this.prixUnitaire = this.selectedProduit.prix;
        this.quantite = v.quantite;
        if(parseInt(this.quantite)){
          if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite))<= parseInt(this.selectedProduit.quantite)){
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
*/

  ionChange(){
    /*this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
    this.selectedProduitPrixUnitaire = this.selectedProduit.prix;*/
    let op = this.operation.value;
  
    switch (op.type){
      case 'VENTE':
        if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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
        
        break;
      case 'DEPENSE':

        if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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

        break;
        case 'DECAISSEMENT':

        if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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
        break;
      case 'LOCATION':
        if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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
        
        //this.textQuantiteMax = 'Stock disponigle: '+ this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
        break;
        case 'RETOUR LOCATION':
          if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = '';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = '';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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
        break;
      case 'SUBVENTION':
         if(this.selectedTypeProduit === this.ancienOperation.type_produit && this.ancienOperation.code_produit === this.selectedProduit.id){
          //on charge les anciens donnees      
          this.selectedProduitPrixUnitaire = this.ancienOperation.prix_unitaire;
          this.textQuantite = 'Quantité (' + this.ancienOperation.unite +')';
          //this.textQuantiteMax = 'Stock disponigle: '+ this.ancienOperation.quantite + ' (' + this.ancienOperation.unite +')';
          this.textQuantiteMax = '';
          this.totalPrix = this.ancienOperation.montant_total;
          this.quantiteMax = this.ancienOperation.quantite;
        }else{
          this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          //this.textQuantiteMax = 'Stock disponigle: ' + this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
          this.textQuantiteMax = '';
          this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
          //Au cas ou la quantite n'est pas null
          if(parseInt(this.quantiteMax)){
            //on calculle nouveau montant total
            //let op = this.operation.value;
            //let q = v.quantite;
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;
            if(parseInt(this.quantite)){
              if((parseInt(this.quantite) - parseInt(this.ancienOperation.quantite)) <= parseInt(this.selectedProduit.quantite)){
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
        break;
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
    let op = this.operation.value;
    let qt = 0;
    switch (op.type){
      case 'VENTE':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;
          if(parseInt(this.quantite)){
            if(this.selectedProduit.id === this.ancienOperation.code_produit){
              qt = parseInt(this.quantite) - parseInt(this.ancienOperation.quantite);
            }else{
              qt = parseInt(this.quantite);
            }
            if(qt <= parseInt(this.selectedProduit.quantite)){
            this.totalPrix = this.prixUnitaire * this.quantite;
            }else{
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
              buttons: [{
                text: 'Ok',
                handler: () => {
                  if(this.selectedProduit.id === this.ancienOperation.code_produit){
                    //On charge lesanciennes donnees
                    this.quantiteMax = this.ancienOperation.quantite;
                    this.totalPrix = this.ancienOperation.montant_total;
                  }else{
                    this.quantiteMax = this.selectedProduit.quantite;
                    this.totalPrix = parseInt(this.selectedProduit.quantite) * parseInt(this.selectedProduit.prix) ;
                  }
                  
                }
              }]
            });

            alert.present();
            }
          }else{

          }      
        }else{
          let alert = this.alertCtl.create({
            title: 'Erreur!',
            message: 'Vous devez choisir un produit',
            buttons: ['Ok']
          });

          alert.present();
        }
        break;
      case 'DEPENSE':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;

          if(parseInt(this.quantite)){
            this.totalPrix = this.prixUnitaire * this.quantite;
            if(this.selectedProduit.id === this.ancienOperation.code_produit){
              qt = parseInt(this.totalPrix) - parseInt(this.ancienOperation.solde_tresor);
            }else{
              qt = this.totalPrix;
            }
            if(qt > this.boutique.solde_tresor){
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'Le solde du trésor est insuffisant: '+ this.boutique.solde_tresor +'FCFA',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  if(this.selectedProduit.id === this.ancienOperation.code_produit){
                    //On charge lesanciennes donnees
                    this.quantiteMax = this.boutique.solde_tresor;
                    this.totalPrix = this.boutique.solde_tresor;
                  }else{
                    this.quantiteMax = 0;
                    this.totalPrix = 0;
                  }
                  
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
        break;
      case 'DECAISSEMENT':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;
          this.totalPrix = this.prixUnitaire * this.quantite;
          //let montantPoassible = this.boutique.solde_caisse;

          if(parseInt(this.totalPrix)){
            if(this.selectedProduit.id === this.ancienOperation.code_produit){
              qt = parseInt(this.totalPrix) - parseInt(this.ancienOperation.solde_caisse);
            }else{
              qt = parseInt(this.totalPrix);
            }
            if(qt > parseInt(this.boutique.solde_caisse)){
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'Le solde en caisse est insuffisant: '+ this.boutique.solde_caisse+'FCFA',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  if(this.selectedProduit.id === this.ancienOperation.code_produit){
                    //On charge lesanciennes donnees
                    this.quantiteMax = this.boutique.solde_caisse;
                  this.totalPrix = this.boutique.solde_caisse;
                  }else{
                    this.quantiteMax = 0;
                    this.totalPrix = 0;
                  }
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
        break;
      case 'LOCATION':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;
          if(parseInt(this.quantite)){
            if(this.selectedProduit.id === this.ancienOperation.code_produit){
              qt = parseInt(this.quantite) - parseInt(this.ancienOperation.quantite);
            }else{
              qt = parseInt(this.quantite);
            }
            if(qt <= parseInt(this.selectedProduit.quantite)){
            this.totalPrix = this.prixUnitaire * this.quantite;
            }else{
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
              buttons: [{
                text: 'Ok',
                handler: () => {
                  if(this.selectedProduit.id === this.ancienOperation.code_produit){
                    //On charge lesanciennes donnees
                    this.quantiteMax = this.ancienOperation.quantite;
                    this.totalPrix = this.ancienOperation.montant_total;
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
        break;
      case 'RETOUR LOCATION':
        if(this.selectedProduit){
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;

            if(parseInt(this.quantite)){
              this.totalPrix = this.prixUnitaire * this.quantite;
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
        break;
      case 'SUBVENTION':
        if(this.selectedProduit){
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;

            if(parseInt(this.quantite)){
              this.totalPrix = this.prixUnitaire * this.quantite;
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
        break;
    }

    //let q = v.quantite;
  }

  modifier(){

    let boutique: any = {} ;
    //let ventes: any = [] ;
    let operations: any = [] ;
    let nq: any = 0;
    let nm: any = 0;
    let produits: any = [];
    let indexOperation: any;
    let toast: any;
    let alert: any;

    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         let produits = data.produits;
         //ventes = data.ventes;
         operations = data.operations;
         let nouvelleOperation = this.operation.value;
         let qMax: any = '';
         let inexProuit: any = '';
         let estOk: boolean = false;

         //mise a jour produit
         nouvelleOperation.code_produit = this.selectedProduit.id;
         nouvelleOperation.nom_produit = this.selectedProduit.nom_produit;
         nouvelleOperation.unite = this.selectedProduit.unite_mesure;

         switch(nouvelleOperation.type){
           case 'VENTE':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          if(qMax <= produits[index].quantite){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                            estOk = true;
                          } 
                  
                          //inexProuit = index;
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
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                      
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(produits[index].quantite) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                          estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_caisse)){
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_caisse = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }
                }

                if(estOk){
                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();
                }else{
                  alert = this.alertCtl.create({
                  title: 'Erreur!',
                  message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      this.quantiteMax = this.ancienOperation.quantite;
                      this.totalPrix = this.ancienOperation.montant_total;
                    }
                  }]
                });

                alert.present();
                }
                    
              }
            });
            break;
           case 'DEPENSE':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          if(qMax <= this.boutique.solde_tresor){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                            estOk = true;
                          } 
                  
                          //inexProuit = index;
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                    });

                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nm);
                    }else{
                      boutique.solde_tresor = parseInt(nm);
                    }
            
                }else{

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      //Restituerl'ancienne quantite du produit
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                      
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(this.boutique.solde_tresor) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                          estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_tresor = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }
                }

                if(estOk){
                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();
                }else{
                  alert = this.alertCtl.create({
                  title: 'Erreur!',
                  message: 'Le solde du trésor est insuffisant: '+ this.boutique.solde_tresor+'FCFA disponible',
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      this.quantiteMax = this.ancienOperation.quantite;
                      this.totalPrix = this.ancienOperation.montant_total;
                    }
                  }]
                });

                alert.present();
                }
                    
              }
            });
            break;
           case 'DECAISSEMENT':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          if(qMax <= this.boutique.solde_caisse){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                            estOk = true;
                          } 
                  
                          //inexProuit = index;
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

                    //on met a jour le solde de la tresor
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nm);
                    }else{
                      boutique.solde_tresor = parseInt(nm);
                    }
            
                }else{

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      //Restituerl'ancienne quantite du produit
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                      
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(this.boutique.solde_caisse) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                          estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_caisse)){
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_caisse = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }

                    //on met a jour le solde de la tresor
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_tresor = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }
                }

                if(estOk){
                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();
                }else{
                  alert = this.alertCtl.create({
                  title: 'Erreur!',
                  message: 'Le solde de la caisse est insuffisant: '+ this.boutique.solde_caisse +'FCFA disponible',
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      this.quantiteMax = this.ancienOperation.quantite;
                      this.totalPrix = this.ancienOperation.montant_total;
                    }
                  }]
                });

                alert.present();
                }
                    
              }
            });
            break;
           case 'LOCATION':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          if(qMax <= produits[index].quantite){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                            estOk = true;
                          } 
                  
                          //inexProuit = index;
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
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                         
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(produits[index].quantite) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                          estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_caisse)){
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_caisse = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }
                }

                if(estOk){
                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();
                }else{
                  alert = this.alertCtl.create({
                  title: 'Erreur!',
                  message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      this.quantiteMax = this.ancienOperation.quantite;
                      this.totalPrix = this.ancienOperation.montant_total;
                    }
                  }]
                });

                alert.present();
                }
                    
              }
            });
            break;
          case 'RETOUR LOCATION':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      //qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      //qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          //if(qMax <= produits[index].quantite){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                           // estOk = true;
                          //} 
                  
                          //inexProuit = index;
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                    });

                    //on met a jour le solde de la caisse
                    /*if(parseInt(boutique.solde_caisse)){
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nm);
                    }else{
                      boutique.solde_caisse = parseInt(nm);
                    }*/
            
                }else{

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      //Restituerl'ancienne quantite du produit
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                      
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(produits[index].quantite) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                          //estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    /*if(parseInt(boutique.solde_caisse)){
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_caisse = - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(nouvelleOperation.montant_total);
                    }*/
                }

                if(estOk){
                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();
                }else{
                  alert = this.alertCtl.create({
                  title: 'Erreur!',
                  message: 'La quantité choisi est supérieur à la quantité disponible: '+ this.selectedProduit.quantite,
                  buttons: [{
                    text: 'Ok',
                    handler: () => {
                      this.quantiteMax = this.ancienOperation.quantite;
                      this.totalPrix = this.ancienOperation.montant_total;
                    }
                  }]
                });

                alert.present();
                }
                    
              }
            });
            break;
           case 'SUBVENTION':
            operations.forEach((operation, index) => {
              if(operation.id === nouvelleOperation.id){
                //cas du meme produit
                if(nouvelleOperation.code_produit === this.ancienOperation.code_produit){
                  //cas d'une augmentation de la quantité du produit
                    if(parseInt(operation.quantite) < parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      //qMax = nq;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                      //cas d'une duminition de la quantité du produit
                    }else if(parseInt(operation.quantite) > parseInt(nouvelleOperation.quantite)){
                      nq = parseInt(nouvelleOperation.quantite) - parseInt(operation.quantite);
                      //qMax = nouvelleOperation.quantite;
                      nm = parseInt(nouvelleOperation.montant_total) - parseInt(operation.montant_total);
                    }

                    //on met a jour la nouvelle vente
                    indexOperation = index;
                    operations[index] = nouvelleOperation;
                   

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      if(prod.id === nouvelleOperation.code_produit){
                          //prod.quantite = prod.quantite
                          //if(qMax <= produits[index].quantite){
                            produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nq);
                            //estOk = true;
                          //} 
                  
                          //inexProuit = index;
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                    });

                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nm);
                    }else{
                      boutique.solde_tresor = parseInt(nm);
                    }
            
                }else{

                    //on met a jour la quantite du produit
                    produits = data.produits
                    //Calculer la nouvelle valeur du produit restant
                    produits.forEach((prod, index) => {
                      //Restituerl'ancienne quantite du produit
                      if(prod.id === this.ancienOperation.code_produit){
                          //prod.quantite = prod.quantite 
                          produits[index].quantite = parseInt(produits[index].quantite) + parseInt(this.ancienOperation.quantite);
                          //metre à jour la valeur du produit de la vente
                          //ventes[indexVente].produit = produits[index];
                        }
                      
                      //metre a jour la quantite du nouveau produit achete
                      if(prod.id === nouvelleOperation.code_produit){
                        //prod.quantite = prod.quantite 
                        if(parseInt(produits[index].quantite) >= parseInt(nouvelleOperation.quantite)){
                          produits[index].quantite = parseInt(produits[index].quantite) - parseInt(nouvelleOperation.quantite);
                         // estOk = true
                        }
                        
                        //metre à jour la valeur du produit de la vente
                        //ventes[indexVente].produit = produits[index];
                      }
                    });
                    
                    //on met a jour le solde de la caisse
                    if(parseInt(boutique.solde_tresor)){
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) - parseInt(this.ancienOperation.montant_total);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }else{
                      boutique.solde_tresor = - parseInt(this.ancienOperation.solde_tresor);
                      boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(nouvelleOperation.montant_total);
                    }
                }

                  boutique.operations = operations;
                  boutique.produits = produits;
                  this.gestionService.updateBoutique(boutique);

                  toast = this.toastCtl.create({
                    message: 'Modification sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  this.navCtrl.pop();                    
              }
            });
            break;
         }
         //ventes.forEach((vente, index) => {         
        //boutique.ventes = ventes;
        //}
       });
    });
    
  }

  annuler(){
    this.navCtrl.pop();
  }

}
