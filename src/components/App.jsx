import { useState, useEffect } from "react";
import "../App.css";
import "../index.css";
import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
    avatar: "",
    _id: "",
  });

  // Estado para las tarjetas (elevado desde Main)
  const [cards, setCards] = useState([]);

  // Estado para manejar popups
  const [popup, setPopup] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  // Funciones para manejar popups
  function handleOpenPopup(popupContent) {
    setPopup(popupContent);
  }

  function handleClosePopup() {
    setPopup(null);
    setSelectedCard(null);
  }

  // Función para actualizar datos del usuario
  const handleUpdateUser = (data) => {
    api
      .updateUserData(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup(); // Cierra el popup después de actualizar
      })
      .catch((err) => {
        console.error("Error al actualizar datos del usuario:", err);
      });
  };

  // Función para actualizar el avatar del usuario
  const handleUpdateAvatar = (data) => {
    api
      .updateUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup(); // Cierra el popup después de actualizar
      })
      .catch((err) => {
        console.error("Error al actualizar avatar del usuario:", err);
      });
  };

  // Función para añadir nueva tarjeta
  const handleAddPlaceSubmit = (cardData) => {
    api
      .createCard(cardData)
      .then((newCard) => {
        // Añadir propiedad isLiked
        const newCardWithLikeStatus = {
          ...newCard,
          isLiked: false, // Una nueva tarjeta nunca tendrá like del usuario al crearla
        };
        setCards([newCardWithLikeStatus, ...cards]); // La nueva tarjeta aparece al principio
        handleClosePopup();
      })
      .catch((err) => {
        console.error("Error al crear tarjeta:", err);
      });
  };

  // Función para dar/quitar like a una tarjeta
  async function handleCardLike(card) {
    // Verifica si a esta tarjeta ya le has dado like
    const isLiked = card.isLiked;

    try {
      // Envía una solicitud a la API y obtiene los datos actualizados de la tarjeta
      const updatedCard = await api.changeLikeCardStatus(card._id, !isLiked);

      // Asegurando de que la propiedad isLiked esté actualizada
      const newCard = {
        ...updatedCard,
        isLiked: !isLiked,
      };

      // Actualiza el estado de las tarjetas
      setCards((state) =>
        state.map((currentCard) =>
          currentCard._id === card._id ? newCard : currentCard
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado del like:", error);
    }
  }

  // Función para eliminar una tarjeta
  function handleCardDelete(specificCardId) {
    const idToDelete = specificCardId || cardToDelete;
    if (idToDelete) {
      api
        .deleteCard(idToDelete)
        .then(() => {
          setCards(cards.filter((card) => card._id !== idToDelete));
          handleClosePopup();
          setCardToDelete(null);
        })
        .catch((err) => console.error("Error al eliminar tarjeta:", err));
    }
  }
  // Funcion para establecer cardToDelete
  function handleDeleteClick(cardId) {
    setCardToDelete(cardId);
    console.log("Card to delete set:", cardId); // Añadir para depuración
  }

  // Cargar información inicial del usuario y tarjetas
  useEffect(() => {
    // Cargar información del usuario
    api
      .getUserData()
      .then((userData) => {
        console.log("User data loaded:", userData);
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error("Error al cargar datos del usuario:", err);
      });
  }, []);

  // Efecto separado para cargar tarjetas una vez que tengamos el usuario
  useEffect(() => {
    if (currentUser._id) {
      // Cargar tarjetas iniciales
      api
        .getInitialCards()
        .then((cardsData) => {
          // Procesar las tarjetas para añadir el estado de likes
          const processedCards = cardsData.map((card) => {
            // Verificar si el array de likes existe y es un array
            const likesArray = Array.isArray(card.likes) ? card.likes : [];

            // Verificar si el usuario actual ha dado like
            const isLiked = likesArray.some(
              (like) => like && like._id === currentUser._id
            );

            return {
              ...card,
              isLiked,
            };
          });

          setCards(processedCards);
        })
        .catch((err) => console.error("Error al cargar tarjetas:", err));
    }
  }, [currentUser._id]);

  return (
    // Pasamos las funciones y datos a través del contexto
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
      }}
    >
      <div className="page">
        <Header />
        <Main
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleDeleteClick}
          onConfirmDelete={handleCardDelete}
          onAddPlace={handleAddPlaceSubmit}
          onUpdateUser={handleUpdateUser}
          onOpenPopup={handleOpenPopup}
          onClosePopup={handleClosePopup}
          popup={popup}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          cardToDelete={cardToDelete}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
