import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';
import Modal from '../popup';
import Swal from 'sweetalert2'
import Select from 'react-select'
export default function Config({ showModal, onClose, companyId }) {
  const adminObj = JSON.parse(localStorage.getItem('manager'))

  const [loading, setLoading] = useState(null)
  const [objects, setObjects] = useState([])
  const [places, setPlaces] = useState([])
  const [users, setUsers] = useState([])
  const [companys, setCompanys] = useState([])
  const [permissions, setPermissions] = useState([
    { label: "OBJETOS", value: "OBJECTS" },
    { label: "AMBIENTES", value: "PLACES" },
    { label: "EMPRESAS", value: "COMPANIES" },
    { label: "EPIS", value: "EPIS" },
  ])

  const [roles, setRoles] = useState([
    { label: "ADMINISTRADOR", value: "ADMIN" },
    { label: "GERENTE", value: "MANAGER" },
  ])
  const [selectRoles, setSelectRoles] = useState([])

  const [selectPermissions, setSelectPermissions] = useState([])
  const [epis, setEpis] = useState([])
  const [admins, setAdmins] = useState([])

  const [selectArgFromCreate, setSelectArgFromCreate] = useState('')
  const [nameOfCreation, setNameOfCreation] = useState('')
  const [emailOfCreation, setEmailOfCreation] = useState('')
  const [fixObj, setFixObj] = useState([])

  const [route, setRoute] = useState('')
  const [check, setCheck] = useState([])

  const [create, setCreate] = useState(false)
  const [usersEdit, setUsersEdit] = useState(false)
  const [comapnyForNewManager, setCompanyForNewManager] = useState([])



  const handleClose = () => {
    onClose();

  };

  const showComponent = () => {
    setFixObj([]);
    setUsersEdit(!usersEdit);
  };


  async function retriveDatas() {
    const user = localStorage.getItem('manager')
    setLoading(true)
    try {
      const [object, place, users, company, epi, managers] = await Promise.all([
        Api.get('objects/recover', { params: { companyId: companyId } }),
        Api.get('place/recover', { params: { companyId: companyId } }),
        Api.get('/user/recover', { params: { companyId: companyId } }),
        Api.get('companies/recover'),
        Api.get('/epis/recover', { params: { companyId: companyId } }),
        Api.get('/manager/recover', { params: { companyId: companyId } }),

      ]);
      setLoading(false)
      setObjects(object.data)
      setPlaces(place.data)
      setUsers(users.data)
      const companies = company.data.map((item) => {
        return { label: item.name, value: item.id }
      })
      setCompanys(companies)
      setAdmins(managers.data)
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
        setLoading(false)
        await retriveDatas()
      } catch (error) {
        setLoading(false)
        await Swal.fire({
          icon: 'error',
          title: error.response.data.message == 'Error - User with a schedule in progress' ? 'Erro - Usuário com agendamento em andamento' : 'Erro - Item selecionado em uso',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: false,
          denyButtonText: 'ok',
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
      obj['name'] = item.name || item.label;
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
    let companiesSelected
    let permissionsSelected
    if (selectArgFromCreate == "manager") {
      companiesSelected = comapnyForNewManager.pop().map((item) => { return item.value })
      permissionsSelected = selectPermissions.pop().map((item) => { return item.value })

    }

    let send = {
      companyId: selectArgFromCreate == "manager" ? companiesSelected : companyId,
      permissions: selectArgFromCreate == "manager" ? permissionsSelected : [''],
      role: selectArgFromCreate == "manager" ? selectRoles.value : [''],
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
      setLoading(false)

      await Swal.fire({
        icon: 'error',
        title: 'Erro ao efetuar criação',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })

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
  }, [route,fixObj,usersEdit])



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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-primary text-center shadow-xl m-4 transition-all sm:my-8 sm:w-full min-w-lg">
                {create ? (
                  <div className='my-20 align-center flex flex-col justify-center'>
                    <label for="countries" class="block mb-2 text-sm font-medium text-primary">Criação de:</label>
                    <select defaultValue onChange={(value) => setSelectArgFromCreate(value.target.value)} id="countries" class="m-3 bg-tertiary border border-gray-300 outline-transparent text-secondary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-2.5 align-center self-center">
                      <option hidden  >Clique e Selecione Uma Opção</option>
                      <option value="objects">Objetos</option>
                      <option value="place">Ambientes</option>
                      <option value="companies">Empresa</option>
                      <option value='epis'>EPI</option>
                      {adminObj.role == 'ADMIN' ? (
                        <option ption value="manager">Administrador</option>
                      ) : null}
                    </select>
                    {selectArgFromCreate == 'manager' && adminObj.role == 'ADMIN' ? (
                      <>
                        <Select
                          isMulti
                          name="Empresas"
                          options={companys}
                          onChange={(item) => setCompanyForNewManager((oldState) => [oldState, item])}
                          className="border rounded-md px-3 py-2 w-2/3 self-center bg-gray-600 text-black"
                          classNamePrefix="Inserir empresas"
                          placeholder="Inserir empresas"
                        />
                        <Select
                          name="Posição"
                          options={roles}
                          onChange={(item) => setSelectRoles(item)}
                          className="border rounded-md px-3 py-2 w-2/3 self-center bg-gray-600 text-black"
                          classNamePrefix="Inserir cargo"
                          placeholder="Inserir cargo"
                        />
                        <Select
                          isMulti
                          name="Permissões"
                          options={permissions}
                          onChange={(item) => setSelectPermissions((oldState) => [oldState, item])}
                          className="border rounded-md px-3 py-2 w-2/3 self-center bg-gray-600 text-black"
                          classNamePrefix="Inserir permissões"
                          placeholder="Inserir permissões"
                        />
                        <input onChange={(value) => setNameOfCreation(value.target.value)} type="text" id="website-admin" class="my-4 rounded-none rounded-e-lg bg-tertiary border border-gray-300 outline-transparent  text-secondary focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5" placeholder="Informe o nome" />
                        <input onChange={(value) => setEmailOfCreation(value.target.value)} type="email" id="website-admin" class="rounded-none rounded-e-lg bg-tertiary border border-gray-300 outline-transparent text-secondary focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5" placeholder="Informe o email" />

                      </>

                    ) : (
                      <input onChange={(value) => setNameOfCreation(value.target.value)} type="text" id="website-admin" class="rounded-none rounded-e-lg bg-tertiary border border-gray-300 outline-transparent text-secondary focus:ring-blue-500 focus:border-blue-500 block  min-w-0 w-2/3 align-center self-center text-sm p-2.5" placeholder="Informe o nome" />

                    )}
                    <div className='m-6'>
                      <button onClick={handleCreation} type="button" class="text-quaternary hover:text-white border border-primary hover:bg-quaternary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Criar</button>
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

                  <nav className="bg-primary fixed w-full z-20 top-0 left-0 border-b border-gray-200">
                    <div className="max-w-screen-xl flex flex-wrap items-center bg-primary text-primary justify-between mx-auto p-4">
                      <div className="flex md:order-2">
                        <div>
                          <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200  " aria-controls="navbar-sticky" aria-expanded="false">
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                          </svg>
                        </button>
                      </div>
                      {!usersEdit ? (

                        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-primary md:flex-row md:space-x-8 md:mt-0 md:border-0">
                            <li >
                              <a href="#" className="block py-2 pl-3 pr-4 text-primary bg-violet-500 rounded md:bg-transparent md:text-quinary md:p-0" aria-current="page">CONFIGURAÇÕES</a>
                            </li>
                            <li onClick={() => handleSelect(users, 'user')}>
                              <a href="#" class="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0" aria-current="page">Usuários</a>
                            </li>
                            <li onClick={() => handleSelect(objects, 'objects')}>
                              <a href="#" class="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0">Objetos</a>
                            </li>
                            <li onClick={() => handleSelect(places, 'place')}>
                              <a href="#" class="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0">Ambientes</a>
                            </li>
                            <li onClick={() => handleSelect(companys, 'companies')}>
                              <a href="#" class="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0">Empresas</a>
                            </li>
                            <li onClick={() => handleSelect(epis, 'epis')}>
                              <a class="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0">EPIs</a>
                            </li>
                            <li >
                              <a href="#" className="block py-2 pl-3 pr-4 text-primary rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-quinary md:p-0">Administradores</a>
                            </li>
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </nav>
                  {usersEdit && <Modal id={check} route={route} companyId={companyId} closeModal={() => {
                    setUsersEdit(false)
                  }} />}
                  <div className='flex flex-row my-8 justify-between w-full '>
                    {fixObj.length != 0 ? (
                      <div className='flex flex-col'>

                        <button type="button" onClick={() => { setCreate(!create); setFixObj([]) }} class="text-quaternary hover:text-white border border-primary hover:bg-quaternary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Criar</button>
                        {check.length != 0 ? (
                          <>
                            {check.length == 1 ? (
                              <button type="button" onClick={showComponent} class="text-quaternary hover:text-white border border-primary hover:bg-quaternary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Editar</button>
                            ) : null}
                            <button type="button" onClick={deletion} class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Excluir</button>
                          </>
                        ) : (
                          <>
                            <button type="button" disabled className="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Editar</button>
                            <button type="button" disabled className="border   focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2  ">Excluir</button>
                          </>

                        )}
                      </div>
                    ) : null}
                    <div >
                      <table className="text-sm text-left text-secondary min-w-4/3">
                        {fixObj.length != 0 ? (
                          <thead className="text-xs text-secondary uppercase bg-tertiary">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                Nome
                              </th>
                              <th scope="col" className="px-6 py-3">
                                Selecione
                              </th>
                            </tr>
                          </thead>
                        ) : usersEdit ? null : (
                          <thead className="text-xs text-secondary uppercase bg-tertiary">
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
                              <tr className="bg-tertiary border-b py-6 ">
                                <th scope="row" className="px-6 py-4 font-medium text-secondary whitespace-nowrap">
                                  {item.name}
                                </th>
                                <td className='flex  items-center justify-center mt-4'>
                                  {
                                    check.includes(item.id) ? (
                                      <div
                                        role="checkbox"
                                        aria-checked="true"
                                        onClick={() => handleSelectForEditOrDeletion(item.id)}
                                        className='text-red-500 font-lg cursor-pointer'
                                      >
                                        &#x2713;
                                      </div>
                                    ) : (
                                      <div
                                        role="checkbox"
                                        aria-checked="false"
                                        onClick={() => handleSelectForEditOrDeletion(item.id)}
                                        className="w-4 h-4 cursor-pointer bg-primary border-gray-300  focus:ring-blue-500 focus:ring-2"
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
