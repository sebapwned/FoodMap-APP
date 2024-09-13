import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  user: string = '';

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    // Obtener el parámetro 'user' de la URL
    this.route.queryParams.subscribe(params => {
      this.user = params['user'] || 'Usuario';
      this.presentWelcomeToast(this.user);  // Muestra el toast cuando cargue la vista
    });  
  }

  goBack() {
    this.navCtrl.navigateBack('/login');
  }

  async presentWelcomeToast(user: string) {
    const toast = await this.toastController.create({
      message: `¡Bienvenido, ${user}!`,
      duration: 2000,  
      color: 'success', 
      position: 'middle',  
    });
    toast.present();
  }

  onUserButtonPressed() {
    this.router.navigate(['/login'])
  }
  onMapButtonPressed() {
    this.router.navigate(['/map'])
  }
}
