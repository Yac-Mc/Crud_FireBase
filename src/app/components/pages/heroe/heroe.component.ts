import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HeroeModel } from '../../../models/heroe.model';
import { HeroesService } from '../../../services/heroes.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  form: FormGroup;
  flagVivo = true;
  heroe = new HeroeModel();

  constructor(private formBuilder: FormBuilder, private heroesService: HeroesService, private route: ActivatedRoute) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo'){

      this.heroesService.getHeroe(id).subscribe((resp: HeroeModel) => {
        this.flagVivo = resp.vivo;
        this.form.get('id').setValue(id);
        this.form.get('nombre').setValue(resp.nombre);
        this.form.get('poder').setValue(resp.poder);
        this.form.get('vivo').setValue(resp.vivo);
      });
    }

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

      Swal.fire({
        title: resp.nombre,
        text: 'Se acxtualizó correctamente',
        icon: 'success'
      });

      if (this.form.get('id').value){

        this.form.get('nombre').setValue(resp.nombre);
        this.form.get('poder').setValue(resp.poder);
        this.form.get('vivo').setValue(resp.vivo);

      } else {
        this.form.setValue(resp);
      }

    });
  }

}
