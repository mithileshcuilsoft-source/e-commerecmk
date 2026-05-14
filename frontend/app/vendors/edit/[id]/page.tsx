"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/api/productapi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "Electronics",
    price: 0,
    stock: 0,
  });
  const [variants, setVariants] = useState<any[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct({
          name: productData.name || "",
          description: productData.description || "",
          category: productData.category || "Electronics",
          price: productData.price || 0,
          stock: productData.stock || 0,
        });
        setVariants(productData.variants || []);
        setExistingImage(productData.images?.[0] || "");
      } catch (error) {
        console.error(error);
        toast.error("Unable to load product details.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
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

      await updateProduct(id, formData);
      toast.success("Product updated successfully.");
      router.push("/vendors/vendor-dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-3">
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 border rounded"
            required
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded"
          />

          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border rounded"
            required
          />

          <input
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-3 border rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="mt-2 w-full text-sm text-white file:mr-4 file:rounded file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>

          {existingImage && !thumbnail && (
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Current thumbnail</p>
              <img src={existingImage} alt="Current thumbnail" className="max-w-xs rounded" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
