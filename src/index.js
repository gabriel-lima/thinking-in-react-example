import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const data = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football"
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball"
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball"
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch"
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5"
  },
  {
    category: "Electronics",
    price: "$199.99",
    stocked: true,
    name: "Nexus 7"
  }
];

function App() {
  return <FilterableProductTable />;
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: "",
      inStockOnly: false
    };
  }

  handleSearch = (filterText, inStockOnly) => {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  };

  render() {
    return (
      <div className="filterable-product-table">
        <SearchBar onSearch={this.handleSearch} />
        <ProductTable
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: props.filterText,
      inStockOnly: props.inStockOnly
    };
  }

  handleFilterText = event => {
    this.setState({ filterText: event.target.value });
  };

  handleInStockOnly = () => {
    this.setState(prevState => ({ inStockOnly: !prevState.inStockOnly }));
  };

  handleKeyPress = event => {
    if (event.key === "Enter") {
      this.props.onSearch(this.state.filterText, this.state.inStockOnly, event);
    }
  };

  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Type something..."
          onChange={this.handleFilterText}
          onKeyPress={this.handleKeyPress}
        />
        <button
          onClick={event =>
            this.props.onSearch(
              this.state.filterText,
              this.state.inStockOnly,
              event
            )
          }
        >
          Search
        </button>
        <br />
        <input
          type="checkbox"
          id="in-stock-only"
          onChange={this.handleInStockOnly}
        />
        <label htmlFor="in-stock-only">Only show products in stock</label>
      </div>
    );
  }
}

class ProductTable extends React.Component {
  filterProductsByName = products => {
    if (this.props.filterText) {
      const re = new RegExp(this.props.filterText, "gi");
      return products.filter(product => product.name.match(re));
    }
    return products;
  };

  filterProductsInStockOnly = products => {
    if (this.props.inStockOnly) {
      return products.filter(product => product.stocked);
    }
    return products;
  };

  renderProductElements = products => {
    let elements = [];
    let categoriesAlreadyAdded = [];

    for (let product of products) {
      if (!categoriesAlreadyAdded.includes(product.category)) {
        categoriesAlreadyAdded.push(product.category);
        elements.push(
          <ProductCategoryRow
            key={product.category}
            category={product.category}
          />
        );
      }
      elements.push(
        <ProductRow
          key={product.name}
          name={product.name}
          price={product.price}
        />
      );
    }
    return elements;
  };

  render() {
    let products = data.slice();
    products = this.filterProductsByName(products);
    products = this.filterProductsInStockOnly(products);

    return (
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{this.renderProductElements(products)}</tbody>
      </table>
    );
  }
}

function ProductCategoryRow(props) {
  return (
    <tr>
      <td colSpan="2">
        <strong>{props.category}</strong>
      </td>
    </tr>
  );
}

function ProductRow(props) {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.price}</td>
    </tr>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
