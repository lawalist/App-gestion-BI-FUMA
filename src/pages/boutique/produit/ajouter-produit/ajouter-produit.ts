import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../../global-variables/variable';

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
  selectedTypeProduit: any;
  boutique_id: any;
  //code_produit: any = '';
  last_id: any
  code_prod: any = '';

  constructor(public translate: TranslateService, public toastCtl: ToastController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    this.last_id = this.navParams.data.last_id;
    this.boutique_id = this.navParams.data.boutique_id;
    this.calculID();
    //this.code_produit = this.code_prod;

    this.gestionService.getBoutiqueById(this.boutique_id).then((boutique) => {
      this.typeProduits = boutique.type_produits;
      });

    
    this.unites = ['kg' , 'g', 'sachet de 100 grammes', 'sachet de 25 grammes', 'bloc de 100 grammes', 'tia', 'litre', 
    'comprimé', 'autre'];

    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());

    this.produit = this.formBuilder.group({
      _id: [this.boutique_id + ':produit:' + this.code_prod, Validators.required],
      type_produit: ['', Validators.required],
      code_produit: [this.code_prod, Validators.required],
      type: ['produit'],
      date: [s, Validators.required],
      nom_produit: ['', Validators.required],
      quantite: [0, Validators.required],
      prix: [0, Validators.required],
      unite_mesure: ['', Validators.required],
      prix_total: [0, Validators.required]
    }); 
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

  calculID(){
    let code_p = '';
    if(this.selectedTypeProduit){
      code_p = this.selectedTypeProduit.substr(0,2).toUpperCase();
    }

    let id_int  = parseInt(this.last_id);
    id_int++;
    let newID = code_p + id_int.toString();
    /*if(id_int < 10){
      newID = '00'+id_int.toString();
    }else if(id_int < 100){
      newID = '0'+id_int.toString();
    }else{
      newID = id_int.toString();
    }*/
    this.code_prod = newID;

    //return newID;
    //this.matricule = this.boutique_id.toString() + ':gerant:' + this.lettreNom + this.lettrePrenom + matricule;
    //return matricule;
  }

  ionViewWillEnter() {
    this.translate.use(global.langue);
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
    let produit = this.produit.value;
    produit._id = this.boutique_id + ':produit:' + this.code_prod;
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

    this.gestionService.createDoc(produit);
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
