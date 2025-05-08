// EditAvatar.jsx - Componente para el formulario de editar avatar
import React, { useContext, useRef } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

export default function EditAvatar({ onSubmit, closeButton, popupTitle }) {
  // Usamos useContext para obtener la función de actualización del avatar
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  // Usamos useRef en lugar de useState para obtener acceso directo al valor del input
  const avatarUrlRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Usamos la referencia para obtener el valor actual del input
    handleUpdateAvatar({
      avatar: avatarUrlRef.current.value,
    });
  };

  return (
    <form className="avatar__form-edit form" onSubmit={handleSubmit}>
      {closeButton}
      {popupTitle}
      <fieldset className="form__fieldset fieldset">
        <label className="form__label" htmlFor="avatar-url"></label>
        <input
          className="form__input"
          type="url"
          id="avatar-url"
          placeholder="Enlace a la nueva foto de perfil"
          required
          ref={avatarUrlRef}
        />
        <span id="avatar-url-error" className="forminput-error"></span>

        <button className="buttonsave" type="submit" id="avatarbuttonsave">
          Guardar
        </button>
      </fieldset>
    </form>
  );
}
