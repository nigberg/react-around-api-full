import success from '../images/success.svg'
import fail from '../images/fail.svg'

function InfoToolTip(props) {
  const image = props.isSuccess ? success : fail
  const text = props.isSuccess
    ? 'Success! You have now been registered.'
    : 'Oops, something went wrong! Please try again.'
  const altText = props.isSuccess ? 'Success' : 'Fail'
  return (
    <div
      className={`popup infoToolTip ${props.isOpen ? 'popup_visible' : ''}`}
    >
      <div className="infoToolTip__content popup__content">
        <button
          type="button"
          className="infoToolTip__close-button"
          onClick={props.onClose}
        />
        <img src={image} alt={altText} className="infoToolTip__image" />
        <div className="infoToolTip__text">{text}</div>
      </div>
    </div>
  )
}
export default InfoToolTip
