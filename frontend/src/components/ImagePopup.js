function ImagePopup(props) {
  return (
    <div
      className={`popup picture-popup ${props.isOpen ? "popup_visible" : ""}`}
    >
      <div className="picture-popup__image-container popup__content">
        <button
          type="button"
          className="picture-popup__close-button popup__close-button"
          onClick={props.onClose}
        />
        <img
          src={props.card.link}
          alt={props.card.name}
          className="picture-popup__image"
        />
        <h2 className="picture-popup__caption">{props.card.name}</h2>
      </div>
    </div>
  );
}
export default ImagePopup;
