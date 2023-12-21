import React, { useEffect, useState } from 'react';
import Api from '../../api/service';
import { useNavigate } from 'react-router-dom';
import background from './Intermedium.png'
import Modal from '../../components/modal';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import Swal from 'sweetalert2';
function Login({ setIsLoggedIn }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [forgot, setForgot] = useState(false)
  const [process, setProcess] = useState(false)
  const [passwordEye, setPasswordEye] = useState(false)
  const [alert, setAlert] = useState(null)
  const [emailRecovery, setEmailRecovery] = useState('')

  const navigate = useNavigate();



  async function handleSingIn(e) {
    e.preventDefault()
    setProcess(true)
    try {
      const { data } = await Api.get('manager/find', {
        params: {
          email: name,
          password
        }
      });

      localStorage.setItem('token', data.id);
      setProcess(false)
      setIsLoggedIn(true);

      localStorage.setItem('manager', JSON.stringify(data))
      navigate(`/home/${data.id}`);
    }
    catch (error) {
      setProcess(false)
      const confirm = await Swal.fire({
        icon: 'error',
        title: 'Email ou Senha inválidos',
        html: `
        <p>Veifique seu email e sua senha</p>`,
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        denyButtonText: 'Ok',
      })
    }
  }
  function handleForgot(e) {
    e.preventDefault()
    setForgot(!forgot)
  }

  function sendEmail() {
    if (emailRecovery == '') {
      setAlert('error')
      return
    }
  }
  const hadlePasswordEye = () => {
    setPasswordEye(!passwordEye)
  }
  useEffect(() => {
    setTimeout(() => { setAlert(null) }, 5000)
  }, [alert])
  return (
    <>
      {forgot && <div className="bg-indigo-900 text-center py-4 lg:px-4">
        <div className="p-2 bg-indigo-800 items-center  leading-none lg:rounded-full flex lg:inline-flex" role="alert">
          <input type="text" onChange={(e) => setEmailRecovery(e.target.value)} placeholder="Inserir Endereço de Email" className="w-full ml-2 mr-2 px-4 py-2 rounded-lg bg-gray-200 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus autocomplete required />
          <span onClick={sendEmail} className="flex text-indigo-100 rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Recuperar</span>
        </div>
      </div>}
      {alert == 'error' ? (
        <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Erro - Verifique email enviado.
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>Ocorreu um erro inesperado, favor verificar email enviado e sua conexão com a internet.</p>
          </div>
        </div>
      ) : alert == 'sucess' ? (
        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
            <div>
              <p className="font-bold">Our privacy policy has changed</p>
              <p className="text-sm">Make sure you know how these changes affect you.</p>
            </div>
          </div>
        </div>
      ) : null}
      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-white-600 hidden lg:block w-fullh-screen items-align flex justify-center ">
          <img src={background} alt="Logo intermedium" className="  object-rigth  " />
        </div>

        <div className="bg-blue-200 w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center ">

          <div className="w-full h-100 ">

            <h1 className="text-xl font-bold">Intermedium Terceirização</h1>

            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">Logar na sua conta</h1>

            <form className="mt-6" action="#" method="POST">
              <div>
                <label className="block text-gray-700">Endereço de email:</label>
                <input type="text" onChange={(e) => setName(e.target.value)} name="" id="" placeholder="Inserir Endereço de Email" className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none" autoFocus autocomplete required />
              </div>

              <div className="mt-4">
                <label className="block text-gray-700">Senha:</label>
                <div className='flex flex-row items-center'>
                  <input onChange={(e) => setPassword(e.target.value)} type={(passwordEye === false) ? 'password' : 'text'} name="" id="" placeholder="Inserir Senha" minlength="6"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                  focus:bg-white focus:outline-none" required />
                  <div className='text-2xl absolute right-16'>
                    {
                      (passwordEye === false) ? <AiFillEyeInvisible onClick={hadlePasswordEye} /> :
                        <AiFillEye onClick={hadlePasswordEye} />
                    }
                  </div>

                </div>
              </div>




              {process ? (
                <div className="text-center mt-4">
                  <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <button onClick={(e) => handleSingIn(e)} className="w-full block bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 text-white font-semibold rounded-lg
                  px-4 py-3 mt-6">Log In</button>
              )}
              <div className="text-right mt-2">
                <button onClick={(e) => handleForgot(e)} className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">Esqueceu sua senha?</button>
              </div>

            </form>

            <hr className="my-6 border-gray-300 w-full" />



            <p className="mt-8">Precisa de uma conta? <a href="#" className="text-blue-500 hover:text-blue-700 font-semibold">Crie sua conta com um adm já cadastrado</a></p>

            <p className="text-sm text-gray-500 mt-12">&copy; 2023 Any Software - Todos os direiros reservados.</p>
          </div>
        </div>

      </section>
    </>

  )
}

export default Login;
