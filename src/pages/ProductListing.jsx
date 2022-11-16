import React, { Component } from 'react';
import AsideCategory from '../components/AsideCategory';
import { getProductsFromCategoryAndQuery } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../assets/styles/Header.css';
import Header from '../components/Header';

export default class ProductListing extends Component {
  state = {
    productList: [],
    searchValue: '',
    searched: false,
    cartegorySelected: '',
  };

  productSearch = ({ target }) => {
    const { value } = target;
    this.setState(({
      searchValue: value,
    }));
  };

  search = async (event) => {
    event.preventDefault();
    const { searchValue } = this.state;
    const produtos = await getProductsFromCategoryAndQuery(null, searchValue);

    this.setState(({
      productList: produtos.results,
      searchValue: '',
      searched: true,
    }));
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, async () => {
      const { cartegorySelected } = this.state;
      const productList = await getProductsFromCategoryAndQuery(cartegorySelected, null);
      this.setState({
        productList: productList.results,
        searched: true,
      });
    });
  };

  render() {
    const { productList, searchValue, searched } = this.state;

    let productsResults = productList.map((productInfos) => (
      <section key={ productInfos.id }>
        <ProductCard
          { ...productInfos }
        />
      </section>
    ));
    productsResults = productsResults.length ? productsResults
      : <p>Nenhum produto foi encontrado</p>;

    return (
      <main>
        <Header
          searchValue={ searchValue }
          searchFunction={ this.search }
          handleSearch={ this.productSearch }
        />

        <main className="flex-row">
          <AsideCategory handleChange={ this.handleChange } />
          <section className="flex-row flex-wrap">
            {
              (!productList.length && !searched) && (
                <h3
                  data-testid="home-initial-message"
                >
                  Digite algum termo de pesquisa ou escolha uma categoria.
                </h3>
              )
            }
            {
              searched && productsResults
            }
          </section>
        </main>
      </main>
    );
  }
}
