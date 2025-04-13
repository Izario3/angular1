import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = []; // Lista de productos
  productoEditando: Producto | null = null; // Producto que se está editando
  imagenUrl: string = ''; // Variable para almacenar la URL de la imagen

  agregar = false; // Para mostrar u ocultar el formulario de agregar
  modificar = false; // Para mostrar u ocultar el formulario de modificar

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(
      productos => {
       // this.productos = productos;
      },
      error => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  volver() {
    this.router.navigate(['']);
  }

  agregarFormulario() {
    this.agregar = !this.agregar;
    this.modificar = false;
  }

  modificarFormulario() {
    this.modificar = !this.modificar;
    this.agregar = false;
  }

  agregarProducto(nombre: string, precio: number, cantidad: number, imagenUrl: string, descripcion: string) {
    const nuevoProducto: Producto = {
      id: this.productos.length + 1,
      nombre,
      precio,
      cantidad,
      imagen: imagenUrl, // Asignar URL de imagen
      descripcion
    };

    this.productos.push(nuevoProducto);
    this.generarXML();
  }

  modificarProducto(nombre: string, precio: number, cantidad: number, imagenUrl: string, descripcion:string) {
    if (this.productoEditando) {
      this.productoEditando.nombre = nombre;
      this.productoEditando.precio = precio;
      this.productoEditando.cantidad = cantidad;
      this.productoEditando.imagen = imagenUrl;
      this.productoEditando.descripcion = descripcion;
      const index = this.productos.findIndex(p => p.id === this.productoEditando!.id);
      if (index !== -1) {
        this.productos[index] = { ...this.productoEditando };
      }

      this.productoEditando = null;
      this.modificar = false; // Cerrar el formulario de modificación
      this.generarXML();
    }
  }

  generarXML() {
    const xmlProductos = this.productos.map(prod => {
      return `
        <producto>
          <id>${prod.id}</id>
          <nombre>${prod.nombre}</nombre>
          <precio>${prod.precio}</precio>
          <cantidad>${prod.cantidad}</cantidad>
          <imagen>${prod.imagen}</imagen>
          <descripcion>${prod.descripcion || ""}</descripcion>
        </producto>`;
    }).join('');

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <productos>
      ${xmlProductos}
    </productos>`;

    this.http.post('http://localhost:3000/guardar-xml', { xml: xmlString })
      .subscribe(
        response => console.log("✅ XML guardado correctamente:", response),
        error => console.error("❌ Error al guardar XML:", error)
      );
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.generarXML();
  }

  editarProducto(id: number, nombre: string, precio: number, cantidad: number, imagen: string, descripcion: string) {
    this.productoEditando = { id, nombre, precio, cantidad, imagen, descripcion };
    this.modificar = true; // Mostrar el formulario de modificar
  }
}
