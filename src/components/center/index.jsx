import { useEffect, useState } from "react";
import Line from "../line"
import Solicitation from "../solicitation";
import Api from "../../api/service";
import Example from "../dropdown";
import Schudeles from "../schudeles";

export function Center({ user }) {
  const [showSolicitation, setShowSolicitation] = useState(false);
  const [copy, setCopy] = useState('Copiar')
  const [dataLine, setDataLine] = useState([])

  const [showSchudele, setShowSchudele] = useState(false)

  function handleSolicitation() {
    getAllDatas()
    setShowSolicitation(!showSolicitation);
  }

  async function copyHash() {
    const copiar = user.loginHash
    try {
      await navigator.clipboard.writeText(copiar);
      setCopy('Copiado')
    } catch (error) {
      console.error('Erro ao copiar texto para a área de transferência:', error);
    }
  }

  async function getAllDatas() {
    console.log(user.id);
    try {
      const { data } = await Api.get('/cleaning', {
        params: { userId: user.id }
      });
      setDataLine(data);
    } catch (error) {
    }
  }

  async function handleShowSchudele() {
    setShowSchudele(!showSchudele)
  }

  useEffect(() => {
    getAllDatas()
  }, [])

  return (
    <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
      {showSolicitation && <Solicitation onClose={handleSolicitation} showModal={showSolicitation} datas={user} />}
      <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
        <div className="flex w-full items-center">
          <div className="flex items-center text-3xl text-gray-900 dark:text-white">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-12 mr-4 rounded-full" alt="profile" />
            {user && user.name}
          </div>
          <div className="ml-auto sm:flex hidden items-center justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-400 dark:text-gray-400">Chave de acesso</div>
              <div className="text-gray-900 text-lg dark:text-white">{user && user.loginHash}</div>
            </div>
            <button onClick={copyHash} className="w-12 h-12 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <span>{copy}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 ">
          <a href="#" className="px-3 border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white pb-1.5">Histórico</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 line-through">

          </a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Cronograma</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Notificações</a>
          <a href="#" onClick={handleSolicitation} className="px-3 border-b-2 border-transparent text-white  pb-1.5 sm:block hidden bg-blue-500 rounded-md shadow py-2 m-4 ">Nova solicitação</a>
          <a href="#" onClick={handleShowSchudele} className="px-3 border-b-2 border-transparent text-white  pb-1.5 sm:block hidden bg-blue-500 rounded-md shadow py-2 m-4 ">Agenda</a>
          {showSchudele && <Schudeles onClose={handleShowSchudele} datas={user} showModal={showSchudele} />}

        </div>
      </div>
      <div className="sm:p-7 p-4">
        <div className="flex w-full items-center mb-7">
          <div className="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">
            {user && user.active ? (
              <span className="inline-flex mr-2 bg-green-300 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Ativo</span>

            ) : (
              <span className="inline-flex mr-2 bg-orange-300 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Inativo</span>

            )}
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Início</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Ambiente</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">Status</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">Evidencias</th>
              <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 sm:text-gray-400 text-white">Atualização</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-100">
            {dataLine && dataLine.map((clear) => {
              return (
                <Line clean={clear} key={clear.id} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}