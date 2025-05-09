import React from "react";
import successIcon from "../../images/success-icon.png";
import errorIcon from "../../images/error-icon.png";

function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container popup__container_type_tooltip">
        <button className="popup__close-button" type="button" onClick={onClose}>
          ✕
        </button>
        <div className="popup__tooltip-content">
          <img
            src={isSuccess ? successIcon : errorIcon}
            alt={isSuccess ? "Éxito" : "Error"}
            className="popup__tooltip-icon"
          />
          <p className="popup__tooltip-text">
            {isSuccess
              ? "¡Correcto! Ya estás registrado."
              : "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
