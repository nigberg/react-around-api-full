export class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error ${res.status}`);
  }

  getUserInfo(token) {
    return fetch(this._baseUrl + "/users/me", {
      headers: { ...this._headers, authorization: 'Bearer ' + token },
    }).then(this._checkResponse);
  }

  getInitialCards(token) {
    return fetch(this._baseUrl + "/cards", {
      headers: { ...this._headers, authorization: 'Bearer ' + token },
    }).then(this._checkResponse);
  }

  editProfile({ name, about, token }) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  addNewCard({ name, link, token }) {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }

  addLike(cardId, token) {
    return fetch(this._baseUrl + "/cards/" + cardId + "/likes", {
      method: "PUT",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
    }).then(this._checkResponse);
  }

  removeLike(cardId, token) {
    return fetch(this._baseUrl + "/cards/" + cardId + "/likes", {
      method: "DELETE",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
    }).then(this._checkResponse);
  }

  deleteCard(cardId, token) {
    return fetch(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(cardId, isLiked, token) {
    console.log(isLiked);
    return isLiked ? this.removeLike(cardId, token) : this.addLike(cardId, token);
  }

  setAvatar(avatar, token) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: { ...this._headers, authorization: 'Bearer ' + token },
      body: JSON.stringify({ avatar }),
    }).then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: "https://api.nigberg.students.nomoredomainssbs.ru",
  headers: {    
    "Content-Type": "application/json",
  },
});

