import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//uso de Nominatim (OpenStreetMap), API de Geocodificacion grauita, no requiere una clave API pero como usuario gratis admite solo 1 solicitud por segundo
export class GeocodingService {
  private geocodingUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) {}

  getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    const url = `${this.geocodingUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    return this.http.get<any>(url).toPromise().then(response => {
      if (response && response.display_name) {
        return response.display_name; // dirección legible
      } else {
        throw new Error('No se encontró una dirección para estas coordenadas.');
      }
    }).catch(error => {
      console.error('Error al obtener la dirección:', error);
      throw new Error('No se pudo obtener la dirección.');
    });
  }
}