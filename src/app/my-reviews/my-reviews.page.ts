import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestaurantUseCase } from '../use-cases/restaurant.use-case';
import { CancelAlertService } from '../managers/CancelAlertService';
import { UserLoginUseCase } from '../use-cases/user-login.use-case';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage  {
  
  uid: string = '';
  restaurants: any[] = []; // almacenará los restaurantes asociados al UID

  constructor(
    private restaurantUseCase: RestaurantUseCase,
    private navCtrl: NavController, 
    private router: Router,
    private alert: CancelAlertService,
    private userLoginUseCase: UserLoginUseCase,
    private firestore: AngularFirestore
  ) { }

  async ngOnInit() {
    try {
      // Recuperar el UID
      this.uid = await this.userLoginUseCase.getUserUid();
      console.log('UID recuperado:', this.uid);
  
      if (!this.uid) {
        throw new Error('No se pudo recuperar el UID del usuario.');
      }
  
      // consulta directa para depurar. Cambie toPromise() por subscribe() (usar .subscribe() permite capturar los datos en tiempo real o cuando se emiten, mientras que toPromise() espera la finalización del observable, lo cual por alguna razon no me estaba trayendo los datos de firestore) ademas deje de utilziar la funcion desde el caso de uso de restaurant
      this.firestore.collection('restaurants', (ref) => ref.where('uid', '==', this.uid)).valueChanges({ idField: 'id' }).subscribe((data) => 
        {
          console.log('Datos obtenidos desde Firestore:', data);
          if (data.length > 0) {
            console.log('Reseñas encontradas:', data);
            this.restaurants = data; // Asignar a la lista
          } else {
            console.warn('No se encontraron reseñas para este UID.');
          }
        });
    } catch (error) {
      console.error('Error durante la inicialización de la página:', error);
      this.alert.showAlert(
        'Error',
        'Hubo un problema al cargar las reseñas. Por favor, intenta nuevamente.',
        () => {
          this.router.navigate(['/login']);
        }
      );
  }
}
goBack() {
  this.navCtrl.back();
}
onProfileButtonPressed() {
  this.router.navigate(['/profile'])
}
onMapButtonPressed() {
  this.router.navigate(['/map'])
}
onHomeButtonPressed() {
  this.router.navigate(['/inicio'])
}


}
