import { useState, useEffect } from 'react'
import type {FormEvent} from 'react'

//Definir os nossos dados
interface Item {
    id: number;
    name: string;
}

function App() {
  //Usar a interface para mostrar os nossos dados
  const [items, setItems] = useState<Item[]>([]);
  const [newName, setNewName] = useState<string>('');

    const fetchItems = () => {
        fetch('http://localhost:5000/api/items')
            .then(res => res.json())
            .then((data: Item[]) => setItems(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchItems();
    }, []);

    //O evento é um React FormEvent
    const handleAdd = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newName) return;

        fetch('http://localhost:5000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        }).then(() => {
            setNewName('');
            fetchItems();
        });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:5000/api/items/${id}`, {
            method: 'DELETE'
        }).then(() => {
            fetchItems();
        });
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
            <h1>My TS CRUD App</h1>

            <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Add a new item..."
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
            </form>

            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {items.map((item) => (
                    <li key={item.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.name}</span>
                        <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App;
