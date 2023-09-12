import { HttpClient } from '@angular/common/http';
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
  newMap!: any;
  placesList: Array<any> = [];
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // console.log('load GPS');
  }

  async doSearch(event: any){
    let query: string = event.detail.value;
    try {
      let response: any = await this.searchPlace(query);
      if(response) {
        this.placesList = response.results;
        console.log(this.placesList);
      }
    } catch(error: any){
      console.log(error.message);
    }

  }

  searchPlace(query_: string){
    let searchQuery: string = encodeURI(query_);
    let url: string = 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+ this.coords.latitude +'%2C'+ this.coords.longitude +'&query=' + searchQuery + '&radius=10&key=AIzaSyDPWB4YRsUM0fcoW5bKSXeAfr8fl1NkQ-k';

    return new Promise((resolve, reject) => {
      this.httpClient.get(url)
      .subscribe({
        next: (response: any) => { resolve(response) },
        error: (error: any) => { reject(error) }
      })
    })
  }

  ionViewWillEnter(){
    this.getCoords();

    // this.createMap();

    // console.log('load Map');
  }

  async createMap(){
    this.newMap = await GoogleMap.create({
      id: 'my-map',
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

    await this.setMarker(this.coords);
    // console.log(this.coords);
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
        this.createMap();
        this.setMarker(this.coords);
        // this.coords = coordinates.
      }
    } catch(error: any) {
      console.log('Error => ', error.message);
    }
  }


}
