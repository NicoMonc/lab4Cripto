// ==UserScript==
// @name         Descifrar texto 3DES utilizando primera mayúscula de cada línea como clave
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Descifra el texto utilizando el algoritmo 3DES y la primera mayúscula de cada línea de los elementos <p> en HTML como clave, e imprime el resultado por consola y en el HTML de la página
// @author       Nicolás Moncada
// @match        https://cripto.tiiny.site/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Función para cargar la biblioteca CryptoJS
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // URL de la biblioteca CryptoJS
    const cryptoJSUrl = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js';

    // Cargar la biblioteca CryptoJS y ejecutar el script principal
    loadScript(cryptoJSUrl, function() {
        // Obtener todas las etiquetas <p> en la página
        const paragraphs = document.querySelectorAll('p');

        // Variable para almacenar el conjunto de la primera mayúscula de cada línea
        let uppercaseLetters = '';

        // Recorrer las etiquetas <p> y obtener la primera mayúscula de cada línea
        paragraphs.forEach(p => {
            const lines = p.textContent.split('\n');
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.length > 0) {
                    const firstChar = trimmedLine.charAt(0);
                    if (firstChar >= 'A' && firstChar <= 'Z') {
                        uppercaseLetters += firstChar;
                    }
                }
            });
        });

        // Obtener todos los elementos "div" con atributo "id" en la página
        const divs = document.querySelectorAll('div[id]');

        // Imprimir el mensaje de la llave por consola
        console.log('La llave es: ' + uppercaseLetters);

        // Imprimir la cantidad de divs con atributo "id" y los mensajes cifrados por consola
        console.log('Los mensajes cifrados son: ' + divs.length);

        // Imprimir el texto descifrado por consola y crear elementos <p> para mostrar el texto claro en el HTML
        divs.forEach(div => {
            const id = div.id;
            const decryptedId = decrypt3DES(id, uppercaseLetters);
            console.log(id + ' ' + decryptedId);

            // Crear un nuevo elemento <p> para mostrar el texto descifrado en el HTML
            const decryptedTextElement = document.createElement('p');
            decryptedTextElement.textContent = decryptedId;

            // Agregar el elemento al cuerpo del documento
            document.body.appendChild(decryptedTextElement);
        });

        // Función para descifrar utilizando 3DES y la clave
        function decrypt3DES(text, key) {
            const keyHex = CryptoJS.enc.Utf8.parse(key);
            const decrypted = CryptoJS.TripleDES.decrypt({
                ciphertext: CryptoJS.enc.Base64.parse(text)
            }, keyHex, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        }
    });
})();
