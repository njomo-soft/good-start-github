import { useEffect, useState } from 'react';
import "./styles.css";
export default function App() {
  const [newItem, setNewItem] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [todos, setTodos] = useState(() => {
    const localvalue = localStorage.getItem("ITEMS")
    if (localvalue == null) return []

    return JSON.parse(localvalue)
  })

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function handleSubmit(e) {
    e.preventDefault()
    setDate(new Date());
    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title: newItem, completed: false },
      ]
    })

  }

  console.log(todos)

  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed }
        }
        return todo
      })
    })
  }

  function handleDatechange(e) {
    const newDate = new Date(e.target.value);
    console.log("this is the date part of the code")
    console.log(newDate);
    setDate(newDate);
  }

  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  const startClock = () => {
    if (intervalId) return;
    setIntervalId(setInterval(() => setTime(new Date()), 1000));
  };

  const stopClock = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const setAlarm = (e) => {
    e.preventDefault();
    const hours = parseInt(e.target.hours.value);
    const minutes = parseInt(e.target.minutes.value);
    setAlarmTime(new Date().setHours(hours, minutes));
  };

  const checkAlarm = () => {
    if (!alarmTime) return;
    if (time.getTime() >= alarmTime) alert('Do your task!');
  };


  return (
    <>
      <form onSubmit={handleSubmit} className='new-item-form'>
        <div className='form-row'>
          <label htmlFor='item'>New Item</label>
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            type='text' id='item' />
        </div>
        <div>
          <label htmlfor="due-date">Due date:</label>
          <input id="due-date" type="datetime-localecho "
            value={date.toISOString().slice(0, 16)}
            onChange={handleDatechange} />
        </div>
        <input type="date" name="date" placeholder="date" />
        <input type="time" name="time" placeholder="time" />
        <button className='btn'>Add</button>
      </form>
      <h1 className='header'>Junz Todo List</h1>
      <ul className='List'>
        {todos.length === 0 && "todo empty"}
        {todos.map(todo => {
          return (
            <li key={todo.id}>
              <label>
                <input type="checkbox"
                  checked={todo.completd}
                  onChange={e => toggleTodo(todo.id, e.target.checked)}
                />
                <p> {todo.title}</p>
                <p>
                  {/* {todo.date.tolocaleDateString()}
                  {todo.date.tolacaleTimeString()} */}
                </p>
              </label>
              <h5>{alarmTime}</h5>
              <button onClick={startClock}>Start</button>
              <button onClick={stopClock}>Pause</button>
              <form onSubmit={setAlarm}>
                <input type="number" name="hours" placeholder="Hours" />
                <input type="number" name="minutes" placeholder="Minutes" />
                <button type="submit">Set Alarm</button>
              </form>
              <button onClick={checkAlarm}>Check Alarm</button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className='btn btn-danger'>delete</button>
            </li>
          )
        })}

      </ul>
    </>
  )
}