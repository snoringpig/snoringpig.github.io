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