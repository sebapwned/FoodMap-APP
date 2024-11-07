import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationUseCase {

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
  ) {}

  async performRegistration(email: string, password: string, nombre: string, apellido: string, direccion: string): Promise<{ success: boolean; message: string }> {
    try {
      // registra al usuario en Firebase Authentication
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // obtener el uid del usuario
        const uid = user.uid;
   

        // crear un objeto con los datos del usuario
        const userData = {
          uid: uid,
          email: email,
          nombre: nombre,
          apellido: apellido,
          direccion: direccion

        };

        // guarda la información del usuario en Firestore, al llamar a collection 'users' crea una coleccion de users si no existe, crea un documento con el uid y le agrega el userdata al documento
        await this.firestore.collection('users').doc(uid).set(userData);
      }

      
      return { success: true, message: "Usuario registrado con éxito" };

    } catch (error: any) {
      
      let errorMessage = 'Ocurrió un error al registrar el usuario';

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
