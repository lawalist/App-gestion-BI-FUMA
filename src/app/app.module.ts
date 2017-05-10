import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';
import { VentesPage } from '../pages/ventes/ventes';
import { AchatsPage } from '../pages/achats/achats';
import { AdminPage } from '../pages/admin/admin';
import { TabsPage } from '../pages/tabs/tabs';
import { AjouterVentePage } from '../pages/ventes/ajouter-vente/ajouter-vente';
import { ModifierVentePage } from '../pages/ventes/modifier-vente/modifier-vente';
import { AjouterAchatPage } from '../pages/achats/ajouter-achat/ajouter-achat';
import { ModifierAchatPage } from '../pages/achats/modifier-achat/modifier-achat';
import { DetailAchatPage } from '../pages/achats/detail-achat/detail-achat';
import { DetailVentePage  } from '../pages/ventes/detail-vente/detail-vente';
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

import { OperationsPage } from '../pages/operations/operations';
import { AjouterOperationPage } from '../pages/operations/ajouter-operation/ajouter-operation';
import { ModifierOperationPage } from '../pages/operations/modifier-operation/modifier-operation';
import { DetailOperationPage } from '../pages/operations/detail-operation/detail-operation';
import { AccueilPage } from '../pages/accueil/accueil';
import { ConfigBoutiquePage } from '../pages/accueil/config-boutique/config-boutique';
import { ConfigGerantPage } from '../pages/accueil/config-gerant/config-gerant';
import { ConfigProduitPage } from '../pages/accueil/config-produit/config-produit';
import { ConfigTypeProduitPage } from '../pages/accueil/config-type-produit/config-type-produit';
import { RapportPage } from '../pages/rapport/rapport';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { ModifierProfilePage } from '../pages/profile/modifier-profile/modifier-profile';

//providers
import { GestionVentes } from '../providers/gestion-ventes';
import { GestionAchats } from '../providers/gestion-achats';
import { GestionBoutique } from '../providers/gestion-boutique';

@NgModule({
  declarations: [
    MyApp,
    AdminPage,
    AccueilPage,
    AchatsPage,
    VentesPage,
    TabsPage,
    AjouterVentePage,
    ModifierVentePage,
    AjouterAchatPage,
    ModifierAchatPage,
    DetailAchatPage,
    DetailVentePage,
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
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AdminPage,
    AccueilPage,
    AchatsPage,
    VentesPage,
    TabsPage,
    AjouterVentePage,
    ModifierVentePage,
    AjouterAchatPage,
    ModifierAchatPage,
    DetailAchatPage,
    DetailVentePage,
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
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Storage, GestionVentes, GestionAchats, GestionBoutique]
})
export class AppModule {}
