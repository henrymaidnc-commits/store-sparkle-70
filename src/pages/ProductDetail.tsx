import { products } from "@/data/mockData";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  Layers,
  Truck,
  Hash,
  ShoppingCart,
  MessageCircle,
  ChevronRight,
  Star,
  Share2,
} from "lucide-react";

type Status = "in-stock" | "low-stock" | "out-of-stock";

const statusConfig: Record<Status, { label: string; className: string; dot: string }> = {
  "in-stock": {
    label: "In Stock",
    className: "status-in-stock",
    dot: "bg-[hsl(var(--success))]",
  },
  "low-stock": {
    label: "Low Stock",
    className: "status-low-stock",
    dot: "bg-[hsl(var(--warning))]",
  },
  "out-of-stock": {
    label: "Out of Stock",
    className: "status-out-of-stock",
    dot: "bg-[hsl(var(--destructive))]",
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground animate-fade-in">
        <Package className="h-12 w-12 opacity-30" />
        <p className="text-lg font-medium">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="rounded-xl bg-primary/15 border border-primary/30 px-4 py-2 text-sm text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const { label, className, dot } = statusConfig[product.status];
  const outOfStock = product.status === "out-of-stock";

  // Related products (same category, exclude current)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-xs text-muted-foreground">{product.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left – Image */}
        <div className="space-y-4">
          <div className="card-glass rounded-2xl overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover ${outOfStock ? "opacity-60" : ""}`}
            />
          </div>
          {/* Thumbnail strip (using same image as placeholder) */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-16 w-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
                  i === 0 ? "border-primary" : "border-border hover:border-primary/50"
                }`}
              >
                <img src={product.image} alt="" className="h-full w-full object-cover opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* Right – Info */}
        <div className="space-y-5">
          {/* Category + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {product.category}
            </span>
            <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          </div>

          {/* Name & price */}
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{product.name}</h1>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-primary">{product.price.toLocaleString()}đ</span>
              <span className="text-sm text-muted-foreground line-through">
                {(product.price * 1.2).toLocaleString()}đ
              </span>
              <span className="rounded-full bg-destructive/15 text-destructive text-xs font-semibold px-2 py-0.5">
                -17%
              </span>
            </div>
            {/* Fake stars */}
            <div className="mt-2 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(24 reviews)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card-glass rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Batch Number
              </div>
              <p className="text-sm font-mono font-semibold text-foreground">{product.batchNumber}</p>
            </div>
            <div className="card-glass rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                Stock Level
              </div>
              <p className="text-sm font-semibold text-foreground">{product.stock} units</p>
            </div>
            <div className="card-glass rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                Distributor
              </div>
              <p className="text-sm font-semibold text-foreground">{product.distributor}</p>
            </div>
            <div className="card-glass rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                Category
              </div>
              <p className="text-sm font-semibold text-foreground">{product.category}</p>
            </div>
          </div>

          {/* Stock bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Availability</span>
              <span>{product.stock} / 200 units</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  outOfStock
                    ? "bg-[hsl(var(--destructive))]"
                    : product.status === "low-stock"
                    ? "bg-[hsl(var(--warning))]"
                    : "bg-[hsl(var(--success))]"
                }`}
                style={{ width: `${Math.min((product.stock / 200) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              Request Info
            </button>
            <button className="rounded-xl border border-border bg-muted p-3 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Related Products</h2>
            <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((rel) => {
              const relStatus = statusConfig[rel.status];
              return (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/products/${rel.id}`)}
                  className="card-glass rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${relStatus.className}`}>
                      {relStatus.label}
                    </span>
                    <h4 className="text-xs font-semibold text-foreground line-clamp-2 mt-1">{rel.name}</h4>
                    <p className="text-xs font-bold text-primary">{rel.price.toLocaleString()}đ</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
