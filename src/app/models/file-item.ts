export class FileItem {

    public file: File; //File es una propiedad que ya trae typescript por defecto
    public fileName: string;
    public url: string;
    public uploading: boolean;
    public progress: number;

    constructor(file:File){
        this.file = file;
        this.fileName = file.name;
        
        this.uploading = false;
        this.progress = 0;
    }


}