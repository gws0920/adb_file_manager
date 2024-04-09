export * from './fileSystem'
export const minmax = (val: number, [min, max]: number[]) => Math.max(Math.min(val, max), min)
