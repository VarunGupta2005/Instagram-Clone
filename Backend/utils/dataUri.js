import DataURIParser from "datauri/parser.js";
import path from "path";


//data uri stores the file information in the form of a base64 -encoded string 
//avoids the need to link to an external file 
const parser = new DataURIParser(); // get datauriparser

function getDataUri(file) {
  const extName = path.extname(file.originalname).toString(); //get file extension using path library
  return parser.format(extName, file.buffer).content; //use file extension and file.buffer which contains raw binary data to make DataUri
}

export default getDataUri;
