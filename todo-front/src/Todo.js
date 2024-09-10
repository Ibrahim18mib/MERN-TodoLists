import { useEffect, useState } from 'react';

export default function Todo() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(-1);
    //res message,error state
    const [message, setMsg] = useState("");
    const [error, setErr] = useState("");

    const apiUrl = "http://localhost:8000"

    const handleSubmit = () => {
        console.log("Submit clicked");
        setErr("");
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
                    setTitle("");
                    setDescription("");
                    setMsg("Item added Successfully");
                    setTimeout(() => {
                        setMsg("");
                    }, 2000);
                } else {
                    setErr("Error while creating in DB")
                }
            }).catch(() => {
                setErr("Unable to create todo lists");
            })



        }
    }

    useEffect(() => {
        getAllItems();
    }, [])

    const getAllItems = () => {
        fetch(apiUrl + "/todos").then((res1) => res1.json()).then((res2) => {
            setTodos(res2);
        })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);

    }

    const handleUpdate = () => {
        console.log("Update clicked");
        setErr("");
        debugger
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            //pass tot he api
            fetch(apiUrl + '/todos/' + editId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    debugger
                    //update in the todos array
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setDescription("");
                    setMsg("Item Updated Successfully");
                    setTimeout(() => {
                        setMsg("");
                    }, 2000);
                    setEditId(-1);
                } else {
                    setErr("Error while Updating in DB")
                }
            }).catch(() => {
                setErr("Unable to Update todo lists");
            })



        }
    }

    const handleDelete = (id) => {
        if (window.confirm("are you sure to delete?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE"
            }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            })
        }

    }

    const handleEditCancel = () => {
        setEditId(-1);
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
        <div className='row mt-3'>
            <h2>Tasks</h2>
            <div className='col-md-6'>
                <ul className='list-group'>
                    {
                        todos.map((item) =>

                            <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2'>
                                <div className='d-flex flex-column gap-2 me-2'>
                                    {
                                        editId === -1 || editId !== item._id ?
                                            <>
                                                <span className='fw-bold'>{item?.title}</span>
                                                <span>{item?.description}</span>
                                            </> :
                                            <>
                                                <div className="form-group d-flex gap-2">
                                                    <input type="text" onChange={(event) => setEditTitle(event.target.value)} value={editTitle} className="form-control" placeholder="Title" />
                                                    <input type="text" onChange={(event) => setEditDescription(event.target.value)} value={editDescription} className="form-control" placeholder="Description" />
                                                </div>
                                            </>
                                    }

                                </div>

                                <div className='d-flex gap-2'>
                                    {editId === -1 || editId !== item._id ? <button className='btn btn-primary' onClick={() => handleEdit(item)}>Edit</button> :
                                        <button className='btn btn-secondary' onClick={handleUpdate}>Update</button>}
                                    {editId === -1 || editId !== item._id ? <button className='btn btn-warning' onClick={() => handleDelete(item._id)}>Delete</button> : <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>}

                                </div>
                            </li>
                        )
                    }

                </ul>
            </div>

        </div>
    </>
}