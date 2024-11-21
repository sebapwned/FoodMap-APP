import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestaurantUseCase } from '../use-cases/restaurant.use-case';
import { CancelAlertService } from '../managers/CancelAlertService';
import { ImageService } from '../managers/image-service';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {

  userPhotoURL: string = '/assets/images-restaurant/restaurantDefault.jpg';
  nombreRestaurant: string = '';
  tipoComida: string = '';
  direccion: string = '';
  horarioAtencion: string = '';

  constructor(
    private restaurantUseCase: RestaurantUseCase,
    private navCtrl: NavController, 
    private router: Router,
    private alert: CancelAlertService,
    private imageService: ImageService,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
    async onAddRestaurantButtonPressed() {
      // Llama al caso de uso para manejar el registro
      const result = await this.restaurantUseCase.performRestaurantRegistration(this.userPhotoURL,this.nombreRestaurant, this.tipoComida, this.direccion, this.horarioAtencion);
  
      // Si hay un mensaje de éxito, navega a otra vista
      if (result.success) {
        this.alert.showAlert(
          'Agregaste un restaurant exitosamente',
          'Disfruta de Food Map',
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
            this.clean();
          }
        );
      }
    }
  
    clean() {
      this.nombreRestaurant = '';
      this.tipoComida = '';
      this.direccion= '';
      this.horarioAtencion= '';
      this.userPhotoURL= '/assets/images-restaurant/restaurantDefault.jpg' 
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
  
