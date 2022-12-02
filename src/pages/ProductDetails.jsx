import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DetailsCart from '../components/DetailsCart';
import { getProductById } from '../services/api';
import { addCartItem, getCartTotalQuantity } from '../services/cartManipulation';
import Header from '../components/Header';

const MAX_NUMBER = 5;

export default class ProductDetails extends Component {
  state = {
    guardProducts: {},
    email: '',
    rating: '',
    erro: true,
    text: '',
    comments: [],
    cartSize: 0,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    const product = await getProductById(id);
    this.setState({
      guardProducts: product,
      comments: this.getProductEvaluation(),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { comments, email, rating, text, guardProducts, cartSize } = this.state;
    const changeEmail = email !== nextState.email;
    const changeRating = rating !== nextState.rating;
    const changeText = text !== nextState.text;
    const changeComments = comments.length !== nextState.comments.length;
    const hasId = guardProducts.id !== nextState.guardProducts.id;
    const changeCartSize = cartSize !== nextState.cartSize;
    return hasId || changeEmail || changeRating
    || changeText || changeComments || changeCartSize;
  }

  componentDidUpdate() {
    this.setState({
      comments: this.getProductEvaluation(),
    });
    this.updateCartSize();
  }

  updateCartSize = () => {
    const cartSize = getCartTotalQuantity();
    this.setState({ cartSize });
  };

  isFormValid = () => {
    const { email, rating } = this.state;
    const regex = /\S+@\S+\.\S+/;
    const verifyEmail = email.length === 0;
    const verify = !regex.test(email);
    const verifyRating = rating.length === 0;
    return verifyEmail || verifyRating || verify;
  };

  validateForm = () => {
    const erro = this.isFormValid();
    this.setState({ erro }, this.setProductEvaluation);
  };

  handleClick = (event) => {
    event.preventDefault();
    this.validateForm();
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, () => {
      const erro = this.isFormValid();
      this.setState({ erro });
    });
  };

  getProductEvaluation = () => {
    const { match } = this.props;
    const { id } = match.params;
    if (!localStorage[id]) {
      localStorage.setItem(id, '[]');
    }
    return JSON.parse(localStorage.getItem(id));
  };

  clearInputs = () => {
    this.setState({
      email: '',
      erro: false,
      text: '',
      rating: '',
    });
  };

  setProductEvaluation = () => {
    const { email, text, rating, erro } = this.state;
    if (erro) return;
    const { match } = this.props;
    const { id } = match.params;
    const savedProductEvaluation = this.getProductEvaluation();
    savedProductEvaluation.push({ email, text, rating });
    localStorage.setItem(id, JSON.stringify(savedProductEvaluation));
    this.clearInputs();
  };

  generateRadios = () => {
    const radios = [];
    for (let index = 1; index <= MAX_NUMBER; index += 1) {
      radios.push(
        <label
          htmlFor={ `${index}-rating` }
          data-testid={ `${index}-rating` }
          key={ `${index}-rating` }
        >
          <input
            type="radio"
            name="rating"
            value={ index }
            id={ `${index}-rating` }
            onChange={ this.handleChange }
          />
          {index}
        </label>,
      );
    }
    return radios;
  };

  search = async (event) => {
    event.preventDefault();
  };

  render() {
    const { guardProducts, erro, email, text, comments, cartSize } = this.state;
    const radios = this.generateRadios();

    return (
      <div>
        <Header
          search={ this.search }
          cartSize={ cartSize }
        />
        {/* <Link
          data-testid="shopping-cart-button"
          to="/cart"
        >
          <BackSvg />
          Carrinho de compras
        </Link> */}
        <h1>Descrição do Produto</h1>
        <DetailsCart
          { ...guardProducts }
        />
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => addCartItem(guardProducts) }
        >
          Adicionar ao carrinho
        </button>
        <form>
          <input
            type="email"
            data-testid="product-detail-email"
            name="email"
            value={ email }
            placeholder="email"
            onChange={ this.handleChange }
          />
          { radios }
          <div>
            <textarea
              data-testid="product-detail-evaluation"
              name="text"
              value={ text }
              cols="30"
              rows="10"
              onChange={ this.handleChange }
            />
          </div>
          <div>
            <button
              data-testid="submit-review-btn"
              type="submit"
              onClick={ this.handleClick }
            >
              Enviar
            </button>
          </div>
        </form>
        { erro && <p data-testid="error-msg">Campos inválidos</p> }

        <section>
          {
            comments.length > 0 && (
              comments.map((coment, index) => (
                <div key={ coment + index }>
                  <h5 data-testid="review-card-email">{coment.email}</h5>
                  <span data-testid="review-card-rating">{coment.rating}</span>
                  <p data-testid="review-card-evaluation">{coment.text}</p>
                </div>
              ))
            )
          }
        </section>
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
}.isRequired;
