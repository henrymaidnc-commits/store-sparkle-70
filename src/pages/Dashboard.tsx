import { products } from "@/data/mockData";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";

const statusConfig = {
  "in-stock": { label: "In Stock", icon: CheckCircle2, className: "status-in-stock" },
  "low-stock": { label: "Low Stock", icon: AlertTriangle, className: "status-low-stock" },
  "out-of-stock": { label: "Out of Stock", icon: XCircle, className: "status-out-of-stock" },
};

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "price">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products
    .filter(
      (p) =>
        (categoryFilter === "All" || p.category === categoryFilter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.distributor.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") return mult * a.name.localeCompare(b.name);
      if (sortBy === "stock") return mult * (a.stock - b.stock);
      return mult * (a.price - b.price);
    });

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-primary", bg: "bg-primary/15" },
    { label: "In Stock", value: products.filter((p) => p.status === "in-stock").length, icon: CheckCircle2, color: "text-success", bg: "bg-success/15" },
    { label: "Low Stock", value: products.filter((p) => p.status === "low-stock").length, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/15" },
    { label: "Out of Stock", value: products.filter((p) => p.status === "out-of-stock").length, icon: XCircle, color: "text-destructive", bg: "bg-destructive/15" },
  ];

  const toggleSort = (col: "name" | "stock" | "price") => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage products, stock levels and distributor assignments</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-glass rounded-xl p-4 flex items-center gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Table */}
      <div className="card-glass rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or distributors..."
              className="w-64 rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {[
                  { label: "Product", col: "name" as const },
                  { label: "Category" },
                  { label: "Price", col: "price" as const },
                  { label: "Stock", col: "stock" as const },
                  { label: "Status" },
                  { label: "Distributor" },
                  { label: "Batch #" },
                ].map(({ label, col }) => (
                  <th
                    key={label}
                    onClick={col ? () => toggleSort(col) : undefined}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${col ? "cursor-pointer hover:text-foreground" : ""}`}
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      {col && <ArrowUpDown className="h-3 w-3" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => {
                const { label, icon: Icon, className } = statusConfig[product.status];
                return (
                  <tr key={product.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {product.price.toLocaleString()}đ
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
                        <Icon className="h-3 w-3" />
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{product.distributor}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.batchNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No products found.
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
