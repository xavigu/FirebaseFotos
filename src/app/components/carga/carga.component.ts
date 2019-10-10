import { Component, OnInit } from '@angular/core';
import { FileItem } from 'src/app/models/file-item';
import { CargaImagenesService } from 'src/app/services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {

  overElement = false; //Variable para comprobar que esta sobre el elemento
  archivos: FileItem[] = []; //Array del modelo FileItem

  constructor(public _cargaImagenes: CargaImagenesService) { }

  ngOnInit() {
  }

  cargarImagenes(){ //Este carga Imagenes va a coger todos los archivos selecionados (variable archivos) y los va a mandar al servicio
    this._cargaImagenes.cargarImagenesFirebase(this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }

  testElement(e){
    console.log(e);
  }

}
