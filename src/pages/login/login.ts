import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, MenuController, AlertController, ViewController } from 'ionic-angular';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { Validators, FormBuilder } from '@angular/forms';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../global-variables/variable';
import { ConfigBoutiquePage } from '../accueil/config-boutique/config-boutique';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  //username: string;
  //mdpass: string;
  adminOK: any = -1;
  loginForm: any;
  tache: any = '';
  user: any = {
    'username': '',
    'mdpass': ''
  };
  configOK: any = global.configOK;

  constructor(public alertCtl: AlertController, public viewCtl: ViewController, public translate: TranslateService, public navCtrl: NavController, public storage: Storage, public menuCtrl: MenuController, public formBuilder: FormBuilder, public navParams: NavParams, public loadinCtl: LoadingController, public gestionService: GestionBoutique) {
    this.storage.get('user').then((user) => {
      if(user){
        this.user = user;
      }
      
    }, err => console.log(err));

    this.translate.setDefaultLang(global.langue);
    this.tache = this.navParams.data.tache;
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      mdpass: ['', Validators.required]
    });
  } 

  ionViewWillEnter() {
    this.translate.use(global.langue);
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    
    let loading = this.loadinCtl.create({
      content: 'Connexion...'
    });
    loading.present();
    let user = this.loginForm.value
    let ajaxOpts = {
      ajax: {
        headers: {
          Authorization: 'Basic ' + window.btoa(user.username + ':' + user.mdpass)
        }
      }
    };
    //this.remote.login(username, mdpass, ajaxOpts).then((err, response) =
    this.gestionService.remote.login(user.username, user.mdpass, ajaxOpts, (err, response) => {
      if (err) {
        loading.dismissAll();
        if (err.name === 'unauthorized') {
          alert('nom ou mot de passe incorrecte');
          
        } else {
          alert('erreur');
          
        }
      }else if(response){
        //alert('success');
        //this.MyApp.setPage();
        //let m = MyApp.g
        //m.setPage();
        //this.menuCtrl.enable(true, 'menu2');
        //this.menuCtrl.enable(false, 'menu1');
        this.storage.set('user', user);
        this.gestionService.remote.getUser(user.username, (err, us) => {
          if (err) {
            if (err.name === 'not_found') {
              // typo, or you don't have the privileges to see this user
              alert('Privilèges insuffiasants');
            } else {
              // some other error
              alert('Erreur');
            }
          } else {
           //this.user = us;
           this.storage.set('gerant', us);
           this.storage.get('boutique_id').then((id) => {
             if(id){
              this.gestionService.dbSync(id);
             }
           });

           if(this.tache !== 'admin'){
              this.enableAuthenticatedMenu();
              this.navCtrl.setRoot(TabsPage);
              
            }else{
            
              if(us.roles.indexOf('admin') >= 0){
                global.typeUtilisateur = 'admin';
                this.gestionService.dbSyncAdmin();
                this.storage.set('tache', 'admin');
                this.viewCtl.dismiss();
                this.enableAuthenticatedMenu();
                this.navCtrl.setRoot(TabsPage);
                
              }else{
                global.typeUtilisateur = 'simple';
                this.viewCtl.dismiss();
                this.enableAuthenticatedMenu();
                this.navCtrl.push(ConfigBoutiquePage);
                
                //this.gestionService.logout();
                //this.storage.remove('gerant');
                //alert('Désolé, provillèges isuffisants!')
              }
              
            }
           
          }
        });

        loading.dismissAll();

        
  
      }else{ 
        loading.dismissAll();
        alert('echec');
      }
    });
  }

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated');
    this.menuCtrl.enable(false, 'unauthenticated');
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  connexionUlterieur(){
    let avr: any = '';
    let att: any = '';
    this.translate.get('AVERTISSEMENT').subscribe(value => {
      let avr = value;
       this.translate.get('ATTENTION').subscribe(value => {
        let  att = value;
        this.translate.get('ANNULER').subscribe(value => {
         let ann = value;
    


    let alert = this.alertCtl.create({
      title: avr,
      message: att, 
      buttons: [
        {
          text: ann,
          handler: () => console.log('annuler')
        },
        {
          text: 'OK',
          role: 'Cancel',
          handler: () => {
            this.viewCtl.dismiss();
            this.navCtrl.push(ConfigBoutiquePage);
          }
        }
      ]
    });

    alert.present();
    }) ;
    }) ;
   }) ;
  }

}
