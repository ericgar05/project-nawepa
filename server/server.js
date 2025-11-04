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

// --- Rutas existentes ---

app.post("/login", async (req, res) => {
  try {
    const { nombre, password } = req.body;

    if (!nombre || !password) {
      return res
        .status(400)
        .json({ error: "Nombre de usuario y contraseña son obligatorios" });
    }

    // niveles.levelsName,
    //       permisos.fecha_asignacion
    //       FROM
    //       usuarios
    //       JOIN
    //       permisos ON usuarios.id = permisos.usuario_id
    //       JOIN
    //       niveles ON permisos.nivel_id = niveles.id
    //       WHERE
    const result = await db.query({
      text: `SELECT 
            usuarios.id, 
            usuarios.username, 
            usuarios.userpassword
            FROM usuarios WHERE usuarios.username = $1;`,
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
        password: user.userpassword,
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
