import { useState } from 'react';

export default function Todo() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    //res message,error state
    const [message, setMsg] = useState("");
    const [error, setErr] = useState("");

    const apiUrl = "http://localhost:8000"

    const handleSubmit = () => {
        console.log("Submit clicked");
        if (title.trim() !== '' && description.trim() !== '') {
            //pass tot he api
            fetch(apiUrl + '/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    debugger
                    //add in the todos array
                    setTodos([...todos, { title, description }])
                    setMsg("Item added Successfully")
                } else {
                    setErr("Error while creating in DB")
                }
            })



        }
    }


    return <>
        <div className="row p-3 bg-success text-light">
            <h1>Todo Lists Project using MERN</h1>
        </div>
        <div className="row p-2">
            <h3>ADD Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input type="text" onChange={(event) => setTitle(event.target.value)} value={title} className="form-control" placeholder="Title" />
                <input type="text" onChange={(event) => setDescription(event.target.value)} value={description} className="form-control" placeholder="Description" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className='text-danger'>{error}</p>}
        </div>
    </>
}