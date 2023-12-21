import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Api from '../../api/service';
import Swal from 'sweetalert2'
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export default function Perfil({ showModal, onClose, admin }) {
    const [name, setName] = useState(null)
    const [newPass, setNewPass] = useState(null)
    const [newEmail, setNewEmail] = useState(null)
    const [codigo, setCodigo] = useState(null)
    const [passwordEye, setPasswordEye] = useState(false)

    const hadlePasswordEye = () => {
        setPasswordEye(!passwordEye)
    }

    async function handleReceivePassword() {
        const confirm = await Swal.fire({
            icon: 'info',
            title: 'Deseja receber o código de recuperação em seu email?',
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
        if (!confirm.isConfirmed) return
        try {
            await Api.post('email/receiver', {
                email: admin.email
            })
            await Swal.fire({
                icon: 'success',
                title: 'Código de recuperação enviado ao email cadastrado',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        } catch {
            await Swal.fire({
                icon: 'error',
                title: 'Não foi possível enviar código de alteração',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }

    }



    async function handleSendDatas() {



        const send = {
            id: admin.id,
            codigo,
            firstAcess: false,
        }


        if (name != '' && name) {
            send['name'] = name
        }
        if (newEmail != '' && newEmail) {
            send['email'] = newEmail
        }
        if (newPass != '' && newPass) {
            send['password'] = newPass

        }
        if (!send.name && !send.email && !send.password) {
            await Swal.fire({
                icon: 'info',
                title: 'Preencha o campo de alteração',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            return
        }
        const confirm = await Swal.fire({
            icon: 'info',
            title: 'Confirmar alteração?',
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
        if (!confirm.isConfirmed) return

        try {

            await Api.post('manager/edit', send)
            await Swal.fire({
                icon: 'success',
                title: 'Relogue para ativar as alterações',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })

        } catch {
            await Swal.fire({
                icon: 'error',
                title: 'Não foi possível concluir alteração',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }

    }

    async function cleanCode() {
        await Swal.fire({
            icon: 'error',
            title: "Campo de Cógico de recuperação vazio",
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl m-4 transition-all sm:my-8 sm:w-max min-w-max ">
                                <div className="bg-indigo-900 text-center py-4 lg:px-4">
                                    <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                                        <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Editar Perfil</span>
                                        <span className="font-semibold mr-2 text-left flex-auto"></span>
                                        <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                                    </div>
                                </div>
                                <form class="w-full max-w-lg m-8">
                                    <div class="flex flex-wrap -mx-3 ">
                                        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                                Nome
                                            </label>
                                            <input onChange={(i) => setName(i.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" />
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap -mx-3 mb-6 ">
                                        <div class="w-full md:w-1/2 px-3 mb-4">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                                                Email:
                                            </label>
                                            <input onChange={(i) => setNewEmail(i.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="email" />
                                        </div>
                                        <div class="w-full px-3 relative">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                                Senha
                                            </label>
                                            <input type={(passwordEye === false && newPass != '' && newPass) ? 'password' : 'text'} onChange={(i) => setNewPass(i.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" />
                                            <div className='text-2xl absolute top-9 right-7'>
                                                {
                                                    (passwordEye === false) ? <AiFillEyeInvisible onClick={hadlePasswordEye} /> :
                                                        <AiFillEye onClick={hadlePasswordEye} />
                                                }
                                            </div>
                                        </div>
                                        <div class="w-full px-3 mt-4">
                                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                                Código de recuperação
                                            </label>
                                            <input onChange={(i) => setCodigo(i.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" />
                                            <p class="text-gray-600 text-xs italic">Só será realizado as alterações caso campo preenchido</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <button class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" type='button' onClick={handleReceivePassword}>
                                            Receber Código
                                        </button>
                                        {codigo ? (
                                            <button onClick={handleSendDatas} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                                Enviar
                                            </button>

                                        ) : (
                                            <button onClick={cleanCode} class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                                                Enviar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}