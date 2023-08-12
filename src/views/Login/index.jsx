import React, { useState } from 'react';
import Api from '../../api/service';
import Modal from '../../components/modal';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [name, setName] = useState('')
    const[password,setPassword] = useState('')
const[modal,setModal] = useState(false)
const navigate = useNavigate(); // Use o hook useNavigate

    async function handleSingIn(e){
        e.preventDefault()

        try{
            const { data } = await Api.get('manager/', {
                params: {
                  name,
                  password
                }
              });
              setIsLoggedIn(true);
              navigate(`/home/${data.id}`);
        }
        catch(error){
            setModal(true)
            console.log(error)
        }
    }
  return (
    <>
    {modal?(
        <Modal/>
    ):null}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Logar na sua conta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm pl-8">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Nome:
              </label>
              <div className="mt-2">
                <input
                    onChange={(e) =>setName(e.target.value)}
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="block  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 pl-4 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha:
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full pl-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
              onClick={(e)=>handleSingIn(e)}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
               Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login;
