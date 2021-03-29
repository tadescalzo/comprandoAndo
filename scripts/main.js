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
let googleAuthIn = document.getElementById("googleAuthIn");
let googleAuthOut = document.getElementById("googleAuthOut");
let botonCarga = document.getElementById("botonCarga");
/*ACTIVACION DE LA FUNCION DE GUARDAR*/
let guardar = document
  .getElementById("pantallaCargaAdd")
  .addEventListener("click", guardarTodo);

/*PANTALLA DESCRIPCION PRODUCTOS*/
let pantallaListadoDesc = document
  .getElementById("pantallaListadoLista")
  .addEventListener("click", function (e) {
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
    pantallaListado.style.display = "none";
    pantallaDetalle.style.display = "flex";
    botonCarga.style.display = "none";
  });

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
  console.log(fecha);
  let modelo = `<li class="list-group-item" data-producto="${producto}" data-icono="${icono}" data-info="${info}" data-fecha="${fecha}"> <img src="${icono}" alt="${producto}" class="pantallaListado__icon"> ${producto} </li>`;
  pantallaListadoLista.innerHTML += modelo;

  pantallaCarga.hide();
  pantallaVacio.style.display = "none";
  pantallaListado.style.display = "block";
}

/*CERRAR PANTALLA DETALLE DE PRODUCTO*/

function cerrarDetalle() {
  pantallaListado.style.display = "block";
  pantallaDetalle.style.display = "none";
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
        console.log(name, email, emailVerified);
        googleAuthIn.style.display = "none";
        googleAuthOut.style.display = "block";
        botonCarga.style.display = "block";
        header.style.display = "flex";
        pantallaLogin.style.display = "none";
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
      console.log("out");
      pantallaListadoLista.innerHTML = "";
      header.style.display = "none";
      pantallaListado.style.display = "none";
      botonCarga.style.display = "none";
      pantallaLogin.style.display = "flex";
      googleAuthOut.style.display = "none";
      googleAuthIn.style.display = "block";
    })
    .catch((error) => {
      console.log("No habia nadie loggeado");
    });
});

/*ONCHANGE AUTH*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log(uid);
    window.userRef = db.collection(uid);
    googleAuthOut.style.display = "block";
    googleAuthIn.style.display = "none";
    botonCarga.style.display = "block";
    pantallaLogin.style.display = "none";
    db.collection(uid)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          resultado = doc.data();
          renderDoc(doc);
        });
      });
    if (pantallaListadoLista.innerHTML == "") {
      pantallaVacio.style.display = "flex ";
    }

    /*BORRAR LISTA DE PRODUCTOS*/
    pantallaListadoBorrar.addEventListener("click", (e) => {
      console.log(resultadoDesc);
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
    console.log("No hay nadie loggeado");
    googleAuthOut.style.display = "none";
    googleAuthIn.style.display = "block";
    botonCarga.style.display = "none";
    header.style.display = "none";
  }
});

function renderDoc() {
  let modelo = `<li class="list-group-item" data-producto="${resultado.producto}" data-icono='${resultado.icono}' data-fecha="${resultado.fecha}" data-info="${resultado.info}"><img src="${resultado.icono}" alt="${resultado.producto}" class="pantallaListado__icon">${resultado.producto} </li>`;
  pantallaListadoLista.innerHTML += modelo;
  pantallaVacio.style.display = "none";
  pantallaListado.style.display = "block";
}
