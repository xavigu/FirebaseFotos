import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseOver.emit(true);
    this._prevenirDetener(event); //Previene que se abra la imagen al arrastrarla donde quieres dropear las imagenes
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseOver.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {

    const transferencia = this._getTransferencia(event);

    if (!transferencia) {
      return;
    }

    this._extraerArchivos(transferencia.files);

    this._prevenirDetener(event); //Previene que se abra la imagen al arrastrarla donde quieres dropear las imagenes
    this.mouseOver.emit(false);

  }

  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList) {

    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) { //Metodo de Object que coge los elementos de un objeto y los pasa a array

      const archivoTemporal = archivosLista[propiedad];

      if (this._archivoPuedeSerCargado(archivoTemporal)) {

        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);

      }
    }
    console.log(this.archivos);
  }


  // Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {

    if (!this._archivoYaFueDroppeado(archivo.name) && this._esImagen(archivo.type)) { //Si el archivo es dropeado y es imagen devuelve true
      return true;
    } else {
      return false;
    }

  }


  private _prevenirDetener(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  private _archivoYaFueDroppeado(fileName: string): boolean {

    for (const archivo of this.archivos) {

      if (archivo.fileName === fileName) {
        console.log('El archivo ' + fileName + ' ya esta agregado');
        return true;
      }

    }

    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image'); //Si no tengo el tipo del archivo o esta vacio devuelve false
  }


}
