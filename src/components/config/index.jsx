import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';


export default function Config({ showModal, onClose, companyId }) {

  const [loading, setLoading] = useState(null)
  const [sucess, setSucess] = useState(null)
  const [message, setMessage] = useState('')
  const [objects, setObjects] = useState([])
  const [places, setPlaces] = useState([])
  const [users, setUsers] = useState([])
  const [companys, setCompanys] = useState([])

  const [fixObj, setFixObj] = useState([])

  const [check, setCheck] = useState([])


  const id = localStorage.getItem('token')
  const handleClose = () => {
    onClose();

  };


  async function retriveDatas() {
    setLoading(true)
    try {
      const [object, place, users, company] = await Promise.all([
        Api.get('object', { data: { companyId: companyId.companys.id } }),
        Api.get('place', { data: { companyId: companyId.companys.id } }),
        Api.get('/user/allUsers', { params: { id } }),
        Api.get('company/all')
      ]);
      setLoading(false)
      setObjects(object.data)
      setPlaces(place.data)
      setUsers(users.data)
      setCompanys(company.data)
    }
    catch (error) {
      setLoading(false)
      setSucess('error')
    }


  }






  async function deletionPlace(placeId) {
    setLoading(true)
    try {
      await Api.delete('/place', {
        params: {
          placeId: placeId.id
        }
      })
      setMessage('Ambiente deletado com sucesso')
      setSucess('sucess')
      retriveDatas()
    } catch (error) {
      setLoading(false)
      setMessage('Ambiente sendo usado em alguma solicitação')
      setSucess('error')
    }
  }

  async function DeleteObject(objectId) {
    setLoading(true)
    try {
      await Api.delete('/object', {
        params: {
          objectId: objectId.id
        }
      })
      setMessage('Objeto deletado com sucesso')
      setSucess('sucess')
      retriveDatas()
    } catch (error) {
      setLoading(false)
      setMessage('Objeto sendo usado em alguma solicitação')
      setSucess('error')
    }
  }


  function handleSelect(datas) {
    setFixObj([])
    setCheck([])
    datas.map((item) => {
      let obj = {};
      obj['id'] = item.id;
      obj['name'] = item.name || '';
      obj['hash'] = item.loginHash || ''
      obj['status'] = item.active || ''
      setFixObj((oldstate) => [...oldstate, obj])
    })

  }
  function openAlert() {
    loading(!showAlert)
  }


  function handleSelectForEditOrDeletion(item) {
    setCheck((oldState) => {
      const isItemInState = oldState.includes(item);
      return isItemInState ? oldState.filter((i) => i !== item) : [...oldState, item];
    });
  }

  useEffect(() => {
    retriveDatas()
  }, [])

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">


          {loading && <Alert onCloseAlert={openAlert} showAlert={loading} />}

          <div className="flex min-h-full min-w-lg items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 text-center shadow-xl m-4 transition-all sm:my-8 sm:w-full min-w-lg">
                {sucess == 'sucess' ? (
                  <div role="alert">
                    <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                      Sucesso!
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                      <p>{message}</p>
                    </div>
                  </div>

                ) : sucess == 'error' ? (
                  <div role="alert">
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                      Erro!
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                      <p>{message}</p>
                    </div>
                  </div>

                ) : null}
                <div>
                  <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mx-auto grid max-w-2xl  self-center grid-cols-1 items-center  lg:max-w-max m-10 " >

                  <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                      <div class="flex md:order-2">
                        <div>
                          <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                          <span class="sr-only">Open main menu</span>
                          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                          </svg>
                        </button>
                      </div>
                      <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                          <li >
                            <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">CONFIGURAÇÕES</a>
                          </li>
                          <li onClick={() => handleSelect(users)}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Usuários</a>
                          </li>
                          <li onClick={() => handleSelect(objects)}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Objetos</a>
                          </li>
                          <li onClick={() => handleSelect(places)}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Ambientes</a>
                          </li>
                          <li onClick={() => handleSelect(companys)}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Empresas</a>
                          </li>
                          <li >
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Administradores</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                  <div className='flex flex-row my-8 justify-between w-full '>
                    {fixObj.length != 0 ? (
                      <div className='flex flex-col'>
                        <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Criar</button>
                        {check.length != 0 ? (
                          <>
                            <button type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Editar</button>
                            <button type="button" class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Excluir</button>
                          </>

                        ) : (
                          <>
                            <button type="button" disabled class="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Editar</button>
                            <button type="button" disabled class="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Excluir</button>
                          </>

                        )}

                      </div>

                    ) : null}
                    <div>
                      <table class="text-sm text-left text-gray-500 dark:text-gray-400">
                        {fixObj.length != 0 ? (
                          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" class="px-6 py-3">
                                Nome
                              </th>
                              <th scope="col" class="px-6 py-3">
                                HASH
                              </th>
                              <th scope="col" class="px-6 py-3">
                                Category
                              </th>
                              <th scope="col" class="px-6 py-3">

                              </th>
                            </tr>
                          </thead>
                        ) : (
                          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" class="px-6 py-3">
                                CONFIGURE SEU SISTEMA DA MELHOR MANEIRA PARA VOCÊ
                              </th>
                            </tr>
                          </thead>
                        )}

                        <tbody>
                          {fixObj.map((item) => {
                            return (
                              <tr class="bg-white border-b py-6 dark:bg-gray-800 dark:border-gray-700 ">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {item.name}
                                </th>
                                <td class="px-6 py-4">
                                  {item.hash}
                                </td>
                                <td class="px-6 py-4">
                                  {item.status}
                                </td>
                                <td>
                                  {
                                    check.includes(item.id) ? (
                                      <div
                                        role="checkbox"
                                        aria-checked="true"
                                        onClick={() => handleSelectForEditOrDeletion(item.id)}
                                        className='text-blue-800 font-2x1 cursor-pointer'
                                      >
                                        &#x2713;
                                      </div>
                                    ) : (
                                      <div
                                        role="checkbox"
                                        aria-checked="false"
                                        onClick={() => handleSelectForEditOrDeletion(item.id)}
                                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                      >
                                      </div>
                                    )
                                  }
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                  </div>




                  {/* <div>
                    <div className='flex flex-row justify-center align-center '>
                      <div className='flex flex-col items-center align-center justify-center'>
                        <h1 className='m-4 font-bold'>OBJETOS:</h1>
                        <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                         
                        </div>
                      </div>
                    </div> */}

                  {/* </div> */}
                </div>
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
