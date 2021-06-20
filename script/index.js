

const form = document.getElementById('form');
const nodo = document.getElementById('nodo');
const amplitud = document.getElementById('amplitud');
const nivel = document.getElementById('nivel');
const toggle = document.getElementById('switch');

let flag = true;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nodoNumber = nodo.value;
    const amplitudNumber = amplitud.value;
    const nivelNumber = nivel.value;
    checkInputs(parseInt(nodoNumber),parseInt(amplitudNumber),parseInt(nivelNumber),toggle.checked);
});

const checkInputs = (nodoNumber,amplitudNumber,nivelNumber,isBinary) => {

    nodoNumber > 0 ? setSuccessFor(nodo) : setErrorFor(nodo,'Debe ingresar un numero positivo');
    amplitudNumber > 0 ? setSuccessFor(amplitud) : setErrorFor(amplitud,'Debe ingresar un numero positivo');
    nivelNumber > 0 ? setSuccessFor(amplitud) : setErrorFor(amplitud,'Debe ingresar un numero positivo');
    if(isBinary) {
        localStorage.setItem(toggle.id,true);
        // console.log(toggle.id);
        amplitudNumber <= 2 ? setSuccessFor(amplitud) : setErrorFor(amplitud,'La amplitud menor o igual  a 2');
        true ? setSuccessFor(nivel) : setErrorFor(nivel,'El valor de nivel no es valido')
        let maxNodo = ((1-Math.pow(amplitudNumber,nivelNumber+1))/(1-amplitudNumber));
        for (let index = 0; index < nivelNumber; index++) {
            maxNodo += Math.pow(2,index);
        }
        nodoNumber <= maxNodo ? setSuccessFor(nodo) : setErrorFor(nodo,'no se pueden crear tantos nodos');
    } else {
        localStorage.setItem(toggle.id,false);
        // console.log(toggle.id);
        amplitudNumber <= (nodoNumber-1) ? setSuccessFor(amplitud) : setErrorFor(amplitud,'La amplitud no es valida');
        true ? setSuccessFor(nivel) : setErrorFor(nivel,'El valor de nivel no es valido');
        
        let maxNodo = 0;
        for (let index = 0; index < nivelNumber; index++) {
            maxNodo += Math.pow(amplitudNumber,index);
        }
        nodoNumber <= maxNodo ? setSuccessFor(nodo) : setErrorFor(nodo,'no se pueden crear tantos nodos');
    }
    if (!flag) {
        flag = true;
    }
    else {
        window.location.href = "/trees.html ";
    }
}



const setErrorFor = (input,message) => {
    const inputBox = input.parentElement;
    const small = inputBox.querySelector('small');
    small.innerText = message;
    inputBox.className = 'input-box error';
    localStorage.removeItem(input.id);
    flag = false;
}

const setSuccessFor = (input) => {
    const inputBox = input.parentElement;
    inputBox.className = 'input-box success';
    localStorage.setItem(input.id,parseInt(input.value));
}