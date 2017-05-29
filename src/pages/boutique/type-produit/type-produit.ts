import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AjouterTypeProduitPage } from './ajouter-type-produit/ajouter-type-produit';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';
import { ModifierTypeProduitPage } from './modifier-type-produit/modifier-type-produit';
import { DetailTypeProduitPage } from './detail-type-produit/detail-type-produit';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../global-variables/variable';
 
/*
  Generated class for the TypeProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-type-produit',
  templateUrl: 'type-produit.html'
})
export class TypeProduitPage {

  typeProduits: any = [];
  boutique_id: any;

  constructor(public translate: TranslateService, public toastCtl: ToastController, public gestionService: GestionBoutique, public alertCtl: AlertController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.setDefaultLang(global.langue);
  }

  
  /*ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.typeProduits = data.type_produits;
         this.boutique_id = id;
       });
    });
  }*/
  
  ionViewWillEnter(){
    this.translate.setDefaultLang(global.langue);
  }

  /*ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.typeProduits = data.type_produits;
         this.boutique_id = id;
       });
    });
  }*/

   ionViewDidEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.typeProduits = data.type_produits;
         this.boutique_id = id;
       });
    });
  }

  ajouter(boutique_id){
    if(boutique_id){
      this.navCtrl.push(AjouterTypeProduitPage);
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'La boutique n\'est pas défini',
        buttons:[
          {
            text: 'Ok',
            role: 'Cancel',
            handler: () => console.log('Pas de boutique')
          }
        ]
      });
      alert.present();
    }
  }

  editer(typeProduit){
    this.navCtrl.push(ModifierTypeProduitPage, {'typeProduit': typeProduit});
  }

  detail(typeProduit){
    this.navCtrl.push(DetailTypeProduitPage, {'typeProduit': typeProduit, 'boutique_id': this.boutique_id})
  }

  supprimer(typeProduit){
    let alert = this.alertCtl.create({
      title: 'Suppression type produit',
      message: 'Etes vous sûr de vouloir supprimer cet type de produit ?',
      buttons:[
        {
          text: 'Annuler',
          rol: 'Cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.gestionService.getBoutiqueById(this.boutique_id).then((result) => {
              let boutique = result;
              let typeProduits = result.type_produits;
              typeProduits.forEach((prod, index) =>{
                if(prod.nom === typeProduit.nom){
                  typeProduits.splice(index, 1);
                }
              });

              boutique.type_produits = typeProduits;
              this.gestionService.updateBoutique(boutique);

              this.storage.get('boutique_id').then((id) => {
                  this.gestionService.getBoutiqueById(id).then((data) => {
                    this.typeProduits = data.type_produits;
                    this.boutique_id = id;
                  });
              });
            });
            //this.navCtrl.viewDidEnter;
          }
        }
      ]
    });

    alert.present();
  }


}
