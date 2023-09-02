import { Fragment, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import { format } from "date-fns";

export default function Informations({ showModal, onClose, datas }) {

  const handleClose = () => {
    onClose();
  };






  async function handleExclusion() {
    try {
      await Api.post('cleaning/delete', { id: datas.id })
      onClose();
    } catch (error) {
      window.alert('erro')
    }
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
                <div>
                  <button type="button" onClick={handleClose} class="absolute right-4 top-4 text-red-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8">
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="container mx-auto px-5 py-2 lg:px-32 lg:pt-24">
                  <div class="-m-1 flex flex-wrap md:-m-2">
                    <div class="flex w-2/1 flex-row">
                      <div class="w-1/2 p-1 md:p-2">
                        <img
                          alt="gallery"
                          class="block h-full w-full rounded-lg object-cover object-center"
                          src={datas.entrance} />
                      </div>
                      <div class="w-1/2 p-1 md:p-2">
                        <img
                          alt="gallery"
                          class="block h-full w-full rounded-lg object-cover object-center"
                          src={datas.exit} />
                      </div>
                      <div class="w-1/2 p-1 md:p-2">
                        <img
                          alt="gallery"
                          class="block h-full w-full rounded-lg object-cover object-center"
                          src={datas.obs1} />
                      </div>
                      <div class="w-1/2 p-1 md:p-2">
                        <img
                          alt="gallery"
                          class="block h-full w-full rounded-lg object-cover object-center"
                          src={datas.obs2} />
                      </div>
                      <div class="w-1/2 p-1 md:p-2">
                        <img
                          alt="gallery"
                          class="block h-full w-full rounded-lg object-cover object-center"
                          src={datas.obs3} />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mx-auto grid max-w-2xl self-center grid-cols-1 items-center  lg:max-w-max m-10">
                  <div>
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Informações</h2>
                    <p class="mt-4 text-gray-500">As informações servem para te ajudar a entender melhor a solicitação.</p>

                    <dl class="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                      <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Criado em:</dt>
                        <dd class="mt-2 text-sm text-gray-500">{ format(new Date(datas.createAt), 'dd/MM/yyyy HH:mm')}</dd>
                      </div>
                      <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Ultima atualização</dt>
                        <dd class="mt-2 text-sm text-gray-500">{ format(new Date(datas.updateAt), 'dd/MM/yyyy HH:mm')}</dd>
                      </div>
                      <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Status</dt>
                        <dd class="mt-2 text-sm text-gray-500">{datas.status}</dd>
                      </div>
                      <div class="border-t border-gray-200 pt-4">
                        <dt class="font-medium text-gray-900">Ambiente</dt>
                        <dd class="mt-2 text-sm text-gray-500">{datas.where}</dd>
                      </div>
                    </dl>
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
