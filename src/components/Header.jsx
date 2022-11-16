import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CartSvg } from '../assets/ExportImages';

export default class Header extends Component {
  render() {
    const { searchValue, handleSearch, searchFunction } = this.props;

    return (
      <header className="Header">
        <form className="search-form" onSubmit={ searchFunction }>
          <input
            className="search-form-input"
            type="text"
            data-testid="query-input"
            onChange={ handleSearch }
            value={ searchValue }
            placeholder="Digite o que você busca"
          />
          <button
            className="search-form-button"
            data-testid="query-button"
            type="button"
            onClick={ searchFunction }
          >
            Buscar
          </button>
        </form>
        <Link
          to="/cart"
          data-testid="shopping-cart-button"
        >
          <CartSvg stroke="blue" />
        </Link>
      </header>
    );
  }
}

Header.propTypes = {
  handleSearch: PropTypes.func,
  searchFunction: PropTypes.func,
  searchValue: PropTypes.string,
}.isRequired;
