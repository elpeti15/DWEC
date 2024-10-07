/**
 * Parte 1
 * Crea una función que tome una cadena como entrada y compruebe si es un palíndromo (es igual cuando se invierte).
 * Haz esto sin usar bucles (puedes usar Array.from para convertir una cadena en un array).
 * Comprueba que el tipo del parámetro es "string" y que la longitud es al menos 1 o muestra un error.
 * Ejemplo: esPalindromo("abeceba") -> true
 */
console.log("EJERCICIO 1 - PARTE 1");

function esPalindromo(cadena){
    if (typeof(cadena) != "string" || cadena.length < 1){
        console.error("El parámetro debe ser una cadena de almenos 1 de longitud");
        return false;
    }
    else
        return Array.from(cadena).reverse().join('') === cadena;
}
let cadena = "abeceba";
let cadena2 = "bici";
console.log(esPalindromo(cadena));

/**
 * Parte 2
 * Desarrolla una función que comprima una cadena reemplazando caracteres repetitivos consecutivos con
 * el carácter y el número de repeticiones. Por ejemplo, "AAAABBBCC" se convertiría en "4A3B2C".
 * Ejemplo: stringCompression("GGGHHRRRRRRRUIIIOOOO") -> 3G2H7R1U3I4O
 */
console.log("EJERCICIO 1 - PARTE 2");

function stringCompression(cadena){
    let comprimida = "";
    let contador = 1;

    for (let i = 0; i < cadena.length; i++){
        
        if (cadena[i] == cadena[i + 1]){
            contador++; 
        }
        else {
            comprimida += contador + cadena[i];
            contador = 1;
        }
    }
    return comprimida;
}
console.log(stringCompression("GGGHHRRRRRRRUIIIOOOO"));

/**
 * Parte 3
 * Crea una función que tome un array de números que contenga valores duplicados. Debería devolver el
 * primer número que se repite en el array, o -1 si no hay duplicados.
 * No uses bucles, y si no sabes cómo hacerlo sin bucles, solo puedes usar un bucle
 * (.forEach cuenta como un bucle).
 * Ejemplo: encuentraRepetido([1,4,7,3,8,7,4,5,5,1]) -> 7 (se repite antes que el 4)
 */
console.log("EJERCICIO 1 - PARTE 3");

function encuentraRepetido(numbers) {

    let vistos = new Set(); // Set para almacenar los números ya vistos

    return numbers.reduce((acumulador, num) => {
        if (acumulador !== -1) return acumulador; // Si ya encontramos un repetido, lo devolvemos de primeras
        if (vistos.has(num)) return num; // Si el número ya está en el set, es el repetido
        vistos.add(num); // Si no, lo agregamos al set
        return acumulador;
    } , -1); // Iniciamos el acumulador como -1
}

console.log(encuentraRepetido([1,4,7,3,8,7,4,5,5,1]));

/**
 * Parte 4
 * Crea una función que tome un array de cadenas como primer parámetro y una cadena como segundo.
 * Debería devolver un nuevo array que contenga las palabras del primer array cuyas letras estén todas presentes
 * en la segunda cadena. Intenta no usar bucles a no ser que no sepas hacerlo de otra manera.
 * Ejemplo: fitraPalabras(["house", "car", "watch", "table"], "catboulerham") -> ['car', 'table']
 */
console.log("EJERCICIO 1 - PARTE 4");

function filtraPalabras(arr, cadena){

    return arr.filter(palabra => [...palabra].every  //Para cada palabra, todas sus letras deben estar presentes
        (letra => new Set(cadena).has(letra)));     // en el Set creado a partir de la cadena.

}

console.log(filtraPalabras(["house", "car", "watch", "table"], "catboulerham"));

/**
 * Parte 5
 * Crea una función que tome un array de luces representadas por los caracteres '🔴' y '🟢'.
 * La función debe comprobar si las luces están alternando (por ejemplo, ['🔴', '🟢', '🔴', '🟢', '🔴']).
 * Devuelve el número mínimo de luces que necesitan ser cambiadas para que las luces alternen.
 * Ejemplo: ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢'])  -> 1 (cambia la primera luz a verde)
 */
console.log("EJERCICIO 1 - PARTE 5");

