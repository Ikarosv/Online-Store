import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CartSvg } from '../assets/ExportImages';

export default class Header extends Component {
  state = {
    searchValue: '',
  };

  productSearch = ({ target }) => {
    const { value } = target;
    this.setState(({
      searchValue: value,
    }));
  };

  handleSubmit = (event) => {
    const { search } = this.props;
    const { searchValue } = this.state;
    search(event, searchValue);
    this.setState({
      searchValue: '',
    });
  };

  render() {
    const { searchValue } = this.state;
    const { cartSize } = this.props;
    return (
      <header className="Header">
        <form className="search-form" onSubmit={ this.handleSubmit }>
          <input
            className="search-form-input"
            type="text"
            data-testid="query-input"
            onChange={ this.productSearch }
            value={ searchValue }
            placeholder="Digite o que você busca"
          />
          <button
            className="search-form-button"
            data-testid="query-button"
            type="button"
            onClick={ this.handleSubmit }
          >
            Buscar
          </button>
        </form>
        <Link
          to="/cart"
          data-testid="shopping-cart-button"
        >
          <CartSvg stroke="blue" />
          <span data-testid="shopping-cart-size">
            {cartSize}
          </span>
        </Link>
      </header>
    );
  }
}

Header.propTypes = {
  search: PropTypes.func,
  cartSize: PropTypes.number.isRequired,
};

Header.defaultProps = {
  search: () => {},
};
