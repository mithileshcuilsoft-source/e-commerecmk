"use client";

import React, { FormEvent, useState } from "react";
import { createProduct } from "@/api/productapi";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AddProductForm = () => {
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Electronics",
    price: 0, 
    stock: 0,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [variants, setVariants] = useState([
    {
      name: "", 
      options: [
        { value: "", priceModifier: 0, stock: 0 },
      ],
    },
  ]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setProduct({
      ...product,
      [name]: name === "price" || name === "stock"
        ? Number(value)
        : value,
    });
  };

  const handleVariantName = (index: number, value: string) => {
    const updated = [...variants];
    updated[index].name = value;
    setVariants(updated);
  };

  const handleOptionChange = (
    vIndex: number,
    oIndex: number,
    field: string,
    value: string
  ) => {
    const updated = [...variants];

    updated[vIndex].options[oIndex] = {
      ...updated[vIndex].options[oIndex],
      [field]:
        field === "priceModifier" || field === "stock"
          ? Number(value)
          : value,
    };

    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "", options: [{ value: "", priceModifier: 0, stock: 0 }] },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };
  const addOption = (vIndex: number) => {
    const updated = [...variants];
    updated[vIndex].options.push({
      value: "",
      priceModifier: 0,
      stock: 0,
    });
    setVariants(updated);
  };

  const removeOption = (vIndex: number, oIndex: number) => {
    const updated = [...variants];
    updated[vIndex].options = updated[vIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setVariants(updated);
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("variants", JSON.stringify(variants));
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      await createProduct(formData);

      toast.success("Product created!");

      // reset
      setProduct({
        name: "",
        description: "",
        category: "Electronics",
        price: 0,
        stock: 0,
      });
      setThumbnail(null);
      setVariants([
        { name: "", options: [{ value: "", priceModifier: 0, stock: 0 }] },
      ]);

    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto p-6 space-y-6 mt-15">
  

      <div>
        <h1 className="text-3xl font-bold">Add Product</h1>
        <p className="text-gray-500 text-sm">Create a new product with variants</p>
      </div>
  
  
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
  
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
  
          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category"
            className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
  
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="Base Price"
            className="p-3 border rounded-xl"
          />

  
          <input
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="p-3 border rounded-xl"
          />
        </div>
      </div>
  
  
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">Product Image</h2>
  
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-white"
        />
      </div>

      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Variants</h2>
  
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-green-600"
          >
            <Plus size={16} /> Add Variant
          </button>
        </div>
  
        {variants.map((variant, vIndex) => (
          <div key={vIndex} className="border rounded-xl p-4 space-y-3">

            <input
              placeholder="Variant Name (Size, Color)"
              value={variant.name}
              onChange={(e) =>
                handleVariantName(vIndex, e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            />
  
            {variant.options.map((opt, oIndex) => (
              <div key={oIndex} className="grid grid-cols-4 gap-2 items-center">
  
                <input
                  placeholder="Value"
                  value={opt.value}
                  onChange={(e) =>
                    handleOptionChange(vIndex, oIndex, "value", e.target.value)
                  }
                  className="p-2 border rounded"
                />
  
                <input
                  type="number"
                  placeholder="+Price"
                  onChange={(e) =>
                    handleOptionChange(vIndex, oIndex, "priceModifier", e.target.value)
                  }
                  className="p-2 border rounded"
                />
  
                <input
                  type="number"
                  placeholder="Stock"
                  onChange={(e) =>
                    handleOptionChange(vIndex, oIndex, "stock", e.target.value)
                  }
                  className="p-2 border rounded"
                />
  
                <button
                  type="button"
                  onClick={() => removeOption(vIndex, oIndex)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
  
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => addOption(vIndex)}
                className="text-blue-500 text-sm"
              >
                + Add Option
              </button>
  
              <button
                type="button"
                onClick={() => removeVariant(vIndex)}
                className="text-red-500 text-sm"
              >
                Remove Variant
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Create Product
        </button>
      </div>
  
    </form>
  );
};

export default AddProductForm;