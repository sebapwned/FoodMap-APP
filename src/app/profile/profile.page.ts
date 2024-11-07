import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserUpdateUseCase } from '../use-cases/user-update.use-case';
import { StorageService } from '../managers/StorageService';
import { CancelAlertService } from '../managers/CancelAlertService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {

  user: any;
  userEmail: string = '';
  userNombre: string = '';
  userApellido: string = '';
  userDireccion: string = '';


  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private userUpdateUseCase: UserUpdateUseCase,
    private storageService: StorageService,
    private alert: CancelAlertService

  ) { }

  async ionViewWillEnter() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    } else {
      console.log('Usuario encontrado:', this.user); // verifica los datos obtenidos
      this.userEmail = this.user.email || 'Correo no disponible';
      this.userNombre = this.user.nombre || 'Nombre no disponible';
      this.userApellido = this.user.apellido || 'Apellido no disponible';
      this.userDireccion = this.user.direccion || 'Dirección no disponible';
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
  onChangePasswordButtonPressed() {
    this.router.navigate(['/password-update'])
  }
  async onUpdateButtonPressed() {
    const result = await this.userUpdateUseCase.performUserUpdate(this.userEmail, this.userNombre, this.userApellido, this.userDireccion);

    if (result.success) {
      this.alert.showAlert(
        'Actualización Exitosa',
        'Tu perfil ha sido actualizado correctamente.',
        () => { }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => { }
      );
    }
  }

  async onDeleteAccountButtonPressed() {
    // obtener el user logeado del storageservice
    this.user = await this.storageService.get('user');
    // verificar que haya user y uid
    if (this.user && this.user.uid) {
    // extraer el uid del usuario
      const uid = this.user.uid; 
    // enviar el uid al caso de uso de delete account  
      const result = await this.userUpdateUseCase.performDeleteAccount(uid);

      if (result.success) {
        this.alert.showAlert(
          'Eliminación Exitosa',
          'Tu cuenta ha sido eliminada correctamente.',
          () => {
            this.router.navigate(['/login']); 
          }
        );
      } else {
        this.alert.showAlert(
          'Error',
          result.message,
          () => { }
        );
      }
    } else {
      this.alert.showAlert(
        'Error',
        'No se pudo obtener la información del usuario.',
        () => { }
      );
    }
  }
}