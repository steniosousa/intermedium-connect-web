import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import Api from '../../api/service';
import Alert from '../alert';
import Select from 'react-select'
import Calendario from '../calendar/calendario';

export default function Solicitation({ showModal, onClose, datas }) {
  const [objectsOptions, setObjectsOptions] = useState([])
  const [placesOptions, setPlacesOptions] = useState([])
  const [selectForSend, setSelectForSend] = useState([])
  const [placesForSend, setPlacesForSend] = useState('')
  const [horsSelected, setHorsSelected] = useState([])



  const [repeat, setRepeat] = useState(false)
  const [sucess, setSucess] = useState(null)


  const [automated, setAutomated] = useState(false)

  const [showAlert, setShowAlert] = useState(false)



  const cancelButtonRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  async function findObjects() {
    try {
      const [object, place] = await Promise.all([
        Api.get('objects/recover', {
          params: {
            companyId: datas.companyId
          }
        }),
        Api.get('place/recover', {
          params: {
            companyId: datas.companyId
          }
        })
      ]);

      const objectForSelect = object.data.map((item) => {
        return { label: item.name, value: item.id }
      })
      setObjectsOptions(objectForSelect);

      setPlacesOptions(place.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    setShowAlert(true)
    let route;

    if (placesForSend === '') {
      setShowAlert(false)
      setSucess('error')
      return
    }



    const objectsId = selectForSend.map((item) => {
      return item[0].value
    })

    const horsSelectedForSend = horsSelected.map((item) => {
      return item.start
    })

    const send = {
      placeId: placesForSend,
      objectsId,
      userId: datas.id,
      repeatable: repeat,
      eventDate: horsSelectedForSend || new Date(),
    }

    if (automated) {
      route = 'schedule/create'
    } else {
      route = 'cleaning/create'
    }
    console.log(send)
    try {
      await Api.post(route, send)
      setSucess('sucess')
      setShowAlert(false)
    }
    catch (error) {
      setSucess('error')
      setShowAlert(false)
    }

  };

  function catchHors(horsArray) {
    console.log(horsArray)
    setHorsSelected(horsArray)
  }
  function openAlert() {
    handleClose()
    setShowAlert(!showAlert)
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

          {sucess == 'sucess' ? (
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
              <p className="font-bold">Sucesso!</p>
              <p className="text-sm">Sua solicitação foi criada com sucesso.</p>
            </div>

          ) : sucess == 'error' ? (
            <div role="alert">
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Erro!
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>Algo de errado aconteceu na sua solicitação</p>
              </div>
            </div>

          ) : null}
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
                    <span className="font-semibold mr-2 text-left flex-auto">Faça ou marque suas solicitações futuras</span>
                    <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                  </div>
                </div>
                <div className="bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center">

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

                        <Dialog.Title as="h3" className="text-base leading-6 text-gray-900 flex flex-row items-center justify-around m-4 ">

                        </Dialog.Title>
                        {automated ? (
                          <>
                            <Calendario catchHors={catchHors} />
                            <div className="flex flex-col  items-center m-4 dark:border-gray-700">
                              <input onChange={() =>setRepeat(!repeat)} id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" className=" text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                              <label for="bordered-checkbox-1" className=" text-xl font-medium text-white ">REPETIR</label>
                            </div>
                          </>




                        ) : null}
                        < div className='flex flex-row  justify-around w-full '>
                          <button
                            type='button'
                            onClick={() => setAutomated(!automated)}
                            className="bg-gray-600 hover:bg-black text-white py-2 px-4 rounded-md font-semibold"
                          >
                            Agendar
                          </button>
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
