import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  cantidad: number;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productoEditando: Producto | null = null;

  ngOnInit(): void {
    this.cargarInventarioInicial();
  }
  constructor(private router: Router) {} // Inyectar el router correctamente

  irAProductos() {
    this.router.navigate(['/producto']); // Asegúrate de que '/productos' es una ruta válida
  }

cargarInventarioInicial() {
  fetch('assets/productos.xml') // Ruta corregida
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      console.log('XML Cargado:', data); // Para depuración
      this.procesarXML(data);
    })
    .catch(error => console.error('Error cargando el XML inicial:', error));
}

  importarXML(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e: any) => {
      const xmlString = e.target.result;
      this.procesarXML(xmlString);
    };
    lector.readAsText(archivo);
  }

  procesarXML(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    this.productos = Array.from(xmlDoc.getElementsByTagName('producto')).map(prod => ({
      id: Number(prod.getElementsByTagName('id')[0].textContent),
      nombre: prod.getElementsByTagName('nombre')[0].textContent || '',
      precio: Number(prod.getElementsByTagName('precio')[0].textContent),
      imagen: prod.getElementsByTagName('imagen')[0]?.textContent || '',
      descripcion: prod.getElementsByTagName('descripcion')[0]?.textContent || '',
      cantidad: Number(prod.getElementsByTagName('cantidad')[0]?.textContent || '0')
    }));
  }

  agregarProducto(nombre: string, precio: string, imagen: string, descripcion: string, cantidad: string) {
    const nuevoProducto: Producto = {
      id: this.productos.length + 1,
      nombre,
      precio: parseFloat(precio),
      imagen,
      descripcion,
      cantidad: parseInt(cantidad)
    };

    this.productos.push(nuevoProducto);
    this.generarXML();
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
      this.generarXML();
      this.productoEditando = null;
    }
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.generarXML();
  }

  generarXML() {
    const xmlProductos = this.productos.map(prod => `
      <producto>
        <id>${prod.id}</id>
        <nombre>${prod.nombre}</nombre>
        <precio>${prod.precio}</precio>
        <imagen>${prod.imagen}</imagen>
        <descripcion>${prod.descripcion}</descripcion>
        <cantidad>${prod.cantidad}</cantidad>
      </producto>`).join('');

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
    <productos>
      ${xmlProductos}
    </productos>`;

    const blob = new Blob([xmlString], { type: 'application/xml' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'productos.xml';
    enlace.click();
  }
}
