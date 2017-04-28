import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { GestionBoutique } from '../../../providers/gestion-boutique';

/*
  Generated class for the AjouterAchat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-achat',
  templateUrl: 'ajouter-achat.html'
})
export class AjouterAchatPage {
 
  achat: any;

  produits: any;
  totalPrix: any = 0;
  quantite: any = 0;
  prixUnitaire: any = 1;
  selectedProduit: any;
  quantiteMax: any = '';

  constructor(public storage: Storage, public gestionService: GestionBoutique, public navCtrl: NavController, public navParams: NavParams, public toastCtl: ToastController, public formBuilder: FormBuilder) {
    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    let last_id = this.navParams.data.last_id;
    this.produits = this.navParams.data.produits;

    this.achat = this.formBuilder.group({
      id: [last_id, Validators.required],
      nom_vendeur: ['', Validators.required],
      prenom_vendeur: ['', Validators.required],
      //type_produit: ['', Validators.required],
      produit: ['', Validators.required],
      quantite: ['', Validators.required],
      prix: ['', Validators.required],
      date_vente: [s, Validators.required],
    });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AjouterAchatPage');
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
    let achats: any = [] ;
    let produits: any = [];

    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         if(data.achats){
          achats = data.achats;
         }
        
         //for(let boutique of boutiques){
           let a = this.achat.value;
          achats.push(this.achat.value);

          produits = data.produits;
          produits.forEach((prod, index) => {
            if(prod.id === a.produit.id){
              //prod.quantite = prod.quantite 
              produits[index].quantite = parseInt(produits[index].quantite) + parseInt(a.quantite);
            }
          });
          

          boutique.achats = achats;
          boutique.produits = produits;

          this.gestionService.updateBoutique(boutique);
        //}
       });
    });


/*
    let achat = this.achat.value;
    //achat.nom_boutique = 'boutique';
    //achat.addresse = 'xxxx';
    //achat.ville = 'Maradi';
    achat.type = 'achat';
    this.storage.get('boutique_id').then((id) => {
      achat.boutique_id = id;
      this.gestionService.createAchat(achat);  
    }).catch((err) => {
      console.log(err);
    });*/
    
    let toast = this.toastCtl.create({
      message: 'Achat sauvegardée...',
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
