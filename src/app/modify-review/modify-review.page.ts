import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ImageService } from '../managers/image-service'; 
import { NavController } from '@ionic/angular';
import { CancelAlertService } from '../managers/CancelAlertService';
import { RestaurantUseCase } from '../use-cases/restaurant.use-case';

@Component({
  selector: 'app-modify-review',
  templateUrl: './modify-review.page.html',
  styleUrls: ['./modify-review.page.scss'],
})
export class ModifyReviewPage implements OnInit {
  restaurant: any;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private imageService: ImageService,
    private navCtrl: NavController ,
    private alertService: CancelAlertService,
    private restaurantUseCase: RestaurantUseCase
  ) {
    // obtener los datos pasados por el router
    const navigation = this.router.getCurrentNavigation();
    this.restaurant = navigation?.extras?.state?.['restaurant'];
  }

  ngOnInit() {
    if (!this.restaurant) {
      // di no hay datos, regresa a la vista anterior
      this.router.navigate(['/my-reviews']);
    }
  }
  goBack() {
    this.navCtrl.back();
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
              this.restaurant.userPhotoURL = uploadResult.imageUrl; 
            }
          },
        },
        {
          text: 'Imágenes',
          icon: 'image',
          handler: async () => {
            const uploadResult = await this.imageService.getImageFromGallery();
            if (uploadResult.success && uploadResult.imageUrl) {
              this.restaurant.userPhotoURL = uploadResult.imageUrl; 
            }
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  guardarCambios() {
    // validar que todos los campos estén llenos
    if (
      !this.restaurant.nombreRestaurant ||
      !this.restaurant.direccion ||
      !this.restaurant.horarioAtencion ||
      !this.restaurant.tipoComida ||
      !this.restaurant.valoracion ||
      !this.restaurant.resena
    ) {
      // error si hay alun campo vacio
      this.alertService.showAlert(
        'Error',
        'Todos los campos deben estar llenos.',
        () => {
          console.log('El usuario aceptó la alerta.');
        },
        () => {
          console.log('El usuario canceló la alerta.');
        }
      );
      return;
    }

    // Confirmar y guardar los cambios en Firestore
    this.alertService.showAlert(
      'Confirmar',
      '¿Deseas guardar los cambios realizados?',
      async () => {
        try {
          // Llamar al caso de uso para actualizar el restaurante
          const result = await this.restaurantUseCase.updateRestaurant(
            this.restaurant.id,
            {
              nombreRestaurant: this.restaurant.nombreRestaurant,
              direccion: this.restaurant.direccion,
              horarioAtencion: this.restaurant.horarioAtencion,
              tipoComida: this.restaurant.tipoComida,
              valoracion: this.restaurant.valoracion,
              resena: this.restaurant.resena,
              userPhotoURL: this.restaurant.userPhotoURL,
            }
          );

          if (result.success) {
            console.log('Restaurante actualizado con éxito:', this.restaurant);
            this.router.navigate(['/my-reviews']); 
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          console.error('Error al guardar los cambios en Firestore:', error);
          this.alertService.showAlert(
            'Error',
            'Hubo un problema al guardar los cambios. Por favor, inténtalo nuevamente.',
            () => console.log('El usuario cerró el mensaje de error.')
          );
        }
      },
      () => {
        console.log('El usuario canceló los cambios.');
      }
    );
  }
}