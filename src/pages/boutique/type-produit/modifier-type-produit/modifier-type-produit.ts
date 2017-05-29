import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique'
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../../global-variables/variable';

/*
  Generated class for the ModifierTypeProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-type-produit',
  templateUrl: 'modifier-type-produit.html'
})
export class ModifierTypeProduitPage {

  typeProduit: any;
  ancienTypeProduit: any;

  constructor(public translate: TranslateService, public alertCtl: AlertController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public storage: Storage, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    
    this.translate.setDefaultLang(global.langue);
    this.ancienTypeProduit = this.navParams.get('typeProduit');

    this.typeProduit = this.formBuilder.group({
      nom: [this.ancienTypeProduit.nom, Validators.required],
      created_at: [this.ancienTypeProduit.created_at],
      created_by: [this.ancienTypeProduit.created_by],
    });
  }

  ionViewWillEnter() {
    this.translate.setDefaultLang(global.langue);
    //console.log('ionViewDidLoad ModifierTypeProduitPage');
  }
  
 
  modifier(typeProduit){

    let boutique: any = {} ;
    let typeProduits: any = [] ;
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         typeProduits = data.type_produits;
         let nouveauTypeProduit = this.typeProduit.value;
          //verifier si le nom est unique
         let verif = 0;
         typeProduits.forEach((tprod, index) => {
            if((tprod.nom.toLowerCase() != this.ancienTypeProduit.nom.toLowerCase()) && (tprod.nom.toLowerCase() === nouveauTypeProduit.nom.toLowerCase())){
              verif = 1;
            }
         });

         if(verif == 0){
           boutique = data;
           typeProduits.forEach((prod, index) => {
              if(prod.nom === this.ancienTypeProduit.nom){
                typeProduits[index] = nouveauTypeProduit;
              }
            });
         
          boutique.type_produits = typeProduits;
          this.gestionService.updateBoutique(boutique);

          let toast = this.toastCtl.create({
            message: 'Modification sauvegardée...',
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
