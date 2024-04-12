class DTWStream2D {
    constructor(targetSeq) {
        this.targetSeq = targetSeq;
        this.S = this.initS();
        this.j = 1;
    }
  
    initS() {
        const S = [];
        for (let i = 0; i <= this.targetSeq[0].length; i++) {
            S.push(new Array(2).fill(Infinity));
        }
        S[0] = [0, Infinity];
        return S;
    }
  
    step(input) {
        let currScore = Infinity;
        for (let i = 1; i < this.S.length; i++) {
            const cost = Math.sqrt(this.targetSeq.map((coord, index) => 
                (coord[i - 1] - input[index]) ** 2).reduce((a, b) => a + b, 0));
            this.S[i][this.j] = cost + Math.min(
                this.S[i - 1][this.j],
                this.S[i][this.j - 1],
                this.S[i - 1][this.j - 1]
            );
            if (i === this.S.length - 1) {
                currScore = this.S[i][this.j];
            }
        }
        this.S.forEach(row => row.push(Infinity));
        this.j += 1;
        return currScore;
    }
  
    eval(input) {
        return this.step(input);
    }
  }

export default DTWStream2D;