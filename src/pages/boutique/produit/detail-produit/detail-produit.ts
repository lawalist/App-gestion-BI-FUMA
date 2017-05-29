import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { GestionBoutique } from '../../../../providers/gestion-boutique';

import { ModifierProduitPage } from '../modifier-produit/modifier-produit';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../../global-variables/variable';


/*
  Generated class for the DetailProduit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail-produit',
  templateUrl: 'detail-produit.html'
})
export class DetailProduitPage {

  boutique_id: any;
  produit: any;
  typeProduits: any = [];
  tacheAdmin = global.tacheAdmin;

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    this.boutique_id = this.navParams.data.boutique_id;
    this.produit = this.navParams.data.produit;
  }

  ionViewDidEnter(){
    this.translate.use(global.langue);
    /*this.gestionService.getBoutiqueById(this.boutique_id).then((res) => {
      let v = res.produits;
      this.typeProduits = res.type_produit;
      v.forEach((prod, index) => {
        if(prod.id === this.produit.id){
          this.produit = prod;
        }
      });
    });*/
  }

  ionViewWillEnter(){
    this.gestionService.getDocById(this.produit._id).then((res) => {
      this.produit = res;
      /*let v = res.produits;
      this.typeProduits = res.type_produit;
      v.forEach((prod, index) => {
        if(prod.id === this.produit.id){
          this.produit = prod;
        }
      });*/
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetailProduitPage');
  }


  editer(produit, boutique_id){
    this.navCtrl.push(ModifierProduitPage, {'produit': produit, 'boutique_id': boutique_id});
  }

  supprimer(produit){
    let alert = this.alertCtl.create({
      title: 'Suppression produit',
      message: 'Etes vous sûr de vouloir supprimer cet produit ?',
      buttons:[
        {
          text: 'Annuler',
          rol: 'Cancel',
        },
        {
          text: 'Confirmer',
          handler: () => {
            /*this.gestionService.getBoutiqueById(this.boutique_id).then((result) => {
              let boutique = result;
              let produits = result.produits;
              produits.forEach((prod, index) =>{
                if(prod.id === produit.id){
                  produits.splice(index, 1);
                }
              });

              boutique.produits = produits;
              this.gestionService.updateBoutique(boutique);
            })*/
            this.gestionService.deleteDoc(produit);
            let toast = this.toastCtl.create({
              message:'Produit supprimé avec succès!',
              position: 'top',
              duration: 3000
            });
            toast.present();
            this.navCtrl.pop();
          }
        }
      ]
    });

    alert.present();
  }

}
