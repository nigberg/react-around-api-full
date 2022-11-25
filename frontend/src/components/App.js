import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import ImagePopup from './ImagePopup'
import PopupWithForm from './PopupWithForm'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ConfirmPopup from './ConfirmPopup'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { auth } from '../utils/auth'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { Switch, Route, useHistory } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from './ProtectedRoute'
import InfoToolTip from './InfoTooltip'

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [userEmail, setUserEmail] = useState('')
  const [cards, setCards] = useState([])
  const [cardToDelete, setCardToDelete] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'))

  const history = useHistory()

  useEffect(() => {
    Promise.allSettled([auth.validateToken(jwt), api.getInitialCards(jwt)])
      .then((values) => {
        setCurrentUser(values[0].value.data)
        setLoggedIn(true)
        setUserEmail(values[0].value.data.email)
        setCards(values[1].value.data)
        history.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
  }, [loggedIn])

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  const handleCardClick = (card) => {
    setIsCardPopupOpen(true)
    setSelectedCard(card)
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((user) => user === currentUser._id)
    console.log(card.likes[0]+' '+currentUser._id+' isLiked: '+isLiked)

    api
      .changeLikeCardStatus(card._id, isLiked, jwt)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard.data : currentCard,
          ),
        )
      })
      .catch(console.log)
  }

  const handleCardDelete = (card) => {
    setWaiting(true)
    api
      .deleteCard(card._id, jwt)
      .then((removedCard) => {        
        setCards(cards.filter((item) => item._id !== removedCard.data._id))
      })
      .catch(console.log)
      .finally(() => {
        closeAllPopups()
        setWaiting(false)
      })
  }

  const handleDeleteButtonClick = (card) => {
    setIsConfirmPopupOpen(true)
    setCardToDelete(card)
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsCardPopupOpen(false)
    setIsEditProfilePopupOpen(false)
    setIsInfoTooltipOpen(false)
    setIsConfirmPopupOpen(false)
    setSelectedCard({})
    document.removeEventListener('keydown', closeByEscape)
  }

  //popups close by escape event listener
  const closeByEscape = (e) => {
    if (e.key === 'Escape') {
      closeAllPopups()
    }
  }

  let isAnyPopupOpen =
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isEditAvatarPopupOpen ||
    isCardPopupOpen ||
    isInfoTooltipOpen ||
    isConfirmPopupOpen

  useEffect(() => {
    if (isAnyPopupOpen) {
      document.addEventListener('keydown', closeByEscape)
    }
  }, [isAnyPopupOpen])

  function handleUpdateUser({ name, about }) {
    setWaiting(true)    
    api
      .editProfile({ name, about, token: jwt })
      .then((newUserInfo) => {        
        setCurrentUser(newUserInfo.data)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => {
        setWaiting(false)
      })
  }

  function hanldeUpdateAvatar(avatarUrl) {
    setWaiting(true)
    api
      .setAvatar(avatarUrl, jwt)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo.data)
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => {
        setWaiting(false)
      })
  }

  function handleAddPlaceSubmit({ name, link }) {
    setWaiting(true)
    api
      .addNewCard({ name, link, token: jwt })
      .then((newCard) => {
        setCards([newCard.data, ...cards])
        closeAllPopups()
      })
      .catch(console.log)
      .finally(() => {
        setWaiting(false)
      })
  }

  function handleLogout() {
    localStorage.removeItem('jwt')
    setJwt('')
    setLoggedIn(false)
    history.push('/login')
  }

  function handleLogin(userData) {
    setWaiting(true)
    auth
      .authenticate(userData)
      .then((data) => {
        localStorage.setItem('jwt', data.token)
        setJwt(data.token)        
        setLoggedIn(true)
        setUserEmail(userData.email)
        history.push('/')
      })
      .catch((err) => {
        setIsSuccess(false)
        setIsInfoTooltipOpen(true)
        console.log(err)
      })
      .finally(() => {
        setWaiting(false)
      })
  }

  function handleSignup(userData) {
    setWaiting(true)
    auth
      .register(userData)
      .then((user) => {
        if (user.data._id) {
          setIsSuccess(true)
          history.push('signin')
        } else {
          setIsSuccess(false)
        }
      })
      .catch(() => {
        setIsSuccess(false)
      })
      .finally(() => {
        setWaiting(false)
        setIsInfoTooltipOpen(true)
      })
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          handleLogout={handleLogout}
        />
        <Switch>
          <Route path={'/signin'}>
            <Login
              loggedIn={loggedIn}
              isWaiting={waiting}
              onSubmit={handleLogin}
            />
          </Route>
          <Route path={'/signup'}>
            <Register
              isSuccess={isSuccess}
              isWaiting={waiting}
              onSubmit={handleSignup}
            />
          </Route>
          <ProtectedRoute loggedIn={loggedIn}>
            <Main
              cards={cards}
              onCardClick={handleCardClick}
              onEditProfileClick={handleEditProfileClick}
              onEditAvatarClick={handleEditAvatarClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardLike={handleCardLike}
              onCardDelete={handleDeleteButtonClick}
            />
          </ProtectedRoute>
        </Switch>
        <Footer />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isWaiting={waiting}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isWaiting={waiting}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={hanldeUpdateAvatar}
          isWaiting={waiting}
        />

        <ImagePopup
          isOpen={isCardPopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoToolTip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          isSuccess={isSuccess}
        />

        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          isWaiting={waiting}
          onCardDelete={handleCardDelete}
          cardToDelete={cardToDelete}
        />
      </CurrentUserContext.Provider>
    </div>
  )
}

export default App
