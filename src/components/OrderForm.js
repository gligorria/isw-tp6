import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/components/OrderForm.scss"; // Importamos los estilos del footer

const schema = yup.object().shape({
  loadType: yup.string().required("Seleccione el tipo de carga"),
  withdrawal: yup.object().shape({
    street: yup.string().required("Calle es requerida"),
    locality: yup.string().required("Localidad es requerida"),
    province: yup.string().required("Provincia es requerida"),
    reference: yup.string().nullable(),
  }),
  delivery: yup.object().shape({
    street: yup.string().required("Calle es requerida"),
    locality: yup.string().required("Localidad es requerida"),
    province: yup.string().required("Provincia es requerida"),
    reference: yup.string().nullable(),
  }),
  withdrawalDate: yup
    .date()
    .nullable()
    .required("Seleccione la fecha de retiro")
    .min(
      new Date().toDateString(),
      "La fecha de retiro no puede ser en el pasado"
    ),
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
      const files = Array.isArray(value) ? value : Array.from(value); // Validamos de que sea un array
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
    formState: { errors },
    reset,
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

  const notify = () =>
    toast(
      "El nuevo pedido fue notificado a todos los transportistas dentro de la zona de cobertura",
      {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      }
    );

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      withdrawalDate: format(withdrawalDate, "dd-MM-yyyy"),
      deliveryDate: format(deliveryDate, "dd-MM-yyyy"),
    };

    console.log(formattedData);
    notify();
    reset();

    setWithdrawalDate(null);
    setDeliveryDate(null);
    window.open("/isw-tp6/email.jpeg", "_blank");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer />
      <div>
        <label className="required-label">Tipo de Carga</label>
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
        <label className="required-label">Calle y número</label>
        <input type="text" {...register("withdrawal.street")} />
        {errors.withdrawal?.street && <p>{errors.withdrawal.street.message}</p>}
      </div>
      <div>
        <label className="required-label">Localidad</label>
        <input type="text" {...register("withdrawal.locality")} />
        {errors.withdrawal?.locality && (
          <p>{errors.withdrawal.locality.message}</p>
        )}
      </div>
      <div>
        <label className="required-label">Provincia</label>
        <input type="text" {...register("withdrawal.province")} />
        {errors.withdrawal?.province && (
          <p>{errors.withdrawal.province.message}</p>
        )}
      </div>
      <div>
        <label>Referencia</label>
        <input type="text" {...register("withdrawal.reference")} />
      </div>

      <h3 className="required-label">Fecha de Retiro</h3>
      <DatePicker
        selected={withdrawalDate}
        onChange={handleWithdrawalDateChange}
        dateFormat="dd-MM-yyyy"
        minDate={new Date()}
        id="withdrawalDate"
      />
      {errors.withdrawalDate && <p>{errors.withdrawalDate.message}</p>}

      <h3>Domicilio de Entrega</h3>
      <div>
        <label className="required-label">Calle y número</label>
        <input type="text" {...register("delivery.street")} />
        {errors.delivery?.street && <p>{errors.delivery.street.message}</p>}
      </div>
      <div>
        <label className="required-label">Localidad</label>
        <input type="text" {...register("delivery.locality")} />
        {errors.delivery?.locality && <p>{errors.delivery.locality.message}</p>}
      </div>
      <div>
        <label className="required-label">Provincia</label>
        <input type="text" {...register("delivery.province")} />
        {errors.delivery?.province && <p>{errors.delivery.province.message}</p>}
      </div>
      <div>
        <label>Referencia</label>
        <input type="text" {...register("delivery.reference")} />
      </div>

      <h3 className="required-label">Fecha de Entrega</h3>
      <DatePicker
        selected={deliveryDate}
        onChange={handleDeliveryDateChange}
        dateFormat="dd-MM-yyyy"
        minDate={withdrawalDate || new Date()}
        id="deliveryDate"
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
