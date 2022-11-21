import pencil from '../images/edit.svg'
import { useContext } from 'react'

import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main(props) {
  const currentUser = useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__user-info">
          <button
            type="button"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            className="profile__avatar"
            onClick={props.onEditAvatarClick}
          >
            <img
              alt="edit"
              className="profile__avatar-edit-image"
              src={pencil}
            />
          </button>
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            type="button"
            onClick={props.onEditProfileClick}
            className="profile__edit-button"
          ></button>
          <p className="profile__occupation">{currentUser.about}</p>
        </div>
        <button
          type="button"
          onClick={props.onAddPlaceClick}
          className="profile__add-button"
        ></button>
      </section>
      <section className="gallery">
        {props.cards.map((item) => (
          <Card
            key={item._id}
            card={item}
            onClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
        ))}
      </section>
    </main>
  )
}
export default Main
