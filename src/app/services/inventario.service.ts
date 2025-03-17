import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private xmlUrl = 'assets/productos.xml'; // Ruta al XML en tu proyecto
  private apiUrl = 'http://localhost:3000/api/productos'; // Ruta al API backend

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<string> {
    return this.http.get(this.xmlUrl, { responseType: 'text' });
  }

  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  editarProducto(producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar/${producto.id}`, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`);
  }

  guardarProductosXML(xmlString: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardar-xml`, { xml: xmlString }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
