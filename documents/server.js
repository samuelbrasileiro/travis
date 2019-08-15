var app = express();
var port = 8000;
var users = [];
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var admin = require("firebase-admin");

var serviceAccount = require("./secret.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://samuelteste-cd775.firebaseio.com"
  });
let db = admin.firestore();
let collection = db.collection("usuarios");
app.listen(port,function() {
    console.log("Server is running at port "+port);

});
app.get("/useros/:usuario", function(req,res){

    let usuario = req.params.usuario;
    res.send({usuario});
});
app.get("/users", function(req,res){
    collection.get().then(function(documents){
        let array = [];
        if(documents.empty) {
            console.log("Não existe o documento procurado");
            return;
        }
        documents.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            array.push(doc.data());
        });
        res.send(array);
    });
});
app.post("/addUser", function(req,res){
    var nome = req.body.nome;
    var idade = req.body.idade;
    var cidade = req.body.cidade;
    var curso = req.body.curso;
    let user = {
        "nome":nome,
        "idade":idade,
        "cidade":cidade,
        "curso":curso
    };
    collection.add(user).then(function(req){//se deu certo entra aqui
        console.log("Adicionado "+ user.nome + " com sucesso");
        res.sendStatus(200);
    }).catch();
    res.send(user);
});

app.post("/addFood", function(req,res){
    let stock = db.collection("comidas");
    
    var name = req.body.name;
    var id = req.body.id;
    var price = req.body.price;
    let pointerData = db.collection("dados").doc('EEBDfls1juoeF2sBDcXr');
    let value = 0;
    pointerData.get().then(function(pointer){
        let pt = pointer.data();
        value = pt["pointer"];
        value += 1;
        pointerData.update({
            "pointer": value
        }); 
        let food = {
            "name":name,
            "id":value,
            "price":price
        };
        stock.add(food).then().catch();
        res.send(food);
    });
    
    
});

app.post("/checkQR",function(req,res){
    var qr = req.body.qr;
    var user = req.body.user;
    let stock = db.collection("comidas");
    stock.get().then(function(documents){
        
        if(documents.empty) {
            console.log("Não existe o documento procurado");
            return;
        }
        documents.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            if(doc.data()["id"]==qr){
                console.log("Você adicionou " + doc.data()["name"]);
            }
        });
        res.send(qr);
    });
});
