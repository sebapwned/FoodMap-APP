import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, DatabaseReference } from 'firebase/database';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  restaurants: any[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private toastController: ToastController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    try {
      // Realizamos una consulta a Firestore para obtener todos los restaurantes
      this.firestore.collection('restaurants').valueChanges({ idField: 'id' }).subscribe(
        (data) => {
          if (data.length > 0) {
            this.restaurants = data;
            console.log('Datos obtenidos desde Firestore:', data);
          } else {
            this.restaurants = [];
            console.warn('No se encontraron restaurantes.');
          }
        },
        (error) => {
          console.error('Error al obtener los restaurantes:', error);
          this.presentToast('Error al cargar los restaurantes. Inténtalo de nuevo más tarde.');
        }
      );
    } catch (error) {
      console.error('Error durante la inicialización de la página:', error);
      this.presentToast('Error de conexión. Verifica tu configuración.');
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  onProfileButtonPressed() {
    this.router.navigate(['/profile']);
  }

  onHomeButtonPressed() {
    this.router.navigate(['/inicio']);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    toast.present();
  }
}