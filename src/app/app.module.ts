import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http } from '@angular/http';

import { MyApp } from './app.component';
import { AdminPage } from '../pages/admin/admin';
import { LanguePage } from '../pages/langue/langue';
import { TabsPage } from '../pages/tabs/tabs';
import { BoutiquePage } from '../pages/boutique/boutique';
import { AjouterBoutiquePage } from '../pages/boutique/ajouter-boutique/ajouter-boutique';
import { ModifierBoutiquePage } from '../pages/boutique/modifier-boutique/modifier-boutique';
import { ProduitPage } from '../pages/boutique/produit/produit';
import { AjouterProduitPage } from '../pages/boutique/produit/ajouter-produit/ajouter-produit';
import { ModifierProduitPage } from '../pages/boutique/produit/modifier-produit/modifier-produit';
import { DetailProduitPage } from '../pages/boutique/produit/detail-produit/detail-produit';
import { GerantPage } from '../pages/boutique/gerant/gerant';
import { AjouterGerantPage } from '../pages/boutique/gerant/ajouter-gerant/ajouter-gerant';
import { ModifierGerantPage } from '../pages/boutique/gerant/modifier-gerant/modifier-gerant';
import { DetailGerantPage } from '../pages/boutique/gerant/detail-gerant/detail-gerant';
import { TypeProduitPage } from '../pages/boutique/type-produit/type-produit';
import { AjouterTypeProduitPage } from '../pages/boutique/type-produit/ajouter-type-produit/ajouter-type-produit';
import { ModifierTypeProduitPage } from '../pages/boutique/type-produit/modifier-type-produit/modifier-type-produit';
import { DetailTypeProduitPage } from '../pages/boutique/type-produit/detail-type-produit/detail-type-produit';

import { OperationsPage } from '../pages/operations/operations';
import { AjouterOperationPage } from '../pages/operations/ajouter-operation/ajouter-operation';
import { ModifierOperationPage } from '../pages/operations/modifier-operation/modifier-operation';
import { DetailOperationPage } from '../pages/operations/detail-operation/detail-operation';
import { AccueilPage } from '../pages/accueil/accueil';
import { ConfigBoutiquePage } from '../pages/accueil/config-boutique/config-boutique';
import { ConfigGerantPage } from '../pages/accueil/config-gerant/config-gerant';
import { ConfigProduitPage } from '../pages/accueil/config-produit/config-produit';
import { ConfigTypeProduitPage } from '../pages/accueil/config-type-produit/config-type-produit';
import { ChoixTypeUtilisateurPage } from '../pages/accueil/choix-type-utilisateur/choix-type-utilisateur';
import { RapportPage } from '../pages/rapport/rapport';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { ModifierProfilePage } from '../pages/profile/modifier-profile/modifier-profile';

//providers
//import { GestionVentes } from '../providers/gestion-ventes';
//import { GestionAchats } from '../providers/gestion-achats';
import { GestionBoutique } from '../providers/gestion-boutique';
import { AutoCompletion } from '../providers/auto-completion';

//module
import { AutoCompleteModule } from 'ionic2-auto-complete';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    AdminPage,
    AccueilPage,
    TabsPage,
    BoutiquePage,
    AjouterBoutiquePage,
    ModifierBoutiquePage,
    ProduitPage,
    AjouterProduitPage,
    ModifierProduitPage,
    DetailProduitPage,
    GerantPage,
    AjouterGerantPage,
    ModifierGerantPage,
    DetailGerantPage,
    TypeProduitPage,
    AjouterTypeProduitPage,
    ModifierTypeProduitPage,
    DetailTypeProduitPage,
    OperationsPage,
    AjouterOperationPage,
    ModifierOperationPage,
    DetailOperationPage,
    ConfigBoutiquePage,
    ConfigBoutiquePage,
    ConfigProduitPage,
    ConfigTypeProduitPage,
    RapportPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    ModifierProfilePage,
    ChoixTypeUtilisateurPage,
    LanguePage
    //AutoCompleteModule,
  ],
  imports: [
    AutoCompleteModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp, 
    AdminPage,
    AccueilPage,
    TabsPage,
    BoutiquePage,
    AjouterBoutiquePage,
    ModifierBoutiquePage,
    ProduitPage,
    AjouterProduitPage,
    ModifierProduitPage,
    DetailProduitPage,
    GerantPage,
    AjouterGerantPage,
    ModifierGerantPage,
    DetailGerantPage,
    TypeProduitPage,
    AjouterTypeProduitPage,
    ModifierTypeProduitPage,
    DetailTypeProduitPage,
    OperationsPage,
    AjouterOperationPage,
    ModifierOperationPage,
    DetailOperationPage,
    ConfigBoutiquePage,
    ConfigBoutiquePage,
    ConfigProduitPage,
    ConfigTypeProduitPage,
    RapportPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    ModifierProfilePage, 
    ChoixTypeUtilisateurPage,
    LanguePage  
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, GestionBoutique, AutoCompletion]
})
export class AppModule {}
