import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManager } from 'src/app/managers/SessionManager';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private sessionManager: SessionManager, private toastController: ToastController) { }

  
    email: string = '';
    password: string = '';

  ngOnInit() {
  }
  
  async onLoginButtonPressed() {
    if (this.sessionManager.performLogin(this.email, this.password)) {
      // Mostrar el mensaje de éxito usando Toast
      const toast = await this.toastController.create({
        message: '¡Ingreso Exitoso!',
        duration: 2000,  // Duración de 2 segundos
        color: 'success',  // Color de éxito (verde)
        position: 'top'    // Posición en la parte superior
      });
      toast.present();
      this.router.navigate(['/inicio'])
    } else {
      this.email=''
      this.password=''
      alert('Las credenciales ingresadas son inválidas.')
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register'])
  }

}
