import { createRequire } from "module";
import { join } from "path";
import { Path } from "../../config/path.js";
import { existsSync } from "fs";
import { App, cert, initializeApp } from "firebase-admin/app";

let _firebase: App;

export interface InitializeFirebaseParams {
  credentialFilename: string;
}

export async function initializeFirebase(params: InitializeFirebaseParams){
  if(_firebase){
    return _firebase;
  }

  const require = createRequire(import.meta.url);

  const credentialPath = join(Path.certs, params.credentialFilename);
  const doesCredentialExists = existsSync(credentialPath);
  if(!doesCredentialExists){
    throw new Error(`The file ${credentialPath} must exist to initialize firebase!`);
  }

  const credential = require(credentialPath);
  
  _firebase = initializeApp({
    credential: cert(credential),
  });

  return _firebase;
}

export function getFirebase(){
  if(!_firebase){
    throw new Error(`You must initialize firebase using the initializeFirebase function first!`);
  }

  return _firebase;
}