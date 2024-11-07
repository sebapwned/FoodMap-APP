import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserUpdateUseCase } from '../use-cases/user-update.use-case';
import { StorageService } from '../managers/StorageService';
import { CancelAlertService } from '../managers/CancelAlertService';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.page.html',
  styleUrls: ['./password-update.page.scss'],
})
export class PasswordUpdatePage implements OnInit {

  user: any;
  userPassword: string = '';
  userRePassword: string = '';
  userCurrentPassword: string = '';



  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private userUpdateUseCase: UserUpdateUseCase,
    private storageService: StorageService,
    private alert: CancelAlertService

  ) { }

  async ngOnInit() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    } else {
      console.log('Usuario encontrado:', this.user); // verifica los datos obtenidos
      
      this.userPassword = ''; // deje los campos vacios ya que no se deberian mostrar las contraseñas
      this.userRePassword = ''; 
     
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
  async onPasswordUpdateButtonPressed() {
    const result = await this.userUpdateUseCase.performPasswordUpdate(this.userCurrentPassword, this.userPassword, this.userRePassword);

    if (result.success) {
      this.alert.showAlert(
        'Actualización Exitosa',
        'Tu contraseña ha sido actualizada correctamente.',
        () => {
          this.router.navigate(['/profile']); 
        }
      );
    } else {
      this.alert.showAlert(
        'Error',
        result.message,
        () => { }
      );
    }
  }
}