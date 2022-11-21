import PopupWithForm from "./PopupWithForm";
import { useEffect } from "react";
import { useForm } from "../utils/useForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isWaiting }) {
  const { values, handleChange, setValues } = useForm({ "name": "", "link": "" });
  
  useEffect(() => {
    setValues({ "name": "", "link": "" });   
  }, [isOpen]);  

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onAddPlace(values);
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      name="add"
      title="Add new place"
      onSubmit={handleSubmit}
      isWaiting={isWaiting}
    >
      <div className="form__field">
        <input
          type="text"
          minLength="1"
          maxLength="30"
          required
          className="form__input"
          id="add-popup__input-description"
          name="name"
          placeholder="Enter place name"
          value={values["name"]}
          onChange={handleChange}
        />
        <span className="form__input-error add-popup__input-description-error"></span>
      </div>
      <div className="form__field">
        <input
          type="url"
          required
          className="form__input"
          id="add-popup__input-link"
          name="link"
          placeholder="Enter picture link"
          value={values["link"]}
          onChange={handleChange}
        />
        <span className="form__input-error add-popup__input-link-error"></span>
      </div>
    </PopupWithForm>
  );
}
export default AddPlacePopup;
