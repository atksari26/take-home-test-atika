export type Domino = [number, number];
export type OrderType = "asc" | "desc";

const ASC: OrderType = "asc";
const DESC: OrderType = "desc";

function compareDomino(order: OrderType) {
  return function compare(a: Domino, b: Domino): number {
    const sumA = a[0] + a[1];
    const sumB = b[0] + b[1];

    if (sumA !== sumB) {
      return order === ASC ? sumA - sumB : sumB - sumA;
    }

    const minA = Math.min(...a);
    const minB = Math.min(...b);
    const maxA = Math.max(...a);
    const maxB = Math.max(...b);

    if (order === ASC) {
      if (minA !== minB) return minA - minB;
      if (maxA !== maxB) return maxA - maxB;
      if (a[0] !== b[0]) return a[0] - b[0];
      return a[1] - b[1];
    } else {
      if (maxA !== maxB) return maxB - maxA;
      if (minA !== minB) return minB - minA;
      if (b[0] !== a[0]) return b[0] - a[0];
      return b[1] - a[1];
    }
  };
}

export function sort(dominoes: Domino[], order: OrderType = ASC): Domino[] {
  const selectedOrder: OrderType = order === DESC ? DESC : ASC;
  return dominoes.slice().sort(compareDomino(selectedOrder));
}

export function countDoubleNumber(dominoes: Domino[]): number {
  return dominoes.filter(([a, b]) => a === b).length;
}