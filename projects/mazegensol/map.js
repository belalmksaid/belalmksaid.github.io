function rectangleB(c, x, y, w, h) { //draws empty rectange
	c.beginPath();
	c.rect(x, y, w, h);
	c.stroke();
}

function rectangleF(c, x, y, w, h) {
    c.beginPath();
	c.rect(x, y, w, h);
    c.fill();
}

function circleB(c, x, y, rad) {
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.closePath();
	c.stroke();
}


const empty = "O";
const block = "#";
const path = "*";

const cellsize = 20;

var count = 0;

class map {
    constructor(dv, p, dim) {
        this.p = p; // probability that a cell is occupied
        this.dim = dim; // dimension of the map
        this.parent = dv; // where the map will be displayed
        this.cells = new Array(); // Will be used to store how the map looks like
        this.canvas = document.createElement("canvas"); // for visualisation purposes
        this.context = this.canvas.getContext('2d');// for visualisation purposes
        this.canvas.width = this.dim * cellsize;// for visualisation purposes
        this.canvas.height = this.dim * cellsize;// for visualisation purposes
        this.parent.append(this.canvas);// for visualisation purposes
        this.textDiv = document.createElement("div");// to print map text
        this.textDiv.style.display = "inline-block";// to print map text
        this.textDiv.style.fontFamily = "Courier";// to print map text
        this.parent.append(this.textDiv);// to print map text
    }
    
    generate() {
        for(let i = 0; i < this.dim; i++) {
            this.cells[i] = new Array();
            for(let j = 0; j < this.dim; j++) {
                if((i == 0 && j == 0) || (i == this.dim - 1 && j == this.dim - 1))  {
                    this.cells[i][j] = empty;
                    continue;
                }
                this.cells[i][j] = Math.random() < this.p ? block : empty;
            }
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                if(this.cells[j][i] === empty) {
                    rectangleB(this.context, i * cellsize, j * cellsize, cellsize, cellsize);
                }
                else if(this.cells[j][i] === block) {
                    rectangleF(this.context, i * cellsize, j * cellsize, cellsize, cellsize);
                }
            }
        }
    }

    drawSolution(sol) {
        while(sol != undefined) {
            circleB(this.context, sol.j * cellsize + cellsize / 2, sol.i * cellsize + cellsize /2 , cellsize * 0.3);
            sol = sol.parent;
        }
    }

    text() {
        this.textDiv.innerHTML = "<br/>";
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                this.textDiv.innerHTML += this.cells[i][j] + "\t\t";
            }
            this.textDiv.innerHTML += "<br/>";
        }
    }

    textSolution(sol) {
        this.textDiv.innerHTML = "<br/>";
        let temp = this.cells.slice();
        for(let i = 0; i < temp.length; i++) {
            temp[i] = this.cells[i].slice();
        }
        while(sol != undefined) {
            temp[sol.i][sol.j] = path;
            sol = sol.parent;
        }
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                this.textDiv.innerHTML += temp[i][j] + "\t\t";
            }
            this.textDiv.innerHTML += "<br/>";
        }
    }
};

function createUnvisitedMap(dim) {
    var arr = new Array();
    for(let i = 0; i < dim; i++) {
        arr[i] = new Array();
        for(let j = 0; j < dim; j++) {
            arr[i][j] = false;
        }
    }
    return arr;
}

class vector { // used to store the indices of the current cell, and a reference to the parent cell
    constructor(i, j, p) {
        this.i = i;
        this.j = j;
        this.parent = p;
    }
}

function v(i, j, p) { // creates a vector
    return new vector(i, j, p);
}

function solveDFS(m) { // find goal node using DFS, return undefined if nothing found
    let stack = new Array();
    let visited = createUnvisitedMap(m.dim);
    stack.push(v(0, 0));
    while(stack.length > 0) {
        let index = stack.pop();
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                return index;
            }
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == j || i == -j) continue;
                    if(index.i + i >= 0 && index.j + j >= 0 && index.i + i < m.dim && index.j + j < m.dim) {
                        let item = v(index.i + i, index.j + j, index);
                        if(m.cells[item.i][item.j] != block)
                            stack.push(item);
                    }
                }
            }
        }
    }
}

