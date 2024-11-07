import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { StorageService } from '../managers/StorageService';
import { AngularFirestore } from '@angular/fire/compat/firestore';


//  interfaz UserData para describir los atributos del documento ya que no me entrega un valor como string email para llevarla a ionic storage si no la defino aca
interface UserData {
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserLoginUseCase {

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storageService: StorageService
  ) {}

  async performLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // Autenticar el usuario utilizando Firebase Authentication
      const userCredential = await this.fireAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        const uid = user.uid;
      
        // Obtener la referencia del usuario en Firestore
        const userRef = this.firestore.collection('users').doc(uid);
      
        // Obtener el documento del usuario desde Firestore
        const userDataSnapshot = await userRef.get().toPromise();
        if (userDataSnapshot?.exists) {
          // Especificar el tipo UserData al obtener los datos
          const userData = userDataSnapshot.data() as UserData;

          // Guardar los datos obtenidos de Firestore en Ionic Storage
          await this.storageService.set('user', {
            uid: uid,
            email: userData?.email || '',  // Si email es nulo, guarda un string vacío
            password: userData?.password || '',
            nombre: userData?.nombre  || '',
            apellido: userData?.apellido || '',
            direccion: userData?.direccion || ''
          });

          return { success: true, message: "Login successful" };
        } else {
          return { success: false, message: "Invalid User" };
        }

      } else {
        return { success: false, message: "Authentication failed, user not found" };
      }
    } catch (error: any) {
      let errorMessage = 'Error during login';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'User not found. Please check your credentials.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        default:
          errorMessage += ': ' + error.message;
          break;
      }

      return { success: false, message: errorMessage };
    }
  }
}
