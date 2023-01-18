export class FileUploading {
  static customFileName(
    _req: any,
    file: { mimetype: string | string[] },
    cb: (arg0: any, arg1: string) => void,
  ) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = 'pdf';
    } else if (file.mimetype.indexOf('txt') > -1) {
      fileExtension = 'text';
    }
    cb(null, uniqueSuffix + '.' + fileExtension);
  }

  static destinationPath(
    _req: any,
    file: { mimetype: string | string[] },
    cb: (arg0: any, arg1: string) => void,
  ) {
    if (
      file.mimetype.indexOf('jpeg') > -1 ||
      file.mimetype.indexOf('png') > -1
    ) {
      cb(null, './src/images/');
    } else if (
      file.mimetype.indexOf('pdf') > -1 ||
      file.mimetype.indexOf('doc') > -1
    ) {
      cb(null, './src/files/');
    }
  }
}
