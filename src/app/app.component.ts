import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, LoadingController, MenuController  } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { AccueilPage } from '../pages/accueil/accueil';
import { GestionBoutique } from '../providers/gestion-boutique';

//ny
//import { VentesPage } from '../pages/ventes/ventes';
import { AdminPage } from '../pages/admin/admin';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';

import { global } from '../global-variables/variable';
import { Storage } from '@ionic/storage';

//declare var id_boutique: 'string';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage = TabsPage;
  rootPage: any;
  name: any ='';

  pages: Array<{title: string, component: any}>;
  pages1: Array<{title: string, component: any}>; 

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, public storage: Storage, public menuCtrl: MenuController, public loadCtl: LoadingController, public gestionService: GestionBoutique, public alertCtl: AlertController) {
    let loading = this.loadCtl.create({
      content: 'Chargement de l\'application en cours...'
    });
    loading.present();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide(); 
    });

    this.storage.get('langue').then((langue) => {
      if(langue){
        global.langue = langue;
      }
    });

    this.storage.get('ip_serveur').then((ip) => {
      if(!ip){
        this.storage.set('ip_serveur', '127.0.0.1');
      }else{
        global.ip_serveur = ip;
      } 

    });

    this.storage.get('tache').then((tache) => {
      if(tache){
        this.storage.get('boutique_id').then((id) => {
              if(id){
                this.gestionService.getBoutiqueById(id).then((res) => {
                  global.boutique = res;
                });
                
              }
            });
        loading.dismissAll();
        //global.id_boutique = id;
        global.configOK = true;
        this.rootPage = TabsPage; 
        
      }else{
            this.storage.get('boutique_id').then((id) => {
              if(id){
                this.gestionService.getBoutiqueById(id).then((res) => {
                  loading.dismissAll();
                  //global.id_boutique = id;
                  global.configOK = true;
                  this.rootPage = TabsPage; 
                  
                }, error => {
                    loading.dismissAll();
                    let alert = this.alertCtl.create({
                      title: 'Erreur',
                      message: 'La boutique d\'ID: <strong>'+id+'</strong> n\'existe pas.<br> Veuillez conracter l\'administrateur',
                      buttons: [
                        {
                          text: 'ok',
                          handler: () => {
                            this.storage.remove('boutique_id');
                            global.configOK = false;
                            this.rootPage = AccueilPage
                            //this.ionViewDidEnter();
                          }
                        }
                      ]
                    });

                  alert.present()
                });
                
              }else{
                loading.dismissAll();
                global.configOK = false;
                this.rootPage = AccueilPage;
              }
            });
      }
    })



    this.setPage();
    //loading.dismissAll();
  }


  ionViewDidEnter(){
    this.setPage();
  }

  setPage(){

    this.pages = [
            { title: 'Connexion', component: LoginPage },
            { title: 'Connexion', component: LoginPage },
            { title: 'Enregistrement', component: RegisterPage },
            /*{ title: 'Profile', component: '' },
            { title: 'Déconnexion', component: '' }*/
          ];
     this.pages1 = [
            /*{ title: 'Connexion', component: LoginPage },
            { title: 'Connexion', component: LoginPage },
            { title: 'Enregistrement', component: RegisterPage },*/
            { title: 'Profile', component: ProfilePage },
            { title: 'Profile', component: ProfilePage },
            { title: 'Déconnexion', component: '' }
          ];
    this.gestionService.remote.getSession((err, response) => {
        if (err) {
          // network error
        } else if (!response.userCtx.name) {
          // nobody's logged in
          this.enableUnAuthenticatedMenu();
          /*this.pages = [
            { title: 'Connexion', component: LoginPage },
            { title: 'Connexion', component: LoginPage },
            { title: 'Enregistrement', component: RegisterPage },
            /*{ title: 'Profile', component: '' },
            { title: 'Déconnexion', component: '' }*
          ];*/
        } else {
          this.name = response.userCtx.name; 
          this.enableAuthenticatedMenu()

          /*this.pages = [
            /*{ title: 'Connexion', component: LoginPage },
            { title: 'Connexion', component: LoginPage },
            { title: 'Enregistrement', component: RegisterPage },*
            { title: 'Profile', component: ProfilePage },
            { title: 'Profile', component: ProfilePage },
            { title: 'Déconnexion', component: '' }
          ];*/
          // response.userCtx.name is the current user
        }
      });
  }

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated');
    this.menuCtrl.enable(false, 'unauthenticated');
    //this.menuCtrl.toggle('authenticated')
  }

  enableUnAuthenticatedMenu() {
    this.menuCtrl.enable(false, 'authenticated');
    this.menuCtrl.enable(true, 'unauthenticated');
    //this.menuCtrl.toggle('unauthenticated')
  }

   openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component){
      this.nav.push(page.component);
      this.menuCtrl.close();
    }else if(page.title === 'Déconnexion'){
      this.gestionService.logout();
      this.menuCtrl.close();
      this.enableUnAuthenticatedMenu();
    }
    
  }
}
