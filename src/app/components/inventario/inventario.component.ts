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

    this.productos.push(nuevoProducto);
    this.generarXML(); // Generar el XML y permitir su descarga
  }

  editarProducto(producto: Producto) {
    this.productoEditando = { ...producto };
  }

  guardarEdicion() {
    if (this.productoEditando) {
      const index = this.productos.findIndex(p => p.id === this.productoEditando?.id);
      if (index !== -1) {
        this.productos[index] = this.productoEditando;
      }
      this.generarXML(); // Generar el XML y permitir su descarga
      this.productoEditando = null;
    }
  }

  eliminarProducto(id: number) {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
    }
    this.generarXML(); // Generar el XML y permitir su descarga
  }

  // Generar XML y permitir su descarga
  generarXML() {
    const xmlProductos = this.productos.map(prod => {
      return `
        <producto>
          <id>${prod.id}</id>
          <nombre>${prod.nombre}</nombre>
          <precio>${prod.precio}</precio>
          <imagen>${prod.imagen}</imagen>
          <descripcion>${prod.descripcion}</descripcion>
        </producto>`;
    }).join('');

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <productos>
      ${xmlProductos}
    </productos>`;

    // Crear un Blob con el contenido del XML
    const blob = new Blob([xmlString], { type: 'application/xml' });

    // Crear un enlace para descargar el archivo
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'productos.xml'; // Nombre del archivo a descargar
    enlace.click(); // Hacer clic en el enlace para iniciar la descarga
  }
}
