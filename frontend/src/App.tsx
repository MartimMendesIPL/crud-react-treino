import { useState, useEffect } from "react";
import type { FormEvent } from "react";

interface Item {
    id: number;
    name: string;
}

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [newName, setNewName] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>("");

    const fetchItems = () => {
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data: Item[]) => setItems(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newName.trim()) return;
        fetch("http://localhost:5000/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        }).then(() => {
            setNewName("");
            fetchItems();
        });
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:5000/api/items/${id}`, {
            method: "DELETE",
        }).then(() => fetchItems());
    };

    const handleEdit = (id: number) => {
        fetch(`http://localhost:5000/api/items/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editingName }),
        }).then(() => {
            setEditingId(null);
            fetchItems();
        });
    };

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "500px" }}>
            <h1>My TS CRUD App</h1>

            <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Add a new item..."
                    style={{ padding: "8px", marginRight: "10px" }}
                />
                <button type="submit" style={{ padding: "8px 16px" }}>Add</button>
            </form>

            <ul style={{ listStyleType: "none", padding: 0 }}>
                {items.map((item) => (
                    <li key={item.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", gap: "8px" }}>
                        {editingId === item.id ? (
                            <>
                                <input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    style={{ padding: "6px", flex: 1 }}
                                    autoFocus
                                />
                                <button onClick={() => handleEdit(item.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{item.name}</span>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    <button onClick={() => { setEditingId(item.id); setEditingName(item.name); }}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ color: "red" }}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
