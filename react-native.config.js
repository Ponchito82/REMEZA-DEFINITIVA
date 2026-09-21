/**
 * Las fuentes viven en `src/assets/fonts` y se enlazan con
 * `npx react-native-asset`, que las copia a
 * `android/app/src/main/assets/fonts` y las da de alta en el Info.plist de iOS.
 *
 * Por eso están aquí y no sueltas dentro de `android/`: dejarlas sólo en el
 * assets de Android funciona en Android y deja iOS sin la fuente.
 */
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ["./src/assets/fonts"],
};
