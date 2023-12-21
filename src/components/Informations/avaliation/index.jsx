import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2'
import Select from 'react-select'
import Api from '../../../api/service';

export default function Avaliation({ showModal, onClose, companyId, idCompany}) {
    const adminObj = JSON.parse(localStorage.getItem('manager'))
    const [avaliate, setAvaliate] = useState({})
    const [epis, setEpis] = useState([])
    const [allEpis, setAllEpis] = useState([])

    const avaliations = [
        { value: 'RUIM', label: 'Ruim' },
        { value: 'BOM', label: 'Bom' },
        { value: 'PERFEITO', label: 'Perfeito' }
    ]


    async function retriveDatas() {

        try {
            const { data } = await Api.get('/epis/recover', { params: { companyId: idCompany} })
            const optionsEquipaments = data.map((item) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setAllEpis(optionsEquipaments)
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao recuperar Epis",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
    }

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
        if (!confirm.isConfirmed) return
        if (avaliate == '') {
            await Swal.fire({
                icon: 'info',
                title: "Informe o status da avaliação",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        const send = {
            scheduleId: companyId.id,
            status: avaliate.value,
            managerId: adminObj.id,
            episId: epis.map((item) => item.value)

        }
        try {
            await Api.post('avaliation/create', send)
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao salvar avaliação",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
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
                                            <p className="text-gray-600 text-xs italic">Selecione somente o que notou faltar</p>
                                            <Select
                                                isMulti
                                                name="EPIs"
                                                options={allEpis}
                                                className="basic-multi-select"
                                                classNamePrefix="EPIs"
                                                onChange={(item) => setEpis(item)}
                                            />
                                        </div>

                                        <div className='mb-4'>
                                            <p className="text-gray-600 text-xs italic">Avalie a limpeza</p>
                                            <Select
                                                name="Avaliation"
                                                options={avaliations}
                                                className="basic-multi-select"
                                                classNamePrefix="Avaliation"
                                                onChange={(i) => setAvaliate(i)}
                                            />
                                        </div>


                                    </div>
                                    <button type="button" onClick={handleSend} className="align-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Enviar</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}