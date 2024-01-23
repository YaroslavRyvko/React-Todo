import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  updateDoc,
  arrayUnion,
  doc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Components
import Todo from "../components/Todo";
import NewTodoForm from "../components/NewTodoForm";
import CircleBar from "../components/CircleBar";
import Header from "../components/Header";
import Preloader from "../components/Preloader";

//Styles
import "./TodoList.css";

function TodoList() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("home page user accesss = true");
      } else {
        navigate("/login");
      }
    });
  }, []);

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("id", "==", user.uid));

    getDocs(userQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setTodos(doc.data().tasks || []);
        });
      })
      .catch((error) => {
        console.error("Error getting documents:", error);
      });
  }, [user, todos]);

  const todosDone = todos.filter((todo) => todo.status === "done");
  const todosTodo = todos.filter((todo) => todo.status === "todo");

  let progress = Math.round((todosDone.length / todos.length) * 100);

  const create = (newTodo) => {
    const todoRef = doc(collection(db, "users"), user.uid);
    updateDoc(todoRef, {
      tasks: arrayUnion(newTodo),
    });

    setTodos([...todos, newTodo]);
  };

  const remove = async (id) => {
    try {
      const todoRef = doc(collection(db, "users"), user.uid);
      const snapshot = await getDoc(todoRef);
      const userData = snapshot.data();

      const updatedTasks = userData.tasks.filter((task) => task.id !== id);

      await updateDoc(todoRef, {
        tasks: updatedTasks,
      });

      setTodos(updatedTasks);
    } catch (error) {
      console.error("Error removing task:", error.message);
    }
  };

  const update = async (id, updatedTitle, updatedDescription) => {
    try {
      const todoRef = doc(collection(db, "users"), user.uid);
      const snapshot = await getDoc(todoRef);
      const userData = snapshot.data();

      const updatedTasks = userData.tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title: updatedTitle,
            description: updatedDescription,
          };
        }
        return task;
      });

      await updateDoc(todoRef, {
        tasks: updatedTasks,
      });

      setTodos(updatedTasks);
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  const dragEnter = (event) => {
    event.currentTarget.classList.add("drop");
  };

  const dragLeave = (event) => {
    event.currentTarget.classList.remove("drop");
  };

  const drag = (event) => {
    event.dataTransfer.setData("text/plain", event.currentTarget.dataset.id);
  };

  const drop = async (event) => {
    try {
      const column = event.currentTarget.dataset.column;
      const id = event.dataTransfer.getData("text/plain");
      event.currentTarget.classList.remove("drop");

      event.preventDefault();

      const todoRef = doc(collection(db, "users"), user.uid);
      const snapshot = await getDoc(todoRef);
      const userData = snapshot.data();

      const updatedTasks = userData.tasks.map((task) => {
        if (task.id === id) {
          task.status = column;
        }
        return task;
      });

      await updateDoc(todoRef, {
        tasks: updatedTasks,
      });

      setTodos(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  const allowDrop = (event) => {
    event.preventDefault();
  };

  const dragStart = (event) => {
    if (event.target.className.includes("todo-item")) {
      event.target.classList.add("dragging");
    }
  };

  const dragEnd = (event) => {
    if (event.target.className.includes("todo-item")) {
      event.target.classList.remove("dragging");
    }
  };

  useEffect(() => {
    document.addEventListener("dragstart", dragStart);
    document.addEventListener("dragend", dragEnd);

    return () => {
      document.removeEventListener("dragstart", dragStart);
      document.removeEventListener("dragend", dragEnd);
    };
  }, []);

  const todosListDone = todosDone.map((todo) => (
    <Todo
      key={todo.id}
      update={update}
      remove={remove}
      todo={todo}
      drag={drag}
    />
  ));

  const todosListTodo = todosTodo.map((todo) => (
    <Todo
      key={todo.id}
      update={update}
      remove={remove}
      todo={todo}
      drag={drag}
    />
  ));

  return (
    <div className="todo-list">
      <Header />
      <Preloader />
      <div className="todo-dashboard">
        <NewTodoForm createTodo={create} />
        <CircleBar value={progress || 0} />
      </div>
      <div className="todo-container">
        <div
          className="board board-todo"
          data-column={"todo"}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDragOver={allowDrop}
          onDrop={drop}
        >
          <h2 className="title-s">To Do</h2>
          <div className="board-list">{todosListTodo}</div>
        </div>
        <div className="board-separator"></div>
        <div
          className="board board-done"
          data-column={"done"}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDragOver={allowDrop}
          onDrop={drop}
        >
          <h2 className="title-s">Done</h2>
          <div className="board-list">{todosListDone}</div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
