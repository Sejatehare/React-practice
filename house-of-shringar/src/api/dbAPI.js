import axios from "axios";

const DB_URL = "https://e-commerce-bd80c-default-rtdb.firebaseio.com";

const dbUrl = (path = "", token = "") => {
  const base = DB_URL.replace(/\/$/, "");
  return token
    ? `${base}/${path}.json?auth=${token}`
    : `${base}/${path}.json`;
};

const handleError = (functionName, error) => {
  console.error(
    `${functionName} Error:`,
    error.response?.data || error.message
  );
  throw error;
};

const mapFirebaseData = (data) => {
  if (!data) return [];
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
};

const getRequest = async (path, token) => {
  const { data } = await axios.get(dbUrl(path, token));
  return data;
};

const postRequest = async (path, payload, token) => {
  const { data } = await axios.post(
    dbUrl(path, token),
    payload
  );
  return data;
};

const putRequest = async (path, payload, token) => {
  const { data } = await axios.put(
    dbUrl(path, token),
    payload
  );
  return data;
};

const patchRequest = async (path, payload, token) => {
  const { data } = await axios.patch(
    dbUrl(path, token),
    payload
  );
  return data;
};

const deleteRequest = async (path, token) => {
  const { data } = await axios.delete(
    dbUrl(path, token)
  );
  return data;
};


export async function setUserInDB(uid, userObj, token) {
  try {
    return await putRequest(`users/${uid}`, userObj, token);
  } catch (error) {
    handleError("setUserInDB", error);
  }
}

export async function getUserFromDB(uid, token) {
  try {
    return await getRequest(`users/${uid}`, token);
  } catch (error) {
    handleError("getUserFromDB", error);
  }
}

export async function getAllUsers(token) {
  try {
    return await getRequest("users", token);
  } catch (error) {
    handleError("getAllUsers", error);
  }
}


export async function fetchProducts() {
  try {
    const data = await getRequest("products");
    return mapFirebaseData(data);
  } catch (error) {
    handleError("fetchProducts", error);
  }
}

export async function addProduct(product) {
  try {
    const data = await postRequest("products", product);

    return {
      id: data.name,
      ...product,
    };
  } catch (error) {
    handleError("addProduct", error);
  }
}

export async function updateProduct(id, updatedData) {
  try {
    await putRequest(`products/${id}`, updatedData);

    return {
      id,
      ...updatedData,
    };
  } catch (error) {
    handleError("updateProduct", error);
  }
}

export async function deleteProduct(id) {
  try {
    await deleteRequest(`products/${id}`);
    return id;
  } catch (error) {
    handleError("deleteProduct", error);
  }
}


export async function fetchCategories() {
  try {
    const data = await getRequest("categories");
    return mapFirebaseData(data);
  } catch (error) {
    handleError("fetchCategories", error);
  }
}

export async function addCategory(category) {
  try {
    const data = await postRequest("categories", category);

    return {
      id: data.name,
      ...category,
    };
  } catch (error) {
    handleError("addCategory", error);
  }
}

export async function updateCategory(id, updatedData) {
  try {
    await putRequest(`categories/${id}`, updatedData);

    return {
      id,
      ...updatedData,
    };
  } catch (error) {
    handleError("updateCategory", error);
  }
}

export async function deleteCategory(id) {
  try {
    await deleteRequest(`categories/${id}`);
    return id;
  } catch (error) {
    handleError("deleteCategory", error);
  }
}

export async function fetchOrders() {
  try {
    const data = await getRequest("orders");
    return mapFirebaseData(data);
  } catch (error) {
    handleError("fetchOrders", error);
  }
}

export async function placeOrder(order) {
  try {
    const orderData = {
      ...order,
      status: order.status ?? "Pending",
      createdAt: order.createdAt ?? new Date().toISOString(),
    };

    const data = await postRequest("orders", orderData);

    return {
      id: data.name,
      ...orderData,
    };
  } catch (error) {
    handleError("placeOrder", error);
  }
}

export async function updateOrder(id, updatedData) {
  try {
    await putRequest(`orders/${id}`, updatedData);

    return {
      id,
      ...updatedData,
    };
  } catch (error) {
    handleError("updateOrder", error);
  }
}

export async function fetchUserOrders(userId) {
  try {
    const orders = await fetchOrders();

    return orders.filter(
      ({ userId: orderUserId }) => orderUserId === userId
    );
  } catch (error) {
    handleError("fetchUserOrders", error);
  }
}

export async function addToWishlist(userId, product) {
  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    await putRequest(
      `wishlist/${userId}/${product.id}`,
      product
    );

    return product;
  } catch (error) {
    handleError("addToWishlist", error);
  }
}

export async function removeFromWishlist(userId, productId) {
  try {
    if (!userId) {
      throw new Error("Missing userId");
    }

    await deleteRequest(
      `wishlist/${userId}/${productId}`
    );

    return productId;
  } catch (error) {
    handleError("removeFromWishlist", error);
  }
}

export async function fetchWishlist(userId) {
  try {
    if (!userId) return [];

    const data = await getRequest(`wishlist/${userId}`);

    return mapFirebaseData(data);
  } catch (error) {
    handleError("fetchWishlist", error);
  }
}


export async function submitProductRating(productId, rating) {
  try {
    const product = await getRequest(`products/${productId}`);

    if (!product) {
      throw new Error("Product not found");
    }

    const oldRating = product.rating ?? 0;
    const oldCount = product.ratingCount ?? 0;

    const newCount = oldCount + 1;

    const newRating =
      ((oldRating * oldCount) + rating) / newCount;

    await patchRequest(`products/${productId}`, {
      rating: Number(newRating.toFixed(1)),
      ratingCount: newCount,
    });

    return {
      rating: Number(newRating.toFixed(1)),
      ratingCount: newCount,
    };
  } catch (error) {
    handleError("submitProductRating", error);
  }
}

export async function markOrderItemRated(orderId, productId) {
  try {
    const items =
      (await getRequest(`orders/${orderId}/items`)) || [];

    const updatedItems = items.map((item) =>
      item.id === productId
        ? { ...item, rated: true }
        : item
    );

    await putRequest(
      `orders/${orderId}/items`,
      updatedItems
    );

    return updatedItems;
  } catch (error) {
    handleError("markOrderItemRated", error);
  }
}
