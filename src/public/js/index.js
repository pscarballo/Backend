const socket = io();

// const formProducts = document.getElementById("form-products");
// const inputTitle = document.getElementById("form-title");
// const inputDescript = document.getElementById("form-description");
// const inputPrice = document.getElementById("form-price");
// const inputCode = document.getElementById("form-code");
// const inputStock = document.getElementById("form-stock");
// const inputCategory = document.getElementById("form-category");
// const inputThumbnail = document.getElementById("form-thumbnail");

// // Escuchando servidor
// socket.on("products", (products) => {
//   renderProducts(products);
// });

// const renderProducts = (products) => {
//   fetch("/realTimeProducts")
//     .then((result) => result.text())
//     .then((serverTemplate) => {
//       const template = Handlebars.compile(serverTemplate);
//       const html = template({ products });
//       document.getElementById("productList").innerHTML = html;
//     });
// };

// formProducts.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const newProduct = {
//     title: inputTitle.value,
//     description: inputDescript.value,
//     price: +inputPrice.value,
//     thumbnail: inputThumbnail.value,
//     code: inputCode.value,
//     stock: +inputStock.value,
//     category: inputCategory.value,
//   };
//   socket.emit("new-product", newProduct);
// });

//Front-----------------------------------------------------------------------------
let correoDelUsuario = "";

async function pedirEmail() {
  const { value: nombre } = await Swal.fire({
    title: "Enter your mail",
    input: "text",
    inputLabel: "Your mail",
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write your mail!";
      }
    },
  });

  correoDelUsuario = nombre;
}

pedirEmail();

//FRONT EMITE

const chatBox = document.getElementById("chat-box");

chatBox.addEventListener("keyup", ({ key }) => {
  if (key == "Enter") {
    socket.emit("msg_front_to_back", {
      user: correoDelUsuario,
      message: chatBox.value,
    });
    chatBox.value = "";
  }
});

//FRONT RECIBE
socket.on("msg_back_to_front", (msgs) => {
  console.log(msgs);
  let msgsFormateados = "";
  msgs.forEach((msg) => {
    msgsFormateados += "<div style='border: 1px solid red;'>";
    msgsFormateados += "<p>" + msg.user + "</p>";
    msgsFormateados += "<p>" + msg.message + "</p>";
    msgsFormateados += "</div>";
  });
  const divMsgs = document.getElementById("div-msgs");
  divMsgs.innerHTML = msgsFormateados;
});
