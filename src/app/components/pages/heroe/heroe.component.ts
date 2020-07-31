import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeroModel } from '../../../models/heroe.model';
import { HeroesService } from '../../../services/heroes.service';

import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  form: FormGroup;
  flagVivo = true;
  heroe = new HeroModel();

  constructor(private formBuilder: FormBuilder, private heroesService: HeroesService) {
    this.crearFormulario();
  }

  ngOnInit(): void {
  }

  crearFormulario(){
    this.form = this.formBuilder.group({
      id: '',
      nombre: ['', [ Validators.required ]],
      poder: [''],
      vivo: [true]
    });
  }

  changes(input: string){
    if (input === 'vivo'){
      this.flagVivo = !this.form.get(input).value;
      this.form.get(input).setValue(!this.form.get(input).value);
    }
  }

  guardar(){

    if (this.form.invalid) { return; }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.form.get('id').value){
      peticion = this.heroesService.actualizarHeroe(this.form.value);
    } else{
      peticion = this.heroesService.crearHeroe(this.form.value);
    }

    peticion.subscribe(resp => {

      this.form.setValue(resp);

      Swal.fire({
        title: resp.nombre,
        text: 'Se acxtualizó correctamente',
        icon: 'success'
      });

    });
  }

}
