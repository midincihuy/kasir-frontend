import type { Product } from "../types/product"

interface Props {
  product: Product
  onAdd: () => void
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: 12,
      borderRadius: 8,
      marginBottom: 10
    }}>
      <h3>{product.name}</h3>
      <p>Harga: Rp {product.price.toLocaleString()}</p>
      <p>Stok: {product.stock}</p>
      <button
        onClick={onAdd}
        style={{
          marginTop: 8,
          padding: "6px 10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}
      >
        + Keranjang
      </button>
    </div>
  )
}
