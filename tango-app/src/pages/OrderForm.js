import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";

const schema = yup.object().shape({
  tipoCarga: yup.string().required("Seleccione el tipo de carga"),
  retiro: yup.object().shape({
    calle: yup.string().required("Calle es requerida"),
    localidad: yup.string().required("Localidad es requerida"),
    provincia: yup.string().required("Provincia es requerida"),
  }),
  entrega: yup.object().shape({
    calle: yup.string().required("Calle es requerida"),
    localidad: yup.string().required("Localidad es requerida"),
    provincia: yup.string().required("Provincia es requerida"),
  }),
  fechaRetiro: yup
    .date()
    .nullable()
    .required("Seleccione la fecha de retiro")
    .min(new Date(), "La fecha de retiro no puede ser en el pasado"),
  fechaEntrega: yup
    .date()
    .nullable()
    .required("Seleccione la fecha de entrega")
    .min(
      yup.ref("fechaRetiro"),
      "La fecha de entrega debe ser mayor o igual a la fecha de retiro"
    ),
  fotos: yup
    .mixed()
    .test("fileSize", "Las imágenes deben ser JPG o PNG", (value) => {
      if (!value || value.length === 0) return true; // Si no se adjuntaron archivos, es opcional
      const files = Array.isArray(value) ? value : Array.from(value); // Asegúrate de que sea un array
      return files.every((file) =>
        ["image/jpeg", "image/png"].includes(file.type)
      );
    }),
});

const OrderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [fechaRetiro, setFechaRetiro] = useState(null);
  const [fechaEntrega, setFechaEntrega] = useState(null);

  const handleFechaRetiroChange = (date) => {
    setFechaRetiro(date);
    setValue("fechaRetiro", date, { shouldValidate: true });
  };

  const handleFechaEntregaChange = (date) => {
    setFechaEntrega(date);
    setValue("fechaEntrega", date, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      fechaRetiro: format(fechaRetiro, "yyyy-MM-dd"),
      fechaEntrega: format(fechaEntrega, "yyyy-MM-dd"),
    };
    console.log(formattedData);

    // Aquí realizarías la solicitud HTTP para enviar el pedido a la API del backend
    // axios.post('/api/pedidos', formattedData)
    // .then(response => {
    //   alert("Pedido enviado con éxito!");
    // });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Tipo de Carga</label>
        <select {...register("tipoCarga")}>
          <option value="">Seleccione</option>
          <option value="documentación">Documentación</option>
          <option value="paquete">Paquete</option>
          <option value="granos">Granos</option>
          <option value="hacienda">Hacienda</option>
        </select>
        {errors.tipoCarga && <p>{errors.tipoCarga.message}</p>}
      </div>

      <h3>Domicilio de Retiro</h3>
      <div>
        <label>Calle y número</label>
        <input type="text" {...register("retiro.calle")} />
        {errors.retiro?.calle && <p>{errors.retiro.calle.message}</p>}
      </div>
      <div>
        <label>Localidad</label>
        <input type="text" {...register("retiro.localidad")} />
        {errors.retiro?.localidad && <p>{errors.retiro.localidad.message}</p>}
      </div>
      <div>
        <label>Provincia</label>
        <input type="text" {...register("retiro.provincia")} />
        {errors.retiro?.provincia && <p>{errors.retiro.provincia.message}</p>}
      </div>

      <h3>Fecha de Retiro</h3>
      <DatePicker
        selected={fechaRetiro}
        onChange={handleFechaRetiroChange}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
      {errors.fechaRetiro && <p>{errors.fechaRetiro.message}</p>}

      <h3>Domicilio de Entrega</h3>
      <div>
        <label>Calle y número</label>
        <input type="text" {...register("entrega.calle")} />
        {errors.entrega?.calle && <p>{errors.entrega.calle.message}</p>}
      </div>
      <div>
        <label>Localidad</label>
        <input type="text" {...register("entrega.localidad")} />
        {errors.entrega?.localidad && <p>{errors.entrega.localidad.message}</p>}
      </div>
      <div>
        <label>Provincia</label>
        <input type="text" {...register("entrega.provincia")} />
        {errors.entrega?.provincia && <p>{errors.entrega.provincia.message}</p>}
      </div>

      <h3>Fecha de Entrega</h3>
      <DatePicker
        selected={fechaEntrega}
        onChange={handleFechaEntregaChange}
        dateFormat="yyyy-MM-dd"
        minDate={fechaRetiro || new Date()}
      />
      {errors.fechaEntrega && <p>{errors.fechaEntrega.message}</p>}

      <h3>Adjuntar Fotos (Opcional)</h3>
      <input
        type="file"
        accept="image/jpeg,image/png"
        multiple
        {...register("fotos")}
      />
      {errors.fotos && <p>{errors.fotos.message}</p>}

      <button type="submit">Enviar Pedido</button>
    </form>
  );
};

export default OrderForm;
