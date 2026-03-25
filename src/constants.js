export const ALGORITHMS = [
  { 
    id: 'bubble', 
    name: 'Bubble Sort', 
    complexity: 'O(n²)', 
    best: 'O(n)', 
    average: 'O(n²)', 
    worst: 'O(n²)', 
    space: 'O(1)', 
    stable: 'Yes',
    code: `for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (compare(j, j + 1)) {
      swap(j, j + 1);
    }
  }
}`
  },
  { 
    id: 'selection', 
    name: 'Selection Sort', 
    complexity: 'O(n²)', 
    best: 'O(n²)', 
    average: 'O(n²)', 
    worst: 'O(n²)', 
    space: 'O(1)', 
    stable: 'No',
    code: `for (let i = 0; i < arr.length; i++) {
  let min = i;
  for (let j = i + 1; j < arr.length; j++) {
    if (compare(min, j)) {
      min = j;
    }
  }
  if (min !== i) swap(i, min);
}`
  },
  { 
    id: 'insertion', 
    name: 'Insertion Sort', 
    complexity: 'O(n²)', 
    best: 'O(n)', 
    average: 'O(n²)', 
    worst: 'O(n²)', 
    space: 'O(1)', 
    stable: 'Yes',
    code: `for (let i = 1; i < arr.length; i++) {
  let j = i;
  while (j > 0 && compare(j - 1, j)) {
    swap(j, j - 1);
    j--;
  }
}`
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    complexity: 'O(n log n)',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: 'No',
    code: `async function partition(low, high) {
  let pivot = high;
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (!compare(j, pivot)) {
      i++;
      swap(i, j);
    }
  }
  swap(i + 1, high);
  return i + 1;
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

await quickSort(0, arr.length - 1);`
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    complexity: 'O(n log n)',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: 'Yes',
    code: `async function merge(l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = [], R = [];
  for (let i = 0; i < n1; i++) L[i] = arr[l + i];
  for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j--;
    }
    swap(k, k); // Emit snapshot
    k++;
  }
  while (i < n1) { arr[k] = L[i]; i++; k++; swap(k-1, k-1); }
  while (j < n2) { arr[k] = R[j]; j++; k++; swap(k-1, k-1); }
}

async function mergeSort(l, r) {
  if (l >= r) return;
  let m = l + Math.floor((r - l) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);
  await merge(l, m, r);
}

await mergeSort(0, arr.length - 1);`
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    complexity: 'O(n log n)',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    stable: 'No',
    code: `async function heapify(n, i) {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && compare(l, largest)) largest = l;
  if (r < n && compare(r, largest)) largest = r;
  if (largest != i) {
    swap(i, largest);
    await heapify(n, largest);
  }
}

async function heapSort() {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    swap(0, i);
    await heapify(i, 0);
  }
}

await heapSort();`
  }
];
