import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private xmlUrl = 'assets/productos.xml'; // Ruta al XML en tu proyecto
  private apiUrl = 'http://localhost:3000/api/productos'; // Ruta al API que gestionará el XML (deberás tener un backend)

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<string> {
    return this.http.get(this.xmlUrl, { responseType: 'text' });
  }

  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post('/api/agregar-producto', producto); // Este endpoint debe agregar el producto al backend
  }

  editarProducto(producto: Producto): Observable<any> {
    return this.http.put('/api/editar-producto', producto); // Este endpoint debe actualizar el producto en el backend
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`/api/eliminar-producto/${id}`); // Este endpoint debe eliminar el producto del backend
  }

  // Método para guardar el XML actualizado
  guardarProductosXML(xmlString: string): Observable<any> {
    return this.http.post(this.apiUrl, { xml: xmlString }); // Este es el endpoint donde el XML será guardado en el servidor
  }
}
