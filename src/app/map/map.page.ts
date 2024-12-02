import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

interface Restaurant {
  name: string;
  description: string;
  img: string;
  url: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  locations: Restaurant[] = [];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit() {
    this.locations = this.restaurantService.getLocations();
  }

  goBack() {
    this.navCtrl.back();
  }

  openMap(url: string) {
    window.open(url, '_blank');
  }

  onHomeButtonPressed() {
    this.router.navigate(['/inicio']);
  }

  onProfileButtonPressed() {
    this.router.navigate(['/profile']);
  }

  onMapButtonPressed() {
  }
}
