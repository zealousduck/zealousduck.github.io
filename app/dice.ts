
export const dForList = <T>(l: T[]): T => l[dN(l.length)-1];

export const d20 = (): number => dN(20);

export const dN = (n: number) => {
  return Math.ceil(Math.random() * n);
}