import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { AjouterOperationPage } from './ajouter-operation/ajouter-operation';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { AutoCompletion } from '../../providers/auto-completion';
import { DetailOperationPage } from './detail-operation/detail-operation';
import { Storage } from '@ionic/storage';
import { AccueilPage } from '../accueil/accueil'
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../global-variables/variable';

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
  tacheAdmin: any = '';
  last_id : string = '1';
  produits: any = [];
  boutiques: any = [];
  selectedboutique: any = '';
  boutique_id: any;
  allOperation: any = [];
  selectedTypeOperation: any = 'VENTE';

  constructor(public translate: TranslateService, public navCtrl: NavController,public viewCtl: ViewController,public loadCtl: LoadingController, public alertCtl:AlertController, public modalCtl: ModalController, public navParams: NavParams,public storage: Storage, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    
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
    /*this.operations.sort((a, b) => {
      return b.id - a.id;
    });*/
  }

  choixBoutique(){
    this.storage.set('boutique_id', this.selectedboutique.id);
    let id = this.selectedboutique.id;

      this.gestionService.getPlageDocs(id+ ':operation', id +':operation:\ufff0').then((res) => {
           let operations: any = [];
            this.allOperation = res;
            
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
        /*this.operations.sort((a, b) => {
           return b.id - a.id;
         });*/

         this.boutique_id = id;
         this.gestionService.getPlageDocs(id+ ':operation', id +':operation:\ufff0', 'ajout').then((tous) => {
            if(tous.length > 0){
            let tempID = tous.length;
            tempID++;
            this.last_id = tempID;
            //this.last_id = res[ res.length -1]._id;
            //this.last_id = this.last_id.substr(0, this.last_id.length -12)
            //this.last_id = this.last_id.substr(this.last_id.lastIndexOf(':') + 1)
            //this.last_id = this.last_id.substr(0, this.last_id.length -11)
            //let tempID = parseInt(this.last_id);
            //tempID++;
            //this.last_id = tempID.toString();

            //let tem = this.last_id.lastIndexOf(':');
            //this.last_id = tem.toString();

          }
         });
         

         //this.operations.reverse();

         //this.produits = data.produits;

        // this.last_id++;
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

       this.gestionService.getPlageDocs(id+ ':produit', id +':produit:\ufff0').then((res) => {
          this.produits = res
       }, err => console.log(err));
      
    //this.ionViewWillEnter();
  }

  ionViewWillEnter(){
 
    this.storage.get('tache').then((res) => {
      if(res){
        this.tacheAdmin = 'admin';
        global.tacheAdmin = this.tacheAdmin;
        this.storage.get('boutique_id').then((id) => {
          if(id){
            this.gestionService.getBoutiqueById(id).then((boutiq) => {
               this.selectedboutique = boutiq;
               this.gestionService.getPlageDocs('boutique','boutique:\ufff0').then((boutiqs) => {
                this.boutiques = boutiqs;
              });
            })
           
          }else{
            this.gestionService.getPlageDocs('boutique','boutique:\ufff0').then((boutiqs) => {
            this.boutiques = boutiqs;
          });
          }
        })
        
      }
    });  

    this.translate.use(global.langue);
    /*let loading  = this.loadCtl.create({
      content: 'Chatgement en cours...'
    });
    loading.present();*/
    this.storage.get('boutique_id').then((id) => {
      if(id){
        this.gestionService.getPlageDocs(id+ ':operation', id +':operation:\ufff0').then((res) => {
           let operations: any = [];
            this.allOperation = res;
            
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
        /*this.operations.sort((a, b) => {
           return b.id - a.id;
         });*/

         this.boutique_id = id;
         this.gestionService.getPlageDocs(id+ ':operation', id +':operation:\ufff0', 'ajout').then((tous) => {
            if(tous.length > 0){
            let tempID = tous.length;
            tempID++;
            this.last_id = tempID;
            //this.last_id = res[ res.length -1]._id;
            //this.last_id = this.last_id.substr(0, this.last_id.length -12)
            //this.last_id = this.last_id.substr(this.last_id.lastIndexOf(':') + 1)
            //this.last_id = this.last_id.substr(0, this.last_id.length -11)
            //let tempID = parseInt(this.last_id);
            //tempID++;
            //this.last_id = tempID.toString();

            //let tem = this.last_id.lastIndexOf(':');
            //this.last_id = tem.toString();

          }
         });
         

         //this.operations.reverse();

         //this.produits = data.produits;

        // this.last_id++;
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

       this.gestionService.getPlageDocs(id+ ':produit', id +':produit:\ufff0').then((res) => {
          this.produits = res
       }, err => console.log(err));
      }else{

      }
       
    });
  }

test(){
  //this.gestionService.login('sani', 'sani');
  this.navCtrl.push(LoginPage)
  
}

  sync(){
    if(this.tacheAdmin === 'admin'){
      this.gestionService.dbSyncAdminAvecLoading(this.ionViewWillEnter());
    }else{
      this.gestionService.dbSyncAvecLoading(this.boutique_id, this.ionViewWillEnter());
    }
    
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

  /*ionAutoInput(ev: any){
    alert('ionAutoInput($event)' + ev);
  }*/
}
 