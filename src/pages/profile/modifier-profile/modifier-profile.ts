import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { GestionBoutique } from '../../../providers/gestion-boutique';
import { ProfilePage } from '../../profile/profile';
import { TranslateService } from '@ngx-translate/core';
import { global } from '../../../global-variables/variable';

/*
  Generated class for the ModifierProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modifier-profile',
  templateUrl: 'modifier-profile.html'
})
export class ModifierProfilePage {
  user: any;
  registerForm: any;

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public loadingCtl: LoadingController, public gestionService: GestionBoutique) {
    this.translate.setDefaultLang(global.langue);
    this.user = this.navParams.data.user;

    this.registerForm = this.formBuilder.group({
        nom: [this.user.nom],
        //username: ['', Validators.required],
        email: [this.user.email],
        //mdpass: ['', Validators.required],
        //confmdpass: ['', Validators.required],
        date: [this.user.date, Validators.required],
        sex: [this.user.sex, Validators.required],
    })
  }

  ionViewWillEnter() {
    this.translate.use(global.langue);
    console.log('ionViewDidLoad ModifierProfilePage');
  }

  modifier(){
    let newUserInfo = this.registerForm.value;
    this.gestionService.remote.putUser(this.user.name, {
      metadata : {
        email : newUserInfo.email,
        date : newUserInfo.date,
        sex : newUserInfo.sex,
      }
    }, (err, response) => {
      if(err){
        alert('Erreur');
      }else if(response){
        this.navCtrl.push(ProfilePage);
      }
      
    });
  }
 


}
