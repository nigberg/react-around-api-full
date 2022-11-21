import PopupWithForm from "./PopupWithForm";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isWaiting }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  const onNameChange = (evt) => {
    setName(evt.target.value);
  };

  const onDescriptionChange = (evt) => {
    setDescription(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  };

  return (
    <PopupWithForm
      name="edit"
      title="Edit your profile"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isWaiting={isWaiting}
    >
      <div className="form__field">
        <input
          type="text"
          minLength="2"
          maxLength="40"
          required
          className="form__input"
          id="edit-popup__input-name"
          name="name"
          placeholder="Enter your name"
          value={name || ""}
          onChange={onNameChange}
        />
        <span className="form__input-error edit-popup__input-name-error"></span>
      </div>
      <div className="form__field">
        <input
          type="text"
          minLength="2"
          maxLength="200"
          required
          className="form__input"
          id="edit-popup__input-about"
          name="about"
          placeholder="About you"
          value={description || ""}
          onChange={onDescriptionChange}
        />
        <span className="form__input-error edit-popup__input-about-error"></span>
      </div>
    </PopupWithForm>
  );
}
export default EditProfilePopup;
