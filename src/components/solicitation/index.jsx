import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Api from '../../api/service';
import Alert from '../alert';

export default function Solicitation({ showModal, onClose,datas }) {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [ objectsOptions, setObjectsOptions] = useState([])
  const [selectForSend, setSelectForSend] = useState([])

    const[showAlert, setShowAlert] = useState(false)
    const[messengerAlert, setMessengerAlert] = useState('')



  const cancelButtonRef = useRef(null);

  const handleClose = () => {
    onClose(); 
  };

  async function findObjects(){
    try{
        const {data} = await Api.get('object',{data:{companyId:datas.id}})
        setObjectsOptions(data)
    }
    catch(error){
        console.log(error)
    }
  }
  useEffect(() =>{
    findObjects()
  },[])
  const handleEnvironmentChange = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  const handleObjectChange = (event) => {
    const idSelect = objectsOptions.find((item) => item.id == event.target.value)
    setSelectForSend([...selectForSend,idSelect])
  };

 
  function handleExclusion(item){
    const exclusion = selectForSend.filter((object) => object.id != item.id)
    setSelectForSend(exclusion)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const objects = []
    for(const object of selectForSend){
        objects.push(object.id)
    }
    const send = {
        userId:datas.id,
        where:selectedEnvironment,
        objects
    }
    try{
        Api.post('cleaning',send)
        setMessengerAlert('Solicitação cadastrada com sucesso')
        setShowAlert(true)
    }
    catch(error){
        setShowAlert(true)
        setMessengerAlert('Erro ao gravar solicitação, verifique os dados enviados')
    }
   
  };

  function openAlert(){
    handleClose()
    setShowAlert(!showAlert)
  }


  return (
    <Transition.Root show={showModal} as={Fragment}>
        
    <Dialog as="div" className="relative z-10" onClose={onClose}>
        {showAlert && <Alert message={messengerAlert} onCloseAlert={openAlert} showAlert={showAlert}/> }
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-full max-w-auto">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" aria-hidden="false" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title as="h3" className="text-base leading-6 text-gray-900">
                  <span className="font-semibold">Usuário:</span> {datas.name}
                </Dialog.Title>
  


                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="environment" className="block text-gray-700 font-semibold mb-1">
                        Ambiente de Limpeza:
                        </label>
                        <input
                        type="text"
                        id="environment"
                        value={selectedEnvironment}
                        onChange={handleEnvironmentChange}
                        className="border rounded-md px-3 py-2 w-full"
                        placeholder="Informe o ambiente de limpeza"
                        required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="object" className="block text-gray-700 font-semibold mb-1">
                        Objeto:
                        </label>
                        <select className="border rounded-md px-3 py-2 w-full" onChange={handleObjectChange}>
                        <option value="" disabled>
                            Selecione uma opção
                        </option>
                        {objectsOptions.map((item) =>{
                            return(
                                <option key={item.id} value={item.id}>{item.name}</option>

                            )
                        })}
                        </select>
                    </div>
                    <Dialog.Title as="h3" className="text-base leading-6 text-gray-900 flex flex-row items-center justify-around m-4 ">
                    {selectForSend.map((item) =>{
                        return(
                            <button className="bg-red-600 text-white font-semibold px-4 py-2 rounded-full cursor-pointer" key={item.id} onClick={()=>handleExclusion(item)}>
                                {item.name}
                            </button>
                  )
                })}
                </Dialog.Title>
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
                  onClick={handleClose} // Use a função de fechamento aqui
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
