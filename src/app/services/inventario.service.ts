import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private xmlUrl = 'assets/productos.xml'; 

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<string> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }); // Importante: responseType debe ser 'text'
  }

  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post('/api/agregar-producto', producto);
  }

  editarProducto(producto: Producto): Observable<any> {
    return this.http.put('/api/editar-producto', producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`/api/eliminar-producto/${id}`);
  }
}
