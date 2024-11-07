import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }
  
  goBack() {
    this.navCtrl.back();
  }
  onProfileButtonPressed() {
    this.router.navigate(['/profile'])
  }
  onMapButtonPressed() {
    this.router.navigate(['/map'])
  }
  onHomeButtonPressed() {
    this.router.navigate(['/inicio'])
  }
  

}
