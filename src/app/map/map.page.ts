import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  user: string = '';

  constructor(private navCtrl: NavController, private route: ActivatedRoute,  private router: Router) { }

  ngOnInit() {
  

  }

  goBack() {
    this.navCtrl.navigateBack('/inicio');
  }

 
  onUserButtonPressed() {
    this.router.navigate(['/login'])
  }

  onHomeButtonPressed() {
    this.router.navigate(['/inicio'])
  }
  
}
