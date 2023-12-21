import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import { format } from "date-fns";
import Swal from 'sweetalert2'

import suposicao from './download.jpeg'
import Avaliation from './avaliation';

export default function Informations({ showModal, onClose, datas, idCompany }) {
  const [avaliation, setAvaliation] = useState(false)
  const handleClose = () => {
    onClose();
  };

  async function handleExclusion() {
    try {
      await Api.post('cleaning/delete', { id: datas.id })
      const confirm = await Swal.fire({
        icon: 'info',
        title: 'Deseja deletar evidencia?',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      if (!confirm.isConfirmed) return
      await Swal.fire({
        icon: 'success',
        title: 'Limpeza deletada com sucesso',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Não é possível deletar limpezas já assumida',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  // async function reopen() {
  //   await Swal.fire({
  //     icon: 'info',
  //     title: 'Ao rebrir marcará para o horário atual a nova solicitação',
  //     showDenyButton: true,
  //     showCancelButton: false,
  //     showConfirmButton: true,
  //     denyButtonText: 'Cancelar',
  //     confirmButtonText: 'Reabrir'
  //   })
  // }

  function openAvaliation() {
    setAvaliation(!avaliation)
  }


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
          <div className="flex min-h-full min-w-lg bg-gray-600 items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg  text-center shadow-xl m-4 transition-all sm:my-8 sm:w-full min-w-lg">
                <div>
                  <button type="button" onClick={handleClose} className="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-24 ">
                  <div className="-m-1 flex flex-wrap md:-m-2">
                    <div className="flex w-2/1 flex-row">
                      {datas.evidences.map((item) => {
                        return (
                          <div className="w-1/2 p-1 md:p-2" key={Math.random()}>
                            <img
                              alt="gallery"
                              className="block h-full w-full rounded-lg object-cover object-center"
                              src={item.evidenceUrl} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mx-auto grid max-w-2xl self-center grid-cols-1 items-center  lg:max-w-max m-10">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Informações</h2>
                    <p className="mt-4 text-white">As informações servem para te ajudar a entender melhor a solicitação.</p>

                    <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Criado em:</dt>
                        <dd className="mt-2 text-sm text-white">{format(new Date(datas.createdAt), 'dd/MM/yyyy HH:mm')}</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Ultima atualização</dt>
                        <dd className="mt-2 text-sm text-white">{format(new Date(datas.updatedAt), 'dd/MM/yyyy HH:mm')}</dd>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="font-medium text-gray-900">Objetos</p>
                        {datas.ObjectOfCleaning.map((item) => {
                          return (
                            <p key={Math.random()} className="mt-2 text-sm text-white">{item.object.name}</p>
                          )
                        })}
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <dt className="font-medium text-gray-900">Ambiente</dt>
                        <dd className="mt-2 text-sm text-white">{datas.Place.name} </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <button onClick={() => handleExclusion()} className="h-8 px-3 rounded-md shadow text-white bg-red-500 m-4">Excluir</button>
                {/* <button className="h-8 px-3 rounded-md shadow text-white bg-orange-500 m-4" onClick={reopen}>Limpar Novamente</button> */}
                {!datas.avaliationId && datas.status == "CONCLUIDO" ? (
                  <button className="h-8 px-3 rounded-md shadow text-white bg-orange-500 m-4" onClick={openAvaliation}>Avaliação</button>
                ) : null}
                {avaliation && <Avaliation showModal={avaliation} onClose={openAvaliation} companyId={datas} idCompany={idCompany} />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
