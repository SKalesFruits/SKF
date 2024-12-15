import React, { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { products, categories } from "../data/products";
import { FilterState, Product } from "../types";

export const Shop = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    seasonal: false,
    organic: false,
    priceRange: [0, 100],
  });
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const getProducts = async () => {
      const res = await products();
      setItems(res);
    };
    getProducts();
  }, []);

  const filteredProducts = items.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category)
      return false;
    if (filters.seasonal && !product.seasonal) return false;
    if (filters.organic && !product.organic) return false;
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.seasonal}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      seasonal: e.target.checked,
                    }))
                  }
                  className="rounded text-green-500"
                />
                <span>Seasonal only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.organic}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      organic: e.target.checked,
                    }))
                  }
                  className="rounded text-green-500"
                />
                <span>Organic only</span>
              </label>
            </div>

            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
