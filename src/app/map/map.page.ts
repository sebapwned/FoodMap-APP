import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
/// <reference types="@types/google.maps" />

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map!: google.maps.Map;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions = {
      center: { lat: -33.0336352, lng: -71.5344662 },
      zoom: 12,
    };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
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
}