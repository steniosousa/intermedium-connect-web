import React from "react";
import { useState } from "react";
import Api from "../api/service";
import Swal from 'sweetalert2'


export default function Modal({ closeModal, userId }) {
    const [value, setValue] = useState('');





   async function editValue() {
        try{
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'Confirmar alteração?',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            if(confirm.isDenied) return
            await Api.post('user/update', {
                params: {userId:userId[0]},
                body: {active: value == 'active' ? true : false}
            })
        }
        catch(error){
            console.log(error)
        }
    }
    return (
        <div className="bg-gray-900 fixed z-30 top-0 right-0 bottom-0 left-0 flex items-center flex-col " onClick={(e) => {
            if (e.target.type === "submit")
                closeModal();
        }}>
            <form>
                <label for="countries" class="block mb-2 my-3 text-sm font-medium text-gray-900 dark:text-white">Selecione uma Opção</label>
                <select id="countries" onChange={(e) => setValue(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg my-2 focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option hidden value="Selecione uma opção">Selecione uma opção</option>
                    <option value="active">Ativo</option>
                    <option value="disabled">Inativo</option>
                </select>

                <button type="submit" onClick={editValue} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 my-7">Alterar</button>
            </form>
        </div>
    )
}