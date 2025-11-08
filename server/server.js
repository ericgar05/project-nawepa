import express from "express";
import db from "./db.js";
import cors from "cors";

export const app = express();

export const PORT = 4000;

app.use(cors());
app.use(express.json());

// Ruta para obtener todo el inventario
app.get("/inventario", async (req, res) => {
  try {
    const result = await db.query({
      text: `
        SELECT 
          i.id, i.nombre_producto, i.codigo_producto, i.fecha_entrada, i.stock,
          c.categoryname AS categoria_nombre, i.categoria_id
        FROM inventario i
        JOIN categorias c ON i.categoria_id = c.id
        ORDER BY i.fecha_entrada DESC
      `,
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener el inventario" });
  }
});

// Ruta para eliminar un producto del inventario
app.delete("/inventario/:id", async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del producto desde la URL

  try {
    const result = await db.query({
      text: "DELETE FROM inventario WHERE id = $1 RETURNING *;",
      params: [id],
    });

    if (result.rowCount === 0) {
      // Si no se eliminó ninguna fila, el producto no existía
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Si se eliminó, respondemos con éxito.
    // Gracias a ON DELETE CASCADE, los movimientos asociados se borraron automáticamente.
    res
      .status(200)
      .json({
        message: "Producto eliminado exitosamente.",
        deletedProduct: result.rows[0],
      });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al eliminar el producto." });
  }
});

// Ruta para obtener las categorías
app.get("/categorias", async (req, res) => {
  try {
    // Asumiendo que tienes una tabla 'categorias' con 'id' y 'categoryname'
    const result = await db.query({
      text: "SELECT id, categoryname FROM categorias ORDER BY categoryname ASC",
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener categorías" });
  }
});

// Ruta para obtener los niveles de usuario
app.get("/niveles", async (req, res) => {
  try {
    const result = await db.query({
      text: "SELECT id, levelsName, levelDescripcion AS levelsdescription FROM niveles ORDER BY levelsName ASC",
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener niveles:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener niveles" });
  }
});

// Ruta para obtener todo el personal
app.get("/personal", async (req, res) => {
  try {
    const result = await db.query({
      text: "SELECT id, nombre, apellido, cargo FROM personal ORDER BY nombre ASC",
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener personal:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al obtener el personal" });
  }
});
// --- Rutas existentes ---

app.post("/login", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario y contraseña son obligatorios" });
    }

    const result = await db.query({
      text: `SELECT 
            usuarios.id, 
            usuarios.username, 
            usuarios.userpassword,
            niveles.id AS nivel_id,
            niveles.levelsName AS nivel_nombre,
            niveles.levelDescripcion AS nivel_descripcion
            FROM usuarios 
            JOIN permisos ON usuarios.id = permisos.usuario_id
            JOIN niveles ON permisos.nivel_id = niveles.id
            WHERE usuarios.username = $1;`,
      params: [nombre],
    });

    const user = result.rows[0];
    if (!user || user.userpassword !== password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: user.id,
        name: user.username,
        nivel_id: user.nivel_id,
        nivel_nombre: user.nivel_nombre,
        nivel_descripcion: user.nivel_descripcion,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al intentar iniciar sesión" });
  }
});

app.post("/inventario", async (req, res) => {
  try {
    const {
      nombre_producto,
      codigo_producto,
      fecha_entrada,
      categoria_id,
      stock,
    } = req.body;

    if (
      !nombre_producto ||
      !codigo_producto ||
      !fecha_entrada ||
      !categoria_id ||
      stock === undefined ||
      stock < 0
    ) {
      return res.status(400).json({
        error:
          "Todos los campos son obligatorios y el stock no puede ser negativo.",
      });
    }

    const existingProduct = await db.query({
      text: "SELECT * FROM inventario WHERE codigo_producto = $1",
      params: [codigo_producto],
    });

    let result;

    if (existingProduct.rows.length > 0) {
      console.log(
        `Producto existente encontrado. Actualizando stock para ${codigo_producto}.`
      );
      result = await db.query({
        text: `
          WITH updated AS (
            UPDATE inventario 
            SET stock = stock + $1, fecha_entrada = $2 
            WHERE codigo_producto = $3 
            RETURNING *
          )
          SELECT u.*, c.categoryname AS categoria_nombre FROM updated u
          JOIN categorias c ON u.categoria_id = c.id;`,
        params: [stock, fecha_entrada, codigo_producto],
      });
      const updatedProduct = result.rows[0];
      console.log("Producto actualizado:", updatedProduct);
      return res.status(200).json(updatedProduct);
    } else {
      console.log(
        `Producto no encontrado. Creando nuevo producto ${codigo_producto}.`
      );
      result = await db.query({
        text: `
          WITH inserted AS (
            INSERT INTO inventario (nombre_producto, codigo_producto, fecha_entrada, categoria_id, stock) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
          )
          SELECT i.*, c.categoryname AS categoria_nombre FROM inserted i
          JOIN categorias c ON i.categoria_id = c.id;`,
        params: [
          nombre_producto,
          codigo_producto,
          fecha_entrada,
          categoria_id,
          stock,
        ],
      });
      const newProduct = result.rows[0];
      console.log("Producto insertado:", newProduct);
      // Ya no es necesario recargar todo en el frontend si la respuesta es completa
      // Pero mantener fetchProducts() en el cliente es más robusto por si hay otros cambios.
      // Aquí simplemente aseguramos que la respuesta sea consistente.
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    console.error("Error al registrar producto:", error);
    return res.status(500).json({
      error: "Error del servidor al agregar producto",
      detalle: error.message,
    });
  }
});

// Ruta para añadir nuevo personal
app.post("/personal", async (req, res) => {
  try {
    const { nombre, apellido, sueldo, cargo } = req.body;

    if (!nombre || !apellido || !sueldo || !cargo) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios.",
      });
    }

    const result = await db.query({
      text: `
        INSERT INTO personal (nombre, apellido, sueldo, cargo) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `,
      params: [nombre, apellido, sueldo, cargo],
    });

    const newPersonnel = result.rows[0];
    console.log("Personal añadido:", newPersonnel);
    return res.status(201).json(newPersonnel);
  } catch (error) {
    console.error("Error al registrar personal:", error);
    // Asumiendo que la tabla se llama 'personal'
    if (error.code === "42P01") {
      // 'undefined_table' error code in PostgreSQL
      return res.status(500).json({
        error: "Error del servidor: La tabla 'personal' no existe.",
      });
    }
    return res.status(500).json({
      error: "Error del servidor al añadir personal",
      detalle: error.message,
    });
  }
});

// Ruta para crear un nuevo movimiento (asignación de producto)
app.post("/movimientos", async (req, res) => {
  const { producto_id, personal_id, cantidad, fecha_movimiento } = req.body;

  if (!producto_id || !personal_id || !cantidad || !fecha_movimiento) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  if (cantidad <= 0) {
    return res
      .status(400)
      .json({ error: "La cantidad debe ser mayor que cero." });
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Verificar y actualizar el stock del producto
    const stockResult = await client.query({
      text: "UPDATE inventario SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING id, nombre_producto",
      params: [cantidad, producto_id],
    });

    if (stockResult.rows.length === 0) {
      throw new Error(
        "Stock insuficiente o producto no encontrado. No se pudo realizar la asignación."
      );
    }

    // 2. Insertar el registro del movimiento
    const movimientoResult = await client.query({
      text: "INSERT INTO movimientos (producto_id, personal_id, cantidad, fecha_movimiento, tipo_movimiento) VALUES ($1, $2, $3, $4, 'salida') RETURNING *",
      params: [producto_id, personal_id, cantidad, fecha_movimiento],
    });

    await client.query("COMMIT");

    res.status(201).json(movimientoResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error en la transacción de movimiento:", error);
    res.status(500).json({
      error: "Error al procesar la asignación.",
      detalle: error.message,
    });
  } finally {
    client.release();
  }
});

// Ruta para obtener el historial de movimientos (entregas)
app.get("/movimientos", async (req, res) => {
  try {
    const result = await db.query({
      text: `
        SELECT 
          m.id,
          m.fecha_movimiento,
          m.cantidad,
          p.nombre AS personal_nombre,
          p.apellido AS personal_apellido,
          prod.nombre_producto
        FROM movimientos m
        JOIN personal p ON m.personal_id = p.id
        JOIN inventario prod ON m.producto_id = prod.id
        WHERE m.tipo_movimiento = 'salida'
        ORDER BY m.fecha_movimiento DESC;
      `,
    });
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener el historial de movimientos:", error);
    res.status(500).json({
      error: "Error interno del servidor al obtener el historial.",
      detalle: error.message,
    });
  }
});
// Ruta para añadir un nuevo usuario
app.post("/usuarios", async (req, res) => {
  console.log("📥 Recibiendo solicitud para crear usuario:", req.body);

  try {
    const { username, password, nivel_id } = req.body;
    console.log("🔍 Verificando datos del usuario:", { username, nivel_id });
    console.log(req.body);

    if (!username || !password || !nivel_id) {
      console.log("❌ Datos incompletos");
      return res.status(400).json({
        error: "Nombre de usuario, contraseña y nivel son obligatorios.",
      });
    }

    console.log("🔍 Verificando usuario existente...");
    const existingUser = await db.query({
      text: "SELECT id FROM usuarios WHERE username = $1",
      params: [username],
    });

    if (existingUser.rows.length > 0) {
      console.log("❌ Usuario ya existe");
      return res.status(409).json({
        error: "El nombre de usuario ya está en uso.",
      });
    }

    console.log("🔍 Verificando nivel existente...");
    const nivelExists = await db.query({
      text: "SELECT id FROM niveles WHERE id = $1",
      params: [nivel_id],
    });

    if (nivelExists.rows.length === 0) {
      console.log("❌ Nivel no existe");
      return res.status(400).json({
        error: "El nivel de usuario seleccionado no es válido.",
      });
    }

    console.log("🔄 Iniciando transacción...");
    const client = await db.pool.connect();

    try {
      await client.query("BEGIN");

      // ✅ CORRECCIÓN: Usar userPassword en lugar de password
      console.log("📝 Insertando usuario...");
      const userResult = await client.query({
        text: "INSERT INTO usuarios (username, userpassword) VALUES ($1, $2) RETURNING id, username",
        values: [username, password], // ✅ CORRECCIÓN: Usar 'values' en lugar de 'params'
      });

      const newUser = userResult.rows[0];
      console.log("✅ Usuario insertado:", newUser);

      console.log("🔗 Asignando permiso...");
      await client.query({
        text: "INSERT INTO permisos (usuario_id, nivel_id) VALUES ($1, $2)",
        values: [newUser.id, nivel_id], // ✅ CORRECCIÓN: Usar 'values' en lugar de 'params'
      });

      await client.query("COMMIT");
      console.log("✅ Transacción completada");

      return res.status(201).json(newUser);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Error en transacción:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("💥 Error general al registrar usuario:", error);
    return res.status(500).json({
      error: "Error del servidor al añadir usuario",
      detalle: error.message,
    });
  }
});
await db.pool
  .connect()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch(() => {
    console.log("Error al conectar con la db");
  });

app.listen(PORT, () => {
  console.log(`servidor en puerto ${PORT}`);
});
