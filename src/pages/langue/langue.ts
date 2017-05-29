import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { global } from '../../global-variables/variable';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Langue page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-langue',
  templateUrl: 'langue.html'
})
export class LanguePage {

  langue: any = global.langue; 

  constructor(public appCtl: App, public viewCtl: ViewController, public translate: TranslateService, public storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.translate.setDefaultLang(this.langue);
  }

  ionViewWillEnter() {
    this.translate.use(global.langue);
   // console.log('ionViewDidLoad LanguePage');
  }

  choixLangue(){
    this.translate.use(this.langue);
    global.langue = this.langue;
    this.storage.set('langue', this.langue);
    //this.appCtl.getRootNav().pop();//setRoot(TabsPage);
    this.navCtrl.pop();
    //window.location.reload();
  }

}
