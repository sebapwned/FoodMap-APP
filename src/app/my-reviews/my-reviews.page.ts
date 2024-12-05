import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CancelAlertService } from '../managers/CancelAlertService';
import { UserLoginUseCase } from '../use-cases/user-login.use-case';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RestaurantUseCase } from '../use-cases/restaurant.use-case';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage  {
  
  uid: string = '';
  restaurants: any[] = []; // almacenará los restaurantes asociados al UID

  constructor(
    private router: Router,
    private alert: CancelAlertService,
    private userLoginUseCase: UserLoginUseCase,
    private firestore: AngularFirestore,
    private restaurantUseCase: RestaurantUseCase

  ) { }

  async ngOnInit() {
    try {
      // Recuperar el UID
      this.uid = await this.userLoginUseCase.getUserUid();
      console.log('UID recuperado:', this.uid);
  
      if (!this.uid) {
        throw new Error('No se pudo recuperar el UID del usuario.');
      }
  
      // consulta directa para depurar. Cambie toPromise() por subscribe() (usar .subscribe() permite capturar los datos en tiempo real o cuando se emiten, mientras que toPromise() espera la finalización del observable, lo cual por alguna razon no me estaba trayendo los datos de firestore) ademas deje de utilziar la funcion desde el caso de uso de restaurant (ademas otorga un id a cada reseña que en este caso viene siendo el nombre del restaurant la primera vez que lo registramos, esta id la utilizamos al momento de modificar una reseña tambien)
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
  this.router.navigate(['/inicio'])
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

// función para navegar a la vista de modificar reseña
modifyReviewButtonPressed(restaurant: any) {
  this.router.navigate(['/modify-review'], {
    state: { restaurant } // pasar los datos del restaurante seleccionado
  });
}

async deleteReviewButtonPressed(restaurant: any) {
  this.alert.showAlert(
    'Eliminar Reseña',
    `¿Estás seguro de que quieres eliminar la reseña de "${restaurant.nombreRestaurant}"?`,
    async () => {
      try {
        const result = await this.restaurantUseCase.deleteRestaurant(restaurant.id);
        if (result.success) {
          this.alert.showAlert(
            'Éxito',
            'Reseña eliminada con éxito.',
            () => {
              this.restaurants = this.restaurants.filter((r) => r.id !== restaurant.id);
            }
          );
        } else {
          this.alert.showAlert('Error', result.message, () => {});
        }
      } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        this.alert.showAlert(
          'Error',
          'Hubo un problema al eliminar la reseña. Por favor, intenta nuevamente.',
          () => {}
        );
      }
    },
    () => {
      console.log('El usuario canceló la eliminación.');
    }
  );
}
}
