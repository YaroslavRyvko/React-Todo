import React, { useState } from "react";
import DeleteIcon from "../icons/deleteIcon";
import EditIcon from "../icons/editIcon";
import "./Todo.css";

function Todo({ todo, remove, update, drag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  const handleClick = (evt) => {
    remove(evt.target.id);
  };
  
  const handleUpdate = (evt) => {
    evt.preventDefault();
    update(todo.id, title, description);
    toggleFrom();
  };

  const toggleFrom = () => {
    setIsEditing(!isEditing);
  };

  const handleChangeTitle = (evt) => {
    setTitle(evt.target.value);
  };

  const handleChangeDescription = (evt) => {
    setDescription(evt.target.value);
  };

  let result;
  if (isEditing) {
    result = (
      <div className="todo-item">
        <form className="todo-item--form" onSubmit={handleUpdate}>
          <input onChange={handleChangeTitle} value={title} type="text" />
          <textarea
            onChange={handleChangeDescription}
            value={description}
          ></textarea>
          <button>Save</button>
        </form>
      </div>
    );
  } else {
    result = (
      <div
        id={todo.id}
        className={todo.completed ? "todo-item completed" : "todo-item"}
        draggable="true"
        data-id={todo.id}
        onDragStart={drag}
      >
        <div className="todo-item--info">
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
        </div>
        <div className="todo-item--buttons">
          <button onClick={toggleFrom}>
            <EditIcon />
          </button>
          <button onClick={handleClick} id={todo.id}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    );
  }
  return result;
}

export default Todo;
