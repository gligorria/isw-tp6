import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";

const schema = yup.object().shape({
  loadType: yup.string().required("Seleccione el tipo de carga"),
  withdrawal: yup.object().shape({
    street: yup.string().required("Calle es requerida"),
    locality: yup.string().required("Localidad es requerida"),
    province: yup.string().required("Provincia es requerida"),
  }),
  delivery: yup.object().shape({
    street: yup.string().required("Calle es requerida"),
    locality: yup.string().required("Localidad es requerida"),
    province: yup.string().required("Provincia es requerida"),
  }),
  withdrawalDate: yup
    .date()
    .nullable()
    .required("Seleccione la fecha de retiro")
    .min(new Date(), "La fecha de retiro no puede ser en el pasado"),
  deliveryDate: yup
    .date()
    .nullable()
    .required("Seleccione la fecha de entrega")
    .min(
      yup.ref("withdrawalDate"),
      "La fecha de entrega debe ser mayor o igual a la fecha de retiro"
    ),
  photos: yup
    .mixed()
    .test("fileSize", "Las imágenes deben ser JPG o PNG", (value) => {
      if (!value || value.length === 0) return true; // Si no se adjuntaron archivos, es opcional
      const files = Array.isArray(value) ? value : Array.from(value); // Asegúrate de que sea un array
      return files.every((file) =>
        ["image/jpeg", "image/png"].includes(file.type)
      );
    }),
  observation: yup.string().nullable(),
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

  const [withdrawalDate, setWithdrawalDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);

  const handleWithdrawalDateChange = (date) => {
    setWithdrawalDate(date);
    setValue("withdrawalDate", date, { shouldValidate: true });
  };

  const handleDeliveryDateChange = (date) => {
    setDeliveryDate(date);
    setValue("deliveryDate", date, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      withdrawalDate: format(withdrawalDate, "yyyy-MM-dd"),
      deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
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
        <select {...register("loadType")}>
          <option value="">Seleccione</option>
          <option value="documentación">Documentación</option>
          <option value="paquete">Paquete</option>
          <option value="granos">Granos</option>
          <option value="hacienda">Hacienda</option>
        </select>
        {errors.loadType && <p>{errors.loadType.message}</p>}
      </div>

      <h3>Domicilio de Retiro</h3>
      <div>
        <label>Calle y número</label>
        <input type="text" {...register("withdrawal.street")} />
        {errors.withdrawal?.street && <p>{errors.withdrawal.street.message}</p>}
      </div>
      <div>
        <label>Localidad</label>
        <input type="text" {...register("withdrawal.locality")} />
        {errors.withdrawal?.locality && (
          <p>{errors.withdrawal.locality.message}</p>
        )}
      </div>
      <div>
        <label>Provincia</label>
        <input type="text" {...register("withdrawal.province")} />
        {errors.withdrawal?.province && (
          <p>{errors.withdrawal.province.message}</p>
        )}
      </div>

      <h3>Fecha de Retiro</h3>
      <DatePicker
        selected={withdrawalDate}
        onChange={handleWithdrawalDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
      />
      {errors.withdrawalDate && <p>{errors.withdrawalDate.message}</p>}

      <h3>Domicilio de Entrega</h3>
      <div>
        <label>Calle y número</label>
        <input type="text" {...register("delivery.street")} />
        {errors.delivery?.street && <p>{errors.delivery.street.message}</p>}
      </div>
      <div>
        <label>Localidad</label>
        <input type="text" {...register("delivery.locality")} />
        {errors.delivery?.locality && <p>{errors.delivery.locality.message}</p>}
      </div>
      <div>
        <label>Provincia</label>
        <input type="text" {...register("delivery.province")} />
        {errors.delivery?.province && <p>{errors.delivery.province.message}</p>}
      </div>

      <h3>Fecha de Entrega</h3>
      <DatePicker
        selected={deliveryDate}
        onChange={handleDeliveryDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={withdrawalDate || new Date()}
      />
      {errors.deliveryDate && <p>{errors.deliveryDate.message}</p>}

      <h3 htmlFor="observacion">Observación</h3>
      <textarea
        id="observacion"
        name="observacion"
        {...register("observation")}
        placeholder="detalle de necesidades de almacenamiento o transporte (por ejemplo: fragilidad, temperatura mínima, evitar el sol)."
        rows="4"
      />

      <h3>Adjuntar Fotos (Opcional)</h3>
      <input
        type="file"
        accept="image/jpeg,image/png"
        multiple
        {...register("photos")}
      />
      {errors.photos && <p>{errors.photos.message}</p>}

      <button type="submit">Enviar Pedido</button>
    </form>
  );
};

export default OrderForm;
