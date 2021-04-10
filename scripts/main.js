// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAtecqzs5aD9ZxR1huzYiNagu_b9r_4w9g",
  authDomain: "comprando-ando.firebaseapp.com",
  projectId: "comprando-ando",
  storageBucket: "comprando-ando.appspot.com",
  messagingSenderId: "620400101853",
  appId: "1:620400101853:web:c7d4932c088e0476644e34",
  measurementId: "G-NJJFDXKBDB",
};
firebase.initializeApp(firebaseConfig);
firebase.auth();
let storage = firebase.storage();
let db = firebase.firestore();
var provider = new firebase.auth.GoogleAuthProvider();
let pantallaCarga = new bootstrap.Modal(
  document.getElementById("pantallaCarga"),
  {}
);
let header = document.getElementById("header");
let pantallaLogin = document.getElementById("pantallaLogin");
let pantallaDetalleCerrar = document.getElementById("pantallaDetalleCerrar");
let pantallaVacio = document.getElementById("pantallaVacio");
let pantallaListado = document.getElementById("pantallaListado");
let pantallaListadoLista = document.getElementById("pantallaListadoLista");
let pantallaDetalle = document.getElementById("pantallaDetalle");
let pantallaListadoBorrar = document.getElementById("pantallaListadoBorrar");
let pantallaTotal = document.getElementById("pantallaTotal");
let pantallaSuma = document.getElementById("pantallaSuma");
let googleAuthIn = document.getElementById("googleAuthIn");
let googleAuthOut = document.getElementById("googleAuthOut");
let botonCarga = document.getElementById("botonCarga");
let cerrarTotal = document.getElementById("cerrarTotal");
let borrarTotal = document.querySelector("#pantallaTotalBorrar");
let botonTotal = document.getElementById("botonTotal");
let sumarCompra = document.getElementById("sumarCompra");
let botonBorrarTodo = document.getElementById("botonBorrarTodo");
/*ACTIVACION DE LA FUNCION DE GUARDAR*/
let guardar = document
  .getElementById("pantallaCargaAdd")
  .addEventListener("click", guardarTodo);

/*FUNCION AL GUARDAR PRODUCTO*/
function guardarTodo() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  fecha = dd + "/" + mm + "/" + yyyy;
  let producto = document.getElementById("pantallaCargaProducto").value;
  let icono = document.getElementById("pantallaCargaIcono").value;
  let info = document.getElementById("pantallaCargaInfo").value;
  document.getElementById("pantallaCargaProducto").value = "";
  document.getElementById("pantallaCargaIcono").value = "";
  document.getElementById("pantallaCargaInfo").value = "";
  userRef.doc(producto).set({
    producto: producto,
    icono: icono,
    info: info,
    fecha: fecha,
  });
  let modelo = `<li class="list-group-item" data-producto="${producto}" data-icono="${icono}" data-info="${info}" data-fecha="${fecha}"> <img src="${icono}" alt="${producto}" class="pantallaListado__icon"> ${producto} </li>`;
  pantallaListadoLista.innerHTML += modelo;

  pantallaCarga.hide();
  pantallaVacio.style.opacity = "0%";
  setTimeout(function () {
    pantallaVacio.style.display = "none";
  }, 1);
  pantallaListado.style.display = "block";
  setTimeout(function () {
    pantallaListado.style.opacity = "100%";
  }, 1);
}

/*PANTALLA DESCRIPCION PRODUCTOS*/
let pantallaListadoDesc = document
  .getElementById("pantallaListadoLista")
  .addEventListener("click", (e) => {
    document.getElementById(
      "pantallaDetalleTitulo"
    ).innerHTML = e.target.getAttribute("data-producto");
    document.getElementById(
      "pantallaDetalleDesc"
    ).innerHTML = e.target.getAttribute("data-info");
    document.getElementById(
      "pantallaDetalleFecha"
    ).innerHTML = e.target.getAttribute("data-fecha");
    document.getElementById("pantallaDetalleIcono").src = e.target.getAttribute(
      "data-icono"
    );
    window.resultadoDesc = e.target.getAttribute("data-producto");
    pantallaDetalle.style.display = "flex";
    setTimeout(function () {
      pantallaDetalle.style.opacity = "100%";
    }, 1);
    pantallaListado.style.opacity = "0%";
    setTimeout(function () {
      pantallaListado.style.display = "none";
    }, 1);
    botonCarga.style.display = "none";
  });

