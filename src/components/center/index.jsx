import { useEffect, useState } from "react";
import Line from "../line"
import Solicitation from "../solicitation";
import Api from "../../api/service";
import Example from "../dropdown";

export function Center({ user }) {
  const [showSolicitation, setShowSolicitation] = useState(false);
  const [allDatas, setAllDatas] = useState(null)
  const [copy, setCopy] = useState('Copiar')
  const [loading, setLoading] = useState(false)

  function handleSolicitation() {
    setShowSolicitation(!showSolicitation);
  }

  async function copyHash() {
    const copiar = allDatas.loginHash
    try {
      await navigator.clipboard.writeText(copiar);
      setCopy('Copiado')
    } catch (error) {
      console.error('Erro ao copiar texto para a área de transferência:', error);
    }
  }

  async function getDatas() {
    setLoading(true)
    try {
      const { data } = await Api.get('manager/users', { params: { id: user.managerId } })
      setLoading(false)
      const filter = data.users.find((item) => user.id == item.id)

      setAllDatas(filter)
    } catch (error) {
      window.alert('erro')
    }
  }

  useEffect(() => { setAllDatas(user) }, [])
  useEffect(() => { getDatas() }, [user])

  return (
    <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">

      {loading ? (
        <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
          <p>Carregando...</p>
        </div>
      ) : null}
      {showSolicitation && <Solicitation onClose={handleSolicitation} showModal={showSolicitation} datas={allDatas} />}
      <div className="sm:px-7 sm:pt-7 px-4 pt-4 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
        <div className="flex w-full items-center">
          <div className="flex items-center text-3xl text-gray-900 dark:text-white">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" className="w-12 mr-4 rounded-full" alt="profile" />
            {allDatas && allDatas.name}
          </div>
          <div className="ml-auto sm:flex hidden items-center justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-400 dark:text-gray-400">Chave de acesso</div>
              <div className="text-gray-900 text-lg dark:text-white">{allDatas && allDatas.loginHash}</div>
            </div>
            <button onClick={copyHash} className="w-12 h-12 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <span>{copy}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3 ">
          <a href="#" className="px-3 border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white pb-1.5">Histórico</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 line-through">
          <Example userId={user}/>

          </a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Cronograma</a>
          <a href="#" className="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden line-through">Notificações</a>
          <a href="#" onClick={handleSolicitation} className="px-3 border-b-2 border-transparent text-white  pb-1.5 sm:block hidden bg-blue-500 rounded-md shadow py-2 m-4 ">Nova solicitação</a>
        </div>
      </div>
      <div className="sm:p-7 p-4">
        <div className="flex w-full items-center mb-7">
          <div className="ml-auto text-gray-500 text-xs sm:inline-flex hidden items-center">
            {allDatas && allDatas.active ? (
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
            {allDatas && allDatas.Cleaning.map((clear) => {
              return (
                <Line clean={clear} key={clear.id} managerId={allDatas.managerId} reload={getDatas} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}