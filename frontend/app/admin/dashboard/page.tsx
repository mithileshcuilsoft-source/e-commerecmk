"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  ShoppingCart,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getVendors,
  blockVendor,
  unblockVendor,
  deleteVendor,
  getAllProducts,
  getAllUsers,
  getAllOrders,
  updateOrderStatus,
} from "@/api/admin";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  isBlocked: boolean;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  vendorId: {
    name: string;
    email: string;
  };
  images: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  image?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState({
    vendors: false,
    products: false,
    users: false,
    orders: false,
  });

  const [stats, setStats] = useState({
    totalVendors: 0,
    blockedVendors: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      router.push("/");
      return;
    }

    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Load all data in parallel
      const [vendorsData, productsData, usersData, ordersData] = await Promise.all([
        getVendors(),
        getAllProducts(),
        getAllUsers(),
        getAllOrders(),
      ]);

      setVendors(vendorsData);
      setProducts(productsData);
      setUsers(usersData);
      setOrders(ordersData);

      // Calculate stats
      const blockedVendors = vendorsData.filter((v: Vendor) => v.isBlocked).length;
      const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.total, 0);

      setStats({
        totalVendors: vendorsData.length,
        blockedVendors,
        totalProducts: productsData.length,
        totalUsers: usersData.length,
        totalOrders: ordersData.length,
        totalRevenue,
      });
    } catch (error) {
      console.error("Failed to load dash board data test:", error);
    }
  };

  const handleBlockVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to block this vendor?")) return;

    try {
      await blockVendor(vendorId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Failed to block vendor:", error);
    }
  };

  const handleUnblockVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to unblock this vendor?")) return;

    try {
      await unblockVendor(vendorId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Failed to unblock vendor:", error);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) return;

    try {
      await deleteVendor(vendorId);
      await loadDashboardData(); 
    } catch (error) {
      console.error("Failed to delete vendor:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string, note?: string) => {
    try {
      const statusData: any = { status: newStatus };
      if (trackingNumber) statusData.trackingNumber = trackingNumber;
      if (note) statusData.note = note;

      await updateOrderStatus(orderId, statusData);
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600 shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Manage your e-commerce platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
             <Button onClick={handleLogout} variant="outline" size="sm" className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 pb-20 sm:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
             <TabsList className="flex w-max sm:grid sm:w-full sm:grid-cols-5 min-w-full">
              <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
              <TabsTrigger value="vendors" className="px-6">Vendors</TabsTrigger>
              <TabsTrigger value="products" className="px-6">Products</TabsTrigger>
              <TabsTrigger value="users" className="px-6">Users</TabsTrigger>
              <TabsTrigger value="orders" className="px-6">Orders</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVendors}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 font-medium">{stats.blockedVendors}</span> blocked
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    Live storefront items
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Active customers
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    From {stats.totalOrders} successful orders
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.userId?.name}</p>
                          <p className="text-sm text-gray-500">{order._id.slice(-8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.total.toFixed(2)}</p>
                          <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Vendors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.slice(0, 5).map((vendor) => (
                      <div key={vendor._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={vendor.image} />
                            <AvatarFallback>{vendor.name?.charAt(0) || "V"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{vendor.name}</p>
                            <p className="text-sm text-gray-500">{vendor.email}</p>
                          </div>
                        </div>
                        <Badge variant={vendor.isBlocked ? "destructive" : "default"}>
                          {vendor.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Vendor Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {vendors.map((vendor) => (
                    <div key={vendor._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl gap-4 bg-white hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-gray-100">
                          <AvatarImage src={vendor.image} />
                          <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{vendor.name?.charAt(0) || "V"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-gray-900">{vendor.name || "Unknown Vendor"}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">{vendor.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge variant={vendor.isBlocked ? "destructive" : "default"} className="scale-90 origin-left">
                              {vendor.isBlocked ? "Blocked" : "Active"}
                            </Badge>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {vendor._id.slice(-6)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          {vendor.isBlocked ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnblockVendor(vendor._id)}
                              className="flex-1 sm:flex-none text-green-600 border-green-200 hover:bg-green-50 h-9"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlockVendor(vendor._id)}
                              className="flex-1 sm:flex-none text-orange-600 border-orange-200 hover:bg-orange-50 h-9"
                            >
                              <UserX className="w-3.5 h-3.5 mr-1.5" />
                              Block
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteVendor(vendor._id)}
                            className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 h-9"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  All Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4">
                      <div className="aspect-square w-full bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.images?.[0] || "/images/shoes5.jpg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">₹{product.price}</span>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Vendor: {product.vendorId?.name}
                      </p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  All Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name || "Unknown User"}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone || "No phone"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          user.role === "admin" ? "default" :
                          user.role === "vendor" ? "secondary" :
                          "outline"
                        }>
                          {user.role}
                        </Badge>
                        {user.isBlocked && (
                          <Badge variant="destructive">Blocked</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  All Orders ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((order:any) => (
                    <div key={order._id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-xl gap-6 bg-white hover:border-blue-100 transition-colors shadow-sm">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-gray-900">Order #{order._id.slice(-8)}</h3>
                           <Badge variant={
                            order.status === "delivered" ? "default" :
                            order.status === "cancelled" || order.status === "refunded" ? "destructive" :
                            order.status === "shipped" ? "secondary" :
                            "outline"
                          } className="md:hidden">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">{order.userId?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{order.userId?.email}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded mt-2">
                              🚢 {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 gap-4">
                        <div className="text-left md:text-right">
                          <p className="text-lg font-black text-gray-900 leading-none mb-1">₹{order.total.toFixed(2)}</p>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              let trackingNumber = "";
                              let note = "";

                              if (newStatus === "shipped") {
                                trackingNumber = prompt("Enter tracking number:", order.trackingNumber || "") || "";
                              }

                              note = prompt("Add a note (optional):", "") || "";

                              if (newStatus !== order.status) {
                                handleUpdateOrderStatus(order._id, newStatus, trackingNumber, note);
                              }
                            }}
                            className="px-2 py-1 border rounded-lg text-xs bg-gray-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                        <Badge variant={
                          order.status === "delivered" ? "default" :
                          order.status === "cancelled" || order.status === "refunded" ? "destructive" :
                          order.status === "shipped" ? "secondary" :
                          "outline"
                        } className="hidden md:inline-flex">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;