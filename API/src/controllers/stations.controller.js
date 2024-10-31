//CONTROLADOR PARA LA TABLA DE PARADAS DE AUTOBUSES
import { getConnection, sql, querys } from "../database";

export const getStations = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.getallstation);
    return res.json(result.recordset);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const postStation = async (req, res) => {
  const { Nombre, Ubicacion, TiempoEstimadoLlegada, IdRuta } = req.body;
  if (
    Nombre == null ||
    Ubicacion == null ||
    TiempoEstimadoLlegada == null ||
    IdRuta == null
  ) {
    return res.status(400).json({ msg: "Complete todos los campos" });
  } else {
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input("Nombre", Nombre)
        .input("Ubicacion", Ubicacion)
        .input("TiempoEstimadoLlegada", parseInt(TiempoEstimadoLlegada))
        .input("IdRuta", parseInt(IdRuta))
        .query(querys.poststation);
      return res.json({
        msg: "Estacion agregada correctamente",
        Nombre,
        Ubicacion,
        TiempoEstimadoLlegada,
        IdRuta,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal server error", error: error.message });
    }
  }
};

export const delStation = async (req, res) => {
  const { IdParada } = req.params;
  if (IdParada == null) {
    return res.status(400).json({ msg: "Es necesario el Id de la estacion" });
  } else {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input("IdParada", parseInt(IdParada))
        .query(querys.deletestation);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ msg: "Route not found" });
      } else {
        return res.json({ msg: "Estacion borrada correctamente", IdParada });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal server error", error: error.message });
    }
  }
};

export const putStation = async (req, res) => {
  const { IdParada } = req.params;
  const { Nombre, Ubicacion, TiempoEstimadoLlegada, IdRuta } = req.body;

  // Comprobar si IdParada es nulo o indefinido
  if (!IdParada) {
    return res.status(400).json({ msg: "Id de la parada nulo o indefinido" });
  }

  // Comprobar si hay campos incompletos
  if (
    Nombre == null ||
    Ubicacion == null ||
    TiempoEstimadoLlegada == null ||
    IdRuta == null
  ) {
    return res.status(400).json({ msg: "Campos incompletos" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("IdParada", parseInt(IdParada)) // Asegúrate de usar el tipo correcto
      .input("Nombre", Nombre)
      .input("Ubicacion", Ubicacion)
      .input("TiempoEstimadoLlegada", parseInt(TiempoEstimadoLlegada))
      .input("IdRuta", parseInt(IdRuta))
      .query(
        querys.updatestation
      ); // Llama al procedimiento almacenado

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ msg: "Estación no encontrada" });
    } else {
      return res.json({
        msg: "Estación modificada correctamente",
        IdParada,
        Nombre,
        Ubicacion,
        TiempoEstimadoLlegada,
        IdRuta,
      });
    }
  } catch (error) {
    console.error(error); // Registro del error para debugging
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
