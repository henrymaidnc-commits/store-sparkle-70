import { products } from "@/data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutGrid, List, Package, ArrowRight, Filter } from "lucide-react";

type Status = "in-stock" | "low-stock" | "out-of-stock";

const statusConfig: Record<Status, { label: string; className: string }> = {
  "in-stock": { label: "In Stock", className: "status-in-stock" },
  "low-stock": { label: "Low Stock", className: "status-low-stock" },
  "out-of-stock": { label: "Out of Stock", className: "status-out-of-stock" },
};

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 35k", min: 0, max: 35000 },
  { label: "35k – 50k", min: 35000, max: 50000 },
  { label: "50k+", min: 50000, max: Infinity },
];

type SortKey = "name" | "price-asc" | "price-desc" | "stock";

export default function Products() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("name");

  const range = priceRanges[priceRange];
  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      const matchPrice = p.price >= range.min && p.price <= range.max;
      const matchAvail = !availableOnly || p.status !== "out-of-stock";
      return matchSearch && matchCat && matchPrice && matchAvail;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {products.length} products
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded p-1.5 transition-colors ${viewMode === "grid" ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded p-1.5 transition-colors ${viewMode === "list" ? "bg-card text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glass rounded-xl p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, description..."
              className="w-full rounded-lg border border-border bg-muted pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="name">Sort: Name</option>
            <option value="price-asc">Sort: Price ↑</option>
            <option value="price-desc">Sort: Price ↓</option>
            <option value="stock">Sort: Stock ↓</option>
          </select>
          {/* Available only */}
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="accent-primary"
            />
            Available only
          </label>
        </div>

        {/* Category + Price filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex flex-wrap gap-1">
            {priceRanges.map((r, i) => (
              <button
                key={i}
                onClick={() => setPriceRange(i)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                  priceRange === i
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground bg-muted"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => {
            const { label, className } = statusConfig[product.status];
            const outOfStock = product.status === "out-of-stock";
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="card-glass rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] flex flex-col cursor-pointer"
              >
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${outOfStock ? "opacity-50" : ""}`}
                  />
                  <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
                    {label}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="flex items-center gap-1 rounded-full bg-card/90 px-3 py-1.5 text-xs font-semibold text-primary">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1 gap-1.5">
                  <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
                  <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-primary">{product.price.toLocaleString()}đ</span>
                    <span className="text-xs text-muted-foreground">{product.stock} units</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filtered.map((product) => {
            const { label, className } = statusConfig[product.status];
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="card-glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition-all duration-200 group hover:shadow-[0_0_16px_hsl(var(--primary)/0.12)]"
              >
                <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>{label}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="text-sm font-bold text-primary">{product.price.toLocaleString()}đ</p>
                  <p className="text-xs text-muted-foreground">{product.stock} units</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Package className="h-10 w-10 opacity-30" />
          <p>No products match your filters.</p>
        </div>
      )}
    </div>
  );
}
