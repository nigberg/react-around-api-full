function ConfirmPopup({
  isWaiting,
  isOpen,
  onClose,
  cardToDelete,
  onCardDelete,
}) {
  const handleSubmit = () => {
    onCardDelete(cardToDelete)
  }
  return (
    <div className={`popup confirm-popup ${isOpen ? 'popup_visible' : ''}`}>
      <div className="confirm-popup__container">
        <button
          type="button"
          onClick={onClose}
          className="confirm-popup__close-button popup__close-button"
        ></button>
        <h2 className="confirm-popup__question">Are you sure?</h2>
        <form
          onSubmit={handleSubmit}
          action="#"
          name="confirm-form"
          className="form"
        >
          <button type="submit" className="form__submit-button">
            {isWaiting ? 'Deleting card...' : 'Yes'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default ConfirmPopup
