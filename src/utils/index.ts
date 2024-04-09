export * from './fileSystem'
export * from './indexedDB'
export const minmax = (val: number, [min, max]: number[]) => Math.max(Math.min(val, max), min)
