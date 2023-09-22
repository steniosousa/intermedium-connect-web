import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Alert from '../alert';


export default function Config({ showModal, onClose, companyId }) {

  const [loading, setLoading] = useState(null)
  const [sucess, setSucess] = useState(null)
  const [message, setMessage] = useState('')
  const [objects, setObjects] = useState([])
  const [places, setPlaces] = useState([])

  const handleClose = () => {
    onClose();

  };


  async function retriveDatas() {
    setLoading(true)
    try {
      const [object, place] = await Promise.all([
        Api.get('object', { data: { companyId: companyId.companys.id } }),
        Api.get('place', { data: { companyId: companyId.companys.id } })
      ]);
      setLoading(false)
      setObjects(object.data)
      setPlaces(place.data)
    }
    catch (error) {
      setLoading(false)

      setSucess('error')
      console.log(error);
    }
    console.log(objects, places)

  }




  async function deletionPlace(placeId) {
    setLoading(true)
    try {
      await Api.delete('/place', {
        params:{
          placeId:placeId.id
        }
      })
      setMessage('Ambiente deletado com sucesso')
      setSucess('sucess')
      retriveDatas()
    } catch (error) {
      setLoading(false)
      setMessage('Ambiente sendo usado em alguma solicitação')
      setSucess('error')
    }
  }

  async function DeleteObject(objectId){
    setLoading(true)
    try {
      await Api.delete('/object', {
        params:{
          objectId:objectId.id
        }
      })
      setMessage('Objeto deletado com sucesso')
      setSucess('sucess')
      retriveDatas()
    } catch (error) {
      setLoading(false)
      setMessage('Objeto sendo usado em alguma solicitação')
      setSucess('error')
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
                  <div role="alert">
                  <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                    Sucesso!
                  </div>
                  <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                    <p>{message}</p>
                  </div>
                </div>

                ) : sucess == 'error' ? (
                  <div role="alert">
                    <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                      Erro!
                    </div>
                    <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                      <p>{message}</p>
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
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Configuração</h2>
                    <p className="mt-4 text-gray-500">As configurações servem para te organizar no sistema.</p>

                    <div className='flex flex-row justify-center align-center '>
                      <div className='flex flex-col items-center align-center justify-center'>
                        <h1 className='m-4 font-bold'>OBJETOS:</h1>
                        <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          {objects.map((item) => {
                            return (
                              <div className='flex flex-row'>
                                <a href="#" class="block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                  {item.name}
                                </a>
                                <h1 onClick={() => DeleteObject(item)} className='bg-red-600 px-4 py-2  rounded-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 '>X</h1>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h1 className='m-4 font-bold'>AMBIENTES:</h1>
                        <div class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          {places.map((item) => {
                            return (
                              <div className='flex flex-row'>
                                <a href="#" class="block w-full px-4 py-2 border-b border-gray-200  focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
                                  {item.name}
                                </a>
                                <h1 onClick={() => deletionPlace(item)}className='bg-red-600 px-4 py-2  rounded-lg cursor-pointer hover:bg-gray-100 hover:text-blue-700 '>X</h1>
                              </div>
                            )
                          })}
                        </div>

                      </div>
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
