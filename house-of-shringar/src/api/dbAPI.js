import axios from "axios";

const DB_URL = "https://e-commerce-bd80c-default-rtdb.firebaseio.com/";

function dbUrl(path = "", token) {
  const base = DB_URL.replace(/\/$/, "");
  if (token) return `${base}/${path}.json?auth=${token}`;
  return `${base}/${path}.json`;
}

export async function setUserInDB(uid, userObj, token) {
  try {
    const url = dbUrl(`users/${uid}`, token);
    const res = await axios.put(url, userObj);
    return res.data;
  } catch (err) {
    console.error("setUserInDB error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getUserFromDB(uid, token) {
  try {
    const url = dbUrl(`users/${uid}`, token);
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("getUserFromDB error:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAllUsers(token) {
  try {
    const url = dbUrl("users", token);
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("getAllUsers error:", err.response?.data || err.message);
    throw err;
  }
}

export async function fetchProducts() {
  try {
    const url = dbUrl("products");
    const res = await axios.get(url);
    return res.data
      ? Object.entries(res.data).map(([id, val]) => ({ id, ...val }))
      : [];
  } catch (err) {
    console.error("fetchProducts error:", err.response?.data || err.message);
    throw err;
  }
}

export async function addProduct(product) {
  try {
    const url = dbUrl("products");
    const res = await axios.post(url, product);
    return { id: res.data.name, ...product };
  } catch (err) {
    console.error("addProduct error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateProduct(id, updatedData) {
  try {
    const url = dbUrl(`products/${id}`);
    await axios.put(url, updatedData);
    return { id, ...updatedData };
  } catch (err) {
    console.error("updateProduct error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteProduct(id) {
  try {
    const url = dbUrl(`products/${id}`);
    await axios.delete(url);
    return id;
  } catch (err) {
    console.error("deleteProduct error:", err.response?.data || err.message);
    throw err;
  }
}

export async function fetchCategories() {
  try {
    const url = dbUrl("categories");
    const res = await axios.get(url);
    return res.data
      ? Object.entries(res.data).map(([id, val]) => ({ id, ...val }))
      : [];
  } catch (err) {
    console.error("fetchCategories error:", err.response?.data || err.message);
    throw err;
  }
}

export async function addCategory(category) {
  try {
    const url = dbUrl("categories");
    const res = await axios.post(url, category);
    return { id: res.data.name, ...category };
  } catch (err) {
    console.error("addCategory error:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteCategory(id) {
  try {
    const url = dbUrl(`categories/${id}`);
    await axios.delete(url);
    return id;
  } catch (err) {
    console.error("deleteCategory error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateCategory(id, updatedData) {
  try {
    const url = dbUrl(`categories/${id}`);
    await axios.put(url, updatedData);
    return { id, ...updatedData };
  } catch (err) {
    console.error("updateCategory error:", err.response?.data || err.message);
    throw err;
  }
}


export async function fetchOrders() {
  try {
    const url = dbUrl("orders");
    const res = await axios.get(url);
    return res.data
      ? Object.entries(res.data).map(([id, val]) => ({ id, ...val }))
      : [];
  } catch (err) {
    console.error("fetchOrders error:", err.response?.data || err.message);
    throw err;
  }
}


export async function placeOrder(order) {
  try {
    const orderWithMeta = {
      ...order,
      status: order.status || "Pending",
      createdAt: order.createdAt || new Date().toISOString(),
    };
    const url = dbUrl("orders");
    const res = await axios.post(url, orderWithMeta);
    return { id: res.data.name, ...orderWithMeta };
  } catch (err) {
    console.error("placeOrder error:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateOrder(id, updatedData) {
  try {
    const url = dbUrl(`orders/${id}`);
    await axios.put(url, updatedData);
    return { id, ...updatedData };
  } catch (err) {
    console.error("updateOrder error:", err.response?.data || err.message);
    throw err;
  }
}


export async function fetchUserOrders(uid) {
  try {
    const all = await fetchOrders();
    return all.filter((o) => o.userId === uid);
  } catch (err) {
    console.error("fetchUserOrders error:", err.response?.data || err.message);
    throw err;
  }
}


export async function addToWishlist(userId, product) {
  try {
    if (!userId) throw new Error("Missing userId");
    const url = dbUrl(`wishlist/${userId}/${product.id}`);
    await axios.put(url, product); 
    return product;
  } catch (err) {
    console.error("addToWishlist error:", err.response?.data || err.message);
    throw err;
  }
}

export async function removeFromWishlist(userId, productId) {
  try {
    if (!userId) throw new Error("Missing userId");
    const url = dbUrl(`wishlist/${userId}/${productId}`);
    await axios.delete(url);
    return productId;
  } catch (err) {
    console.error("removeFromWishlist error:", err.response?.data || err.message);
    throw err;
  }
}

export async function fetchWishlist(userId) {
  try {
    if (!userId) return [];
    const url = dbUrl(`wishlist/${userId}`);
    const res = await axios.get(url);
    return res.data ? Object.entries(res.data).map(([id, val]) => ({ id, ...val })) : [];
  } catch (err) {
    console.error("fetchWishlist error:", err.response?.data || err.message);
    throw err;
  }
}

export async function submitProductRating(productId, rating) {
  const productUrl = dbUrl(`products/${productId}`);
  const res = await axios.get(productUrl);
  const product = res.data;

  const oldRating = product.rating || 0;
  const oldCount = product.ratingCount || 0;

  const newCount = oldCount + 1;
  const newRating =
    ((oldRating * oldCount) + rating) / newCount;

  await axios.patch(productUrl, {
    rating: Number(newRating.toFixed(1)),
    ratingCount: newCount
  });
}

export async function markOrderItemRated(orderId, productId) {
  const url = dbUrl(`orders/${orderId}/items`);
  const res = await axios.get(url);
  const items = res.data.map(it =>
    it.id === productId ? { ...it, rated: true } : it
  );
  await axios.put(url, items);
}
