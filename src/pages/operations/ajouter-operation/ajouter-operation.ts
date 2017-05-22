import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GestionBoutique } from '../../../providers/gestion-boutique';
import { testQuantite, testQuantitePositive } from '../../../monValidator/monValidator';

/*
  Generated class for the AjouterOperation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-operation',
  templateUrl: 'ajouter-operation.html'
})

export class AjouterOperationPage {
  operation: any;
  nomProduit: any = '';
  produits: any;
  toast: any = '';
  tousProduits: any;
  totalPrix: any;
  quantite: any = 0;
  prixUnitaire: any = 1;
  selectedProduit: any;
  selectedTypeOperation: any = '';
  selectedTypeProduit: any;
  selectedProduitPrixUnitaire: any = '';
  quantiteMax: any = '';
  textQuantite: string = 'Quantité';
  textQuantiteMax: any = '';
  typeProduits: any = [];
  typeOperation: any = [];
  boutique: any = [];
  gerants: any = [];
  boutique_id: any;
  last_id: any;
  code_op: any = '';
  old_code_op: any;
  typeProduitDecaissement: any = [{
    "nom": "Argent"
  },];

  produitDecaissement: any = [{
      "_id": 'B:produit:AG999',
      "type_produit": "Argent",
      "nom_produit": "Argent",
      "quantite": 0,
      "prix": "1",
      "unite_mesure": "F",
      "prix_total": 0
    }];
  

  constructor(public storage: Storage, public navCtrl: NavController, public viewCtl: ViewController, public alertCtl: AlertController, public navParams: NavParams, public toastCtl: ToastController, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    this.last_id = this.navParams.data.last_id;
    //this.last_id = this.calculID(this.last_id);
    //this.tousProduits = this.navParams.data.produits;
    this.typeOperation = ['VENTE' , 'DEPENSE', 'DECAISSEMENT', 'LOCATION', 'RETOUR LOCATION', 'SUBVENTION'];

    this.boutique_id = this.navParams.data.boutique_id;

    this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.boutique = boutique;
      this.typeProduits = boutique.type_produits;
      this.produitDecaissement.quantite = boutique.solde_caisse;
      });

    this.code_op = this.last_id;
    this.old_code_op = this.code_op;
    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    if(this.selectedProduit){
      this.quantite = this.selectedProduit.quantite;
      this.operation = this.formBuilder.group({
        _id: [this.last_id, Validators.required],
        code_operation: [this.code_op, Validators.required],
        type: ['', Validators.required],
        date: [s, Validators.required],
        //type_produit: ['', Validators.required],
        type_produit: ['', Validators.required],
        code_produit: ['', Validators.required],
        nom_produit: ['', Validators.required],
        unite: [''],
        quantite: [this.quantiteMax, Validators.compose([Validators.required])],
        prix_unitaire: [this.selectedProduit.prix, Validators.required],
        montant_total: [this.totalPrix, Validators.compose([Validators.required])],
        matricule_client: [''],
        nom_client: [''],
        sex_client: [''],
        village_client: [''],
        op_client: [''],
        observation: [''],
      });

    }else{
      this.operation = this.formBuilder.group({
      //quantite: ['', Validators.compose([Validators.required, testQuantite(this.quantite + 1)])],
        _id: [this.last_id, Validators.required],
        type: ['', Validators.required],
        code_operation: [this.code_op, Validators.required],
        //type_produit: ['', Validators.required],
        type_produit: ['', Validators.required],
        code_produit: ['', Validators.required],
        nom_produit: ['', Validators.required],
        unite: [''],
        quantite: [this.quantiteMax, Validators.compose([Validators.required])],
        prix_unitaire: [this.prixUnitaire, Validators.required],
        montant_total: [this.totalPrix, Validators.compose([Validators.required])],
        date: [s, Validators.required],
        matricule_client: [''],
        nom_client: [''],
        sex_client: [''],
        village_client: [''],
        op_client: [''],
        observation: [''],
    });
    }
  }

  ionViewWillLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getPlageDocs(id + ':gerant', id + ':gerant:\ufff0').then((data) => {
         this.gerants = data;
       });

       this.gestionService.getPlageDocs(id + ':produit', id + ':produit:\ufff0').then((data) => {
         this.tousProduits = data;
         this.produits = data;
       });

      /* this.gestionService.getBoutiqueById(id).then((data) => {
         this.boutique = data;
       });*/
      });
  
  }

  choixTypeOperation(){
    let op = this.operation.value;

    this.code_op = op.type.substr(0,1).toUpperCase() + this.old_code_op.toString();
    switch (op.type){
      case 'DEPENSE':
        this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
        break;
      case 'DECAISSEMENT':
        //this.typeProduits
        //this.produits
        this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
        //this.selectedProduit = this.produitDecaissement[0];
        //this.selectedTypeProduit = this.typeProduitDecaissement[0];

        break;
      default:
        this.textQuantiteMax = '';
        break;
    }
  }
  
  ionChange(){
    this.textQuantite = 'Quantité (' + this.selectedProduit.unite_mesure +')';
    this.selectedProduitPrixUnitaire = this.selectedProduit.prix;
    this.selectedTypeProduit = this.selectedProduit.type_produit;
    this.nomProduit = this.selectedProduit.nom_produit;
    let op = this.operation.value;
  
    switch (op.type){
      case 'VENTE':
        this.textQuantiteMax = 'Stock disponigle: ' +this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
        break;
      case 'DEPENSE':
        this.textQuantiteMax = 'Solde trésor disponible: '+ this.boutique.solde_tresor + 'FCFA';
        break;
        case 'DECAISSEMENT':
          this.textQuantiteMax = 'Solde caisse disponible: '+ this.boutique.solde_caisse + 'FCFA';
        break;
      case 'LOCATION':
        this.textQuantiteMax = 'Stock disponigle: '+ this.selectedProduit.quantite + ' (' + this.selectedProduit.unite_mesure +')';
        break;
        case 'RETOUR LOCATION':
          this.textQuantiteMax = '';
          this.selectedProduitPrixUnitaire = 0;
        break;
      case 'SUBVENTION':
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

  estTypeOperation(){
    if(this.selectedTypeOperation){
      return true;
    }
    return false;
  }

  estTypeProduit(){
    if(this.selectedTypeProduit){
      return true;
    }
    return false;
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
    let op = this.operation.value;
    switch (op.type){
      case 'VENTE':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;

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
        break;

      case 'DEPENSE':
        if(this.selectedProduit){
          this.prixUnitaire = this.selectedProduit.prix;
          this.quantite = op.quantite;

          if(parseInt(this.quantite)){
            this.totalPrix = this.prixUnitaire * this.quantite;
            if(this.totalPrix > this.boutique.solde_tresor){
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'Le solde du trésor est insuffisant: '+ this.boutique.solde_tresor+'FCFA',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.quantiteMax = 0;
                  this.totalPrix = 0;
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
            if(parseInt(this.totalPrix) > parseInt(this.boutique.solde_caisse)){
              let alert = this.alertCtl.create({
              title: 'Erreur!',
              message: 'Le solde en caisse est insuffisant: '+ this.boutique.solde_caisse+'FCFA',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.quantiteMax = this.boutique.solde_caisse;
                  this.totalPrix = this.boutique.solde_caisse;
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
        break;

      case 'RETOUR LOCATION':
        if(this.selectedProduit){
            this.prixUnitaire = this.selectedProduit.prix;
            this.quantite = op.quantite;

            if(parseInt(this.quantite)){
              //this.totalPrix = this.prixUnitaire * this.quantite;
              this.totalPrix = 0;
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

   determineID(id, typeOperation){
    //let id_int  = parseInt(id);
    //id_int++;
    //let newID = '';
    return this.boutique_id + ':operation:'+typeOperation+':' + this.code_op;// + ':produit:'+ this.selectedProduit._id.substr(this.selectedProduit._id.length - 3, this.selectedProduit._id.length -1);
                  

    //return newID;
    //this.matricule = this.boutique_id.toString() + ':gerant:' + this.lettreNom + this.lettrePrenom + matricule;
    //return matricule;
  }


  ajouter(){

    let boutique: any = this.boutique;
    //let operations: any = [] ;
    let operations: any = []
    let produits: any = [];
    //this.storage.get('boutique_id').then((id) => {
    //   this.gestionService.getBoutiqueById(id).then((data) => {
    //     boutique = data;
         /*if(data.ventes){
          ventes = data.ventes;
         }*/

    //     if(data.operations){
     //     operations = data.operations;
    //     }

         let op = this.operation.value;
        

         //charger les informations concernant le produit
         op.code_produit = this.selectedProduit.code_produit;
         op.type_produit = this.selectedProduit.type_produit;
         op.nom_produit = this.selectedProduit.nom_produit;
         op.unite = this.selectedProduit.unite_mesure;

         //chercher les information concernant le gérant et les mettre dans le detail de l'operation
         this.gerants.forEach((gerant, index) => {
           if(gerant.status == 'En fonction'){
             op.matricule_gerant = gerant.id;
             op.nom_gerant = gerant.nom;
             //op.prenom_gerant = gerant.prenom;
           }
         });

          let toast: any;
          let alert: any;

          switch(op.type){
            
            case 'VENTE':
              if(parseInt(op.quantite) <= parseInt(this.selectedProduit.quantite) ){
                  //Mise a jour de la quantité du produit vendu
                  produits = this.produits;
                  //produits.forEach((prod, index) => {
                  //  if(prod.id === this.selectedProduit.id){
                      //prod.quantite = prod.quantite 
                      //produits[index].quantite = parseInt(produits[index].quantite) - parseInt(op.quantite);
                      //this.gestionService.updateDoc(produits[index]);
                 //   }
                 // });
                 this.selectedProduit.quantite = parseInt(this.selectedProduit.quantite) - parseInt(op.quantite);
                 this.gestionService.updateDoc(this.selectedProduit);

                  //boutique.produits = produits;
                  //Mise à jour du montant de la caisse
                  if(parseInt(boutique.solde_caisse)){
                    boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(this.totalPrix);
                  }else{
                    boutique.solde_caisse = parseInt(this.totalPrix);
                  }

                  //Mise a jour operation
                  op.solde_caisse = boutique.solde_caisse;
                  op.solde_tresor = boutique.solde_tresor;
                  //this.last_id
                  op._id = this.determineID(this.last_id, 'vente');
                  //operations.push(op);
                  this.gestionService.createDoc(op);
                  //boutique.operations = operations;
            
                  this.gestionService.updateBoutique(boutique);
                  toast = this.toastCtl.create({
                    message: 'Opération sauvegardée...',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  //this.viewCtl.dismiss();
                  this.navCtrl.pop();
              }else{
                alert = this.alertCtl.create({
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
              break;

            case 'DEPENSE':
              if(parseInt(op.montant_total) <= parseInt(this.boutique.solde_tresor)){
                //Mise a jour de la quantité du produit loué
                produits = this.produits;
                //produits.forEach((prod, index) => {
                //  if(prod._id === this.selectedProduit._id){
                    //prod.quantite = prod.quantite 
                    this.selectedProduit.quantite = parseInt(this.selectedProduit.quantite) + parseInt(op.quantite);
                    this.gestionService.updateDoc(this.selectedProduit);
                //  }
               // });

                //boutique.produits = produits;
                //Mise à jour du montant de la caisse
                if(parseInt(boutique.solde_tresor)){
                  boutique.solde_tresor = parseInt(boutique.solde_tresor) - parseInt(this.totalPrix);
                }else{
                  boutique.solde_tresor = - parseInt(this.totalPrix);
                }

                //Mise a jour operation
                op.solde_caisse = boutique.solde_caisse;
                op.solde_tresor = boutique.solde_tresor;
                op._id = this.determineID(this.last_id, 'depense');
                this.gestionService.createDoc(op);
                //operations.push(op);
                //boutique.operations = operations;

                this.gestionService.updateBoutique(boutique);
                toast = this.toastCtl.create({
                  message: 'Opération sauvegardée...',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                //this.viewCtl.dismiss();
                this.navCtrl.pop();
              }else{
                
               alert = this.alertCtl.create({
                title: 'Erreur!',
                message: 'Le solde du trésor est insuffisant: '+ this.boutique.solde_tresor+'FCFA',
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    this.quantiteMax = 0;
                    this.totalPrix = 0;
                  }
                }]
              });

              alert.present();
              }
              break;

            case 'DECAISSEMENT':
              if(parseInt(op.montant_total) <= parseInt(this.boutique.solde_caisse)){
                //Mise a jour de solde de la caisse
                if(parseInt(boutique.solde_caisse)){
                    boutique.solde_caisse = parseInt(boutique.solde_caisse) - parseInt(this.totalPrix);
                  }else{
                    boutique.solde_caisse = - parseInt(this.totalPrix);
                  }
                  
                  //Mise a jour du solde du trésor
                  if(parseInt(boutique.solde_tresor)){
                    boutique.solde_tresor = parseInt(boutique.solde_tresor) + parseInt(this.totalPrix);
                  }else{
                    boutique.solde_tresor = parseInt(this.totalPrix);
                  }
                  
                //Mise a jour operation
                op.solde_caisse = boutique.solde_caisse;
                op.solde_tresor = boutique.solde_tresor;
                op._id = this.determineID(this.last_id, 'decaissement');
                this.gestionService.createDoc(op);
                //operations.push(op);
                //boutique.operations = operations;

                this.gestionService.updateBoutique(boutique);
                toast = this.toastCtl.create({
                  message: 'Opération sauvegardée...',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                //this.viewCtl.dismiss();
                this.navCtrl.pop();
              }else{

                alert = this.alertCtl.create({
                title: 'Erreur!',
                message: 'Le solde en caisse est insuffisant: '+ this.boutique.solde_caisse+'FCFA',
                buttons: [{
                  text: 'Ok',
                  handler: () => {
                    this.quantiteMax = this.boutique.solde_caisse;
                    this.totalPrix = this.boutique.solde_caisse;
                    }
                }]
              });

              alert.present();

              }
              break;

            case 'LOCATION':
              if(parseInt(op.quantite) <= parseInt(this.selectedProduit.quantite) ){
                //Mise a jour de la quantité du produit loué
                produits = this.produits;
                //produits.forEach((prod, index) => {
                //  if(prod.id === this.selectedProduit.id){
                    //prod.quantite = prod.quantite 
                    this.selectedProduit.quantite = parseInt(this.selectedProduit.quantite) - parseInt(op.quantite);
                    this.gestionService.updateDoc(this.selectedProduit);
               //   }
               // });

                //boutique.produits = produits;
                //Mise à jour du montant de la caisse
                if(parseInt(boutique.solde_caisse)){
                  boutique.solde_caisse = parseInt(boutique.solde_caisse) + parseInt(this.totalPrix);
                }else{
                  boutique.solde_caisse = parseInt(this.totalPrix);
                }

                //Mise a jour operation
                op.solde_caisse = boutique.solde_caisse;
                op.solde_tresor = boutique.solde_tresor;
                op._id = this.determineID(this.last_id, 'location');
                this.gestionService.createDoc(op);
                //operations.push(op);
                //boutique.operations = operations;

                this.gestionService.updateBoutique(boutique);
                toast = this.toastCtl.create({
                  message: 'Opération sauvegardée...',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                //this.viewCtl.dismiss();
                this.navCtrl.pop();
              }else{
                alert = this.alertCtl.create({
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
              break;

            case 'RETOUR LOCATION':
              //Mise a jour de la quantité du produit loué
              produits = this.produits;
              //produits.forEach((prod, index) => {
                //if(prod.id === this.selectedProduit.id){
                  //prod.quantite = prod.quantite 
                  this.selectedProduit.quantite = parseInt(this.selectedProduit.quantite) + parseInt(op.quantite);
                  this.gestionService.updateDoc(this.selectedProduit);
              //  }
              //});

              //boutique.produits = produits;
              //Mise a jour operation
              op.solde_caisse = boutique.solde_caisse;
              op.solde_tresor = boutique.solde_tresor;
              op._id = this.determineID(this.last_id, 'retour_location');
              this.gestionService.createDoc(op);
              //operations.push(op);
              //boutique.operations = operations;

              this.gestionService.updateBoutique(boutique);
              toast = this.toastCtl.create({
                message: 'Opération sauvegardée...',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              //this.viewCtl.dismiss();
              this.navCtrl.pop();
              break;

            case 'SUBVENTION':
              //Mise a jour de la quantité du produit loué
              produits = this.produits;
              //produits.forEach((prod, index) => {
               // if(prod.id === this.selectedProduit.id){
                  //prod.quantite = prod.quantite 
                  this.selectedProduit.quantite = parseInt(this.selectedProduit.quantite) + parseInt(op.quantite);
                  this.gestionService.updateDoc(this.selectedProduit);
              //  }
              //});

              //boutique.produits = produits;
              //Mise a jour operation
              op.solde_caisse = boutique.solde_caisse;
              op.solde_tresor = boutique.solde_tresor;
              op._id = this.determineID(this.last_id, 'subvention');
              this.gestionService.createDoc(op);
              //operations.push(op);
              //boutique.operations = operations;

              this.gestionService.updateBoutique(boutique);
              toast = this.toastCtl.create({
                message: 'Opération sauvegardée...',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              //this.viewCtl.dismiss();
              this.navCtrl.pop();
              
              break;
            
            /*case 'AUTRE':
              
              break;*/
          }

    //   });
    //});
  }

  annuler(){
    //this.viewCtl.dismiss();
    this.navCtrl.pop();
  }
}
