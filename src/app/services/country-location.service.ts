import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryLocationService {
  constructor(private http: HttpClient) { }

  // Get country via coordinates (reverse geocoding)
  getCountryFromCoords(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`;
    return this.http.get<any>(url);
  }

  // Get country via IP
  getCountryFromIP() {
    const url = 'https://ipapi.co/json/?lang=en'; // or use ipinfo.io, ipwhois.io
    return this.http.get<any>(url);
  }

  async getUserCountry(): Promise<{ country: string; city: string }> {
    try {
      if (navigator.geolocation) {
        return new Promise<{ country: string; city: string }>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;

              // const lon = -95.7129; // USA (USD)
              // const lat = 37.0902;  // USA (USD)

              // const lon = -3.4360;  // UK (GBP)
              // const lat = 55.3781;  // UK (GBP)

              // const lon = 2.3522;   // France/Europe (EUR)
              // const lat = 48.8566;  // France/Europe (EUR)

              // const lon = -75.6972; // Canada (CAD)
              // const lat = 45.4215;  // Canada (CAD)

              // const lon = 149.1300; // Australia (AUD)
              // const lat = -35.2809; // Australia (AUD)

              // const lon = 13.4050;  // Germany (EUR)
              // const lat = 52.5200;  // Germany (EUR)

              // const lon = 103.8198; // Singapore (SGD)
              // const lat = 1.3521;   // Singapore (SGD)

              // const lon = 139.6917; // Japan (JPY)
              // const lat = 35.6895;  // Japan (JPY)

              // const lon = 116.4074; // China (CNY)
              // const lat = 39.9042;  // China (CNY)

              // const lon = 54.3773;  // UAE (AED)
              // const lat = 24.4539;  // UAE (AED)

              // const lon = -47.9218; // Brazil (BRL)
              // const lat = -15.8267; // Brazil (BRL)

              // const lon = 77.2090;  // India (INR)
              // const lat = 28.6139;  // India (INR)

              // const lon = 37.6173;  // Russia (RUB)
              // const lat = 55.7558;  // Russia (RUB)

              // const lon = 28.2293;  // South Africa (ZAR)
              // const lat = -25.7479; // South Africa (ZAR)

              try {
                const data = await firstValueFrom(this.getCountryFromCoords(lat, lon));
                resolve({
                  country: data.address?.country || 'Unknown',
                  city: data.address?.city || data.address?.town || data.address?.village || 'Unknown'
                });
              } catch {
                try {
                  const ipData = await firstValueFrom(this.getCountryFromIP());
                  resolve({
                    country: ipData.country_name || 'Unknown',
                    city: ipData.city || 'Unknown'
                  });
                } catch {
                  resolve({ 
                    country: 'Unknown', 
                    city: 'Unknown' 
                  });
                }
              }
            },
            async () => {
              try {
                const ipData = await firstValueFrom(this.getCountryFromIP());
                resolve({
                  country: ipData.country_name || 'Unknown',
                  city: ipData.city || 'Unknown'
                });
              } catch {
                resolve({ 
                  country: 'Unknown', 
                  city: 'Unknown' 
                });

              }
            }
          );
        });
      } else {
        const ipData = await firstValueFrom(this.getCountryFromIP());
        return {
          country: ipData.country_name || 'Unknown',
          city: ipData.city || 'Unknown'
        };
      }
    } catch {
      return { country: 'Unknown', city: 'Unknown' };
    }
  }
}
