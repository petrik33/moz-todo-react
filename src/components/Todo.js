import React, { useEffect, useRef, useState } from "react";
import { usePrevious } from "../customHooks.js";

export default function Todo(props) {
    const changeHandler = (event) => {
        props.onChange(props.id);
    }

    const deleteHandler = (event) => {
        props.deleteTask(props.id)
    }

    const editHandler = (event) => {
        setEditing(true);
    }

    const cancelEditHandler = (event) => {
        setEditing(false);
    }

    const editChangeHandler = (event) => {
        setNewName(event.target.value);
    }

    const editSubmitHander = (event) => {
        event.preventDefault();
        props.editTask(props.id, newName);
        setNewName("");
        setEditing(false);
    }

    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');

    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);

    const wasEditing = usePrevious(isEditing);

    const editingTemplate = (
        <form className="stack-small" onSubmit={editSubmitHander}>
          <div className="form-group">
            <label className="todo-label" htmlFor={props.id}>
              New name for {props.name}
            </label>
            <input id={props.id} className="todo-text" type="text" 
            onChange={editChangeHandler}
            ref={editFieldRef}/>
          </div>
          <div className="btn-group">
            <button type="button" className="btn todo-cancel"
            onClick={cancelEditHandler}>
              Cancel
              <span className="visually-hidden">renaming {props.name}</span>
            </button>
            <button type="submit" className="btn btn__primary todo-edit">
              Save
              <span className="visually-hidden">new name for {props.name}</span>
            </button>
          </div>
        </form>
    );

    const viewTemplate = (
        <div className="stack-small">
            <div className="c-cb">
                <input
                id={props.id}
                type="checkbox"
                defaultChecked={props.completed}
                onChange={changeHandler}
                />
                <label className="todo-label" htmlFor={props.id}>
                {props.name}
                </label>
            </div>
            <div className="btn-group">
                <button type="button" className="btn"
                onClick={editHandler}
                ref={editButtonRef}
                >
                Edit <span className="visually-hidden">{props.name}</span>
                </button>
                <button
                type="button"
                className="btn btn__danger"
                onClick={deleteHandler}
                >
                Delete <span className="visually-hidden">{props.name}</span>
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        if (!wasEditing && isEditing) {
            editFieldRef.current.focus();
            return;
        }
        if(wasEditing && !isEditing) {
            editButtonRef.current.focus();
        }
    }, [isEditing, wasEditing]);      

    return (
        <li className="todo stack-small">
            {isEditing ? editingTemplate : viewTemplate}
        </li>
    );
}  
