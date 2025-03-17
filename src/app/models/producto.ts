export class Producto{
  constructor(
      public id: number,
      public nombre:string,
      public precio:number,
      public imagen:string,
      public descripcion:string,
      public cantidad:number
  ){}
}