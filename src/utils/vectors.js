/* eslint-disable no-trailing-spaces */
// __     __        _                 
// \ \   / /__  ___| |_ ___  _ __ ___ 
//  \ \ / / _ \/ __| __/ _ \| '__/ __|
//   \ V /  __/ (__| || (_) | |  \__ \
//    \_/ \___|\___|\__\___/|_|  |___/
//                                    

export function flattenVector(vector) {
  const result = [];

  for (let i = 0; i < vector.length; ++i) {
    result.push(vector[i]);
  }
  return new Float32Array(result);
}

export function foo() {
  return 'foo';
}
