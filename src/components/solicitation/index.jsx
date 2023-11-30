import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import Api from '../../api/service';
import Alert from '../alert';
import Select from 'react-select'
import Calendario from '../calendar/calendario';
import Swal from 'sweetalert2'
import Schudeles from '../schudeles';

export default function Solicitation({ showModal, onClose, datas }) {
  const [objectsOptions, setObjectsOptions] = useState([])
  const [placesOptions, setPlacesOptions] = useState([])
  const [selectForSend, setSelectForSend] = useState([])
  const [placesForSend, setPlacesForSend] = useState('')
  const [horsSelected, setHorsSelected] = useState([])
  const [repeat, setRepeat] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const cancelButtonRef = useRef(null);

  const [showSchudele, setShowSchudele] = useState(false)



  const handleClose = () => {
    onClose();
  };

  async function findObjects() {
    try {
      const [object, place] = await Promise.all([
        Api.get('objects/recover', {
          params: {
            companyId: datas.userForCompany[0].companyId
          }
        }),
        Api.get('place/recover', {
          params: {
            companyId: datas.userForCompany[0].companyId
          }
        })
      ]);

      const objectForSelect = object.data.map((item) => {
        return { label: item.name, value: item.id }
      })
      setObjectsOptions(objectForSelect);

      setPlacesOptions(place.data);
    } catch (error) {
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
  useEffect(() => {
    findObjects()
  }, [])



  const handlePlacesChange = (event) => {
    if (event.target.value == '') return
    const idSelect = placesOptions.find((item) => item.id == event.target.value)
    setPlacesForSend(idSelect.id)
  }


  const handleSubmit = async (event) => {
    event.preventDefault()
    const confirm = await Swal.fire({
      icon: 'info',
      title: 'Deseja criar uma solicitação para esse usuário?',
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar'
    })
    if (!confirm.isConfirmed) return

    if (placesForSend === '' && selectForSend.length == 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Verifique o ambiente e os objetos selecionados',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }



    const objectsId = selectForSend.map((item, indice) => {
      return item[indice].value
    })

    const horsSelectedForSend = horsSelected.map((item) => {
      return item.start
    })

    const filterScheduleToday = horsSelectedForSend.filter((item) => item.getDate() == new Date().getDate())
    const filterScheduleFuture = horsSelectedForSend.filter((item) => item.getDate() != new Date().getDate())

    if (filterScheduleToday.length != 0) {
      const send = {
        placeId: placesForSend,
        objectsId,
        userId: datas.id,
        repeatable: repeat,
        eventDate: filterScheduleToday,
      }
      try {
        await Api.post('cleaning/create', send)
        await Swal.fire({
          icon: 'success',
          title: 'Solicitação criada com sucesso!',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })
        setPlacesForSend('')
        setRepeat(false)
        setHorsSelected([])
        setSelectForSend([])
        setObjectsOptions([])
      }
      catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Não foi possível criar a solicitação',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })

      }
    }
    if (filterScheduleFuture.length != 0) {
      const send = {
        placeId: placesForSend,
        objectsId,
        userId: datas.id,
        repeatable: repeat,
        eventDate: filterScheduleFuture,
      }
      try {
        await Api.post('schedule/create', send)
        await Swal.fire({
          icon: 'success',
          title: 'Solicitação criada com sucesso!',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })
        setPlacesForSend('')
        setRepeat(false)
        setHorsSelected([])
        setSelectForSend([])
        setObjectsOptions([])
      }
      catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Não foi possível criar a solicitação',
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })

      }
    }

  };

  function catchHors(horsArray) {
    setHorsSelected(horsArray)
  }
  function openAlert() {
    handleClose()
    setShowAlert(!showAlert)
  }

  function showSchudeles() {
    setShowSchudele(!showSchudele)
  }



  return (
    <Transition.Root show={showModal} as={Fragment}>

      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {showAlert && <Alert onCloseAlert={openAlert} showAlert={showAlert} />}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">


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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-max min-w-max ">
                <div className="bg-indigo-900 text-center py-4 lg:px-4">
                  <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                    <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
                    <span className="font-semibold mr-2 text-left flex-auto">Marcar solicitação</span>
                    <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                  </div>
                </div>
                <div className="bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center">
                    <div>
                      <button type="button" class="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-grey-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Solicitação
                      </button>
                      <button onClick={showSchudeles} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Lista de agendamentos
                        <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                      </button>
                    </div>
                    {showSchudele && <Schudeles onClose={showSchudeles} datas={datas} showModal={showSchudele} />}
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base leading-6 text-gray-900">
                      </Dialog.Title>
                      <form>
                        <div className="mb-4">
                          <label htmlFor="object" className="block text-gray-700 font-semibold mb-1 text-white">
                            Ambiente:
                          </label>
                          <select className="border rounded-md px-3 py-2 w-full bg-gray-600 text-white" onChange={handlePlacesChange}>
                            <option value="">
                              Selecione um ambiente
                            </option>
                            {placesOptions.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="object" className="block text-gray-700 font-semibold mb-1 text-white">
                            Objeto:
                          </label>
                          <Select
                            isMulti
                            name="Objetos"
                            options={objectsOptions}
                            onChange={(item) => setSelectForSend((oldState) => [...oldState, item])}
                            className="border rounded-md px-3 py-2 w-full bg-gray-600 text-black"
                            classNamePrefix="select"
                          />
                        </div>
                        <div class="flex">
                          <div class="flex items-center h-5">
                            <input onChange={() => setRepeat(!repeat)} id="helper-radio" aria-describedby="helper-radio-text" type="checkbox" value="" class="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          </div>
                          <div class="ms-2 text-sm">
                            <label for="helper-radio" class="font-medium text-gray-900 dark:text-gray-300">Ativar repetição de solicitação</label>
                            <p id="helper-radio-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">Com campo selecionado a solicitação será marcada toda semana no horário agendado</p>
                          </div>
                        </div>
                        <Dialog.Title as="h3" className="text-base leading-6 text-gray-900 flex flex-row items-center justify-around m-4 ">
                        </Dialog.Title>
                        <Calendario catchHors={catchHors} />
                        < div className='flex flex-row  justify-around w-full '>
                          <button
                            onClick={() => handleSubmit(event)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold"
                          >
                            Enviar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Fechar
                  </button>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
