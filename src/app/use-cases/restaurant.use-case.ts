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
  async getRestaurantsByUid(uid: string): Promise<any[]> {
    try {
      console.log('Consultando Firestore con UID:', uid);
      const snapshot = await this.firestore
        .collection('restaurants', (ref) => ref.where('uid', '==', uid))
        .valueChanges({ idField: 'id' })
        .toPromise(); 
      console.log('Datos obtenidos desde Firestore:', snapshot);
      return snapshot || [];
    } catch (error) {
      console.error('Error obteniendo los restaurantes:', error);
      return [];
    }
  }
}
