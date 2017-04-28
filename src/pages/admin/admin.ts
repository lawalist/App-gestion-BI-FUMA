import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { BoutiquePage } from '../boutique/boutique';
import { AjouterBoutiquePage } from '../boutique/ajouter-boutique/ajouter-boutique';
import { ProduitPage } from '../boutique/produit/produit';
import { Storage } from '@ionic/storage';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { GerantPage } from '../boutique/gerant/gerant';
import { TypeProduitPage } from '../boutique/type-produit/type-produit';
import { global } from '../../global-variables/variable';
import { AccueilPage } from '../accueil/accueil';


/* 
  Generated class for the Admin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {

  constructor(public navCtrl: NavController, public toastCtl: ToastController, public navParams: NavParams, public alertCtl: AlertController, public storage: Storage, public gestionService: GestionBoutique) {}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AdminPage');
  }

  detailBoutique(){
    this.navCtrl.push(BoutiquePage);
  }

  ajouterBoutique(){
    this.navCtrl.push(AjouterBoutiquePage);
  }

  changerBoutique(){
    let alert = this.alertCtl.create({
      title: 'Changer boutique',
      cssClass: 'error',
      inputs: [
        {
          type: 'text',
          placeholder: 'ID boutique',
          name: 'boutique_id'
        }
      ],
      buttons: [
        {
          cssClass: 'error-border',
          text: 'Annuler',
          role: 'Cancel',
          handler: () => console.log('Changement boutique_id annuler')
        },
        {
          text: 'Valider',
          handler: data => {
            this.gestionService.checkExists(data.boutique_id).then((result) => {
              if(result){
              this.gestionService.getBoutiqueById(data.boutique_id).then((boutique) => {
                this.storage.set('boutique_id', boutique._id);

                let toast = this.toastCtl.create({
                  message: 'Boutique changée avec succes...',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                global.changerInfoBoutique = false;
                //this.navCtrl.pop();
                this.navCtrl.push(BoutiquePage)
              });
            }else{
              let alert = this.alertCtl.create({
                title: 'Erreur',
                message: 'Echec de la connexion ou la boutique indiquée n\'existe pas!',
                buttons: ['Ok']
              });

              alert.present();
            }
            });
            
            
          }
        }
      ]
    });

    alert.present();
  }

  gestionGerants(){
    this.navCtrl.push(GerantPage);
  }

  gestionTypeProduits(){
    this.navCtrl.push(TypeProduitPage);
  }

  gestionProduits(){
    this.navCtrl.push(ProduitPage);
  }  

  reset(){
    let alert = this.alertCtl.create({
      title: 'Avertissement!',
      message: 'Etes vous sûr de réinitialiser la boutique ?<br> Toute votre configuration local et vos données sérons perdus.',
      buttons: [
        {
          text: 'Annuler',
          handler: () => console.log('Reset annulé')
        },
        {
          text: 'Confirmer',
          handler: () => {
            this.gestionService.reset();
            this.storage.remove('boutique_id');
            this.navCtrl.setRoot(AccueilPage);
          }
        }
      ]
    });

    alert.present()
  }
}
