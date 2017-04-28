import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AjouterTypeProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ajouter-type-produit',
  templateUrl: 'ajouter-type-produit.html'
})
export class AjouterTypeProduitPage {

   typeProduit: any;
 
  constructor(public alertCtl: AlertController, public toastCtl: ToastController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public gestionService: GestionBoutique) {

    this.typeProduit = this.formBuilder.group({
      nom: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AjouterTypeProduitPage');
  }

  ajouter(){
    let boutique: any = {} ;
    let typeProduits: any = [] ;
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         let tp = this.typeProduit.value;
         if(data.type_produits){
          typeProduits = data.type_produits;
         }
         
         let verif = 0;
         typeProduits.forEach((tprod, index) => {
            if(tprod.nom.toLowerCase() === tp.nom.toLowerCase()){
              verif = 1;
            }
         });
         //for(let boutique of boutiques){
           if(verif == 0){
              typeProduits.push(tp);
              boutique.type_produits = typeProduits;

              this.gestionService.updateBoutique(boutique);
              let toast = this.toastCtl.create({
                message: 'Type produit sauvegardée...',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              this.navCtrl.pop();
           }else{
             let alt = this.alertCtl.create({
               title: 'Erreur',
               message: 'Ce type de produit existe déjà!',
               buttons:['OK']
             });
             alt.present();
           }
         
        //}
       });
    });
    
  }

  annuler(){
    this.navCtrl.pop();
  }

}
