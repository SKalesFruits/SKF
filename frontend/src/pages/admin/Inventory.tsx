import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id?: string;
  name: string;
  price: number;
  buying_price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  seasonal: boolean;
  organic: boolean;
}

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    buying_price: 0,
    image: "",
    category: "",
    description: "",
    stock: 0,
    seasonal: false,
    organic: false,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (selectedProduct) {
      setSelectedProduct((prev) =>
        prev ? { ...prev, [name]: type === "checkbox" ? checked : value } : null
      );
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        newProduct
      );
      setProducts([...products, { ...newProduct, _id: response.data.id }]);
      setNewProduct({
        name: "",
        price: 0,
        buying_price: 0,
        image: "",
        category: "",
        description: "",
        stock: 0,
        seasonal: false,
        organic: false,
      });
    } catch (err) {
      setError("Failed to add product");
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const updateProduct = async () => {
    if (!selectedProduct || !selectedProduct._id) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/products/${selectedProduct._id}`,
        selectedProduct
      );

      setProducts(
        products.map((product) =>
          product._id === selectedProduct._id ? selectedProduct : product
        )
      );

      setEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      setError("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          name="buying_price"
          placeholder="Buying/Manufacture Price"
          value={newProduct.buying_price}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        ></textarea>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <label className="block">
          <input
            type="checkbox"
            name="seasonal"
            checked={newProduct.seasonal}
            onChange={handleInputChange}
          />{" "}
          Seasonal
        </label>
        <label className="block">
          <input
            type="checkbox"
            name="organic"
            checked={newProduct.organic}
            onChange={handleInputChange}
          />{" "}
          Organic
        </label>
        <button
          onClick={addProduct}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li
              key={product._id}
              className="p-4 bg-white shadow rounded-lg mb-2 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p>₹{product.price}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              name="name"
              value={selectedProduct.name}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="number"
              name="price"
              value={selectedProduct.price}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              name="image"
              value={selectedProduct.image}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="number"
              name="stock"
              value={selectedProduct.stock}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <input
              type="text"
              name="description"
              value={selectedProduct.description}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={updateProduct}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
