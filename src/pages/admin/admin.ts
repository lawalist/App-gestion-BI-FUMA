import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
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

  bID: any = '';

  constructor(public navCtrl: NavController, public loadingCtl: LoadingController, public toastCtl: ToastController, public navParams: NavParams, public alertCtl: AlertController, public storage: Storage, public gestionService: GestionBoutique) {}

  ionViewWillEnter() {
    this.storage.get('boutique_id').then((id) => {
      if(id){
        this.bID = id;
      }
    });
  }

    ipServeur(){
      this.storage.get('ip_serveur').then((ip) => {
      if(!ip){
        this.storage.set('ip_serveur', '127.0.0.1');
      }else{
        let alert = this.alertCtl.create({
        title: 'Adresse IP du serveur',
        //cssClass: 'error',
        inputs: [
          {
            type: 'text',
            placeholder: 'IP serveur',
            name: 'ip_serveur',
            value: ip
          }
        ],
        buttons: [
          {
            //cssClass: 'error-border',
            text: 'Annuler',
            role: 'Cancel',
            handler: () => console.log('Changement ip serveur annuler')
          },
          {
            text: 'Valider',
            handler: data => {
              this.storage.set('ip_serveur', data.ip_serveur);
              global.ip_serveur = data.ip_serveur;
              this.gestionService.dbSync(this.bID);
              
              let toast = this.toastCtl.create({
                message: 'IP mise à jour avec succes...',
                duration: 3000,
                position: 'top'
              });
              toast.present();
              
            }
          }
        ]
      }); 

      alert.present();
        }
      });
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
            let loat = this.loadingCtl.create({
              content: 'Chargement de la BD en cours...'
            });
            this.gestionService.checkRemoteExists(data.boutique_id).then((result) => {
              if(result){
                loat.present();
                this.gestionService.db.replicate.to(this.gestionService.remote, {
                    //live: true,
                    //retry: true
                    //continuous: true
                    filter: (doc) => {
                      return doc._id.match(this.bID+'[0-9a-zA-Z_:]*');
                    }
                    }).on('change', (info) => {
                      // handle change
                    }).on('paused', (err) => {
                      /*let toast = this.toastCtl.create({
                        message: 'Replication pause...',
                        duration: 3000,
                        position: 'top'
                      });
                      toast.present();*/
                      // replication paused (e.g. replication up to date, user went offline)
                    }).on('active', () => {
                      // replicate resumed (e.g. new changes replicating, user went back online)
                    }).on('denied', (err) => {
                      loat.dismissAll();
                      // a document failed to replicate (e.g. due to permissions)
                    }).on('complete', (info) => {
                      /*let toast = this.toastCtl.create({
                        message: 'Replication complete...',
                        duration: 3000,
                        position: 'top'
                      });
                      toast.present();*/

                      //this.gestionService.reset(); 
                      //this.gestionService.createDataBase();
                      
                      this.gestionService.db.sync(this.gestionService.remote, {
                        live: true,
                        retry: true,
                        continuous: true,
                        //filter: 'mydesign/myfilter'
                        filter: (doc) => {
                          return doc._id.match(data.boutique_id+'[0-9a-zA-Z_:]*');
                        }
                      }).on('change',  (info) => {
                        // handle change
                      }).on('paused',  (err) => {
                          this.gestionService.getBoutiqueById(data.boutique_id).then((boutique) => {
                          this.storage.set('boutique_id', boutique._id);

                          loat.dismissAll();
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
                          //this.ionViewDidEnter();
                        // replication paused (e.g. replication up to date, user went offline)
                      }).on('active',  () => {
                        // replicate resumed (e.g. new changes replicating, user went back online)
                      }).on('denied',  (err) => {
                        loat.dismissAll();
                        let alt = this.alertCtl.create({
                            title: 'denied',
                            message: 'Sync denied',
                            buttons:[
                              {
                                text: 'ok',
                                handler: () => this.ionViewWillEnter()
                              }
                            ]
                          });

                          alt.present()
                        // a document failed to replicate (e.g. due to permissions)
                      }).on('complete',  (info) => {
                        this.gestionService.getBoutiqueById(data.boutique_id).then((boutique) => {
                          this.storage.set('boutique_id', boutique._id);

                          loat.dismissAll();
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
                        // handle complete
                      }).on('error',  (err) => {
                        loat.dismissAll();
                        let alt = this.alertCtl.create({
                            title: 'Erreur',
                            message: 'Erreur lors de la synchronisation',
                            buttons:[
                              {
                                text: 'ok',
                                handler: () => this.ionViewWillEnter()
                              }
                            ]
                          });

                          alt.present()
                        // handle error
                      });
                      // handle complete
                    }).on('error', (err) => {
                      loat.dismissAll();
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
