import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./NewTodoForm.css";

function NewTodoForm({ createTodo }) {
  const [input, setInput] = useState("");
  const [textarea, setTextarea] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);
  const [isTextareaValid, setIsTextareaValid] = useState(true);

  function inputChange(e) {
    if (!isInputValid) setIsInputValid(true);
    setInput(e.target.value);
  }

  function textAreaChange(e) {
    if (!isTextareaValid) setIsTextareaValid(true);
    setTextarea(e.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const isInputEmpty = !input.trim();
    const isTextareaEmpty = !textarea.trim();
    setIsInputValid(!isInputEmpty);
    setIsTextareaValid(!isTextareaEmpty);

    if (isInputEmpty || isTextareaEmpty) {
      return;
    }

    const newTodo = {
      id: uuidv4(),
      title: input,
      description: textarea,
      status: "todo",
    };

    createTodo(newTodo);
    setInput("");
    setTextarea("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>Let’s create some tasks</h2>
      <input
        value={input}
        onChange={inputChange}
        type="text"
        placeholder="Title"
      />
      {!isInputValid && (
        <div className="error-message">Title can't be empty</div>
      )}
      <textarea
        value={textarea}
        onChange={textAreaChange}
        placeholder="Description"
      ></textarea>
      {!isTextareaValid && (
        <div className="error-message">Description can't be empty</div>
      )}
      <button>Add</button>
    </form>
  );
}

export default NewTodoForm;
