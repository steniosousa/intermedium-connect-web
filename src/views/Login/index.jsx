import React, { useEffect, useState } from 'react';
import Api from '../../api/service';
import { useNavigate } from 'react-router-dom';
import background from './Intermedium.png'
import Modal from '../../components/modal';
function Login({ setIsLoggedIn }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [modal, setModal] = useState(false)
  const navigate = useNavigate();

  const [process, setProcess] = useState(false)


  async function handleSingIn(e) {
    e.preventDefault()
    setProcess(true)
    try {
      const { data } = await Api.get('manager/', {
        params: {
          name,
          password
        }
      });
      localStorage.setItem('token', data.id);
      setProcess(false)
      setIsLoggedIn(true);

      navigate(`/home/${data.id}`);
    }
    catch (error) {
      setProcess(false)
      setModal(true)
      console.log(error)
    }
  }
  return (
    <section class="flex flex-col md:flex-row h-screen items-center">
      {modal && <Modal />}
      <div class="bg-white-600 hidden lg:block w-fullh-screen items-align flex justify-center ">
        <img src={background} alt="Logo intermedium" class="  object-rigth  " />
      </div>

      <div class="bg-blue-200 w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center ">

        <div class="w-full h-100 ">

          <h1 class="text-xl font-bold">Intermedium Terceirização</h1>

          <h1 class="text-xl md:text-2xl font-bold leading-tight mt-12">Logar na sua conta</h1>

          <form class="mt-6" action="#" method="POST">
            <div>
              <label class="block text-gray-700">Endereço de email:</label>
              <input type="text" onChange={(e) => setName(e.target.value)} name="" id="" placeholder="Inserir Endereço de Email" class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autofocus autocomplete required />
            </div>

            <div class="mt-4">
              <label class="block text-gray-700">Senha:</label>
              <input onChange={(e) => setPassword(e.target.value)} type="password" name="" id="" placeholder="Inserir Senha" minlength="6" 
                class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none" required />
            </div>

            <div class="text-right mt-2">
              <a href="#" class="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Esqueceu sua senha?</a>
            </div>



            {process ? (
              <div class="text-center">
                <div role="status">
                  <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <button onClick={(e) => handleSingIn(e)} class="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                  px-4 py-3 mt-6">Log In</button>
            )}
          </form>

          <hr class="my-6 border-gray-300 w-full" />

          {/* <button type="button" class="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300">
              <div class="flex items-center justify-center">
              <span class="ml-4">
              Log in
              with
              Google</span>
              </div>
            </button> */}

          <p class="mt-8">Precisa de uma conta? <a href="#" class="text-blue-500 hover:text-blue-700 font-semibold">Crie sua conta com um adm já cadastrado</a></p>

          <p class="text-sm text-gray-500 mt-12">&copy; 2023 Any Software - Todos os direiros reservados.</p>
        </div>
      </div>

    </section>
  )
}

export default Login;
