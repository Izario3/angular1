import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiURL='http://localhost:3000/api/productos';

  constructor(private http: HttpClient){}
    obtenerProductos(){
      return this.http.get(this.apiURL);
    }
  /*private xmlUrl = 'assets/productos.xml';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const productos = Array.from(xmlDoc.getElementsByTagName('producto')).map(prod=>({
          id: prod.getElementsByTagName('id')[0].textContent,
          nombre: prod.getElementsByTagName('nombre')[0].textContent,
          precio:prod.getElementsByTagName('precio')[0].textContent,
          imagen:prod.getElementsByTagName('imagen')[0].textContent,
          cantidad:prod.getElementsByTagName('cantidad')[0].textContent,
          descripcion:prod.getElementsByTagName('descripcion')[0].textContent
          }));
        return productos;
      })
    );
  }*/
}