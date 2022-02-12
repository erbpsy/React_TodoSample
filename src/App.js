import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from './components/accordian';
import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TodoInput: '',
      TodoList: [],
    };
  }

  componentDidMount() {
    this.GetTodoList();
  }

  // update state on change for todo item
  handletodoChange = (e) => {
    this.setState({ TodoInput: e.target.value })
  }

  // get todo list items
  GetTodoList = async () => {
    const response = await fetch('/GetTodoList');
    const data = await response.json();
    let result = [];
    let todolistitems = [];
    let subtasksitems = [];

    data.map((value, index) => {
      if (todolistitems.filter(e => e.todoid === value.todoid).length <= 0) {
        todolistitems.push({
          todoid: value.todoid,
          title: value.title,
          status: value.todostatus,
          created_at: value.created_at,
          subtasks: subtasksitems
        });
      }
    });

    todolistitems.map((value, index) => {
      subtasksitems = [];
      data.filter(e => e.todoid === value.todoid).map((item, index) => {
        if (item.subtasktitle != null)
          subtasksitems.push({ title: item.subtasktitle, todoid: item.todoid, status: item.subtaskstatus });
      })
      value.subtasks = subtasksitems;
      result.push(value);
    })

    if (response.status !== 200) {
      throw Error(data.message)
    }

    this.setState({ TodoList: result })
    return result;
  };

  // add todo item
  AddTodo = async () => {
    if (this.state.TodoInput !== '') {
      const body = { id: 1, title: this.state.TodoInput, status: 'completed', created_at: '' };
      const response = await fetch('/todos', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      console.log(response);
    }

    // set todoinput value back to empty
    this.setState({ TodoInput: '' })

     // get todo list items to show newly added item on ui
    this.GetTodoList();
  }

  render() {
    return (
      <div className="wrapper">
        <h1>Todo App</h1>
        <input onChange={this.handletodoChange} value={this.state.TodoInput} 
        placeholder='What to do ?' id="txttodoitem" type='text'></input>
        <button id="btnAddNewTodo" onClick={this.AddTodo} >New List</button>
        <div className='add-space'></div>
        {this.state.TodoList.map((todo, index) => (
          <Accordion  key={index} todo={todo} GetTodoList={this.GetTodoList}></Accordion>
        ))}
      </div>
    );
  }
}

export default App;