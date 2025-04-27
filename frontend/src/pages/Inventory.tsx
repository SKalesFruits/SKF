import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  name: string;
  value: string;
}

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
  productcategories?: Category[];
}

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
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
  const [categoryCount, setCategoryCount] = useState<number>(0);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/products`
      );
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const count = parseInt(e.target.value) || 0;
    setCategoryCount(count);

    // Initialize or trim categories array based on count
    if (count > productCategories.length) {
      const newCategories = [...productCategories];
      while (newCategories.length < count) {
        newCategories.push({ name: "", value: "" });
      }
      setProductCategories(newCategories);
    } else {
      setProductCategories(productCategories.slice(0, count));
    }
  };

  const handleCategoryChange = (
    index: number,
    field: keyof Category,
    value: string
  ) => {
    const updatedCategories = [...productCategories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value,
    };
    setProductCategories(updatedCategories);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDNAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImageUrl(data.secure_url); // this is the image link
    setNewProduct((prev) => ({
      ...prev,
      image: data.secure_url,
    }));
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
      console.log(productCategories);
      const productToAdd = {
        ...newProduct,
        productcategories:
          productCategories.length > 0 ? productCategories : undefined,
      };
      console.log(productCategories);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/products`,
        productToAdd
      );
      setProducts([...products, { ...productToAdd, _id: response.data.id }]);
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
      setProductCategories([]);
      setCategoryCount(0);
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
        `${process.env.REACT_APP_API_BASE_URL}/api/products/${selectedProduct._id}`,
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
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`
      );
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
          placeholder="Selling Price"
          value={newProduct.price !== 0 ? newProduct.price : ""}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="number"
          name="buying_price"
          placeholder="Buying/Manufacture Price"
          value={newProduct.buying_price !== 0 ? newProduct.buying_price : ""}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && (
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={imageUrl}
            // onChange={handleInputChange}
            className="p-2 border rounded w-full mb-2"
          />
        )}
        <input
          type="text"
          name="category"
          placeholder="tropical / berries / core / exotic"
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
          value={newProduct.stock !== 0 ? newProduct.stock : ""}
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
        <div className="mb-4">
          <label className="block mb-2">Number of Categories:</label>
          <input
            type="number"
            min="0"
            value={categoryCount}
            onChange={handleCategoryCountChange}
            className="p-2 border rounded w-full mb-4"
          />

          {productCategories.map((category, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder={`Category Name ${index + 1}`}
                value={category.name}
                onChange={(e) =>
                  handleCategoryChange(index, "name", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder={`Category Value ${index + 1}`}
                value={category.value}
                onChange={(e) =>
                  handleCategoryChange(index, "value", e.target.value)
                }
                className="p-2 border rounded"
              />
            </div>
          ))}
        </div>
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
            {selectedProduct.productcategories && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Product Categories:</h3>
                <ul className="list-disc pl-5">
                  {selectedProduct.productcategories.map((cat, index) => (
                    <li key={index}>
                      {cat.name} ({cat.value})
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
