import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React from 'react';
import Api from '../../api/service';
import Alert from '../alert';

export default function Solicitation({ showModal, onClose, datas }) {
  const [objectsOptions, setObjectsOptions] = useState([])
  const [placesOptions, setPlacesOptions] = useState([])
  const [selectForSend, setSelectForSend] = useState([])
  const [placesForSend, setPlacesForSend] = useState('')
  const [daysOfWeek, setDaysOfWeek] = useState([
    { dia: "Segunda-feira", value: 1 },
    { dia: "Terça-feira", vale: 2 },
    { dia: "Quarta-feira", value: 3 },
    { dia: "Quinta-feira", value: 4 },
    { dia: "Sexta-feira", value: 5 },
    { dia: "Sabado", value: 6 },
    { dia: "Domingo", value: 7 },
  ])
  const [horsOfDay, setHorsOfDay] = useState([
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
  ])

  const [repeat, setRepeat] = useState(false)
  const [sucess, setSucess] = useState(null)

  const [daySelected, setDaySelected] = useState('')
  const [horsSelected, setHorsSelected] = useState('')

  const [automated, setAutomated] = useState(false)

  const [showAlert, setShowAlert] = useState(false)



  const cancelButtonRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  async function findObjects() {
    try {
      const [object, place] = await Promise.all([
        Api.get('object', { data: { companyId: datas.id } }),
        Api.get('place', { data: { companyId: datas.id } })
      ]);

      setObjectsOptions(object.data);
      setPlacesOptions(place.data);
    }
    catch (error) {
      console.log(error);
    }






  }
  useEffect(() => {
    findObjects()
  }, [])


  const handleObjectChange = (event) => {
    if (event.target.value == '') return
    const exist = selectForSend.find((item) => item.id == event.target.value)
    if (exist) return
    const idSelect = objectsOptions.find((item) => item.id == event.target.value)
    setSelectForSend([...selectForSend, idSelect])
  };
  const handlePlacesChange = (event) => {
    if (event.target.value == '') return
    const idSelect = placesOptions.find((item) => item.id == event.target.value)
    setPlacesForSend(idSelect.name)
  }


  function handleExclusion(item) {
    const exclusion = selectForSend.filter((object) => object.id != item.id)
    setSelectForSend(exclusion)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setShowAlert(true)

    if (placesForSend === '' || selectForSend.length == 0) {
      setShowAlert(false)
      setSucess('error')
      return
    }
    const objects = []

    for (const object of selectForSend) {
      objects.push(object.id)
    }
    const send = {
      userId: datas.id,
      where: placesForSend,
      objects,
      horsSelected
    }
    const sendOfAutomated = {
      userId: datas.id,
      where: placesForSend,
      objects,
      daySelected,
      horsSelected,
      repeat
    }
    if (automated) {
      if (placesForSend === '' || selectForSend.length == 0 || horsSelected === '') {
        setShowAlert(false)
        setSucess('error')
        return
      }
      try {
        await Api.post('cleaning', sendOfAutomated)
        setSucess('sucess')
        setShowAlert(false)

      } catch (error) {
        setShowAlert(false)
        setSucess('error')
      }
      return
    }
    try {
      await Api.post('cleaning', send)
      setSucess('sucess')
      setShowAlert(false)
    }
    catch (error) {
      setSucess('error')
      setShowAlert(false)
    }

  };

  function openAlert() {
    handleClose()
    setShowAlert(!showAlert)
  }

  function handleSelectDay(event) {
    setDaySelected(event.target.value)
  }

  function handleSelectHors(event) {
    setHorsSelected(event.target.value)
  }

  function handleRepeat(event) {
    setRepeat(!repeat)
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto ">

          {sucess == 'sucess' ? (
            <div class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
              <p class="font-bold">Sucesso!</p>
              <p class="text-sm">Sua solicitação foi criada com sucesso.</p>
            </div>

          ) : sucess == 'error' ? (
            <div role="alert">
              <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Erro!
              </div>
              <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
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
                <div class="bg-indigo-900 text-center py-4 lg:px-4">
                  <div class="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                    <span class="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
                    <span class="font-semibold mr-2 text-left flex-auto">Faça ou marque suas solicitações futuras</span>
                    <svg class="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                  </div>
                </div>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center">

                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base leading-6 text-gray-900">
                      </Dialog.Title>

                      <form>
                        <div className="mb-4">
                          <label htmlFor="object" className="block text-gray-700 font-semibold mb-1">
                            Ambiente:
                          </label>
                          <select className="border rounded-md px-3 py-2 w-full" onChange={handlePlacesChange}>
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
                          <label htmlFor="object" className="block text-gray-700 font-semibold mb-1">
                            Objeto:
                          </label>
                          <select className="border rounded-md px-3 py-2 w-full" onChange={handleObjectChange}>
                            <option value="" >
                              Selecione um objeto
                            </option>
                            {objectsOptions.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>{item.name}</option>

                              )
                            })}
                          </select>
                        </div>

                        <Dialog.Title as="h3" className="text-base leading-6 text-gray-900 flex flex-row items-center justify-around m-4 ">
                          {selectForSend.map((item) => {
                            return (
                              <button type='button' className="bg-red-600 text-white font-semibold px-4 py-2 rounded-full cursor-pointer" key={item.id} onClick={() => handleExclusion(item)}>
                                {item.name}
                              </button>
                            )
                          })}
                        </Dialog.Title>
                        {automated ? (
                          <div className='flex flex-row items-center'>
                            <div className="mb-4">
                              <label htmlFor="object" className="block text-gray-700 font-semibold mb-1">
                                Dia da semana:
                              </label>
                              <select className="border rounded-md px-3 py-2 w-40" onChange={handleSelectDay}>
                                <option value="" >
                                  Dia
                                </option>
                                {daysOfWeek.map((item) => {
                                  return (
                                    <option value={item.dia}>{item.dia}</option>

                                  )
                                })}
                              </select>
                            </div>
                            <div className="mb-4">
                              <label htmlFor="object" className="block text-gray-700 font-semibold mb-1">
                                Horário:
                              </label>
                              <select className="border rounded-md px-3 py-2 w-40" onChange={handleSelectHors}>
                                <option value="">
                                  Horário
                                </option>
                                {horsOfDay.map((item) => {
                                  return (
                                    <option value={item}>{item}</option>

                                  )
                                })}
                              </select>

                            </div>
                            <div class="flex flex-col  items-center m-4 dark:border-gray-700">
                              <input onChange={handleRepeat} id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" class=" text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                              <label for="bordered-checkbox-1" class=" text-sm font-medium text-gray-600 dark:text-gray-600">Repeat</label>
                            </div>
                          </div>


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
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
