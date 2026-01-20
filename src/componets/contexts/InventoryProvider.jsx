import { useState, useEffect } from "react";
import { InventoryContext } from "./InventoryContext";

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inventoryByCategory, setInventoryByCategory] = useState({});
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const LOW_STOCK_THRESHOLD = 10;

  const fetchProducts = async () => {
    try {
      const productsResponse = await fetch("http://localhost:4000/inventario");
      const productsData = await productsResponse.json();
      if (productsResponse.ok) {
        setProducts(productsData);
      } else {
        console.error(
          "Error al recargar productos:",
          productsData.error || "Error desconocido",
        );
      }
    } catch (error) {
      console.error("Error de red al recargar productos:", error);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasResponse = await fetch(
          "http://localhost:4000/categorias",
        );
        const categoriasData = await categoriasResponse.json();
        if (categoriasResponse.ok) {
          setCategorias(categoriasData);
        } else {
          console.error("Error al cargar categorías:", categoriasData.error);
        }
      } catch (error) {
        console.error("Error de red al cargar categorías:", error);
      }
    };

    fetchProducts();
    fetchCategorias();
  }, []);
  useEffect(() => {
    const categoryTotals = products.reduce((acc, product) => {
      const categoryName = product.categoria_nombre;

      if (acc[categoryName]) {
        acc[categoryName] += product.stock;
      } else {
        acc[categoryName] = product.stock;
      }
      return acc;
    }, {});

    setInventoryByCategory(categoryTotals);
  }, [products]);
  useEffect(() => {
    const alerts = products.filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD,
    );
    setLowStockAlerts(alerts);
  }, [products]);

  const handleProduct = async (formInventory) => {
    console.log("Datos del inventario:", formInventory);
    try {
      const response = await fetch("http://localhost:4000/inventario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInventory),
      });
      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.error || "Error desconocido al agregar producto.";
        console.error("Error del servidor al agregar producto:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Producto agregado exitosamente:", responseData);

      await fetchProducts();
      return responseData;
    } catch (error) {
      console.error("Error de conexión o inesperado:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:4000/inventario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Error al actualizar el producto",
        );
      }

      await fetchProducts();
      return responseData;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  };

  const value = {
    handleProduct,
    updateProduct,
    products,
    categorias,
    inventoryByCategory,
    lowStockAlerts,
    fetchProducts,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
