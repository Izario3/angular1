import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productoEditando: Producto | null = null;
  
  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.inventarioService.obtenerProductos().subscribe(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      this.productos = Array.from(xmlDoc.getElementsByTagName('producto')).map(prod => ({
        id: Number(prod.getElementsByTagName('id')[0].textContent),
        nombre: prod.getElementsByTagName('nombre')[0].textContent || '',
        precio: Number(prod.getElementsByTagName('precio')[0].textContent),
        imagen: prod.getElementsByTagName('imagen')[0].textContent || '',
        descripcion: prod.getElementsByTagName('descripcion')[0]?.textContent || ''
      }));
    });
  }
  agregarProducto(nombre: string, precio: string, imagen: string, descripcion: string) {
    // Convertir precio a número
    const precioNumero = parseFloat(precio);
  
    const nuevoProducto: Producto = {
      id: this.productos.length + 1,
      nombre,
      precio: precioNumero,
      imagen,
      descripcion
    };
  
    this.inventarioService.agregarProducto(nuevoProducto).subscribe(() => {
      this.cargarProductos();
    });
  }

  editarProducto(producto: Producto) {
    this.productoEditando = { ...producto };
  }

  guardarEdicion() {
    if (this.productoEditando) {
      this.inventarioService.editarProducto(this.productoEditando).subscribe(() => {
        this.productoEditando = null; // Ahora permitido gracias a Producto | null
        this.cargarProductos();
      });
    }
  }

  eliminarProducto(id: number) {
    this.inventarioService.eliminarProducto(id).subscribe(() => {
      this.cargarProductos();
    });
  }
}
