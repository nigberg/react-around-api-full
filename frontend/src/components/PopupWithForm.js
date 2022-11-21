function PopupWithForm({
  name,
  title,
  onClose,
  isOpen,
  children,
  onSubmit,
  isWaiting,
}) {
  return (
    <div className={`popup ${name}-popup ${isOpen ? "popup_visible" : ""}`}>
      <div className={`${name}-popup__container popup__content`}>
        <button
          type="button"
          className={`${name}-popup__close-button popup__close-button`}
          onClick={onClose}
        />
        <h2 className={`${name}-popup__caption`}>{title}</h2>
        <form
          action="#"
          name={name}
          className="form add-popup__form"
          onSubmit={onSubmit}
        >
          {children}
          <button type="submit" className="form__submit-button">
            {isWaiting ? "Saving" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default PopupWithForm;
