import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public coords: any = { lat: '', long: '' };
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  constructor() { }

  ngOnInit() {
    this.getCoords();
    console.log('load GPS');
  }

  ionViewWillEnter(){
    this.createMap();
    console.log('load Map');
  }

  async createMap(){
    this.newMap = await GoogleMap.create({
      id: 'map',
      element: this.mapRef.nativeElement,
      apiKey: environment.apiKey,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 15,
      },
    });
    console.log(this.coords);
  }

  async setMarker(coords: any){
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: coords.latitude,
        lng: coords.longitude
      }
    });

    await this.newMap.setCamera({
      coordinate: {
        lat: coords.latitude,
        lng: coords.longitude
      }
    });
  }

  async getCoords(){
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      if(coordinates){
        console.log(coordinates);
        this.coords = coordinates.coords;
        this.setMarker(this.coords);
        // this.coords = coordinates.
      }
    } catch(error: any) {
      console.log('Error => ', error.message);
    }
  }


}