function solveBFS(m) { // find goal node using BFS, return undefined if nothing found
    let queue = new Array();
    let visited = createUnvisitedMap(m.dim);
    queue.push(v(0, 0));
    while(queue.length > 0) {
        let index = queue.shift();
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                return index;
            }
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == j || i == -j) continue;
                    if(index.i + i >= 0 && index.j + j >= 0 && index.i + i < m.dim && index.j + j < m.dim) {
                        let item = v(index.i + i, index.j + j, index);
                        if(m.cells[item.i][item.j] != block)
                            queue.push(item);
                    }
                }
            }
        }
    }
}

// class svector { // stores the indices of the cell and the g, h value
//     constructor(i, j, g, h, parent) {
//         this.i = i;
//         this.j = j;
//         this.g = g;
//         this.h = h;
//         this.parent = parent;
//     }

//     get f() {
//         return this.g + this.h;
//     }
// }

// function sv(i, j, g, h, parent) {
//     return new svector(i, j, g, h, parent);
// }

function insert(list, item, f) { // inserts item to a sorted list. Javascript doesn't have a built in sorted list and I don't want to keep resorting
    if(list.length < 1) {
        list.push(item);
        return;
    }
    let lo = 0;
    let hi = list.length - 1;
    let mid = Math.floor((lo + hi) / 2);
    while (hi > lo) {
        mid = Math.floor((lo + hi) / 2);
        if(f[list[mid].i][list[mid].j] == f[item.i][item.j]) {
            list.splice(mid, 0, item);
            return;
        }
        if(f[list[mid].i][list[mid].j] < f[item.i][item.j]) {
            lo = mid + 1;
        }
        else if(f[list[mid].i][list[mid].j] > f[item.i][item.j]) {
            hi = mid - 1;
        }
        //console.log(f[list[mid].i, list[mid].j] + ", " + f[item.i, item.j] + "|");
    }
    mid = Math.floor(Math.abs(lo + hi) / 2);
    if(f[list[mid].i][list[mid].j] < f[item.i][item.j])
        list.splice(mid + 1, 0, item);
    else
        list.splice(mid, 0, item);
}

function insertionSort(list, f) {
    var len = list.length;
    for (var i = 1; i < len; i++) {
        var tmp = list[i]; //Copy of the current element. 
        /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
        for (var j = i - 1; j >= 0 && (f[list[j].i][list[j].j] > f[tmp.i][tmp.j]); j--) {
            //Shift the number
            list[j + 1] = list[j];
        }
        //Insert the copied number at the correct position
        //in sorted part. 
        list[j + 1] = tmp;
    }
}

function euclideanHeuristic(a, b) {
    return Math.sqrt((b.i - a.i) * (b.i - a.i) + (b.j - a.j) * (b.j - a.j)); 
}

function manhattanHeuristic(a, b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function initializeGrid(dim) {
    var arr = new Array();
    for(let i = 0; i < dim; i++) {
        arr[i] = new Array();
        for(let j = 0; j < dim; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function Astar(m, heu) { // heu is the heuristic function
    let open = new Array();
    let closed = createUnvisitedMap(m.dim);
    let opened = createUnvisitedMap(m.dim);
    let g = initializeGrid(m.dim);
    let h = initializeGrid(m.dim);
    let f = initializeGrid(m.dim);
    let goal = v(m.dim - 1, m.dim - 1);
    g[0][0] = 0;
    h[0][0] = heu(path, goal);
    f[0][0] = g[0][0] + h[0][0];
    open.push(v(0, 0));
    opened[0][0] = true;
    closed[0][0] = true;
    while(open.length > 0) {
        let index = open.shift();
        opened[index.i][index.j] = false;
        closed[index.i][index.j] = true;
        if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
            return index;
        }
        for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == j || i == -j) continue;
                    if(index.i + i >= 0 && index.j + j >= 0 && index.i + i < m.dim && index.j + j < m.dim) {
                        let item = v(index.i + i, index.j + j, index);
                        if(m.cells[item.i][item.j] != empty) continue;
                        let scost = g[index.i][index.j] + 1;
                        if(opened[item.i][item.j]) {
                            if(g[item.i][item.i] <= scost) continue;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insertionSort(open, f);
                            let ind = open.find(function(i) {
                                if(i.i == this[0] && i.j == this[1])
                                    return i;
                            }, [item.i, item.j]);
                            ind.parent = index;
                        }
                        else if(closed[item.i][item.j]) {
                            if(g[item.i][item.i] <= scost) continue;
                            closed[item.i][item.j] = false;
                            opened[item.i][item.j] = true;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insert(open, item, f);
                        }
                        else {
                            opened[item.i][item.j] = true;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insert(open, item, f);
                        }
                        
                    }
                }
         }
    }
}