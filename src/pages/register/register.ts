import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { Validators, FormBuilder } from '@angular/forms';

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  //nom: string;
  //username: string;
  //email: string;
  mdpass: string;
  confmdpass: string;
  registerForm: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public formBuilder: FormBuilder, public navParams: NavParams, public loadinCtl: LoadingController, public gestionService: GestionBoutique) {
    let d: Date = new Date();
    let s = this.createDate(d.getDate(), d.getMonth(), d.getFullYear());
    this.registerForm = this.formBuilder.group({
        nom: [''],
        username: ['', Validators.required],
        email: [''],
        mdpass: ['', Validators.required],
        confmdpass: ['', Validators.required],
        date: [s, Validators.required],
        sex: ['', Validators.required], 
        created_at: [d.toJSON()],
        updatet_at: [d.toJSON()],
        created_by: [''],
        updated_by: [''],
        //deleted_at: [d.toJSON()],
        //deleted_by: [d.toJSON()],
    });
  }

  createDate(jour: any, moi: any, annee: any){
    let s = annee+'-';
    moi += 1;
    if(moi < 10){
      s += '0'+moi+'-';
    }else{
      s += moi+'-';
    }

    if(jour < 10){
      s += '0'+jour;
    }else{
      s += jour;
    }
    return s;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    if(this.mdpass !== this.confmdpass){
      alert('Le mot de passe et la confirmation ne sont pas conformes.');
      this.confmdpass = '';
    }else{
      //this.gestionService.logout();
      let user = this.registerForm.value;
      let meta = {
        nom: user.nom,
        email: user.email,
        date: user.date,
        sex: user.sex
      }
 

      let loading = this.loadinCtl.create({
        content: 'Enregistrement...'
      });
      loading.present();

      //let db = new PouchDB('http://localhost:5984/stock-fuma');
      this.gestionService.remote.signup(user.username, user.mdpass,{metadata : meta}, (err, response) => {
        if(err){
          loading.dismissAll();
          if (err.name === 'conflict') {
              alert('nom utilisateur existe');
            }else  if (err.name === 'forbidden') {
              alert('nom utilisateur invalide');
            } else{
              alert('erreur');
            }
        }else if(response){
          loading.dismissAll();
          this.loginUser(user.username, user.mdpass)
          //this.navCtrl.setRoot(TabsPage);
        }else{
          loading.dismissAll();
          alert('echec');
        }
          
      });
    }
    
  }

  login(){
    this.navCtrl.push(LoginPage);
  }

 loginUser(username: any, mdpass: any){
    let loading = this.loadinCtl.create({
      content: 'Connexion...'
    });
    loading.present();
    let ajaxOpts = {
      ajax: {
        headers: {
          Authorization: 'Basic ' + window.btoa(username + ':' + mdpass)
        }
      }
    };
    this.gestionService.remote.login(username, mdpass, ajaxOpts, (err, response) => {
      if (err) {
        loading.dismissAll();
        if (err.name === 'unauthorized') {
          alert('nom ou mot de passe incorrecte');
          
        } else {
          alert('erreur');
          
        }
      }else if(response){
        loading.dismissAll();
        //alert('success');
        //this.MyApp.setPage();
        //let m = MyApp.g
        //m.setPage();
        this.navCtrl.setRoot(TabsPage);
        this.enableAuthenticatedMenu();
  
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

}
