var express = require("express");
var exphbs = require("express-handlebars");

var app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

const MongoClient = require("mongodb").MongoClient;
const test = require("assert");
// Connection url
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "tienda";
var baseDatos;

// Connect using MongoClient
MongoClient.connect(url, function(err, client) {
  baseDatos = client.db(dbName);

  //client.close();
});

var contexto = {
  productos: [
    {
      titulo: "collar",
      imagen: "./images/productos/correa.png",
      descripcion:
        "Es un producto para mascotas que le permitira controlar a su mascota en cualquier momento",
      precio: "$25.000"
    },
    {
      titulo: "correa",
      imagen: "./images/productos/correa.png",
      descripcion:
        "Es un producto para mascotas que le permitira controlar a su mascota en cualquier momento",
      precio: "$35.000"
    },
    {
      titulo: "lazo",
      imagen: "./images/productos/correa.png",
      descripcion:
        "Es un producto para mascotas que le permitira controlar a su mascota en cualquier momento",
      precio: "$15.000"
    },
    {
      titulo: "comida",
      imagen: "./images/productos/correa.png",
      descripcion:
        "Es un producto para mascotas que le permitira controlar a su mascota en cualquier momento",
      precio: "$50.000"
    }
  ]
};

app.get("/tienda", function(request, response) {
  let contenido = {};
  let query = {};

  let coleccion = baseDatos.collection("productos");

  coleccion.find(query).toArray(function(err, items) {
    test.equal(null, err);
    contenido.productos = items;
    if (contenido != null) {
      response.render("tienda", contenido);
    }
  });
});

app.get("/producto/:item?", function(request, response) {
  let contenido = null;
  let query = {};

  let ite = request.params.item;
  if (ite != null) {
    query = { nombre: ite };
  }

  let coleccion = baseDatos.collection("productos");

  coleccion.find(query).toArray(function(err, items) {
    test.equal(null, err);
    contenido = items;
    if (contenido != null) {
      response.render("producto", contenido[0]);
    }
  });
});

app.get("/filtro/:item?", function(request, response) {
  let contenido = null;

  let info = request.params.item;
  
  let filtros = info.split("&");
  
  let query = {};

  filtros.forEach(f => {
    let i = f.split(":");
    

    if(i[0] == "marca"){
      query.marca = i[1];
    }

    if(i[0] == "envio"){
      query.envio = i[1];
    }

    if(i[0] == "etapa"){
      query.etapa = i[1];
    }
  });

  console.log(query)

  
  let coleccion = baseDatos.collection("productos");
  
  coleccion.find({}).toArray(function(err, items) {
    test.equal(null, err);
    contenido = items;
    if (contenido != null) {
      response.render("tienda", contenido[0]);
    }
  });



});

app.get("/pedido", function(request, response) {
  response.render("pedido", {});
});

app.post("/enviar", function(request, response) {
  let pedido = {
    correo: request.body.correo,
    fecha: new Date(),
    estado: "En espera"
  };

  let coleccion = baseDatos.collection("pedidos");
  coleccion.insertOne(pedido, function(err) {
    assert.equal(err, null);

    console.log("pedido guardado");
  });

  let contendio = {
    titulo: "Página principal",
    mensaje: "pedido guardado"
  };

  response.redirect("/");
});

app.get("/envioproductos", function() {});

app.get("/carrito", function(request, response) {
  let contenido = {};
  let query = {};

  response.render("carrito", contenido);
});

app.listen(3000, function() {
  console.log("Escuchando en el puesto 3000");
});
