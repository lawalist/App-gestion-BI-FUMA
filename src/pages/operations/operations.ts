import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { AjouterOperationPage } from './ajouter-operation/ajouter-operation';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { DetailOperationPage } from './detail-operation/detail-operation';
import { Storage } from '@ionic/storage';
import { AccueilPage } from '../accueil/accueil'

/*
  Generated class for the Ventes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-operations',
  templateUrl: 'operations.html'
})
export class OperationsPage {

  operations: any = [] ;
  last_id = 0;
  produits: any = [];
  boutique_id: any;
  allOperation: any = [];
  selectedTypeOperation: any = 'VENTE';

  constructor(public navCtrl: NavController,public viewCtl: ViewController,public loadCtl: LoadingController, public alertCtl:AlertController, public modalCtl: ModalController, public navParams: NavParams,public storage: Storage, public gestionService: GestionBoutique) {
    //this.gestionService.getListeVentes().then((data) => this.listVentes = data);
    //this.viewCtl
  }

  
  filterTypeOperation(){
    let operations: any = [];
    if(this.selectedTypeOperation == 'TOUS'){
      operations = this.allOperation;
    }else{
      this.allOperation.forEach((op, index) => {
        if(op.type === this.selectedTypeOperation){
          operations.push(op);
        }
      });
    }

    this.operations = operations;
    //this.operations.reverse();
    this.operations.sort((a, b) => {
      return b.id - a.id;
    });
  }

  ionViewDidEnter(){
    /*let loading  = this.loadCtl.create({
      content: 'Chatgement en cours...'
    });
    loading.present();*/
    this.storage.get('boutique_id').then((id) => {
      if(id){
        this.gestionService.getBoutiqueById(id).then((data) => {
         
         if(data.operations.length > 0){
            this.last_id = parseInt(data.operations[data.operations.length - 1].id);
            
            let operations: any = [];
            this.allOperation = data.operations;
            
            if(this.selectedTypeOperation == 'TOUS'){
              operations = this.allOperation;
            }else{
               data.operations.forEach((op, index) => {
                if(op.type === this.selectedTypeOperation){
                  operations.push(op);
                }
              });
            }
           
            this.operations = operations;

         }

         //this.operations.reverse();
         this.operations.sort((a, b) => {
           return b.id - a.id;
         });

         this.boutique_id = id;

         this.produits = data.produits;

         this.last_id++;
         //loading.dismissAll();
       }, error => {
         //loading.dismissAll();
         let alert = this.alertCtl.create({
            title: 'Erreur',
            message: 'La boutique d\'ID: <strong>'+id+'</strong> n\'existe pas.<br> Veuillez conracter l\'administrateur',
            buttons: [
              {
                text: 'ok',
                handler: () => {
                  this.storage.remove('boutique_id');
                  this.navCtrl.setRoot(AccueilPage);
                  //this.ionViewDidEnter();
                }
              }
            ]
          });

          alert.present()
       } );
      }else{

      }
       
    });
  }


  
  ajouter(last_id, produits, boutique_id){
    //let modal = this.modalCtl.create(AjouterVentePage, {'last_id': last_id, 'produits': produits});
    //modal.present();
    if(produits.length > 0){
      this.navCtrl.push(AjouterOperationPage, {'last_id': last_id, 'produits': produits, 'boutique_id': boutique_id} );
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

  detail(operation, boutique_id){
    this.navCtrl.push(DetailOperationPage, {'operation': operation, 'boutique_id': boutique_id});
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.operations = this.allOperation;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.operations = this.operations.filter((item) => {
        return (item.nom_produit.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }
}
