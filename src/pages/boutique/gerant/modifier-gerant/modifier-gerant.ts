import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../../providers/gestion-boutique'
import { Storage } from '@ionic/storage';

/*
  Generated class for the Modifiergerant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-gerant',
  templateUrl: 'modifier-gerant.html'
})
export class ModifierGerantPage {

  gerant: any;
  anciengerant: any;
  gerants: any = [] ;
  selectedStatus: any = '';
  status: any = [];
  index: any;

 constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtl: AlertController, public formBuilder: FormBuilder, public storage: Storage, public toastCtl: ToastController, public gestionService: GestionBoutique) {
    this.anciengerant = this.navParams.get('gerant');
    this.selectedStatus = this.anciengerant.status;
  
    this.status = ['En fonction', 'Abandon'];

    this.gerant = this.formBuilder.group({
      id: [this.anciengerant.id],
      nom: [this.anciengerant.nom, Validators.required],
      //prenom: [this.anciengerant.prenom, Validators.required],
      status: [this.anciengerant.status, Validators.required],
      date_debut_fonction: [this.anciengerant.date_debut_fonction],
      date_fin_fonction: [this.anciengerant.date_fin_fonction],
      raison: [this.anciengerant.raison]
    });

  }

  ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
       });
    });
  }

  ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
       });
    });
  }
  
  onChange(){
    this.verifierStatusEnFonction();
  }

  verifierStatusEnFonction(){
    //on verifie s'il n'existe qu'un seul gerant qui q le status <<En fonction>>
    this.gerants.forEach((prop, index) => {
      if( (prop.id != this.anciengerant.id) && (prop.status == 'En fonction')  && (prop.status === this.selectedStatus)){
        this.index = index;
        let alert = this.alertCtl.create({
          title: 'Avertissement!',
          message: 'Il existe déjà un gérant de la boutique qui a le status <strong>En fonction</strong>.<br> Ce dernier prendra automatiquement le status Abandon!',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                //this.selectedStatus = this.anciengerant.status;
              }
            }
          ]
        });
    alert.present();
    
      }
    });
    
  }

  modifier(gerant){

    let boutique: any = {} ;
    let gerants: any = [] ;
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         boutique = data;
         gerants = data.gerants;
         let nouveaugerant = this.gerant.value;
         gerants.forEach((prop, index) => {
           if(prop.id === nouveaugerant.id){
            gerants[index] = nouveaugerant;
           }
         });

         if(this.index){
            gerants[this.index].status = 'Abandon';
          }
         
          boutique.gerants = gerants;
          this.gestionService.updateBoutique(boutique);
        //}
       });
    });
   
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
