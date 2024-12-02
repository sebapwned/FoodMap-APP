import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  
  locations = [
    {
      name: 'La Perla del Pacífico',
      description: 'Sabor, tradición y calidez familiar a orillas del mar.',
      img: 'assets/images-map/Perla-Pacifico.png',
      url: 'https://maps.app.goo.gl/eUnCYGcNTxWJPu1w7',
    },
    {
      name: 'La Casa del Mono',
      description: 'Un rincón junto al mar para saborear lo mejor de la costa y crear momentos inolvidables.',
      img: 'assets/images-map/Casa-Mono.png',
      url: 'https://maps.app.goo.gl/ppBiKt4JL2RVAysF7',
    }
  ];

  constructor() { }

  addRestaurant(restaurant: any) {
    this.locations.push(restaurant);
  }
  
  getLocations() {
    return this.locations;
  }
}
