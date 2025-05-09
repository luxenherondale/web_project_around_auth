// api.js - Adaptado para usar con React y autenticación

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  // Método para obtener los headers con el token de autenticación
  _getHeaders() {
    const token = localStorage.getItem("token");
    return {
      ...this._headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Método genérico para realizar solicitudes
  _request(endpoint, method = "GET", body) {
    return fetch(`${this._baseUrl}${endpoint}`, {
      method,
      headers: this._getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  // Obtener datos del usuario
  getUserData() {
    return this._request("/users/me");
  }

  // Actualizar datos del usuario
  updateUserData(data) {
    return this._request("/users/me", "PATCH", data);
  }

  // Actualizar avatar del usuario
  updateUserAvatar(data) {
    return this._request("/users/me/avatar", "PATCH", data);
  }

  // Obtener tarjetas iniciales
  getInitialCards() {
    return this._request("/cards/");
  }

  // Crear nueva tarjeta
  createCard(data) {
    return this._request("/cards/", "POST", data);
  }

  // Dar like a una tarjeta
  likeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, "PUT");
  }

  // Quitar like de una tarjeta
  unlikeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, "DELETE");
  }

  // Eliminar tarjeta del servidor
  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, "DELETE");
  }

  // Método que combina dar like y quitar like según el estado actual
  changeLikeCardStatus(cardId, like) {
    return like ? this.likeCard(cardId) : this.unlikeCard(cardId);
  }
}

// Instancia de la clase Api
const api = new Api({
  baseUrl: "https://se-register-api.en.tripleten-services.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
