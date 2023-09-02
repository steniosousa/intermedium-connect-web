import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';

export default function Admin({ showModal, onClose }) {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('')
  const [allCompanys, setAllCompanys] = useState([])
  const [showAlert, setShowAlert] = useState(false)

  const [sucess, setSucess] = useState(null)


  const cancelButtonRef = useRef(null);



  async function getDatas() {
    try {
      const { data } = await Api.get('company/all')
      setAllCompanys(data)
    }
    catch (error) {
      setSucess('error')
    }
  }

  useEffect(() => {
    getDatas()
  }, [])


  const handleEnvironmentChange = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  const handleCompanyChancge = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(true)
    if (selectedEnvironment === '' || selectedCompany == '') {
      setShowAlert(false)
      setSucess('error')
    }
    const send = {
      companyId: selectedCompany,
      name: selectedEnvironment,
      password: "Intermedium"
    }
    try {
      await Api.post('manager', send)
      setShowAlert(false)
      setSucess('sucess')
    }
    catch (error) {
      setShowAlert(false)
      setSucess('error')
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-full max-w-sm">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center justify-center">

                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">




                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label htmlFor="environment" className="block text-gray-700 font-semibold mb-1">
                            Email do administrador:
                          </label>
                          <input
                            type="email"
                            id="environment"
                            value={selectedEnvironment}
                            onChange={handleEnvironmentChange}
                            className="border rounded-md px-3 py-2 w-full"
                            placeholder="Informe o email do objeto"
                            required
                          />
                        </div>
                        <select className="border rounded-md px-3 py-2 w-full" onChange={handleCompanyChancge}>
                          <option value="">
                            Selecione uma opção
                          </option>
                          {allCompanys && allCompanys.map((item) => {
                            return (
                              <option key={item.id} value={item.id}>{item.name}</option>
                            )
                          })}
                        </select>
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
                    onClick={openAlert} 
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
