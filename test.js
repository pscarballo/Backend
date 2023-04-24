const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.id = -1;
    const productsString = fs.readFileSync(this.path, "utf-8");
    const products = JSON.parse(productsString);
    this.products = products;
  }

  addProduct(product) {
    let newProduct = { ...product, id: ++this.id };
    this.products.push(newProduct);
    const productsString = JSON.stringify(this.products);
    fs.writeFileSync(this.path, productsString);
    return "Product Added";
  }

  getProducts() {
    return this.products;
  }

  getProductById(searchId) {
    let foundId = this.products.find((e) => e.id === searchId);
    if (!foundId) {
      return "Id not found";
    }
    return foundId;
  }

  updateProduct(searchId, priceToUpdate) {
    let foundId = this.products.findIndex((e) => e.id === searchId);

    if (foundId === -1) {
      return "Id not found";
    } else {
      this.products[searchId].price = priceToUpdate;
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      return "Product Update";
    }
  }

  deleteProduct(searchId) {
    let foundId = this.products.findIndex((e) => e.id === searchId);

    if (foundId === -1) {
      return "Id not found";
    } else {
      this.products.splice(foundId, 1);
      fs.writeFileSync(this.path, JSON.stringify(this.products));
      return "Delete File";
    }
  }
}

const product = {
  title: "Jordan12",
  description: "Zapatillas",
  price: 250,
  thumbnail:
    "https://www.comedera.com/wp-content/uploads/2022https://www.snipesusa.com/dw/image/v2/BFKF_PRD/on/demandware.static/-/Sites-snipes-master-catalog/default/dw19fdbccb/images/hi-res/jordan_ct8013-071_06.jpg?sw=800&sh=1004&strip=false/04/Papas-rusticas-shutterstock_2022241940-768x479.jpg",
  code: "abc123",
  stock: 50,
};
const product1 = {
  title: "Jordan13",
  description: "Zapatillas",
  price: 220,
  thumbnail:
    "https://www.comedera.com/wp-content/uploads/2022https://www.snipesusa.com/dw/image/v2/BFKF_PRD/on/demandware.static/-/Sites-snipes-master-catalog/default/dw19fdbccb/images/hi-res/jordan_ct8013-071_06.jpg?sw=800&sh=1004&strip=false/04/Papas-rusticas-shutterstock_2022241940-768x479.jpg",
  code: "abc123",
  stock: 25,
};

const productManager = new ProductManager("productos.json");

productManager.addProduct(product);
productManager.addProduct(product1);

//console.log(productManager.getProducts());
//console.log(productManager.getProductById(0));
//console.log(productManager.updateProduct(1, 1220));
//console.log(productManager.deleteProduct(1));
