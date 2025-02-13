import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");  
  const [description, setDescription] = useState("");  

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
        console.log(data);
        fetchingData();
        setName("");
        setDescription("");
      })
      .catch((error) => console.error('Error:', error));    
  }

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
  }

  return (
    <>

      <div className="addForm">
        <div className='form-controls'>
          <label>Name</label>
          <input type="text" value={name} onChange={(e)=> setName(e.target.value)} />
        </div>
        <div className='form-controls'>
          <label>Description</label>
          <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)} />
        </div>
        <button onClick={handleSubmit} disabled={!name || !description}>Submit</button>                
      </div>

      <div>
        <h1>Item List</h1>
        {error && <p>Error: {error}</p>}
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name}: {item.description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App
