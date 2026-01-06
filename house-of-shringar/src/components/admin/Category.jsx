import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories, createCategory, removeCategory, editCategory } from "../../store/categorySlice";

export default function Category() {
  const dispatch = useDispatch();
  const { items: categories = [], loading } = useSelector((state) => state.categories);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return alert("Enter a category name!");
    dispatch(createCategory({ name }));
    setNewCategory("");
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Delete this category? This will not delete products automatically.")) {
      dispatch(removeCategory(id));
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = () => {
    const name = editingName.trim();
    if (!name) return alert("Name cannot be empty");
    dispatch(editCategory({ id: editingId, data: { name } }));
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="mb-6 p-4 card p-4 fade-up">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold mb-2 text-gray-700">Manage Categories</h2>
        {loading && <small className="text-sm text-gray-400">loading...</small>}
      </div>

      {/* Add Category */}
      <div className="flex mb-3">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 rounded w-full mr-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2">
            {editingId === cat.id ? (
              <>
                <input
                  className="border p-1 rounded text-sm"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={saveEdit} className="text-sm px-2 py-1 rounded bg-accent text-white">Save</button>
                <button onClick={cancelEdit} className="text-sm px-2 py-1 rounded text-gray-600">Cancel</button>
              </>
            ) : (
              <>
                <span className="text-sm">{cat.name}</span>
                <button onClick={() => startEdit(cat)} className="text-sm px-2 py-1 rounded text-blue-600 hover:text-blue-800">✎</button>
                <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
