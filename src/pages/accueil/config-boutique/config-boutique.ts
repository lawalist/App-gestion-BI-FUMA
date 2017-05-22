import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { Storage } from '@ionic/storage';

import { AjouterBoutiquePage } from '../../boutique/ajouter-boutique/ajouter-boutique';
import { GerantPage } from '../../boutique/gerant/gerant';
import { TypeProduitPage } from '../../boutique/type-produit/type-produit';
import { ProduitPage } from '../../boutique/produit/produit';
import { TabsPage } from '../../tabs/tabs'
import { global } from '../../../global-variables/variable';

/*
  Generated class for the ConfigBoutique page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-config-boutique',
  templateUrl: 'config-boutique.html'
})
export class ConfigBoutiquePage {

  postion: any = '';
  infoBoutique: boolean = false;
  typeProduit: boolean = false;
  produit: boolean = false;
  gerant: boolean = false;
  ok: boolean = false;
  concerve: boolean = false;
  ignore: boolean = false;
  estIgnorer: boolean = false;
  produits: any = [];
  gerants: any = [];


  constructor(public navCtrl: NavController, public loadingCtl: LoadingController, public navParams: NavParams, public alertCtl: AlertController, public storage: Storage, public gestionService: GestionBoutique) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigBoutiquePage');
  }

  
  ionViewDidEnter(){
    //this.gestionService.doSync();
    this.storage.get('boutique_id').then((id) => {
      if(id){
        if(global.suivant){
          this.postion = 'info-boutique';
          this.concerve = true;
        }
        this.gestionService.getBoutiqueById(id).then((data) => {
          this.gestionService.getPlageDocs(id+ ':produit', id+ ':produit:\ufff0').then((produits) => {
            this.produits = produits;
            this.gestionService.getPlageDocs(id+ ':gerant', id+ ':gerant:\ufff0').then((gerants) => {
              this.gerants = gerants;
              this.gestion(data, this.produits, this.gerants);
            });
          });
          
          
        }, error =>  {
          let alert = this.alertCtl.create({
            title: 'Erreur',
            message: 'La boutique d\'ID: <strong>'+id+'</strong> n\'existe pas.<br> Veuillez conracter l\'administrateur',
            buttons: [
              {
                text: 'ok',
                handler: () => {
                  this.infoBoutique = true;
                  this.postion = 'info-boutique';
                  this.concerve = true;
                  global.suivant = true;

                  //this.ionViewDidEnter();
                }
              }
            ]
          });

          alert.present()
        });
      }else{
         this.infoBoutique = true;
         this.postion = 'info-boutique';
      }
       
    });
  }

  gestion(data, produits, gerants){
    if(global.changerInfoBoutique){
      let alert = this.alertCtl.create({
        title: 'Boutique déjà configurée',
        message: 'Une anciènne configuration a été détectée, voulez la changer ?',
        buttons: [
          {
            text: 'Non',
            handler: () => {
            // this.gestionService.getBoutiqueById(id).then((data) => { 
              if(!this.estIgnorer){
                  if(gerants.length <= 0){
                    this.infoBoutique = true;
                    this.gerant = true;
                    this.typeProduit = false;
                    this.produit = false;
                    this.ok = false;
                    this.ignore = true;
                    this.postion = 'gerant';
                  }else if (data.type_produits.length <= 0){
                    this.infoBoutique = true;
                    this.gerant = true;
                    this.typeProduit = true;
                    this.produit = false;
                    this.ok = false;
                    this.ignore = true;
                    this.postion = 'type-produit';
                  }else if (produits.length <= 0){
                    this.infoBoutique = true;
                    this.gerant = true
                    this.typeProduit = true;
                    this.produit = true;
                    this.ok = false
                    this.ignore = true;
                    this.postion = 'produit'
                  }else{
                    this.infoBoutique = true;
                    this.gerant = true
                    this.typeProduit = true;
                    this.produit = true;
                    this.ok = true;
                    this.ignore = false;
                    this.postion = 'ok';
                  }
            // });
               }else{
                  this.infoBoutique = true;
                  this.gerant = true
                  this.typeProduit = true;
                  this.produit = true;
                  this.ok = true;
                  this.ignore = false;
                  this.postion = 'ok';
               }
              global.changerInfoBoutique = false;
            }
          },
          {
            text: 'OUI',
            handler: () => {
              this.infoBoutique = true;
              this.postion = 'info-boutique';
              this.concerve = true;
              global.suivant = true;
            }
          }
        ]
      });
      if(!global.suivant){
        alert.present();
      }
    
    }else{
    // this.gestionService.getBoutiqueById(id).then((data) => { 
      if(!this.estIgnorer){
          if(gerants.length <= 0){
            this.infoBoutique = true;
            this.gerant = true;
            this.typeProduit = false;
            this.produit = false;
            this.ok = false;
            this.ignore = true;
            this.postion = 'gerant';
          }else if (data.type_produits.length <= 0){
            this.infoBoutique = true;
            this.gerant = true;
            this.typeProduit = true;
            this.produit = false;
            this.ok = false;
            this.ignore = true;
            this.postion = 'type-produit';
          }else if (produits.length <= 0){
            this.infoBoutique = true;
            this.gerant = true
            this.typeProduit = true;
            this.produit = true;
            this.ok = false;
            this.ignore = true;
            this.postion = 'produit'
          }else{
            this.infoBoutique = true;
            this.gerant = true
            this.typeProduit = true;
            this.produit = true;
            this.ok = true;
            this.ignore = false;
            this.postion = 'ok';
          }
      }else{
        this.infoBoutique = true;
        this.gerant = true
        this.typeProduit = true;
        this.produit = true;
        this.ok = true;
        this.ignore = false;
        this.postion = 'ok';
      }
      //});
    }
  }

  ajouterBoutique(){
    this.navCtrl.push(AjouterBoutiquePage);
  }

  changerBoutique(){
    global.ajout = 0;
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
            let loat = this.loadingCtl.create({
              content: 'Chargement de la BD en cours...'
            });
            this.gestionService.checkRemoteExists(data.boutique_id).then((result) => {
              if(result){
                loat.present();
                this.gestionService.db.sync(this.gestionService.remote, {
                  live: true,
                  retry: true,
                  continuous: true,
                  //filter: 'mydesign/myfilter'
                  filter: (doc) => {
                    return doc._id.match(data.boutique_id+'[0-9a-zA-Z_:]*');
                  }
                }).on('change',  (info) => {
                  //loat.dismissAll();
                  // handle change
                }).on('paused',  (err) => {
                    this.gestionService.getBoutiqueById(data.boutique_id).then((boutique) => {
                      this.storage.set('boutique_id', boutique._id);
                
                      global.changerInfoBoutique = false;
                      //this.ionViewDidEnter();
                      //this.navCtrl.viewDidEnter;
                      //this.ionViewDidEnter();
                    });

                    loat.dismissAll();
                    let alt = this.alertCtl.create({
                      title: 'Succes',
                      message: 'Boutique chargée avec succes',
                      buttons:[
                        {
                          text: 'ok',
                          handler: () => this.ionViewDidEnter()
                        }
                      ]
                    });
                    if(global.ajout === 0){
                      alt.present();
                      global.ajout = 1;
                    }
                    

                    //this.ionViewDidEnter();
                  // replication paused (e.g. replication up to date, user went offline)
                }).on('active',  () => {
                  // replicate resumed (e.g. new changes replicating, user went back online)
                }).on('denied',  (err) => {
                  let alt = this.alertCtl.create({
                      title: 'denied',
                      message: 'Sync denied',
                      buttons:[
                        {
                          text: 'ok',
                          handler: () => this.ionViewDidEnter()
                        }
                      ]
                    });

                    alt.present()
                  // a document failed to replicate (e.g. due to permissions)
                }).on('complete',  (info) => {
                  this.gestionService.getBoutiqueById(data.boutique_id).then((boutique) => {
                      this.storage.set('boutique_id', boutique._id);
                
                      global.changerInfoBoutique = false;
                      //this.ionViewDidEnter();
                      //this.navCtrl.viewDidEnter;
                      //this.ionViewDidEnter();
                    });

                    loat.dismissAll();
                    let alt = this.alertCtl.create({
                      title: 'Succes',
                      message: 'Boutique chargée avec succes',
                      buttons:[
                        {
                          text: 'ok',
                          handler: () => this.ionViewDidEnter()
                        }
                      ]
                    });

                  alt.present()
                  // handle complete
                }).on('error',  (err) => {
                  loat.dismissAll();
                  let alt = this.alertCtl.create({
                      title: 'Erreur',
                      message: 'Erreur lors de la synchronisation',
                      buttons:[
                        {
                          text: 'ok',
                          handler: () => this.ionViewDidEnter()
                        }
                      ]
                    });

                    alt.present()
                  // handle error
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

  lancer(){
    global.changerInfoBoutique = true;
    this.navCtrl.setRoot(TabsPage);

  }

  concerver(){

    let alert = this.alertCtl.create({
      title: 'Concerver la configuration',
      message:'Etes vous sûr de concerver l\'anciènne configuration ? ',
      buttons: [
        {
          text: 'OUI',
          handler: () => {
            global.changerInfoBoutique = false;
            this.ionViewDidEnter();
          }
        },
        {
          text: 'Non',
          handler: () => console.log('Annuler')
        }
      ]
    })
    //this.ionViewDidEnter();
    alert.present();
  }

  ignorer(){
    let alert = this.alertCtl.create({
      title: 'Avertissement',
      message: 'Etes vous certains de vouloire ignorer le reste de la configuration ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            this.estIgnorer = false;
            this.ionViewDidEnter();
          }
        },
        {
          text: 'OUI',
          handler: () => {
            this.estIgnorer = true;
            this.infoBoutique = true;
            this.gerant = true
            this.typeProduit = true;
            this.produit = true;
            this.ok = true;
            this.ignore = false;
            this.postion = 'ok';
            this.ionViewDidEnter();
          }
        }
      ]
    });

    alert.present();
  }
}
