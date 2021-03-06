var started = false;

// individual genes
class Gene {
  constructor(code) {
    if (code)
      this.code = code;
    else
      this.code = '';
    this.cost = 9999;
  }

  generateCode(length) {
    for (var i = 0; i < length; i++) {
      this.code += String.fromCharCode(Math.floor(Math.random() * 255));
    }
  }

  // calculate difference between current gene and other gene
  calcDiff(otherGene) {
    var val = 0;
    for (var i = 0; i < this.code.length; i++) {
      val += (this.code.charCodeAt(i) - otherGene.charCodeAt(i)) * (this.code.charCodeAt(i) - otherGene.charCodeAt(i));
    }
    this.cost = val;
  }

  // mate current gene with another gene
  // pivot may be changed for better results
  mate(gene) {

    var pivot = Math.round(this.code.length/2) - 1;

    // new children will take half of each gene
    var newChild_1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
    var newChild_2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

    return [new Gene(newChild_1), new Gene(newChild_2)];
  }

  // randomly mutate gene by a character depending on the percentage
  mutate(percentage) {
    if (Math.random() > percentage) {
      var index = Math.floor(Math.random() * this.code.length);

      // determine how to shift the char
      var upDown = Math.random() > 0.5 ? 1 : -1;

      // code = shifted index using upDown val
      this.code = this.code.substr(0, index) + String.fromCharCode(this.code.charCodeAt(index) + upDown) + this.code.substr(index + 1);
    }
  }
}

class Population {
  // stores the entire gene population and finds the targetChromosome
  constructor(targetChromosome, popSize) {
    this.genePool = [];
    this.generationNumber = 0;
    this.targetChromosome = targetChromosome;

    // create genes with random codes and insert into gene pool
    for (var i = 0; i < popSize; i++) {
      var gene = new Gene();
      gene.generateCode(this.targetChromosome.length);
      this.genePool.push(gene);
    }
  }

  // helper function to sort gene pool by cost
  sort() {
    this.genePool.sort(function (a, b) {
      return (a.cost - b.cost);
    });
  }

  // perform calculations for current generation
  generation() {

    // for all genes, calculate their cost
    for (var i = 0 ; i < this.genePool.length; i++) {
      this.genePool[i].calcDiff(this.targetChromosome);
    }

    this.sort();

    // mate the genes with the lowest cost
    var children = this.genePool[0].mate(this.genePool[1]);

    // remove the genes with the highest cost and replace them with the new children
    this.genePool.splice(this.genePool.length - 2, 2, children[0], children[1]);

    // calculate the respective difference for the children genes
    this.genePool[this.genePool.length-1].calcDiff(this.targetChromosome);
    this.genePool[this.genePool.length-2].calcDiff(this.targetChromosome);

    this.sort();
    this.print();

    for (var i = 0; i < this.genePool.length; i++) {

      // mutate and calculate difference
      this.genePool[i].mutate(0.3);
      this.genePool[i].calcDiff(this.targetChromosome);

      // check if gene is the target and display it
      if (this.genePool[i].code == this.targetChromosome) {
        this.sort();
        this.print();
        started = false;
        return true;
      }
    }

    this.generationNumber++;

    var scope = this;
    setTimeout(function() { scope.generation(); } , 20);
  }

  print() {
    var table = document.getElementById('table')
    table.innerHTML = '';
    table.innerHTML += ("<h2>Generation: " + this.generationNumber + "</h2>");
    table.innerHTML += ("<ul>");
    for (var i = 0; i < this.genePool.length; i++) {
      table.innerHTML += ("<li>" + this.genePool[i].code + " (" + this.genePool[i].cost + ")");
    }
    table.innerHTML += ("</ul>");
  };

}

function start() {
  if ( ! started) {
    started = true;
    var pop  = new Population("Hello, world!", 20);
    pop.generation();
  }
};