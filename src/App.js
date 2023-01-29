import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import {usePrevious} from "./customHooks.js"

import FilterButton from "./components/FilterButton";
import TaskAddForm from "./components/TaskAddForm";
import Todo from "./components/Todo";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTask(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
    // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  const tasksNoun = tasks.length !== 1 ? 'tasks' : 'task';
  const headingText = `${tasks.length} ${tasksNoun} listed`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);  

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <TaskAddForm onSubmit={addTask} />
      <div className="filters btn-group stack-exception">
        {
          FILTER_NAMES.map(name => <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}/>
          )
        }
      </div>
      <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {
          tasks
          .filter(FILTER_MAP[filter])
          .map(task => <Todo 
            {...task}
            key={task.id}
            onChange={toggleTask}
            deleteTask={deleteTask}
            editTask={editTask}/>
          )
        }
      </ul>
    </div>
  );
}

export default App;