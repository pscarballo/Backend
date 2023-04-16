class ProductManager {
  id = 0;

  constructor() {
    this.products = [];
  }

  addProduct(product) {
    let checkCode = this.products.find((p) => p.code === product.code);
    if (checkCode) {
      return "Code already exists";
    }

    if (Object.values(product).some((x) => x === "")) {
      return "Property missing";
    }

    let newProduct = { ...product, id: this.id };
    this.products.push(newProduct);
    this.id++;
    return "Product added";
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    let found = this.products.find((p) => p.id === id);
    if (!found) {
      return "Not found";
    }
    return found;
  }
}

const product = {
  title: "Jordan12",
  description: "Zapatillas",
  price: 250,
  thumbnail:
    "https://www.comedera.com/wp-content/uploads/2022https://www.snipesusa.com/dw/image/v2/BFKF_PRD/on/demandware.static/-/Sites-snipes-master-catalog/default/dw19fdbccb/images/hi-res/jordan_ct8013-071_06.jpg?sw=800&sh=1004&strip=false/04/Papas-rusticas-shutterstock_2022241940-768x479.jpg",
  code: "AB123",
  stock: 50,
};

const productManager = new ProductManager();

console.log(productManager.addProduct(product));
console.log(productManager.getProducts());
console.log(productManager.getProductById(43));
