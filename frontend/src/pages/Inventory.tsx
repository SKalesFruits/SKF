import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  name: string;
  value: string;
  image: string; // Added image field to Category interface
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
        newCategories.push({ name: "", value: "", image: "" });
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

    try {
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
    } catch (err) {
      setError("Failed to upload image");
    }
  };

  // New function for category image uploads
  const handleCategoryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDNAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      const imageUrl = data.secure_url;

      // Update the specific category's image
      handleCategoryChange(index, "image", imageUrl);
    } catch (err) {
      setError(`Failed to upload image for category ${index + 1}`);
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
      const productToAdd = {
        ...newProduct,
        productcategories:
          productCategories.length > 0 ? productCategories : undefined,
      };
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
      setImageUrl(null);
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

        <div className="mb-4">
          <label className="block mb-2">Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          {imageUrl && (
            <div className="mt-2">
              <img
                src={imageUrl}
                alt="Product preview"
                className="h-20 w-20 object-cover rounded"
              />
              <input
                type="text"
                name="image"
                value={imageUrl}
                className="p-2 border rounded w-full mt-2"
                readOnly
              />
            </div>
          )}
        </div>

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
        <label className="block mb-4">
          <input
            type="checkbox"
            name="organic"
            checked={newProduct.organic}
            onChange={handleInputChange}
          />{" "}
          Organic
        </label>

        <div className="border-t border-gray-300 pt-4 mb-4">
          <label className="block font-medium mb-2">Product Categories:</label>
          <input
            type="number"
            min="0"
            value={categoryCount}
            onChange={handleCategoryCountChange}
            className="p-2 border rounded w-full mb-4"
            placeholder="Number of categories"
          />

          {productCategories.map((category, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <h4 className="font-medium mb-2">Category {index + 1}</h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={category.name}
                  onChange={(e) =>
                    handleCategoryChange(index, "name", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Category Value"
                  value={category.value}
                  onChange={(e) =>
                    handleCategoryChange(index, "value", e.target.value)
                  }
                  className="p-2 border rounded"
                />
              </div>

              <div className="mt-2">
                <label className="block mb-1 text-sm">Category Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCategoryImageUpload(e, index)}
                  className="mb-2"
                />
                {category.image && (
                  <div className="mt-2">
                    <img
                      src={category.image}
                      alt={`Category ${index + 1} preview`}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <input
                      type="text"
                      value={category.image}
                      className="p-2 border rounded w-full mt-1 text-sm"
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addProduct}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
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
              <div className="flex items-center">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 object-cover rounded mr-3"
                  />
                )}
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p>₹{product.price}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
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

            <div className="mb-2">
              {selectedProduct.image && (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-20 w-20 object-cover rounded mb-2"
                />
              )}
              <input
                type="text"
                name="image"
                value={selectedProduct.image}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>

            <input
              type="number"
              name="stock"
              value={selectedProduct.stock}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            />
            <textarea
              name="description"
              value={selectedProduct.description}
              onChange={handleInputChange}
              className="p-2 border rounded w-full mb-2"
            ></textarea>

            {selectedProduct.productcategories &&
              selectedProduct.productcategories.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Product Categories:</h3>
                  <div className="space-y-3">
                    {selectedProduct.productcategories.map((cat, index) => (
                      <div key={index} className="border p-2 rounded">
                        <p>
                          <span className="font-medium">Name:</span> {cat.name}
                        </p>
                        <p>
                          <span className="font-medium">Value:</span>{" "}
                          {cat.value}
                        </p>
                        {cat.image && (
                          <div className="mt-1">
                            <span className="font-medium">Image:</span>
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="h-12 w-12 object-cover rounded mt-1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors mr-2"
              >
                Cancel
              </button>
              <button
                onClick={updateProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
