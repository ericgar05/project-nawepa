import { useState, useEffect } from "react";
import { InventoryContext } from "./InventoryContext";

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState([]); // Descomentado y inicializado
  const [inventoryByCategory, setInventoryByCategory] = useState({});
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const LOW_STOCK_THRESHOLD = 10; // Umbral para considerar stock bajo

  // Función para recargar los productos desde el servidor
  const fetchProducts = async () => {
    try {
      const productsResponse = await fetch("http://localhost:4000/inventario");
      const productsData = await productsResponse.json();
      if (productsResponse.ok) {
        setProducts(productsData);
      } else {
        console.error(
          "Error al recargar productos:",
          productsData.error || "Error desconocido"
        );
      }
    } catch (error) {
      console.error("Error de red al recargar productos:", error);
    }
  };

  // useEffect para cargar datos iniciales desde el backend
  useEffect(() => {
    // Función para cargar las categorías
    const fetchCategorias = async () => {
      try {
        const categoriasResponse = await fetch(
          "http://localhost:4000/categorias"
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

    fetchProducts(); // Carga los productos
    fetchCategorias(); // Carga las categorías
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // useEffect para calcular el inventario por categoría cuando los productos cambian
  useEffect(() => {
    const categoryTotals = products.reduce((acc, product) => {
      // Obtenemos el nombre de la categoría del producto
      const categoryName = product.categoria_nombre;

      // Si la categoría ya existe en el acumulador, sumamos el stock
      if (acc[categoryName]) {
        acc[categoryName] += product.stock;
      } else {
        // Si no, la inicializamos con el stock del producto actual
        acc[categoryName] = product.stock;
      }
      return acc;
    }, {});

    setInventoryByCategory(categoryTotals);
  }, [products]); // Se ejecuta cada vez que la lista de productos cambia

  // useEffect para calcular las alertas de stock bajo
  useEffect(() => {
    const alerts = products.filter(
      (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
    );
    setLowStockAlerts(alerts);
  }, [products]); // Se ejecuta cada vez que la lista de productos cambia

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

      // En lugar de añadir el producto devuelto, volvemos a pedir la lista completa.
      // Esto asegura que el nuevo producto tenga el 'categoria_nombre' del JOIN.
      await fetchProducts();
      return responseData;
    } catch (error) {
      console.error("Error de conexión o inesperado:", error);
      throw error;
    }
  };

  const value = {
    products,
    categorias, // Expuesto en el contexto
    inventoryByCategory, // Exponemos el nuevo estado
    lowStockAlerts, // Exponemos las alertas
    handleProduct,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
