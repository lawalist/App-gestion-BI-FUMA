import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { AccueilPage } from '../pages/accueil/accueil';
import { GestionBoutique } from '../providers/gestion-boutique';

//ny
import { VentesPage } from '../pages/ventes/ventes';
import { AdminPage } from '../pages/admin/admin';

import { global } from '../global-variables/variable';
import { Storage } from '@ionic/storage';

//declare var id_boutique: 'string';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage = TabsPage;
  rootPage: any;

  pages: Array<{title: string, component: any}>; 
  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, public storage: Storage, public loadCtl: LoadingController, public gestionService: GestionBoutique, public alertCtl: AlertController) {
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

    this.storage.get('boutique_id').then((id) => {
      if(id){
        this.gestionService.getBoutiqueById(id).then((res) => {
          loading.dismissAll();
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
        this.rootPage = AccueilPage;
      }
    });


    this.pages = [
      { title: 'Option 1', component: '' },
      { title: 'Option 1', component: '' },
      { title: 'Option 2', component: '' },
      { title: 'Option 3', component: '' },
      { title: 'Option 4', component: '' }
    ];

    //loading.dismissAll();
  }

   openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
