import { useState, useEffect } from 'react'

function App() {
  const [currentState, setCurrentState] = useState(null);  
  const [currentId, setCurrentId] = useState(null);  
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");  
  const [description, setDescription] = useState("");  
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    fetchingData()
  }, []);

  const handleSubmit = () => {
    fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        description: description,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchingData();
        setName("");
        setDescription("");
      })
      .catch((error) => console.error('Error:', error));    
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/items/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete');
        }
        return response.json();
      })
      .then(() => {
        // setItems(items.filter(item => item.id !== id));
        fetchingData();
      })
      .catch((err) => console.error('Error:', err));
  }; 
  
  const handleEdit = (id, index) => {
    setCurrentState(index);
    setCurrentId(id);
    setEditedName(items[index].name);
    setEditedDescription(items[index].description);
  };

  const handleAgainSubmit = (name, description) => {
    fetch(`http://localhost:3000/api/items/${currentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === currentId ? updatedItem : item)) // Replace the edited item
        );
        setEditedName('');
        setEditedDescription('');
        setCurrentState(null)
        // fetchingData();
      })
      .catch((err) => console.error('Error:', err));
  };  



  function fetchingData() {
    fetch('http://localhost:3000/api/items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setItems(data))
      .catch((err) => setError(err.message));
  };

  return (
    <>

      <div className="addForm">
        <h2>{currentState === null ? "Add new item" : "Edit this item" }</h2>
        {
          currentState === null ? (
            <div className="form-controls-wrap">
              <div className='form-controls'>
                <label>Name</label>
                <input type="text" value={name} onChange={(e)=> setName(e.target.value)} />
              </div>
              <div className='form-controls'>
                <label>Description</label>
                <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)} />
              </div>
              <button onClick={handleSubmit} disabled={!name || !description }>Submit</button>              
            </div>
          ) : (
            <div className="form-controls-wrap">
              <div className='form-controls'>
                <label>Name</label>
                <input type="text" value={editedName} onChange={(e)=> setEditedName(e.target.value)} />
              </div>
              <div className='form-controls'>
                <label>Description</label>
                <input type="text" value={editedDescription} onChange={(e)=> setEditedDescription(e.target.value)} />
              </div>
              <button onClick={() => handleAgainSubmit(editedName, editedDescription)}>Submit</button>  
            </div>           
          )
        }
      </div>

      <div>
        <h3>Item List</h3>
        {error && <p>Error: {error}</p>}
        <ul>
          {items.map((item, index) => (
            <li key={item.id}>
              {item.name}: {item.description}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
              <button onClick={() => handleEdit(item.id, index)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App
