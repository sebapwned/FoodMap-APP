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
        duration: 1000,  
        color: 'success',  
        position: 'top'    
      });
      toast.present();
      this.router.navigate(['/inicio'], { queryParams: { user: this.email } });
    } else {

      // Mostrar el mensaje de error usando Toast
      const errorToast = await this.toastController.create({
        message: 'Las credenciales ingresadas son inválidas.',
        duration: 2000,  
        color: 'danger',  
        position: 'top'   
      });
      errorToast.present();
      
      this.email = '';
      this.password = '';
    }
  }

  onRegisterButtonPressed() {
    this.router.navigate(['/register'])
  }

}
