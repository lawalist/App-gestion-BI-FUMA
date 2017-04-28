import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { AjouterVentePage } from './ajouter-vente/ajouter-vente';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { DetailVentePage } from './detail-vente/detail-vente';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Ventes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ventes',
  templateUrl: 'ventes.html'
})
export class VentesPage {

  listVentes: any = [] ;
  last_id = 0;
  produits: any = [];
  boutique_id: any;

  constructor(public navCtrl: NavController,public viewCtl: ViewController,public alertCtl:AlertController, public modalCtl: ModalController, public navParams: NavParams,public storage: Storage, public gestionService: GestionBoutique) {
    //this.gestionService.getListeVentes().then((data) => this.listVentes = data);
    //this.viewCtl
  }

  ionViewWillEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {

        /*if(data.ventes.length > 0){
            this.last_id = parseInt(data.ventes[data.ventes.length - 1].id);
         }*/
         ///this.listVentes = data.ventes;
         this.listVentes = [];

         if(data.operations.length > 0){
            this.last_id = parseInt(data.operations[data.operations.length - 1].id);
            data.operations.forEach((operation, index) => {
              if(operation.type_operation === 'vente'){
                this.listVentes.push(operation);
              }
            });
         }

         this.listVentes.reverse();
         this.boutique_id = id;

         this.produits = data.produits;

         this.last_id++;
       });
    });
  }

  ionViewDidEnter(){
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         
         /*if(data.ventes.length > 0){
            this.last_id = parseInt(data.ventes[data.ventes.length - 1].id);
         }*/
         ///this.listVentes = data.ventes;
         this.listVentes = [];

         if(data.operations.length > 0){
            this.last_id = parseInt(data.operations[data.operations.length - 1].id);
            data.operations.forEach((operation, index) => {
              if(operation.type_operation === 'vente'){
                this.listVentes.push(operation);
              }
            });
         }

         this.listVentes.reverse();
         this.boutique_id = id;

         this.produits = data.produits;

         this.last_id++;
       });
    });
  }

  ionViewDidLoad() {
    
    this.storage.get('boutique_id').then((id) => {
       this.gestionService.getBoutiqueById(id).then((data) => {
         
         /*if(data.ventes.length > 0){
            this.last_id = parseInt(data.ventes[data.ventes.length - 1].id);
         }*/
         ///this.listVentes = data.ventes;
         this.listVentes = [];

         if(data.operations.length > 0){
            this.last_id = parseInt(data.operations[data.operations.length - 1].id);
            data.operations.forEach((operation, index) => {
              if(operation.type_operation === 'vente'){
                this.listVentes.push(operation);
              }
            });
         }

         this.listVentes.reverse();
         this.boutique_id = id;

         this.produits = data.produits;

         this.last_id++;
       });
    });
  }

  /*doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }*/

  ajouter(last_id, produits, boutique_id){
    //let modal = this.modalCtl.create(AjouterVentePage, {'last_id': last_id, 'produits': produits});
    //modal.present();
    if(produits.length > 0){
      this.navCtrl.push(AjouterVentePage, {'last_id': last_id, 'produits': produits, 'boutique_id': boutique_id} );
    }else{
      let alert = this.alertCtl.create({
        title: 'Erreur',
        message: 'La liste des produits n\'est pas défini',
        buttons:[
          {
            text: 'Ok',
            role: 'Cancel',
            hendler: () => console.log('Pas de produits')
          }
        ]
      });
      alert.present();
    }

    
  }

  detail(vente, boutique_id){
    this.navCtrl.push(DetailVentePage, {'vente': vente, 'boutique_id': boutique_id});
  }
}
