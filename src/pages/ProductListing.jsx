import React, { Component } from 'react';
import AsideCategory from '../components/AsideCategory';
import { getProductsFromCategoryAndQuery } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../assets/styles/Header.css';
import Header from '../components/Header';
import { getCartTotalQuantity } from '../services/cartManipulation';

export default class ProductListing extends Component {
  state = {
    productList: [],
    searched: false,
    cartegorySelected: '',
    cartSize: 0,
  };

  componentDidMount() {
    this.updateCartSize();
  }

  search = async (event, searchValue) => {
    event.preventDefault();
    if (searchValue.length === 0) {
      this.setState(({
        productList: [],
        searched: true,
      }));
      return;
    }
    const produtos = await getProductsFromCategoryAndQuery(null, searchValue);

    this.setState(({
      productList: produtos.results,
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

  updateCartSize = () => {
    const cartSize = getCartTotalQuantity();
    this.setState({ cartSize });
  };

  render() {
    const { productList, searched, cartSize } = this.state;

    let productsResults = productList.map((productInfos) => (
      <section key={ productInfos.id }>
        <ProductCard
          { ...productInfos }
          updateCartSize={ this.updateCartSize }
        />
      </section>
    ));
    productsResults = productsResults.length ? productsResults
      : <p>Nenhum produto foi encontrado</p>;

    return (
      <main>
        <Header
          search={ this.search }
          cartSize={ cartSize }
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
