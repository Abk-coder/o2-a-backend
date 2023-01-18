export class UploadProfileHelper {
  static customFileName = (req, file, cb) => {
    let customName = (Date.now() + Math.round(Math.random())).toString();
    let fileExtension = '';

    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = '.jpg';
    } else if (file.mimetype.indexOf('png')) {
      fileExtension = '.png';
    } else if (file.mimetype.indexOf('jpg')) {
      fileExtension = '.jpg';
    }

    customName += fileExtension;

    cb(null, customName);
  };

  static uploadDirectory = (req, file, cb) => {
    cb(null, process.env.PATH_FILE_UPLOAD + '/images/profiles');
  };
}
