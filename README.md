# modmark-robber
A proof of concept [modmark](https://github.com/modmark-org/modmark) package written in Assemblyscript, mainly just to show that it can be done.
First time using Assemblyscript so code is probably not optimal or pretty.
The packages provides transformations from a `[vigenere]` module to `html` and `latex` that encrypts the given text using a [Vigenere Cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher) using the provided *key*.

## Module usage
```
[vigenere your-key-here]
text to encrypt
```

To build a wasm module
```
npm run asbuild
```
