import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2'
import Select from 'react-select'

export default function Avaliation({ showModal, onClose }) {
    const [avaliate, setAvaliate] = useState('')
    const [epis, setEpis] = useState([])

    const avaliations = [
        { value: 'Ruim', label: 'Ruim' },
        { value: 'Bom', label: 'Bom' },
        { value: 'Ótimo', label: 'Ótimo' }
    ]
    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    

    async function handleSend() {
        const confirm = await Swal.fire({
            icon: 'info',
            title: "Deseja avaliar essa limpeza?",
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
        if (confirm.isDenied) return
        if (avaliate == '') {
            await Swal.fire({
                icon: 'info',
                title: "Informe a avaliação",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
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
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
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
                            <Dialog.Panel className="relative transform overflow-hidden m-4 rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-max min-w-max ">
                                <div className="bg-indigo-900 text-center py-4 lg:px-4">
                                    <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                                        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold ">Avaliação</span>
                                    </div>
                                </div>
                                <div className=" m-8 flex flex-col">
                                    <div className='p-8'>

                                        <div className='mb-4'>
                                            <p class="text-gray-600 text-xs italic">Selecione somente o que notou faltar</p>
                                            <Select
                                                isMulti
                                                name="EPIs"
                                                options={options}
                                                className="basic-multi-select"
                                                classNamePrefix="EPIs"
                                                onChange={(item) => setEpis((oldState) => [...oldState, item])}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <p class="text-gray-600 text-xs italic">Avalie a limpeza</p>
                                            <Select
                                                name="Avaliation"
                                                options={avaliations}
                                                className="basic-multi-select"
                                                classNamePrefix="Avaliation"
                                                onChange={(i) => setAvaliate(i)}
                                            />
                                        </div>


                                    </div>
                                    <button type="button" onClick={handleSend} class="align-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Enviar</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}