import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';
import { error } from 'util';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private CARPETA_IMAGENES = 'img';

  constructor(private db: AngularFirestore) { }

  cargarImagenesFirebase (imagenes: FileItem[]){
    console.log(imagenes);
    // Create a root reference
    var storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.uploading = true;
      if (item.progress >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask =
                        storageRef.child(`${this.CARPETA_IMAGENES}/${item.fileName}`) //Hace referencia a donde lo vas a colocar
                                  .put(item.file); //Añadir el archivo

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100, //funcion de callback
        (error) => console.log('Error al subir', error),
        async () => {
          console.log('Imagen cargada correctamente');
          item.url = await uploadTask.snapshot.ref.getDownloadURL(); // Solucion para enviar a la base de datos
          item.uploading = false;
          this.guardarImagen({
            nombre: item.fileName,
            url: item.url
          });
        });
    }

  }

  private guardarImagen(imagen: { nombre: string, url: string }) {
    return new Promise<any>((resolve, reject) => {
      this.db.collection(`/${this.CARPETA_IMAGENES}`) //Especificar donde quieres guardar las imagenes (en que carpeta)
        .add(imagen).then(res => {
          console.log('Respuesta: ', res);
          resolve(res);
        }, err => reject(err));
    });
  }
}
