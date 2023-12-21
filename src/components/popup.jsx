import React from "react";
import { useState } from "react";
import Api from "../api/service";
import Swal from 'sweetalert2'


export default function Modal({ closeModal, id, route, companyId }) {
    const [name, setName] = useState('');
    const [active, setActive] = useState(false)

    async function edit() {
        if (name == '' && active == false) {
            return
        }
        if (active) {
            const confirm = await Swal.fire({
                icon: 'question',
                title: 'Deseja deletar esse usuário?',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            if (!confirm.isConfirmed) return
        }
        try {
            const body = {
                id: id[0],
                name,
            }
            if (active) body['deletedAt'] = new Date()
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
            await Api.post(`${route}/update`, body)
            await Swal.fire({
                icon: 'success',
                title: 'Alteração bem sucedida',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao executar alteração',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
    }

    return (
        <div className="bg-gray-900 w-full flex items-center flex-col ">
            <form className="w-full max-w-lg m-8">
                <div className="flex flex-wrap -mx-3 mb-6 ">
                    <div className="w-full px-3 mt-4">
                        <label className="block uppercase tracking-wide text-white text-lg  mb-2" >
                            Nome
                        </label>
                        <input onChange={(i) => setName(i.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text" />
                        <p className="text-gray-600 text-xs italic">Só será realizado as alterações caso campo preenchido</p>
                    </div>
                    {route == 'user' ? (
                        <>
                            <label htmlFor="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleciona o status</label>
                            <select id="countries" onChange={(i) => setActive(i.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>Deletar usuário?</option>
                                <option value={true}>DELETAR</option>
                            </select>

                        </>

                    ) : null}
                </div>
                <div className="flex items-center justify-between">
                    <button type="button" onClick={edit} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 my-7">Alterar</button>
                    <button type="button" onClick={closeModal} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-500 dark:focus:ring-red-800 my-7">Fechar</button>
                </div>
            </form>
        </div>
    )
}