function ajustaLuces(caracteres){

    let cambiosRojo = 0;  //Cambios empezando por rojo
    let cambiosVerde = 0; //Cambios empezando por verde

    for (let i = 0; i < caracteres.length; i++){

        //Comprobamos empezando por rojo:
        if (i % 2 === 0 && caracteres[i] !== '🔴')
            cambiosRojo++;
        if (i % 2 !== 0 && caracteres[i] !== '🟢')
            cambiosRojo++;

        //Comprobamos empezando por verde:
        if (i % 2 === 0 && caracteres[i] !== '🟢') 
            cambiosVerde++;
        if (i % 2 !== 0 && caracteres[i] !== '🔴')
            cambiosVerde++;
    }

    return Math.min(cambiosRojo, cambiosVerde);
}

console.log(ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢']));

/**
 * Parte 6
 * Crea una colección Map donde la clave es el nombre de un plato y el valor es un array de ingredientes.
 * Realiza el código para crear otro Map donde la clave sea el nombre del ingrediente y el valor sea el array de
 * platos donde aparece ese ingrediente.
 */
console.log("EJERCICIO 1 - PARTE 6");

let recetas = new Map();
recetas.set("carbonara", ["bacon", "cebolla", "pasta", "huevo"]);
recetas.set("tortilla", ["huevo", "patata", "cebolla"]);
recetas.set("pizza", ["tomate", "masa", "bacon", "queso"]);

let ingredientesMap = new Map();

recetas.forEach((ingredientes, receta) => {
    ingredientes.forEach((ingrediente) => {
        if (!ingredientesMap.has(ingrediente)){
            ingredientesMap.set(ingrediente, []);
        }
        ingredientesMap.get(ingrediente).push(receta);
    });
});

console.log(ingredientesMap);

/**
 * Parte 7
 * Crea una función que pueda recibir tantos números como quieras por parámetro. Utiliza rest para agruparlos en
 * un array e imprimir los que son pares y los que son impares por separado.
 * NO uses bucles (for, while, etc.)
 */
console.log("EJERCICIO 1 - PARTE 7");

function paresEImpares(...numeros){
    let pares = numeros.filter(numero => numero % 2 === 0);
    let impares = numeros.filter(numero => numero % 2 !== 0);
    console.log("Numeros pares: " + pares);
    console.log("Numeros impares: " + impares);
}
paresEImpares(2,5,6,7,9,8,1);

/**
 * Parte 8
 * Crea una función que reciba un array y sume los primeros tres números del array.
 * Utiliza desestructuración de arrays en los parámetros para obtener esos tres números.
 * Si alguno de esos números no está presente en el array, se asignará un valor predeterminado de 0.
 * Devuelve el resultado de sumar esos tres números.
 */

console.log("EJERCICIO 1 - PARTE 8");

function sumar3Primeros(numeros){
    let [v1 = 0, v2 = 0, v3 = 0] = numeros;
    return v1+v2+v3;
}

console.log(sumar3Primeros([5, 3, , 2, 4]));

/**
 * Parte 9
 * Crea una función que tome un número indeterminado de cadenas como argumentos,
 * las agrupa en un array y devuelve un nuevo array que contiene la longitud de cada cadena.
 * No uses bucles.
 * Ejemplo: stringLenghts("potato", "milk", "car", "table") -> [6, 4, 3, 5]
 */

console.log("EJERCICIO 1 - PARTE 9");

function stringLengths(...cadenas){
    return cadenas.map(cadena => cadena.length);
}

console.log(stringLengths("potato", "milk", "car", "table"));

/**
 * Parte 10
 * Crea un array y, sin modificarlo, genera los siguientes arrays derivados (cada nuevo array deriva del anterior):
 * - Agrega 2 elementos al principio del array
 * - Elimina las posiciones 4 y 5
 * - Concatena los elementos de otro array al final Muestra el array resultante después de cada operación.
 * Ninguna operación realizada debe modificar el array sobre el que opera. Muestra el array original al final.
 */

console.log("EJERCICIO 1 - PARTE 10");

let array1 = [4, 6, 8, 10, 12];
console.log("Array original: " + array1);
let array2 = array1.toSpliced(0, 0, 0, 2);
console.log("Agragamos dos elementos al principio: " + array2);
let array3 = array2.toSpliced(4, 2);
console.log("Eliminamos las posiciones 4 y 5: " + array3);
let array4 = [14, 16, 18];
let array5 = array3.concat(array4);
console.log("Concatenamos con otro array: " + array5);
console.log("Mostramos el array original sin modificar: " + array1);