import { useEffect, useState } from "react";
import Line from "../line"
import Solicitation from "../solicitation";
import Api from "../../api/service";
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
    try {
      const { data } = await Api.get('/cleaning/recover', {
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
  }, [user])



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
        <div className="flex items-center space-x-3 my-4">

          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-blue-900  rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              Histórico
            </button>
            <button onClick={handleSolicitation} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent  border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              Agendar
            </button>
            <button onClick={handleShowSchudele} type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-b border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              Agendamentos
            </button>
          </div>

          {showSchudele && <Schudeles onClose={handleShowSchudele} datas={user} showModal={showSchudele} />}

        </div>
      </div>
      <div className="sm:p-7 p-4">
        <div className="flex w-full items-center mb-7">
          <div className="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">
            {user && user.active ? (
              <span className="text-white inline-flex mr-2 bg-green-900 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Ativo</span>

            ) : (
              <span className="text-white inline-flex mr-2 bg-orange-900 p-8 items-center h-8 w-8 justify-center text-black-600 rounded-md shadow border border-gray-200 dark:border-gray-800 leading-none py-0">Inativo</span>

            )}
          </div>
        </div>
        {dataLine.length == 0 ? (
          <div className="text-lg text-center text-white justify-center tracking-wider w-full h-10 bg-red-600"> - Usuários Sem histórico - </div>
        ) : null}
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