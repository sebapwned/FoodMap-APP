import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StorageService } from '../managers/StorageService';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EmailAuthProvider } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class UserUpdateUseCase {

  constructor(
    private firestore: AngularFirestore,
    private storageService: StorageService,
    private fireAuth: AngularFireAuth
  ) { }

  async performUserUpdate(newEmail: string, newNombre: string, newApellido: string, newDireccion: string): Promise<{ success: boolean; message: string }> {
    try {
      // bbtener el usuario actual desde Ionic Storage
      const currentUser = await this.storageService.get('user');

      if (!currentUser) {
        return { success: false, message: 'No hay usuario guardado' };
      }

      const uid = currentUser.uid;

      // si hay un nuevo dato, actualiza en Firestore
      if (newEmail || newNombre || newApellido || newDireccion) {
        await this.firestore.collection('users').doc(uid).update({
          email: newEmail,
          nombre: newNombre,
          apellido: newApellido,
          direccion: newDireccion
        });

        // actualizar el usuario en StorageService
        const updatedUserData = {
          uid: uid,
          email: newEmail,
          nombre: newNombre,
          apellido: newApellido,
          direccion: newDireccion
        };

        // actualizacion del usuario en el storageservice
        await this.storageService.set('user', updatedUserData);

        return { success: true, message: 'Usuario actializado con éxito' };
      } else {
        return { success: false, message: 'No se pudo actualizar el usuario' };
      }

    } catch (error: any) {
      return { success: false, message: `Error updating user: ${error.message}` };
    }
  }
    
  async performPasswordUpdate(currentPassword: string, newPassword: string, newRePassword: string): Promise<{ success: boolean; message: string }> {
    try {
        // verificar si hay un usuario autenticado
        const user = await this.fireAuth.currentUser;
        if (!user) {
            return { success: false, message: 'No hay un usuario autenticado' };
        }

        // re autenticacion del usuario (este es un paso obligatorio de fire base authentication para no tener que deslogear al usuario)
        const credential = EmailAuthProvider.credential(user.email as string, currentPassword);
        await user.reauthenticateWithCredential(credential);

        // verificar que las contraseñas nuevas coincidan
        if (newPassword !== newRePassword) {
            return { success: false, message: 'Las contraseñas no coinciden' };
        }

        // si todo lo anterior fue exitoso se actualiza la contraseña
        await user.updatePassword(newPassword);
        
        return { success: true, message: 'Contraseña actualizada con éxito' };
    } catch (error: any) {
        return { success: false, message: `Error al actualizar la contraseña: ${error.message}` };
    }
    }
    async performDeleteAccount(uid: string): Promise<{ success: boolean; message: string }> {
        try {
            await this.firestore.collection('users').doc(uid).delete();
            // Sign out from Firebase
            await this.fireAuth.signOut();

            // Clear all data from Ionic Storage
            await this.storageService.clear();

      return { success: true, message: 'Usuario eliminado con éxito' };
    } catch (error: any) {
      return { success: false, message: `Error al eliminar el usuario: ${error.message}` };
    }
}

}   