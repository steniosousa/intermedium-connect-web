import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';
import React from 'react';
export default function LitleModal({ showModal, onClose, action, companyId, text }) {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [showAlert, setShowAlert] = useState(false)
  const [sucess, setSucess] = useState(null)

  const cancelButtonRef = useRef(null);

  const handleEnvironmentChange = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(true)
    if (selectedEnvironment === '') {
      setShowAlert(false)
      setMessengerAlert('Informe o nome do novo objeto')
    }
    const send = {
      companyId: companyId,
      name: selectedEnvironment
    }
    try {
      await Api.post(action, send)
      setSucess('sucess')
      setShowAlert(false)
    }
    catch (error) {
      setSucess('error')
      setShowAlert(false)
    }

  };

  function openAlert() {

    onClose()
  }


  return (
    <Transition.Root show={showModal} as={Fragment}>

      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {showAlert && <Alert onCloseAlert={onClose} showAlert={showAlert} />}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-full max-w-sm">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="environment" className="block text-gray-700 font-semibold mb-1">
                            {text}:
                          </label>
                          <input
                            type="text"
                            id="environment"
                            value={selectedEnvironment}
                            onChange={handleEnvironmentChange}
                            className="border rounded-md px-3 py-2 w-full"
                            placeholder={text}
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold"
                        >
                          Enviar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={openAlert} // Use a função de fechamento aqui
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
