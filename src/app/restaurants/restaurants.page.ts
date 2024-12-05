import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestaurantUseCase } from '../use-cases/restaurant.use-case';
import { CancelAlertService } from '../managers/CancelAlertService';
import { ImageService } from '../managers/image-service';
import { ActionSheetController } from '@ionic/angular';
import { UserLoginUseCase } from '../use-cases/user-login.use-case';
import { GeolocationService } from '../managers/geolocation-service';
import { GeocodingService } from '../managers/geocoding-service';


@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {

  uid: string = '';
  userPhotoURL: string = '/assets/images-restaurant/restaurantDefault.jpg';
  nombreRestaurant: string = '';
  tipoComida: string = '';
  direccion: string = '';
  horarioAtencion: string = '';
  valoracion: string = '';
  resena: string = '';

  constructor(
    private restaurantUseCase: RestaurantUseCase,
    private navCtrl: NavController, 
    private router: Router,
    private alert: CancelAlertService,
    private imageService: ImageService,
    private actionSheetController: ActionSheetController,
    private userLoginUseCase: UserLoginUseCase,
    private geolocationService: GeolocationService,
    private geocodingService: GeocodingService
  ) { }

  async ngOnInit() {
    try {
      // recuperar y almacenar el UID al inicializar la página
      this.uid = await this.userLoginUseCase.getUserUid();
      if (!this.uid) {
        console.error('No se pudo recuperar el UID del usuario.');
        this.alert.showAlert(
          'Error',
          'No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.',
          () => {
            this.router.navigate(['/login']); // navegar al login si no se puede recuperar el UID
          }
        );
      } else {
        console.log('UID recuperado:', this.uid);
      }
    } catch (error) {
      console.error('Error durante la inicialización de la página:', error);
      this.alert.showAlert(
        'Error',
        'Hubo un problema al cargar la información del usuario. Por favor, intenta nuevamente.',
        () => {
          this.router.navigate(['/login']);
        }
      );
    }
  }

  async getCurrentLocation() {
    try {
      const coordinates = await this.geolocationService.getCurrentLocation();
      console.log('Coordenadas actuales:', coordinates);
  
      // asa el servicio de geocodificacion Nominatim para obtener la dirección
      this.direccion = await this.geocodingService.getAddressFromCoordinates(
        coordinates.latitude,
        coordinates.longitude
      );
  
      console.log('Dirección obtenida:', this.direccion);
    } catch (error) {
      console.error('Error al obtener la ubicación o dirección:', error);
      alert('No se pudo obtener la ubicación o la dirección. Verifica los permisos.');
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  async onAddRestaurantButtonPressed() {
    // verificar que todos los campos estén llenos
    if (
      !this.nombreRestaurant.trim() ||
      !this.tipoComida.trim() ||
      !this.direccion.trim() ||
      !this.horarioAtencion.trim() ||
      !this.valoracion.trim() ||
      !this.resena.trim()
    ) {
      // mostrar alerta si hay campos vacíos
      this.alert.showAlert(
        'Error',
        'Todos los campos deben estar llenos.',
        () => {
          console.log('El usuario reconoció la alerta de error.');
        }
      );
      return;
    }
  
    // llama al caso de uso para manejar el registro
    const result = await this.restaurantUseCase.performRestaurantRegistration(
      this.uid,
      this.userPhotoURL,
      this.nombreRestaurant,
      this.tipoComida,
      this.direccion,
      this.horarioAtencion,
      this.valoracion,
      this.resena
    );
  
    // si hay un mensaje de éxito, navega a otra vista
    if (result.success) {
      this.alert.showAlert(
        'Éxito',
        'Reseña de restaurante agregada exitosamente.',
        () => {
          this.router.navigate(['/inicio']);
        }
      );
    } else {
      // Muestra el error proporcionado por el caso de uso
      this.alert.showAlert(
        'Error',
        result.message,
        () => {
          console.log('Intentando nuevamente.');
        }
      );
    }
  }

  clean() {
    this.nombreRestaurant = '';
    this.tipoComida = '';
    this.direccion = '';
    this.horarioAtencion = '';
    this.userPhotoURL = '/assets/images-restaurant/restaurantDefault.jpg';
    this.valoracion = '';
    this.resena = '';
  }

    async onRestaurantImagePressed() {
      const actionSheet = await this.actionSheetController.create({
        header: 'Selecciona una opción',
        buttons: [
          {
            text: 'Cámara',
            icon: 'camera',
            handler: async () => {
              const uploadResult = await this.imageService.getImageFromCamera();
              if (uploadResult.success && uploadResult.imageUrl) {
                this.userPhotoURL = uploadResult.imageUrl; // actualiza el enlace de la imagen
              }
            }
          },
          {
            text: 'Imágenes',
            icon: 'image',
            handler: async () => {
              const uploadResult = await this.imageService.getImageFromGallery();
              if (uploadResult.success && uploadResult.imageUrl) {
                this.userPhotoURL = uploadResult.imageUrl; // actualiza el enlace de la imagen
              }
            },
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => { }
          }
        ]
      });
      await actionSheet.present();
    }
  }
  
