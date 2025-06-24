class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('g'),
      B: Array(9).fill('b'),
      L: Array(9).fill('o'),
      R: Array(9).fill('r')
    };
  }

  rotateFace(face, clockwise = true) {
    const f = this.faces[face];
    const copy = f.slice();
    if (clockwise) {
      f[0] = copy[6]; f[1] = copy[3]; f[2] = copy[0];
      f[3] = copy[7]; f[4] = copy[4]; f[5] = copy[1];
      f[6] = copy[8]; f[7] = copy[5]; f[8] = copy[2];
    } else {
      f[0] = copy[2]; f[1] = copy[5]; f[2] = copy[8];
      f[3] = copy[1]; f[4] = copy[4]; f[5] = copy[7];
      f[6] = copy[0]; f[7] = copy[3]; f[8] = copy[6];
    }
  }

  move(moveName) {
    const clockwise = !moveName.includes("'");
    const face = moveName.replace("'", "");
    this.rotateFace(face, clockwise);

    if (face === 'F') {
      const { U, R, D, L } = this.faces;
      const temp = [U[6], U[7], U[8]];
      if (clockwise) {
        [U[6], U[7], U[8]] = [L[8], L[5], L[2]];
        [L[2], L[5], L[8]] = [D[2], D[1], D[0]];
        [D[0], D[1], D[2]] = [R[6], R[3], R[0]];
        [R[0], R[3], R[6]] = temp;
      } else {
        [U[6], U[7], U[8]] = [R[0], R[3], R[6]];
        [R[0], R[3], R[6]] = [D[0], D[1], D[2]];
        [D[0], D[1], D[2]] = [L[2], L[5], L[8]];
        [L[2], L[5], L[8]] = temp;
      }
    }
  }

  scramble(moves = 5) {
    const allMoves = ['F', "F'"];
    const history = [];
    for (let i = 0; i < moves; i++) {
      const move = allMoves[Math.floor(Math.random() * allMoves.length)];
      this.move(move);
      history.push(move);
    }
    return history;
  }

  getCubeStateString() {
    return Object.values(this.faces).map(face => face.join('')).join('');
  }

  solve() {
    const steps = [];
    const scrambleMoves = this.scramble(5);
    steps.push({ move: 'Scramble: ' + scrambleMoves.join(' '), state: this.getCubeStateString() });

    for (let i = scrambleMoves.length - 1; i >= 0; i--) {
      const move = scrambleMoves[i];
      const reverseMove = move.includes("'") ? move.replace("'", '') : move + "'";
      this.move(reverseMove);
      steps.push({ move: 'Undo: ' + reverseMove, state: this.getCubeStateString() });
    }

    return steps;
  }
}

function displaySteps(steps) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  steps.forEach((step, index) => {
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `<strong>Step ${index + 1}:</strong> ${step.move}<br><span class="cube-state">${step.state}</span>`;
    output.appendChild(div);
  });
}

// Run the program
const cube = new RubiksCube();
const steps = cube.solve();
displaySteps(steps);
