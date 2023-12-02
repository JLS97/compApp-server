import passport, {PassportStatic} from 'passport';

let _passport: PassportStatic;

export function initializePassport() {
  _passport = passport;
  return _passport.initialize();
}

export function getPassport() {
  if (!_passport) {
    throw new Error(`Debes inicializar passport primero`);
  }

  return _passport;
}
