import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AjouterGerantPage } from './ajouter-gerant/ajouter-gerant';
import { DetailGerantPage } from './detail-gerant/detail-gerant';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';

/*
  Generated class for the gerant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gerant',
  templateUrl: 'gerant.html'
})
export class GerantPage {

  gerants: any = [];
  last_id: string = '0';
  boutique_id: any;
  l: string;
  allGeranrs: any = [];

  constructor(public gestionService: GestionBoutique, public alertCtl: AlertController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {}


  /*ionViewDidEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
         this.boutique_id = id;
         if(data.gerants.length > 0){
            this.last_id = data.gerants[data.gerants.length - 1].id;
            this.last_id = this.last_id.substr(this.last_id.length - 3, this.last_id.length -1);
         }

       });
    });
  }*/

   ionViewWillEnter(){
    this.storage.get('boutique_id').then((bID) => {
       this.gestionService.getPlageDocs(bID + ':gerant', bID + ':gerant:\ufff0').then((data) => {
         this.gerants = data;
         this.allGeranrs = data;
         this.boutique_id = bID;
         this.gestionService.getPlageDocs(bID + ':gerant', bID + ':gerant:\ufff0', 'ajout').then((tous) => {
          if(tous.length > 0){ 
            //this.last_id = data[0]._id;
            //this.last_id = this.last_id.substr(this.last_id.length - 3, this.last_id.length -1);
            this.last_id = tous.length;
          }
         });
         
       });
    });
  }

  /*ionViewDidLoad() {
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         this.gerants = data.gerants;
         this.boutique_id = id;
         if(data.gerants.length > 0){
            this.last_id = data.gerants[data.gerants.length - 1].id;
            this.last_id = this.last_id.substr(this.last_id.length - 3, this.last_id.length -1);
         }

       });
    });
}*/

  ajouter(last_id, boutique_id){
    if(boutique_id){
      this.navCtrl.push(AjouterGerantPage, {'last_id': last_id, 'boutique_id': boutique_id} );
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'La boutique n\'est pas défini',
        buttons:[
          {
            text: 'Ok',
            role: 'Cancel',
            hendler: () => console.log('Pas de boutique')
          }
        ]
      });
      alert.present();
    }
  }

  detail(gerant, boutique_id){
    this.navCtrl.push(DetailGerantPage, {'gerant': gerant, 'boutique_id': boutique_id});
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.gerants = this.allGeranrs;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.gerants = this.gerants.filter((item) => {
        return (item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
