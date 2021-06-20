const nodos = parseInt(localStorage.getItem("nodo"));
const amplitud = parseInt(localStorage.getItem("amplitud"));
const nivel = parseInt(localStorage.getItem("nivel"));

// create an array with nodes

let nodes = new vis.DataSet();

for (let index = 1; index <= nodos; index++) {
    nodes.add([{ id: index, label: ` ${index} `, title: `Node ${index}` , color: `#3a595c`, font: {color: '#edeef0'}}]);
}

// let nodes = new vis.DataSet([
//     { id: 1, label: "Node 1", title: "1" },
//     { id: 2, label: "Node 2", title: "2" },
//     { id: 3, label: "Node 3", title: "3" },
//     { id: 4, label: "Node 4", title: "4" },
//     { id: 5, label: "Node 5", title: "5" },
// ]);

// create an array with edges

let queue = [];

let actualNode = 1;

let edges = new vis.DataSet();

let container = document.getElementById("mynetwork");
let data = {
    nodes: nodes,
    edges: edges,
};
let options = {
    layout: {
        hierarchical: {
            // direction: 'UD',
            sortMethod: "directed",
            parentCentralization: true,
            shakeTowards: "roots",
        },
    },
};

let network = new vis.Network(container, data, options);

//edges for level

const getDepth = (index) => {
    index = parseInt(index);
    let depth = 1;
    while (network.getConnectedNodes(index,'from').length > 0) {
        let aux = network.getConnectedNodes(index,'from');
        index=aux[0];
        // console.log(index);
        depth++;
    }
    // console.log(depth);
    return depth;
}

for (let index = 1; index <= nivel - 1; index++) {
    edges.add([{ from: index, to: index + 1 }]);
    queue.push(index);
}
actualNode = nivel + 1;
//
auxNodos = nodos;
// console.log(actualNode);
root = queue.shift();
// console.log(root);
// console.log(childs = network.getConnectedNodes(root,'to').length);
while (auxNodos > 0) {
    childs = network.getConnectedNodes(root, "to").length;
    for (let index = 1; index <= amplitud - childs; index++) {
        edges.add([{ from: root, to: actualNode }]);
        if (getDepth(actualNode) < nivel) {
            queue.push(actualNode);
        }
        actualNode++;
        auxNodos--;
    }
    root = queue.shift();
}

// queue = [];
// let edges = new vis.DataSet([
//     { from: 1, to: 3 },
//     { from: 1, to: 2 },
//     { from: 2, to: 4 },
//     { from: 2, to: 5 },

// ]);

// create a network

// console.log(nodos);
// console.log(amplitud);
// console.log(nivel);

// console.log(queue);

// console.log(network.getConnectedNodes(2,'from'));

// console.log(nodes.get(node[1]).label);

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



const minimax = async () => {
    let elemento = document.createElement('li');
    elemento.className = 'line-end';
    document.getElementById('ul').appendChild(elemento);
    const leaf = new Set();
    const fathers = new Set();
    const value = new Set();
    let numNodes = [];
    for (let index = 1; index <= nodos; index++) {
        let aux = {};
        let father = network.getConnectedNodes(index,'from');
        if (father.length > 0) {
            father = father[0];
        } else {
            father = '';
        }
        if (network.getConnectedNodes(index, "to").length == 0) {
            leaf.add(index);
            let val = 0;
            do {
                val = getRndInteger(-100,100);
            } while (value.has(val));
            value.add(val);
            nodes.update({id:index,label:`${val}`});
            aux = {
                'index' : index,
                'value' : val,
                'depth' : getDepth(index),
                'father': father
            }
            numNodes.push(aux);
            await sleep(200);
            movements(`Nodo ${index} definido como hoja`);
            checkNode(index,'#7ba9a9');

        } else {
            fathers.add(index);
            
            aux = {
                'index' : index,
                'value' : '',
                'depth' : getDepth(index),
                'father': father
            }
            numNodes.push(aux);
            nodes.update({id:index,label:'-'});
            await sleep(200);
            movements(`Nodo ${index} definido como padre `);
            checkNode(index,'#192e2f');
        }
    }
    // console.log(`Padres: ${fathers}`);
    // console.table(numNodes);
    let minOrMax;
    if (nivel%2 == 0) {
        minOrMax = true;
    } else {
        minOrMax = false;
    }
    for (let level = nivel; level > 0; level--) {
        // console.log(level);
        let filterByLevelNodes = numNodes.filter((node) => node.depth == level);
        console.table(filterByLevelNodes);
        for (let item of fathers){
            
            let filterByFatherNodes = filterByLevelNodes.filter((node) => node.father == item);
            if(filterByFatherNodes.length > 0){
                console.log(`id del padre : ${item}`);
                console.table(filterByFatherNodes);
                let fatherValues = [];
                for(let i = 0; i < filterByFatherNodes.length; i++){
                    console.log(`Contenido de filterBy: ${typeof filterByFatherNodes[i].value}`);
                    fatherValues.push(parseInt(filterByFatherNodes[i].value));
                }
                console.log(fatherValues);
                let fatherValue;
                let minOrmAxMessage;
                if (minOrMax) {
                    fatherValue = Math.max(...fatherValues);
                    minOrmAxMessage='maximo';
                } else {
                    fatherValue = Math.min(...fatherValues);
                    minOrmAxMessage='minimo';
                }
                console.log(fatherValue.toString());
                numNodes[item-1].value = fatherValue;
                console.log(fatherValue);
                updateLabel(item,fatherValue.toString());
                await sleep(200);
                movements(`Estableciendo el valor ${minOrmAxMessage} ${fatherValue} en el Nodo ${item}`);
                checkNode(item,'#7ba9a9');
            }
        }
        minOrMax = !minOrMax; 
    }
    let rootValue = numNodes[0].value;
    let solution = numNodes.filter((node) => node.value == rootValue && leaf.has(node.index));
    console.table(solution);
    checkNode(solution[0].index,'#3a595c');
    await sleep(200);
    movements(`Proceso terminado, dibujando solucion`);
    await drawSolution(solution[0].index);

};

const  drawSolution = async (index) => {
    index = parseInt(index);
    let depth = 1;
    while (network.getConnectedNodes(index,'from').length > 0) {
        let aux = network.getConnectedNodes(index,'from');
        index=aux[0];
        checkNode(index,'#3a595c');
        await sleep(200);
        movements(`Agregando al nodo ${index} a la ruta solucion`);
        depth++;
    }
    // console.log(depth);
    return depth;
}

const movements = (message) => {
    let elemento = document.createElement('li');
    elemento.innerText = message;
    document.getElementById('ul').appendChild(elemento);
}

const updateLabel = (id,label) => {
    nodes.update({ id: id, label: label});
    // network.body.emitter.emit('_dataChanged');
    // network.redraw();
};

const checkNode = (id, color) => {
    nodes.update({ id: id, color: color });
    // network.body.emitter.emit('_dataChanged');
    // network.redraw();
};

// nodes.update({id:1,color:'#ffffff'});
