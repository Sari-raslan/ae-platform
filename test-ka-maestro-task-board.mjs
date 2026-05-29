import { runKaMaestroTaskBoard } from './backend/maestro/kaMaestroTaskBoard.js';

const board = runKaMaestroTaskBoard();
console.log(JSON.stringify(board, null, 2));

if (!board.ok) throw new Error('KA Maestro board failed');
if (board.tasks.length < 8) throw new Error('Missing tasks');

console.log('KA Maestro task board passed');
