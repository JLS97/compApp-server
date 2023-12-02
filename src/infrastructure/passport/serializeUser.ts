export function serializeUser(user: Express.User, done: (err: any, id?: unknown) => void) {
  done(null, user);
}
