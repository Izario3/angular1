import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar el Router
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: any = [];

  constructor(public carritoService: CarritoService, private router: Router) { }

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
  }

  irAlCarrito() {
    this.router.navigate(['/']); // Regresa a la página de productos
  }

  descargarXML() {
    this.carritoService.descargarXML();
  }
}
