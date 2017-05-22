import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { GestionBoutique } from '../../providers/gestion-boutique';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { Validators, FormBuilder } from '@angular/forms';
import { MyApp } from '../../app/app.component'

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
  loginForm: any;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public formBuilder: FormBuilder, public navParams: NavParams, public loadinCtl: LoadingController, public gestionService: GestionBoutique) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      mdpass: ['', Validators.required]
    })
  }

  ionViewDidLoad() {
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
    this.gestionService.remote.login(user.username, user.mdpass, ajaxOpts, (err, response) => {
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
        //this.menuCtrl.enable(true, 'menu2');
        //this.menuCtrl.enable(false, 'menu1');
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

  register(){
    this.navCtrl.push(RegisterPage);
  }

}
