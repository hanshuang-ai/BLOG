---
title: React核心基础与实践指南
date: 2023-09-10 00:00:00
tags: [react, hooks, 组件, 状态管理, jsx]
categories: 前端开发
updated: 2019-12-06 18:30:00
---

# React核心基础与实践指南

React是当今最流行的前端框架之一，它通过组件化的方式让我们能够构建用户界面。本文将系统性地介绍React的核心概念，包括组件、Props、State、生命周期、Hooks等，并通过实际案例展示如何构建React应用。

## 1. React基础概念

### 1.1 什么是React？

React是一个用于构建用户界面的JavaScript库，由Facebook开发并维护。它的主要特点包括：

- **组件化**：将UI拆分为独立的、可复用的组件
- **虚拟DOM**：通过虚拟DOM提高渲染性能
- **单向数据流**：数据从父组件流向子组件
- **声明式编程**：描述UI应该是什么样子，而不是如何操作DOM

### 1.2 JSX语法

JSX是JavaScript的语法扩展，允许我们在JavaScript中编写类似HTML的代码：

```jsx
// JSX语法示例
const element = <h1>Hello, React!</h1>;

// 在JSX中使用JavaScript表达式
const name = 'React';
const element = <h1>Hello, {name}!</h1>;

// JSX中的条件渲染
const isLoggedIn = true;
const greeting = isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>;

// JSX中的列表渲染
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>{number}</li>
);
```

## 2. React组件详解

### 2.1 组件命名规范

**重要规则：React组件的名称必须以大写字母开头！**

```jsx
// 正确的组件命名
function MyComponent() {
  return <div>Hello World</div>;
}

const UserProfile = () => {
  return <div>User Profile</div>;
};

// 错误的组件命名（以小写字母开头）
function myComponent() {  // ❌ 错误
  return <div>Hello World</div>;
}

// 小写字母开头的会被认为是HTML标签，而不是React组件
```

### 2.2 函数组件与类组件

#### 函数组件（推荐）
```jsx
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 箭头函数组件
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 更简洁的箭头函数组件
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;
```

#### 类组件
```jsx
import React from 'react';

class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 2.3 组件的返回值规则

**如果你的组件返回的JSX和return关键字不在同一行，必须使用括号包裹：**

```jsx
// ✅ 正确：单行返回
const SimpleComponent = () => <div>Hello World</div>;

// ✅ 正确：多行返回使用括号
const MultiLineComponent = () => (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// ❌ 错误：多行返回没有使用括号
const WrongComponent = () =>  // 这会导致语法错误
  <div>
    <h1>Title</h1>
  </div>;
```

## 3. Props与State

### 3.1 Props（属性）

Props是父组件传递给子组件的数据，是只读的：

```jsx
// 父组件
function App() {
  return (
    <div>
      <Welcome name="Alice" age={25} />
      <Welcome name="Bob" age={30} />
    </div>
  );
}

// 子组件
function Welcome(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Age: {props.age}</p>
    </div>
  );
}

// 使用解构赋值简化Props
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}
```

### 3.2 State（状态）

State是组件内部的数据，可以随时间变化：

```jsx
import React, { useState } from 'react';

// 使用useState Hook
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## 4. React Hooks

### 4.1 useState

```jsx
// 基础用法
const [state, setState] = useState(initialValue);

// 数字状态
const [count, setCount] = useState(0);

// 字符串状态
const [name, setName] = useState('React');
```

### 4.2 useEffect

```jsx
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}
```

## 5. 事件处理

### 5.1 基础事件处理

```jsx
function Button() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}

// 带参数的事件处理
function Button() {
  const handleClick = (message) => {
    alert(message);
  };

  return (
    <button onClick={() => handleClick('Hello from button!')}>
      Click me
    </button>
  );
}
```

## 6. 实际项目案例：待办事项应用

```jsx
import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="todo-filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({activeTodosCount})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({todos.filter(todo => todo.completed).length})
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

## 7. 总结

通过本文的学习，我们全面掌握了React的核心概念和实战技巧：

1. **组件基础**：理解了函数组件和类组件的区别，掌握了JSX语法
2. **Props与State**：学会了如何传递数据和管理局部状态
3. **Hooks**：掌握了useState、useEffect等常用Hooks的使用
4. **事件处理**：了解了React中的事件处理机制
5. **实际应用**：通过完整的待办事项应用掌握了React项目开发

React的学习曲线相对平缓，但要真正掌握需要大量的实践。建议在学习过程中多动手编写代码，尝试不同的功能实现，逐步提升React开发能力。
