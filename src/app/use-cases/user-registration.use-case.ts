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
      // Registra al usuario en Firebase Authentication
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Obtén el UID, el nombre de usuario 
        const uid = user.uid;
   

        // Crear objeto con los datos del usuario
        const userData = {
          uid: uid,
          email: email,
          nombre: nombre,
          apellido: apellido,
          direccion: direccion

        };

        // Guarda la información del usuario en Firestore, al llamar a collection 'users' crea una coleccion de users si no existe, crea un documento con el uid y le agrega el userdata al documento
        await this.firestore.collection('users').doc(uid).set(userData);
      }

      // Devuelve true si fue exitoso, con un mensaje
      return { success: true, message: "Usuario registrado con éxito" };

    } catch (error: any) {
      // Manejo de errores basado en el código de Firebase
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

      // Devuelve false si hubo un error, junto con el mensaje de error
      return { success: false, message: errorMessage };
    }
  }
}
