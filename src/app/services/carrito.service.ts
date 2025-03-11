import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito:Producto[]=[];
  agregarProducto(producto:Producto){
    this.carrito.push(producto);
  }
  obtenerCarrito():Producto[]{
    return this.carrito;
  }
  generarXML(): string {
    const fechaActual = new Date().toISOString().split('T')[0];
    const folio = Date.now(); 

    const productosAgrupados: { [id: string]: { nombre: string, cantidad: number, precio: number } } = {};

    this.carrito.forEach((producto) => {
        if (productosAgrupados[producto.id]) {
            productosAgrupados[producto.id].cantidad++;
        } else {
            productosAgrupados[producto.id] = { 
                nombre: producto.nombre, 
                cantidad: 1, 
                precio: producto.precio 
            };
        }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<factura>\n`;
    xml += `<info>\n`;
    xml += `    <folio>${folio}</folio>\n`;
    xml += `    <fecha>${fechaActual}</fecha>\n`;
    xml += `    <cliente>\n`;
    xml += `        <nombre>José</nombre>\n`;
    xml += `        <email>jose.bece.r2@gmail.com</email>\n`;
    xml += `    </cliente>\n`;
    xml += `</info>\n`;
    xml += `<productos>\n`;

    let subtotal = 0;

    for (const id in productosAgrupados) {
        const producto = productosAgrupados[id];
        const totalProducto = producto.precio * producto.cantidad;
        subtotal += totalProducto;

        xml += `    <producto>\n`;
        xml += `        <id>${id}</id>\n`;
        xml += `        <descripcion>${producto.nombre}</descripcion>\n`;
        xml += `        <cantidad>${producto.cantidad}</cantidad>\n`;
        xml += `        <preciounitario>$${producto.precio}</preciounitario>\n`;
        xml += `        <subtotal>$${totalProducto}</subtotal>\n`;
        xml += `    </producto>\n`;
    }

    const iva = Number((subtotal * 0.16).toFixed(2));
    const total = subtotal + iva;

    xml += `</productos>\n`;
    xml += `<totales>\n`;
    xml += `    <subtotal>$${subtotal.toFixed(2)}</subtotal>\n`;
    xml += `    <impuestos>\n`;
    xml += `        <iva>$${iva.toFixed(2)}</iva>\n`;
    xml += `    </impuestos>\n`;
    xml += `    <total>$${total.toFixed(2)}</total>\n`; // Se agrega el total final
    xml += `</totales>\n`;
    xml += `</factura>`;

    return xml;
}


  descargarXML(){
    const blob = new Blob([this.generarXML()], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura ${new Date().toISOString().split('T')[0]}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  eliminarProducto(producto: Producto){
    const index = this.carrito.findIndex(p => p.id === producto.id);

  if (index !== -1) {
    this.carrito.splice(index, 1); // Elimina el producto del carrito
  }
  }
  constructor() { }
}