/*CERRAR PANTALLA DETALLE DE PRODUCTO*/

function cerrarDetalle() {
  pantallaListado.style.display = "block";
  setTimeout(function () {
    pantallaListado.style.opacity = "100%";
  }, 1);
  pantallaDetalle.style.opacity = "0%";
  setTimeout(function () {
    pantallaDetalle.style.display = "none";
  }, 1);
  botonCarga.style.display = "block";
  console.log("click");
}

/*FUNCION LOGIN GOOGLE*/
googleAuthIn.addEventListener("click", (e) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      var token = credential.accessToken;
      var user = result.user;
      var user = firebase.auth().currentUser;
      var name, email, photoUrl, uid, emailVerified;

      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        googleAuthIn.style.display = "none";
        googleAuthOut.style.display = "block";
        botonCarga.style.display = "block";
        botonTotal.style.display = "block";
        header.style.display = "flex";
        pantallaLogin.style.opacity = "0%";
        setTimeout(function () {
          pantallaLogin.style.display = "none";
        }, 1);
      } else {
        pantallaLogin.style.opacity = "100%";
        setTimeout(function () {
          pantallaLogin.style.display = "flex";
        }, 1);
      }
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
});

/*LOG OUT GOOGLE*/
googleAuthOut.addEventListener("click", (e) => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      pantallaListadoLista.innerHTML = "";
      header.style.display = "none";
      pantallaListado.style.display = "none";
      botonCarga.style.display = "none";
      pantallaLogin.style.opacity = "100%";
      setTimeout(function () {
        pantallaLogin.style.display = "flex";
      }, 1);
      pantallaVacio.style.opacity = "0%";
      setTimeout(function () {
        pantallaVacio.style.display = "none";
      }, 1);
      googleAuthOut.style.display = "none";
      googleAuthIn.style.display = "block";
    })
    .catch((error) => {});
});

/*ONCHANGE AUTH*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.uid = user.uid;
    window.userRef = db.collection(uid);
    googleAuthOut.style.display = "block";
    googleAuthIn.style.display = "none";
    botonCarga.style.display = "block";
    pantallaLogin.style.opacity = "0%";
    setTimeout(function () {
      pantallaLogin.style.display = "none";
    }, 1);
    db.collection(uid)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          resultado = doc.data();
          if (doc.id != "total") {
            renderDoc(doc);
          }
        });
      });
    if (pantallaListadoLista.innerHTML == "") {
      pantallaLogin.style.opacity = "0%";
      setTimeout(function () {
        pantallaLogin.style.display = "none";
      }, 1);
      pantallaVacio.style.opacity = "100%";
      setTimeout(function () {
        pantallaVacio.style.display = "flex";
      }, 1);
      header.style.display = "flex";
    }
    /*BORRAR LISTA DE PRODUCTOS*/
    pantallaListadoBorrar.addEventListener("click", (e) => {
      db.collection(uid)
        .doc(resultadoDesc)
        .delete()
        .then(() => {
          location.reload();
          cerrarDetalle();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });
  } else {
    googleAuthOut.style.display = "none";
    googleAuthIn.style.display = "block";
    botonCarga.style.display = "none";
    header.style.display = "none";
  }
});

function renderDoc() {
  let modelo = `<li class="list-group-item" data-producto="${resultado.producto}" data-icono='${resultado.icono}' data-fecha="${resultado.fecha}" data-info="${resultado.info}"><img src="${resultado.icono}" alt="${resultado.producto}" class="pantallaListado__icon">${resultado.producto} </li>`;
  pantallaListadoLista.innerHTML += modelo;
  pantallaLogin.style.opacity = "0%";
  setTimeout(function () {
    pantallaLogin.style.display = "none";
  }, 1);
  pantallaVacio.style.opacity = "0%";
  setTimeout(function () {
    pantallaVacio.style.display = "none";
  }, 1);
  pantallaListado.style.display = "block";
}
