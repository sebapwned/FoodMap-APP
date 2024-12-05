import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class RestaurantUseCase {

  constructor(
    private firestore: AngularFirestore,
  ) {}

  async performRestaurantRegistration(uid: string, userPhotoURL: string, nombreRestaurant: string, tipoComida: string, direccion: string, horarioAtencion: string, valoracion: string, resena: string): Promise<{ success: boolean; message: string }> {
    try {
        // uso de trim para verificar que los campos no esten vacios
        if (uid.trim() && userPhotoURL.trim() && nombreRestaurant.trim() && tipoComida.trim() && direccion.trim() && horarioAtencion.trim() && valoracion.trim() && resena.trim()) {
          // crear un objeto con los datos del restaurante
          const restaurantData = {
            uid: uid,
            userPhotoURL: userPhotoURL,
            nombreRestaurant: nombreRestaurant,
            tipoComida: tipoComida,
            direccion: direccion,
            horarioAtencion: horarioAtencion,
            valoracion: valoracion,
            resena: resena
          };

        // guarda la información del restaurant en Firestore, al llamar a collection 'restaurants' crea una coleccion de restaurants si no existe, crea un documento con el nombre del restaurant y le agrega el restaurantdata al documento
        await this.firestore.collection('restaurants').doc(nombreRestaurant).set(restaurantData);
      }

      
      return { success: true, message: "Restaurant agregado con éxito" };

    } catch (error: any) {
      
      let errorMessage = 'Ocurrió un error al agregar el restaurant';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está en uso. Por favor, utiliza otro o inicia sesión.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'La dirección de correo electrónico no es válida.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil.';
          break;
        default:
          errorMessage += ': ' + error.message;
          break;
      }

      
      return { success: false, message: errorMessage };
    }
  }
  
  async updateRestaurant(restaurantId: string, updatedData: any): Promise<{ success: boolean; message: string }> {
    try {
      // actualizar el documento del restaurante
      await this.firestore.collection('restaurants').doc(restaurantId).update(updatedData);
      return { success: true, message: "Restaurante actualizado con éxito" };
    } catch (error: any) {
      console.error('Error al actualizar el restaurante:', error);
      return { success: false, message: 'Error al actualizar el restaurante. Por favor, inténtelo de nuevo.' };
    }
  }

  async deleteRestaurant(restaurantId: string): Promise<{ success: boolean; message: string }> {
    try {
      // eliminar el documento del restaurante
      await this.firestore.collection('restaurants').doc(restaurantId).delete();
      return { success: true, message: 'Reseña eliminada con éxito' };
    } catch (error: any) {
      console.error('Error al eliminar la reseña:', error);
      return { success: false, message: 'Error al eliminar la reseña. Por favor, inténtelo de nuevo.' };
    }
  }


}


