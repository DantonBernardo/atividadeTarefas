import './App.css';

import { useState, useEffect } from "react";
import { db, auth } from './firebaseConnection';

import { 
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { snapshotEqual } from "firebase/firestore/lite";

function App (){
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const [post, setPost] = useState([]);

  const [usuario, setUsuario] = useState("");
  const [DetalhesUsuario, setDetalhesUsuario] = useState("");

  useEffect(()=>{
    async function carregarPosts(){
      const dados = onSnapshot(collection(db, "posts"), (snapshot)=>{
        let listaPost = [];

        snapshot.forEach((doc)=>{
          console.log(doc)
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPost(listaPost);

      });
    }
    carregarPosts();
  }, []);

  useEffect(()=>{
      async function verificarLogin(params) {
        onAuthStateChanged(auth, (user)=>{
          if(user){
            //se tem usuario logado entra aqui 
            setUsuario(true);
            setDetalhesUsuario({
            id: user.id,
            email: user.email,
          });        
        }
        else {
          //não possui nenhum usuario logado
          setUsuario(false);
          setDetalhesUsuario({});
        }
        })
      }
      verificarLogin();
  }, []);

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(
      ()=>{
        setEmail("");
        setSenha("");
      }
    ).catch((error)=>{
      if(error.code === 'auth/weak.password'){
        alert("Senha muita fraca.")
      }
      else if (error.code === 'auth.email-already-in-use'){
        alert("Email já cadastrado")
      }
    })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
    .then(
      (value)=>{
        setUsuario(true);
        setDetalhesUsuario({
          id: value.user.id,
          email: value.user.email,
        })
        setEmail("");
        setSenha("");
      }
    ).catch((error)=>{
      alert("ERRO: " + error);
    })
  }

  async function fazerLogout() {
    await signOut(auth);
    setUsuario(false);
    setDetalhesUsuario({});
  }

  async function adicionarTarefa(){
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    }).then(()=>{
      alert("Tarefa adicionada com sucesso!");
      setAutor("");
      setTitulo("");
    }).catch((error)=>{
      alert("ERRO" + error);
    })
  }

  async function editarTarefa(){
    const postEditado = doc(db, "posts", idPost);
    await updateDoc(postEditado, {
      titulo: titulo,
      autor, autor
    }).then(()=>{
      alert("Post editado com sucesso!");
      setIdPost("");
      setTitulo("");
      setAutor("");
    }).catch((error)=>{
      alert("Error: " + error)
    })
  }

  async function excluirTarefa(id){

    const postExcluido = doc(db, "posts", id);

    await deleteDoc(postExcluido)
    .then(()=>{
      alert("Post excluido com sucesso!!")
    })
    .catch((error)=>{
      alert("Error: " + error )
    })
  }

  return(
    <div className="container">
      <h1>Listagem de tarefas</h1>

      {usuario && (
        <div className="mensagem_logado">
          <strong>Seja bem-vindo(a)! Você está logado!</strong>
          <span> Email: {DetalhesUsuario.email}</span>
          <br/>
          <button className="botao-sair" onClick={fazerLogout}>Sair</button>
        </div>
      )}

      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input 
          placeholder="Insira um e-mail"  
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Senha:</label>
        <input 
          placeholder="Insira uma senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>

      <div className="botoes">
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
      </div>

      <hr/>

      <h2>Adicionar tarefa:</h2>
      <div>
        <label>Tarefa:</label>
        <input 
          placeholder="Tarefa"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div>
        <label>Autor:</label>
        <input 
          placeholder="Autor"
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
      </div>

      <div className="botoes">
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <h2>Alterar tarefa:</h2>
      <div>
        <label>Id da tarefa:</label>
        <input 
          placeholder="Id da tarefa"
          type="text"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
      </div>

      <div>
        <label>Tarefa:</label>
        <input 
          placeholder="Tarefa"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div>
        <label>Autor:</label>
        <input 
          placeholder="Autor"
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
      </div>

      <div className="botoes">
        <button onClick={editarTarefa}>Editar</button>
      </div>

      <ul className="post-list">
        {post.map((post) => (
          <li key={post.id} className="post-item">
            <strong>ID: {post.id}</strong><br/>
            <strong>Título: {post.titulo}</strong><br/>
            <strong>Autor: {post.autor}</strong><br/>
            <button id="botao-deletar" onClick={() => excluirTarefa(post.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 

export default App;