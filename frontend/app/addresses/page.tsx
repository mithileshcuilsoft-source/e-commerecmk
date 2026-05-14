"use client";

import { useEffect, useState } from "react";
import { createAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from "@/api/address";

const defaultFormState = {
  type: "home",
  street: "",
  city: "",
  state: "",
  pinCode: "",
  country: "",
  isDefault: false,
};

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [form, setForm] = useState(defaultFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        await updateAddress(editingId, form);
        setMessage("Address updated successfully.");
      } else {
        await createAddress(form);
        setMessage("Address added successfully.");
      }
      setForm(defaultFormState);
      setEditingId(null);
      await loadAddresses();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Unable to save address.");
    } finally {
      setLoading(false);
    }
  };

  const editAddress = (address: any) => {
    setEditingId(address._id);
    setForm({
      type: address.type?.toLowerCase(),
      street: address.street,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      country: address.country,
      isDefault: !!address.isDefault,
    });
    setMessage("");
  };

  const removeAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      await loadAddresses();
      setMessage("Address removed.");
    } catch (error) {
      console.error(error);
    }
  };

  const markDefaultAddress = async (id: string) => {
    try {
      await setDefaultAddress(id);
      await loadAddresses();
      setMessage("Default address updated.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-15">
      <h1 className="text-3xl font-bold mb-6">Manage Addresses</h1>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add or edit address</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium">Address type</span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium">Street</span>
              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">City</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">State</span>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">PIN Code</span>
              <input
                name="pinCode"
                value={form.pinCode}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Country</span>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>

            <label className="flex items-center gap-3 mt-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={Boolean(form.isDefault)}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm">Set as default address</span>
            </label>

            {message && <p className="text-sm text-green-600">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Update address" : "Save address"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your saved addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-gray-500">No saved addresses yet.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address._id} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{address.type}</p>
                          {address.isDefault && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.city}, {address.state}, {address.pinCode}, {address.country}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-right">
                        <button
                          onClick={() => editAddress(address)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeAddress(address._id)}
                          className="text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                        {!address.isDefault && (
                          <button
                            onClick={() => markDefaultAddress(address._id)}
                            className="text-indigo-600 hover:underline"
                          >
                            Set default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddressesPage;
