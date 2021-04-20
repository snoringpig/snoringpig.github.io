class Stack {
  constructor() {
    this.data = [];
    this.top = 0;
  }
  push(element) {
    this.data[this.top] = element;
    this.top += 1;
  }
  peek() {
    return this.data[this.top - 1];
  }
  pop() {
    this.top -= 1;
    this.data.pop();
  }
}

class Queue {
  constructor() {
    this.data = [];
  }
  push(element) {
    this.data.push(element);
  }
  peek() {
    return this.data.length == 0 ? undefined : this.data[0];
  }
  dequeue() {
    this.data.shift();
  }
}