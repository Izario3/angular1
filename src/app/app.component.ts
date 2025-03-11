import { Component } from '@angular/core';
import { ProductoComponent } from './components/producto/producto.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: 
`<router-outlet></router-outlet>`

})
export class AppComponent {
  title = 'mi-proyecto';
}
