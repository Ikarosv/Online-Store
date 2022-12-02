import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../assets/styles/ProductCard.css';
import {
  addCartItem,
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
} from '../services/cartManipulation';

export default class ProductCard extends Component {
  render() {
    const {
      title, price, thumbnail,
      id, quantity, updateCart,
      updateCartSize, available_quantity: availableQuantity } = this.props;
    return (
      <section>
        <Link
          data-testid="product-detail-link"
          to={ `/productdetails/${id}` }
        >
          <div
            data-testid="product"
            className="product-card"
          >
            <h4 data-testid="shopping-cart-product-name">{ title }</h4>
            <img src={ thumbnail } alt={ title } />
            <h4>{ `R$ ${price}` }</h4>
          </div>
        </Link>
        {
          quantity
          && (
            <section>
              <button
                data-testid="remove-product"
                type="button"
                onClick={ () => {
                  removeProduct(this.props);
                  updateCart();
                } }
              >
                Remover produto
              </button>
              <button
                data-testid="product-decrease-quantity"
                type="button"
                onClick={ () => {
                  decreaseQuantity(this.props);
                  updateCart();
                } }
              >
                -
              </button>
              <h5
                data-testid="shopping-cart-product-quantity"
              >
                {`Produtos no carrinho: ${quantity}`}
              </h5>
              <button
                data-testid="product-increase-quantity"
                type="button"
                onClick={ () => {
                  increaseQuantity(this.props);
                  updateCart();
                } }
                disabled={ quantity >= availableQuantity }
              >
                +
              </button>
            </section>
          )
        }
        <button
          type="button"
          data-testid="product-add-to-cart"
          onClick={ () => addCartItem(this.props, updateCartSize) }
        >
          Adicionar ao carrinho
        </button>
      </section>
    );
  }
}

ProductCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  price: PropTypes.number,
  updateCart: PropTypes.func,
}.isRequired;
