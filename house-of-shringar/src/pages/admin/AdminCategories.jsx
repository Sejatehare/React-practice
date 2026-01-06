import React, { useEffect, useState } from "react";
import { ref, push, remove, update, onValue } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const categoriesRef = ref(database, "categories");
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Please enter a category name!");
      return;
    }
    try {
      await push(ref(database, "categories"), { name });
      setName("");
      alert("✅ Category added successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await remove(ref(database, `categories/${id}`));
      alert("🗑️ Category deleted!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete category");
    }
  };

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdate = async () => {
    if (!editingName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }
    try {
      await update(ref(database, `categories/${editingId}`), { name: editingName });
      setEditingId(null);
      setEditingName("");
      alert("✅ Category updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update category");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Enter new category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-gray-500">No categories found.</div>
      ) : (
        <ul className="space-y-3">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex justify-between items-center card p-4 fade-up"
            >
              {editingId === c.id ? (
                <div className="flex w-full gap-3 items-center">
                  <input
                    type="text"
                    className="border rounded p-2 flex-1"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-gray-800">{c.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(c.id, c.name)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
