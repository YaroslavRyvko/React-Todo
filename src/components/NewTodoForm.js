import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./NewTodoForm.css";

function NewTodoForm({createTodo}) {
  const [input, setInput] = useState("");
  const [textarea, setTextarea] = useState("");

  function inputChange(e) {
    setInput(e.target.value);
  }

  function textAreaChange(e) {
    setTextarea(e.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
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
    <form className="todo-form " onSubmit={handleSubmit}>
      <h2>Let’s create some tasks</h2>
      <input
        value={input}
        onChange={inputChange}
        type="text"
        placeholder="Title"
      />
      <textarea
        value={textarea}
        onChange={textAreaChange}
        type="text"
        placeholder="Description"
      ></textarea>
      <button>Add</button>
    </form>
  );
}

export default NewTodoForm;
