import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';
import Modal from '../popup';
import Swal from 'sweetalert2'

export default function Config({ showModal, onClose, companyId }) {

  const [loading, setLoading] = useState(null)
  const [objects, setObjects] = useState([])
  const [places, setPlaces] = useState([])
  const [users, setUsers] = useState([])
  const [companys, setCompanys] = useState([])
  const [epis, setEpis] = useState([])

  const [selectArgFromCreate, setSelectArgFromCreate] = useState('')
  const [nameOfCreation, setNameOfCreation] = useState('')
  const [emailOfCreation, setEmailOfCreation] = useState('')
  const [fixObj, setFixObj] = useState([])

  const [route, setRoute] = useState('')
  const [check, setCheck] = useState([])

  const [create, setCreate] = useState(false)
  const [usersEdit, setUsersEdit] = useState(false)
  const [comapnyForNewManager, setCompanyForNewManager] = useState('')



  const handleClose = () => {
    onClose();

  };

  const showComponent = () => {
    setFixObj([]);
    setUsersEdit(!usersEdit);
  };


  async function retriveDatas() {
    console.log(companyId)
    setLoading(true)
    try {
      const [object, place, users, company, epi] = await Promise.all([
        Api.get('objects/recover', { params: { companyId: companyId } }),
        Api.get('place/recover', { params: { companyId: companyId } }),
        Api.get('/user/recover', { params: { companyId: companyId } }),
        Api.get('companies/recover'),
        Api.get('/epis/recover', { params: { companyId: companyId } }),
      ]);
      setLoading(false)
      setObjects(object.data)
      setPlaces(place.data)
      setUsers(users.data)
      setCompanys(company.data)
      console.log(epi)
      setEpis(epi.data)
    }
    catch (error) {
      setLoading(false)

      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar dados',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }

  }


  async function deletion() {
    if (selectArgFromCreate == 'epis') {
      const confirm = await Swal.fire({
        icon: 'info',
        title: 'Deseja realizar a deleção?',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      if (!confirm.isConfirmed) return
    } else {

      const confirm = await Swal.fire({
        icon: 'info',
        title: 'Deseja realizar a deleção?',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      if (!confirm.isConfirmed) return
    }


    check.map(async (item) => {
      setLoading(true)
      let params = {}
      params[`${route}Id`] = item
      try {
        await Api.delete(`${selectArgFromCreate}/delete`, {
          params
        })
        await Swal.fire({
          icon: 'success',
          title: 'Deleção bem sucedida',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })
        await retriveDatas()
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Não foi possível deletar',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })
      }
    })
  }


  function handleSelect(datas, routeCurrent) {
    setRoute(routeCurrent)
    retriveDatas()
    setFixObj([])
    setCheck([])
    setCreate(false)
    setSelectArgFromCreate(routeCurrent)
    datas.map((item) => {
      let obj = {};
      obj['id'] = item.id;
      obj['name'] = item.name || '';
      obj['hash'] = item.loginHash || ''
      obj['role'] = item.role || ''
      setFixObj((oldstate) => [...oldstate, obj])
    })

  }
  function openAlert() {
    loading(!showAlert)
  }
  async function handleCreation() {
    const confirm = await Swal.fire({
      icon: 'info',
      title: `Deseja cadastrar ${selectArgFromCreate}?`,
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })
    if (!confirm.isConfirmed) return
    setLoading(true)
    if (nameOfCreation === '') {
      await Swal.fire({
        icon: 'info',
        title: 'Campo de nome vazio',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      setLoading(false)

      return
    }
    const send = {
      companyId: selectArgFromCreate == "manager" ? comapnyForNewManager : companyId,
      name: nameOfCreation,
      email: emailOfCreation
    }
    try {
      await Api.post(`${selectArgFromCreate}/create`, send)
      setLoading(false)
      await Swal.fire({
        icon: 'success',
        title: 'Criação bem sucessedida',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
    catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao efetuar criação',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      setLoading(false)

    }


  }


  function handleSelectForEditOrDeletion(item) {
    setCheck((oldState) => {
      const isItemInState = oldState.includes(item);
      return isItemInState ? oldState.filter((i) => i !== item) : [...oldState, item];
    });
  }

    


  useEffect(() => {
    retriveDatas()
  }, [route])

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


                {create ? (

                  <div className='my-20 align-center flex flex-col justify-center'>

                    <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Criação de:</label>
                    <select selected onChange={(value) => setSelectArgFromCreate(value.target.value)} id="countries" class="m-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 align-center self-center dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option hidden  >Selecione</option>
                      <option value="objects">Objetos</option>
                      <option value="place">Ambientes</option>
                      <option value="companies">Empresa</option>
                      <option value='epis'>EPI</option>
                      <option value="manager">Administrador</option>
                    </select>
                    {selectArgFromCreate == 'manager' ? (
                      <>
                        <select selected id="countries" onChange={(i) => setCompanyForNewManager(i.target.value)} class="m-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 dark:bg-gray-700 align-center self-center dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option hidden>Selecione a empresa</option>
                          {companys.map((item) => {
                            return (
                              <option value={item.id}>{item.name}</option>

                            )
                          })}
                        </select>
                        <input onChange={(value) => setNameOfCreation(value.target.value)} type="text" id="website-admin" class="my-4 rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome" />
                        <input onChange={(value) => setEmailOfCreation(value.target.value)} type="email" id="website-admin" class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o email" />

                      </>

                    ) : (
                      <input onChange={(value) => setNameOfCreation(value.target.value)} type="text" id="website-admin" class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Informe o nome" />

                    )}

                    <div className='m-6'>
                      <button onClick={handleCreation} type="button" class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Criar</button>
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

                  <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                      <div className="flex md:order-2">
                        <div>
                          <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                          <span className="sr-only">Open main menu</span>
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                          </svg>
                        </button>
                      </div>
                      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                          <li >
                            <a href="#" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">CONFIGURAÇÕES</a>
                          </li>
                          <li onClick={() => handleSelect(users, 'user')}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Usuários</a>
                          </li>
                          <li onClick={() => handleSelect(objects, 'objects')}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Objetos</a>
                          </li>
                          <li onClick={() => handleSelect(places, 'place')}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Ambientes</a>
                          </li>
                          <li onClick={() => handleSelect(companys, 'companies')}>
                            <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Empresas</a>

                          </li>

                          <li onClick={() => handleSelect(epis, 'epis')}>
                            <a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">EPIs</a>

                          </li>
                          <li >
                            <a href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Administradores</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                  {usersEdit && <Modal userId={check} closeModal={() => {
                    setUsersEdit(false)
                  }} />}
                  <div className='flex flex-row my-8 justify-between w-full '>
                    {fixObj.length != 0 ? (
                      <div className='flex flex-col'>

                        <button type="button" onClick={() => { setCreate(!create); setFixObj([]) }} class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Criar</button>
                        {check.length != 0 ? (
                          <>
                            {check.length == 1 ? (
                              <button type="button" onClick={showComponent} class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Editar</button>
                            ) : null}
                            <button type="button" onClick={deletion} class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Excluir</button>

                          </>

                        ) : (
                          <>
                            <button type="button" disabled className="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Editar</button>
                            <button type="button" disabled className="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Excluir</button>
                          </>

                        )}

                      </div>

                    ) : null}


                    <div>
                      <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                        {fixObj.length != 0 ? (
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                Nome
                              </th>
                              <th scope="col" className="px-6 py-3">
                                HASH
                              </th>
                              <th scope="col" className="px-6 py-3">
                                POSIÇÃO
                              </th>
                              <th scope="col" className="px-6 py-3">

                              </th>
                            </tr>
                          </thead>
                        ) : (
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                CONFIGURE SEU SISTEMA DA MELHOR MANEIRA PARA VOCÊ
                              </th>
                            </tr>
                          </thead>
                        )}



                        <tbody>
                          {fixObj.map((item) => {
                            return (
                              <tr className="bg-white border-b py-6 dark:bg-gray-800 dark:border-gray-700 ">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {item.name}
                                </th>
                                <td className="px-6 py-4">
                                  {item.hash}
                                </td>
                                <td className="px-6 py-4">
                                  {item.role}
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

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
