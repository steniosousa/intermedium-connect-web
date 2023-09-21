import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import { format } from "date-fns";
import Alert from '../alert';

import suposicao from './download.jpeg'

export default function Schudeles({ showModal, onClose, datas }) {

  const [loading, setLoading] = useState(null)
  const [sucess, setSucess] = useState(null)
  const [schudele, setSchudele] = useState([])
  const handleClose = () => {
    onClose();
  };

  const diasDaSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];

  async function retriveDatas() {
    try {
      const { data } = await Api.get('/schedule/', { params: { userId: datas.id } })
      setSchudele(data)
      console.log(data)
    }
    catch (error) {
      setSucess('error')
    }

  }

 


  async function handleDeleteSchudele(schudeleId) {
    try{
      await Api.post('/schedule/delete',{
       schudeleId
     })
     retriveDatas()
   }catch(error){
     console.log(error)
   }

  }

  async function handleDisableOrEnableSchudele(schudeleId){
    try{
       await Api.post('/schedule/edit',{
        schudeleId
      })
      retriveDatas()
    }catch(error){
      console.log(error)
    }
  }
  function openAlert() {
    loading(!showAlert)
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-center shadow-xl m-4 transition-all sm:my-8 sm:w-full min-w-lg">
                {sucess == 'sucess' ? (
                  <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                    <p className="font-bold">Sucesso!</p>
                    <p className="text-sm">Sua solicitação foi excluída com sucesso.</p>
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
                <div>
                  <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mx-auto grid max-w-2xl self-center grid-cols-1 items-center  lg:max-w-max m-10" >
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Agendamentos</h2>
                    <p className="mt-4 text-gray-500">As informações servem para te ajudar a entender melhor os agendamentos.</p>
                    {schudele.map((item) => {
                      return (
                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-5 sm:gap-y-16 lg:gap-x-8" key={item.id}>
                          <div>{item.deactivatedAt ? (
                            <div className='h-8 w-4 bg-green-600 items-center flex'></div>
                          ) : (
                            <div className='h-8 w-4 bg-red-600'></div>
                          )}</div>
                          <div className="border-t border-gray-200 pt-4 ">
                            <dt className="font-medium text-gray-900">AGENDADO PARA:</dt>
                            <dd className=" text-gray-500">{diasDaSemana[new Date(item.eventDate).getDay()]} - {new Date(item.eventDate).toLocaleString('pt-br')} </dd>
                          </div>
                          <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">AMBIENTE:</dt>
                            <dd className="mt-2 text-sm text-gray-500">{item.place.name}</dd>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">RECORRENTE:</dt>
                            <dd className="mt-2 text-sm text-gray-500">{item.repeatable ? 'SIM' : "NÃO"}</dd>
                          </div>
                          <div className='flex flex-col justify-center gap-2'>
                            <button className='text-red-600' onClick={() => handleDeleteSchudele(item.id)}>EXCLUIR</button>
                            <div>{item.deactivatedAt ? (
                            <button onClick={() => handleDisableOrEnableSchudele(item.id)}>DESATIVAR</button>
                          ) : (
                            <button onClick={() =>handleDisableOrEnableSchudele(item.id)}>ATIVAR</button>
                          )}</div>
                          </div>
                        </dl>
                      )
                    })}
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
