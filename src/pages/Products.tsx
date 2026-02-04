import { useEffect, useState } from "react"
import { getProducts } from "../api/product"
import { Product } from "../types/product"
import ProductCard from "../components/ProductCard"
import { postCheckout } from "../api/checkout"

interface CartItem {
  product: Product
  qty: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [ordering, setOrdering] = useState(false)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
   loadProducts()
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exist = prev.find(item => item.product.id === product.id)
      if (exist) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const updateQty = (productId: number, qty: number) => {
    if (qty < 1) return
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, qty } : item
      )
    )
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  )

  const checkout = async () => {
    if (cart.length === 0) return

    const payload = cart.map(item => ({
      product_id: item.product.id,
      quantity: item.qty,
    }))

    try {
      setOrdering(true)
      await postCheckout(payload)

      alert("Transaksi berhasil 🎉")
      setCart([])
      await loadProducts()
    } catch (err) {
      console.error(err)
      alert("Gagal melakukan transaksi")
    } finally {
      setOrdering(false)
    }
  }

  if (loading) return <p>Loading produk...</p>

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ flex: 2 }}>
        <h1>Daftar Produk</h1>
        {products.map(p => (
          <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
        ))}
      </div>
      {/* KERANJANG */}
      <div style={{
        flex: 1,
        border: "1px solid #ddd",
        padding: 15,
        borderRadius: 8,
        height: "fit-content"
      }}>
        <h2>Keranjang</h2>

        {cart.length === 0 && <p>Belum ada produk</p>}

        {cart.map(item => (
          <div key={item.product.id} style={{ marginBottom: 10 }}>
            <strong>{item.product.name}</strong>
            <div>
              <button onClick={() => updateQty(item.product.id, item.qty - 1)}>-</button>
              <span style={{ margin: "0 10px" }}>{item.qty}</span>
              <button onClick={() => updateQty(item.product.id, item.qty + 1)}>+</button>
            </div>
            <small>
              Rp {(item.product.price * item.qty).toLocaleString()}
            </small>
          </div>
        ))}

        <hr />
        <h3>Total: Rp {totalPrice.toLocaleString()}</h3>

        <button
          onClick={checkout}
          disabled={cart.length === 0 || ordering}
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            background: ordering ? "gray" : "green",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {ordering ? "Memproses..." : "Place Order"}
        </button>
      </div>
    </div>
  )
}
