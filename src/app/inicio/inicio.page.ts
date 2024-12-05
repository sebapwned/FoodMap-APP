import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserLogoutUseCase } from '../use-cases/user-logout.user-case';
import { CancelAlertService } from '../managers/CancelAlertService';
import { StorageService } from '../managers/StorageService';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {
  user: any;
  currentIndex: number = 0;
  promos = [
    { img: 'assets/images-inicio/promo 1 1.png' },
    { img: 'assets/images-inicio/promo 2 1.png' },
    { img: 'assets/images-inicio/promo 3 1.png' },
  ];

  constructor(
    private navCtrl: NavController, 
    private router: Router,
    private logoutUseCase: UserLogoutUseCase,
    private cancelAlertService: CancelAlertService,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    this.user = await this.storageService.get('user');
    if (!this.user) {
      console.log('No se encontraron datos del usuario.');
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  onViewMyReviews() {
    this.router.navigate(['/my-reviews']);
  }

  onAddButton() {
    this.router.navigate(['/restaurants']);
  }

  onProfileButtonPressed() {
    this.router.navigate(['/profile']);
  }

  onMapButtonPressed() {
    this.router.navigate(['/map']);
  }
  
  async onSignOutButtonPressed() {
    this.cancelAlertService.showAlert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      async () => {
        this.logoutUseCase.performLogout();
        this.router.navigate(['/splash']);
      },
      () => { }
    );
  }

  moveCarousel(direction: string) {
    if (direction === 'next') {
      this.currentIndex = (this.currentIndex + 1) % this.promos.length;
    } else if (direction === 'prev') {
      this.currentIndex = (this.currentIndex - 1 + this.promos.length) % this.promos.length;
    }
    
    const carouselWrapper = document.querySelector('.carousel-wrapper') as HTMLElement;
    if (carouselWrapper) {
      carouselWrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
  }
}
