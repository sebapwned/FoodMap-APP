import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class RestaurantUseCase {

  constructor(
    private firestore: AngularFirestore,
  ) {}

  async performRestaurantRegistration(userPhotoURL: string, nombreRestaurant: string, tipoComida: string, direccion: string, horarioAtencion: string): Promise<{ success: boolean; message: string }> {
    try {
        // uso de trim para verificar que los campos no esten vacios
        if (userPhotoURL.trim() && nombreRestaurant.trim() && tipoComida.trim() && direccion.trim() && horarioAtencion.trim()) {
          // Crear un objeto con los datos del restaurante
          const restaurantData = {
            userPhotoURL: userPhotoURL,
            nombreRestaurant: nombreRestaurant,
            tipoComida: tipoComida,
            direccion: direccion,
            horarioAtencion: horarioAtencion
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
}
