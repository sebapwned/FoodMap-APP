import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

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
  direccionURL: string = '';
  horarioAtencion: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }

  async onAddRestaurantButtonPressed() {
    const newRestaurant = {
      name: this.nombreRestaurant,
      description: this.tipoComida,
      img: this.userPhotoURL,
      address: this.direccion,
      url: this.direccionURL
    };

    this.restaurantService.addRestaurant(newRestaurant);

    this.router.navigate(['/map']);
  }

  clean() {
    this.nombreRestaurant = '';
    this.tipoComida = '';
    this.direccion = '';
    this.direccionURL = '';
    this.horarioAtencion = '';
    this.userPhotoURL = '/assets/images-restaurant/restaurantDefault.jpg';
  }

  onRestaurantImagePressed() {
    console.log('Imagen del restaurante presionada');
  }
}