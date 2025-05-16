// import { Injectable, NgZone } from "@angular/core"
// import { MapsAPILoader } from "@angular/cdk/"

// declare var google: any

// @Injectable({
//   providedIn: "root",
// })
// export class GoogleMapsService {
//   private apiLoaded = false
//   private apiKey = "YOUR_GOOGLE_MAPS_API_KEY" // Replace with your actual API key

//   constructor(
//     private ngZone: NgZone,
//     private mapsAPILoader: MapsAPILoader,
//   ) {}

//   loadGoogleMapsApi(): Promise<void> {
//     if (this.apiLoaded) {
//       return Promise.resolve()
//     }

//     return new Promise((resolve, reject) => {
//       const script = document.createElement("script")
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`
//       script.async = true
//       script.defer = true
//       script.onload = () => {
//         this.apiLoaded = true
//         resolve()
//       }
//       script.onerror = (error) => {
//         reject(error)
//       }
//       document.head.appendChild(script)
//     })
//   }

//   // If you want to use actual Google Maps, you can add this method to your component
//   initMap(elementId: string, lat: number, lng: number): void {
//     this.mapsAPILoader.load().then(() => {
//       const mapOptions = {
//         center: { lat, lng },
//         zoom: 15,
//         styles: [
//           // Dark theme map styles
//           { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
//           { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
//           { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
//           // Add more styles as needed
//         ],
//       }

//       const map = new google.maps.Map(document.getElementById(elementId) as HTMLElement, mapOptions)

//       new google.maps.Marker({
//         position: { lat, lng },
//         map,
//         title: "Office Location",
//       })
//     })
//   }
// }
