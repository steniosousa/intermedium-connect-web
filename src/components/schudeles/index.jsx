import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';
import Swal from 'sweetalert2'


export default function Schudeles({ showModal, onClose, datas }) {

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
      const { data } = await Api.get('/schedule/recover', { params: { userId: datas.id } })
      setSchudele(data)
    }
    catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar histórico',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }

  }




  async function handleDeleteSchudele(schudeleId) {
    try {
      await Api.delete('/schedule/delete', {
        params: {
          scheduleId: schudeleId.id
        }
      })
      retriveDatas()
    } catch (error) {
    }

  }

  async function handleDisableOrEnableSchudele(schudeleId) {
    try {
      await Api.post('/schedule/edit', {
        scheduleId: schudeleId.id
      })
      retriveDatas()
    } catch (error) {
    }
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
          <div className="flex min-h-full min-w-lg items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="bg-gray-600 text-white relative transform overflow-hidden rounded-lg  text-center shadow-xl m-4 transition-all sm:my-8 w-2/3">
                <div className=''>
                  <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gray-600 text-white mx-auto grid max-w-2xl self-center grid-cols-1 items-center  lg:max-w-max m-10 " >
                  <div className='m-8'>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Agendamentos</h2>
                    <p className="mt-4 text-white">As informações servem para te ajudar a entender melhor os agendamentos.</p>
                    {schudele.map((item) => {
                      return (
                        <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-5 sm:gap-y-16 lg:gap-x-8" key={item.id}>
                          <div>{item.deactivatedAt == null ? (
                            <div className='h-8 w-4 bg-green-600'></div>
                          ) : (
                            <div className='h-8 w-4 bg-red-600 items-center flex'></div>
                          )}</div>
                          <div className="border-t border-gray-200 pt-4 ">
                            <dt className="font-medium text-gray-900">AGENDADO PARA:</dt>
                            <dd className=" text-white">{diasDaSemana[new Date(item.eventDate).getDay()]} - {new Date(item.eventDate).toLocaleString('pt-br')} </dd>
                          </div>
                          <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">AMBIENTE:</dt>
                            <dd className="mt-2 text-sm text-white">{item.place.name}</dd>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">RECORRENTE:</dt>
                            <dd className="mt-2 text-sm text-white">{item.repeatable ? 'SIM' : "NÃO"}</dd>
                          </div>
                          <div className='flex flex-col justify-center gap-2'>
                            <button className='text-red-600' onClick={() => handleDeleteSchudele(item)}>EXCLUIR</button>
                            <div>{item.deactivatedAt ? (
                              <button onClick={() => handleDisableOrEnableSchudele(item)}>ATIVAR</button>
                            ) : (
                              <button onClick={() => handleDisableOrEnableSchudele(item)}>DESATIVAR</button>
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
